import * as codecommit from '@aws-cdk/aws-codecommit';
import * as s3 from '@aws-cdk/aws-s3';
import { Construct } from 'constructs';
import { CfnProject } from './codebuild.generated';
import { IProject } from './project';
/**
 * The type returned from `ISource#bind`.
 */
export interface SourceConfig {
    readonly sourceProperty: CfnProject.SourceProperty;
    readonly buildTriggers?: CfnProject.ProjectTriggersProperty;
    /**
     * `AWS::CodeBuild::Project.SourceVersion`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codebuild-project.html#cfn-codebuild-project-sourceversion
     * @default the latest version
     */
    readonly sourceVersion?: string;
}
/**
 * The abstract interface of a CodeBuild source.
 * Implemented by `Source`.
 */
export interface ISource {
    readonly identifier?: string;
    readonly type: string;
    readonly badgeSupported: boolean;
    bind(scope: Construct, project: IProject): SourceConfig;
}
/**
 * Properties common to all Source classes.
 */
export interface SourceProps {
    /**
     * The source identifier.
     * This property is required on secondary sources.
     */
    readonly identifier?: string;
}
/**
 * Source provider definition for a CodeBuild Project.
 */
export declare abstract class Source implements ISource {
    static s3(props: S3SourceProps): ISource;
    static codeCommit(props: CodeCommitSourceProps): ISource;
    static gitHub(props: GitHubSourceProps): ISource;
    static gitHubEnterprise(props: GitHubEnterpriseSourceProps): ISource;
    static bitBucket(props: BitBucketSourceProps): ISource;
    readonly identifier?: string;
    abstract readonly type: string;
    readonly badgeSupported: boolean;
    protected constructor(props: SourceProps);
    /**
     * Called by the project when the source is added so that the source can perform
     * binding operations on the source. For example, it can grant permissions to the
     * code build project to read from the S3 bucket.
     */
    bind(_scope: Construct, _project: IProject): SourceConfig;
}
/**
 * The construction properties common to all build sources that are backed by Git.
 */
interface GitSourceProps extends SourceProps {
    /**
     * The depth of history to download. Minimum value is 0.
     * If this value is 0, greater than 25, or not provided,
     * then the full history is downloaded with each build of the project.
     */
    readonly cloneDepth?: number;
    /**
     * The commit ID, pull request ID, branch name, or tag name that corresponds to
     * the version of the source code you want to build
     *
     * @example 'mybranch'
     * @default the default branch's HEAD commit ID is used
     */
    readonly branchOrRef?: string;
    /**
     * Whether to fetch submodules while cloning git repo.
     *
     * @default false
     */
    readonly fetchSubmodules?: boolean;
}
/**
 * The types of webhook event actions.
 */
export declare enum EventAction {
    /**
     * A push (of a branch, or a tag) to the repository.
     */
    PUSH = "PUSH",
    /**
     * Creating a Pull Request.
     */
    PULL_REQUEST_CREATED = "PULL_REQUEST_CREATED",
    /**
     * Updating a Pull Request.
     */
    PULL_REQUEST_UPDATED = "PULL_REQUEST_UPDATED",
    /**
     * Merging a Pull Request.
     */
    PULL_REQUEST_MERGED = "PULL_REQUEST_MERGED",
    /**
     * Re-opening a previously closed Pull Request.
     * Note that this event is only supported for GitHub and GitHubEnterprise sources.
     */
    PULL_REQUEST_REOPENED = "PULL_REQUEST_REOPENED"
}
/**
 * An object that represents a group of filter conditions for a webhook.
 * Every condition in a given FilterGroup must be true in order for the whole group to be true.
 * You construct instances of it by calling the `#inEventOf` static factory method,
 * and then calling various `andXyz` instance methods to create modified instances of it
 * (this class is immutable).
 *
 * You pass instances of this class to the `webhookFilters` property when constructing a source.
 */
