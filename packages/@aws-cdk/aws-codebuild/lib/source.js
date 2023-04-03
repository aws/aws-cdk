"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterGroup = exports.EventAction = exports.Source = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const source_types_1 = require("./source-types");
/**
 * Source provider definition for a CodeBuild Project.
 */
class Source {
    constructor(props) {
        this.badgeSupported = false;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_SourceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Source);
            }
            throw error;
        }
        this.identifier = props.identifier;
    }
    static s3(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_S3SourceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.s3);
            }
            throw error;
        }
        return new S3Source(props);
    }
    static codeCommit(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_CodeCommitSourceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.codeCommit);
            }
            throw error;
        }
        return new CodeCommitSource(props);
    }
    static gitHub(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_GitHubSourceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.gitHub);
            }
            throw error;
        }
        return new GitHubSource(props);
    }
    static gitHubEnterprise(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_GitHubEnterpriseSourceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.gitHubEnterprise);
            }
            throw error;
        }
        return new GitHubEnterpriseSource(props);
    }
    static bitBucket(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_BitBucketSourceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bitBucket);
            }
            throw error;
        }
        return new BitBucketSource(props);
    }
    /**
     * Called by the project when the source is added so that the source can perform
     * binding operations on the source. For example, it can grant permissions to the
     * code build project to read from the S3 bucket.
     */
    bind(_scope, _project) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_IProject(_project);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bind);
            }
            throw error;
        }
        return {
            sourceProperty: {
                sourceIdentifier: this.identifier,
                type: this.type,
            },
        };
    }
}
exports.Source = Source;
_a = JSII_RTTI_SYMBOL_1;
Source[_a] = { fqn: "@aws-cdk/aws-codebuild.Source", version: "0.0.0" };
/**
 * A common superclass of all build sources that are backed by Git.
 */
class GitSource extends Source {
    constructor(props) {
        super(props);
        this.cloneDepth = props.cloneDepth;
        this.branchOrRef = props.branchOrRef;
        this.fetchSubmodules = props.fetchSubmodules;
    }
    bind(_scope, _project) {
        const superConfig = super.bind(_scope, _project);
        return {
            sourceVersion: this.branchOrRef,
            sourceProperty: {
                ...superConfig.sourceProperty,
                gitCloneDepth: this.cloneDepth,
                gitSubmodulesConfig: this.fetchSubmodules ? {
                    fetchSubmodules: this.fetchSubmodules,
                } : undefined,
            },
        };
    }
}
/**
 * The types of webhook event actions.
 */
var EventAction;
(function (EventAction) {
    /**
     * A push (of a branch, or a tag) to the repository.
     */
    EventAction["PUSH"] = "PUSH";
    /**
     * Creating a Pull Request.
     */
    EventAction["PULL_REQUEST_CREATED"] = "PULL_REQUEST_CREATED";
    /**
     * Updating a Pull Request.
     */
    EventAction["PULL_REQUEST_UPDATED"] = "PULL_REQUEST_UPDATED";
    /**
     * Merging a Pull Request.
     */
    EventAction["PULL_REQUEST_MERGED"] = "PULL_REQUEST_MERGED";
    /**
     * Re-opening a previously closed Pull Request.
     * Note that this event is only supported for GitHub and GitHubEnterprise sources.
     */
    EventAction["PULL_REQUEST_REOPENED"] = "PULL_REQUEST_REOPENED";
})(EventAction = exports.EventAction || (exports.EventAction = {}));
var WebhookFilterTypes;
(function (WebhookFilterTypes) {
    WebhookFilterTypes["FILE_PATH"] = "FILE_PATH";
    WebhookFilterTypes["COMMIT_MESSAGE"] = "COMMIT_MESSAGE";
    WebhookFilterTypes["HEAD_REF"] = "HEAD_REF";
    WebhookFilterTypes["ACTOR_ACCOUNT_ID"] = "ACTOR_ACCOUNT_ID";
    WebhookFilterTypes["BASE_REF"] = "BASE_REF";
})(WebhookFilterTypes || (WebhookFilterTypes = {}));
/**
 * An object that represents a group of filter conditions for a webhook.
 * Every condition in a given FilterGroup must be true in order for the whole group to be true.
 * You construct instances of it by calling the `#inEventOf` static factory method,
 * and then calling various `andXyz` instance methods to create modified instances of it
 * (this class is immutable).
 *
 * You pass instances of this class to the `webhookFilters` property when constructing a source.
 */
class FilterGroup {
    constructor(actions, filters) {
        if (actions.size === 0) {
            throw new Error('A filter group must contain at least one event action');
        }
        this.actions = actions;
        this.filters = filters;
    }
    /**
     * Creates a new event FilterGroup that triggers on any of the provided actions.
     *
     * @param actions the actions to trigger the webhook on
     */
    static inEventOf(...actions) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_EventAction(actions);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.inEventOf);
            }
            throw error;
        }
        return new FilterGroup(new Set(actions), []);
    }
    /**
     * Create a new FilterGroup with an added condition:
     * the event must affect the given branch.
     *
     * @param branchName the name of the branch (can be a regular expression)
     */
    andBranchIs(branchName) {
        return this.addHeadBranchFilter(branchName, true);
    }
    /**
     * Create a new FilterGroup with an added condition:
     * the event must not affect the given branch.
     *
     * @param branchName the name of the branch (can be a regular expression)
     */
    andBranchIsNot(branchName) {
        return this.addHeadBranchFilter(branchName, false);
    }
    /**
     * Create a new FilterGroup with an added condition:
     * the event must affect a head commit with the given message.
     *
     * @param commitMessage the commit message (can be a regular expression)
     */
    andCommitMessageIs(commitMessage) {
        return this.addCommitMessageFilter(commitMessage, true);
    }
    /**
     * Create a new FilterGroup with an added condition:
     * the event must not affect a head commit with the given message.
     *
     * @param commitMessage the commit message (can be a regular expression)
     */
    andCommitMessageIsNot(commitMessage) {
        return this.addCommitMessageFilter(commitMessage, false);
    }
    /**
     * Create a new FilterGroup with an added condition:
     * the event must affect the given tag.
     *
     * @param tagName the name of the tag (can be a regular expression)
     */
    andTagIs(tagName) {
        return this.addHeadTagFilter(tagName, true);
    }
    /**
     * Create a new FilterGroup with an added condition:
     * the event must not affect the given tag.
     *
     * @param tagName the name of the tag (can be a regular expression)
     */
    andTagIsNot(tagName) {
        return this.addHeadTagFilter(tagName, false);
    }
    /**
     * Create a new FilterGroup with an added condition:
     * the event must affect a Git reference (ie., a branch or a tag)
     * that matches the given pattern.
     *
     * @param pattern a regular expression
     */
    andHeadRefIs(pattern) {
        return this.addHeadRefFilter(pattern, true);
    }
    /**
     * Create a new FilterGroup with an added condition:
     * the event must not affect a Git reference (ie., a branch or a tag)
     * that matches the given pattern.
     *
     * @param pattern a regular expression
     */
    andHeadRefIsNot(pattern) {
        return this.addHeadRefFilter(pattern, false);
    }
    /**
     * Create a new FilterGroup with an added condition:
     * the account ID of the actor initiating the event must match the given pattern.
     *
     * @param pattern a regular expression
     */
    andActorAccountIs(pattern) {
        return this.addActorAccountId(pattern, true);
    }
    /**
     * Create a new FilterGroup with an added condition:
     * the account ID of the actor initiating the event must not match the given pattern.
     *
     * @param pattern a regular expression
     */
    andActorAccountIsNot(pattern) {
        return this.addActorAccountId(pattern, false);
    }
    /**
     * Create a new FilterGroup with an added condition:
     * the Pull Request that is the source of the event must target the given base branch.
     * Note that you cannot use this method if this Group contains the `PUSH` event action.
     *
     * @param branchName the name of the branch (can be a regular expression)
     */
    andBaseBranchIs(branchName) {
        return this.addBaseBranchFilter(branchName, true);
    }
    /**
     * Create a new FilterGroup with an added condition:
     * the Pull Request that is the source of the event must not target the given base branch.
     * Note that you cannot use this method if this Group contains the `PUSH` event action.
     *
     * @param branchName the name of the branch (can be a regular expression)
     */
    andBaseBranchIsNot(branchName) {
        return this.addBaseBranchFilter(branchName, false);
    }
    /**
     * Create a new FilterGroup with an added condition:
     * the Pull Request that is the source of the event must target the given Git reference.
     * Note that you cannot use this method if this Group contains the `PUSH` event action.
     *
     * @param pattern a regular expression
     */
    andBaseRefIs(pattern) {
        return this.addBaseRefFilter(pattern, true);
    }
    /**
     * Create a new FilterGroup with an added condition:
     * the Pull Request that is the source of the event must not target the given Git reference.
     * Note that you cannot use this method if this Group contains the `PUSH` event action.
     *
     * @param pattern a regular expression
     */
    andBaseRefIsNot(pattern) {
        return this.addBaseRefFilter(pattern, false);
    }
    /**
     * Create a new FilterGroup with an added condition:
     * the push that is the source of the event must affect a file that matches the given pattern.
     * Note that you can only use this method if this Group contains only the `PUSH` event action,
     * and only for GitHub, Bitbucket and GitHubEnterprise sources.
     *
     * @param pattern a regular expression
     */
    andFilePathIs(pattern) {
        return this.addFilePathFilter(pattern, true);
    }
    /**
     * Create a new FilterGroup with an added condition:
     * the push that is the source of the event must not affect a file that matches the given pattern.
     * Note that you can only use this method if this Group contains only the `PUSH` event action,
     * and only for GitHub, Bitbucket and GitHubEnterprise sources.
     *
     * @param pattern a regular expression
     */
    andFilePathIsNot(pattern) {
        return this.addFilePathFilter(pattern, false);
    }
    /** @internal */
    get _actions() {
        return set2Array(this.actions);
    }
    /** @internal */
    get _filters() {
        return this.filters.slice();
    }
    /** @internal */
    _toJson() {
        const eventFilter = {
            type: 'EVENT',
            pattern: set2Array(this.actions).join(', '),
        };
        return [eventFilter].concat(this.filters);
    }
    addCommitMessageFilter(commitMessage, include) {
        return this.addFilter(WebhookFilterTypes.COMMIT_MESSAGE, commitMessage, include);
    }
    addHeadBranchFilter(branchName, include) {
        return this.addHeadRefFilter(`refs/heads/${branchName}`, include);
    }
    addHeadTagFilter(tagName, include) {
        return this.addHeadRefFilter(`refs/tags/${tagName}`, include);
    }
    addHeadRefFilter(refName, include) {
        return this.addFilter(WebhookFilterTypes.HEAD_REF, refName, include);
    }
    addActorAccountId(accountId, include) {
        return this.addFilter(WebhookFilterTypes.ACTOR_ACCOUNT_ID, accountId, include);
    }
    addBaseBranchFilter(branchName, include) {
        return this.addBaseRefFilter(`refs/heads/${branchName}`, include);
    }
    addBaseRefFilter(refName, include) {
        if (this.actions.has(EventAction.PUSH)) {
            throw new Error('A base reference condition cannot be added if a Group contains a PUSH event action');
        }
        return this.addFilter(WebhookFilterTypes.BASE_REF, refName, include);
    }
    addFilePathFilter(pattern, include) {
        return this.addFilter(WebhookFilterTypes.FILE_PATH, pattern, include);
    }
    addFilter(type, pattern, include) {
        return new FilterGroup(this.actions, this.filters.concat([{
                type,
                pattern,
                excludeMatchedPattern: include ? undefined : true,
            }]));
    }
}
exports.FilterGroup = FilterGroup;
_b = JSII_RTTI_SYMBOL_1;
FilterGroup[_b] = { fqn: "@aws-cdk/aws-codebuild.FilterGroup", version: "0.0.0" };
/**
 * A common superclass of all third-party build sources that are backed by Git.
 */
