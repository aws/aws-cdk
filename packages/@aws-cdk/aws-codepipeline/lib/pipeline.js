"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pipeline = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const notifications = require("@aws-cdk/aws-codestarnotifications");
const events = require("@aws-cdk/aws-events");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const s3 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const action_1 = require("./action");
const codepipeline_generated_1 = require("./codepipeline.generated");
const cross_region_support_stack_1 = require("./private/cross-region-support-stack");
const full_action_descriptor_1 = require("./private/full-action-descriptor");
const rich_action_1 = require("./private/rich-action");
const stage_1 = require("./private/stage");
const validation_1 = require("./private/validation");
class PipelineBase extends core_1.Resource {
    /**
     * Defines an event rule triggered by this CodePipeline.
     *
     * @param id Identifier for this event handler.
     * @param options Additional options to pass to the event rule.
     */
    onEvent(id, options = {}) {
        const rule = new events.Rule(this, id, options);
        rule.addTarget(options.target);
        rule.addEventPattern({
            source: ['aws.codepipeline'],
            resources: [this.pipelineArn],
        });
        return rule;
    }
    /**
     * Defines an event rule triggered by the "CodePipeline Pipeline Execution
     * State Change" event emitted from this pipeline.
     *
     * @param id Identifier for this event handler.
     * @param options Additional options to pass to the event rule.
     */
    onStateChange(id, options = {}) {
        const rule = this.onEvent(id, options);
        rule.addEventPattern({
            detailType: ['CodePipeline Pipeline Execution State Change'],
        });
        return rule;
    }
    bindAsNotificationRuleSource(_scope) {
        return {
            sourceArn: this.pipelineArn,
        };
    }
    notifyOn(id, target, options) {
        return new notifications.NotificationRule(this, id, {
            ...options,
            source: this,
            targets: [target],
        });
    }
    notifyOnExecutionStateChange(id, target, options) {
        return this.notifyOn(id, target, {
            ...options,
            events: [
                action_1.PipelineNotificationEvents.PIPELINE_EXECUTION_FAILED,
                action_1.PipelineNotificationEvents.PIPELINE_EXECUTION_CANCELED,
                action_1.PipelineNotificationEvents.PIPELINE_EXECUTION_STARTED,
                action_1.PipelineNotificationEvents.PIPELINE_EXECUTION_RESUMED,
                action_1.PipelineNotificationEvents.PIPELINE_EXECUTION_SUCCEEDED,
                action_1.PipelineNotificationEvents.PIPELINE_EXECUTION_SUPERSEDED,
            ],
        });
    }
    notifyOnAnyStageStateChange(id, target, options) {
        return this.notifyOn(id, target, {
            ...options,
            events: [
                action_1.PipelineNotificationEvents.STAGE_EXECUTION_CANCELED,
                action_1.PipelineNotificationEvents.STAGE_EXECUTION_FAILED,
                action_1.PipelineNotificationEvents.STAGE_EXECUTION_RESUMED,
                action_1.PipelineNotificationEvents.STAGE_EXECUTION_STARTED,
                action_1.PipelineNotificationEvents.STAGE_EXECUTION_SUCCEEDED,
            ],
        });
    }
    notifyOnAnyActionStateChange(id, target, options) {
        return this.notifyOn(id, target, {
            ...options,
            events: [
                action_1.PipelineNotificationEvents.ACTION_EXECUTION_CANCELED,
                action_1.PipelineNotificationEvents.ACTION_EXECUTION_FAILED,
                action_1.PipelineNotificationEvents.ACTION_EXECUTION_STARTED,
                action_1.PipelineNotificationEvents.ACTION_EXECUTION_SUCCEEDED,
            ],
        });
    }
    notifyOnAnyManualApprovalStateChange(id, target, options) {
        return this.notifyOn(id, target, {
            ...options,
            events: [
                action_1.PipelineNotificationEvents.MANUAL_APPROVAL_FAILED,
                action_1.PipelineNotificationEvents.MANUAL_APPROVAL_NEEDED,
                action_1.PipelineNotificationEvents.MANUAL_APPROVAL_SUCCEEDED,
            ],
        });
    }
}
/**
 * An AWS CodePipeline pipeline with its associated IAM role and S3 bucket.
 *
 * @example
 * // create a pipeline
 * import * as codecommit from '@aws-cdk/aws-codecommit';
 *
 * const pipeline = new codepipeline.Pipeline(this, 'Pipeline');
 *
 * // add a stage
 * const sourceStage = pipeline.addStage({ stageName: 'Source' });
 *
 * // add a source action to the stage
 * declare const repo: codecommit.Repository;
 * declare const sourceArtifact: codepipeline.Artifact;
 * sourceStage.addAction(new codepipeline_actions.CodeCommitSourceAction({
 *   actionName: 'Source',
 *   output: sourceArtifact,
 *   repository: repo,
 * }));
 *
 * // ... add more stages
 */
class Pipeline extends PipelineBase {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.pipelineName,
        });
        this._stages = new Array();
        this._crossRegionSupport = {};
        this._crossAccountSupport = {};
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_PipelineProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Pipeline);
            }
            throw error;
        }
        validation_1.validateName('Pipeline', this.physicalName);
        // only one of artifactBucket and crossRegionReplicationBuckets can be supplied
        if (props.artifactBucket && props.crossRegionReplicationBuckets) {
            throw new Error('Only one of artifactBucket and crossRegionReplicationBuckets can be specified!');
        }
        // @deprecated(v2): switch to default false
        this.crossAccountKeys = props.crossAccountKeys ?? true;
        this.enableKeyRotation = props.enableKeyRotation;
        // Cross account keys must be set for key rotation to be enabled
        if (this.enableKeyRotation && !this.crossAccountKeys) {
            throw new Error("Setting 'enableKeyRotation' to true also requires 'crossAccountKeys' to be enabled");
        }
        this.reuseCrossRegionSupportStacks = props.reuseCrossRegionSupportStacks ?? true;
        // If a bucket has been provided, use it - otherwise, create a bucket.
        let propsBucket = this.getArtifactBucketFromProps(props);
        if (!propsBucket) {
            let encryptionKey;
            if (this.crossAccountKeys) {
                encryptionKey = new kms.Key(this, 'ArtifactsBucketEncryptionKey', {
                    // remove the key - there is a grace period of a few days before it's gone for good,
                    // that should be enough for any emergency access to the bucket artifacts
                    removalPolicy: core_1.RemovalPolicy.DESTROY,
                    enableKeyRotation: this.enableKeyRotation,
                });
                // add an alias to make finding the key in the console easier
                new kms.Alias(this, 'ArtifactsBucketEncryptionKeyAlias', {
                    aliasName: this.generateNameForDefaultBucketKeyAlias(),
                    targetKey: encryptionKey,
                    removalPolicy: core_1.RemovalPolicy.DESTROY,
                });
            }
            propsBucket = new s3.Bucket(this, 'ArtifactsBucket', {
                bucketName: core_1.PhysicalName.GENERATE_IF_NEEDED,
                encryptionKey,
                encryption: encryptionKey ? s3.BucketEncryption.KMS : s3.BucketEncryption.KMS_MANAGED,
                enforceSSL: true,
                blockPublicAccess: new s3.BlockPublicAccess(s3.BlockPublicAccess.BLOCK_ALL),
                removalPolicy: core_1.RemovalPolicy.RETAIN,
            });
        }
        this.artifactBucket = propsBucket;
        // If a role has been provided, use it - otherwise, create a role.
        this.role = props.role || new iam.Role(this, 'Role', {
            assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
        });
        this.codePipeline = new codepipeline_generated_1.CfnPipeline(this, 'Resource', {
            artifactStore: core_1.Lazy.any({ produce: () => this.renderArtifactStoreProperty() }),
            artifactStores: core_1.Lazy.any({ produce: () => this.renderArtifactStoresProperty() }),
            stages: core_1.Lazy.any({ produce: () => this.renderStages() }),
            disableInboundStageTransitions: core_1.Lazy.any({ produce: () => this.renderDisabledTransitions() }, { omitEmptyArray: true }),
            roleArn: this.role.roleArn,
            restartExecutionOnUpdate: props && props.restartExecutionOnUpdate,
            name: this.physicalName,
        });
        // this will produce a DependsOn for both the role and the policy resources.
        this.codePipeline.node.addDependency(this.role);
        this.artifactBucket.grantReadWrite(this.role);
        this.pipelineName = this.getResourceNameAttribute(this.codePipeline.ref);
        this.pipelineVersion = this.codePipeline.attrVersion;
        this.crossRegionBucketsPassed = !!props.crossRegionReplicationBuckets;
        for (const [region, replicationBucket] of Object.entries(props.crossRegionReplicationBuckets || {})) {
            this._crossRegionSupport[region] = {
                replicationBucket,
                stack: core_1.Stack.of(replicationBucket),
            };
        }
        // Does not expose a Fn::GetAtt for the ARN so we'll have to make it ourselves
        this.pipelineArn = core_1.Stack.of(this).formatArn({
            service: 'codepipeline',
            resource: this.pipelineName,
        });
        for (const stage of props.stages || []) {
            this.addStage(stage);
        }
        this.node.addValidation({ validate: () => this.validatePipeline() });
    }
    /**
     * Import a pipeline into this app.
     *
     * @param scope the scope into which to import this pipeline
     * @param id the logical ID of the returned pipeline construct
     * @param pipelineArn The ARN of the pipeline (e.g. `arn:aws:codepipeline:us-east-1:123456789012:MyDemoPipeline`)
     */
    static fromPipelineArn(scope, id, pipelineArn) {
        class Import extends PipelineBase {
            constructor() {
                super(...arguments);
                this.pipelineName = core_1.Stack.of(scope).splitArn(pipelineArn, core_1.ArnFormat.SLASH_RESOURCE_NAME).resource;
                this.pipelineArn = pipelineArn;
            }
        }
        return new Import(scope, id);
    }
    /**
     * Creates a new Stage, and adds it to this Pipeline.
     *
     * @param props the creation properties of the new Stage
     * @returns the newly created Stage
     */
    addStage(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_StageOptions(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addStage);
            }
            throw error;
        }
        // check for duplicate Stages and names
        if (this._stages.find(s => s.stageName === props.stageName)) {
            throw new Error(`Stage with duplicate name '${props.stageName}' added to the Pipeline`);
        }
        const stage = new stage_1.Stage(props, this);
        const index = props.placement
            ? this.calculateInsertIndexFromPlacement(props.placement)
            : this.stageCount;
        this._stages.splice(index, 0, stage);
        return stage;
    }
    /**
     * Adds a statement to the pipeline role.
     */
    addToRolePolicy(statement) {
        this.role.addToPrincipalPolicy(statement);
    }
    /**
     * Get the number of Stages in this Pipeline.
     */
    get stageCount() {
        return this._stages.length;
    }
    /**
     * Returns the stages that comprise the pipeline.
     *
     * **Note**: the returned array is a defensive copy,
     * so adding elements to it has no effect.
     * Instead, use the `addStage` method if you want to add more stages
     * to the pipeline.
     */
    get stages() {
        return this._stages.slice();
    }
    /**
     * Access one of the pipeline's stages by stage name
     */
    stage(stageName) {
        for (const stage of this._stages) {
            if (stage.stageName === stageName) {
                return stage;
            }
        }
        throw new Error(`Pipeline does not contain a stage named '${stageName}'. Available stages: ${this._stages.map(s => s.stageName).join(', ')}`);
    }
    /**
     * Returns all of the `CrossRegionSupportStack`s that were generated automatically
     * when dealing with Actions that reside in a different region than the Pipeline itself.
     *
     */
    get crossRegionSupport() {
        const ret = {};
        Object.keys(this._crossRegionSupport).forEach((key) => {
            ret[key] = this._crossRegionSupport[key];
        });
        return ret;
    }
    /** @internal */
    _attachActionToPipeline(stage, action, actionScope) {
        const richAction = new rich_action_1.RichAction(action, this);
        // handle cross-region actions here
        const crossRegionInfo = this.ensureReplicationResourcesExistFor(richAction);
        // get the role for the given action, handling if it's cross-account
        const actionRole = this.getRoleForAction(stage, richAction, actionScope);
        // // CodePipeline Variables
        validation_1.validateNamespaceName(richAction.actionProperties.variablesNamespace);
        // bind the Action (type h4x)
        const actionConfig = richAction.bind(actionScope, stage, {
            role: actionRole ? actionRole : this.role,
            bucket: crossRegionInfo.artifactBucket,
        });
        return new full_action_descriptor_1.FullActionDescriptor({
            // must be 'action', not 'richAction',
            // as those are returned by the IStage.actions property,
            // and it's important customers of Pipeline get the same instance
            // back as they added to the pipeline
            action,
            actionConfig,
            actionRole,
            actionRegion: crossRegionInfo.region,
        });
    }
    /**
     * Validate the pipeline structure
     *
     * Validation happens according to the rules documented at
     *
     * https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#pipeline-requirements
     */
    validatePipeline() {
        return [
            ...this.validateSourceActionLocations(),
            ...this.validateHasStages(),
            ...this.validateStages(),
            ...this.validateArtifacts(),
        ];
    }
    ensureReplicationResourcesExistFor(action) {
        if (!action.isCrossRegion) {
            return {
                artifactBucket: this.artifactBucket,
            };
        }
        // The action has a specific region,
        // require the pipeline to have a known region as well.
        this.requireRegion();
        // source actions have to be in the same region as the pipeline
        if (action.actionProperties.category === action_1.ActionCategory.SOURCE) {
            throw new Error(`Source action '${action.actionProperties.actionName}' must be in the same region as the pipeline`);
        }
        // check whether we already have a bucket in that region,
        // either passed from the outside or previously created
        const crossRegionSupport = this.obtainCrossRegionSupportFor(action);
        // the stack containing the replication bucket must be deployed before the pipeline
        core_1.Stack.of(this).addDependency(crossRegionSupport.stack);
        // The Pipeline role must be able to replicate to that bucket
        crossRegionSupport.replicationBucket.grantReadWrite(this.role);
        return {
            artifactBucket: crossRegionSupport.replicationBucket,
            region: action.effectiveRegion,
        };
    }
    /**
     * Get or create the cross-region support construct for the given action
     */
    obtainCrossRegionSupportFor(action) {
        // this method is never called for non cross-region actions
        const actionRegion = action.effectiveRegion;
        let crossRegionSupport = this._crossRegionSupport[actionRegion];
        if (!crossRegionSupport) {
            // we need to create scaffolding resources for this region
            const otherStack = action.resourceStack;
            crossRegionSupport = this.createSupportResourcesForRegion(otherStack, actionRegion);
            this._crossRegionSupport[actionRegion] = crossRegionSupport;
        }
        return crossRegionSupport;
    }
    createSupportResourcesForRegion(otherStack, actionRegion) {
        // if we have a stack from the resource passed - use that!
        if (otherStack) {
            // check if the stack doesn't have this magic construct already
            const id = `CrossRegionReplicationSupport-d823f1d8-a990-4e5c-be18-4ac698532e65-${actionRegion}`;
            let crossRegionSupportConstruct = otherStack.node.tryFindChild(id);
            if (!crossRegionSupportConstruct) {
                crossRegionSupportConstruct = new cross_region_support_stack_1.CrossRegionSupportConstruct(otherStack, id, {
                    createKmsKey: this.crossAccountKeys,
                    enableKeyRotation: this.enableKeyRotation,
                });
            }
            return {
                replicationBucket: crossRegionSupportConstruct.replicationBucket,
                stack: otherStack,
            };
        }
        // otherwise - create a stack with the resources needed for replication across regions
        const pipelineStack = core_1.Stack.of(this);
        const pipelineAccount = pipelineStack.account;
        if (core_1.Token.isUnresolved(pipelineAccount)) {
            throw new Error("You need to specify an explicit account when using CodePipeline's cross-region support");
        }
        const app = this.supportScope();
        const supportStackId = `cross-region-stack-${this.reuseCrossRegionSupportStacks ? pipelineAccount : pipelineStack.stackName}:${actionRegion}`;
        let supportStack = app.node.tryFindChild(supportStackId);
        if (!supportStack) {
            supportStack = new cross_region_support_stack_1.CrossRegionSupportStack(app, supportStackId, {
                pipelineStackName: pipelineStack.stackName,
                region: actionRegion,
                account: pipelineAccount,
                synthesizer: this.getCrossRegionSupportSynthesizer(),
                createKmsKey: this.crossAccountKeys,
                enableKeyRotation: this.enableKeyRotation,
            });
        }
        return {
            stack: supportStack,
            replicationBucket: supportStack.replicationBucket,
        };
    }
    getCrossRegionSupportSynthesizer() {
        if (this.stack.synthesizer instanceof core_1.DefaultStackSynthesizer) {
            // if we have the new synthesizer,
            // we need a bootstrapless copy of it,
            // because we don't want to require bootstrapping the environment
            // of the pipeline account in this replication region
            return new core_1.BootstraplessSynthesizer({
                deployRoleArn: this.stack.synthesizer.deployRoleArn,
                cloudFormationExecutionRoleArn: this.stack.synthesizer.cloudFormationExecutionRoleArn,
            });
        }
        else {
            // any other synthesizer: just return undefined
            // (ie., use the default based on the context settings)
            return undefined;
        }
    }
    generateNameForDefaultBucketKeyAlias() {
        const prefix = 'alias/codepipeline-';
        const maxAliasLength = 256;
        const maxResourceNameLength = maxAliasLength - prefix.length;
        // Names.uniqueId() may have naming collisions when the IDs of resources are similar
        // and/or when they are too long and sliced. We do not want to update this and
        // automatically change the name of every KMS key already generated so we are putting
        // this under a feature flag.
        const uniqueId = core_1.FeatureFlags.of(this).isEnabled(cxapi.CODEPIPELINE_CROSS_ACCOUNT_KEY_ALIAS_STACK_SAFE_RESOURCE_NAME) ?
            core_1.Names.uniqueResourceName(this, {
                separator: '-',
                maxLength: maxResourceNameLength,
                allowedSpecialCharacters: '/_-',
            }) :
            core_1.Names.uniqueId(this).slice(-maxResourceNameLength);
        return prefix + uniqueId.toLowerCase();
    }
    /**
     * Gets the role used for this action,
     * including handling the case when the action is supposed to be cross-account.
     *
     * @param stage the stage the action belongs to
     * @param action the action to return/create a role for
     * @param actionScope the scope, unique to the action, to create new resources in
     */
    getRoleForAction(stage, action, actionScope) {
        const pipelineStack = core_1.Stack.of(this);
        let actionRole = this.getRoleFromActionPropsOrGenerateIfCrossAccount(stage, action);
        if (!actionRole && this.isAwsOwned(action)) {
            // generate a Role for this specific Action
            actionRole = new iam.Role(actionScope, 'CodePipelineActionRole', {
                assumedBy: new iam.AccountPrincipal(pipelineStack.account),
            });
        }
        // the pipeline role needs assumeRole permissions to the action role
        const grant = actionRole?.grantAssumeRole(this.role);
        grant?.applyBefore(this.codePipeline);
        return actionRole;
    }
    getRoleFromActionPropsOrGenerateIfCrossAccount(stage, action) {
        const pipelineStack = core_1.Stack.of(this);
        // if we have a cross-account action, the pipeline's bucket must have a KMS key
        // (otherwise we can't configure cross-account trust policies)
        if (action.isCrossAccount) {
            const artifactBucket = this.ensureReplicationResourcesExistFor(action).artifactBucket;
            if (!artifactBucket.encryptionKey) {
                throw new Error(`Artifact Bucket must have a KMS Key to add cross-account action '${action.actionProperties.actionName}' ` +
                    `(pipeline account: '${renderEnvDimension(this.env.account)}', action account: '${renderEnvDimension(action.effectiveAccount)}'). ` +
                    'Create Pipeline with \'crossAccountKeys: true\' (or pass an existing Bucket with a key)');
            }
        }
        // if a Role has been passed explicitly, always use it
        // (even if the backing resource is from a different account -
        // this is how the user can override our default support logic)
        if (action.actionProperties.role) {
            if (this.isAwsOwned(action)) {
                // the role has to be deployed before the pipeline
                // (our magical cross-stack dependencies will not work,
                // because the role might be from a different environment),
                // but _only_ if it's a new Role -
                // an imported Role should not add the dependency
                if (action.actionProperties.role instanceof iam.Role) {
                    const roleStack = core_1.Stack.of(action.actionProperties.role);
                    pipelineStack.addDependency(roleStack);
                }
                return action.actionProperties.role;
            }
            else {
                // ...except if the Action is not owned by 'AWS',
                // as that would be rejected by CodePipeline at deploy time
                throw new Error("Specifying a Role is not supported for actions with an owner different than 'AWS' - " +
                    `got '${action.actionProperties.owner}' (Action: '${action.actionProperties.actionName}' in Stage: '${stage.stageName}')`);
            }
        }
        // if we don't have a Role passed,
        // and the action is cross-account,
        // generate a Role in that other account stack
        const otherAccountStack = this.getOtherStackIfActionIsCrossAccount(action);
        if (!otherAccountStack) {
            return undefined;
        }
        // generate a role in the other stack, that the Pipeline will assume for executing this action
        const ret = new iam.Role(otherAccountStack, `${core_1.Names.uniqueId(this)}-${stage.stageName}-${action.actionProperties.actionName}-ActionRole`, {
            assumedBy: new iam.AccountPrincipal(pipelineStack.account),
            roleName: core_1.PhysicalName.GENERATE_IF_NEEDED,
        });
        // the other stack with the role has to be deployed before the pipeline stack
        // (CodePipeline verifies you can assume the action Role on creation)
        pipelineStack.addDependency(otherAccountStack);
        return ret;
    }
    /**
     * Returns the Stack this Action belongs to if this is a cross-account Action.
     * If this Action is not cross-account (i.e., it lives in the same account as the Pipeline),
     * it returns undefined.
     *
     * @param action the Action to return the Stack for
     */
    getOtherStackIfActionIsCrossAccount(action) {
        const targetAccount = action.actionProperties.resource
            ? action.actionProperties.resource.env.account
            : action.actionProperties.account;
        if (targetAccount === undefined) {
            // if the account of the Action is not specified,
            // then it defaults to the same account the pipeline itself is in
            return undefined;
        }
        // check whether the action's account is a static string
        if (core_1.Token.isUnresolved(targetAccount)) {
            if (core_1.Token.isUnresolved(this.env.account)) {
                // the pipeline is also env-agnostic, so that's fine
                return undefined;
            }
            else {
                throw new Error(`The 'account' property must be a concrete value (action: '${action.actionProperties.actionName}')`);
            }
        }
        // At this point, we know that the action's account is a static string.
        // In this case, the pipeline's account must also be a static string.
        if (core_1.Token.isUnresolved(this.env.account)) {
            throw new Error('Pipeline stack which uses cross-environment actions must have an explicitly set account');
        }
        // at this point, we know that both the Pipeline's account,
        // and the action-backing resource's account are static strings
        // if they are identical - nothing to do (the action is not cross-account)
        if (this.env.account === targetAccount) {
            return undefined;
        }
        // at this point, we know that the action is certainly cross-account,
        // so we need to return a Stack in its account to create the helper Role in
        const candidateActionResourceStack = action.actionProperties.resource
            ? core_1.Stack.of(action.actionProperties.resource)
            : undefined;
        if (candidateActionResourceStack?.account === targetAccount) {
            // we always use the "latest" action-backing resource's Stack for this account,
            // even if a different one was used earlier
            this._crossAccountSupport[targetAccount] = candidateActionResourceStack;
            return candidateActionResourceStack;
        }
        let targetAccountStack = this._crossAccountSupport[targetAccount];
        if (!targetAccountStack) {
            const stackId = `cross-account-support-stack-${targetAccount}`;
            const app = this.supportScope();
            targetAccountStack = app.node.tryFindChild(stackId);
            if (!targetAccountStack) {
                const actionRegion = action.actionProperties.resource
                    ? action.actionProperties.resource.env.region
                    : action.actionProperties.region;
                const pipelineStack = core_1.Stack.of(this);
                targetAccountStack = new core_1.Stack(app, stackId, {
                    stackName: `${pipelineStack.stackName}-support-${targetAccount}`,
                    env: {
                        account: targetAccount,
                        region: actionRegion ?? pipelineStack.region,
                    },
                });
            }
            this._crossAccountSupport[targetAccount] = targetAccountStack;
        }
        return targetAccountStack;
    }
    isAwsOwned(action) {
        const owner = action.actionProperties.owner;
        return !owner || owner === 'AWS';
    }
    getArtifactBucketFromProps(props) {
        if (props.artifactBucket) {
            return props.artifactBucket;
        }
        if (props.crossRegionReplicationBuckets) {
            const pipelineRegion = this.requireRegion();
            return props.crossRegionReplicationBuckets[pipelineRegion];
        }
        return undefined;
    }
    calculateInsertIndexFromPlacement(placement) {
        // check if at most one placement property was provided
        const providedPlacementProps = ['rightBefore', 'justAfter', 'atIndex']
            .filter((prop) => placement[prop] !== undefined);
        if (providedPlacementProps.length > 1) {
            throw new Error('Error adding Stage to the Pipeline: ' +
                'you can only provide at most one placement property, but ' +
                `'${providedPlacementProps.join(', ')}' were given`);
        }
        if (placement.rightBefore !== undefined) {
            const targetIndex = this.findStageIndex(placement.rightBefore);
            if (targetIndex === -1) {
                throw new Error('Error adding Stage to the Pipeline: ' +
                    `the requested Stage to add it before, '${placement.rightBefore.stageName}', was not found`);
            }
            return targetIndex;
        }
        if (placement.justAfter !== undefined) {
            const targetIndex = this.findStageIndex(placement.justAfter);
            if (targetIndex === -1) {
                throw new Error('Error adding Stage to the Pipeline: ' +
                    `the requested Stage to add it after, '${placement.justAfter.stageName}', was not found`);
            }
            return targetIndex + 1;
        }
        return this.stageCount;
    }
    findStageIndex(targetStage) {
        return this._stages.findIndex(stage => stage === targetStage);
    }
    validateSourceActionLocations() {
        const errors = new Array();
        let firstStage = true;
        for (const stage of this._stages) {
            const onlySourceActionsPermitted = firstStage;
            for (const action of stage.actionDescriptors) {
                errors.push(...validation_1.validateSourceAction(onlySourceActionsPermitted, action.category, action.actionName, stage.stageName));
            }
            firstStage = false;
        }
        return errors;
    }
    validateHasStages() {
        if (this.stageCount < 2) {
            return ['Pipeline must have at least two stages'];
        }
        return [];
    }
    validateStages() {
        const ret = new Array();
        for (const stage of this._stages) {
            ret.push(...stage.validate());
        }
        return ret;
    }
    validateArtifacts() {
        const ret = new Array();
        const producers = {};
        const firstConsumers = {};
        for (const [stageIndex, stage] of enumerate(this._stages)) {
            // For every output artifact, get the producer
            for (const action of stage.actionDescriptors) {
                const actionLoc = new PipelineLocation(stageIndex, stage, action);
                for (const outputArtifact of action.outputs) {
                    // output Artifacts always have a name set
                    const name = outputArtifact.artifactName;
                    if (producers[name]) {
                        ret.push(`Both Actions '${producers[name].actionName}' and '${action.actionName}' are producting Artifact '${name}'. Every artifact can only be produced once.`);
                        continue;
                    }
                    producers[name] = actionLoc;
                }
                // For every input artifact, get the first consumer
                for (const inputArtifact of action.inputs) {
                    const name = inputArtifact.artifactName;
                    if (!name) {
                        ret.push(`Action '${action.actionName}' is using an unnamed input Artifact, which is not being produced in this pipeline`);
                        continue;
                    }
                    firstConsumers[name] = firstConsumers[name] ? firstConsumers[name].first(actionLoc) : actionLoc;
                }
            }
        }
        // Now validate that every input artifact is produced before it's
        // being consumed.
        for (const [artifactName, consumerLoc] of Object.entries(firstConsumers)) {
            const producerLoc = producers[artifactName];
            if (!producerLoc) {
                ret.push(`Action '${consumerLoc.actionName}' is using input Artifact '${artifactName}', which is not being produced in this pipeline`);
                continue;
            }
            if (consumerLoc.beforeOrEqual(producerLoc)) {
                ret.push(`${consumerLoc} is consuming input Artifact '${artifactName}' before it is being produced at ${producerLoc}`);
            }
        }
        return ret;
    }
    renderArtifactStoresProperty() {
        if (!this.crossRegion) {
            return undefined;
        }
        // add the Pipeline's artifact store
        const primaryRegion = this.requireRegion();
        this._crossRegionSupport[primaryRegion] = {
            replicationBucket: this.artifactBucket,
            stack: core_1.Stack.of(this),
        };
        return Object.entries(this._crossRegionSupport).map(([region, support]) => ({
            region,
            artifactStore: this.renderArtifactStore(support.replicationBucket),
        }));
    }
    renderArtifactStoreProperty() {
        if (this.crossRegion) {
            return undefined;
        }
        return this.renderPrimaryArtifactStore();
    }
    renderPrimaryArtifactStore() {
        return this.renderArtifactStore(this.artifactBucket);
    }
    renderArtifactStore(bucket) {
        let encryptionKey;
        const bucketKey = bucket.encryptionKey;
        if (bucketKey) {
            encryptionKey = {
                type: 'KMS',
                id: bucketKey.keyArn,
            };
        }
        return {
            type: 'S3',
            location: bucket.bucketName,
            encryptionKey,
        };
    }
    get crossRegion() {
        if (this.crossRegionBucketsPassed) {
            return true;
        }
        return this._stages.some(stage => stage.actionDescriptors.some(action => action.region !== undefined));
    }
    renderStages() {
        return this._stages.map(stage => stage.render());
    }
    renderDisabledTransitions() {
        return this._stages
            .filter(stage => !stage.transitionToEnabled)
            .map(stage => ({
            reason: stage.transitionDisabledReason,
            stageName: stage.stageName,
        }));
    }
    requireRegion() {
        const region = this.env.region;
        if (core_1.Token.isUnresolved(region)) {
            throw new Error('Pipeline stack which uses cross-environment actions must have an explicitly set region');
        }
        return region;
    }
    supportScope() {
        const scope = core_1.Stage.of(this);
        if (!scope) {
            throw new Error('Pipeline stack which uses cross-environment actions must be part of a CDK App or Stage');
        }
        return scope;
    }
}
exports.Pipeline = Pipeline;
_a = JSII_RTTI_SYMBOL_1;
Pipeline[_a] = { fqn: "@aws-cdk/aws-codepipeline.Pipeline", version: "0.0.0" };
function enumerate(xs) {
    const ret = new Array();
    for (let i = 0; i < xs.length; i++) {
        ret.push([i, xs[i]]);
    }
    return ret;
}
class PipelineLocation {
    constructor(stageIndex, stage, action) {
        this.stageIndex = stageIndex;
        this.stage = stage;
        this.action = action;
    }
    get stageName() {
        return this.stage.stageName;
    }
    get actionName() {
        return this.action.actionName;
    }
    /**
     * Returns whether a is before or the same order as b
     */
    beforeOrEqual(rhs) {
        if (this.stageIndex !== rhs.stageIndex) {
            return rhs.stageIndex < rhs.stageIndex;
        }
        return this.action.runOrder <= rhs.action.runOrder;
    }
    /**
     * Returns the first location between this and the other one
     */
    first(rhs) {
        return this.beforeOrEqual(rhs) ? this : rhs;
    }
    toString() {
        // runOrders are 1-based, so make the stageIndex also 1-based otherwise it's going to be confusing.
        return `Stage ${this.stageIndex + 1} Action ${this.action.runOrder} ('${this.stageName}'/'${this.actionName}')`;
    }
}
/**
 * Render an env dimension without showing the ugly stringified tokens
 */