export declare class FilterGroup {
    /**
     * Creates a new event FilterGroup that triggers on any of the provided actions.
     *
     * @param actions the actions to trigger the webhook on
     */
    static inEventOf(...actions: EventAction[]): FilterGroup;
    private readonly actions;
    private readonly filters;
    private constructor();
    /**
     * Create a new FilterGroup with an added condition:
     * the event must affect the given branch.
     *
     * @param branchName the name of the branch (can be a regular expression)
     */
    andBranchIs(branchName: string): FilterGroup;
    /**
     * Create a new FilterGroup with an added condition:
     * the event must not affect the given branch.
     *
     * @param branchName the name of the branch (can be a regular expression)
     */
    andBranchIsNot(branchName: string): FilterGroup;
    /**
     * Create a new FilterGroup with an added condition:
     * the event must affect a head commit with the given message.
     *
     * @param commitMessage the commit message (can be a regular expression)
     */
    andCommitMessageIs(commitMessage: string): FilterGroup;
    /**
     * Create a new FilterGroup with an added condition:
     * the event must not affect a head commit with the given message.
     *
     * @param commitMessage the commit message (can be a regular expression)
     */
    andCommitMessageIsNot(commitMessage: string): FilterGroup;
    /**
     * Create a new FilterGroup with an added condition:
     * the event must affect the given tag.
     *
     * @param tagName the name of the tag (can be a regular expression)
     */
    andTagIs(tagName: string): FilterGroup;
    /**
     * Create a new FilterGroup with an added condition:
     * the event must not affect the given tag.
     *
     * @param tagName the name of the tag (can be a regular expression)
     */
    andTagIsNot(tagName: string): FilterGroup;
    /**
     * Create a new FilterGroup with an added condition:
     * the event must affect a Git reference (ie., a branch or a tag)
     * that matches the given pattern.
     *
     * @param pattern a regular expression
     */
    andHeadRefIs(pattern: string): FilterGroup;
    /**
     * Create a new FilterGroup with an added condition:
     * the event must not affect a Git reference (ie., a branch or a tag)
     * that matches the given pattern.
     *
     * @param pattern a regular expression
     */
    andHeadRefIsNot(pattern: string): FilterGroup;
    /**
     * Create a new FilterGroup with an added condition:
     * the account ID of the actor initiating the event must match the given pattern.
     *
     * @param pattern a regular expression
     */
    andActorAccountIs(pattern: string): FilterGroup;
    /**
     * Create a new FilterGroup with an added condition:
     * the account ID of the actor initiating the event must not match the given pattern.
     *
     * @param pattern a regular expression
     */
    andActorAccountIsNot(pattern: string): FilterGroup;
    /**
     * Create a new FilterGroup with an added condition:
     * the Pull Request that is the source of the event must target the given base branch.
     * Note that you cannot use this method if this Group contains the `PUSH` event action.
     *
     * @param branchName the name of the branch (can be a regular expression)
     */
    andBaseBranchIs(branchName: string): FilterGroup;
    /**
     * Create a new FilterGroup with an added condition:
     * the Pull Request that is the source of the event must not target the given base branch.
     * Note that you cannot use this method if this Group contains the `PUSH` event action.
     *
     * @param branchName the name of the branch (can be a regular expression)
     */
    andBaseBranchIsNot(branchName: string): FilterGroup;
    /**
     * Create a new FilterGroup with an added condition:
     * the Pull Request that is the source of the event must target the given Git reference.
     * Note that you cannot use this method if this Group contains the `PUSH` event action.
     *
     * @param pattern a regular expression
     */
    andBaseRefIs(pattern: string): FilterGroup;
    /**
     * Create a new FilterGroup with an added condition:
     * the Pull Request that is the source of the event must not target the given Git reference.
     * Note that you cannot use this method if this Group contains the `PUSH` event action.
     *
     * @param pattern a regular expression
     */
    andBaseRefIsNot(pattern: string): FilterGroup;
    /**
     * Create a new FilterGroup with an added condition:
     * the push that is the source of the event must affect a file that matches the given pattern.
     * Note that you can only use this method if this Group contains only the `PUSH` event action,
     * and only for GitHub, Bitbucket and GitHubEnterprise sources.
     *
     * @param pattern a regular expression
     */
    andFilePathIs(pattern: string): FilterGroup;
    /**
     * Create a new FilterGroup with an added condition:
     * the push that is the source of the event must not affect a file that matches the given pattern.
     * Note that you can only use this method if this Group contains only the `PUSH` event action,
     * and only for GitHub, Bitbucket and GitHubEnterprise sources.
     *
     * @param pattern a regular expression
     */
    andFilePathIsNot(pattern: string): FilterGroup;
    /** @internal */
    get _actions(): EventAction[];
    /** @internal */
    get _filters(): CfnProject.WebhookFilterProperty[];
    /** @internal */
    _toJson(): CfnProject.WebhookFilterProperty[];
    private addCommitMessageFilter;
    private addHeadBranchFilter;
    private addHeadTagFilter;
    private addHeadRefFilter;
    private addActorAccountId;
    private addBaseBranchFilter;
    private addBaseRefFilter;
    private addFilePathFilter;
    private addFilter;
}
/**
 * The construction properties common to all third-party build sources that are backed by Git.
 */
