import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IAction, IPipeline, IStage, PipelineNotifyOnOptions } from './action';
import { FullActionDescriptor } from './private/full-action-descriptor';
import { Stage } from './private/stage';
/**
 * Allows you to control where to place a new Stage when it's added to the Pipeline.
 * Note that you can provide only one of the below properties -
 * specifying more than one will result in a validation error.
 *
 * @see #rightBefore
 * @see #justAfter
 */
export interface StagePlacement {
    /**
     * Inserts the new Stage as a parent of the given Stage
     * (changing its current parent Stage, if it had one).
     */
    readonly rightBefore?: IStage;
    /**
     * Inserts the new Stage as a child of the given Stage
     * (changing its current child Stage, if it had one).
     */
    readonly justAfter?: IStage;
}
/**
 * Construction properties of a Pipeline Stage.
 */
export interface StageProps {
    /**
     * The physical, human-readable name to assign to this Pipeline Stage.
     */
    readonly stageName: string;
    /**
     * The list of Actions to create this Stage with.
     * You can always add more Actions later by calling `IStage#addAction`.
     */
    readonly actions?: IAction[];
    /**
     * Whether to enable transition to this stage.
     *
     * @default true
     */
    readonly transitionToEnabled?: boolean;
    /**
     * The reason for disabling transition to this stage. Only applicable
     * if `transitionToEnabled` is set to `false`.
     *
     * @default 'Transition disabled'
     */
    readonly transitionDisabledReason?: string;
}
export interface StageOptions extends StageProps {
    readonly placement?: StagePlacement;
}
export interface PipelineProps {
    /**
     * The S3 bucket used by this Pipeline to store artifacts.
     *
     * @default - A new S3 bucket will be created.
     */
    readonly artifactBucket?: s3.IBucket;
    /**
     * The IAM role to be assumed by this Pipeline.
     *
     * @default a new IAM role will be created.
     */
    readonly role?: iam.IRole;
    /**
     * Indicates whether to rerun the AWS CodePipeline pipeline after you update it.
     *
     * @default false
     */
    readonly restartExecutionOnUpdate?: boolean;
    /**
     * Name of the pipeline.
     *
     * @default - AWS CloudFormation generates an ID and uses that for the pipeline name.
     */
    readonly pipelineName?: string;
    /**
     * A map of region to S3 bucket name used for cross-region CodePipeline.
     * For every Action that you specify targeting a different region than the Pipeline itself,
     * if you don't provide an explicit Bucket for that region using this property,
     * the construct will automatically create a Stack containing an S3 Bucket in that region.
     *
     * @default - None.
     */
    readonly crossRegionReplicationBuckets?: {
        [region: string]: s3.IBucket;
    };
    /**
     * The list of Stages, in order,
     * to create this Pipeline with.
     * You can always add more Stages later by calling `Pipeline#addStage`.
     *
     * @default - None.
     */
    readonly stages?: StageProps[];
    /**
     * Create KMS keys for cross-account deployments.
     *
     * This controls whether the pipeline is enabled for cross-account deployments.
     *
     * By default cross-account deployments are enabled, but this feature requires
     * that KMS Customer Master Keys are created which have a cost of $1/month.
     *
     * If you do not need cross-account deployments, you can set this to `false` to
     * not create those keys and save on that cost (the artifact bucket will be
     * encrypted with an AWS-managed key). However, cross-account deployments will
     * no longer be possible.
     *
     * @default true
     */
    readonly crossAccountKeys?: boolean;
    /**
     * Enable KMS key rotation for the generated KMS keys.
     *
     * By default KMS key rotation is disabled, but will add an additional $1/month
     * for each year the key exists when enabled.
     *
     * @default - false (key rotation is disabled)
     */
    readonly enableKeyRotation?: boolean;
    /**
     * Reuse the same cross region support stack for all pipelines in the App.
     *
     * @default - true (Use the same support stack for all pipelines in App)
     */
    readonly reuseCrossRegionSupportStacks?: boolean;
}
declare abstract class PipelineBase extends Resource implements IPipeline {
    abstract readonly pipelineName: string;
    abstract readonly pipelineArn: string;
    /**
     * Defines an event rule triggered by this CodePipeline.
     *
     * @param id Identifier for this event handler.
     * @param options Additional options to pass to the event rule.
     */
    onEvent(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines an event rule triggered by the "CodePipeline Pipeline Execution
     * State Change" event emitted from this pipeline.
     *
     * @param id Identifier for this event handler.
     * @param options Additional options to pass to the event rule.
     */
    onStateChange(id: string, options?: events.OnEventOptions): events.Rule;
    bindAsNotificationRuleSource(_scope: Construct): notifications.NotificationRuleSourceConfig;
    notifyOn(id: string, target: notifications.INotificationRuleTarget, options: PipelineNotifyOnOptions): notifications.INotificationRule;
    notifyOnExecutionStateChange(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
    notifyOnAnyStageStateChange(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
    notifyOnAnyActionStateChange(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
    notifyOnAnyManualApprovalStateChange(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
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
export declare class Pipeline extends PipelineBase {
    /**
     * Import a pipeline into this app.
     *
     * @param scope the scope into which to import this pipeline
     * @param id the logical ID of the returned pipeline construct
     * @param pipelineArn The ARN of the pipeline (e.g. `arn:aws:codepipeline:us-east-1:123456789012:MyDemoPipeline`)
     */
    static fromPipelineArn(scope: Construct, id: string, pipelineArn: string): IPipeline;
    /**
     * The IAM role AWS CodePipeline will use to perform actions or assume roles for actions with
     * a more specific IAM role.
     */
    readonly role: iam.IRole;
    /**
     * ARN of this pipeline
     */
    readonly pipelineArn: string;
    /**
     * The name of the pipeline
     */
    readonly pipelineName: string;
    /**
     * The version of the pipeline
     *
     * @attribute
     */
    readonly pipelineVersion: string;
    /**
     * Bucket used to store output artifacts
     */
    readonly artifactBucket: s3.IBucket;
    private readonly _stages;
    private readonly crossRegionBucketsPassed;
    private readonly _crossRegionSupport;
    private readonly _crossAccountSupport;
    private readonly crossAccountKeys;
    private readonly enableKeyRotation?;
    private readonly reuseCrossRegionSupportStacks;
    private readonly codePipeline;
    constructor(scope: Construct, id: string, props?: PipelineProps);
    /**
     * Creates a new Stage, and adds it to this Pipeline.
     *
     * @param props the creation properties of the new Stage
     * @returns the newly created Stage
     */
    addStage(props: StageOptions): IStage;
    /**
     * Adds a statement to the pipeline role.
     */
    addToRolePolicy(statement: iam.PolicyStatement): void;
    /**
     * Get the number of Stages in this Pipeline.
     */
    get stageCount(): number;
    /**
     * Returns the stages that comprise the pipeline.
     *
     * **Note**: the returned array is a defensive copy,
     * so adding elements to it has no effect.
     * Instead, use the `addStage` method if you want to add more stages
     * to the pipeline.
     */
    get stages(): IStage[];
    /**
     * Access one of the pipeline's stages by stage name
     */
    stage(stageName: string): IStage;
    /**
     * Returns all of the `CrossRegionSupportStack`s that were generated automatically
     * when dealing with Actions that reside in a different region than the Pipeline itself.
     *
     */
    get crossRegionSupport(): {
        [region: string]: CrossRegionSupport;
    };
    /** @internal */
    _attachActionToPipeline(stage: Stage, action: IAction, actionScope: Construct): FullActionDescriptor;
    /**
     * Validate the pipeline structure
     *
     * Validation happens according to the rules documented at
     *
     * https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#pipeline-requirements
     */
    private validatePipeline;
    private ensureReplicationResourcesExistFor;
    /**
     * Get or create the cross-region support construct for the given action
     */
    private obtainCrossRegionSupportFor;
    private createSupportResourcesForRegion;
    private getCrossRegionSupportSynthesizer;
    private generateNameForDefaultBucketKeyAlias;
    /**
     * Gets the role used for this action,
     * including handling the case when the action is supposed to be cross-account.
     *
     * @param stage the stage the action belongs to
     * @param action the action to return/create a role for
     * @param actionScope the scope, unique to the action, to create new resources in
     */
    private getRoleForAction;
    private getRoleFromActionPropsOrGenerateIfCrossAccount;
    /**
     * Returns the Stack this Action belongs to if this is a cross-account Action.
     * If this Action is not cross-account (i.e., it lives in the same account as the Pipeline),
     * it returns undefined.
     *
     * @param action the Action to return the Stack for
     */
    private getOtherStackIfActionIsCrossAccount;
    private isAwsOwned;
    private getArtifactBucketFromProps;
    private calculateInsertIndexFromPlacement;
    private findStageIndex;
    private validateSourceActionLocations;
    private validateHasStages;
    private validateStages;
    private validateArtifacts;
    private renderArtifactStoresProperty;
    private renderArtifactStoreProperty;
    private renderPrimaryArtifactStore;
    private renderArtifactStore;
    private get crossRegion();
    private renderStages;
    private renderDisabledTransitions;
    private requireRegion;
    private supportScope;
}
/**
 * An interface representing resources generated in order to support
 * the cross-region capabilities of CodePipeline.
 * You get instances of this interface from the `Pipeline#crossRegionSupport` property.
 *
 */
export interface CrossRegionSupport {
    /**
     * The Stack that has been created to house the replication Bucket
     * required for this  region.
     */
    readonly stack: Stack;
    /**
     * The replication Bucket used by CodePipeline to operate in this region.
     * Belongs to `stack`.
     */
    readonly replicationBucket: s3.IBucket;
}
export {};
