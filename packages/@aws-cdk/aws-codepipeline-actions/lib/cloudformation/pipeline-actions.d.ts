import * as cloudformation from '@aws-cdk/aws-cloudformation';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Action } from '../action';
/**
 * Properties common to all CloudFormation actions
 */
interface CloudFormationActionProps extends codepipeline.CommonAwsActionProps {
    /**
     * The name of the stack to apply this action to
     */
    readonly stackName: string;
    /**
     * A name for the filename in the output artifact to store the AWS CloudFormation call's result.
     *
     * The file will contain the result of the call to AWS CloudFormation (for example
     * the call to UpdateStack or CreateChangeSet).
     *
     * AWS CodePipeline adds the file to the output artifact after performing
     * the specified action.
     *
     * @default No output artifact generated
     */
    readonly outputFileName?: string;
    /**
     * The name of the output artifact to generate
     *
     * Only applied if `outputFileName` is set as well.
     *
     * @default Automatically generated artifact name.
     */
    readonly output?: codepipeline.Artifact;
    /**
     * The AWS region the given Action resides in.
     * Note that a cross-region Pipeline requires replication buckets to function correctly.
     * You can provide their names with the `PipelineProps#crossRegionReplicationBuckets` property.
     * If you don't, the CodePipeline Construct will create new Stacks in your CDK app containing those buckets,
     * that you will need to `cdk deploy` before deploying the main, Pipeline-containing Stack.
     *
     * @default the Action resides in the same region as the Pipeline
     */
    readonly region?: string;
    /**
     * The AWS account this Action is supposed to operate in.
     * **Note**: if you specify the `role` property,
     * this is ignored - the action will operate in the same region the passed role does.
     *
     * @default - action resides in the same account as the pipeline
     */
    readonly account?: string;
}
/**
 * Base class for Actions that execute CloudFormation
 */