interface ThirdPartyGitSourceProps extends GitSourceProps {
    /**
     * Whether to send notifications on your build's start and end.
     *
     * @default true
     */
    readonly reportBuildStatus?: boolean;
    /**
     * Whether to create a webhook that will trigger a build every time an event happens in the repository.
     *
     * @default true if any `webhookFilters` were provided, false otherwise
     */
    readonly webhook?: boolean;
    /**
     * Trigger a batch build from a webhook instead of a standard one.
     *
     * Enabling this will enable batch builds on the CodeBuild project.
     *
     * @default false
     */
    readonly webhookTriggersBatchBuild?: boolean;
    /**
     * A list of webhook filters that can constraint what events in the repository will trigger a build.
     * A build is triggered if any of the provided filter groups match.
     * Only valid if `webhook` was not provided as false.
     *
     * @default every push and every Pull Request (create or update) triggers a build
     */
    readonly webhookFilters?: FilterGroup[];
    /**
     * The URL that the build will report back to the source provider.
     * Can use built-in CodeBuild variables, like $AWS_REGION.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/create-project-cli.html#cli.source.buildstatusconfig.targeturl
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-env-vars.html
     *
     * @example "$CODEBUILD_PUBLIC_BUILD_URL"
     * @default - link to the AWS Console for CodeBuild to a particular build execution
     */
    readonly buildStatusUrl?: string;
}
/**
 * Construction properties for `CodeCommitSource`.
 */
export interface CodeCommitSourceProps extends GitSourceProps {
    readonly repository: codecommit.IRepository;
}
/**
 * Construction properties for `S3Source`.
 */
export interface S3SourceProps extends SourceProps {
    readonly bucket: s3.IBucket;
    readonly path: string;
    /**
     *  The version ID of the object that represents the build input ZIP file to use.
     *
     * @default latest
     */
    readonly version?: string;
}
/**
 * Common properties between `GitHubSource` and `GitHubEnterpriseSource`.
 */
interface CommonGithubSourceProps extends ThirdPartyGitSourceProps {
    /**
     * This parameter is used for the `context` parameter in the GitHub commit status.
     * Can use built-in CodeBuild variables, like $AWS_REGION.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/create-project-cli.html#cli.source.buildstatusconfig.context
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-env-vars.html
     *
     * @example "My build #$CODEBUILD_BUILD_NUMBER"
     * @default "AWS CodeBuild $AWS_REGION ($PROJECT_NAME)"
     */
    readonly buildStatusContext?: string;
}
/**
 * Construction properties for `GitHubSource` and `GitHubEnterpriseSource`.
 */
export interface GitHubSourceProps extends CommonGithubSourceProps {
    /**
     * The GitHub account/user that owns the repo.
     *
     * @example 'awslabs'
     */
    readonly owner: string;
    /**
     * The name of the repo (without the username).
     *
     * @example 'aws-cdk'
     */
    readonly repo: string;
}
/**
 * Construction properties for `GitHubEnterpriseSource`.
 */
export interface GitHubEnterpriseSourceProps extends CommonGithubSourceProps {
    /**
     * The HTTPS URL of the repository in your GitHub Enterprise installation.
     */
    readonly httpsCloneUrl: string;
    /**
     * Whether to ignore SSL errors when connecting to the repository.
     *
     * @default false
     */
    readonly ignoreSslErrors?: boolean;
}
/**
 * Construction properties for `BitBucketSource`.
 */
export interface BitBucketSourceProps extends ThirdPartyGitSourceProps {
    /**
     * The BitBucket account/user that owns the repo.
     *
     * @example 'awslabs'
     */
    readonly owner: string;
    /**
     * The name of the repo (without the username).
     *
     * @example 'aws-cdk'
     */
    readonly repo: string;
    /**
     * This parameter is used for the `name` parameter in the Bitbucket commit status.
     * Can use built-in CodeBuild variables, like $AWS_REGION.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/create-project-cli.html#cli.source.buildstatusconfig.context
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-env-vars.html
     *
     * @example "My build #$CODEBUILD_BUILD_NUMBER"
     * @default "AWS CodeBuild $AWS_REGION ($PROJECT_NAME)"
     */
    readonly buildStatusName?: string;
}
export {};
