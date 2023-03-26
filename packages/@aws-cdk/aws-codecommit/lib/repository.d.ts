import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Code } from './code';
/**
 * Additional options to pass to the notification rule.
 */
export interface RepositoryNotifyOnOptions extends notifications.NotificationRuleOptions {
    /**
     * A list of event types associated with this notification rule for CodeCommit repositories.
     * For a complete list of event types and IDs, see Notification concepts in the Developer Tools Console User Guide.
     * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#concepts-api
     */
    readonly events: RepositoryNotificationEvents[];
}
export interface IRepository extends IResource, notifications.INotificationRuleSource {
    /**
     * The ARN of this Repository.
     * @attribute
     */
    readonly repositoryArn: string;
    /**
     * The human-visible name of this Repository.
     * @attribute
     */
    readonly repositoryName: string;
    /**
     * The HTTP clone URL.
     * @attribute
     */
    readonly repositoryCloneUrlHttp: string;
    /**
     * The SSH clone URL.
     * @attribute
     */
    readonly repositoryCloneUrlSsh: string;
    /**
     * The HTTPS (GRC) clone URL.
     *
     * HTTPS (GRC) is the protocol to use with git-remote-codecommit (GRC).
     *
     * It is the recommended method for supporting connections made with federated
     * access, identity providers, and temporary credentials.
     *
     * @see https://docs.aws.amazon.com/codecommit/latest/userguide/setting-up-git-remote-codecommit.html
     */
    readonly repositoryCloneUrlGrc: string;
    /**
     * Defines a CloudWatch event rule which triggers for repository events. Use
     * `rule.addEventPattern(pattern)` to specify a filter.
     */
    onEvent(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines a CloudWatch event rule which triggers when a "CodeCommit
     * Repository State Change" event occurs.
     */
    onStateChange(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines a CloudWatch event rule which triggers when a reference is
     * created (i.e. a new branch/tag is created) to the repository.
     */
    onReferenceCreated(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines a CloudWatch event rule which triggers when a reference is
     * updated (i.e. a commit is pushed to an existing or new branch) from the repository.
     */
    onReferenceUpdated(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines a CloudWatch event rule which triggers when a reference is
     * delete (i.e. a branch/tag is deleted) from the repository.
     */
    onReferenceDeleted(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines a CloudWatch event rule which triggers when a pull request state is changed.
     */
    onPullRequestStateChange(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines a CloudWatch event rule which triggers when a comment is made on a pull request.
     */
    onCommentOnPullRequest(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines a CloudWatch event rule which triggers when a comment is made on a commit.
     */
    onCommentOnCommit(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines a CloudWatch event rule which triggers when a commit is pushed to a branch.
     */
    onCommit(id: string, options?: OnCommitOptions): events.Rule;
    /**
     * Grant the given principal identity permissions to perform the actions on this repository.
     */
    grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;
    /**
     * Grant the given identity permissions to pull this repository.
     */
    grantPull(grantee: iam.IGrantable): iam.Grant;
    /**
     * Grant the given identity permissions to pull and push this repository.
     */
    grantPullPush(grantee: iam.IGrantable): iam.Grant;
    /**
     * Grant the given identity permissions to read this repository.
     */
    grantRead(grantee: iam.IGrantable): iam.Grant;
    /**
     * Defines a CodeStar Notification rule triggered when the project
     * events specified by you are emitted. Similar to `onEvent` API.
     *
     * You can also use the methods to define rules for the specific event emitted.
     * eg: `notifyOnPullRequstCreated`.
     *
     * @returns CodeStar Notifications rule associated with this repository.
     */
    notifyOn(id: string, target: notifications.INotificationRuleTarget, options: RepositoryNotifyOnOptions): notifications.INotificationRule;
    /**
     * Defines a CodeStar Notification rule which triggers when a comment is made on a pull request.
     */
    notifyOnPullRequestComment(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
    /**
     * Defines a CodeStar Notification rule which triggers when an approval status is changed.
     */
    notifyOnApprovalStatusChanged(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
    /**
     * Defines a CodeStar Notification rule which triggers when an approval rule is overridden.
     */
    notifyOnApprovalRuleOverridden(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
    /**
     * Defines a CodeStar Notification rule which triggers when a pull request is created.
     */
    notifyOnPullRequestCreated(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
    /**
     * Defines a CodeStar Notification rule which triggers when a pull request is merged.
     * @deprecated this method has a typo in its name, use notifyOnPullRequestMerged instead
     */
    notifiyOnPullRequestMerged(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
    /**
     * Defines a CodeStar Notification rule which triggers when a pull request is merged.
     */
    notifyOnPullRequestMerged(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
    /**
     * Defines a CodeStar Notification rule which triggers when a new branch or tag is created.
     */
    notifyOnBranchOrTagCreated(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
    /**
     * Defines a CodeStar Notification rule which triggers when a branch or tag is deleted.
     */
    notifyOnBranchOrTagDeleted(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
}
/**
 * Options for the onCommit() method.
 */
export interface OnCommitOptions extends events.OnEventOptions {
    /**
     * The branch to monitor.
     *
     * @default - All branches
     */
    readonly branches?: string[];
}
/**
 * Represents a reference to a CodeCommit Repository.
 *
 * If you want to create a new Repository managed alongside your CDK code,
 * use the `Repository` class.
 *
 * If you want to reference an already existing Repository,
 * use the `Repository.import` method.
 */
declare abstract class RepositoryBase extends Resource implements IRepository {
    /** The ARN of this Repository. */
    abstract readonly repositoryArn: string;
    /** The human-visible name of this Repository. */
    abstract readonly repositoryName: string;
    /** The HTTP clone URL */
    abstract readonly repositoryCloneUrlHttp: string;
    /** The SSH clone URL */
    abstract readonly repositoryCloneUrlSsh: string;
    abstract readonly repositoryCloneUrlGrc: string;
    /**
     * Defines a CloudWatch event rule which triggers for repository events. Use
     * `rule.addEventPattern(pattern)` to specify a filter.
     */
    onEvent(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines a CloudWatch event rule which triggers when a "CodeCommit
     * Repository State Change" event occurs.
     */
    onStateChange(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines a CloudWatch event rule which triggers when a reference is
     * created (i.e. a new branch/tag is created) to the repository.
     */
    onReferenceCreated(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines a CloudWatch event rule which triggers when a reference is
     * updated (i.e. a commit is pushed to an existing or new branch) from the repository.
     */
    onReferenceUpdated(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines a CloudWatch event rule which triggers when a reference is
     * delete (i.e. a branch/tag is deleted) from the repository.
     */
    onReferenceDeleted(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines a CloudWatch event rule which triggers when a pull request state is changed.
     */
    onPullRequestStateChange(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines a CloudWatch event rule which triggers when a comment is made on a pull request.
     */
    onCommentOnPullRequest(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines a CloudWatch event rule which triggers when a comment is made on a commit.
     */
    onCommentOnCommit(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines a CloudWatch event rule which triggers when a commit is pushed to a branch.
     */
    onCommit(id: string, options?: OnCommitOptions): events.Rule;
    grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;
    grantPull(grantee: iam.IGrantable): iam.Grant;
    grantPullPush(grantee: iam.IGrantable): iam.Grant;
    grantRead(grantee: iam.IGrantable): iam.Grant;
    notifyOn(id: string, target: notifications.INotificationRuleTarget, options: RepositoryNotifyOnOptions): notifications.INotificationRule;
    notifyOnPullRequestComment(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
    notifyOnApprovalStatusChanged(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
    notifyOnApprovalRuleOverridden(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
    notifyOnPullRequestCreated(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
    notifiyOnPullRequestMerged(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
    notifyOnPullRequestMerged(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
    notifyOnBranchOrTagCreated(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
    notifyOnBranchOrTagDeleted(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
    bindAsNotificationRuleSource(_scope: Construct): notifications.NotificationRuleSourceConfig;
}
export interface RepositoryProps {
    /**
     * Name of the repository.
     *
     * This property is required for all CodeCommit repositories.
     */
    readonly repositoryName: string;
    /**
     * A description of the repository. Use the description to identify the
     * purpose of the repository.
     *
     * @default - No description.
     */
    readonly description?: string;
    /**
     * The contents with which to initialize the repository after it has been created.
     *
     * @default - No initialization (create empty repo)
     */
    readonly code?: Code;
}
/**
 * Provides a CodeCommit Repository.
 */
export declare class Repository extends RepositoryBase {
    /**
     * Imports a codecommit repository.
     * @param repositoryArn (e.g. `arn:aws:codecommit:us-east-1:123456789012:MyDemoRepo`)
     */
    static fromRepositoryArn(scope: Construct, id: string, repositoryArn: string): IRepository;
    static fromRepositoryName(scope: Construct, id: string, repositoryName: string): IRepository;
    readonly repositoryArn: string;
    readonly repositoryName: string;
    readonly repositoryCloneUrlHttp: string;
    readonly repositoryCloneUrlSsh: string;
    readonly repositoryCloneUrlGrc: string;
    private readonly triggers;
    constructor(scope: Construct, id: string, props: RepositoryProps);
    /**
     * Create a trigger to notify another service to run actions on repository events.
     * @param arn   Arn of the resource that repository events will notify
     * @param options Trigger options to run actions
     */
    notify(arn: string, options?: RepositoryTriggerOptions): Repository;
}
/**
 * Creates for a repository trigger to an SNS topic or Lambda function.
 */
export interface RepositoryTriggerOptions {
    /**
     * A name for the trigger.Triggers on a repository must have unique names.
     */
    readonly name?: string;
    /**
     * The repository events for which AWS CodeCommit sends information to the
     * target, which you specified in the DestinationArn property.If you don't
     * specify events, the trigger runs for all repository events.
     */
    readonly events?: RepositoryEventTrigger[];
    /**
     * The names of the branches in the AWS CodeCommit repository that contain
     * events that you want to include in the trigger. If you don't specify at
     * least one branch, the trigger applies to all branches.
     */
    readonly branches?: string[];
    /**
     * When an event is triggered, additional information that AWS CodeCommit
     * includes when it sends information to the target.
     */
    readonly customData?: string;
}
/**
 * Repository events that will cause the trigger to run actions in another service.
 */
export declare enum RepositoryEventTrigger {
    ALL = "all",
    UPDATE_REF = "updateReference",
    CREATE_REF = "createReference",
    DELETE_REF = "deleteReference"
}
/**
 * List of event types for AWS CodeCommit
 * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#events-ref-repositories
 */
export declare enum RepositoryNotificationEvents {
    /**
     * Trigger notication when comment made on commit.
     */
    COMMIT_COMMENT = "codecommit-repository-comments-on-commits",
    /**
     * Trigger notification when comment made on pull request.
     */
    PULL_REQUEST_COMMENT = "codecommit-repository-comments-on-pull-requests",
    /**
     * Trigger notification when approval status changed.
     */
    APPROVAL_STATUS_CHANGED = "codecommit-repository-approvals-status-changed",
    /**
     * Trigger notifications when approval rule is overridden.
     */
    APPROVAL_RULE_OVERRIDDEN = "codecommit-repository-approvals-rule-override",
    /**
     * Trigger notification when pull request created.
     */
    PULL_REQUEST_CREATED = "codecommit-repository-pull-request-created",
    /**
     * Trigger notification when pull request source updated.
     */
    PULL_REQUEST_SOURCE_UPDATED = "codecommit-repository-pull-request-source-updated",
    /**
     * Trigger notification when pull request status is changed.
     */
    PULL_REQUEST_STATUS_CHANGED = "codecommit-repository-pull-request-status-changed",
    /**
     * Trigger notification when pull requset is merged.
     */
    PULL_REQUEST_MERGED = "codecommit-repository-pull-request-merged",
    /**
     * Trigger notification when a branch or tag is created.
     */
    BRANCH_OR_TAG_CREATED = "codecommit-repository-branches-and-tags-created",
    /**
     * Trigger notification when a branch or tag is deleted.
     */
    BRANCH_OR_TAG_DELETED = "codecommit-repository-branches-and-tags-deleted",
    /**
     * Trigger notification when a branch or tag is updated.
     */
    BRANCH_OR_TAG_UPDATED = "codecommit-repository-branches-and-tags-updated"
}
export {};
