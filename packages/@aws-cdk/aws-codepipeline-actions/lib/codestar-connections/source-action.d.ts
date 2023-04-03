import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { Construct } from 'constructs';
import { Action } from '../action';
/**
 * The CodePipeline variables emitted by CodeStar source Action.
 */
export interface CodeStarSourceVariables {
    /** The name of the repository this action points to. */
    readonly fullRepositoryName: string;
    /** The name of the branch this action tracks. */
    readonly branchName: string;
    /** The date the currently last commit on the tracked branch was authored, in ISO-8601 format. */
    readonly authorDate: string;
    /** The SHA1 hash of the currently last commit on the tracked branch. */
    readonly commitId: string;
    /** The message of the currently last commit on the tracked branch. */
    readonly commitMessage: string;
    /** The connection ARN this source uses. */
    readonly connectionArn: string;
}
/**
 * Construction properties for `CodeStarConnectionsSourceAction`.
 */
export interface CodeStarConnectionsSourceActionProps extends codepipeline.CommonAwsActionProps {
    /**
     * The output artifact that this action produces.
     * Can be used as input for further pipeline actions.
     */
    readonly output: codepipeline.Artifact;
    /**
     * The ARN of the CodeStar Connection created in the AWS console
     * that has permissions to access this GitHub or BitBucket repository.
     *
     * @example 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh'
     * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/connections-create.html
     */
    readonly connectionArn: string;
    /**
     * The owning user or organization of the repository.
     *
     * @example 'aws'
     */
    readonly owner: string;
    /**
     * The name of the repository.
     *
     * @example 'aws-cdk'
     */
    readonly repo: string;
    /**
     * The branch to build.
     *
     * @default 'master'
     */
    readonly branch?: string;
    /**
     * Whether the output should be the contents of the repository
     * (which is the default),
     * or a link that allows CodeBuild to clone the repository before building.
     *
     * **Note**: if this option is true,
     * then only CodeBuild actions can use the resulting `output`.
     *
     * @default false
     * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-CodestarConnectionSource.html#action-reference-CodestarConnectionSource-config
     */
    readonly codeBuildCloneOutput?: boolean;
    /**
     * Controls automatically starting your pipeline when a new commit
     * is made on the configured repository and branch. If unspecified,
     * the default value is true, and the field does not display by default.
     *
     * @default true
     * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-CodestarConnectionSource.html
     */
    readonly triggerOnPush?: boolean;
}
/**
 * A CodePipeline source action for the CodeStar Connections source,
 * which allows connecting to GitHub and BitBucket.
 */
export declare class CodeStarConnectionsSourceAction extends Action {
    /**
     * The name of the property that holds the ARN of the CodeStar Connection
     * inside of the CodePipeline Artifact's metadata.
     *
     * @internal
     */
    static readonly _CONNECTION_ARN_PROPERTY = "CodeStarConnectionArnProperty";
    private readonly props;
    constructor(props: CodeStarConnectionsSourceActionProps);
    /** The variables emitted by this action. */
    get variables(): CodeStarSourceVariables;
    protected bound(_scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
}