declare abstract class CloudFormationAction extends Action {
    private readonly props;
    constructor(props: CloudFormationActionProps, inputs: codepipeline.Artifact[] | undefined);
    protected bound(_scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
}
/**
 * Properties for the CloudFormationExecuteChangeSetAction.
 */
export interface CloudFormationExecuteChangeSetActionProps extends CloudFormationActionProps {
    /**
     * Name of the change set to execute.
     */
    readonly changeSetName: string;
}
/**
 * CodePipeline action to execute a prepared change set.
 */
export declare class CloudFormationExecuteChangeSetAction extends CloudFormationAction {
    private readonly props2;
    constructor(props: CloudFormationExecuteChangeSetActionProps);
    protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
}
/**
 * Properties common to CloudFormation actions that stage deployments
 */
interface CloudFormationDeployActionProps extends CloudFormationActionProps {
    /**
     * IAM role to assume when deploying changes.
     *
     * If not specified, a fresh role is created. The role is created with zero
     * permissions unless `adminPermissions` is true, in which case the role will have
     * full permissions.
     *
     * @default A fresh role with full or no permissions (depending on the value of `adminPermissions`).
     */
    readonly deploymentRole?: iam.IRole;
    /**
     * Acknowledge certain changes made as part of deployment
     *
     * For stacks that contain certain resources, explicit acknowledgement that AWS CloudFormation
     * might create or update those resources. For example, you must specify `AnonymousIAM` or `NamedIAM`
     * if your stack template contains AWS Identity and Access Management (IAM) resources. For more
     * information see the link below.
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities
     * @default None, unless `adminPermissions` is true
     * @deprecated use `cfnCapabilities` instead
     */
    readonly capabilities?: cloudformation.CloudFormationCapabilities[];
    /**
     * Acknowledge certain changes made as part of deployment.
     *
     * For stacks that contain certain resources,
     * explicit acknowledgement is required that AWS CloudFormation might create or update those resources.
     * For example, you must specify `ANONYMOUS_IAM` or `NAMED_IAM` if your stack template contains AWS
     * Identity and Access Management (IAM) resources.
     * For more information, see the link below.
     *
     * @default None, unless `adminPermissions` is true
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities
     */
    readonly cfnCapabilities?: cdk.CfnCapabilities[];
    /**
     * Whether to grant full permissions to CloudFormation while deploying this template.
     *
     * Setting this to `true` affects the defaults for `role` and `capabilities`, if you
     * don't specify any alternatives.
     *
     * The default role that will be created for you will have full (i.e., `*`)
     * permissions on all resources, and the deployment will have named IAM
     * capabilities (i.e., able to create all IAM resources).
     *
     * This is a shorthand that you can use if you fully trust the templates that
     * are deployed in this pipeline. If you want more fine-grained permissions,
     * use `addToRolePolicy` and `capabilities` to control what the CloudFormation
     * deployment is allowed to do.
     */
    readonly adminPermissions: boolean;
    /**
     * Input artifact to use for template parameters values and stack policy.
     *
     * The template configuration file should contain a JSON object that should look like this:
     * `{ "Parameters": {...}, "Tags": {...}, "StackPolicy": {... }}`. For more information,
     * see [AWS CloudFormation Artifacts](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/continuous-delivery-codepipeline-cfn-artifacts.html).
     *
     * Note that if you include sensitive information, such as passwords, restrict access to this
     * file.
     *
     * @default No template configuration based on input artifacts
     */
    readonly templateConfiguration?: codepipeline.ArtifactPath;
    /**
     * Additional template parameters.
     *
     * Template parameters specified here take precedence over template parameters
     * found in the artifact specified by the `templateConfiguration` property.
     *
     * We recommend that you use the template configuration file to specify
     * most of your parameter values. Use parameter overrides to specify only
     * dynamic parameter values (values that are unknown until you run the
     * pipeline).
     *
     * All parameter names must be present in the stack template.
     *
     * Note: the entire object cannot be more than 1kB.
     *
     * @default No overrides
     */
    readonly parameterOverrides?: {
        [name: string]: any;
    };
    /**
     * The list of additional input Artifacts for this Action.
     * This is especially useful when used in conjunction with the `parameterOverrides` property.
     * For example, if you have:
     *
     *   parameterOverrides: {
     *     'Param1': action1.outputArtifact.bucketName,
     *     'Param2': action2.outputArtifact.objectKey,
     *   }
     *
     * , if the output Artifacts of `action1` and `action2` were not used to
     * set either the `templateConfiguration` or the `templatePath` properties,
     * you need to make sure to include them in the `extraInputs` -
     * otherwise, you'll get an "unrecognized Artifact" error during your Pipeline's execution.
     */
    readonly extraInputs?: codepipeline.Artifact[];
}
/**
 * Base class for all CloudFormation actions that execute or stage deployments.
 */
declare abstract class CloudFormationDeployAction extends CloudFormationAction {
    private _deploymentRole?;
    private readonly props2;
    constructor(props: CloudFormationDeployActionProps, inputs: codepipeline.Artifact[] | undefined);
    /**
     * Add statement to the service role assumed by CloudFormation while executing this action.
     */
    addToDeploymentRolePolicy(statement: iam.PolicyStatement): boolean;
    get deploymentRole(): iam.IRole;
    protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
    private getDeploymentRole;
}
/**
 * Properties for the CloudFormationCreateReplaceChangeSetAction.
 */
export interface CloudFormationCreateReplaceChangeSetActionProps extends CloudFormationDeployActionProps {
    /**
     * Name of the change set to create or update.
     */
    readonly changeSetName: string;
    /**
     * Input artifact with the ChangeSet's CloudFormation template
     */
    readonly templatePath: codepipeline.ArtifactPath;
}
/**
 * CodePipeline action to prepare a change set.
 *
 * Creates the change set if it doesn't exist based on the stack name and template that you submit.
 * If the change set exists, AWS CloudFormation deletes it, and then creates a new one.
 */
export declare class CloudFormationCreateReplaceChangeSetAction extends CloudFormationDeployAction {
    private readonly props3;
    constructor(props: CloudFormationCreateReplaceChangeSetActionProps);
    protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
}
/**
 * Properties for the CloudFormationCreateUpdateStackAction.
 */
export interface CloudFormationCreateUpdateStackActionProps extends CloudFormationDeployActionProps {
    /**
     * Input artifact with the CloudFormation template to deploy
     */
    readonly templatePath: codepipeline.ArtifactPath;
    /**
     * Replace the stack if it's in a failed state.
     *
     * If this is set to true and the stack is in a failed state (one of
     * ROLLBACK_COMPLETE, ROLLBACK_FAILED, CREATE_FAILED, DELETE_FAILED, or
     * UPDATE_ROLLBACK_FAILED), AWS CloudFormation deletes the stack and then
     * creates a new stack.
     *
     * If this is not set to true and the stack is in a failed state,
     * the deployment fails.
     *
     * @default false
     */
    readonly replaceOnFailure?: boolean;
}
/**
 * CodePipeline action to deploy a stack.
 *
 * Creates the stack if the specified stack doesn't exist. If the stack exists,
 * AWS CloudFormation updates the stack. Use this action to update existing
 * stacks.
 *
 * AWS CodePipeline won't replace the stack, and will fail deployment if the
 * stack is in a failed state. Use `ReplaceOnFailure` for an action that
 * will delete and recreate the stack to try and recover from failed states.
 *
 * Use this action to automatically replace failed stacks without recovering or
 * troubleshooting them. You would typically choose this mode for testing.
 */
export declare class CloudFormationCreateUpdateStackAction extends CloudFormationDeployAction {
    private readonly props3;
    constructor(props: CloudFormationCreateUpdateStackActionProps);
    protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
}
/**
 * Properties for the CloudFormationDeleteStackAction.
 */
export interface CloudFormationDeleteStackActionProps extends CloudFormationDeployActionProps {
}
/**
 * CodePipeline action to delete a stack.
 *
 * Deletes a stack. If you specify a stack that doesn't exist, the action completes successfully
 * without deleting a stack.
 */
export declare class CloudFormationDeleteStackAction extends CloudFormationDeployAction {
    private readonly props3;
    constructor(props: CloudFormationDeleteStackActionProps);
    protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
}
export {};