function renderEnvDimension(s) {
    return core_1.Token.isUnresolved(s) ? '(current)' : s;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwaXBlbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxvRUFBb0U7QUFDcEUsOENBQThDO0FBQzlDLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsc0NBQXNDO0FBQ3RDLHdDQWN1QjtBQUN2Qix5Q0FBeUM7QUFFekMscUNBQTJIO0FBQzNILHFFQUF1RDtBQUN2RCxxRkFBNEc7QUFDNUcsNkVBQXdFO0FBQ3hFLHVEQUFtRDtBQUNuRCwyQ0FBd0M7QUFDeEMscURBQWlHO0FBOElqRyxNQUFlLFlBQWEsU0FBUSxlQUFRO0lBSTFDOzs7OztPQUtHO0lBQ0ksT0FBTyxDQUFDLEVBQVUsRUFBRSxVQUFpQyxFQUFFO1FBQzVELE1BQU0sSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxlQUFlLENBQUM7WUFDbkIsTUFBTSxFQUFFLENBQUMsa0JBQWtCLENBQUM7WUFDNUIsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztTQUM5QixDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQztLQUNiO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksYUFBYSxDQUFDLEVBQVUsRUFBRSxVQUFpQyxFQUFFO1FBQ2xFLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxlQUFlLENBQUM7WUFDbkIsVUFBVSxFQUFFLENBQUMsOENBQThDLENBQUM7U0FDN0QsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVNLDRCQUE0QixDQUFDLE1BQWlCO1FBQ25ELE9BQU87WUFDTCxTQUFTLEVBQUUsSUFBSSxDQUFDLFdBQVc7U0FDNUIsQ0FBQztLQUNIO0lBRU0sUUFBUSxDQUNiLEVBQVUsRUFDVixNQUE2QyxFQUM3QyxPQUFnQztRQUVoQyxPQUFPLElBQUksYUFBYSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDbEQsR0FBRyxPQUFPO1lBQ1YsTUFBTSxFQUFFLElBQUk7WUFDWixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUM7U0FDbEIsQ0FBQyxDQUFDO0tBQ0o7SUFFTSw0QkFBNEIsQ0FDakMsRUFBVSxFQUNWLE1BQTZDLEVBQzdDLE9BQStDO1FBRS9DLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFO1lBQy9CLEdBQUcsT0FBTztZQUNWLE1BQU0sRUFBRTtnQkFDTixtQ0FBMEIsQ0FBQyx5QkFBeUI7Z0JBQ3BELG1DQUEwQixDQUFDLDJCQUEyQjtnQkFDdEQsbUNBQTBCLENBQUMsMEJBQTBCO2dCQUNyRCxtQ0FBMEIsQ0FBQywwQkFBMEI7Z0JBQ3JELG1DQUEwQixDQUFDLDRCQUE0QjtnQkFDdkQsbUNBQTBCLENBQUMsNkJBQTZCO2FBQ3pEO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7SUFFTSwyQkFBMkIsQ0FDaEMsRUFBVSxFQUNWLE1BQTZDLEVBQzdDLE9BQStDO1FBRS9DLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFO1lBQy9CLEdBQUcsT0FBTztZQUNWLE1BQU0sRUFBRTtnQkFDTixtQ0FBMEIsQ0FBQyx3QkFBd0I7Z0JBQ25ELG1DQUEwQixDQUFDLHNCQUFzQjtnQkFDakQsbUNBQTBCLENBQUMsdUJBQXVCO2dCQUNsRCxtQ0FBMEIsQ0FBQyx1QkFBdUI7Z0JBQ2xELG1DQUEwQixDQUFDLHlCQUF5QjthQUNyRDtTQUNGLENBQUMsQ0FBQztLQUNKO0lBRU0sNEJBQTRCLENBQ2pDLEVBQVUsRUFDVixNQUE2QyxFQUM3QyxPQUErQztRQUUvQyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRTtZQUMvQixHQUFHLE9BQU87WUFDVixNQUFNLEVBQUU7Z0JBQ04sbUNBQTBCLENBQUMseUJBQXlCO2dCQUNwRCxtQ0FBMEIsQ0FBQyx1QkFBdUI7Z0JBQ2xELG1DQUEwQixDQUFDLHdCQUF3QjtnQkFDbkQsbUNBQTBCLENBQUMsMEJBQTBCO2FBQ3REO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7SUFFTSxvQ0FBb0MsQ0FDekMsRUFBVSxFQUNWLE1BQTZDLEVBQzdDLE9BQStDO1FBRS9DLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFO1lBQy9CLEdBQUcsT0FBTztZQUNWLE1BQU0sRUFBRTtnQkFDTixtQ0FBMEIsQ0FBQyxzQkFBc0I7Z0JBQ2pELG1DQUEwQixDQUFDLHNCQUFzQjtnQkFDakQsbUNBQTBCLENBQUMseUJBQXlCO2FBQ3JEO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0JHO0FBQ0gsTUFBYSxRQUFTLFNBQVEsWUFBWTtJQXNEeEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUF1QixFQUFFO1FBQ2pFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO1NBQ2pDLENBQUMsQ0FBQztRQVpZLFlBQU8sR0FBRyxJQUFJLEtBQUssRUFBUyxDQUFDO1FBRTdCLHdCQUFtQixHQUE2QyxFQUFFLENBQUM7UUFDbkUseUJBQW9CLEdBQWlDLEVBQUUsQ0FBQzs7Ozs7OytDQWhEOUQsUUFBUTs7OztRQTJEakIseUJBQVksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRTVDLCtFQUErRTtRQUMvRSxJQUFJLEtBQUssQ0FBQyxjQUFjLElBQUksS0FBSyxDQUFDLDZCQUE2QixFQUFFO1lBQy9ELE1BQU0sSUFBSSxLQUFLLENBQUMsZ0ZBQWdGLENBQUMsQ0FBQztTQUNuRztRQUVELDJDQUEyQztRQUMzQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQztRQUN2RCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDO1FBRWpELGdFQUFnRTtRQUNoRSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUNwRCxNQUFNLElBQUksS0FBSyxDQUFDLG9GQUFvRixDQUFDLENBQUM7U0FDdkc7UUFFRCxJQUFJLENBQUMsNkJBQTZCLEdBQUcsS0FBSyxDQUFDLDZCQUE2QixJQUFJLElBQUksQ0FBQztRQUVqRixzRUFBc0U7UUFDdEUsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXpELElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDaEIsSUFBSSxhQUFhLENBQUM7WUFFbEIsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ3pCLGFBQWEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLDhCQUE4QixFQUFFO29CQUNoRSxvRkFBb0Y7b0JBQ3BGLHlFQUF5RTtvQkFDekUsYUFBYSxFQUFFLG9CQUFhLENBQUMsT0FBTztvQkFDcEMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtpQkFDMUMsQ0FBQyxDQUFDO2dCQUNILDZEQUE2RDtnQkFDN0QsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxtQ0FBbUMsRUFBRTtvQkFDdkQsU0FBUyxFQUFFLElBQUksQ0FBQyxvQ0FBb0MsRUFBRTtvQkFDdEQsU0FBUyxFQUFFLGFBQWE7b0JBQ3hCLGFBQWEsRUFBRSxvQkFBYSxDQUFDLE9BQU87aUJBQ3JDLENBQUMsQ0FBQzthQUNKO1lBRUQsV0FBVyxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7Z0JBQ25ELFVBQVUsRUFBRSxtQkFBWSxDQUFDLGtCQUFrQjtnQkFDM0MsYUFBYTtnQkFDYixVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsV0FBVztnQkFDckYsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLGlCQUFpQixFQUFFLElBQUksRUFBRSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUM7Z0JBQzNFLGFBQWEsRUFBRSxvQkFBYSxDQUFDLE1BQU07YUFDcEMsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLENBQUMsY0FBYyxHQUFHLFdBQVcsQ0FBQztRQUVsQyxrRUFBa0U7UUFDbEUsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQ25ELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyw0QkFBNEIsQ0FBQztTQUNsRSxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksb0NBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3BELGFBQWEsRUFBRSxXQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQywyQkFBMkIsRUFBRSxFQUFFLENBQUM7WUFDOUUsY0FBYyxFQUFFLFdBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLDRCQUE0QixFQUFFLEVBQUUsQ0FBQztZQUNoRixNQUFNLEVBQUUsV0FBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQztZQUN4RCw4QkFBOEIsRUFBRSxXQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLEVBQUUsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFDdkgsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTztZQUMxQix3QkFBd0IsRUFBRSxLQUFLLElBQUksS0FBSyxDQUFDLHdCQUF3QjtZQUNqRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVk7U0FDeEIsQ0FBQyxDQUFDO1FBRUgsNEVBQTRFO1FBQzVFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFaEQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQztRQUNyRCxJQUFJLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQztRQUV0RSxLQUFLLE1BQU0sQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsSUFBSSxFQUFFLENBQUMsRUFBRTtZQUNuRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLEdBQUc7Z0JBQ2pDLGlCQUFpQjtnQkFDakIsS0FBSyxFQUFFLFlBQUssQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUM7YUFDbkMsQ0FBQztTQUNIO1FBRUQsOEVBQThFO1FBQzlFLElBQUksQ0FBQyxXQUFXLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDMUMsT0FBTyxFQUFFLGNBQWM7WUFDdkIsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZO1NBQzVCLENBQUMsQ0FBQztRQUVILEtBQUssTUFBTSxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxFQUFFLEVBQUU7WUFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN0QjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUN0RTtJQXJKRDs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFdBQW1CO1FBQzdFLE1BQU0sTUFBTyxTQUFRLFlBQVk7WUFBakM7O2dCQUNrQixpQkFBWSxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxnQkFBUyxDQUFDLG1CQUFtQixDQUFDLENBQUMsUUFBUSxDQUFDO2dCQUM3RixnQkFBVyxHQUFHLFdBQVcsQ0FBQztZQUM1QyxDQUFDO1NBQUE7UUFFRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5QjtJQXlJRDs7Ozs7T0FLRztJQUNJLFFBQVEsQ0FBQyxLQUFtQjs7Ozs7Ozs7OztRQUNqQyx1Q0FBdUM7UUFDdkMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzNELE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLEtBQUssQ0FBQyxTQUFTLHlCQUF5QixDQUFDLENBQUM7U0FDekY7UUFFRCxNQUFNLEtBQUssR0FBRyxJQUFJLGFBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFckMsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVM7WUFDM0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ3pELENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBRXBCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFckMsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUVEOztPQUVHO0lBQ0ksZUFBZSxDQUFDLFNBQThCO1FBQ25ELElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDM0M7SUFFRDs7T0FFRztJQUNILElBQVcsVUFBVTtRQUNuQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0tBQzVCO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILElBQVcsTUFBTTtRQUNmLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUM3QjtJQUVEOztPQUVHO0lBQ0ksS0FBSyxDQUFDLFNBQWlCO1FBQzVCLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQyxJQUFJLEtBQUssQ0FBQyxTQUFTLEtBQUssU0FBUyxFQUFFO2dCQUNqQyxPQUFPLEtBQUssQ0FBQzthQUNkO1NBQ0Y7UUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLDRDQUE0QyxTQUFTLHdCQUF3QixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQy9JO0lBRUQ7Ozs7T0FJRztJQUNILElBQVcsa0JBQWtCO1FBQzNCLE1BQU0sR0FBRyxHQUE2QyxFQUFFLENBQUM7UUFDekQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNwRCxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxHQUFHLENBQUM7S0FDWjtJQUVELGdCQUFnQjtJQUNULHVCQUF1QixDQUFDLEtBQVksRUFBRSxNQUFlLEVBQUUsV0FBc0I7UUFDbEYsTUFBTSxVQUFVLEdBQUcsSUFBSSx3QkFBVSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVoRCxtQ0FBbUM7UUFDbkMsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTVFLG9FQUFvRTtRQUNwRSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUV6RSw0QkFBNEI7UUFDNUIsa0NBQXFCLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFdEUsNkJBQTZCO1FBQzdCLE1BQU0sWUFBWSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRTtZQUN2RCxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJO1lBQ3pDLE1BQU0sRUFBRSxlQUFlLENBQUMsY0FBYztTQUN2QyxDQUFDLENBQUM7UUFFSCxPQUFPLElBQUksNkNBQW9CLENBQUM7WUFDOUIsc0NBQXNDO1lBQ3RDLHdEQUF3RDtZQUN4RCxpRUFBaUU7WUFDakUscUNBQXFDO1lBQ3JDLE1BQU07WUFDTixZQUFZO1lBQ1osVUFBVTtZQUNWLFlBQVksRUFBRSxlQUFlLENBQUMsTUFBTTtTQUNyQyxDQUFDLENBQUM7S0FDSjtJQUVEOzs7Ozs7T0FNRztJQUNLLGdCQUFnQjtRQUN0QixPQUFPO1lBQ0wsR0FBRyxJQUFJLENBQUMsNkJBQTZCLEVBQUU7WUFDdkMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDM0IsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3hCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1NBQzVCLENBQUM7S0FDSDtJQUVPLGtDQUFrQyxDQUFDLE1BQWtCO1FBQzNELElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO1lBQ3pCLE9BQU87Z0JBQ0wsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjO2FBQ3BDLENBQUM7U0FDSDtRQUVELG9DQUFvQztRQUNwQyx1REFBdUQ7UUFDdkQsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRXJCLCtEQUErRDtRQUMvRCxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEtBQUssdUJBQWMsQ0FBQyxNQUFNLEVBQUU7WUFDOUQsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsOENBQThDLENBQUMsQ0FBQztTQUNySDtRQUVELHlEQUF5RDtRQUN6RCx1REFBdUQ7UUFDdkQsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFcEUsbUZBQW1GO1FBQ25GLFlBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZELDZEQUE2RDtRQUM3RCxrQkFBa0IsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRS9ELE9BQU87WUFDTCxjQUFjLEVBQUUsa0JBQWtCLENBQUMsaUJBQWlCO1lBQ3BELE1BQU0sRUFBRSxNQUFNLENBQUMsZUFBZTtTQUMvQixDQUFDO0tBQ0g7SUFFRDs7T0FFRztJQUNLLDJCQUEyQixDQUFDLE1BQWtCO1FBQ3BELDJEQUEyRDtRQUMzRCxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsZUFBZ0IsQ0FBQztRQUM3QyxJQUFJLGtCQUFrQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDdkIsMERBQTBEO1lBQzFELE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUM7WUFDeEMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLCtCQUErQixDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNwRixJQUFJLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDLEdBQUcsa0JBQWtCLENBQUM7U0FDN0Q7UUFDRCxPQUFPLGtCQUFrQixDQUFDO0tBQzNCO0lBRU8sK0JBQStCLENBQUMsVUFBNkIsRUFBRSxZQUFvQjtRQUN6RiwwREFBMEQ7UUFDMUQsSUFBSSxVQUFVLEVBQUU7WUFDZCwrREFBK0Q7WUFDL0QsTUFBTSxFQUFFLEdBQUcsc0VBQXNFLFlBQVksRUFBRSxDQUFDO1lBQ2hHLElBQUksMkJBQTJCLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFnQyxDQUFDO1lBQ2xHLElBQUksQ0FBQywyQkFBMkIsRUFBRTtnQkFDaEMsMkJBQTJCLEdBQUcsSUFBSSx3REFBMkIsQ0FBQyxVQUFVLEVBQUUsRUFBRSxFQUFFO29CQUM1RSxZQUFZLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtvQkFDbkMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtpQkFDMUMsQ0FBQyxDQUFDO2FBQ0o7WUFFRCxPQUFPO2dCQUNMLGlCQUFpQixFQUFFLDJCQUEyQixDQUFDLGlCQUFpQjtnQkFDaEUsS0FBSyxFQUFFLFVBQVU7YUFDbEIsQ0FBQztTQUNIO1FBRUQsc0ZBQXNGO1FBQ3RGLE1BQU0sYUFBYSxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsTUFBTSxlQUFlLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQztRQUM5QyxJQUFJLFlBQUssQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDdkMsTUFBTSxJQUFJLEtBQUssQ0FBQyx3RkFBd0YsQ0FBQyxDQUFDO1NBQzNHO1FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ2hDLE1BQU0sY0FBYyxHQUFHLHNCQUFzQixJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFNBQVMsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM5SSxJQUFJLFlBQVksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQTRCLENBQUM7UUFDcEYsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixZQUFZLEdBQUcsSUFBSSxvREFBdUIsQ0FBQyxHQUFHLEVBQUUsY0FBYyxFQUFFO2dCQUM5RCxpQkFBaUIsRUFBRSxhQUFhLENBQUMsU0FBUztnQkFDMUMsTUFBTSxFQUFFLFlBQVk7Z0JBQ3BCLE9BQU8sRUFBRSxlQUFlO2dCQUN4QixXQUFXLEVBQUUsSUFBSSxDQUFDLGdDQUFnQyxFQUFFO2dCQUNwRCxZQUFZLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtnQkFDbkMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjthQUMxQyxDQUFDLENBQUM7U0FDSjtRQUVELE9BQU87WUFDTCxLQUFLLEVBQUUsWUFBWTtZQUNuQixpQkFBaUIsRUFBRSxZQUFZLENBQUMsaUJBQWlCO1NBQ2xELENBQUM7S0FDSDtJQUVPLGdDQUFnQztRQUN0QyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxZQUFZLDhCQUF1QixFQUFFO1lBQzdELGtDQUFrQztZQUNsQyxzQ0FBc0M7WUFDdEMsaUVBQWlFO1lBQ2pFLHFEQUFxRDtZQUNyRCxPQUFPLElBQUksK0JBQXdCLENBQUM7Z0JBQ2xDLGFBQWEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxhQUFhO2dCQUNuRCw4QkFBOEIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyw4QkFBOEI7YUFDdEYsQ0FBQyxDQUFDO1NBQ0o7YUFBTTtZQUNMLCtDQUErQztZQUMvQyx1REFBdUQ7WUFDdkQsT0FBTyxTQUFTLENBQUM7U0FDbEI7S0FDRjtJQUVPLG9DQUFvQztRQUMxQyxNQUFNLE1BQU0sR0FBRyxxQkFBcUIsQ0FBQztRQUNyQyxNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUM7UUFDM0IsTUFBTSxxQkFBcUIsR0FBRyxjQUFjLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUM3RCxvRkFBb0Y7UUFDcEYsOEVBQThFO1FBQzlFLHFGQUFxRjtRQUNyRiw2QkFBNkI7UUFDN0IsTUFBTSxRQUFRLEdBQUcsbUJBQVksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyw2REFBNkQsQ0FBQyxDQUFDLENBQUM7WUFDckgsWUFBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRTtnQkFDN0IsU0FBUyxFQUFFLEdBQUc7Z0JBQ2QsU0FBUyxFQUFFLHFCQUFxQjtnQkFDaEMsd0JBQXdCLEVBQUUsS0FBSzthQUNoQyxDQUFDLENBQUMsQ0FBQztZQUNKLFlBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNyRCxPQUFPLE1BQU0sR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7S0FDeEM7SUFFRDs7Ozs7OztPQU9HO0lBQ0ssZ0JBQWdCLENBQUMsS0FBWSxFQUFFLE1BQWtCLEVBQUUsV0FBc0I7UUFDL0UsTUFBTSxhQUFhLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVyQyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsOENBQThDLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXBGLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUMxQywyQ0FBMkM7WUFDM0MsVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsd0JBQXdCLEVBQUU7Z0JBQy9ELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO2FBQzNELENBQUMsQ0FBQztTQUNKO1FBRUQsb0VBQW9FO1FBQ3BFLE1BQU0sS0FBSyxHQUFHLFVBQVUsRUFBRSxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JELEtBQUssRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3RDLE9BQU8sVUFBVSxDQUFDO0tBQ25CO0lBRU8sOENBQThDLENBQUMsS0FBWSxFQUFFLE1BQWtCO1FBQ3JGLE1BQU0sYUFBYSxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFckMsK0VBQStFO1FBQy9FLDhEQUE4RDtRQUM5RCxJQUFJLE1BQU0sQ0FBQyxjQUFjLEVBQUU7WUFDekIsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGNBQWMsQ0FBQztZQUN0RixJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRTtnQkFDakMsTUFBTSxJQUFJLEtBQUssQ0FDYixvRUFBb0UsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsSUFBSTtvQkFDMUcsdUJBQXVCLGtCQUFrQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLHVCQUF1QixrQkFBa0IsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTTtvQkFDbkkseUZBQXlGLENBQzFGLENBQUM7YUFDSDtTQUNGO1FBRUQsc0RBQXNEO1FBQ3RELDhEQUE4RDtRQUM5RCwrREFBK0Q7UUFDL0QsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFO1lBQ2hDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDM0Isa0RBQWtEO2dCQUNsRCx1REFBdUQ7Z0JBQ3ZELDJEQUEyRDtnQkFDM0Qsa0NBQWtDO2dCQUNsQyxpREFBaUQ7Z0JBQ2pELElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksWUFBWSxHQUFHLENBQUMsSUFBSSxFQUFFO29CQUNwRCxNQUFNLFNBQVMsR0FBRyxZQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDekQsYUFBYSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDeEM7Z0JBRUQsT0FBTyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO2FBQ3JDO2lCQUFNO2dCQUNMLGlEQUFpRDtnQkFDakQsMkRBQTJEO2dCQUMzRCxNQUFNLElBQUksS0FBSyxDQUFDLHNGQUFzRjtvQkFDcEcsUUFBUSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxlQUFlLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLGdCQUFnQixLQUFLLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQzthQUM5SDtTQUNGO1FBRUQsa0NBQWtDO1FBQ2xDLG1DQUFtQztRQUNuQyw4Q0FBOEM7UUFDOUMsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsbUNBQW1DLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0UsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQ3RCLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBRUQsOEZBQThGO1FBQzlGLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFDeEMsR0FBRyxZQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsYUFBYSxFQUFFO1lBQzdGLFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO1lBQzFELFFBQVEsRUFBRSxtQkFBWSxDQUFDLGtCQUFrQjtTQUMxQyxDQUFDLENBQUM7UUFDTCw2RUFBNkU7UUFDN0UscUVBQXFFO1FBQ3JFLGFBQWEsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUUvQyxPQUFPLEdBQUcsQ0FBQztLQUNaO0lBRUQ7Ozs7OztPQU1HO0lBQ0ssbUNBQW1DLENBQUMsTUFBZTtRQUN6RCxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUTtZQUNwRCxDQUFDLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTztZQUM5QyxDQUFDLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQztRQUVwQyxJQUFJLGFBQWEsS0FBSyxTQUFTLEVBQUU7WUFDL0IsaURBQWlEO1lBQ2pELGlFQUFpRTtZQUNqRSxPQUFPLFNBQVMsQ0FBQztTQUNsQjtRQUVELHdEQUF3RDtRQUN4RCxJQUFJLFlBQUssQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDckMsSUFBSSxZQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ3hDLG9EQUFvRDtnQkFDcEQsT0FBTyxTQUFTLENBQUM7YUFDbEI7aUJBQU07Z0JBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyw2REFBNkQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUM7YUFDdEg7U0FDRjtRQUVELHVFQUF1RTtRQUN2RSxxRUFBcUU7UUFDckUsSUFBSSxZQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDeEMsTUFBTSxJQUFJLEtBQUssQ0FBQyx5RkFBeUYsQ0FBQyxDQUFDO1NBQzVHO1FBRUQsMkRBQTJEO1FBQzNELCtEQUErRDtRQUUvRCwwRUFBMEU7UUFDMUUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sS0FBSyxhQUFhLEVBQUU7WUFDdEMsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFFRCxxRUFBcUU7UUFDckUsMkVBQTJFO1FBRTNFLE1BQU0sNEJBQTRCLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVE7WUFDbkUsQ0FBQyxDQUFDLFlBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQztZQUM1QyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ2QsSUFBSSw0QkFBNEIsRUFBRSxPQUFPLEtBQUssYUFBYSxFQUFFO1lBQzNELCtFQUErRTtZQUMvRSwyQ0FBMkM7WUFDM0MsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGFBQWEsQ0FBQyxHQUFHLDRCQUE0QixDQUFDO1lBQ3hFLE9BQU8sNEJBQTRCLENBQUM7U0FDckM7UUFFRCxJQUFJLGtCQUFrQixHQUFzQixJQUFJLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDckYsSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQ3ZCLE1BQU0sT0FBTyxHQUFHLCtCQUErQixhQUFhLEVBQUUsQ0FBQztZQUMvRCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDaEMsa0JBQWtCLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFVLENBQUM7WUFDN0QsSUFBSSxDQUFDLGtCQUFrQixFQUFFO2dCQUN2QixNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUTtvQkFDbkQsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU07b0JBQzdDLENBQUMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDO2dCQUNuQyxNQUFNLGFBQWEsR0FBRyxZQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNyQyxrQkFBa0IsR0FBRyxJQUFJLFlBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFO29CQUMzQyxTQUFTLEVBQUUsR0FBRyxhQUFhLENBQUMsU0FBUyxZQUFZLGFBQWEsRUFBRTtvQkFDaEUsR0FBRyxFQUFFO3dCQUNILE9BQU8sRUFBRSxhQUFhO3dCQUN0QixNQUFNLEVBQUUsWUFBWSxJQUFJLGFBQWEsQ0FBQyxNQUFNO3FCQUM3QztpQkFDRixDQUFDLENBQUM7YUFDSjtZQUNELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsR0FBRyxrQkFBa0IsQ0FBQztTQUMvRDtRQUNELE9BQU8sa0JBQWtCLENBQUM7S0FDM0I7SUFFTyxVQUFVLENBQUMsTUFBZTtRQUNoQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDO1FBQzVDLE9BQU8sQ0FBQyxLQUFLLElBQUksS0FBSyxLQUFLLEtBQUssQ0FBQztLQUNsQztJQUVPLDBCQUEwQixDQUFDLEtBQW9CO1FBQ3JELElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRTtZQUN4QixPQUFPLEtBQUssQ0FBQyxjQUFjLENBQUM7U0FDN0I7UUFDRCxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsRUFBRTtZQUN2QyxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDNUMsT0FBTyxLQUFLLENBQUMsNkJBQTZCLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDNUQ7UUFDRCxPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVPLGlDQUFpQyxDQUFDLFNBQXlCO1FBQ2pFLHVEQUF1RDtRQUN2RCxNQUFNLHNCQUFzQixHQUFHLENBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxTQUFTLENBQUM7YUFDbkUsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBRSxTQUFpQixDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDO1FBQzVELElBQUksc0JBQXNCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNyQyxNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQztnQkFDcEQsMkRBQTJEO2dCQUMzRCxJQUFJLHNCQUFzQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDeEQ7UUFFRCxJQUFJLFNBQVMsQ0FBQyxXQUFXLEtBQUssU0FBUyxFQUFFO1lBQ3ZDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQy9ELElBQUksV0FBVyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQztvQkFDcEQsMENBQTBDLFNBQVMsQ0FBQyxXQUFXLENBQUMsU0FBUyxrQkFBa0IsQ0FBQyxDQUFDO2FBQ2hHO1lBQ0QsT0FBTyxXQUFXLENBQUM7U0FDcEI7UUFFRCxJQUFJLFNBQVMsQ0FBQyxTQUFTLEtBQUssU0FBUyxFQUFFO1lBQ3JDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzdELElBQUksV0FBVyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQztvQkFDcEQseUNBQXlDLFNBQVMsQ0FBQyxTQUFTLENBQUMsU0FBUyxrQkFBa0IsQ0FBQyxDQUFDO2FBQzdGO1lBQ0QsT0FBTyxXQUFXLEdBQUcsQ0FBQyxDQUFDO1NBQ3hCO1FBRUQsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0tBQ3hCO0lBRU8sY0FBYyxDQUFDLFdBQW1CO1FBQ3hDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEtBQUssV0FBVyxDQUFDLENBQUM7S0FDL0Q7SUFFTyw2QkFBNkI7UUFDbkMsTUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFLLEVBQVUsQ0FBQztRQUNuQyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdEIsS0FBSyxNQUFNLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hDLE1BQU0sMEJBQTBCLEdBQUcsVUFBVSxDQUFDO1lBQzlDLEtBQUssTUFBTSxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixFQUFFO2dCQUM1QyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsaUNBQW9CLENBQUMsMEJBQTBCLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2FBQ3ZIO1lBQ0QsVUFBVSxHQUFHLEtBQUssQ0FBQztTQUNwQjtRQUNELE9BQU8sTUFBTSxDQUFDO0tBQ2Y7SUFFTyxpQkFBaUI7UUFDdkIsSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRTtZQUN2QixPQUFPLENBQUMsd0NBQXdDLENBQUMsQ0FBQztTQUNuRDtRQUNELE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFFTyxjQUFjO1FBQ3BCLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxFQUFVLENBQUM7UUFDaEMsS0FBSyxNQUFNLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUMvQjtRQUNELE9BQU8sR0FBRyxDQUFDO0tBQ1o7SUFFTyxpQkFBaUI7UUFDdkIsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQVUsQ0FBQztRQUVoQyxNQUFNLFNBQVMsR0FBcUMsRUFBRSxDQUFDO1FBQ3ZELE1BQU0sY0FBYyxHQUFxQyxFQUFFLENBQUM7UUFFNUQsS0FBSyxNQUFNLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDekQsOENBQThDO1lBQzlDLEtBQUssTUFBTSxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixFQUFFO2dCQUM1QyxNQUFNLFNBQVMsR0FBRyxJQUFJLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBRWxFLEtBQUssTUFBTSxjQUFjLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtvQkFDM0MsMENBQTBDO29CQUMxQyxNQUFNLElBQUksR0FBRyxjQUFjLENBQUMsWUFBYSxDQUFDO29CQUMxQyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDbkIsR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsVUFBVSxNQUFNLENBQUMsVUFBVSw4QkFBOEIsSUFBSSw4Q0FBOEMsQ0FBQyxDQUFDO3dCQUNqSyxTQUFTO3FCQUNWO29CQUVELFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUM7aUJBQzdCO2dCQUVELG1EQUFtRDtnQkFDbkQsS0FBSyxNQUFNLGFBQWEsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO29CQUN6QyxNQUFNLElBQUksR0FBRyxhQUFhLENBQUMsWUFBWSxDQUFDO29CQUN4QyxJQUFJLENBQUMsSUFBSSxFQUFFO3dCQUNULEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxNQUFNLENBQUMsVUFBVSxvRkFBb0YsQ0FBQyxDQUFDO3dCQUMzSCxTQUFTO3FCQUNWO29CQUVELGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztpQkFDakc7YUFDRjtTQUNGO1FBRUQsaUVBQWlFO1FBQ2pFLGtCQUFrQjtRQUNsQixLQUFLLE1BQU0sQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUN4RSxNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDNUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDaEIsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLFdBQVcsQ0FBQyxVQUFVLDhCQUE4QixZQUFZLGlEQUFpRCxDQUFDLENBQUM7Z0JBQ3ZJLFNBQVM7YUFDVjtZQUVELElBQUksV0FBVyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDMUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLFdBQVcsaUNBQWlDLFlBQVksb0NBQW9DLFdBQVcsRUFBRSxDQUFDLENBQUM7YUFDeEg7U0FDRjtRQUVELE9BQU8sR0FBRyxDQUFDO0tBQ1o7SUFFTyw0QkFBNEI7UUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFBRSxPQUFPLFNBQVMsQ0FBQztTQUFFO1FBRTVDLG9DQUFvQztRQUNwQyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxHQUFHO1lBQ3hDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxjQUFjO1lBQ3RDLEtBQUssRUFBRSxZQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztTQUN0QixDQUFDO1FBRUYsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzFFLE1BQU07WUFDTixhQUFhLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztTQUNuRSxDQUFDLENBQUMsQ0FBQztLQUNMO0lBRU8sMkJBQTJCO1FBQ2pDLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUFFLE9BQU8sU0FBUyxDQUFDO1NBQUU7UUFDM0MsT0FBTyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztLQUMxQztJQUVPLDBCQUEwQjtRQUNoQyxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7S0FDdEQ7SUFFTyxtQkFBbUIsQ0FBQyxNQUFrQjtRQUM1QyxJQUFJLGFBQTRELENBQUM7UUFDakUsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQztRQUN2QyxJQUFJLFNBQVMsRUFBRTtZQUNiLGFBQWEsR0FBRztnQkFDZCxJQUFJLEVBQUUsS0FBSztnQkFDWCxFQUFFLEVBQUUsU0FBUyxDQUFDLE1BQU07YUFDckIsQ0FBQztTQUNIO1FBRUQsT0FBTztZQUNMLElBQUksRUFBRSxJQUFJO1lBQ1YsUUFBUSxFQUFFLE1BQU0sQ0FBQyxVQUFVO1lBQzNCLGFBQWE7U0FDZCxDQUFDO0tBQ0g7SUFFRCxJQUFZLFdBQVc7UUFDckIsSUFBSSxJQUFJLENBQUMsd0JBQXdCLEVBQUU7WUFBRSxPQUFPLElBQUksQ0FBQztTQUFFO1FBQ25ELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO0tBQ3hHO0lBRU8sWUFBWTtRQUNsQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7S0FDbEQ7SUFFTyx5QkFBeUI7UUFDL0IsT0FBTyxJQUFJLENBQUMsT0FBTzthQUNoQixNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQzthQUMzQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2IsTUFBTSxFQUFFLEtBQUssQ0FBQyx3QkFBd0I7WUFDdEMsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO1NBQzNCLENBQUMsQ0FBQyxDQUFDO0tBQ1A7SUFFTyxhQUFhO1FBQ25CLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQy9CLElBQUksWUFBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUM5QixNQUFNLElBQUksS0FBSyxDQUFDLHdGQUF3RixDQUFDLENBQUM7U0FDM0c7UUFDRCxPQUFPLE1BQU0sQ0FBQztLQUNmO0lBRU8sWUFBWTtRQUNsQixNQUFNLEtBQUssR0FBRyxZQUFRLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixNQUFNLElBQUksS0FBSyxDQUFDLHdGQUF3RixDQUFDLENBQUM7U0FDM0c7UUFDRCxPQUFPLEtBQUssQ0FBQztLQUNkOztBQW53QkgsNEJBb3dCQzs7O0FBNEJELFNBQVMsU0FBUyxDQUFJLEVBQU87SUFDM0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQWUsQ0FBQztJQUNyQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNsQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDdEI7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxNQUFNLGdCQUFnQjtJQUNwQixZQUE2QixVQUFrQixFQUFtQixLQUFhLEVBQW1CLE1BQTRCO1FBQWpHLGVBQVUsR0FBVixVQUFVLENBQVE7UUFBbUIsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUFtQixXQUFNLEdBQU4sTUFBTSxDQUFzQjtLQUM3SDtJQUVELElBQVcsU0FBUztRQUNsQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO0tBQzdCO0lBRUQsSUFBVyxVQUFVO1FBQ25CLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7S0FDL0I7SUFFRDs7T0FFRztJQUNJLGFBQWEsQ0FBQyxHQUFxQjtRQUN4QyxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssR0FBRyxDQUFDLFVBQVUsRUFBRTtZQUFFLE9BQU8sR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDO1NBQUU7UUFDbkYsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztLQUNwRDtJQUVEOztPQUVHO0lBQ0ksS0FBSyxDQUFDLEdBQXFCO1FBQ2hDLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7S0FDN0M7SUFFTSxRQUFRO1FBQ2IsbUdBQW1HO1FBQ25HLE9BQU8sU0FBUyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsV0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsTUFBTSxJQUFJLENBQUMsU0FBUyxNQUFNLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQztLQUNqSDtDQUNGO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGtCQUFrQixDQUFDLENBQXFCO0lBQy9DLE9BQU8sWUFBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIG5vdGlmaWNhdGlvbnMgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVzdGFybm90aWZpY2F0aW9ucyc7XG5pbXBvcnQgKiBhcyBldmVudHMgZnJvbSAnQGF3cy1jZGsvYXdzLWV2ZW50cyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnQGF3cy1jZGsvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0IHtcbiAgQXJuRm9ybWF0LFxuICBCb290c3RyYXBsZXNzU3ludGhlc2l6ZXIsXG4gIERlZmF1bHRTdGFja1N5bnRoZXNpemVyLFxuICBGZWF0dXJlRmxhZ3MsXG4gIElTdGFja1N5bnRoZXNpemVyLFxuICBMYXp5LFxuICBOYW1lcyxcbiAgUGh5c2ljYWxOYW1lLFxuICBSZW1vdmFsUG9saWN5LFxuICBSZXNvdXJjZSxcbiAgU3RhY2ssXG4gIFN0YWdlIGFzIENka1N0YWdlLFxuICBUb2tlbixcbn0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBBY3Rpb25DYXRlZ29yeSwgSUFjdGlvbiwgSVBpcGVsaW5lLCBJU3RhZ2UsIFBpcGVsaW5lTm90aWZpY2F0aW9uRXZlbnRzLCBQaXBlbGluZU5vdGlmeU9uT3B0aW9ucyB9IGZyb20gJy4vYWN0aW9uJztcbmltcG9ydCB7IENmblBpcGVsaW5lIH0gZnJvbSAnLi9jb2RlcGlwZWxpbmUuZ2VuZXJhdGVkJztcbmltcG9ydCB7IENyb3NzUmVnaW9uU3VwcG9ydENvbnN0cnVjdCwgQ3Jvc3NSZWdpb25TdXBwb3J0U3RhY2sgfSBmcm9tICcuL3ByaXZhdGUvY3Jvc3MtcmVnaW9uLXN1cHBvcnQtc3RhY2snO1xuaW1wb3J0IHsgRnVsbEFjdGlvbkRlc2NyaXB0b3IgfSBmcm9tICcuL3ByaXZhdGUvZnVsbC1hY3Rpb24tZGVzY3JpcHRvcic7XG5pbXBvcnQgeyBSaWNoQWN0aW9uIH0gZnJvbSAnLi9wcml2YXRlL3JpY2gtYWN0aW9uJztcbmltcG9ydCB7IFN0YWdlIH0gZnJvbSAnLi9wcml2YXRlL3N0YWdlJztcbmltcG9ydCB7IHZhbGlkYXRlTmFtZSwgdmFsaWRhdGVOYW1lc3BhY2VOYW1lLCB2YWxpZGF0ZVNvdXJjZUFjdGlvbiB9IGZyb20gJy4vcHJpdmF0ZS92YWxpZGF0aW9uJztcblxuLyoqXG4gKiBBbGxvd3MgeW91IHRvIGNvbnRyb2wgd2hlcmUgdG8gcGxhY2UgYSBuZXcgU3RhZ2Ugd2hlbiBpdCdzIGFkZGVkIHRvIHRoZSBQaXBlbGluZS5cbiAqIE5vdGUgdGhhdCB5b3UgY2FuIHByb3ZpZGUgb25seSBvbmUgb2YgdGhlIGJlbG93IHByb3BlcnRpZXMgLVxuICogc3BlY2lmeWluZyBtb3JlIHRoYW4gb25lIHdpbGwgcmVzdWx0IGluIGEgdmFsaWRhdGlvbiBlcnJvci5cbiAqXG4gKiBAc2VlICNyaWdodEJlZm9yZVxuICogQHNlZSAjanVzdEFmdGVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3RhZ2VQbGFjZW1lbnQge1xuICAvKipcbiAgICogSW5zZXJ0cyB0aGUgbmV3IFN0YWdlIGFzIGEgcGFyZW50IG9mIHRoZSBnaXZlbiBTdGFnZVxuICAgKiAoY2hhbmdpbmcgaXRzIGN1cnJlbnQgcGFyZW50IFN0YWdlLCBpZiBpdCBoYWQgb25lKS5cbiAgICovXG4gIHJlYWRvbmx5IHJpZ2h0QmVmb3JlPzogSVN0YWdlO1xuXG4gIC8qKlxuICAgKiBJbnNlcnRzIHRoZSBuZXcgU3RhZ2UgYXMgYSBjaGlsZCBvZiB0aGUgZ2l2ZW4gU3RhZ2VcbiAgICogKGNoYW5naW5nIGl0cyBjdXJyZW50IGNoaWxkIFN0YWdlLCBpZiBpdCBoYWQgb25lKS5cbiAgICovXG4gIHJlYWRvbmx5IGp1c3RBZnRlcj86IElTdGFnZTtcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBvZiBhIFBpcGVsaW5lIFN0YWdlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFN0YWdlUHJvcHMge1xuICAvKipcbiAgICogVGhlIHBoeXNpY2FsLCBodW1hbi1yZWFkYWJsZSBuYW1lIHRvIGFzc2lnbiB0byB0aGlzIFBpcGVsaW5lIFN0YWdlLlxuICAgKi9cbiAgcmVhZG9ubHkgc3RhZ2VOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBsaXN0IG9mIEFjdGlvbnMgdG8gY3JlYXRlIHRoaXMgU3RhZ2Ugd2l0aC5cbiAgICogWW91IGNhbiBhbHdheXMgYWRkIG1vcmUgQWN0aW9ucyBsYXRlciBieSBjYWxsaW5nIGBJU3RhZ2UjYWRkQWN0aW9uYC5cbiAgICovXG4gIHJlYWRvbmx5IGFjdGlvbnM/OiBJQWN0aW9uW107XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZW5hYmxlIHRyYW5zaXRpb24gdG8gdGhpcyBzdGFnZS5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgdHJhbnNpdGlvblRvRW5hYmxlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSByZWFzb24gZm9yIGRpc2FibGluZyB0cmFuc2l0aW9uIHRvIHRoaXMgc3RhZ2UuIE9ubHkgYXBwbGljYWJsZVxuICAgKiBpZiBgdHJhbnNpdGlvblRvRW5hYmxlZGAgaXMgc2V0IHRvIGBmYWxzZWAuXG4gICAqXG4gICAqIEBkZWZhdWx0ICdUcmFuc2l0aW9uIGRpc2FibGVkJ1xuICAgKi9cbiAgcmVhZG9ubHkgdHJhbnNpdGlvbkRpc2FibGVkUmVhc29uPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFN0YWdlT3B0aW9ucyBleHRlbmRzIFN0YWdlUHJvcHMge1xuICByZWFkb25seSBwbGFjZW1lbnQ/OiBTdGFnZVBsYWNlbWVudDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQaXBlbGluZVByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBTMyBidWNrZXQgdXNlZCBieSB0aGlzIFBpcGVsaW5lIHRvIHN0b3JlIGFydGlmYWN0cy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIG5ldyBTMyBidWNrZXQgd2lsbCBiZSBjcmVhdGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgYXJ0aWZhY3RCdWNrZXQ/OiBzMy5JQnVja2V0O1xuXG4gIC8qKlxuICAgKiBUaGUgSUFNIHJvbGUgdG8gYmUgYXNzdW1lZCBieSB0aGlzIFBpcGVsaW5lLlxuICAgKlxuICAgKiBAZGVmYXVsdCBhIG5ldyBJQU0gcm9sZSB3aWxsIGJlIGNyZWF0ZWQuXG4gICAqL1xuICByZWFkb25seSByb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciB0byByZXJ1biB0aGUgQVdTIENvZGVQaXBlbGluZSBwaXBlbGluZSBhZnRlciB5b3UgdXBkYXRlIGl0LlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVzdGFydEV4ZWN1dGlvbk9uVXBkYXRlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogTmFtZSBvZiB0aGUgcGlwZWxpbmUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQVdTIENsb3VkRm9ybWF0aW9uIGdlbmVyYXRlcyBhbiBJRCBhbmQgdXNlcyB0aGF0IGZvciB0aGUgcGlwZWxpbmUgbmFtZS5cbiAgICovXG4gIHJlYWRvbmx5IHBpcGVsaW5lTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogQSBtYXAgb2YgcmVnaW9uIHRvIFMzIGJ1Y2tldCBuYW1lIHVzZWQgZm9yIGNyb3NzLXJlZ2lvbiBDb2RlUGlwZWxpbmUuXG4gICAqIEZvciBldmVyeSBBY3Rpb24gdGhhdCB5b3Ugc3BlY2lmeSB0YXJnZXRpbmcgYSBkaWZmZXJlbnQgcmVnaW9uIHRoYW4gdGhlIFBpcGVsaW5lIGl0c2VsZixcbiAgICogaWYgeW91IGRvbid0IHByb3ZpZGUgYW4gZXhwbGljaXQgQnVja2V0IGZvciB0aGF0IHJlZ2lvbiB1c2luZyB0aGlzIHByb3BlcnR5LFxuICAgKiB0aGUgY29uc3RydWN0IHdpbGwgYXV0b21hdGljYWxseSBjcmVhdGUgYSBTdGFjayBjb250YWluaW5nIGFuIFMzIEJ1Y2tldCBpbiB0aGF0IHJlZ2lvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lLlxuICAgKi9cbiAgcmVhZG9ubHkgY3Jvc3NSZWdpb25SZXBsaWNhdGlvbkJ1Y2tldHM/OiB7IFtyZWdpb246IHN0cmluZ106IHMzLklCdWNrZXQgfTtcblxuICAvKipcbiAgICogVGhlIGxpc3Qgb2YgU3RhZ2VzLCBpbiBvcmRlcixcbiAgICogdG8gY3JlYXRlIHRoaXMgUGlwZWxpbmUgd2l0aC5cbiAgICogWW91IGNhbiBhbHdheXMgYWRkIG1vcmUgU3RhZ2VzIGxhdGVyIGJ5IGNhbGxpbmcgYFBpcGVsaW5lI2FkZFN0YWdlYC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lLlxuICAgKi9cbiAgcmVhZG9ubHkgc3RhZ2VzPzogU3RhZ2VQcm9wc1tdO1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgS01TIGtleXMgZm9yIGNyb3NzLWFjY291bnQgZGVwbG95bWVudHMuXG4gICAqXG4gICAqIFRoaXMgY29udHJvbHMgd2hldGhlciB0aGUgcGlwZWxpbmUgaXMgZW5hYmxlZCBmb3IgY3Jvc3MtYWNjb3VudCBkZXBsb3ltZW50cy5cbiAgICpcbiAgICogQnkgZGVmYXVsdCBjcm9zcy1hY2NvdW50IGRlcGxveW1lbnRzIGFyZSBlbmFibGVkLCBidXQgdGhpcyBmZWF0dXJlIHJlcXVpcmVzXG4gICAqIHRoYXQgS01TIEN1c3RvbWVyIE1hc3RlciBLZXlzIGFyZSBjcmVhdGVkIHdoaWNoIGhhdmUgYSBjb3N0IG9mICQxL21vbnRoLlxuICAgKlxuICAgKiBJZiB5b3UgZG8gbm90IG5lZWQgY3Jvc3MtYWNjb3VudCBkZXBsb3ltZW50cywgeW91IGNhbiBzZXQgdGhpcyB0byBgZmFsc2VgIHRvXG4gICAqIG5vdCBjcmVhdGUgdGhvc2Uga2V5cyBhbmQgc2F2ZSBvbiB0aGF0IGNvc3QgKHRoZSBhcnRpZmFjdCBidWNrZXQgd2lsbCBiZVxuICAgKiBlbmNyeXB0ZWQgd2l0aCBhbiBBV1MtbWFuYWdlZCBrZXkpLiBIb3dldmVyLCBjcm9zcy1hY2NvdW50IGRlcGxveW1lbnRzIHdpbGxcbiAgICogbm8gbG9uZ2VyIGJlIHBvc3NpYmxlLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBjcm9zc0FjY291bnRLZXlzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogRW5hYmxlIEtNUyBrZXkgcm90YXRpb24gZm9yIHRoZSBnZW5lcmF0ZWQgS01TIGtleXMuXG4gICAqXG4gICAqIEJ5IGRlZmF1bHQgS01TIGtleSByb3RhdGlvbiBpcyBkaXNhYmxlZCwgYnV0IHdpbGwgYWRkIGFuIGFkZGl0aW9uYWwgJDEvbW9udGhcbiAgICogZm9yIGVhY2ggeWVhciB0aGUga2V5IGV4aXN0cyB3aGVuIGVuYWJsZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZmFsc2UgKGtleSByb3RhdGlvbiBpcyBkaXNhYmxlZClcbiAgICovXG4gIHJlYWRvbmx5IGVuYWJsZUtleVJvdGF0aW9uPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogUmV1c2UgdGhlIHNhbWUgY3Jvc3MgcmVnaW9uIHN1cHBvcnQgc3RhY2sgZm9yIGFsbCBwaXBlbGluZXMgaW4gdGhlIEFwcC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0cnVlIChVc2UgdGhlIHNhbWUgc3VwcG9ydCBzdGFjayBmb3IgYWxsIHBpcGVsaW5lcyBpbiBBcHApXG4gICAqL1xuICByZWFkb25seSByZXVzZUNyb3NzUmVnaW9uU3VwcG9ydFN0YWNrcz86IGJvb2xlYW47XG59XG5cbmFic3RyYWN0IGNsYXNzIFBpcGVsaW5lQmFzZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVBpcGVsaW5lIHtcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHBpcGVsaW5lTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgcGlwZWxpbmVBcm46IHN0cmluZztcblxuICAvKipcbiAgICogRGVmaW5lcyBhbiBldmVudCBydWxlIHRyaWdnZXJlZCBieSB0aGlzIENvZGVQaXBlbGluZS5cbiAgICpcbiAgICogQHBhcmFtIGlkIElkZW50aWZpZXIgZm9yIHRoaXMgZXZlbnQgaGFuZGxlci5cbiAgICogQHBhcmFtIG9wdGlvbnMgQWRkaXRpb25hbCBvcHRpb25zIHRvIHBhc3MgdG8gdGhlIGV2ZW50IHJ1bGUuXG4gICAqL1xuICBwdWJsaWMgb25FdmVudChpZDogc3RyaW5nLCBvcHRpb25zOiBldmVudHMuT25FdmVudE9wdGlvbnMgPSB7fSk6IGV2ZW50cy5SdWxlIHtcbiAgICBjb25zdCBydWxlID0gbmV3IGV2ZW50cy5SdWxlKHRoaXMsIGlkLCBvcHRpb25zKTtcbiAgICBydWxlLmFkZFRhcmdldChvcHRpb25zLnRhcmdldCk7XG4gICAgcnVsZS5hZGRFdmVudFBhdHRlcm4oe1xuICAgICAgc291cmNlOiBbJ2F3cy5jb2RlcGlwZWxpbmUnXSxcbiAgICAgIHJlc291cmNlczogW3RoaXMucGlwZWxpbmVBcm5dLFxuICAgIH0pO1xuICAgIHJldHVybiBydWxlO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYW4gZXZlbnQgcnVsZSB0cmlnZ2VyZWQgYnkgdGhlIFwiQ29kZVBpcGVsaW5lIFBpcGVsaW5lIEV4ZWN1dGlvblxuICAgKiBTdGF0ZSBDaGFuZ2VcIiBldmVudCBlbWl0dGVkIGZyb20gdGhpcyBwaXBlbGluZS5cbiAgICpcbiAgICogQHBhcmFtIGlkIElkZW50aWZpZXIgZm9yIHRoaXMgZXZlbnQgaGFuZGxlci5cbiAgICogQHBhcmFtIG9wdGlvbnMgQWRkaXRpb25hbCBvcHRpb25zIHRvIHBhc3MgdG8gdGhlIGV2ZW50IHJ1bGUuXG4gICAqL1xuICBwdWJsaWMgb25TdGF0ZUNoYW5nZShpZDogc3RyaW5nLCBvcHRpb25zOiBldmVudHMuT25FdmVudE9wdGlvbnMgPSB7fSk6IGV2ZW50cy5SdWxlIHtcbiAgICBjb25zdCBydWxlID0gdGhpcy5vbkV2ZW50KGlkLCBvcHRpb25zKTtcbiAgICBydWxlLmFkZEV2ZW50UGF0dGVybih7XG4gICAgICBkZXRhaWxUeXBlOiBbJ0NvZGVQaXBlbGluZSBQaXBlbGluZSBFeGVjdXRpb24gU3RhdGUgQ2hhbmdlJ10sXG4gICAgfSk7XG4gICAgcmV0dXJuIHJ1bGU7XG4gIH1cblxuICBwdWJsaWMgYmluZEFzTm90aWZpY2F0aW9uUnVsZVNvdXJjZShfc2NvcGU6IENvbnN0cnVjdCk6IG5vdGlmaWNhdGlvbnMuTm90aWZpY2F0aW9uUnVsZVNvdXJjZUNvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNvdXJjZUFybjogdGhpcy5waXBlbGluZUFybixcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIG5vdGlmeU9uKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgdGFyZ2V0OiBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlVGFyZ2V0LFxuICAgIG9wdGlvbnM6IFBpcGVsaW5lTm90aWZ5T25PcHRpb25zLFxuICApOiBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlIHtcbiAgICByZXR1cm4gbmV3IG5vdGlmaWNhdGlvbnMuTm90aWZpY2F0aW9uUnVsZSh0aGlzLCBpZCwge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIHNvdXJjZTogdGhpcyxcbiAgICAgIHRhcmdldHM6IFt0YXJnZXRdLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG5vdGlmeU9uRXhlY3V0aW9uU3RhdGVDaGFuZ2UoXG4gICAgaWQ6IHN0cmluZyxcbiAgICB0YXJnZXQ6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGVUYXJnZXQsXG4gICAgb3B0aW9ucz86IG5vdGlmaWNhdGlvbnMuTm90aWZpY2F0aW9uUnVsZU9wdGlvbnMsXG4gICk6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGUge1xuICAgIHJldHVybiB0aGlzLm5vdGlmeU9uKGlkLCB0YXJnZXQsIHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBldmVudHM6IFtcbiAgICAgICAgUGlwZWxpbmVOb3RpZmljYXRpb25FdmVudHMuUElQRUxJTkVfRVhFQ1VUSU9OX0ZBSUxFRCxcbiAgICAgICAgUGlwZWxpbmVOb3RpZmljYXRpb25FdmVudHMuUElQRUxJTkVfRVhFQ1VUSU9OX0NBTkNFTEVELFxuICAgICAgICBQaXBlbGluZU5vdGlmaWNhdGlvbkV2ZW50cy5QSVBFTElORV9FWEVDVVRJT05fU1RBUlRFRCxcbiAgICAgICAgUGlwZWxpbmVOb3RpZmljYXRpb25FdmVudHMuUElQRUxJTkVfRVhFQ1VUSU9OX1JFU1VNRUQsXG4gICAgICAgIFBpcGVsaW5lTm90aWZpY2F0aW9uRXZlbnRzLlBJUEVMSU5FX0VYRUNVVElPTl9TVUNDRUVERUQsXG4gICAgICAgIFBpcGVsaW5lTm90aWZpY2F0aW9uRXZlbnRzLlBJUEVMSU5FX0VYRUNVVElPTl9TVVBFUlNFREVELFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBub3RpZnlPbkFueVN0YWdlU3RhdGVDaGFuZ2UoXG4gICAgaWQ6IHN0cmluZyxcbiAgICB0YXJnZXQ6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGVUYXJnZXQsXG4gICAgb3B0aW9ucz86IG5vdGlmaWNhdGlvbnMuTm90aWZpY2F0aW9uUnVsZU9wdGlvbnMsXG4gICk6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGUge1xuICAgIHJldHVybiB0aGlzLm5vdGlmeU9uKGlkLCB0YXJnZXQsIHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBldmVudHM6IFtcbiAgICAgICAgUGlwZWxpbmVOb3RpZmljYXRpb25FdmVudHMuU1RBR0VfRVhFQ1VUSU9OX0NBTkNFTEVELFxuICAgICAgICBQaXBlbGluZU5vdGlmaWNhdGlvbkV2ZW50cy5TVEFHRV9FWEVDVVRJT05fRkFJTEVELFxuICAgICAgICBQaXBlbGluZU5vdGlmaWNhdGlvbkV2ZW50cy5TVEFHRV9FWEVDVVRJT05fUkVTVU1FRCxcbiAgICAgICAgUGlwZWxpbmVOb3RpZmljYXRpb25FdmVudHMuU1RBR0VfRVhFQ1VUSU9OX1NUQVJURUQsXG4gICAgICAgIFBpcGVsaW5lTm90aWZpY2F0aW9uRXZlbnRzLlNUQUdFX0VYRUNVVElPTl9TVUNDRUVERUQsXG4gICAgICBdLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG5vdGlmeU9uQW55QWN0aW9uU3RhdGVDaGFuZ2UoXG4gICAgaWQ6IHN0cmluZyxcbiAgICB0YXJnZXQ6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGVUYXJnZXQsXG4gICAgb3B0aW9ucz86IG5vdGlmaWNhdGlvbnMuTm90aWZpY2F0aW9uUnVsZU9wdGlvbnMsXG4gICk6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGUge1xuICAgIHJldHVybiB0aGlzLm5vdGlmeU9uKGlkLCB0YXJnZXQsIHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBldmVudHM6IFtcbiAgICAgICAgUGlwZWxpbmVOb3RpZmljYXRpb25FdmVudHMuQUNUSU9OX0VYRUNVVElPTl9DQU5DRUxFRCxcbiAgICAgICAgUGlwZWxpbmVOb3RpZmljYXRpb25FdmVudHMuQUNUSU9OX0VYRUNVVElPTl9GQUlMRUQsXG4gICAgICAgIFBpcGVsaW5lTm90aWZpY2F0aW9uRXZlbnRzLkFDVElPTl9FWEVDVVRJT05fU1RBUlRFRCxcbiAgICAgICAgUGlwZWxpbmVOb3RpZmljYXRpb25FdmVudHMuQUNUSU9OX0VYRUNVVElPTl9TVUNDRUVERUQsXG4gICAgICBdLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG5vdGlmeU9uQW55TWFudWFsQXBwcm92YWxTdGF0ZUNoYW5nZShcbiAgICBpZDogc3RyaW5nLFxuICAgIHRhcmdldDogbm90aWZpY2F0aW9ucy5JTm90aWZpY2F0aW9uUnVsZVRhcmdldCxcbiAgICBvcHRpb25zPzogbm90aWZpY2F0aW9ucy5Ob3RpZmljYXRpb25SdWxlT3B0aW9ucyxcbiAgKTogbm90aWZpY2F0aW9ucy5JTm90aWZpY2F0aW9uUnVsZSB7XG4gICAgcmV0dXJuIHRoaXMubm90aWZ5T24oaWQsIHRhcmdldCwge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIGV2ZW50czogW1xuICAgICAgICBQaXBlbGluZU5vdGlmaWNhdGlvbkV2ZW50cy5NQU5VQUxfQVBQUk9WQUxfRkFJTEVELFxuICAgICAgICBQaXBlbGluZU5vdGlmaWNhdGlvbkV2ZW50cy5NQU5VQUxfQVBQUk9WQUxfTkVFREVELFxuICAgICAgICBQaXBlbGluZU5vdGlmaWNhdGlvbkV2ZW50cy5NQU5VQUxfQVBQUk9WQUxfU1VDQ0VFREVELFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIEFuIEFXUyBDb2RlUGlwZWxpbmUgcGlwZWxpbmUgd2l0aCBpdHMgYXNzb2NpYXRlZCBJQU0gcm9sZSBhbmQgUzMgYnVja2V0LlxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBjcmVhdGUgYSBwaXBlbGluZVxuICogaW1wb3J0ICogYXMgY29kZWNvbW1pdCBmcm9tICdAYXdzLWNkay9hd3MtY29kZWNvbW1pdCc7XG4gKlxuICogY29uc3QgcGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHRoaXMsICdQaXBlbGluZScpO1xuICpcbiAqIC8vIGFkZCBhIHN0YWdlXG4gKiBjb25zdCBzb3VyY2VTdGFnZSA9IHBpcGVsaW5lLmFkZFN0YWdlKHsgc3RhZ2VOYW1lOiAnU291cmNlJyB9KTtcbiAqXG4gKiAvLyBhZGQgYSBzb3VyY2UgYWN0aW9uIHRvIHRoZSBzdGFnZVxuICogZGVjbGFyZSBjb25zdCByZXBvOiBjb2RlY29tbWl0LlJlcG9zaXRvcnk7XG4gKiBkZWNsYXJlIGNvbnN0IHNvdXJjZUFydGlmYWN0OiBjb2RlcGlwZWxpbmUuQXJ0aWZhY3Q7XG4gKiBzb3VyY2VTdGFnZS5hZGRBY3Rpb24obmV3IGNvZGVwaXBlbGluZV9hY3Rpb25zLkNvZGVDb21taXRTb3VyY2VBY3Rpb24oe1xuICogICBhY3Rpb25OYW1lOiAnU291cmNlJyxcbiAqICAgb3V0cHV0OiBzb3VyY2VBcnRpZmFjdCxcbiAqICAgcmVwb3NpdG9yeTogcmVwbyxcbiAqIH0pKTtcbiAqXG4gKiAvLyAuLi4gYWRkIG1vcmUgc3RhZ2VzXG4gKi9cbmV4cG9ydCBjbGFzcyBQaXBlbGluZSBleHRlbmRzIFBpcGVsaW5lQmFzZSB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYSBwaXBlbGluZSBpbnRvIHRoaXMgYXBwLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgdGhlIHNjb3BlIGludG8gd2hpY2ggdG8gaW1wb3J0IHRoaXMgcGlwZWxpbmVcbiAgICogQHBhcmFtIGlkIHRoZSBsb2dpY2FsIElEIG9mIHRoZSByZXR1cm5lZCBwaXBlbGluZSBjb25zdHJ1Y3RcbiAgICogQHBhcmFtIHBpcGVsaW5lQXJuIFRoZSBBUk4gb2YgdGhlIHBpcGVsaW5lIChlLmcuIGBhcm46YXdzOmNvZGVwaXBlbGluZTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOk15RGVtb1BpcGVsaW5lYClcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVBpcGVsaW5lQXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHBpcGVsaW5lQXJuOiBzdHJpbmcpOiBJUGlwZWxpbmUge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFBpcGVsaW5lQmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcGlwZWxpbmVOYW1lID0gU3RhY2sub2Yoc2NvcGUpLnNwbGl0QXJuKHBpcGVsaW5lQXJuLCBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRSkucmVzb3VyY2U7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcGlwZWxpbmVBcm4gPSBwaXBlbGluZUFybjtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBJQU0gcm9sZSBBV1MgQ29kZVBpcGVsaW5lIHdpbGwgdXNlIHRvIHBlcmZvcm0gYWN0aW9ucyBvciBhc3N1bWUgcm9sZXMgZm9yIGFjdGlvbnMgd2l0aFxuICAgKiBhIG1vcmUgc3BlY2lmaWMgSUFNIHJvbGUuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcm9sZTogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBBUk4gb2YgdGhpcyBwaXBlbGluZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHBpcGVsaW5lQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBwaXBlbGluZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHBpcGVsaW5lTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdmVyc2lvbiBvZiB0aGUgcGlwZWxpbmVcbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHBpcGVsaW5lVmVyc2lvbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBCdWNrZXQgdXNlZCB0byBzdG9yZSBvdXRwdXQgYXJ0aWZhY3RzXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYXJ0aWZhY3RCdWNrZXQ6IHMzLklCdWNrZXQ7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfc3RhZ2VzID0gbmV3IEFycmF5PFN0YWdlPigpO1xuICBwcml2YXRlIHJlYWRvbmx5IGNyb3NzUmVnaW9uQnVja2V0c1Bhc3NlZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSByZWFkb25seSBfY3Jvc3NSZWdpb25TdXBwb3J0OiB7IFtyZWdpb246IHN0cmluZ106IENyb3NzUmVnaW9uU3VwcG9ydCB9ID0ge307XG4gIHByaXZhdGUgcmVhZG9ubHkgX2Nyb3NzQWNjb3VudFN1cHBvcnQ6IHsgW2FjY291bnQ6IHN0cmluZ106IFN0YWNrIH0gPSB7fTtcbiAgcHJpdmF0ZSByZWFkb25seSBjcm9zc0FjY291bnRLZXlzOiBib29sZWFuO1xuICBwcml2YXRlIHJlYWRvbmx5IGVuYWJsZUtleVJvdGF0aW9uPzogYm9vbGVhbjtcbiAgcHJpdmF0ZSByZWFkb25seSByZXVzZUNyb3NzUmVnaW9uU3VwcG9ydFN0YWNrczogYm9vbGVhbjtcbiAgcHJpdmF0ZSByZWFkb25seSBjb2RlUGlwZWxpbmU6IENmblBpcGVsaW5lO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBQaXBlbGluZVByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMucGlwZWxpbmVOYW1lLFxuICAgIH0pO1xuXG4gICAgdmFsaWRhdGVOYW1lKCdQaXBlbGluZScsIHRoaXMucGh5c2ljYWxOYW1lKTtcblxuICAgIC8vIG9ubHkgb25lIG9mIGFydGlmYWN0QnVja2V0IGFuZCBjcm9zc1JlZ2lvblJlcGxpY2F0aW9uQnVja2V0cyBjYW4gYmUgc3VwcGxpZWRcbiAgICBpZiAocHJvcHMuYXJ0aWZhY3RCdWNrZXQgJiYgcHJvcHMuY3Jvc3NSZWdpb25SZXBsaWNhdGlvbkJ1Y2tldHMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignT25seSBvbmUgb2YgYXJ0aWZhY3RCdWNrZXQgYW5kIGNyb3NzUmVnaW9uUmVwbGljYXRpb25CdWNrZXRzIGNhbiBiZSBzcGVjaWZpZWQhJyk7XG4gICAgfVxuXG4gICAgLy8gQGRlcHJlY2F0ZWQodjIpOiBzd2l0Y2ggdG8gZGVmYXVsdCBmYWxzZVxuICAgIHRoaXMuY3Jvc3NBY2NvdW50S2V5cyA9IHByb3BzLmNyb3NzQWNjb3VudEtleXMgPz8gdHJ1ZTtcbiAgICB0aGlzLmVuYWJsZUtleVJvdGF0aW9uID0gcHJvcHMuZW5hYmxlS2V5Um90YXRpb247XG5cbiAgICAvLyBDcm9zcyBhY2NvdW50IGtleXMgbXVzdCBiZSBzZXQgZm9yIGtleSByb3RhdGlvbiB0byBiZSBlbmFibGVkXG4gICAgaWYgKHRoaXMuZW5hYmxlS2V5Um90YXRpb24gJiYgIXRoaXMuY3Jvc3NBY2NvdW50S2V5cykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2V0dGluZyAnZW5hYmxlS2V5Um90YXRpb24nIHRvIHRydWUgYWxzbyByZXF1aXJlcyAnY3Jvc3NBY2NvdW50S2V5cycgdG8gYmUgZW5hYmxlZFwiKTtcbiAgICB9XG5cbiAgICB0aGlzLnJldXNlQ3Jvc3NSZWdpb25TdXBwb3J0U3RhY2tzID0gcHJvcHMucmV1c2VDcm9zc1JlZ2lvblN1cHBvcnRTdGFja3MgPz8gdHJ1ZTtcblxuICAgIC8vIElmIGEgYnVja2V0IGhhcyBiZWVuIHByb3ZpZGVkLCB1c2UgaXQgLSBvdGhlcndpc2UsIGNyZWF0ZSBhIGJ1Y2tldC5cbiAgICBsZXQgcHJvcHNCdWNrZXQgPSB0aGlzLmdldEFydGlmYWN0QnVja2V0RnJvbVByb3BzKHByb3BzKTtcblxuICAgIGlmICghcHJvcHNCdWNrZXQpIHtcbiAgICAgIGxldCBlbmNyeXB0aW9uS2V5O1xuXG4gICAgICBpZiAodGhpcy5jcm9zc0FjY291bnRLZXlzKSB7XG4gICAgICAgIGVuY3J5cHRpb25LZXkgPSBuZXcga21zLktleSh0aGlzLCAnQXJ0aWZhY3RzQnVja2V0RW5jcnlwdGlvbktleScsIHtcbiAgICAgICAgICAvLyByZW1vdmUgdGhlIGtleSAtIHRoZXJlIGlzIGEgZ3JhY2UgcGVyaW9kIG9mIGEgZmV3IGRheXMgYmVmb3JlIGl0J3MgZ29uZSBmb3IgZ29vZCxcbiAgICAgICAgICAvLyB0aGF0IHNob3VsZCBiZSBlbm91Z2ggZm9yIGFueSBlbWVyZ2VuY3kgYWNjZXNzIHRvIHRoZSBidWNrZXQgYXJ0aWZhY3RzXG4gICAgICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgICAgIGVuYWJsZUtleVJvdGF0aW9uOiB0aGlzLmVuYWJsZUtleVJvdGF0aW9uLFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gYWRkIGFuIGFsaWFzIHRvIG1ha2UgZmluZGluZyB0aGUga2V5IGluIHRoZSBjb25zb2xlIGVhc2llclxuICAgICAgICBuZXcga21zLkFsaWFzKHRoaXMsICdBcnRpZmFjdHNCdWNrZXRFbmNyeXB0aW9uS2V5QWxpYXMnLCB7XG4gICAgICAgICAgYWxpYXNOYW1lOiB0aGlzLmdlbmVyYXRlTmFtZUZvckRlZmF1bHRCdWNrZXRLZXlBbGlhcygpLFxuICAgICAgICAgIHRhcmdldEtleTogZW5jcnlwdGlvbktleSxcbiAgICAgICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksIC8vIGRlc3Ryb3kgdGhlIGFsaWFzIGFsb25nIHdpdGggdGhlIGtleVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcHJvcHNCdWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdBcnRpZmFjdHNCdWNrZXQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IFBoeXNpY2FsTmFtZS5HRU5FUkFURV9JRl9ORUVERUQsXG4gICAgICAgIGVuY3J5cHRpb25LZXksXG4gICAgICAgIGVuY3J5cHRpb246IGVuY3J5cHRpb25LZXkgPyBzMy5CdWNrZXRFbmNyeXB0aW9uLktNUyA6IHMzLkJ1Y2tldEVuY3J5cHRpb24uS01TX01BTkFHRUQsXG4gICAgICAgIGVuZm9yY2VTU0w6IHRydWUsXG4gICAgICAgIGJsb2NrUHVibGljQWNjZXNzOiBuZXcgczMuQmxvY2tQdWJsaWNBY2Nlc3MoczMuQmxvY2tQdWJsaWNBY2Nlc3MuQkxPQ0tfQUxMKSxcbiAgICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5SRVRBSU4sXG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5hcnRpZmFjdEJ1Y2tldCA9IHByb3BzQnVja2V0O1xuXG4gICAgLy8gSWYgYSByb2xlIGhhcyBiZWVuIHByb3ZpZGVkLCB1c2UgaXQgLSBvdGhlcndpc2UsIGNyZWF0ZSBhIHJvbGUuXG4gICAgdGhpcy5yb2xlID0gcHJvcHMucm9sZSB8fCBuZXcgaWFtLlJvbGUodGhpcywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnY29kZXBpcGVsaW5lLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcblxuICAgIHRoaXMuY29kZVBpcGVsaW5lID0gbmV3IENmblBpcGVsaW5lKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGFydGlmYWN0U3RvcmU6IExhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5yZW5kZXJBcnRpZmFjdFN0b3JlUHJvcGVydHkoKSB9KSxcbiAgICAgIGFydGlmYWN0U3RvcmVzOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMucmVuZGVyQXJ0aWZhY3RTdG9yZXNQcm9wZXJ0eSgpIH0pLFxuICAgICAgc3RhZ2VzOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMucmVuZGVyU3RhZ2VzKCkgfSksXG4gICAgICBkaXNhYmxlSW5ib3VuZFN0YWdlVHJhbnNpdGlvbnM6IExhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5yZW5kZXJEaXNhYmxlZFRyYW5zaXRpb25zKCkgfSwgeyBvbWl0RW1wdHlBcnJheTogdHJ1ZSB9KSxcbiAgICAgIHJvbGVBcm46IHRoaXMucm9sZS5yb2xlQXJuLFxuICAgICAgcmVzdGFydEV4ZWN1dGlvbk9uVXBkYXRlOiBwcm9wcyAmJiBwcm9wcy5yZXN0YXJ0RXhlY3V0aW9uT25VcGRhdGUsXG4gICAgICBuYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICB9KTtcblxuICAgIC8vIHRoaXMgd2lsbCBwcm9kdWNlIGEgRGVwZW5kc09uIGZvciBib3RoIHRoZSByb2xlIGFuZCB0aGUgcG9saWN5IHJlc291cmNlcy5cbiAgICB0aGlzLmNvZGVQaXBlbGluZS5ub2RlLmFkZERlcGVuZGVuY3kodGhpcy5yb2xlKTtcblxuICAgIHRoaXMuYXJ0aWZhY3RCdWNrZXQuZ3JhbnRSZWFkV3JpdGUodGhpcy5yb2xlKTtcbiAgICB0aGlzLnBpcGVsaW5lTmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKHRoaXMuY29kZVBpcGVsaW5lLnJlZik7XG4gICAgdGhpcy5waXBlbGluZVZlcnNpb24gPSB0aGlzLmNvZGVQaXBlbGluZS5hdHRyVmVyc2lvbjtcbiAgICB0aGlzLmNyb3NzUmVnaW9uQnVja2V0c1Bhc3NlZCA9ICEhcHJvcHMuY3Jvc3NSZWdpb25SZXBsaWNhdGlvbkJ1Y2tldHM7XG5cbiAgICBmb3IgKGNvbnN0IFtyZWdpb24sIHJlcGxpY2F0aW9uQnVja2V0XSBvZiBPYmplY3QuZW50cmllcyhwcm9wcy5jcm9zc1JlZ2lvblJlcGxpY2F0aW9uQnVja2V0cyB8fCB7fSkpIHtcbiAgICAgIHRoaXMuX2Nyb3NzUmVnaW9uU3VwcG9ydFtyZWdpb25dID0ge1xuICAgICAgICByZXBsaWNhdGlvbkJ1Y2tldCxcbiAgICAgICAgc3RhY2s6IFN0YWNrLm9mKHJlcGxpY2F0aW9uQnVja2V0KSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRG9lcyBub3QgZXhwb3NlIGEgRm46OkdldEF0dCBmb3IgdGhlIEFSTiBzbyB3ZSdsbCBoYXZlIHRvIG1ha2UgaXQgb3Vyc2VsdmVzXG4gICAgdGhpcy5waXBlbGluZUFybiA9IFN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7XG4gICAgICBzZXJ2aWNlOiAnY29kZXBpcGVsaW5lJyxcbiAgICAgIHJlc291cmNlOiB0aGlzLnBpcGVsaW5lTmFtZSxcbiAgICB9KTtcblxuICAgIGZvciAoY29uc3Qgc3RhZ2Ugb2YgcHJvcHMuc3RhZ2VzIHx8IFtdKSB7XG4gICAgICB0aGlzLmFkZFN0YWdlKHN0YWdlKTtcbiAgICB9XG5cbiAgICB0aGlzLm5vZGUuYWRkVmFsaWRhdGlvbih7IHZhbGlkYXRlOiAoKSA9PiB0aGlzLnZhbGlkYXRlUGlwZWxpbmUoKSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IFN0YWdlLCBhbmQgYWRkcyBpdCB0byB0aGlzIFBpcGVsaW5lLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvcHMgdGhlIGNyZWF0aW9uIHByb3BlcnRpZXMgb2YgdGhlIG5ldyBTdGFnZVxuICAgKiBAcmV0dXJucyB0aGUgbmV3bHkgY3JlYXRlZCBTdGFnZVxuICAgKi9cbiAgcHVibGljIGFkZFN0YWdlKHByb3BzOiBTdGFnZU9wdGlvbnMpOiBJU3RhZ2Uge1xuICAgIC8vIGNoZWNrIGZvciBkdXBsaWNhdGUgU3RhZ2VzIGFuZCBuYW1lc1xuICAgIGlmICh0aGlzLl9zdGFnZXMuZmluZChzID0+IHMuc3RhZ2VOYW1lID09PSBwcm9wcy5zdGFnZU5hbWUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFN0YWdlIHdpdGggZHVwbGljYXRlIG5hbWUgJyR7cHJvcHMuc3RhZ2VOYW1lfScgYWRkZWQgdG8gdGhlIFBpcGVsaW5lYCk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhZ2UgPSBuZXcgU3RhZ2UocHJvcHMsIHRoaXMpO1xuXG4gICAgY29uc3QgaW5kZXggPSBwcm9wcy5wbGFjZW1lbnRcbiAgICAgID8gdGhpcy5jYWxjdWxhdGVJbnNlcnRJbmRleEZyb21QbGFjZW1lbnQocHJvcHMucGxhY2VtZW50KVxuICAgICAgOiB0aGlzLnN0YWdlQ291bnQ7XG5cbiAgICB0aGlzLl9zdGFnZXMuc3BsaWNlKGluZGV4LCAwLCBzdGFnZSk7XG5cbiAgICByZXR1cm4gc3RhZ2U7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHN0YXRlbWVudCB0byB0aGUgcGlwZWxpbmUgcm9sZS5cbiAgICovXG4gIHB1YmxpYyBhZGRUb1JvbGVQb2xpY3koc3RhdGVtZW50OiBpYW0uUG9saWN5U3RhdGVtZW50KSB7XG4gICAgdGhpcy5yb2xlLmFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBudW1iZXIgb2YgU3RhZ2VzIGluIHRoaXMgUGlwZWxpbmUuXG4gICAqL1xuICBwdWJsaWMgZ2V0IHN0YWdlQ291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhZ2VzLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzdGFnZXMgdGhhdCBjb21wcmlzZSB0aGUgcGlwZWxpbmUuXG4gICAqXG4gICAqICoqTm90ZSoqOiB0aGUgcmV0dXJuZWQgYXJyYXkgaXMgYSBkZWZlbnNpdmUgY29weSxcbiAgICogc28gYWRkaW5nIGVsZW1lbnRzIHRvIGl0IGhhcyBubyBlZmZlY3QuXG4gICAqIEluc3RlYWQsIHVzZSB0aGUgYGFkZFN0YWdlYCBtZXRob2QgaWYgeW91IHdhbnQgdG8gYWRkIG1vcmUgc3RhZ2VzXG4gICAqIHRvIHRoZSBwaXBlbGluZS5cbiAgICovXG4gIHB1YmxpYyBnZXQgc3RhZ2VzKCk6IElTdGFnZVtdIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhZ2VzLnNsaWNlKCk7XG4gIH1cblxuICAvKipcbiAgICogQWNjZXNzIG9uZSBvZiB0aGUgcGlwZWxpbmUncyBzdGFnZXMgYnkgc3RhZ2UgbmFtZVxuICAgKi9cbiAgcHVibGljIHN0YWdlKHN0YWdlTmFtZTogc3RyaW5nKTogSVN0YWdlIHtcbiAgICBmb3IgKGNvbnN0IHN0YWdlIG9mIHRoaXMuX3N0YWdlcykge1xuICAgICAgaWYgKHN0YWdlLnN0YWdlTmFtZSA9PT0gc3RhZ2VOYW1lKSB7XG4gICAgICAgIHJldHVybiBzdGFnZTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKGBQaXBlbGluZSBkb2VzIG5vdCBjb250YWluIGEgc3RhZ2UgbmFtZWQgJyR7c3RhZ2VOYW1lfScuIEF2YWlsYWJsZSBzdGFnZXM6ICR7dGhpcy5fc3RhZ2VzLm1hcChzID0+IHMuc3RhZ2VOYW1lKS5qb2luKCcsICcpfWApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYWxsIG9mIHRoZSBgQ3Jvc3NSZWdpb25TdXBwb3J0U3RhY2tgcyB0aGF0IHdlcmUgZ2VuZXJhdGVkIGF1dG9tYXRpY2FsbHlcbiAgICogd2hlbiBkZWFsaW5nIHdpdGggQWN0aW9ucyB0aGF0IHJlc2lkZSBpbiBhIGRpZmZlcmVudCByZWdpb24gdGhhbiB0aGUgUGlwZWxpbmUgaXRzZWxmLlxuICAgKlxuICAgKi9cbiAgcHVibGljIGdldCBjcm9zc1JlZ2lvblN1cHBvcnQoKTogeyBbcmVnaW9uOiBzdHJpbmddOiBDcm9zc1JlZ2lvblN1cHBvcnQgfSB7XG4gICAgY29uc3QgcmV0OiB7IFtyZWdpb246IHN0cmluZ106IENyb3NzUmVnaW9uU3VwcG9ydCB9ID0ge307XG4gICAgT2JqZWN0LmtleXModGhpcy5fY3Jvc3NSZWdpb25TdXBwb3J0KS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHJldFtrZXldID0gdGhpcy5fY3Jvc3NSZWdpb25TdXBwb3J0W2tleV07XG4gICAgfSk7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHVibGljIF9hdHRhY2hBY3Rpb25Ub1BpcGVsaW5lKHN0YWdlOiBTdGFnZSwgYWN0aW9uOiBJQWN0aW9uLCBhY3Rpb25TY29wZTogQ29uc3RydWN0KTogRnVsbEFjdGlvbkRlc2NyaXB0b3Ige1xuICAgIGNvbnN0IHJpY2hBY3Rpb24gPSBuZXcgUmljaEFjdGlvbihhY3Rpb24sIHRoaXMpO1xuXG4gICAgLy8gaGFuZGxlIGNyb3NzLXJlZ2lvbiBhY3Rpb25zIGhlcmVcbiAgICBjb25zdCBjcm9zc1JlZ2lvbkluZm8gPSB0aGlzLmVuc3VyZVJlcGxpY2F0aW9uUmVzb3VyY2VzRXhpc3RGb3IocmljaEFjdGlvbik7XG5cbiAgICAvLyBnZXQgdGhlIHJvbGUgZm9yIHRoZSBnaXZlbiBhY3Rpb24sIGhhbmRsaW5nIGlmIGl0J3MgY3Jvc3MtYWNjb3VudFxuICAgIGNvbnN0IGFjdGlvblJvbGUgPSB0aGlzLmdldFJvbGVGb3JBY3Rpb24oc3RhZ2UsIHJpY2hBY3Rpb24sIGFjdGlvblNjb3BlKTtcblxuICAgIC8vIC8vIENvZGVQaXBlbGluZSBWYXJpYWJsZXNcbiAgICB2YWxpZGF0ZU5hbWVzcGFjZU5hbWUocmljaEFjdGlvbi5hY3Rpb25Qcm9wZXJ0aWVzLnZhcmlhYmxlc05hbWVzcGFjZSk7XG5cbiAgICAvLyBiaW5kIHRoZSBBY3Rpb24gKHR5cGUgaDR4KVxuICAgIGNvbnN0IGFjdGlvbkNvbmZpZyA9IHJpY2hBY3Rpb24uYmluZChhY3Rpb25TY29wZSwgc3RhZ2UsIHtcbiAgICAgIHJvbGU6IGFjdGlvblJvbGUgPyBhY3Rpb25Sb2xlIDogdGhpcy5yb2xlLFxuICAgICAgYnVja2V0OiBjcm9zc1JlZ2lvbkluZm8uYXJ0aWZhY3RCdWNrZXQsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IEZ1bGxBY3Rpb25EZXNjcmlwdG9yKHtcbiAgICAgIC8vIG11c3QgYmUgJ2FjdGlvbicsIG5vdCAncmljaEFjdGlvbicsXG4gICAgICAvLyBhcyB0aG9zZSBhcmUgcmV0dXJuZWQgYnkgdGhlIElTdGFnZS5hY3Rpb25zIHByb3BlcnR5LFxuICAgICAgLy8gYW5kIGl0J3MgaW1wb3J0YW50IGN1c3RvbWVycyBvZiBQaXBlbGluZSBnZXQgdGhlIHNhbWUgaW5zdGFuY2VcbiAgICAgIC8vIGJhY2sgYXMgdGhleSBhZGRlZCB0byB0aGUgcGlwZWxpbmVcbiAgICAgIGFjdGlvbixcbiAgICAgIGFjdGlvbkNvbmZpZyxcbiAgICAgIGFjdGlvblJvbGUsXG4gICAgICBhY3Rpb25SZWdpb246IGNyb3NzUmVnaW9uSW5mby5yZWdpb24sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGUgdGhlIHBpcGVsaW5lIHN0cnVjdHVyZVxuICAgKlxuICAgKiBWYWxpZGF0aW9uIGhhcHBlbnMgYWNjb3JkaW5nIHRvIHRoZSBydWxlcyBkb2N1bWVudGVkIGF0XG4gICAqXG4gICAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlcGlwZWxpbmUvbGF0ZXN0L3VzZXJndWlkZS9yZWZlcmVuY2UtcGlwZWxpbmUtc3RydWN0dXJlLmh0bWwjcGlwZWxpbmUtcmVxdWlyZW1lbnRzXG4gICAqL1xuICBwcml2YXRlIHZhbGlkYXRlUGlwZWxpbmUoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBbXG4gICAgICAuLi50aGlzLnZhbGlkYXRlU291cmNlQWN0aW9uTG9jYXRpb25zKCksXG4gICAgICAuLi50aGlzLnZhbGlkYXRlSGFzU3RhZ2VzKCksXG4gICAgICAuLi50aGlzLnZhbGlkYXRlU3RhZ2VzKCksXG4gICAgICAuLi50aGlzLnZhbGlkYXRlQXJ0aWZhY3RzKCksXG4gICAgXTtcbiAgfVxuXG4gIHByaXZhdGUgZW5zdXJlUmVwbGljYXRpb25SZXNvdXJjZXNFeGlzdEZvcihhY3Rpb246IFJpY2hBY3Rpb24pOiBDcm9zc1JlZ2lvbkluZm8ge1xuICAgIGlmICghYWN0aW9uLmlzQ3Jvc3NSZWdpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGFydGlmYWN0QnVja2V0OiB0aGlzLmFydGlmYWN0QnVja2V0LFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBUaGUgYWN0aW9uIGhhcyBhIHNwZWNpZmljIHJlZ2lvbixcbiAgICAvLyByZXF1aXJlIHRoZSBwaXBlbGluZSB0byBoYXZlIGEga25vd24gcmVnaW9uIGFzIHdlbGwuXG4gICAgdGhpcy5yZXF1aXJlUmVnaW9uKCk7XG5cbiAgICAvLyBzb3VyY2UgYWN0aW9ucyBoYXZlIHRvIGJlIGluIHRoZSBzYW1lIHJlZ2lvbiBhcyB0aGUgcGlwZWxpbmVcbiAgICBpZiAoYWN0aW9uLmFjdGlvblByb3BlcnRpZXMuY2F0ZWdvcnkgPT09IEFjdGlvbkNhdGVnb3J5LlNPVVJDRSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBTb3VyY2UgYWN0aW9uICcke2FjdGlvbi5hY3Rpb25Qcm9wZXJ0aWVzLmFjdGlvbk5hbWV9JyBtdXN0IGJlIGluIHRoZSBzYW1lIHJlZ2lvbiBhcyB0aGUgcGlwZWxpbmVgKTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayB3aGV0aGVyIHdlIGFscmVhZHkgaGF2ZSBhIGJ1Y2tldCBpbiB0aGF0IHJlZ2lvbixcbiAgICAvLyBlaXRoZXIgcGFzc2VkIGZyb20gdGhlIG91dHNpZGUgb3IgcHJldmlvdXNseSBjcmVhdGVkXG4gICAgY29uc3QgY3Jvc3NSZWdpb25TdXBwb3J0ID0gdGhpcy5vYnRhaW5Dcm9zc1JlZ2lvblN1cHBvcnRGb3IoYWN0aW9uKTtcblxuICAgIC8vIHRoZSBzdGFjayBjb250YWluaW5nIHRoZSByZXBsaWNhdGlvbiBidWNrZXQgbXVzdCBiZSBkZXBsb3llZCBiZWZvcmUgdGhlIHBpcGVsaW5lXG4gICAgU3RhY2sub2YodGhpcykuYWRkRGVwZW5kZW5jeShjcm9zc1JlZ2lvblN1cHBvcnQuc3RhY2spO1xuICAgIC8vIFRoZSBQaXBlbGluZSByb2xlIG11c3QgYmUgYWJsZSB0byByZXBsaWNhdGUgdG8gdGhhdCBidWNrZXRcbiAgICBjcm9zc1JlZ2lvblN1cHBvcnQucmVwbGljYXRpb25CdWNrZXQuZ3JhbnRSZWFkV3JpdGUodGhpcy5yb2xlKTtcblxuICAgIHJldHVybiB7XG4gICAgICBhcnRpZmFjdEJ1Y2tldDogY3Jvc3NSZWdpb25TdXBwb3J0LnJlcGxpY2F0aW9uQnVja2V0LFxuICAgICAgcmVnaW9uOiBhY3Rpb24uZWZmZWN0aXZlUmVnaW9uLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogR2V0IG9yIGNyZWF0ZSB0aGUgY3Jvc3MtcmVnaW9uIHN1cHBvcnQgY29uc3RydWN0IGZvciB0aGUgZ2l2ZW4gYWN0aW9uXG4gICAqL1xuICBwcml2YXRlIG9idGFpbkNyb3NzUmVnaW9uU3VwcG9ydEZvcihhY3Rpb246IFJpY2hBY3Rpb24pIHtcbiAgICAvLyB0aGlzIG1ldGhvZCBpcyBuZXZlciBjYWxsZWQgZm9yIG5vbiBjcm9zcy1yZWdpb24gYWN0aW9uc1xuICAgIGNvbnN0IGFjdGlvblJlZ2lvbiA9IGFjdGlvbi5lZmZlY3RpdmVSZWdpb24hO1xuICAgIGxldCBjcm9zc1JlZ2lvblN1cHBvcnQgPSB0aGlzLl9jcm9zc1JlZ2lvblN1cHBvcnRbYWN0aW9uUmVnaW9uXTtcbiAgICBpZiAoIWNyb3NzUmVnaW9uU3VwcG9ydCkge1xuICAgICAgLy8gd2UgbmVlZCB0byBjcmVhdGUgc2NhZmZvbGRpbmcgcmVzb3VyY2VzIGZvciB0aGlzIHJlZ2lvblxuICAgICAgY29uc3Qgb3RoZXJTdGFjayA9IGFjdGlvbi5yZXNvdXJjZVN0YWNrO1xuICAgICAgY3Jvc3NSZWdpb25TdXBwb3J0ID0gdGhpcy5jcmVhdGVTdXBwb3J0UmVzb3VyY2VzRm9yUmVnaW9uKG90aGVyU3RhY2ssIGFjdGlvblJlZ2lvbik7XG4gICAgICB0aGlzLl9jcm9zc1JlZ2lvblN1cHBvcnRbYWN0aW9uUmVnaW9uXSA9IGNyb3NzUmVnaW9uU3VwcG9ydDtcbiAgICB9XG4gICAgcmV0dXJuIGNyb3NzUmVnaW9uU3VwcG9ydDtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlU3VwcG9ydFJlc291cmNlc0ZvclJlZ2lvbihvdGhlclN0YWNrOiBTdGFjayB8IHVuZGVmaW5lZCwgYWN0aW9uUmVnaW9uOiBzdHJpbmcpOiBDcm9zc1JlZ2lvblN1cHBvcnQge1xuICAgIC8vIGlmIHdlIGhhdmUgYSBzdGFjayBmcm9tIHRoZSByZXNvdXJjZSBwYXNzZWQgLSB1c2UgdGhhdCFcbiAgICBpZiAob3RoZXJTdGFjaykge1xuICAgICAgLy8gY2hlY2sgaWYgdGhlIHN0YWNrIGRvZXNuJ3QgaGF2ZSB0aGlzIG1hZ2ljIGNvbnN0cnVjdCBhbHJlYWR5XG4gICAgICBjb25zdCBpZCA9IGBDcm9zc1JlZ2lvblJlcGxpY2F0aW9uU3VwcG9ydC1kODIzZjFkOC1hOTkwLTRlNWMtYmUxOC00YWM2OTg1MzJlNjUtJHthY3Rpb25SZWdpb259YDtcbiAgICAgIGxldCBjcm9zc1JlZ2lvblN1cHBvcnRDb25zdHJ1Y3QgPSBvdGhlclN0YWNrLm5vZGUudHJ5RmluZENoaWxkKGlkKSBhcyBDcm9zc1JlZ2lvblN1cHBvcnRDb25zdHJ1Y3Q7XG4gICAgICBpZiAoIWNyb3NzUmVnaW9uU3VwcG9ydENvbnN0cnVjdCkge1xuICAgICAgICBjcm9zc1JlZ2lvblN1cHBvcnRDb25zdHJ1Y3QgPSBuZXcgQ3Jvc3NSZWdpb25TdXBwb3J0Q29uc3RydWN0KG90aGVyU3RhY2ssIGlkLCB7XG4gICAgICAgICAgY3JlYXRlS21zS2V5OiB0aGlzLmNyb3NzQWNjb3VudEtleXMsXG4gICAgICAgICAgZW5hYmxlS2V5Um90YXRpb246IHRoaXMuZW5hYmxlS2V5Um90YXRpb24sXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICByZXBsaWNhdGlvbkJ1Y2tldDogY3Jvc3NSZWdpb25TdXBwb3J0Q29uc3RydWN0LnJlcGxpY2F0aW9uQnVja2V0LFxuICAgICAgICBzdGFjazogb3RoZXJTdGFjayxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gb3RoZXJ3aXNlIC0gY3JlYXRlIGEgc3RhY2sgd2l0aCB0aGUgcmVzb3VyY2VzIG5lZWRlZCBmb3IgcmVwbGljYXRpb24gYWNyb3NzIHJlZ2lvbnNcbiAgICBjb25zdCBwaXBlbGluZVN0YWNrID0gU3RhY2sub2YodGhpcyk7XG4gICAgY29uc3QgcGlwZWxpbmVBY2NvdW50ID0gcGlwZWxpbmVTdGFjay5hY2NvdW50O1xuICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQocGlwZWxpbmVBY2NvdW50KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWW91IG5lZWQgdG8gc3BlY2lmeSBhbiBleHBsaWNpdCBhY2NvdW50IHdoZW4gdXNpbmcgQ29kZVBpcGVsaW5lJ3MgY3Jvc3MtcmVnaW9uIHN1cHBvcnRcIik7XG4gICAgfVxuXG4gICAgY29uc3QgYXBwID0gdGhpcy5zdXBwb3J0U2NvcGUoKTtcbiAgICBjb25zdCBzdXBwb3J0U3RhY2tJZCA9IGBjcm9zcy1yZWdpb24tc3RhY2stJHt0aGlzLnJldXNlQ3Jvc3NSZWdpb25TdXBwb3J0U3RhY2tzID8gcGlwZWxpbmVBY2NvdW50IDogcGlwZWxpbmVTdGFjay5zdGFja05hbWV9OiR7YWN0aW9uUmVnaW9ufWA7XG4gICAgbGV0IHN1cHBvcnRTdGFjayA9IGFwcC5ub2RlLnRyeUZpbmRDaGlsZChzdXBwb3J0U3RhY2tJZCkgYXMgQ3Jvc3NSZWdpb25TdXBwb3J0U3RhY2s7XG4gICAgaWYgKCFzdXBwb3J0U3RhY2spIHtcbiAgICAgIHN1cHBvcnRTdGFjayA9IG5ldyBDcm9zc1JlZ2lvblN1cHBvcnRTdGFjayhhcHAsIHN1cHBvcnRTdGFja0lkLCB7XG4gICAgICAgIHBpcGVsaW5lU3RhY2tOYW1lOiBwaXBlbGluZVN0YWNrLnN0YWNrTmFtZSxcbiAgICAgICAgcmVnaW9uOiBhY3Rpb25SZWdpb24sXG4gICAgICAgIGFjY291bnQ6IHBpcGVsaW5lQWNjb3VudCxcbiAgICAgICAgc3ludGhlc2l6ZXI6IHRoaXMuZ2V0Q3Jvc3NSZWdpb25TdXBwb3J0U3ludGhlc2l6ZXIoKSxcbiAgICAgICAgY3JlYXRlS21zS2V5OiB0aGlzLmNyb3NzQWNjb3VudEtleXMsXG4gICAgICAgIGVuYWJsZUtleVJvdGF0aW9uOiB0aGlzLmVuYWJsZUtleVJvdGF0aW9uLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YWNrOiBzdXBwb3J0U3RhY2ssXG4gICAgICByZXBsaWNhdGlvbkJ1Y2tldDogc3VwcG9ydFN0YWNrLnJlcGxpY2F0aW9uQnVja2V0LFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGdldENyb3NzUmVnaW9uU3VwcG9ydFN5bnRoZXNpemVyKCk6IElTdGFja1N5bnRoZXNpemVyIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAodGhpcy5zdGFjay5zeW50aGVzaXplciBpbnN0YW5jZW9mIERlZmF1bHRTdGFja1N5bnRoZXNpemVyKSB7XG4gICAgICAvLyBpZiB3ZSBoYXZlIHRoZSBuZXcgc3ludGhlc2l6ZXIsXG4gICAgICAvLyB3ZSBuZWVkIGEgYm9vdHN0cmFwbGVzcyBjb3B5IG9mIGl0LFxuICAgICAgLy8gYmVjYXVzZSB3ZSBkb24ndCB3YW50IHRvIHJlcXVpcmUgYm9vdHN0cmFwcGluZyB0aGUgZW52aXJvbm1lbnRcbiAgICAgIC8vIG9mIHRoZSBwaXBlbGluZSBhY2NvdW50IGluIHRoaXMgcmVwbGljYXRpb24gcmVnaW9uXG4gICAgICByZXR1cm4gbmV3IEJvb3RzdHJhcGxlc3NTeW50aGVzaXplcih7XG4gICAgICAgIGRlcGxveVJvbGVBcm46IHRoaXMuc3RhY2suc3ludGhlc2l6ZXIuZGVwbG95Um9sZUFybixcbiAgICAgICAgY2xvdWRGb3JtYXRpb25FeGVjdXRpb25Sb2xlQXJuOiB0aGlzLnN0YWNrLnN5bnRoZXNpemVyLmNsb3VkRm9ybWF0aW9uRXhlY3V0aW9uUm9sZUFybixcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBhbnkgb3RoZXIgc3ludGhlc2l6ZXI6IGp1c3QgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgLy8gKGllLiwgdXNlIHRoZSBkZWZhdWx0IGJhc2VkIG9uIHRoZSBjb250ZXh0IHNldHRpbmdzKVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlTmFtZUZvckRlZmF1bHRCdWNrZXRLZXlBbGlhcygpOiBzdHJpbmcge1xuICAgIGNvbnN0IHByZWZpeCA9ICdhbGlhcy9jb2RlcGlwZWxpbmUtJztcbiAgICBjb25zdCBtYXhBbGlhc0xlbmd0aCA9IDI1NjtcbiAgICBjb25zdCBtYXhSZXNvdXJjZU5hbWVMZW5ndGggPSBtYXhBbGlhc0xlbmd0aCAtIHByZWZpeC5sZW5ndGg7XG4gICAgLy8gTmFtZXMudW5pcXVlSWQoKSBtYXkgaGF2ZSBuYW1pbmcgY29sbGlzaW9ucyB3aGVuIHRoZSBJRHMgb2YgcmVzb3VyY2VzIGFyZSBzaW1pbGFyXG4gICAgLy8gYW5kL29yIHdoZW4gdGhleSBhcmUgdG9vIGxvbmcgYW5kIHNsaWNlZC4gV2UgZG8gbm90IHdhbnQgdG8gdXBkYXRlIHRoaXMgYW5kXG4gICAgLy8gYXV0b21hdGljYWxseSBjaGFuZ2UgdGhlIG5hbWUgb2YgZXZlcnkgS01TIGtleSBhbHJlYWR5IGdlbmVyYXRlZCBzbyB3ZSBhcmUgcHV0dGluZ1xuICAgIC8vIHRoaXMgdW5kZXIgYSBmZWF0dXJlIGZsYWcuXG4gICAgY29uc3QgdW5pcXVlSWQgPSBGZWF0dXJlRmxhZ3Mub2YodGhpcykuaXNFbmFibGVkKGN4YXBpLkNPREVQSVBFTElORV9DUk9TU19BQ0NPVU5UX0tFWV9BTElBU19TVEFDS19TQUZFX1JFU09VUkNFX05BTUUpID9cbiAgICAgIE5hbWVzLnVuaXF1ZVJlc291cmNlTmFtZSh0aGlzLCB7XG4gICAgICAgIHNlcGFyYXRvcjogJy0nLFxuICAgICAgICBtYXhMZW5ndGg6IG1heFJlc291cmNlTmFtZUxlbmd0aCxcbiAgICAgICAgYWxsb3dlZFNwZWNpYWxDaGFyYWN0ZXJzOiAnL18tJyxcbiAgICAgIH0pIDpcbiAgICAgIE5hbWVzLnVuaXF1ZUlkKHRoaXMpLnNsaWNlKC1tYXhSZXNvdXJjZU5hbWVMZW5ndGgpO1xuICAgIHJldHVybiBwcmVmaXggKyB1bmlxdWVJZC50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHJvbGUgdXNlZCBmb3IgdGhpcyBhY3Rpb24sXG4gICAqIGluY2x1ZGluZyBoYW5kbGluZyB0aGUgY2FzZSB3aGVuIHRoZSBhY3Rpb24gaXMgc3VwcG9zZWQgdG8gYmUgY3Jvc3MtYWNjb3VudC5cbiAgICpcbiAgICogQHBhcmFtIHN0YWdlIHRoZSBzdGFnZSB0aGUgYWN0aW9uIGJlbG9uZ3MgdG9cbiAgICogQHBhcmFtIGFjdGlvbiB0aGUgYWN0aW9uIHRvIHJldHVybi9jcmVhdGUgYSByb2xlIGZvclxuICAgKiBAcGFyYW0gYWN0aW9uU2NvcGUgdGhlIHNjb3BlLCB1bmlxdWUgdG8gdGhlIGFjdGlvbiwgdG8gY3JlYXRlIG5ldyByZXNvdXJjZXMgaW5cbiAgICovXG4gIHByaXZhdGUgZ2V0Um9sZUZvckFjdGlvbihzdGFnZTogU3RhZ2UsIGFjdGlvbjogUmljaEFjdGlvbiwgYWN0aW9uU2NvcGU6IENvbnN0cnVjdCk6IGlhbS5JUm9sZSB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgcGlwZWxpbmVTdGFjayA9IFN0YWNrLm9mKHRoaXMpO1xuXG4gICAgbGV0IGFjdGlvblJvbGUgPSB0aGlzLmdldFJvbGVGcm9tQWN0aW9uUHJvcHNPckdlbmVyYXRlSWZDcm9zc0FjY291bnQoc3RhZ2UsIGFjdGlvbik7XG5cbiAgICBpZiAoIWFjdGlvblJvbGUgJiYgdGhpcy5pc0F3c093bmVkKGFjdGlvbikpIHtcbiAgICAgIC8vIGdlbmVyYXRlIGEgUm9sZSBmb3IgdGhpcyBzcGVjaWZpYyBBY3Rpb25cbiAgICAgIGFjdGlvblJvbGUgPSBuZXcgaWFtLlJvbGUoYWN0aW9uU2NvcGUsICdDb2RlUGlwZWxpbmVBY3Rpb25Sb2xlJywge1xuICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFByaW5jaXBhbChwaXBlbGluZVN0YWNrLmFjY291bnQpLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gdGhlIHBpcGVsaW5lIHJvbGUgbmVlZHMgYXNzdW1lUm9sZSBwZXJtaXNzaW9ucyB0byB0aGUgYWN0aW9uIHJvbGVcbiAgICBjb25zdCBncmFudCA9IGFjdGlvblJvbGU/LmdyYW50QXNzdW1lUm9sZSh0aGlzLnJvbGUpO1xuICAgIGdyYW50Py5hcHBseUJlZm9yZSh0aGlzLmNvZGVQaXBlbGluZSk7XG4gICAgcmV0dXJuIGFjdGlvblJvbGU7XG4gIH1cblxuICBwcml2YXRlIGdldFJvbGVGcm9tQWN0aW9uUHJvcHNPckdlbmVyYXRlSWZDcm9zc0FjY291bnQoc3RhZ2U6IFN0YWdlLCBhY3Rpb246IFJpY2hBY3Rpb24pOiBpYW0uSVJvbGUgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHBpcGVsaW5lU3RhY2sgPSBTdGFjay5vZih0aGlzKTtcblxuICAgIC8vIGlmIHdlIGhhdmUgYSBjcm9zcy1hY2NvdW50IGFjdGlvbiwgdGhlIHBpcGVsaW5lJ3MgYnVja2V0IG11c3QgaGF2ZSBhIEtNUyBrZXlcbiAgICAvLyAob3RoZXJ3aXNlIHdlIGNhbid0IGNvbmZpZ3VyZSBjcm9zcy1hY2NvdW50IHRydXN0IHBvbGljaWVzKVxuICAgIGlmIChhY3Rpb24uaXNDcm9zc0FjY291bnQpIHtcbiAgICAgIGNvbnN0IGFydGlmYWN0QnVja2V0ID0gdGhpcy5lbnN1cmVSZXBsaWNhdGlvblJlc291cmNlc0V4aXN0Rm9yKGFjdGlvbikuYXJ0aWZhY3RCdWNrZXQ7XG4gICAgICBpZiAoIWFydGlmYWN0QnVja2V0LmVuY3J5cHRpb25LZXkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBBcnRpZmFjdCBCdWNrZXQgbXVzdCBoYXZlIGEgS01TIEtleSB0byBhZGQgY3Jvc3MtYWNjb3VudCBhY3Rpb24gJyR7YWN0aW9uLmFjdGlvblByb3BlcnRpZXMuYWN0aW9uTmFtZX0nIGAgK1xuICAgICAgICAgIGAocGlwZWxpbmUgYWNjb3VudDogJyR7cmVuZGVyRW52RGltZW5zaW9uKHRoaXMuZW52LmFjY291bnQpfScsIGFjdGlvbiBhY2NvdW50OiAnJHtyZW5kZXJFbnZEaW1lbnNpb24oYWN0aW9uLmVmZmVjdGl2ZUFjY291bnQpfScpLiBgICtcbiAgICAgICAgICAnQ3JlYXRlIFBpcGVsaW5lIHdpdGggXFwnY3Jvc3NBY2NvdW50S2V5czogdHJ1ZVxcJyAob3IgcGFzcyBhbiBleGlzdGluZyBCdWNrZXQgd2l0aCBhIGtleSknLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGlmIGEgUm9sZSBoYXMgYmVlbiBwYXNzZWQgZXhwbGljaXRseSwgYWx3YXlzIHVzZSBpdFxuICAgIC8vIChldmVuIGlmIHRoZSBiYWNraW5nIHJlc291cmNlIGlzIGZyb20gYSBkaWZmZXJlbnQgYWNjb3VudCAtXG4gICAgLy8gdGhpcyBpcyBob3cgdGhlIHVzZXIgY2FuIG92ZXJyaWRlIG91ciBkZWZhdWx0IHN1cHBvcnQgbG9naWMpXG4gICAgaWYgKGFjdGlvbi5hY3Rpb25Qcm9wZXJ0aWVzLnJvbGUpIHtcbiAgICAgIGlmICh0aGlzLmlzQXdzT3duZWQoYWN0aW9uKSkge1xuICAgICAgICAvLyB0aGUgcm9sZSBoYXMgdG8gYmUgZGVwbG95ZWQgYmVmb3JlIHRoZSBwaXBlbGluZVxuICAgICAgICAvLyAob3VyIG1hZ2ljYWwgY3Jvc3Mtc3RhY2sgZGVwZW5kZW5jaWVzIHdpbGwgbm90IHdvcmssXG4gICAgICAgIC8vIGJlY2F1c2UgdGhlIHJvbGUgbWlnaHQgYmUgZnJvbSBhIGRpZmZlcmVudCBlbnZpcm9ubWVudCksXG4gICAgICAgIC8vIGJ1dCBfb25seV8gaWYgaXQncyBhIG5ldyBSb2xlIC1cbiAgICAgICAgLy8gYW4gaW1wb3J0ZWQgUm9sZSBzaG91bGQgbm90IGFkZCB0aGUgZGVwZW5kZW5jeVxuICAgICAgICBpZiAoYWN0aW9uLmFjdGlvblByb3BlcnRpZXMucm9sZSBpbnN0YW5jZW9mIGlhbS5Sb2xlKSB7XG4gICAgICAgICAgY29uc3Qgcm9sZVN0YWNrID0gU3RhY2sub2YoYWN0aW9uLmFjdGlvblByb3BlcnRpZXMucm9sZSk7XG4gICAgICAgICAgcGlwZWxpbmVTdGFjay5hZGREZXBlbmRlbmN5KHJvbGVTdGFjayk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWN0aW9uLmFjdGlvblByb3BlcnRpZXMucm9sZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIC4uLmV4Y2VwdCBpZiB0aGUgQWN0aW9uIGlzIG5vdCBvd25lZCBieSAnQVdTJyxcbiAgICAgICAgLy8gYXMgdGhhdCB3b3VsZCBiZSByZWplY3RlZCBieSBDb2RlUGlwZWxpbmUgYXQgZGVwbG95IHRpbWVcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3BlY2lmeWluZyBhIFJvbGUgaXMgbm90IHN1cHBvcnRlZCBmb3IgYWN0aW9ucyB3aXRoIGFuIG93bmVyIGRpZmZlcmVudCB0aGFuICdBV1MnIC0gXCIgK1xuICAgICAgICAgIGBnb3QgJyR7YWN0aW9uLmFjdGlvblByb3BlcnRpZXMub3duZXJ9JyAoQWN0aW9uOiAnJHthY3Rpb24uYWN0aW9uUHJvcGVydGllcy5hY3Rpb25OYW1lfScgaW4gU3RhZ2U6ICcke3N0YWdlLnN0YWdlTmFtZX0nKWApO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGlmIHdlIGRvbid0IGhhdmUgYSBSb2xlIHBhc3NlZCxcbiAgICAvLyBhbmQgdGhlIGFjdGlvbiBpcyBjcm9zcy1hY2NvdW50LFxuICAgIC8vIGdlbmVyYXRlIGEgUm9sZSBpbiB0aGF0IG90aGVyIGFjY291bnQgc3RhY2tcbiAgICBjb25zdCBvdGhlckFjY291bnRTdGFjayA9IHRoaXMuZ2V0T3RoZXJTdGFja0lmQWN0aW9uSXNDcm9zc0FjY291bnQoYWN0aW9uKTtcbiAgICBpZiAoIW90aGVyQWNjb3VudFN0YWNrKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIGdlbmVyYXRlIGEgcm9sZSBpbiB0aGUgb3RoZXIgc3RhY2ssIHRoYXQgdGhlIFBpcGVsaW5lIHdpbGwgYXNzdW1lIGZvciBleGVjdXRpbmcgdGhpcyBhY3Rpb25cbiAgICBjb25zdCByZXQgPSBuZXcgaWFtLlJvbGUob3RoZXJBY2NvdW50U3RhY2ssXG4gICAgICBgJHtOYW1lcy51bmlxdWVJZCh0aGlzKX0tJHtzdGFnZS5zdGFnZU5hbWV9LSR7YWN0aW9uLmFjdGlvblByb3BlcnRpZXMuYWN0aW9uTmFtZX0tQWN0aW9uUm9sZWAsIHtcbiAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRQcmluY2lwYWwocGlwZWxpbmVTdGFjay5hY2NvdW50KSxcbiAgICAgICAgcm9sZU5hbWU6IFBoeXNpY2FsTmFtZS5HRU5FUkFURV9JRl9ORUVERUQsXG4gICAgICB9KTtcbiAgICAvLyB0aGUgb3RoZXIgc3RhY2sgd2l0aCB0aGUgcm9sZSBoYXMgdG8gYmUgZGVwbG95ZWQgYmVmb3JlIHRoZSBwaXBlbGluZSBzdGFja1xuICAgIC8vIChDb2RlUGlwZWxpbmUgdmVyaWZpZXMgeW91IGNhbiBhc3N1bWUgdGhlIGFjdGlvbiBSb2xlIG9uIGNyZWF0aW9uKVxuICAgIHBpcGVsaW5lU3RhY2suYWRkRGVwZW5kZW5jeShvdGhlckFjY291bnRTdGFjayk7XG5cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIFN0YWNrIHRoaXMgQWN0aW9uIGJlbG9uZ3MgdG8gaWYgdGhpcyBpcyBhIGNyb3NzLWFjY291bnQgQWN0aW9uLlxuICAgKiBJZiB0aGlzIEFjdGlvbiBpcyBub3QgY3Jvc3MtYWNjb3VudCAoaS5lLiwgaXQgbGl2ZXMgaW4gdGhlIHNhbWUgYWNjb3VudCBhcyB0aGUgUGlwZWxpbmUpLFxuICAgKiBpdCByZXR1cm5zIHVuZGVmaW5lZC5cbiAgICpcbiAgICogQHBhcmFtIGFjdGlvbiB0aGUgQWN0aW9uIHRvIHJldHVybiB0aGUgU3RhY2sgZm9yXG4gICAqL1xuICBwcml2YXRlIGdldE90aGVyU3RhY2tJZkFjdGlvbklzQ3Jvc3NBY2NvdW50KGFjdGlvbjogSUFjdGlvbik6IFN0YWNrIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCB0YXJnZXRBY2NvdW50ID0gYWN0aW9uLmFjdGlvblByb3BlcnRpZXMucmVzb3VyY2VcbiAgICAgID8gYWN0aW9uLmFjdGlvblByb3BlcnRpZXMucmVzb3VyY2UuZW52LmFjY291bnRcbiAgICAgIDogYWN0aW9uLmFjdGlvblByb3BlcnRpZXMuYWNjb3VudDtcblxuICAgIGlmICh0YXJnZXRBY2NvdW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIGlmIHRoZSBhY2NvdW50IG9mIHRoZSBBY3Rpb24gaXMgbm90IHNwZWNpZmllZCxcbiAgICAgIC8vIHRoZW4gaXQgZGVmYXVsdHMgdG8gdGhlIHNhbWUgYWNjb3VudCB0aGUgcGlwZWxpbmUgaXRzZWxmIGlzIGluXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIHdoZXRoZXIgdGhlIGFjdGlvbidzIGFjY291bnQgaXMgYSBzdGF0aWMgc3RyaW5nXG4gICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZCh0YXJnZXRBY2NvdW50KSkge1xuICAgICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZCh0aGlzLmVudi5hY2NvdW50KSkge1xuICAgICAgICAvLyB0aGUgcGlwZWxpbmUgaXMgYWxzbyBlbnYtYWdub3N0aWMsIHNvIHRoYXQncyBmaW5lXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSAnYWNjb3VudCcgcHJvcGVydHkgbXVzdCBiZSBhIGNvbmNyZXRlIHZhbHVlIChhY3Rpb246ICcke2FjdGlvbi5hY3Rpb25Qcm9wZXJ0aWVzLmFjdGlvbk5hbWV9JylgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBdCB0aGlzIHBvaW50LCB3ZSBrbm93IHRoYXQgdGhlIGFjdGlvbidzIGFjY291bnQgaXMgYSBzdGF0aWMgc3RyaW5nLlxuICAgIC8vIEluIHRoaXMgY2FzZSwgdGhlIHBpcGVsaW5lJ3MgYWNjb3VudCBtdXN0IGFsc28gYmUgYSBzdGF0aWMgc3RyaW5nLlxuICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQodGhpcy5lbnYuYWNjb3VudCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUGlwZWxpbmUgc3RhY2sgd2hpY2ggdXNlcyBjcm9zcy1lbnZpcm9ubWVudCBhY3Rpb25zIG11c3QgaGF2ZSBhbiBleHBsaWNpdGx5IHNldCBhY2NvdW50Jyk7XG4gICAgfVxuXG4gICAgLy8gYXQgdGhpcyBwb2ludCwgd2Uga25vdyB0aGF0IGJvdGggdGhlIFBpcGVsaW5lJ3MgYWNjb3VudCxcbiAgICAvLyBhbmQgdGhlIGFjdGlvbi1iYWNraW5nIHJlc291cmNlJ3MgYWNjb3VudCBhcmUgc3RhdGljIHN0cmluZ3NcblxuICAgIC8vIGlmIHRoZXkgYXJlIGlkZW50aWNhbCAtIG5vdGhpbmcgdG8gZG8gKHRoZSBhY3Rpb24gaXMgbm90IGNyb3NzLWFjY291bnQpXG4gICAgaWYgKHRoaXMuZW52LmFjY291bnQgPT09IHRhcmdldEFjY291bnQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLy8gYXQgdGhpcyBwb2ludCwgd2Uga25vdyB0aGF0IHRoZSBhY3Rpb24gaXMgY2VydGFpbmx5IGNyb3NzLWFjY291bnQsXG4gICAgLy8gc28gd2UgbmVlZCB0byByZXR1cm4gYSBTdGFjayBpbiBpdHMgYWNjb3VudCB0byBjcmVhdGUgdGhlIGhlbHBlciBSb2xlIGluXG5cbiAgICBjb25zdCBjYW5kaWRhdGVBY3Rpb25SZXNvdXJjZVN0YWNrID0gYWN0aW9uLmFjdGlvblByb3BlcnRpZXMucmVzb3VyY2VcbiAgICAgID8gU3RhY2sub2YoYWN0aW9uLmFjdGlvblByb3BlcnRpZXMucmVzb3VyY2UpXG4gICAgICA6IHVuZGVmaW5lZDtcbiAgICBpZiAoY2FuZGlkYXRlQWN0aW9uUmVzb3VyY2VTdGFjaz8uYWNjb3VudCA9PT0gdGFyZ2V0QWNjb3VudCkge1xuICAgICAgLy8gd2UgYWx3YXlzIHVzZSB0aGUgXCJsYXRlc3RcIiBhY3Rpb24tYmFja2luZyByZXNvdXJjZSdzIFN0YWNrIGZvciB0aGlzIGFjY291bnQsXG4gICAgICAvLyBldmVuIGlmIGEgZGlmZmVyZW50IG9uZSB3YXMgdXNlZCBlYXJsaWVyXG4gICAgICB0aGlzLl9jcm9zc0FjY291bnRTdXBwb3J0W3RhcmdldEFjY291bnRdID0gY2FuZGlkYXRlQWN0aW9uUmVzb3VyY2VTdGFjaztcbiAgICAgIHJldHVybiBjYW5kaWRhdGVBY3Rpb25SZXNvdXJjZVN0YWNrO1xuICAgIH1cblxuICAgIGxldCB0YXJnZXRBY2NvdW50U3RhY2s6IFN0YWNrIHwgdW5kZWZpbmVkID0gdGhpcy5fY3Jvc3NBY2NvdW50U3VwcG9ydFt0YXJnZXRBY2NvdW50XTtcbiAgICBpZiAoIXRhcmdldEFjY291bnRTdGFjaykge1xuICAgICAgY29uc3Qgc3RhY2tJZCA9IGBjcm9zcy1hY2NvdW50LXN1cHBvcnQtc3RhY2stJHt0YXJnZXRBY2NvdW50fWA7XG4gICAgICBjb25zdCBhcHAgPSB0aGlzLnN1cHBvcnRTY29wZSgpO1xuICAgICAgdGFyZ2V0QWNjb3VudFN0YWNrID0gYXBwLm5vZGUudHJ5RmluZENoaWxkKHN0YWNrSWQpIGFzIFN0YWNrO1xuICAgICAgaWYgKCF0YXJnZXRBY2NvdW50U3RhY2spIHtcbiAgICAgICAgY29uc3QgYWN0aW9uUmVnaW9uID0gYWN0aW9uLmFjdGlvblByb3BlcnRpZXMucmVzb3VyY2VcbiAgICAgICAgICA/IGFjdGlvbi5hY3Rpb25Qcm9wZXJ0aWVzLnJlc291cmNlLmVudi5yZWdpb25cbiAgICAgICAgICA6IGFjdGlvbi5hY3Rpb25Qcm9wZXJ0aWVzLnJlZ2lvbjtcbiAgICAgICAgY29uc3QgcGlwZWxpbmVTdGFjayA9IFN0YWNrLm9mKHRoaXMpO1xuICAgICAgICB0YXJnZXRBY2NvdW50U3RhY2sgPSBuZXcgU3RhY2soYXBwLCBzdGFja0lkLCB7XG4gICAgICAgICAgc3RhY2tOYW1lOiBgJHtwaXBlbGluZVN0YWNrLnN0YWNrTmFtZX0tc3VwcG9ydC0ke3RhcmdldEFjY291bnR9YCxcbiAgICAgICAgICBlbnY6IHtcbiAgICAgICAgICAgIGFjY291bnQ6IHRhcmdldEFjY291bnQsXG4gICAgICAgICAgICByZWdpb246IGFjdGlvblJlZ2lvbiA/PyBwaXBlbGluZVN0YWNrLnJlZ2lvbixcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2Nyb3NzQWNjb3VudFN1cHBvcnRbdGFyZ2V0QWNjb3VudF0gPSB0YXJnZXRBY2NvdW50U3RhY2s7XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXRBY2NvdW50U3RhY2s7XG4gIH1cblxuICBwcml2YXRlIGlzQXdzT3duZWQoYWN0aW9uOiBJQWN0aW9uKSB7XG4gICAgY29uc3Qgb3duZXIgPSBhY3Rpb24uYWN0aW9uUHJvcGVydGllcy5vd25lcjtcbiAgICByZXR1cm4gIW93bmVyIHx8IG93bmVyID09PSAnQVdTJztcbiAgfVxuXG4gIHByaXZhdGUgZ2V0QXJ0aWZhY3RCdWNrZXRGcm9tUHJvcHMocHJvcHM6IFBpcGVsaW5lUHJvcHMpOiBzMy5JQnVja2V0IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAocHJvcHMuYXJ0aWZhY3RCdWNrZXQpIHtcbiAgICAgIHJldHVybiBwcm9wcy5hcnRpZmFjdEJ1Y2tldDtcbiAgICB9XG4gICAgaWYgKHByb3BzLmNyb3NzUmVnaW9uUmVwbGljYXRpb25CdWNrZXRzKSB7XG4gICAgICBjb25zdCBwaXBlbGluZVJlZ2lvbiA9IHRoaXMucmVxdWlyZVJlZ2lvbigpO1xuICAgICAgcmV0dXJuIHByb3BzLmNyb3NzUmVnaW9uUmVwbGljYXRpb25CdWNrZXRzW3BpcGVsaW5lUmVnaW9uXTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByaXZhdGUgY2FsY3VsYXRlSW5zZXJ0SW5kZXhGcm9tUGxhY2VtZW50KHBsYWNlbWVudDogU3RhZ2VQbGFjZW1lbnQpOiBudW1iZXIge1xuICAgIC8vIGNoZWNrIGlmIGF0IG1vc3Qgb25lIHBsYWNlbWVudCBwcm9wZXJ0eSB3YXMgcHJvdmlkZWRcbiAgICBjb25zdCBwcm92aWRlZFBsYWNlbWVudFByb3BzID0gWydyaWdodEJlZm9yZScsICdqdXN0QWZ0ZXInLCAnYXRJbmRleCddXG4gICAgICAuZmlsdGVyKChwcm9wKSA9PiAocGxhY2VtZW50IGFzIGFueSlbcHJvcF0gIT09IHVuZGVmaW5lZCk7XG4gICAgaWYgKHByb3ZpZGVkUGxhY2VtZW50UHJvcHMubGVuZ3RoID4gMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBhZGRpbmcgU3RhZ2UgdG8gdGhlIFBpcGVsaW5lOiAnICtcbiAgICAgICAgJ3lvdSBjYW4gb25seSBwcm92aWRlIGF0IG1vc3Qgb25lIHBsYWNlbWVudCBwcm9wZXJ0eSwgYnV0ICcgK1xuICAgICAgICBgJyR7cHJvdmlkZWRQbGFjZW1lbnRQcm9wcy5qb2luKCcsICcpfScgd2VyZSBnaXZlbmApO1xuICAgIH1cblxuICAgIGlmIChwbGFjZW1lbnQucmlnaHRCZWZvcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgdGFyZ2V0SW5kZXggPSB0aGlzLmZpbmRTdGFnZUluZGV4KHBsYWNlbWVudC5yaWdodEJlZm9yZSk7XG4gICAgICBpZiAodGFyZ2V0SW5kZXggPT09IC0xKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgYWRkaW5nIFN0YWdlIHRvIHRoZSBQaXBlbGluZTogJyArXG4gICAgICAgICAgYHRoZSByZXF1ZXN0ZWQgU3RhZ2UgdG8gYWRkIGl0IGJlZm9yZSwgJyR7cGxhY2VtZW50LnJpZ2h0QmVmb3JlLnN0YWdlTmFtZX0nLCB3YXMgbm90IGZvdW5kYCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGFyZ2V0SW5kZXg7XG4gICAgfVxuXG4gICAgaWYgKHBsYWNlbWVudC5qdXN0QWZ0ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgdGFyZ2V0SW5kZXggPSB0aGlzLmZpbmRTdGFnZUluZGV4KHBsYWNlbWVudC5qdXN0QWZ0ZXIpO1xuICAgICAgaWYgKHRhcmdldEluZGV4ID09PSAtMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGFkZGluZyBTdGFnZSB0byB0aGUgUGlwZWxpbmU6ICcgK1xuICAgICAgICAgIGB0aGUgcmVxdWVzdGVkIFN0YWdlIHRvIGFkZCBpdCBhZnRlciwgJyR7cGxhY2VtZW50Lmp1c3RBZnRlci5zdGFnZU5hbWV9Jywgd2FzIG5vdCBmb3VuZGApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRhcmdldEluZGV4ICsgMTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdGFnZUNvdW50O1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kU3RhZ2VJbmRleCh0YXJnZXRTdGFnZTogSVN0YWdlKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YWdlcy5maW5kSW5kZXgoc3RhZ2UgPT4gc3RhZ2UgPT09IHRhcmdldFN0YWdlKTtcbiAgfVxuXG4gIHByaXZhdGUgdmFsaWRhdGVTb3VyY2VBY3Rpb25Mb2NhdGlvbnMoKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gICAgbGV0IGZpcnN0U3RhZ2UgPSB0cnVlO1xuICAgIGZvciAoY29uc3Qgc3RhZ2Ugb2YgdGhpcy5fc3RhZ2VzKSB7XG4gICAgICBjb25zdCBvbmx5U291cmNlQWN0aW9uc1Blcm1pdHRlZCA9IGZpcnN0U3RhZ2U7XG4gICAgICBmb3IgKGNvbnN0IGFjdGlvbiBvZiBzdGFnZS5hY3Rpb25EZXNjcmlwdG9ycykge1xuICAgICAgICBlcnJvcnMucHVzaCguLi52YWxpZGF0ZVNvdXJjZUFjdGlvbihvbmx5U291cmNlQWN0aW9uc1Blcm1pdHRlZCwgYWN0aW9uLmNhdGVnb3J5LCBhY3Rpb24uYWN0aW9uTmFtZSwgc3RhZ2Uuc3RhZ2VOYW1lKSk7XG4gICAgICB9XG4gICAgICBmaXJzdFN0YWdlID0gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBlcnJvcnM7XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlSGFzU3RhZ2VzKCk6IHN0cmluZ1tdIHtcbiAgICBpZiAodGhpcy5zdGFnZUNvdW50IDwgMikge1xuICAgICAgcmV0dXJuIFsnUGlwZWxpbmUgbXVzdCBoYXZlIGF0IGxlYXN0IHR3byBzdGFnZXMnXTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZVN0YWdlcygpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgcmV0ID0gbmV3IEFycmF5PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IHN0YWdlIG9mIHRoaXMuX3N0YWdlcykge1xuICAgICAgcmV0LnB1c2goLi4uc3RhZ2UudmFsaWRhdGUoKSk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlQXJ0aWZhY3RzKCk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCByZXQgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG4gICAgY29uc3QgcHJvZHVjZXJzOiBSZWNvcmQ8c3RyaW5nLCBQaXBlbGluZUxvY2F0aW9uPiA9IHt9O1xuICAgIGNvbnN0IGZpcnN0Q29uc3VtZXJzOiBSZWNvcmQ8c3RyaW5nLCBQaXBlbGluZUxvY2F0aW9uPiA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBbc3RhZ2VJbmRleCwgc3RhZ2VdIG9mIGVudW1lcmF0ZSh0aGlzLl9zdGFnZXMpKSB7XG4gICAgICAvLyBGb3IgZXZlcnkgb3V0cHV0IGFydGlmYWN0LCBnZXQgdGhlIHByb2R1Y2VyXG4gICAgICBmb3IgKGNvbnN0IGFjdGlvbiBvZiBzdGFnZS5hY3Rpb25EZXNjcmlwdG9ycykge1xuICAgICAgICBjb25zdCBhY3Rpb25Mb2MgPSBuZXcgUGlwZWxpbmVMb2NhdGlvbihzdGFnZUluZGV4LCBzdGFnZSwgYWN0aW9uKTtcblxuICAgICAgICBmb3IgKGNvbnN0IG91dHB1dEFydGlmYWN0IG9mIGFjdGlvbi5vdXRwdXRzKSB7XG4gICAgICAgICAgLy8gb3V0cHV0IEFydGlmYWN0cyBhbHdheXMgaGF2ZSBhIG5hbWUgc2V0XG4gICAgICAgICAgY29uc3QgbmFtZSA9IG91dHB1dEFydGlmYWN0LmFydGlmYWN0TmFtZSE7XG4gICAgICAgICAgaWYgKHByb2R1Y2Vyc1tuYW1lXSkge1xuICAgICAgICAgICAgcmV0LnB1c2goYEJvdGggQWN0aW9ucyAnJHtwcm9kdWNlcnNbbmFtZV0uYWN0aW9uTmFtZX0nIGFuZCAnJHthY3Rpb24uYWN0aW9uTmFtZX0nIGFyZSBwcm9kdWN0aW5nIEFydGlmYWN0ICcke25hbWV9Jy4gRXZlcnkgYXJ0aWZhY3QgY2FuIG9ubHkgYmUgcHJvZHVjZWQgb25jZS5gKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHByb2R1Y2Vyc1tuYW1lXSA9IGFjdGlvbkxvYztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZvciBldmVyeSBpbnB1dCBhcnRpZmFjdCwgZ2V0IHRoZSBmaXJzdCBjb25zdW1lclxuICAgICAgICBmb3IgKGNvbnN0IGlucHV0QXJ0aWZhY3Qgb2YgYWN0aW9uLmlucHV0cykge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSBpbnB1dEFydGlmYWN0LmFydGlmYWN0TmFtZTtcbiAgICAgICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgICAgIHJldC5wdXNoKGBBY3Rpb24gJyR7YWN0aW9uLmFjdGlvbk5hbWV9JyBpcyB1c2luZyBhbiB1bm5hbWVkIGlucHV0IEFydGlmYWN0LCB3aGljaCBpcyBub3QgYmVpbmcgcHJvZHVjZWQgaW4gdGhpcyBwaXBlbGluZWApO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZmlyc3RDb25zdW1lcnNbbmFtZV0gPSBmaXJzdENvbnN1bWVyc1tuYW1lXSA/IGZpcnN0Q29uc3VtZXJzW25hbWVdLmZpcnN0KGFjdGlvbkxvYykgOiBhY3Rpb25Mb2M7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOb3cgdmFsaWRhdGUgdGhhdCBldmVyeSBpbnB1dCBhcnRpZmFjdCBpcyBwcm9kdWNlZCBiZWZvcmUgaXQnc1xuICAgIC8vIGJlaW5nIGNvbnN1bWVkLlxuICAgIGZvciAoY29uc3QgW2FydGlmYWN0TmFtZSwgY29uc3VtZXJMb2NdIG9mIE9iamVjdC5lbnRyaWVzKGZpcnN0Q29uc3VtZXJzKSkge1xuICAgICAgY29uc3QgcHJvZHVjZXJMb2MgPSBwcm9kdWNlcnNbYXJ0aWZhY3ROYW1lXTtcbiAgICAgIGlmICghcHJvZHVjZXJMb2MpIHtcbiAgICAgICAgcmV0LnB1c2goYEFjdGlvbiAnJHtjb25zdW1lckxvYy5hY3Rpb25OYW1lfScgaXMgdXNpbmcgaW5wdXQgQXJ0aWZhY3QgJyR7YXJ0aWZhY3ROYW1lfScsIHdoaWNoIGlzIG5vdCBiZWluZyBwcm9kdWNlZCBpbiB0aGlzIHBpcGVsaW5lYCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uc3VtZXJMb2MuYmVmb3JlT3JFcXVhbChwcm9kdWNlckxvYykpIHtcbiAgICAgICAgcmV0LnB1c2goYCR7Y29uc3VtZXJMb2N9IGlzIGNvbnN1bWluZyBpbnB1dCBBcnRpZmFjdCAnJHthcnRpZmFjdE5hbWV9JyBiZWZvcmUgaXQgaXMgYmVpbmcgcHJvZHVjZWQgYXQgJHtwcm9kdWNlckxvY31gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJBcnRpZmFjdFN0b3Jlc1Byb3BlcnR5KCk6IENmblBpcGVsaW5lLkFydGlmYWN0U3RvcmVNYXBQcm9wZXJ0eVtdIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIXRoaXMuY3Jvc3NSZWdpb24pIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuXG4gICAgLy8gYWRkIHRoZSBQaXBlbGluZSdzIGFydGlmYWN0IHN0b3JlXG4gICAgY29uc3QgcHJpbWFyeVJlZ2lvbiA9IHRoaXMucmVxdWlyZVJlZ2lvbigpO1xuICAgIHRoaXMuX2Nyb3NzUmVnaW9uU3VwcG9ydFtwcmltYXJ5UmVnaW9uXSA9IHtcbiAgICAgIHJlcGxpY2F0aW9uQnVja2V0OiB0aGlzLmFydGlmYWN0QnVja2V0LFxuICAgICAgc3RhY2s6IFN0YWNrLm9mKHRoaXMpLFxuICAgIH07XG5cbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXModGhpcy5fY3Jvc3NSZWdpb25TdXBwb3J0KS5tYXAoKFtyZWdpb24sIHN1cHBvcnRdKSA9PiAoe1xuICAgICAgcmVnaW9uLFxuICAgICAgYXJ0aWZhY3RTdG9yZTogdGhpcy5yZW5kZXJBcnRpZmFjdFN0b3JlKHN1cHBvcnQucmVwbGljYXRpb25CdWNrZXQpLFxuICAgIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyQXJ0aWZhY3RTdG9yZVByb3BlcnR5KCk6IENmblBpcGVsaW5lLkFydGlmYWN0U3RvcmVQcm9wZXJ0eSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHRoaXMuY3Jvc3NSZWdpb24pIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICAgIHJldHVybiB0aGlzLnJlbmRlclByaW1hcnlBcnRpZmFjdFN0b3JlKCk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclByaW1hcnlBcnRpZmFjdFN0b3JlKCk6IENmblBpcGVsaW5lLkFydGlmYWN0U3RvcmVQcm9wZXJ0eSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyQXJ0aWZhY3RTdG9yZSh0aGlzLmFydGlmYWN0QnVja2V0KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyQXJ0aWZhY3RTdG9yZShidWNrZXQ6IHMzLklCdWNrZXQpOiBDZm5QaXBlbGluZS5BcnRpZmFjdFN0b3JlUHJvcGVydHkge1xuICAgIGxldCBlbmNyeXB0aW9uS2V5OiBDZm5QaXBlbGluZS5FbmNyeXB0aW9uS2V5UHJvcGVydHkgfCB1bmRlZmluZWQ7XG4gICAgY29uc3QgYnVja2V0S2V5ID0gYnVja2V0LmVuY3J5cHRpb25LZXk7XG4gICAgaWYgKGJ1Y2tldEtleSkge1xuICAgICAgZW5jcnlwdGlvbktleSA9IHtcbiAgICAgICAgdHlwZTogJ0tNUycsXG4gICAgICAgIGlkOiBidWNrZXRLZXkua2V5QXJuLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ1MzJyxcbiAgICAgIGxvY2F0aW9uOiBidWNrZXQuYnVja2V0TmFtZSxcbiAgICAgIGVuY3J5cHRpb25LZXksXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IGNyb3NzUmVnaW9uKCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLmNyb3NzUmVnaW9uQnVja2V0c1Bhc3NlZCkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgIHJldHVybiB0aGlzLl9zdGFnZXMuc29tZShzdGFnZSA9PiBzdGFnZS5hY3Rpb25EZXNjcmlwdG9ycy5zb21lKGFjdGlvbiA9PiBhY3Rpb24ucmVnaW9uICE9PSB1bmRlZmluZWQpKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyU3RhZ2VzKCk6IENmblBpcGVsaW5lLlN0YWdlRGVjbGFyYXRpb25Qcm9wZXJ0eVtdIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhZ2VzLm1hcChzdGFnZSA9PiBzdGFnZS5yZW5kZXIoKSk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckRpc2FibGVkVHJhbnNpdGlvbnMoKTogQ2ZuUGlwZWxpbmUuU3RhZ2VUcmFuc2l0aW9uUHJvcGVydHlbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YWdlc1xuICAgICAgLmZpbHRlcihzdGFnZSA9PiAhc3RhZ2UudHJhbnNpdGlvblRvRW5hYmxlZClcbiAgICAgIC5tYXAoc3RhZ2UgPT4gKHtcbiAgICAgICAgcmVhc29uOiBzdGFnZS50cmFuc2l0aW9uRGlzYWJsZWRSZWFzb24sXG4gICAgICAgIHN0YWdlTmFtZTogc3RhZ2Uuc3RhZ2VOYW1lLFxuICAgICAgfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSByZXF1aXJlUmVnaW9uKCk6IHN0cmluZyB7XG4gICAgY29uc3QgcmVnaW9uID0gdGhpcy5lbnYucmVnaW9uO1xuICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQocmVnaW9uKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQaXBlbGluZSBzdGFjayB3aGljaCB1c2VzIGNyb3NzLWVudmlyb25tZW50IGFjdGlvbnMgbXVzdCBoYXZlIGFuIGV4cGxpY2l0bHkgc2V0IHJlZ2lvbicpO1xuICAgIH1cbiAgICByZXR1cm4gcmVnaW9uO1xuICB9XG5cbiAgcHJpdmF0ZSBzdXBwb3J0U2NvcGUoKTogQ2RrU3RhZ2Uge1xuICAgIGNvbnN0IHNjb3BlID0gQ2RrU3RhZ2Uub2YodGhpcyk7XG4gICAgaWYgKCFzY29wZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQaXBlbGluZSBzdGFjayB3aGljaCB1c2VzIGNyb3NzLWVudmlyb25tZW50IGFjdGlvbnMgbXVzdCBiZSBwYXJ0IG9mIGEgQ0RLIEFwcCBvciBTdGFnZScpO1xuICAgIH1cbiAgICByZXR1cm4gc2NvcGU7XG4gIH1cbn1cblxuLyoqXG4gKiBBbiBpbnRlcmZhY2UgcmVwcmVzZW50aW5nIHJlc291cmNlcyBnZW5lcmF0ZWQgaW4gb3JkZXIgdG8gc3VwcG9ydFxuICogdGhlIGNyb3NzLXJlZ2lvbiBjYXBhYmlsaXRpZXMgb2YgQ29kZVBpcGVsaW5lLlxuICogWW91IGdldCBpbnN0YW5jZXMgb2YgdGhpcyBpbnRlcmZhY2UgZnJvbSB0aGUgYFBpcGVsaW5lI2Nyb3NzUmVnaW9uU3VwcG9ydGAgcHJvcGVydHkuXG4gKlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENyb3NzUmVnaW9uU3VwcG9ydCB7XG4gIC8qKlxuICAgKiBUaGUgU3RhY2sgdGhhdCBoYXMgYmVlbiBjcmVhdGVkIHRvIGhvdXNlIHRoZSByZXBsaWNhdGlvbiBCdWNrZXRcbiAgICogcmVxdWlyZWQgZm9yIHRoaXMgIHJlZ2lvbi5cbiAgICovXG4gIHJlYWRvbmx5IHN0YWNrOiBTdGFjaztcblxuICAvKipcbiAgICogVGhlIHJlcGxpY2F0aW9uIEJ1Y2tldCB1c2VkIGJ5IENvZGVQaXBlbGluZSB0byBvcGVyYXRlIGluIHRoaXMgcmVnaW9uLlxuICAgKiBCZWxvbmdzIHRvIGBzdGFja2AuXG4gICAqL1xuICByZWFkb25seSByZXBsaWNhdGlvbkJ1Y2tldDogczMuSUJ1Y2tldDtcbn1cblxuaW50ZXJmYWNlIENyb3NzUmVnaW9uSW5mbyB7XG4gIHJlYWRvbmx5IGFydGlmYWN0QnVja2V0OiBzMy5JQnVja2V0O1xuXG4gIHJlYWRvbmx5IHJlZ2lvbj86IHN0cmluZztcbn1cblxuZnVuY3Rpb24gZW51bWVyYXRlPEE+KHhzOiBBW10pOiBBcnJheTxbbnVtYmVyLCBBXT4ge1xuICBjb25zdCByZXQgPSBuZXcgQXJyYXk8W251bWJlciwgQV0+KCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICByZXQucHVzaChbaSwgeHNbaV1dKTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5jbGFzcyBQaXBlbGluZUxvY2F0aW9uIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBzdGFnZUluZGV4OiBudW1iZXIsIHByaXZhdGUgcmVhZG9ubHkgc3RhZ2U6IElTdGFnZSwgcHJpdmF0ZSByZWFkb25seSBhY3Rpb246IEZ1bGxBY3Rpb25EZXNjcmlwdG9yKSB7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHN0YWdlTmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFnZS5zdGFnZU5hbWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGFjdGlvbk5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aW9uLmFjdGlvbk5hbWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyIGEgaXMgYmVmb3JlIG9yIHRoZSBzYW1lIG9yZGVyIGFzIGJcbiAgICovXG4gIHB1YmxpYyBiZWZvcmVPckVxdWFsKHJoczogUGlwZWxpbmVMb2NhdGlvbikge1xuICAgIGlmICh0aGlzLnN0YWdlSW5kZXggIT09IHJocy5zdGFnZUluZGV4KSB7IHJldHVybiByaHMuc3RhZ2VJbmRleCA8IHJocy5zdGFnZUluZGV4OyB9XG4gICAgcmV0dXJuIHRoaXMuYWN0aW9uLnJ1bk9yZGVyIDw9IHJocy5hY3Rpb24ucnVuT3JkZXI7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZmlyc3QgbG9jYXRpb24gYmV0d2VlbiB0aGlzIGFuZCB0aGUgb3RoZXIgb25lXG4gICAqL1xuICBwdWJsaWMgZmlyc3QocmhzOiBQaXBlbGluZUxvY2F0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuYmVmb3JlT3JFcXVhbChyaHMpID8gdGhpcyA6IHJocztcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICAvLyBydW5PcmRlcnMgYXJlIDEtYmFzZWQsIHNvIG1ha2UgdGhlIHN0YWdlSW5kZXggYWxzbyAxLWJhc2VkIG90aGVyd2lzZSBpdCdzIGdvaW5nIHRvIGJlIGNvbmZ1c2luZy5cbiAgICByZXR1cm4gYFN0YWdlICR7dGhpcy5zdGFnZUluZGV4ICsgMX0gQWN0aW9uICR7dGhpcy5hY3Rpb24ucnVuT3JkZXJ9ICgnJHt0aGlzLnN0YWdlTmFtZX0nLycke3RoaXMuYWN0aW9uTmFtZX0nKWA7XG4gIH1cbn1cblxuLyoqXG4gKiBSZW5kZXIgYW4gZW52IGRpbWVuc2lvbiB3aXRob3V0IHNob3dpbmcgdGhlIHVnbHkgc3RyaW5naWZpZWQgdG9rZW5zXG4gKi9cbmZ1bmN0aW9uIHJlbmRlckVudkRpbWVuc2lvbihzOiBzdHJpbmcgfCB1bmRlZmluZWQpIHtcbiAgcmV0dXJuIFRva2VuLmlzVW5yZXNvbHZlZChzKSA/ICcoY3VycmVudCknIDogcztcbn1cbiJdfQ==