class ThirdPartyGitSource extends GitSource {
    constructor(props) {
        super(props);
        this.badgeSupported = true;
        this.webhook = props.webhook;
        this.reportBuildStatus = props.reportBuildStatus ?? true;
        this.webhookFilters = props.webhookFilters || [];
        this.webhookTriggersBatchBuild = props.webhookTriggersBatchBuild;
        this.buildStatusUrl = props.buildStatusUrl;
    }
    bind(_scope, project) {
        const anyFilterGroupsProvided = this.webhookFilters.length > 0;
        const webhook = this.webhook ?? (anyFilterGroupsProvided ? true : undefined);
        if (!webhook && anyFilterGroupsProvided) {
            throw new Error('`webhookFilters` cannot be used when `webhook` is `false`');
        }
        if (!webhook && this.webhookTriggersBatchBuild) {
            throw new Error('`webhookTriggersBatchBuild` cannot be used when `webhook` is `false`');
        }
        const superConfig = super.bind(_scope, project);
        if (this.webhookTriggersBatchBuild) {
            project.enableBatchBuilds();
        }
        return {
            sourceProperty: {
                ...superConfig.sourceProperty,
                reportBuildStatus: this.reportBuildStatus,
            },
            sourceVersion: superConfig.sourceVersion,
            buildTriggers: webhook === undefined ? undefined : {
                webhook,
                buildType: this.webhookTriggersBatchBuild ? 'BUILD_BATCH' : undefined,
                filterGroups: anyFilterGroupsProvided ? this.webhookFilters.map(fg => fg._toJson()) : undefined,
            },
        };
    }
}
/**
 * CodeCommit Source definition for a CodeBuild project.
 */
class CodeCommitSource extends GitSource {
    constructor(props) {
        super(props);
        this.badgeSupported = true;
        this.type = source_types_1.CODECOMMIT_SOURCE_TYPE;
        this.repo = props.repository;
    }
    bind(_scope, project) {
        // https://docs.aws.amazon.com/codebuild/latest/userguide/setting-up.html
        project.addToRolePolicy(new iam.PolicyStatement({
            actions: ['codecommit:GitPull'],
            resources: [this.repo.repositoryArn],
        }));
        const superConfig = super.bind(_scope, project);
        return {
            sourceProperty: {
                ...superConfig.sourceProperty,
                location: this.repo.repositoryCloneUrlHttp,
            },
            sourceVersion: superConfig.sourceVersion,
        };
    }
}
/**
 * S3 bucket definition for a CodeBuild project.
 */
class S3Source extends Source {
    constructor(props) {
        super(props);
        this.type = source_types_1.S3_SOURCE_TYPE;
        this.bucket = props.bucket;
        this.path = props.path;
        this.version = props.version;
    }
    bind(_scope, project) {
        this.bucket.grantRead(project, this.path);
        const superConfig = super.bind(_scope, project);
        return {
            sourceProperty: {
                ...superConfig.sourceProperty,
                location: `${this.bucket.bucketName}/${this.path}`,
            },
            sourceVersion: this.version,
        };
    }
}
class CommonGithubSource extends ThirdPartyGitSource {
    constructor(props) {
        super(props);
        this.buildStatusContext = props.buildStatusContext;
    }
    bind(scope, project) {
        const superConfig = super.bind(scope, project);
        return {
            sourceProperty: {
                ...superConfig.sourceProperty,
                buildStatusConfig: this.buildStatusContext !== undefined || this.buildStatusUrl !== undefined
                    ? {
                        context: this.buildStatusContext,
                        targetUrl: this.buildStatusUrl,
                    }
                    : undefined,
            },
            sourceVersion: superConfig.sourceVersion,
            buildTriggers: superConfig.buildTriggers,
        };
    }
}
/**
 * GitHub Source definition for a CodeBuild project.
 */
class GitHubSource extends CommonGithubSource {
    constructor(props) {
        super(props);
        this.type = source_types_1.GITHUB_SOURCE_TYPE;
        this.httpsCloneUrl = `https://github.com/${props.owner}/${props.repo}.git`;
    }
    bind(_scope, project) {
        const superConfig = super.bind(_scope, project);
        return {
            sourceProperty: {
                ...superConfig.sourceProperty,
                location: this.httpsCloneUrl,
            },
            sourceVersion: superConfig.sourceVersion,
            buildTriggers: superConfig.buildTriggers,
        };
    }
}
/**
 * GitHub Enterprise Source definition for a CodeBuild project.
 */
class GitHubEnterpriseSource extends CommonGithubSource {
    constructor(props) {
        super(props);
        this.type = source_types_1.GITHUB_ENTERPRISE_SOURCE_TYPE;
        this.httpsCloneUrl = props.httpsCloneUrl;
        this.ignoreSslErrors = props.ignoreSslErrors;
    }
    bind(_scope, _project) {
        if (this.hasCommitMessageFilterAndPrEvent()) {
            throw new Error('COMMIT_MESSAGE filters cannot be used with GitHub Enterprise Server pull request events');
        }
        if (this.hasFilePathFilterAndPrEvent()) {
            throw new Error('FILE_PATH filters cannot be used with GitHub Enterprise Server pull request events');
        }
        const superConfig = super.bind(_scope, _project);
        return {
            sourceProperty: {
                ...superConfig.sourceProperty,
                location: this.httpsCloneUrl,
                insecureSsl: this.ignoreSslErrors,
            },
            sourceVersion: superConfig.sourceVersion,
            buildTriggers: superConfig.buildTriggers,
        };
    }
    hasCommitMessageFilterAndPrEvent() {
        return this.webhookFilters.some(fg => (fg._filters.some(fp => fp.type === WebhookFilterTypes.COMMIT_MESSAGE) &&
            this.hasPrEvent(fg._actions)));
    }
    hasFilePathFilterAndPrEvent() {
        return this.webhookFilters.some(fg => (fg._filters.some(fp => fp.type === WebhookFilterTypes.FILE_PATH) &&
            this.hasPrEvent(fg._actions)));
    }
    hasPrEvent(actions) {
        return actions.includes(EventAction.PULL_REQUEST_CREATED ||
            EventAction.PULL_REQUEST_MERGED ||
            EventAction.PULL_REQUEST_REOPENED ||
            EventAction.PULL_REQUEST_UPDATED);
    }
}
/**
 * BitBucket Source definition for a CodeBuild project.
 */
class BitBucketSource extends ThirdPartyGitSource {
    constructor(props) {
        super(props);
        this.type = source_types_1.BITBUCKET_SOURCE_TYPE;
        this.httpsCloneUrl = `https://bitbucket.org/${props.owner}/${props.repo}.git`;
        this.buildStatusName = props.buildStatusName;
    }
    bind(_scope, _project) {
        // BitBucket sources don't support the PULL_REQUEST_REOPENED event action
        if (this.anyWebhookFilterContainsPrReopenedEventAction()) {
            throw new Error('BitBucket sources do not support the PULL_REQUEST_REOPENED webhook event action');
        }
        const superConfig = super.bind(_scope, _project);
        return {
            sourceProperty: {
                ...superConfig.sourceProperty,
                location: this.httpsCloneUrl,
                buildStatusConfig: this.buildStatusName !== undefined || this.buildStatusUrl !== undefined
                    ? {
                        context: this.buildStatusName,
                        targetUrl: this.buildStatusUrl,
                    }
                    : undefined,
            },
            sourceVersion: superConfig.sourceVersion,
            buildTriggers: superConfig.buildTriggers,
        };
    }
    anyWebhookFilterContainsPrReopenedEventAction() {
        return this.webhookFilters.findIndex(fg => {
            return fg._actions.findIndex(a => a === EventAction.PULL_REQUEST_REOPENED) !== -1;
        }) !== -1;
    }
}
function set2Array(set) {
    const ret = [];
    set.forEach(el => ret.push(el));
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHdDQUF3QztBQUt4QyxpREFNd0I7QUEyQ3hCOztHQUVHO0FBQ0gsTUFBc0IsTUFBTTtJQXlCMUIsWUFBc0IsS0FBa0I7UUFGeEIsbUJBQWMsR0FBWSxLQUFLLENBQUM7Ozs7OzsrQ0F2QjVCLE1BQU07Ozs7UUEwQnhCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztLQUNwQztJQTFCTSxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQW9COzs7Ozs7Ozs7O1FBQ25DLE9BQU8sSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDNUI7SUFFTSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQTRCOzs7Ozs7Ozs7O1FBQ25ELE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNwQztJQUVNLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBd0I7Ozs7Ozs7Ozs7UUFDM0MsT0FBTyxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNoQztJQUVNLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFrQzs7Ozs7Ozs7OztRQUMvRCxPQUFPLElBQUksc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDMUM7SUFFTSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQTJCOzs7Ozs7Ozs7O1FBQ2pELE9BQU8sSUFBSSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDbkM7SUFVRDs7OztPQUlHO0lBQ0ksSUFBSSxDQUFDLE1BQWlCLEVBQUUsUUFBa0I7Ozs7Ozs7Ozs7UUFDL0MsT0FBTztZQUNMLGNBQWMsRUFBRTtnQkFDZCxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsVUFBVTtnQkFDakMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2FBQ2hCO1NBQ0YsQ0FBQztLQUNIOztBQXpDSCx3QkEwQ0M7OztB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LE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNqRCxPQUFPO1lBQ0wsY0FBYyxFQUFFO2dCQUNkLEdBQUcsV0FBVyxDQUFDLGNBQWM7Z0JBQzdCLFFBQVEsRUFBRSxJQUFJLENBQUMsYUFBYTtnQkFDNUIsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGVBQWUsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxTQUFTO29CQUN4RixDQUFDLENBQUM7d0JBQ0EsT0FBTyxFQUFFLElBQUksQ0FBQyxlQUFlO3dCQUM3QixTQUFTLEVBQUUsSUFBSSxDQUFDLGNBQWM7cUJBQy9CO29CQUNELENBQUMsQ0FBQyxTQUFTO2FBQ2Q7WUFDRCxhQUFhLEVBQUUsV0FBVyxDQUFDLGFBQWE7WUFDeEMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxhQUFhO1NBQ3pDLENBQUM7S0FDSDtJQUVPLDZDQUE2QztRQUNuRCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ3hDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssV0FBVyxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDcEYsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDWDtDQUNGO0FBRUQsU0FBUyxTQUFTLENBQUksR0FBVztJQUMvQixNQUFNLEdBQUcsR0FBUSxFQUFFLENBQUM7SUFDcEIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNoQyxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb2RlY29tbWl0IGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlY29tbWl0JztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmblByb2plY3QgfSBmcm9tICcuL2NvZGVidWlsZC5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSVByb2plY3QgfSBmcm9tICcuL3Byb2plY3QnO1xuaW1wb3J0IHtcbiAgQklUQlVDS0VUX1NPVVJDRV9UWVBFLFxuICBDT0RFQ09NTUlUX1NPVVJDRV9UWVBFLFxuICBHSVRIVUJfRU5URVJQUklTRV9TT1VSQ0VfVFlQRSxcbiAgR0lUSFVCX1NPVVJDRV9UWVBFLFxuICBTM19TT1VSQ0VfVFlQRSxcbn0gZnJvbSAnLi9zb3VyY2UtdHlwZXMnO1xuXG4vKipcbiAqIFRoZSB0eXBlIHJldHVybmVkIGZyb20gYElTb3VyY2UjYmluZGAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU291cmNlQ29uZmlnIHtcbiAgcmVhZG9ubHkgc291cmNlUHJvcGVydHk6IENmblByb2plY3QuU291cmNlUHJvcGVydHk7XG5cbiAgcmVhZG9ubHkgYnVpbGRUcmlnZ2Vycz86IENmblByb2plY3QuUHJvamVjdFRyaWdnZXJzUHJvcGVydHk7XG5cbiAgLyoqXG4gICAqIGBBV1M6OkNvZGVCdWlsZDo6UHJvamVjdC5Tb3VyY2VWZXJzaW9uYFxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWNvZGVidWlsZC1wcm9qZWN0Lmh0bWwjY2ZuLWNvZGVidWlsZC1wcm9qZWN0LXNvdXJjZXZlcnNpb25cbiAgICogQGRlZmF1bHQgdGhlIGxhdGVzdCB2ZXJzaW9uXG4gICAqL1xuICByZWFkb25seSBzb3VyY2VWZXJzaW9uPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRoZSBhYnN0cmFjdCBpbnRlcmZhY2Ugb2YgYSBDb2RlQnVpbGQgc291cmNlLlxuICogSW1wbGVtZW50ZWQgYnkgYFNvdXJjZWAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVNvdXJjZSB7XG4gIHJlYWRvbmx5IGlkZW50aWZpZXI/OiBzdHJpbmc7XG5cbiAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuXG4gIHJlYWRvbmx5IGJhZGdlU3VwcG9ydGVkOiBib29sZWFuO1xuXG4gIGJpbmQoc2NvcGU6IENvbnN0cnVjdCwgcHJvamVjdDogSVByb2plY3QpOiBTb3VyY2VDb25maWc7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBjb21tb24gdG8gYWxsIFNvdXJjZSBjbGFzc2VzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNvdXJjZVByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBzb3VyY2UgaWRlbnRpZmllci5cbiAgICogVGhpcyBwcm9wZXJ0eSBpcyByZXF1aXJlZCBvbiBzZWNvbmRhcnkgc291cmNlcy5cbiAgICovXG4gIHJlYWRvbmx5IGlkZW50aWZpZXI/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogU291cmNlIHByb3ZpZGVyIGRlZmluaXRpb24gZm9yIGEgQ29kZUJ1aWxkIFByb2plY3QuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTb3VyY2UgaW1wbGVtZW50cyBJU291cmNlIHtcbiAgcHVibGljIHN0YXRpYyBzMyhwcm9wczogUzNTb3VyY2VQcm9wcyk6IElTb3VyY2Uge1xuICAgIHJldHVybiBuZXcgUzNTb3VyY2UocHJvcHMpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBjb2RlQ29tbWl0KHByb3BzOiBDb2RlQ29tbWl0U291cmNlUHJvcHMpOiBJU291cmNlIHtcbiAgICByZXR1cm4gbmV3IENvZGVDb21taXRTb3VyY2UocHJvcHMpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBnaXRIdWIocHJvcHM6IEdpdEh1YlNvdXJjZVByb3BzKTogSVNvdXJjZSB7XG4gICAgcmV0dXJuIG5ldyBHaXRIdWJTb3VyY2UocHJvcHMpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBnaXRIdWJFbnRlcnByaXNlKHByb3BzOiBHaXRIdWJFbnRlcnByaXNlU291cmNlUHJvcHMpOiBJU291cmNlIHtcbiAgICByZXR1cm4gbmV3IEdpdEh1YkVudGVycHJpc2VTb3VyY2UocHJvcHMpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBiaXRCdWNrZXQocHJvcHM6IEJpdEJ1Y2tldFNvdXJjZVByb3BzKTogSVNvdXJjZSB7XG4gICAgcmV0dXJuIG5ldyBCaXRCdWNrZXRTb3VyY2UocHJvcHMpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGlkZW50aWZpZXI/OiBzdHJpbmc7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBiYWRnZVN1cHBvcnRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3Rvcihwcm9wczogU291cmNlUHJvcHMpIHtcbiAgICB0aGlzLmlkZW50aWZpZXIgPSBwcm9wcy5pZGVudGlmaWVyO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCBieSB0aGUgcHJvamVjdCB3aGVuIHRoZSBzb3VyY2UgaXMgYWRkZWQgc28gdGhhdCB0aGUgc291cmNlIGNhbiBwZXJmb3JtXG4gICAqIGJpbmRpbmcgb3BlcmF0aW9ucyBvbiB0aGUgc291cmNlLiBGb3IgZXhhbXBsZSwgaXQgY2FuIGdyYW50IHBlcm1pc3Npb25zIHRvIHRoZVxuICAgKiBjb2RlIGJ1aWxkIHByb2plY3QgdG8gcmVhZCBmcm9tIHRoZSBTMyBidWNrZXQuXG4gICAqL1xuICBwdWJsaWMgYmluZChfc2NvcGU6IENvbnN0cnVjdCwgX3Byb2plY3Q6IElQcm9qZWN0KTogU291cmNlQ29uZmlnIHtcbiAgICByZXR1cm4ge1xuICAgICAgc291cmNlUHJvcGVydHk6IHtcbiAgICAgICAgc291cmNlSWRlbnRpZmllcjogdGhpcy5pZGVudGlmaWVyLFxuICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgY29uc3RydWN0aW9uIHByb3BlcnRpZXMgY29tbW9uIHRvIGFsbCBidWlsZCBzb3VyY2VzIHRoYXQgYXJlIGJhY2tlZCBieSBHaXQuXG4gKi9cbmludGVyZmFjZSBHaXRTb3VyY2VQcm9wcyBleHRlbmRzIFNvdXJjZVByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBkZXB0aCBvZiBoaXN0b3J5IHRvIGRvd25sb2FkLiBNaW5pbXVtIHZhbHVlIGlzIDAuXG4gICAqIElmIHRoaXMgdmFsdWUgaXMgMCwgZ3JlYXRlciB0aGFuIDI1LCBvciBub3QgcHJvdmlkZWQsXG4gICAqIHRoZW4gdGhlIGZ1bGwgaGlzdG9yeSBpcyBkb3dubG9hZGVkIHdpdGggZWFjaCBidWlsZCBvZiB0aGUgcHJvamVjdC5cbiAgICovXG4gIHJlYWRvbmx5IGNsb25lRGVwdGg/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBjb21taXQgSUQsIHB1bGwgcmVxdWVzdCBJRCwgYnJhbmNoIG5hbWUsIG9yIHRhZyBuYW1lIHRoYXQgY29ycmVzcG9uZHMgdG9cbiAgICogdGhlIHZlcnNpb24gb2YgdGhlIHNvdXJjZSBjb2RlIHlvdSB3YW50IHRvIGJ1aWxkXG4gICAqXG4gICAqIEBleGFtcGxlICdteWJyYW5jaCdcbiAgICogQGRlZmF1bHQgdGhlIGRlZmF1bHQgYnJhbmNoJ3MgSEVBRCBjb21taXQgSUQgaXMgdXNlZFxuICAgKi9cbiAgcmVhZG9ubHkgYnJhbmNoT3JSZWY/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZmV0Y2ggc3VibW9kdWxlcyB3aGlsZSBjbG9uaW5nIGdpdCByZXBvLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgZmV0Y2hTdWJtb2R1bGVzPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIGNvbW1vbiBzdXBlcmNsYXNzIG9mIGFsbCBidWlsZCBzb3VyY2VzIHRoYXQgYXJlIGJhY2tlZCBieSBHaXQuXG4gKi9cbmFic3RyYWN0IGNsYXNzIEdpdFNvdXJjZSBleHRlbmRzIFNvdXJjZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgY2xvbmVEZXB0aD86IG51bWJlcjtcbiAgcHJpdmF0ZSByZWFkb25seSBicmFuY2hPclJlZj86IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBmZXRjaFN1Ym1vZHVsZXM/OiBib29sZWFuO1xuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3Rvcihwcm9wczogR2l0U291cmNlUHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLmNsb25lRGVwdGggPSBwcm9wcy5jbG9uZURlcHRoO1xuICAgIHRoaXMuYnJhbmNoT3JSZWYgPSBwcm9wcy5icmFuY2hPclJlZjtcbiAgICB0aGlzLmZldGNoU3VibW9kdWxlcyA9IHByb3BzLmZldGNoU3VibW9kdWxlcztcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKF9zY29wZTogQ29uc3RydWN0LCBfcHJvamVjdDogSVByb2plY3QpOiBTb3VyY2VDb25maWcge1xuICAgIGNvbnN0IHN1cGVyQ29uZmlnID0gc3VwZXIuYmluZChfc2NvcGUsIF9wcm9qZWN0KTtcbiAgICByZXR1cm4ge1xuICAgICAgc291cmNlVmVyc2lvbjogdGhpcy5icmFuY2hPclJlZixcbiAgICAgIHNvdXJjZVByb3BlcnR5OiB7XG4gICAgICAgIC4uLnN1cGVyQ29uZmlnLnNvdXJjZVByb3BlcnR5LFxuICAgICAgICBnaXRDbG9uZURlcHRoOiB0aGlzLmNsb25lRGVwdGgsXG4gICAgICAgIGdpdFN1Ym1vZHVsZXNDb25maWc6IHRoaXMuZmV0Y2hTdWJtb2R1bGVzID8ge1xuICAgICAgICAgIGZldGNoU3VibW9kdWxlczogdGhpcy5mZXRjaFN1Ym1vZHVsZXMsXG4gICAgICAgIH0gOiB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgdHlwZXMgb2Ygd2ViaG9vayBldmVudCBhY3Rpb25zLlxuICovXG5leHBvcnQgZW51bSBFdmVudEFjdGlvbiB7XG4gIC8qKlxuICAgKiBBIHB1c2ggKG9mIGEgYnJhbmNoLCBvciBhIHRhZykgdG8gdGhlIHJlcG9zaXRvcnkuXG4gICAqL1xuICBQVVNIID0gJ1BVU0gnLFxuXG4gIC8qKlxuICAgKiBDcmVhdGluZyBhIFB1bGwgUmVxdWVzdC5cbiAgICovXG4gIFBVTExfUkVRVUVTVF9DUkVBVEVEID0gJ1BVTExfUkVRVUVTVF9DUkVBVEVEJyxcblxuICAvKipcbiAgICogVXBkYXRpbmcgYSBQdWxsIFJlcXVlc3QuXG4gICAqL1xuICBQVUxMX1JFUVVFU1RfVVBEQVRFRCA9ICdQVUxMX1JFUVVFU1RfVVBEQVRFRCcsXG5cbiAgLyoqXG4gICAqIE1lcmdpbmcgYSBQdWxsIFJlcXVlc3QuXG4gICAqL1xuICBQVUxMX1JFUVVFU1RfTUVSR0VEID0gJ1BVTExfUkVRVUVTVF9NRVJHRUQnLFxuXG4gIC8qKlxuICAgKiBSZS1vcGVuaW5nIGEgcHJldmlvdXNseSBjbG9zZWQgUHVsbCBSZXF1ZXN0LlxuICAgKiBOb3RlIHRoYXQgdGhpcyBldmVudCBpcyBvbmx5IHN1cHBvcnRlZCBmb3IgR2l0SHViIGFuZCBHaXRIdWJFbnRlcnByaXNlIHNvdXJjZXMuXG4gICAqL1xuICBQVUxMX1JFUVVFU1RfUkVPUEVORUQgPSAnUFVMTF9SRVFVRVNUX1JFT1BFTkVEJyxcbn1cblxuZW51bSBXZWJob29rRmlsdGVyVHlwZXMge1xuICBGSUxFX1BBVEggPSAnRklMRV9QQVRIJyxcbiAgQ09NTUlUX01FU1NBR0UgPSAnQ09NTUlUX01FU1NBR0UnLFxuICBIRUFEX1JFRiA9ICdIRUFEX1JFRicsXG4gIEFDVE9SX0FDQ09VTlRfSUQgPSAnQUNUT1JfQUNDT1VOVF9JRCcsXG4gIEJBU0VfUkVGID0gJ0JBU0VfUkVGJyxcbn1cblxuLyoqXG4gKiBBbiBvYmplY3QgdGhhdCByZXByZXNlbnRzIGEgZ3JvdXAgb2YgZmlsdGVyIGNvbmRpdGlvbnMgZm9yIGEgd2ViaG9vay5cbiAqIEV2ZXJ5IGNvbmRpdGlvbiBpbiBhIGdpdmVuIEZpbHRlckdyb3VwIG11c3QgYmUgdHJ1ZSBpbiBvcmRlciBmb3IgdGhlIHdob2xlIGdyb3VwIHRvIGJlIHRydWUuXG4gKiBZb3UgY29uc3RydWN0IGluc3RhbmNlcyBvZiBpdCBieSBjYWxsaW5nIHRoZSBgI2luRXZlbnRPZmAgc3RhdGljIGZhY3RvcnkgbWV0aG9kLFxuICogYW5kIHRoZW4gY2FsbGluZyB2YXJpb3VzIGBhbmRYeXpgIGluc3RhbmNlIG1ldGhvZHMgdG8gY3JlYXRlIG1vZGlmaWVkIGluc3RhbmNlcyBvZiBpdFxuICogKHRoaXMgY2xhc3MgaXMgaW1tdXRhYmxlKS5cbiAqXG4gKiBZb3UgcGFzcyBpbnN0YW5jZXMgb2YgdGhpcyBjbGFzcyB0byB0aGUgYHdlYmhvb2tGaWx0ZXJzYCBwcm9wZXJ0eSB3aGVuIGNvbnN0cnVjdGluZyBhIHNvdXJjZS5cbiAqL1xuZXhwb3J0IGNsYXNzIEZpbHRlckdyb3VwIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgZXZlbnQgRmlsdGVyR3JvdXAgdGhhdCB0cmlnZ2VycyBvbiBhbnkgb2YgdGhlIHByb3ZpZGVkIGFjdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSBhY3Rpb25zIHRoZSBhY3Rpb25zIHRvIHRyaWdnZXIgdGhlIHdlYmhvb2sgb25cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaW5FdmVudE9mKC4uLmFjdGlvbnM6IEV2ZW50QWN0aW9uW10pOiBGaWx0ZXJHcm91cCB7XG4gICAgcmV0dXJuIG5ldyBGaWx0ZXJHcm91cChuZXcgU2V0KGFjdGlvbnMpLCBbXSk7XG4gIH1cblxuICBwcml2YXRlIHJlYWRvbmx5IGFjdGlvbnM6IFNldDxFdmVudEFjdGlvbj47XG4gIHByaXZhdGUgcmVhZG9ubHkgZmlsdGVyczogQ2ZuUHJvamVjdC5XZWJob29rRmlsdGVyUHJvcGVydHlbXTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKGFjdGlvbnM6IFNldDxFdmVudEFjdGlvbj4sIGZpbHRlcnM6IENmblByb2plY3QuV2ViaG9va0ZpbHRlclByb3BlcnR5W10pIHtcbiAgICBpZiAoYWN0aW9ucy5zaXplID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgZmlsdGVyIGdyb3VwIG11c3QgY29udGFpbiBhdCBsZWFzdCBvbmUgZXZlbnQgYWN0aW9uJyk7XG4gICAgfVxuICAgIHRoaXMuYWN0aW9ucyA9IGFjdGlvbnM7XG4gICAgdGhpcy5maWx0ZXJzID0gZmlsdGVycztcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgRmlsdGVyR3JvdXAgd2l0aCBhbiBhZGRlZCBjb25kaXRpb246XG4gICAqIHRoZSBldmVudCBtdXN0IGFmZmVjdCB0aGUgZ2l2ZW4gYnJhbmNoLlxuICAgKlxuICAgKiBAcGFyYW0gYnJhbmNoTmFtZSB0aGUgbmFtZSBvZiB0aGUgYnJhbmNoIChjYW4gYmUgYSByZWd1bGFyIGV4cHJlc3Npb24pXG4gICAqL1xuICBwdWJsaWMgYW5kQnJhbmNoSXMoYnJhbmNoTmFtZTogc3RyaW5nKTogRmlsdGVyR3JvdXAge1xuICAgIHJldHVybiB0aGlzLmFkZEhlYWRCcmFuY2hGaWx0ZXIoYnJhbmNoTmFtZSwgdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IEZpbHRlckdyb3VwIHdpdGggYW4gYWRkZWQgY29uZGl0aW9uOlxuICAgKiB0aGUgZXZlbnQgbXVzdCBub3QgYWZmZWN0IHRoZSBnaXZlbiBicmFuY2guXG4gICAqXG4gICAqIEBwYXJhbSBicmFuY2hOYW1lIHRoZSBuYW1lIG9mIHRoZSBicmFuY2ggKGNhbiBiZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbilcbiAgICovXG4gIHB1YmxpYyBhbmRCcmFuY2hJc05vdChicmFuY2hOYW1lOiBzdHJpbmcpOiBGaWx0ZXJHcm91cCB7XG4gICAgcmV0dXJuIHRoaXMuYWRkSGVhZEJyYW5jaEZpbHRlcihicmFuY2hOYW1lLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IEZpbHRlckdyb3VwIHdpdGggYW4gYWRkZWQgY29uZGl0aW9uOlxuICAgKiB0aGUgZXZlbnQgbXVzdCBhZmZlY3QgYSBoZWFkIGNvbW1pdCB3aXRoIHRoZSBnaXZlbiBtZXNzYWdlLlxuICAgKlxuICAgKiBAcGFyYW0gY29tbWl0TWVzc2FnZSB0aGUgY29tbWl0IG1lc3NhZ2UgKGNhbiBiZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbilcbiAgICovXG4gIHB1YmxpYyBhbmRDb21taXRNZXNzYWdlSXMoY29tbWl0TWVzc2FnZTogc3RyaW5nKTogRmlsdGVyR3JvdXAge1xuICAgIHJldHVybiB0aGlzLmFkZENvbW1pdE1lc3NhZ2VGaWx0ZXIoY29tbWl0TWVzc2FnZSwgdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IEZpbHRlckdyb3VwIHdpdGggYW4gYWRkZWQgY29uZGl0aW9uOlxuICAgKiB0aGUgZXZlbnQgbXVzdCBub3QgYWZmZWN0IGEgaGVhZCBjb21taXQgd2l0aCB0aGUgZ2l2ZW4gbWVzc2FnZS5cbiAgICpcbiAgICogQHBhcmFtIGNvbW1pdE1lc3NhZ2UgdGhlIGNvbW1pdCBtZXNzYWdlIChjYW4gYmUgYSByZWd1bGFyIGV4cHJlc3Npb24pXG4gICAqL1xuICBwdWJsaWMgYW5kQ29tbWl0TWVzc2FnZUlzTm90KGNvbW1pdE1lc3NhZ2U6IHN0cmluZyk6IEZpbHRlckdyb3VwIHtcbiAgICByZXR1cm4gdGhpcy5hZGRDb21taXRNZXNzYWdlRmlsdGVyKGNvbW1pdE1lc3NhZ2UsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgRmlsdGVyR3JvdXAgd2l0aCBhbiBhZGRlZCBjb25kaXRpb246XG4gICAqIHRoZSBldmVudCBtdXN0IGFmZmVjdCB0aGUgZ2l2ZW4gdGFnLlxuICAgKlxuICAgKiBAcGFyYW0gdGFnTmFtZSB0aGUgbmFtZSBvZiB0aGUgdGFnIChjYW4gYmUgYSByZWd1bGFyIGV4cHJlc3Npb24pXG4gICAqL1xuICBwdWJsaWMgYW5kVGFnSXModGFnTmFtZTogc3RyaW5nKTogRmlsdGVyR3JvdXAge1xuICAgIHJldHVybiB0aGlzLmFkZEhlYWRUYWdGaWx0ZXIodGFnTmFtZSwgdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IEZpbHRlckdyb3VwIHdpdGggYW4gYWRkZWQgY29uZGl0aW9uOlxuICAgKiB0aGUgZXZlbnQgbXVzdCBub3QgYWZmZWN0IHRoZSBnaXZlbiB0YWcuXG4gICAqXG4gICAqIEBwYXJhbSB0YWdOYW1lIHRoZSBuYW1lIG9mIHRoZSB0YWcgKGNhbiBiZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbilcbiAgICovXG4gIHB1YmxpYyBhbmRUYWdJc05vdCh0YWdOYW1lOiBzdHJpbmcpOiBGaWx0ZXJHcm91cCB7XG4gICAgcmV0dXJuIHRoaXMuYWRkSGVhZFRhZ0ZpbHRlcih0YWdOYW1lLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IEZpbHRlckdyb3VwIHdpdGggYW4gYWRkZWQgY29uZGl0aW9uOlxuICAgKiB0aGUgZXZlbnQgbXVzdCBhZmZlY3QgYSBHaXQgcmVmZXJlbmNlIChpZS4sIGEgYnJhbmNoIG9yIGEgdGFnKVxuICAgKiB0aGF0IG1hdGNoZXMgdGhlIGdpdmVuIHBhdHRlcm4uXG4gICAqXG4gICAqIEBwYXJhbSBwYXR0ZXJuIGEgcmVndWxhciBleHByZXNzaW9uXG4gICAqL1xuICBwdWJsaWMgYW5kSGVhZFJlZklzKHBhdHRlcm46IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmFkZEhlYWRSZWZGaWx0ZXIocGF0dGVybiwgdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IEZpbHRlckdyb3VwIHdpdGggYW4gYWRkZWQgY29uZGl0aW9uOlxuICAgKiB0aGUgZXZlbnQgbXVzdCBub3QgYWZmZWN0IGEgR2l0IHJlZmVyZW5jZSAoaWUuLCBhIGJyYW5jaCBvciBhIHRhZylcbiAgICogdGhhdCBtYXRjaGVzIHRoZSBnaXZlbiBwYXR0ZXJuLlxuICAgKlxuICAgKiBAcGFyYW0gcGF0dGVybiBhIHJlZ3VsYXIgZXhwcmVzc2lvblxuICAgKi9cbiAgcHVibGljIGFuZEhlYWRSZWZJc05vdChwYXR0ZXJuOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5hZGRIZWFkUmVmRmlsdGVyKHBhdHRlcm4sIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgRmlsdGVyR3JvdXAgd2l0aCBhbiBhZGRlZCBjb25kaXRpb246XG4gICAqIHRoZSBhY2NvdW50IElEIG9mIHRoZSBhY3RvciBpbml0aWF0aW5nIHRoZSBldmVudCBtdXN0IG1hdGNoIHRoZSBnaXZlbiBwYXR0ZXJuLlxuICAgKlxuICAgKiBAcGFyYW0gcGF0dGVybiBhIHJlZ3VsYXIgZXhwcmVzc2lvblxuICAgKi9cbiAgcHVibGljIGFuZEFjdG9yQWNjb3VudElzKHBhdHRlcm46IHN0cmluZyk6IEZpbHRlckdyb3VwIHtcbiAgICByZXR1cm4gdGhpcy5hZGRBY3RvckFjY291bnRJZChwYXR0ZXJuLCB0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgRmlsdGVyR3JvdXAgd2l0aCBhbiBhZGRlZCBjb25kaXRpb246XG4gICAqIHRoZSBhY2NvdW50IElEIG9mIHRoZSBhY3RvciBpbml0aWF0aW5nIHRoZSBldmVudCBtdXN0IG5vdCBtYXRjaCB0aGUgZ2l2ZW4gcGF0dGVybi5cbiAgICpcbiAgICogQHBhcmFtIHBhdHRlcm4gYSByZWd1bGFyIGV4cHJlc3Npb25cbiAgICovXG4gIHB1YmxpYyBhbmRBY3RvckFjY291bnRJc05vdChwYXR0ZXJuOiBzdHJpbmcpOiBGaWx0ZXJHcm91cCB7XG4gICAgcmV0dXJuIHRoaXMuYWRkQWN0b3JBY2NvdW50SWQocGF0dGVybiwgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBGaWx0ZXJHcm91cCB3aXRoIGFuIGFkZGVkIGNvbmRpdGlvbjpcbiAgICogdGhlIFB1bGwgUmVxdWVzdCB0aGF0IGlzIHRoZSBzb3VyY2Ugb2YgdGhlIGV2ZW50IG11c3QgdGFyZ2V0IHRoZSBnaXZlbiBiYXNlIGJyYW5jaC5cbiAgICogTm90ZSB0aGF0IHlvdSBjYW5ub3QgdXNlIHRoaXMgbWV0aG9kIGlmIHRoaXMgR3JvdXAgY29udGFpbnMgdGhlIGBQVVNIYCBldmVudCBhY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSBicmFuY2hOYW1lIHRoZSBuYW1lIG9mIHRoZSBicmFuY2ggKGNhbiBiZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbilcbiAgICovXG4gIHB1YmxpYyBhbmRCYXNlQnJhbmNoSXMoYnJhbmNoTmFtZTogc3RyaW5nKTogRmlsdGVyR3JvdXAge1xuICAgIHJldHVybiB0aGlzLmFkZEJhc2VCcmFuY2hGaWx0ZXIoYnJhbmNoTmFtZSwgdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IEZpbHRlckdyb3VwIHdpdGggYW4gYWRkZWQgY29uZGl0aW9uOlxuICAgKiB0aGUgUHVsbCBSZXF1ZXN0IHRoYXQgaXMgdGhlIHNvdXJjZSBvZiB0aGUgZXZlbnQgbXVzdCBub3QgdGFyZ2V0IHRoZSBnaXZlbiBiYXNlIGJyYW5jaC5cbiAgICogTm90ZSB0aGF0IHlvdSBjYW5ub3QgdXNlIHRoaXMgbWV0aG9kIGlmIHRoaXMgR3JvdXAgY29udGFpbnMgdGhlIGBQVVNIYCBldmVudCBhY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSBicmFuY2hOYW1lIHRoZSBuYW1lIG9mIHRoZSBicmFuY2ggKGNhbiBiZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbilcbiAgICovXG4gIHB1YmxpYyBhbmRCYXNlQnJhbmNoSXNOb3QoYnJhbmNoTmFtZTogc3RyaW5nKTogRmlsdGVyR3JvdXAge1xuICAgIHJldHVybiB0aGlzLmFkZEJhc2VCcmFuY2hGaWx0ZXIoYnJhbmNoTmFtZSwgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBGaWx0ZXJHcm91cCB3aXRoIGFuIGFkZGVkIGNvbmRpdGlvbjpcbiAgICogdGhlIFB1bGwgUmVxdWVzdCB0aGF0IGlzIHRoZSBzb3VyY2Ugb2YgdGhlIGV2ZW50IG11c3QgdGFyZ2V0IHRoZSBnaXZlbiBHaXQgcmVmZXJlbmNlLlxuICAgKiBOb3RlIHRoYXQgeW91IGNhbm5vdCB1c2UgdGhpcyBtZXRob2QgaWYgdGhpcyBHcm91cCBjb250YWlucyB0aGUgYFBVU0hgIGV2ZW50IGFjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHBhdHRlcm4gYSByZWd1bGFyIGV4cHJlc3Npb25cbiAgICovXG4gIHB1YmxpYyBhbmRCYXNlUmVmSXMocGF0dGVybjogc3RyaW5nKTogRmlsdGVyR3JvdXAge1xuICAgIHJldHVybiB0aGlzLmFkZEJhc2VSZWZGaWx0ZXIocGF0dGVybiwgdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IEZpbHRlckdyb3VwIHdpdGggYW4gYWRkZWQgY29uZGl0aW9uOlxuICAgKiB0aGUgUHVsbCBSZXF1ZXN0IHRoYXQgaXMgdGhlIHNvdXJjZSBvZiB0aGUgZXZlbnQgbXVzdCBub3QgdGFyZ2V0IHRoZSBnaXZlbiBHaXQgcmVmZXJlbmNlLlxuICAgKiBOb3RlIHRoYXQgeW91IGNhbm5vdCB1c2UgdGhpcyBtZXRob2QgaWYgdGhpcyBHcm91cCBjb250YWlucyB0aGUgYFBVU0hgIGV2ZW50IGFjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHBhdHRlcm4gYSByZWd1bGFyIGV4cHJlc3Npb25cbiAgICovXG4gIHB1YmxpYyBhbmRCYXNlUmVmSXNOb3QocGF0dGVybjogc3RyaW5nKTogRmlsdGVyR3JvdXAge1xuICAgIHJldHVybiB0aGlzLmFkZEJhc2VSZWZGaWx0ZXIocGF0dGVybiwgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBGaWx0ZXJHcm91cCB3aXRoIGFuIGFkZGVkIGNvbmRpdGlvbjpcbiAgICogdGhlIHB1c2ggdGhhdCBpcyB0aGUgc291cmNlIG9mIHRoZSBldmVudCBtdXN0IGFmZmVjdCBhIGZpbGUgdGhhdCBtYXRjaGVzIHRoZSBnaXZlbiBwYXR0ZXJuLlxuICAgKiBOb3RlIHRoYXQgeW91IGNhbiBvbmx5IHVzZSB0aGlzIG1ldGhvZCBpZiB0aGlzIEdyb3VwIGNvbnRhaW5zIG9ubHkgdGhlIGBQVVNIYCBldmVudCBhY3Rpb24sXG4gICAqIGFuZCBvbmx5IGZvciBHaXRIdWIsIEJpdGJ1Y2tldCBhbmQgR2l0SHViRW50ZXJwcmlzZSBzb3VyY2VzLlxuICAgKlxuICAgKiBAcGFyYW0gcGF0dGVybiBhIHJlZ3VsYXIgZXhwcmVzc2lvblxuICAgKi9cbiAgcHVibGljIGFuZEZpbGVQYXRoSXMocGF0dGVybjogc3RyaW5nKTogRmlsdGVyR3JvdXAge1xuICAgIHJldHVybiB0aGlzLmFkZEZpbGVQYXRoRmlsdGVyKHBhdHRlcm4sIHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBGaWx0ZXJHcm91cCB3aXRoIGFuIGFkZGVkIGNvbmRpdGlvbjpcbiAgICogdGhlIHB1c2ggdGhhdCBpcyB0aGUgc291cmNlIG9mIHRoZSBldmVudCBtdXN0IG5vdCBhZmZlY3QgYSBmaWxlIHRoYXQgbWF0Y2hlcyB0aGUgZ2l2ZW4gcGF0dGVybi5cbiAgICogTm90ZSB0aGF0IHlvdSBjYW4gb25seSB1c2UgdGhpcyBtZXRob2QgaWYgdGhpcyBHcm91cCBjb250YWlucyBvbmx5IHRoZSBgUFVTSGAgZXZlbnQgYWN0aW9uLFxuICAgKiBhbmQgb25seSBmb3IgR2l0SHViLCBCaXRidWNrZXQgYW5kIEdpdEh1YkVudGVycHJpc2Ugc291cmNlcy5cbiAgICpcbiAgICogQHBhcmFtIHBhdHRlcm4gYSByZWd1bGFyIGV4cHJlc3Npb25cbiAgICovXG4gIHB1YmxpYyBhbmRGaWxlUGF0aElzTm90KHBhdHRlcm46IHN0cmluZyk6IEZpbHRlckdyb3VwIHtcbiAgICByZXR1cm4gdGhpcy5hZGRGaWxlUGF0aEZpbHRlcihwYXR0ZXJuLCBmYWxzZSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHB1YmxpYyBnZXQgX2FjdGlvbnMoKTogRXZlbnRBY3Rpb25bXSB7XG4gICAgcmV0dXJuIHNldDJBcnJheSh0aGlzLmFjdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwdWJsaWMgZ2V0IF9maWx0ZXJzKCk6IENmblByb2plY3QuV2ViaG9va0ZpbHRlclByb3BlcnR5W10ge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcnMuc2xpY2UoKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHVibGljIF90b0pzb24oKTogQ2ZuUHJvamVjdC5XZWJob29rRmlsdGVyUHJvcGVydHlbXSB7XG4gICAgY29uc3QgZXZlbnRGaWx0ZXI6IENmblByb2plY3QuV2ViaG9va0ZpbHRlclByb3BlcnR5ID0ge1xuICAgICAgdHlwZTogJ0VWRU5UJyxcbiAgICAgIHBhdHRlcm46IHNldDJBcnJheSh0aGlzLmFjdGlvbnMpLmpvaW4oJywgJyksXG4gICAgfTtcbiAgICByZXR1cm4gW2V2ZW50RmlsdGVyXS5jb25jYXQodGhpcy5maWx0ZXJzKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkQ29tbWl0TWVzc2FnZUZpbHRlcihjb21taXRNZXNzYWdlOiBzdHJpbmcsIGluY2x1ZGU6IGJvb2xlYW4pOiBGaWx0ZXJHcm91cCB7XG4gICAgcmV0dXJuIHRoaXMuYWRkRmlsdGVyKFdlYmhvb2tGaWx0ZXJUeXBlcy5DT01NSVRfTUVTU0FHRSwgY29tbWl0TWVzc2FnZSwgaW5jbHVkZSk7XG4gIH1cblxuICBwcml2YXRlIGFkZEhlYWRCcmFuY2hGaWx0ZXIoYnJhbmNoTmFtZTogc3RyaW5nLCBpbmNsdWRlOiBib29sZWFuKTogRmlsdGVyR3JvdXAge1xuICAgIHJldHVybiB0aGlzLmFkZEhlYWRSZWZGaWx0ZXIoYHJlZnMvaGVhZHMvJHticmFuY2hOYW1lfWAsIGluY2x1ZGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRIZWFkVGFnRmlsdGVyKHRhZ05hbWU6IHN0cmluZywgaW5jbHVkZTogYm9vbGVhbik6IEZpbHRlckdyb3VwIHtcbiAgICByZXR1cm4gdGhpcy5hZGRIZWFkUmVmRmlsdGVyKGByZWZzL3RhZ3MvJHt0YWdOYW1lfWAsIGluY2x1ZGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRIZWFkUmVmRmlsdGVyKHJlZk5hbWU6IHN0cmluZywgaW5jbHVkZTogYm9vbGVhbikge1xuICAgIHJldHVybiB0aGlzLmFkZEZpbHRlcihXZWJob29rRmlsdGVyVHlwZXMuSEVBRF9SRUYsIHJlZk5hbWUsIGluY2x1ZGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRBY3RvckFjY291bnRJZChhY2NvdW50SWQ6IHN0cmluZywgaW5jbHVkZTogYm9vbGVhbikge1xuICAgIHJldHVybiB0aGlzLmFkZEZpbHRlcihXZWJob29rRmlsdGVyVHlwZXMuQUNUT1JfQUNDT1VOVF9JRCwgYWNjb3VudElkLCBpbmNsdWRlKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkQmFzZUJyYW5jaEZpbHRlcihicmFuY2hOYW1lOiBzdHJpbmcsIGluY2x1ZGU6IGJvb2xlYW4pOiBGaWx0ZXJHcm91cCB7XG4gICAgcmV0dXJuIHRoaXMuYWRkQmFzZVJlZkZpbHRlcihgcmVmcy9oZWFkcy8ke2JyYW5jaE5hbWV9YCwgaW5jbHVkZSk7XG4gIH1cblxuICBwcml2YXRlIGFkZEJhc2VSZWZGaWx0ZXIocmVmTmFtZTogc3RyaW5nLCBpbmNsdWRlOiBib29sZWFuKSB7XG4gICAgaWYgKHRoaXMuYWN0aW9ucy5oYXMoRXZlbnRBY3Rpb24uUFVTSCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQSBiYXNlIHJlZmVyZW5jZSBjb25kaXRpb24gY2Fubm90IGJlIGFkZGVkIGlmIGEgR3JvdXAgY29udGFpbnMgYSBQVVNIIGV2ZW50IGFjdGlvbicpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5hZGRGaWx0ZXIoV2ViaG9va0ZpbHRlclR5cGVzLkJBU0VfUkVGLCByZWZOYW1lLCBpbmNsdWRlKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkRmlsZVBhdGhGaWx0ZXIocGF0dGVybjogc3RyaW5nLCBpbmNsdWRlOiBib29sZWFuKTogRmlsdGVyR3JvdXAge1xuICAgIHJldHVybiB0aGlzLmFkZEZpbHRlcihXZWJob29rRmlsdGVyVHlwZXMuRklMRV9QQVRILCBwYXR0ZXJuLCBpbmNsdWRlKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkRmlsdGVyKHR5cGU6IFdlYmhvb2tGaWx0ZXJUeXBlcywgcGF0dGVybjogc3RyaW5nLCBpbmNsdWRlOiBib29sZWFuKSB7XG4gICAgcmV0dXJuIG5ldyBGaWx0ZXJHcm91cCh0aGlzLmFjdGlvbnMsIHRoaXMuZmlsdGVycy5jb25jYXQoW3tcbiAgICAgIHR5cGUsXG4gICAgICBwYXR0ZXJuLFxuICAgICAgZXhjbHVkZU1hdGNoZWRQYXR0ZXJuOiBpbmNsdWRlID8gdW5kZWZpbmVkIDogdHJ1ZSxcbiAgICB9XSkpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGNvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIGNvbW1vbiB0byBhbGwgdGhpcmQtcGFydHkgYnVpbGQgc291cmNlcyB0aGF0IGFyZSBiYWNrZWQgYnkgR2l0LlxuICovXG5pbnRlcmZhY2UgVGhpcmRQYXJ0eUdpdFNvdXJjZVByb3BzIGV4dGVuZHMgR2l0U291cmNlUHJvcHMge1xuICAvKipcbiAgICogV2hldGhlciB0byBzZW5kIG5vdGlmaWNhdGlvbnMgb24geW91ciBidWlsZCdzIHN0YXJ0IGFuZCBlbmQuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IHJlcG9ydEJ1aWxkU3RhdHVzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBjcmVhdGUgYSB3ZWJob29rIHRoYXQgd2lsbCB0cmlnZ2VyIGEgYnVpbGQgZXZlcnkgdGltZSBhbiBldmVudCBoYXBwZW5zIGluIHRoZSByZXBvc2l0b3J5LlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlIGlmIGFueSBgd2ViaG9va0ZpbHRlcnNgIHdlcmUgcHJvdmlkZWQsIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgcmVhZG9ubHkgd2ViaG9vaz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRyaWdnZXIgYSBiYXRjaCBidWlsZCBmcm9tIGEgd2ViaG9vayBpbnN0ZWFkIG9mIGEgc3RhbmRhcmQgb25lLlxuICAgKlxuICAgKiBFbmFibGluZyB0aGlzIHdpbGwgZW5hYmxlIGJhdGNoIGJ1aWxkcyBvbiB0aGUgQ29kZUJ1aWxkIHByb2plY3QuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSB3ZWJob29rVHJpZ2dlcnNCYXRjaEJ1aWxkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBsaXN0IG9mIHdlYmhvb2sgZmlsdGVycyB0aGF0IGNhbiBjb25zdHJhaW50IHdoYXQgZXZlbnRzIGluIHRoZSByZXBvc2l0b3J5IHdpbGwgdHJpZ2dlciBhIGJ1aWxkLlxuICAgKiBBIGJ1aWxkIGlzIHRyaWdnZXJlZCBpZiBhbnkgb2YgdGhlIHByb3ZpZGVkIGZpbHRlciBncm91cHMgbWF0Y2guXG4gICAqIE9ubHkgdmFsaWQgaWYgYHdlYmhvb2tgIHdhcyBub3QgcHJvdmlkZWQgYXMgZmFsc2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IGV2ZXJ5IHB1c2ggYW5kIGV2ZXJ5IFB1bGwgUmVxdWVzdCAoY3JlYXRlIG9yIHVwZGF0ZSkgdHJpZ2dlcnMgYSBidWlsZFxuICAgKi9cbiAgcmVhZG9ubHkgd2ViaG9va0ZpbHRlcnM/OiBGaWx0ZXJHcm91cFtdO1xuXG4gIC8qKlxuICAgKiBUaGUgVVJMIHRoYXQgdGhlIGJ1aWxkIHdpbGwgcmVwb3J0IGJhY2sgdG8gdGhlIHNvdXJjZSBwcm92aWRlci5cbiAgICogQ2FuIHVzZSBidWlsdC1pbiBDb2RlQnVpbGQgdmFyaWFibGVzLCBsaWtlICRBV1NfUkVHSU9OLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlYnVpbGQvbGF0ZXN0L3VzZXJndWlkZS9jcmVhdGUtcHJvamVjdC1jbGkuaHRtbCNjbGkuc291cmNlLmJ1aWxkc3RhdHVzY29uZmlnLnRhcmdldHVybFxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlYnVpbGQvbGF0ZXN0L3VzZXJndWlkZS9idWlsZC1lbnYtcmVmLWVudi12YXJzLmh0bWxcbiAgICpcbiAgICogQGV4YW1wbGUgXCIkQ09ERUJVSUxEX1BVQkxJQ19CVUlMRF9VUkxcIlxuICAgKiBAZGVmYXVsdCAtIGxpbmsgdG8gdGhlIEFXUyBDb25zb2xlIGZvciBDb2RlQnVpbGQgdG8gYSBwYXJ0aWN1bGFyIGJ1aWxkIGV4ZWN1dGlvblxuICAgKi9cbiAgcmVhZG9ubHkgYnVpbGRTdGF0dXNVcmw/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBjb21tb24gc3VwZXJjbGFzcyBvZiBhbGwgdGhpcmQtcGFydHkgYnVpbGQgc291cmNlcyB0aGF0IGFyZSBiYWNrZWQgYnkgR2l0LlxuICovXG5hYnN0cmFjdCBjbGFzcyBUaGlyZFBhcnR5R2l0U291cmNlIGV4dGVuZHMgR2l0U291cmNlIHtcbiAgcHVibGljIHJlYWRvbmx5IGJhZGdlU3VwcG9ydGVkOiBib29sZWFuID0gdHJ1ZTtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHdlYmhvb2tGaWx0ZXJzOiBGaWx0ZXJHcm91cFtdO1xuICBwcml2YXRlIHJlYWRvbmx5IHJlcG9ydEJ1aWxkU3RhdHVzOiBib29sZWFuO1xuICBwcml2YXRlIHJlYWRvbmx5IHdlYmhvb2s/OiBib29sZWFuO1xuICBwcml2YXRlIHJlYWRvbmx5IHdlYmhvb2tUcmlnZ2Vyc0JhdGNoQnVpbGQ/OiBib29sZWFuO1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgYnVpbGRTdGF0dXNVcmw/OiBzdHJpbmc7XG5cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKHByb3BzOiBUaGlyZFBhcnR5R2l0U291cmNlUHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLndlYmhvb2sgPSBwcm9wcy53ZWJob29rO1xuICAgIHRoaXMucmVwb3J0QnVpbGRTdGF0dXMgPSBwcm9wcy5yZXBvcnRCdWlsZFN0YXR1cyA/PyB0cnVlO1xuICAgIHRoaXMud2ViaG9va0ZpbHRlcnMgPSBwcm9wcy53ZWJob29rRmlsdGVycyB8fCBbXTtcbiAgICB0aGlzLndlYmhvb2tUcmlnZ2Vyc0JhdGNoQnVpbGQgPSBwcm9wcy53ZWJob29rVHJpZ2dlcnNCYXRjaEJ1aWxkO1xuICAgIHRoaXMuYnVpbGRTdGF0dXNVcmwgPSBwcm9wcy5idWlsZFN0YXR1c1VybDtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKF9zY29wZTogQ29uc3RydWN0LCBwcm9qZWN0OiBJUHJvamVjdCk6IFNvdXJjZUNvbmZpZyB7XG4gICAgY29uc3QgYW55RmlsdGVyR3JvdXBzUHJvdmlkZWQgPSB0aGlzLndlYmhvb2tGaWx0ZXJzLmxlbmd0aCA+IDA7XG4gICAgY29uc3Qgd2ViaG9vayA9IHRoaXMud2ViaG9vayA/PyAoYW55RmlsdGVyR3JvdXBzUHJvdmlkZWQgPyB0cnVlIDogdW5kZWZpbmVkKTtcblxuICAgIGlmICghd2ViaG9vayAmJiBhbnlGaWx0ZXJHcm91cHNQcm92aWRlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgd2ViaG9va0ZpbHRlcnNgIGNhbm5vdCBiZSB1c2VkIHdoZW4gYHdlYmhvb2tgIGlzIGBmYWxzZWAnKTtcbiAgICB9XG5cbiAgICBpZiAoIXdlYmhvb2sgJiYgdGhpcy53ZWJob29rVHJpZ2dlcnNCYXRjaEJ1aWxkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2B3ZWJob29rVHJpZ2dlcnNCYXRjaEJ1aWxkYCBjYW5ub3QgYmUgdXNlZCB3aGVuIGB3ZWJob29rYCBpcyBgZmFsc2VgJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3VwZXJDb25maWcgPSBzdXBlci5iaW5kKF9zY29wZSwgcHJvamVjdCk7XG5cbiAgICBpZiAodGhpcy53ZWJob29rVHJpZ2dlcnNCYXRjaEJ1aWxkKSB7XG4gICAgICBwcm9qZWN0LmVuYWJsZUJhdGNoQnVpbGRzKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNvdXJjZVByb3BlcnR5OiB7XG4gICAgICAgIC4uLnN1cGVyQ29uZmlnLnNvdXJjZVByb3BlcnR5LFxuICAgICAgICByZXBvcnRCdWlsZFN0YXR1czogdGhpcy5yZXBvcnRCdWlsZFN0YXR1cyxcbiAgICAgIH0sXG4gICAgICBzb3VyY2VWZXJzaW9uOiBzdXBlckNvbmZpZy5zb3VyY2VWZXJzaW9uLFxuICAgICAgYnVpbGRUcmlnZ2Vyczogd2ViaG9vayA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDoge1xuICAgICAgICB3ZWJob29rLFxuICAgICAgICBidWlsZFR5cGU6IHRoaXMud2ViaG9va1RyaWdnZXJzQmF0Y2hCdWlsZCA/ICdCVUlMRF9CQVRDSCcgOiB1bmRlZmluZWQsXG4gICAgICAgIGZpbHRlckdyb3VwczogYW55RmlsdGVyR3JvdXBzUHJvdmlkZWQgPyB0aGlzLndlYmhvb2tGaWx0ZXJzLm1hcChmZyA9PiBmZy5fdG9Kc29uKCkpIDogdW5kZWZpbmVkLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgZm9yIGBDb2RlQ29tbWl0U291cmNlYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb2RlQ29tbWl0U291cmNlUHJvcHMgZXh0ZW5kcyBHaXRTb3VyY2VQcm9wcyB7XG4gIHJlYWRvbmx5IHJlcG9zaXRvcnk6IGNvZGVjb21taXQuSVJlcG9zaXRvcnk7XG59XG5cbi8qKlxuICogQ29kZUNvbW1pdCBTb3VyY2UgZGVmaW5pdGlvbiBmb3IgYSBDb2RlQnVpbGQgcHJvamVjdC5cbiAqL1xuY2xhc3MgQ29kZUNvbW1pdFNvdXJjZSBleHRlbmRzIEdpdFNvdXJjZSB7XG4gIHB1YmxpYyByZWFkb25seSBiYWRnZVN1cHBvcnRlZCA9IHRydWU7XG4gIHB1YmxpYyByZWFkb25seSB0eXBlID0gQ09ERUNPTU1JVF9TT1VSQ0VfVFlQRTtcbiAgcHJpdmF0ZSByZWFkb25seSByZXBvOiBjb2RlY29tbWl0LklSZXBvc2l0b3J5O1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBDb2RlQ29tbWl0U291cmNlUHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5yZXBvID0gcHJvcHMucmVwb3NpdG9yeTtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKF9zY29wZTogQ29uc3RydWN0LCBwcm9qZWN0OiBJUHJvamVjdCk6IFNvdXJjZUNvbmZpZyB7XG4gICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVidWlsZC9sYXRlc3QvdXNlcmd1aWRlL3NldHRpbmctdXAuaHRtbFxuICAgIHByb2plY3QuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnY29kZWNvbW1pdDpHaXRQdWxsJ10sXG4gICAgICByZXNvdXJjZXM6IFt0aGlzLnJlcG8ucmVwb3NpdG9yeUFybl0sXG4gICAgfSkpO1xuXG4gICAgY29uc3Qgc3VwZXJDb25maWcgPSBzdXBlci5iaW5kKF9zY29wZSwgcHJvamVjdCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNvdXJjZVByb3BlcnR5OiB7XG4gICAgICAgIC4uLnN1cGVyQ29uZmlnLnNvdXJjZVByb3BlcnR5LFxuICAgICAgICBsb2NhdGlvbjogdGhpcy5yZXBvLnJlcG9zaXRvcnlDbG9uZVVybEh0dHAsXG4gICAgICB9LFxuICAgICAgc291cmNlVmVyc2lvbjogc3VwZXJDb25maWcuc291cmNlVmVyc2lvbixcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgZm9yIGBTM1NvdXJjZWAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUzNTb3VyY2VQcm9wcyBleHRlbmRzIFNvdXJjZVByb3BzIHtcbiAgcmVhZG9ubHkgYnVja2V0OiBzMy5JQnVja2V0O1xuICByZWFkb25seSBwYXRoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqICBUaGUgdmVyc2lvbiBJRCBvZiB0aGUgb2JqZWN0IHRoYXQgcmVwcmVzZW50cyB0aGUgYnVpbGQgaW5wdXQgWklQIGZpbGUgdG8gdXNlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBsYXRlc3RcbiAgICovXG4gIHJlYWRvbmx5IHZlcnNpb24/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogUzMgYnVja2V0IGRlZmluaXRpb24gZm9yIGEgQ29kZUJ1aWxkIHByb2plY3QuXG4gKi9cbmNsYXNzIFMzU291cmNlIGV4dGVuZHMgU291cmNlIHtcbiAgcHVibGljIHJlYWRvbmx5IHR5cGUgPSBTM19TT1VSQ0VfVFlQRTtcbiAgcHJpdmF0ZSByZWFkb25seSBidWNrZXQ6IHMzLklCdWNrZXQ7XG4gIHByaXZhdGUgcmVhZG9ubHkgcGF0aDogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IHZlcnNpb24/OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IFMzU291cmNlUHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5idWNrZXQgPSBwcm9wcy5idWNrZXQ7XG4gICAgdGhpcy5wYXRoID0gcHJvcHMucGF0aDtcbiAgICB0aGlzLnZlcnNpb24gPSBwcm9wcy52ZXJzaW9uO1xuICB9XG5cbiAgcHVibGljIGJpbmQoX3Njb3BlOiBDb25zdHJ1Y3QsIHByb2plY3Q6IElQcm9qZWN0KTogU291cmNlQ29uZmlnIHtcbiAgICB0aGlzLmJ1Y2tldC5ncmFudFJlYWQocHJvamVjdCwgdGhpcy5wYXRoKTtcblxuICAgIGNvbnN0IHN1cGVyQ29uZmlnID0gc3VwZXIuYmluZChfc2NvcGUsIHByb2plY3QpO1xuICAgIHJldHVybiB7XG4gICAgICBzb3VyY2VQcm9wZXJ0eToge1xuICAgICAgICAuLi5zdXBlckNvbmZpZy5zb3VyY2VQcm9wZXJ0eSxcbiAgICAgICAgbG9jYXRpb246IGAke3RoaXMuYnVja2V0LmJ1Y2tldE5hbWV9LyR7dGhpcy5wYXRofWAsXG4gICAgICB9LFxuICAgICAgc291cmNlVmVyc2lvbjogdGhpcy52ZXJzaW9uLFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBDb21tb24gcHJvcGVydGllcyBiZXR3ZWVuIGBHaXRIdWJTb3VyY2VgIGFuZCBgR2l0SHViRW50ZXJwcmlzZVNvdXJjZWAuXG4gKi9cbmludGVyZmFjZSBDb21tb25HaXRodWJTb3VyY2VQcm9wcyBleHRlbmRzIFRoaXJkUGFydHlHaXRTb3VyY2VQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGlzIHBhcmFtZXRlciBpcyB1c2VkIGZvciB0aGUgYGNvbnRleHRgIHBhcmFtZXRlciBpbiB0aGUgR2l0SHViIGNvbW1pdCBzdGF0dXMuXG4gICAqIENhbiB1c2UgYnVpbHQtaW4gQ29kZUJ1aWxkIHZhcmlhYmxlcywgbGlrZSAkQVdTX1JFR0lPTi5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWJ1aWxkL2xhdGVzdC91c2VyZ3VpZGUvY3JlYXRlLXByb2plY3QtY2xpLmh0bWwjY2xpLnNvdXJjZS5idWlsZHN0YXR1c2NvbmZpZy5jb250ZXh0XG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVidWlsZC9sYXRlc3QvdXNlcmd1aWRlL2J1aWxkLWVudi1yZWYtZW52LXZhcnMuaHRtbFxuICAgKlxuICAgKiBAZXhhbXBsZSBcIk15IGJ1aWxkICMkQ09ERUJVSUxEX0JVSUxEX05VTUJFUlwiXG4gICAqIEBkZWZhdWx0IFwiQVdTIENvZGVCdWlsZCAkQVdTX1JFR0lPTiAoJFBST0pFQ1RfTkFNRSlcIlxuICAgKi9cbiAgcmVhZG9ubHkgYnVpbGRTdGF0dXNDb250ZXh0Pzogc3RyaW5nXG59XG5cbmFic3RyYWN0IGNsYXNzIENvbW1vbkdpdGh1YlNvdXJjZSBleHRlbmRzIFRoaXJkUGFydHlHaXRTb3VyY2Uge1xuICBwcml2YXRlIHJlYWRvbmx5IGJ1aWxkU3RhdHVzQ29udGV4dD86IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogQ29tbW9uR2l0aHViU291cmNlUHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5idWlsZFN0YXR1c0NvbnRleHQgPSBwcm9wcy5idWlsZFN0YXR1c0NvbnRleHQ7XG4gIH1cblxuICBwdWJsaWMgYmluZChzY29wZTogQ29uc3RydWN0LCBwcm9qZWN0OiBJUHJvamVjdCk6IFNvdXJjZUNvbmZpZyB7XG4gICAgY29uc3Qgc3VwZXJDb25maWcgPSBzdXBlci5iaW5kKHNjb3BlLCBwcm9qZWN0KTtcbiAgICByZXR1cm4ge1xuICAgICAgc291cmNlUHJvcGVydHk6IHtcbiAgICAgICAgLi4uc3VwZXJDb25maWcuc291cmNlUHJvcGVydHksXG4gICAgICAgIGJ1aWxkU3RhdHVzQ29uZmlnOiB0aGlzLmJ1aWxkU3RhdHVzQ29udGV4dCAhPT0gdW5kZWZpbmVkIHx8IHRoaXMuYnVpbGRTdGF0dXNVcmwgIT09IHVuZGVmaW5lZFxuICAgICAgICAgID8ge1xuICAgICAgICAgICAgY29udGV4dDogdGhpcy5idWlsZFN0YXR1c0NvbnRleHQsXG4gICAgICAgICAgICB0YXJnZXRVcmw6IHRoaXMuYnVpbGRTdGF0dXNVcmwsXG4gICAgICAgICAgfVxuICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgfSxcbiAgICAgIHNvdXJjZVZlcnNpb246IHN1cGVyQ29uZmlnLnNvdXJjZVZlcnNpb24sXG4gICAgICBidWlsZFRyaWdnZXJzOiBzdXBlckNvbmZpZy5idWlsZFRyaWdnZXJzLFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBmb3IgYEdpdEh1YlNvdXJjZWAgYW5kIGBHaXRIdWJFbnRlcnByaXNlU291cmNlYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBHaXRIdWJTb3VyY2VQcm9wcyBleHRlbmRzIENvbW1vbkdpdGh1YlNvdXJjZVByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBHaXRIdWIgYWNjb3VudC91c2VyIHRoYXQgb3ducyB0aGUgcmVwby5cbiAgICpcbiAgICogQGV4YW1wbGUgJ2F3c2xhYnMnXG4gICAqL1xuICByZWFkb25seSBvd25lcjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgcmVwbyAod2l0aG91dCB0aGUgdXNlcm5hbWUpLlxuICAgKlxuICAgKiBAZXhhbXBsZSAnYXdzLWNkaydcbiAgICovXG4gIHJlYWRvbmx5IHJlcG86IHN0cmluZztcbn1cblxuLyoqXG4gKiBHaXRIdWIgU291cmNlIGRlZmluaXRpb24gZm9yIGEgQ29kZUJ1aWxkIHByb2plY3QuXG4gKi9cbmNsYXNzIEdpdEh1YlNvdXJjZSBleHRlbmRzIENvbW1vbkdpdGh1YlNvdXJjZSB7XG4gIHB1YmxpYyByZWFkb25seSB0eXBlID0gR0lUSFVCX1NPVVJDRV9UWVBFO1xuICBwcml2YXRlIHJlYWRvbmx5IGh0dHBzQ2xvbmVVcmw6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogR2l0SHViU291cmNlUHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5odHRwc0Nsb25lVXJsID0gYGh0dHBzOi8vZ2l0aHViLmNvbS8ke3Byb3BzLm93bmVyfS8ke3Byb3BzLnJlcG99LmdpdGA7XG4gIH1cblxuICBwdWJsaWMgYmluZChfc2NvcGU6IENvbnN0cnVjdCwgcHJvamVjdDogSVByb2plY3QpOiBTb3VyY2VDb25maWcge1xuICAgIGNvbnN0IHN1cGVyQ29uZmlnID0gc3VwZXIuYmluZChfc2NvcGUsIHByb2plY3QpO1xuICAgIHJldHVybiB7XG4gICAgICBzb3VyY2VQcm9wZXJ0eToge1xuICAgICAgICAuLi5zdXBlckNvbmZpZy5zb3VyY2VQcm9wZXJ0eSxcbiAgICAgICAgbG9jYXRpb246IHRoaXMuaHR0cHNDbG9uZVVybCxcbiAgICAgIH0sXG4gICAgICBzb3VyY2VWZXJzaW9uOiBzdXBlckNvbmZpZy5zb3VyY2VWZXJzaW9uLFxuICAgICAgYnVpbGRUcmlnZ2Vyczogc3VwZXJDb25maWcuYnVpbGRUcmlnZ2VycyxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgZm9yIGBHaXRIdWJFbnRlcnByaXNlU291cmNlYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBHaXRIdWJFbnRlcnByaXNlU291cmNlUHJvcHMgZXh0ZW5kcyBDb21tb25HaXRodWJTb3VyY2VQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgSFRUUFMgVVJMIG9mIHRoZSByZXBvc2l0b3J5IGluIHlvdXIgR2l0SHViIEVudGVycHJpc2UgaW5zdGFsbGF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgaHR0cHNDbG9uZVVybDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGlnbm9yZSBTU0wgZXJyb3JzIHdoZW4gY29ubmVjdGluZyB0byB0aGUgcmVwb3NpdG9yeS5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGlnbm9yZVNzbEVycm9ycz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogR2l0SHViIEVudGVycHJpc2UgU291cmNlIGRlZmluaXRpb24gZm9yIGEgQ29kZUJ1aWxkIHByb2plY3QuXG4gKi9cbmNsYXNzIEdpdEh1YkVudGVycHJpc2VTb3VyY2UgZXh0ZW5kcyBDb21tb25HaXRodWJTb3VyY2Uge1xuICBwdWJsaWMgcmVhZG9ubHkgdHlwZSA9IEdJVEhVQl9FTlRFUlBSSVNFX1NPVVJDRV9UWVBFO1xuICBwcml2YXRlIHJlYWRvbmx5IGh0dHBzQ2xvbmVVcmw6IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBpZ25vcmVTc2xFcnJvcnM/OiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBHaXRIdWJFbnRlcnByaXNlU291cmNlUHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5odHRwc0Nsb25lVXJsID0gcHJvcHMuaHR0cHNDbG9uZVVybDtcbiAgICB0aGlzLmlnbm9yZVNzbEVycm9ycyA9IHByb3BzLmlnbm9yZVNzbEVycm9ycztcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKF9zY29wZTogQ29uc3RydWN0LCBfcHJvamVjdDogSVByb2plY3QpOiBTb3VyY2VDb25maWcge1xuICAgIGlmICh0aGlzLmhhc0NvbW1pdE1lc3NhZ2VGaWx0ZXJBbmRQckV2ZW50KCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ09NTUlUX01FU1NBR0UgZmlsdGVycyBjYW5ub3QgYmUgdXNlZCB3aXRoIEdpdEh1YiBFbnRlcnByaXNlIFNlcnZlciBwdWxsIHJlcXVlc3QgZXZlbnRzJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaGFzRmlsZVBhdGhGaWx0ZXJBbmRQckV2ZW50KCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRklMRV9QQVRIIGZpbHRlcnMgY2Fubm90IGJlIHVzZWQgd2l0aCBHaXRIdWIgRW50ZXJwcmlzZSBTZXJ2ZXIgcHVsbCByZXF1ZXN0IGV2ZW50cycpO1xuICAgIH1cblxuICAgIGNvbnN0IHN1cGVyQ29uZmlnID0gc3VwZXIuYmluZChfc2NvcGUsIF9wcm9qZWN0KTtcbiAgICByZXR1cm4ge1xuICAgICAgc291cmNlUHJvcGVydHk6IHtcbiAgICAgICAgLi4uc3VwZXJDb25maWcuc291cmNlUHJvcGVydHksXG4gICAgICAgIGxvY2F0aW9uOiB0aGlzLmh0dHBzQ2xvbmVVcmwsXG4gICAgICAgIGluc2VjdXJlU3NsOiB0aGlzLmlnbm9yZVNzbEVycm9ycyxcbiAgICAgIH0sXG4gICAgICBzb3VyY2VWZXJzaW9uOiBzdXBlckNvbmZpZy5zb3VyY2VWZXJzaW9uLFxuICAgICAgYnVpbGRUcmlnZ2Vyczogc3VwZXJDb25maWcuYnVpbGRUcmlnZ2VycyxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBoYXNDb21taXRNZXNzYWdlRmlsdGVyQW5kUHJFdmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy53ZWJob29rRmlsdGVycy5zb21lKGZnID0+IChcbiAgICAgIGZnLl9maWx0ZXJzLnNvbWUoZnAgPT4gZnAudHlwZSA9PT0gV2ViaG9va0ZpbHRlclR5cGVzLkNPTU1JVF9NRVNTQUdFKSAmJlxuICAgICAgdGhpcy5oYXNQckV2ZW50KGZnLl9hY3Rpb25zKSkpO1xuICB9XG4gIHByaXZhdGUgaGFzRmlsZVBhdGhGaWx0ZXJBbmRQckV2ZW50KCkge1xuICAgIHJldHVybiB0aGlzLndlYmhvb2tGaWx0ZXJzLnNvbWUoZmcgPT4gKFxuICAgICAgZmcuX2ZpbHRlcnMuc29tZShmcCA9PiBmcC50eXBlID09PSBXZWJob29rRmlsdGVyVHlwZXMuRklMRV9QQVRIKSAmJlxuICAgICAgdGhpcy5oYXNQckV2ZW50KGZnLl9hY3Rpb25zKSkpO1xuICB9XG4gIHByaXZhdGUgaGFzUHJFdmVudChhY3Rpb25zOiBFdmVudEFjdGlvbltdKSB7XG4gICAgcmV0dXJuIGFjdGlvbnMuaW5jbHVkZXMoXG4gICAgICBFdmVudEFjdGlvbi5QVUxMX1JFUVVFU1RfQ1JFQVRFRCB8fFxuICAgICAgRXZlbnRBY3Rpb24uUFVMTF9SRVFVRVNUX01FUkdFRCB8fFxuICAgICAgRXZlbnRBY3Rpb24uUFVMTF9SRVFVRVNUX1JFT1BFTkVEIHx8XG4gICAgICBFdmVudEFjdGlvbi5QVUxMX1JFUVVFU1RfVVBEQVRFRCk7XG4gIH1cbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBmb3IgYEJpdEJ1Y2tldFNvdXJjZWAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQml0QnVja2V0U291cmNlUHJvcHMgZXh0ZW5kcyBUaGlyZFBhcnR5R2l0U291cmNlUHJvcHMge1xuICAvKipcbiAgICogVGhlIEJpdEJ1Y2tldCBhY2NvdW50L3VzZXIgdGhhdCBvd25zIHRoZSByZXBvLlxuICAgKlxuICAgKiBAZXhhbXBsZSAnYXdzbGFicydcbiAgICovXG4gIHJlYWRvbmx5IG93bmVyOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSByZXBvICh3aXRob3V0IHRoZSB1c2VybmFtZSkuXG4gICAqXG4gICAqIEBleGFtcGxlICdhd3MtY2RrJ1xuICAgKi9cbiAgcmVhZG9ubHkgcmVwbzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGlzIHBhcmFtZXRlciBpcyB1c2VkIGZvciB0aGUgYG5hbWVgIHBhcmFtZXRlciBpbiB0aGUgQml0YnVja2V0IGNvbW1pdCBzdGF0dXMuXG4gICAqIENhbiB1c2UgYnVpbHQtaW4gQ29kZUJ1aWxkIHZhcmlhYmxlcywgbGlrZSAkQVdTX1JFR0lPTi5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWJ1aWxkL2xhdGVzdC91c2VyZ3VpZGUvY3JlYXRlLXByb2plY3QtY2xpLmh0bWwjY2xpLnNvdXJjZS5idWlsZHN0YXR1c2NvbmZpZy5jb250ZXh0XG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVidWlsZC9sYXRlc3QvdXNlcmd1aWRlL2J1aWxkLWVudi1yZWYtZW52LXZhcnMuaHRtbFxuICAgKlxuICAgKiBAZXhhbXBsZSBcIk15IGJ1aWxkICMkQ09ERUJVSUxEX0JVSUxEX05VTUJFUlwiXG4gICAqIEBkZWZhdWx0IFwiQVdTIENvZGVCdWlsZCAkQVdTX1JFR0lPTiAoJFBST0pFQ1RfTkFNRSlcIlxuICAgKi9cbiAgcmVhZG9ubHkgYnVpbGRTdGF0dXNOYW1lPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEJpdEJ1Y2tldCBTb3VyY2UgZGVmaW5pdGlvbiBmb3IgYSBDb2RlQnVpbGQgcHJvamVjdC5cbiAqL1xuY2xhc3MgQml0QnVja2V0U291cmNlIGV4dGVuZHMgVGhpcmRQYXJ0eUdpdFNvdXJjZSB7XG4gIHB1YmxpYyByZWFkb25seSB0eXBlID0gQklUQlVDS0VUX1NPVVJDRV9UWVBFO1xuICBwcml2YXRlIHJlYWRvbmx5IGh0dHBzQ2xvbmVVcmw6IGFueTtcbiAgcHJpdmF0ZSByZWFkb25seSBidWlsZFN0YXR1c05hbWU/OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IEJpdEJ1Y2tldFNvdXJjZVByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuaHR0cHNDbG9uZVVybCA9IGBodHRwczovL2JpdGJ1Y2tldC5vcmcvJHtwcm9wcy5vd25lcn0vJHtwcm9wcy5yZXBvfS5naXRgO1xuICAgIHRoaXMuYnVpbGRTdGF0dXNOYW1lID0gcHJvcHMuYnVpbGRTdGF0dXNOYW1lO1xuICB9XG5cbiAgcHVibGljIGJpbmQoX3Njb3BlOiBDb25zdHJ1Y3QsIF9wcm9qZWN0OiBJUHJvamVjdCk6IFNvdXJjZUNvbmZpZyB7XG4gICAgLy8gQml0QnVja2V0IHNvdXJjZXMgZG9uJ3Qgc3VwcG9ydCB0aGUgUFVMTF9SRVFVRVNUX1JFT1BFTkVEIGV2ZW50IGFjdGlvblxuICAgIGlmICh0aGlzLmFueVdlYmhvb2tGaWx0ZXJDb250YWluc1ByUmVvcGVuZWRFdmVudEFjdGlvbigpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JpdEJ1Y2tldCBzb3VyY2VzIGRvIG5vdCBzdXBwb3J0IHRoZSBQVUxMX1JFUVVFU1RfUkVPUEVORUQgd2ViaG9vayBldmVudCBhY3Rpb24nKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdXBlckNvbmZpZyA9IHN1cGVyLmJpbmQoX3Njb3BlLCBfcHJvamVjdCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNvdXJjZVByb3BlcnR5OiB7XG4gICAgICAgIC4uLnN1cGVyQ29uZmlnLnNvdXJjZVByb3BlcnR5LFxuICAgICAgICBsb2NhdGlvbjogdGhpcy5odHRwc0Nsb25lVXJsLFxuICAgICAgICBidWlsZFN0YXR1c0NvbmZpZzogdGhpcy5idWlsZFN0YXR1c05hbWUgIT09IHVuZGVmaW5lZCB8fCB0aGlzLmJ1aWxkU3RhdHVzVXJsICE9PSB1bmRlZmluZWRcbiAgICAgICAgICA/IHtcbiAgICAgICAgICAgIGNvbnRleHQ6IHRoaXMuYnVpbGRTdGF0dXNOYW1lLFxuICAgICAgICAgICAgdGFyZ2V0VXJsOiB0aGlzLmJ1aWxkU3RhdHVzVXJsLFxuICAgICAgICAgIH1cbiAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgICBzb3VyY2VWZXJzaW9uOiBzdXBlckNvbmZpZy5zb3VyY2VWZXJzaW9uLFxuICAgICAgYnVpbGRUcmlnZ2Vyczogc3VwZXJDb25maWcuYnVpbGRUcmlnZ2VycyxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBhbnlXZWJob29rRmlsdGVyQ29udGFpbnNQclJlb3BlbmVkRXZlbnRBY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMud2ViaG9va0ZpbHRlcnMuZmluZEluZGV4KGZnID0+IHtcbiAgICAgIHJldHVybiBmZy5fYWN0aW9ucy5maW5kSW5kZXgoYSA9PiBhID09PSBFdmVudEFjdGlvbi5QVUxMX1JFUVVFU1RfUkVPUEVORUQpICE9PSAtMTtcbiAgICB9KSAhPT0gLTE7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0MkFycmF5PFQ+KHNldDogU2V0PFQ+KTogVFtdIHtcbiAgY29uc3QgcmV0OiBUW10gPSBbXTtcbiAgc2V0LmZvckVhY2goZWwgPT4gcmV0LnB1c2goZWwpKTtcbiAgcmV0dXJuIHJldDtcbn1cbiJdfQ==