"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryNotificationEvents = exports.RepositoryEventTrigger = exports.Repository = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const notifications = require("@aws-cdk/aws-codestarnotifications");
const events = require("@aws-cdk/aws-events");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const codecommit_generated_1 = require("./codecommit.generated");
/**
 * Represents a reference to a CodeCommit Repository.
 *
 * If you want to create a new Repository managed alongside your CDK code,
 * use the `Repository` class.
 *
 * If you want to reference an already existing Repository,
 * use the `Repository.import` method.
 */
class RepositoryBase extends core_1.Resource {
    /**
     * Defines a CloudWatch event rule which triggers for repository events. Use
     * `rule.addEventPattern(pattern)` to specify a filter.
     */
    onEvent(id, options = {}) {
        const rule = new events.Rule(this, id, options);
        rule.addEventPattern({
            source: ['aws.codecommit'],
            resources: [this.repositoryArn],
        });
        rule.addTarget(options.target);
        return rule;
    }
    /**
     * Defines a CloudWatch event rule which triggers when a "CodeCommit
     * Repository State Change" event occurs.
     */
    onStateChange(id, options = {}) {
        const rule = this.onEvent(id, options);
        rule.addEventPattern({
            detailType: ['CodeCommit Repository State Change'],
        });
        return rule;
    }
    /**
     * Defines a CloudWatch event rule which triggers when a reference is
     * created (i.e. a new branch/tag is created) to the repository.
     */
    onReferenceCreated(id, options = {}) {
        const rule = this.onStateChange(id, options);
        rule.addEventPattern({ detail: { event: ['referenceCreated'] } });
        return rule;
    }
    /**
     * Defines a CloudWatch event rule which triggers when a reference is
     * updated (i.e. a commit is pushed to an existing or new branch) from the repository.
     */
    onReferenceUpdated(id, options = {}) {
        const rule = this.onStateChange(id, options);
        rule.addEventPattern({ detail: { event: ['referenceCreated', 'referenceUpdated'] } });
        return rule;
    }
    /**
     * Defines a CloudWatch event rule which triggers when a reference is
     * delete (i.e. a branch/tag is deleted) from the repository.
     */
    onReferenceDeleted(id, options = {}) {
        const rule = this.onStateChange(id, options);
        rule.addEventPattern({ detail: { event: ['referenceDeleted'] } });
        return rule;
    }
    /**
     * Defines a CloudWatch event rule which triggers when a pull request state is changed.
     */
    onPullRequestStateChange(id, options = {}) {
        const rule = this.onEvent(id, options);
        rule.addEventPattern({ detailType: ['CodeCommit Pull Request State Change'] });
        return rule;
    }
    /**
     * Defines a CloudWatch event rule which triggers when a comment is made on a pull request.
     */
    onCommentOnPullRequest(id, options = {}) {
        const rule = this.onEvent(id, options);
        rule.addEventPattern({ detailType: ['CodeCommit Comment on Pull Request'] });
        return rule;
    }
    /**
     * Defines a CloudWatch event rule which triggers when a comment is made on a commit.
     */
    onCommentOnCommit(id, options = {}) {
        const rule = this.onEvent(id, options);
        rule.addEventPattern({ detailType: ['CodeCommit Comment on Commit'] });
        return rule;
    }
    /**
     * Defines a CloudWatch event rule which triggers when a commit is pushed to a branch.
     */
    onCommit(id, options = {}) {
        const rule = this.onReferenceUpdated(id, options);
        if (options.branches) {
            rule.addEventPattern({ detail: { referenceName: options.branches } });
        }
        return rule;
    }
    grant(grantee, ...actions) {
        return iam.Grant.addToPrincipal({
            grantee,
            actions,
            resourceArns: [this.repositoryArn],
        });
    }
    grantPull(grantee) {
        return this.grant(grantee, 'codecommit:GitPull');
    }
    grantPullPush(grantee) {
        this.grantPull(grantee);
        return this.grant(grantee, 'codecommit:GitPush');
    }
    grantRead(grantee) {
        this.grantPull(grantee);
        return this.grant(grantee, 'codecommit:EvaluatePullRequestApprovalRules', 'codecommit:Get*', 'codecommit:Describe*');
    }
    notifyOn(id, target, options) {
        return new notifications.NotificationRule(this, id, {
            ...options,
            source: this,
            targets: [target],
        });
    }
    notifyOnPullRequestComment(id, target, options) {
        return this.notifyOn(id, target, {
            ...options,
            events: [RepositoryNotificationEvents.PULL_REQUEST_COMMENT],
        });
    }
    notifyOnApprovalStatusChanged(id, target, options) {
        return this.notifyOn(id, target, {
            ...options,
            events: [RepositoryNotificationEvents.APPROVAL_STATUS_CHANGED],
        });
    }
    notifyOnApprovalRuleOverridden(id, target, options) {
        return this.notifyOn(id, target, {
            ...options,
            events: [RepositoryNotificationEvents.APPROVAL_RULE_OVERRIDDEN],
        });
    }
    notifyOnPullRequestCreated(id, target, options) {
        return this.notifyOn(id, target, {
            ...options,
            events: [RepositoryNotificationEvents.PULL_REQUEST_CREATED],
        });
    }
    notifiyOnPullRequestMerged(id, target, options) {
        return this.notifyOnPullRequestMerged(id, target, options);
    }
    notifyOnPullRequestMerged(id, target, options) {
        return this.notifyOn(id, target, {
            ...options,
            events: [RepositoryNotificationEvents.PULL_REQUEST_MERGED],
        });
    }
    notifyOnBranchOrTagCreated(id, target, options) {
        return this.notifyOn(id, target, {
            ...options,
            events: [RepositoryNotificationEvents.BRANCH_OR_TAG_CREATED],
        });
    }
    notifyOnBranchOrTagDeleted(id, target, options) {
        return this.notifyOn(id, target, {
            ...options,
            events: [RepositoryNotificationEvents.BRANCH_OR_TAG_DELETED],
        });
    }
    bindAsNotificationRuleSource(_scope) {
        return {
            sourceArn: this.repositoryArn,
        };
    }
}
/**
 * Provides a CodeCommit Repository.
 */
class Repository extends RepositoryBase {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.repositoryName,
        });
        this.triggers = new Array();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codecommit_RepositoryProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Repository);
            }
            throw error;
        }
        const repository = new codecommit_generated_1.CfnRepository(this, 'Resource', {
            repositoryName: props.repositoryName,
            repositoryDescription: props.description,
            triggers: core_1.Lazy.any({ produce: () => this.triggers }, { omitEmptyArray: true }),
            code: (props.code?.bind(this))?.code,
        });
        this.repositoryName = this.getResourceNameAttribute(repository.attrName);
        this.repositoryArn = this.getResourceArnAttribute(repository.attrArn, {
            service: 'codecommit',
            resource: this.physicalName,
        });
        this.repositoryCloneUrlHttp = repository.attrCloneUrlHttp;
        this.repositoryCloneUrlSsh = repository.attrCloneUrlSsh;
        this.repositoryCloneUrlGrc = makeCloneUrl(core_1.Stack.of(this), this.repositoryName, 'grc');
    }
    /**
     * Imports a codecommit repository.
     * @param repositoryArn (e.g. `arn:aws:codecommit:us-east-1:123456789012:MyDemoRepo`)
     */
    static fromRepositoryArn(scope, id, repositoryArn) {
        const stack = core_1.Stack.of(scope);
        const arn = stack.splitArn(repositoryArn, core_1.ArnFormat.NO_RESOURCE_NAME);
        const repositoryName = arn.resource;
        const region = arn.region;
        class Import extends RepositoryBase {
            constructor() {
                super(...arguments);
                this.repositoryArn = repositoryArn;
                this.repositoryName = repositoryName;
                this.repositoryCloneUrlHttp = makeCloneUrl(stack, repositoryName, 'https', region);
                this.repositoryCloneUrlSsh = makeCloneUrl(stack, repositoryName, 'ssh', region);
                this.repositoryCloneUrlGrc = makeCloneUrl(stack, repositoryName, 'grc', region);
            }
        }
        return new Import(scope, id, {
            account: arn.account,
            region,
        });
    }
    static fromRepositoryName(scope, id, repositoryName) {
        const stack = core_1.Stack.of(scope);
        class Import extends RepositoryBase {
            constructor() {
                super(...arguments);
                this.repositoryName = repositoryName;
                this.repositoryArn = core_1.Stack.of(scope).formatArn({
                    service: 'codecommit',
                    resource: repositoryName,
                });
                this.repositoryCloneUrlHttp = makeCloneUrl(stack, repositoryName, 'https');
                this.repositoryCloneUrlSsh = makeCloneUrl(stack, repositoryName, 'ssh');
                this.repositoryCloneUrlGrc = makeCloneUrl(stack, repositoryName, 'grc');
            }
        }
        return new Import(scope, id);
    }
    /**
     * Create a trigger to notify another service to run actions on repository events.
     * @param arn   Arn of the resource that repository events will notify
     * @param options Trigger options to run actions
     */
    notify(arn, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codecommit_RepositoryTriggerOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.notify);
            }
            throw error;
        }
        let evt = options && options.events;
        if (evt && evt.length > 1 && evt.indexOf(RepositoryEventTrigger.ALL) > -1) {
            evt = [RepositoryEventTrigger.ALL];
        }
        const customData = options && options.customData;
        const branches = options && options.branches;
        let name = options && options.name;
        if (!name) {
            name = this.node.path + '/' + arn;
        }
        if (this.triggers.find(prop => prop.name === name)) {
            throw new Error(`Unable to set repository trigger named ${name} because trigger names must be unique`);
        }
        this.triggers.push({
            destinationArn: arn,
            name,
            customData,
            branches,
            events: evt || [RepositoryEventTrigger.ALL],
        });
        return this;
    }
}
exports.Repository = Repository;
_a = JSII_RTTI_SYMBOL_1;
Repository[_a] = { fqn: "@aws-cdk/aws-codecommit.Repository", version: "0.0.0" };
/**
 * Repository events that will cause the trigger to run actions in another service.
 */
var RepositoryEventTrigger;
(function (RepositoryEventTrigger) {
    RepositoryEventTrigger["ALL"] = "all";
    RepositoryEventTrigger["UPDATE_REF"] = "updateReference";
    RepositoryEventTrigger["CREATE_REF"] = "createReference";
    RepositoryEventTrigger["DELETE_REF"] = "deleteReference";
})(RepositoryEventTrigger = exports.RepositoryEventTrigger || (exports.RepositoryEventTrigger = {}));
/**
 * Returns the clone URL for a protocol.
 */
function makeCloneUrl(stack, repositoryName, protocol, region) {
    switch (protocol) {
        case 'https':
        case 'ssh':
            return `${protocol}://git-codecommit.${region ?? stack.region}.${stack.urlSuffix}/v1/repos/${repositoryName}`;
        case 'grc':
            return `codecommit::${region ?? stack.region}://${repositoryName}`;
    }
}
/**
 * List of event types for AWS CodeCommit
 * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#events-ref-repositories
 */
var RepositoryNotificationEvents;
(function (RepositoryNotificationEvents) {
    /**
     * Trigger notication when comment made on commit.
     */
    RepositoryNotificationEvents["COMMIT_COMMENT"] = "codecommit-repository-comments-on-commits";
    /**
     * Trigger notification when comment made on pull request.
     */
    RepositoryNotificationEvents["PULL_REQUEST_COMMENT"] = "codecommit-repository-comments-on-pull-requests";
    /**
     * Trigger notification when approval status changed.
     */
    RepositoryNotificationEvents["APPROVAL_STATUS_CHANGED"] = "codecommit-repository-approvals-status-changed";
    /**
     * Trigger notifications when approval rule is overridden.
     */
    RepositoryNotificationEvents["APPROVAL_RULE_OVERRIDDEN"] = "codecommit-repository-approvals-rule-override";
    /**
     * Trigger notification when pull request created.
     */
    RepositoryNotificationEvents["PULL_REQUEST_CREATED"] = "codecommit-repository-pull-request-created";
    /**
     * Trigger notification when pull request source updated.
     */
    RepositoryNotificationEvents["PULL_REQUEST_SOURCE_UPDATED"] = "codecommit-repository-pull-request-source-updated";
    /**
     * Trigger notification when pull request status is changed.
     */
    RepositoryNotificationEvents["PULL_REQUEST_STATUS_CHANGED"] = "codecommit-repository-pull-request-status-changed";
    /**
     * Trigger notification when pull requset is merged.
     */
    RepositoryNotificationEvents["PULL_REQUEST_MERGED"] = "codecommit-repository-pull-request-merged";
    /**
     * Trigger notification when a branch or tag is created.
     */
    RepositoryNotificationEvents["BRANCH_OR_TAG_CREATED"] = "codecommit-repository-branches-and-tags-created";
    /**
     * Trigger notification when a branch or tag is deleted.
     */
    RepositoryNotificationEvents["BRANCH_OR_TAG_DELETED"] = "codecommit-repository-branches-and-tags-deleted";
    /**
     * Trigger notification when a branch or tag is updated.
     */
    RepositoryNotificationEvents["BRANCH_OR_TAG_UPDATED"] = "codecommit-repository-branches-and-tags-updated";
})(RepositoryNotificationEvents = exports.RepositoryNotificationEvents || (exports.RepositoryNotificationEvents = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwb3NpdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsb0VBQW9FO0FBQ3BFLDhDQUE4QztBQUM5Qyx3Q0FBd0M7QUFDeEMsd0NBQTRFO0FBRzVFLGlFQUF1RDtBQThOdkQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFlLGNBQWUsU0FBUSxlQUFRO0lBZTVDOzs7T0FHRztJQUNJLE9BQU8sQ0FBQyxFQUFVLEVBQUUsVUFBaUMsRUFBRTtRQUM1RCxNQUFNLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsZUFBZSxDQUFDO1lBQ25CLE1BQU0sRUFBRSxDQUFDLGdCQUFnQixDQUFDO1lBQzFCLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7U0FDaEMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVEOzs7T0FHRztJQUNJLGFBQWEsQ0FBQyxFQUFVLEVBQUUsVUFBaUMsRUFBRTtRQUNsRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsZUFBZSxDQUFDO1lBQ25CLFVBQVUsRUFBRSxDQUFDLG9DQUFvQyxDQUFDO1NBQ25ELENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRDs7O09BR0c7SUFDSSxrQkFBa0IsQ0FBQyxFQUFVLEVBQUUsVUFBaUMsRUFBRTtRQUN2RSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUs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QU0sTUFBTSxjQUFjLEVBQUUsQ0FBQztLQUN0RTtBQUNILENBQUM7QUFFRDs7O0dBR0c7QUFDSCxJQUFZLDRCQXVEWDtBQXZERCxXQUFZLDRCQUE0QjtJQUN0Qzs7T0FFRztJQUNILDRGQUE0RCxDQUFBO0lBRTVEOztPQUVHO0lBQ0gsd0dBQXdFLENBQUE7SUFFeEU7O09BRUc7SUFDSCwwR0FBMEUsQ0FBQTtJQUUxRTs7T0FFRztJQUNILDBHQUEwRSxDQUFBO0lBRTFFOztPQUVHO0lBQ0gsbUdBQW1FLENBQUE7SUFFbkU7O09BRUc7SUFDSCxpSEFBaUYsQ0FBQTtJQUVqRjs7T0FFRztJQUNILGlIQUFpRixDQUFBO0lBRWpGOztPQUVHO0lBQ0gsaUdBQWlFLENBQUE7SUFFakU7O09BRUc7SUFDSCx5R0FBeUUsQ0FBQTtJQUV6RTs7T0FFRztJQUNILHlHQUF5RSxDQUFBO0lBRXpFOztPQUVHO0lBQ0gseUdBQXlFLENBQUE7QUFDM0UsQ0FBQyxFQXZEVyw0QkFBNEIsR0FBNUIsb0NBQTRCLEtBQTVCLG9DQUE0QixRQXVEdkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBub3RpZmljYXRpb25zIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2Rlc3Rhcm5vdGlmaWNhdGlvbnMnO1xuaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1ldmVudHMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgQXJuRm9ybWF0LCBJUmVzb3VyY2UsIExhenksIFJlc291cmNlLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDb2RlIH0gZnJvbSAnLi9jb2RlJztcbmltcG9ydCB7IENmblJlcG9zaXRvcnkgfSBmcm9tICcuL2NvZGVjb21taXQuZ2VuZXJhdGVkJztcblxuLyoqXG4gKiBBZGRpdGlvbmFsIG9wdGlvbnMgdG8gcGFzcyB0byB0aGUgbm90aWZpY2F0aW9uIHJ1bGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVwb3NpdG9yeU5vdGlmeU9uT3B0aW9ucyBleHRlbmRzIG5vdGlmaWNhdGlvbnMuTm90aWZpY2F0aW9uUnVsZU9wdGlvbnMge1xuICAvKipcbiAgICogQSBsaXN0IG9mIGV2ZW50IHR5cGVzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIG5vdGlmaWNhdGlvbiBydWxlIGZvciBDb2RlQ29tbWl0IHJlcG9zaXRvcmllcy5cbiAgICogRm9yIGEgY29tcGxldGUgbGlzdCBvZiBldmVudCB0eXBlcyBhbmQgSURzLCBzZWUgTm90aWZpY2F0aW9uIGNvbmNlcHRzIGluIHRoZSBEZXZlbG9wZXIgVG9vbHMgQ29uc29sZSBVc2VyIEd1aWRlLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9kdGNvbnNvbGUvbGF0ZXN0L3VzZXJndWlkZS9jb25jZXB0cy5odG1sI2NvbmNlcHRzLWFwaVxuICAgKi9cbiAgcmVhZG9ubHkgZXZlbnRzOiBSZXBvc2l0b3J5Tm90aWZpY2F0aW9uRXZlbnRzW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJlcG9zaXRvcnkgZXh0ZW5kcyBJUmVzb3VyY2UsIG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGVTb3VyY2Uge1xuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGlzIFJlcG9zaXRvcnkuXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IHJlcG9zaXRvcnlBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGh1bWFuLXZpc2libGUgbmFtZSBvZiB0aGlzIFJlcG9zaXRvcnkuXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IHJlcG9zaXRvcnlOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBIVFRQIGNsb25lIFVSTC5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVwb3NpdG9yeUNsb25lVXJsSHR0cDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgU1NIIGNsb25lIFVSTC5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVwb3NpdG9yeUNsb25lVXJsU3NoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBIVFRQUyAoR1JDKSBjbG9uZSBVUkwuXG4gICAqXG4gICAqIEhUVFBTIChHUkMpIGlzIHRoZSBwcm90b2NvbCB0byB1c2Ugd2l0aCBnaXQtcmVtb3RlLWNvZGVjb21taXQgKEdSQykuXG4gICAqXG4gICAqIEl0IGlzIHRoZSByZWNvbW1lbmRlZCBtZXRob2QgZm9yIHN1cHBvcnRpbmcgY29ubmVjdGlvbnMgbWFkZSB3aXRoIGZlZGVyYXRlZFxuICAgKiBhY2Nlc3MsIGlkZW50aXR5IHByb3ZpZGVycywgYW5kIHRlbXBvcmFyeSBjcmVkZW50aWFscy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWNvbW1pdC9sYXRlc3QvdXNlcmd1aWRlL3NldHRpbmctdXAtZ2l0LXJlbW90ZS1jb2RlY29tbWl0Lmh0bWxcbiAgICovXG4gIHJlYWRvbmx5IHJlcG9zaXRvcnlDbG9uZVVybEdyYzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgQ2xvdWRXYXRjaCBldmVudCBydWxlIHdoaWNoIHRyaWdnZXJzIGZvciByZXBvc2l0b3J5IGV2ZW50cy4gVXNlXG4gICAqIGBydWxlLmFkZEV2ZW50UGF0dGVybihwYXR0ZXJuKWAgdG8gc3BlY2lmeSBhIGZpbHRlci5cbiAgICovXG4gIG9uRXZlbnQoaWQ6IHN0cmluZywgb3B0aW9ucz86IGV2ZW50cy5PbkV2ZW50T3B0aW9ucyk6IGV2ZW50cy5SdWxlO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgQ2xvdWRXYXRjaCBldmVudCBydWxlIHdoaWNoIHRyaWdnZXJzIHdoZW4gYSBcIkNvZGVDb21taXRcbiAgICogUmVwb3NpdG9yeSBTdGF0ZSBDaGFuZ2VcIiBldmVudCBvY2N1cnMuXG4gICAqL1xuICBvblN0YXRlQ2hhbmdlKGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBldmVudHMuT25FdmVudE9wdGlvbnMpOiBldmVudHMuUnVsZTtcblxuICAvKipcbiAgICogRGVmaW5lcyBhIENsb3VkV2F0Y2ggZXZlbnQgcnVsZSB3aGljaCB0cmlnZ2VycyB3aGVuIGEgcmVmZXJlbmNlIGlzXG4gICAqIGNyZWF0ZWQgKGkuZS4gYSBuZXcgYnJhbmNoL3RhZyBpcyBjcmVhdGVkKSB0byB0aGUgcmVwb3NpdG9yeS5cbiAgICovXG4gIG9uUmVmZXJlbmNlQ3JlYXRlZChpZDogc3RyaW5nLCBvcHRpb25zPzogZXZlbnRzLk9uRXZlbnRPcHRpb25zKTogZXZlbnRzLlJ1bGU7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBDbG91ZFdhdGNoIGV2ZW50IHJ1bGUgd2hpY2ggdHJpZ2dlcnMgd2hlbiBhIHJlZmVyZW5jZSBpc1xuICAgKiB1cGRhdGVkIChpLmUuIGEgY29tbWl0IGlzIHB1c2hlZCB0byBhbiBleGlzdGluZyBvciBuZXcgYnJhbmNoKSBmcm9tIHRoZSByZXBvc2l0b3J5LlxuICAgKi9cbiAgb25SZWZlcmVuY2VVcGRhdGVkKGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBldmVudHMuT25FdmVudE9wdGlvbnMpOiBldmVudHMuUnVsZTtcblxuICAvKipcbiAgICogRGVmaW5lcyBhIENsb3VkV2F0Y2ggZXZlbnQgcnVsZSB3aGljaCB0cmlnZ2VycyB3aGVuIGEgcmVmZXJlbmNlIGlzXG4gICAqIGRlbGV0ZSAoaS5lLiBhIGJyYW5jaC90YWcgaXMgZGVsZXRlZCkgZnJvbSB0aGUgcmVwb3NpdG9yeS5cbiAgICovXG4gIG9uUmVmZXJlbmNlRGVsZXRlZChpZDogc3RyaW5nLCBvcHRpb25zPzogZXZlbnRzLk9uRXZlbnRPcHRpb25zKTogZXZlbnRzLlJ1bGU7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBDbG91ZFdhdGNoIGV2ZW50IHJ1bGUgd2hpY2ggdHJpZ2dlcnMgd2hlbiBhIHB1bGwgcmVxdWVzdCBzdGF0ZSBpcyBjaGFuZ2VkLlxuICAgKi9cbiAgb25QdWxsUmVxdWVzdFN0YXRlQ2hhbmdlKGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBldmVudHMuT25FdmVudE9wdGlvbnMpOiBldmVudHMuUnVsZTtcblxuICAvKipcbiAgICogRGVmaW5lcyBhIENsb3VkV2F0Y2ggZXZlbnQgcnVsZSB3aGljaCB0cmlnZ2VycyB3aGVuIGEgY29tbWVudCBpcyBtYWRlIG9uIGEgcHVsbCByZXF1ZXN0LlxuICAgKi9cbiAgb25Db21tZW50T25QdWxsUmVxdWVzdChpZDogc3RyaW5nLCBvcHRpb25zPzogZXZlbnRzLk9uRXZlbnRPcHRpb25zKTogZXZlbnRzLlJ1bGU7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBDbG91ZFdhdGNoIGV2ZW50IHJ1bGUgd2hpY2ggdHJpZ2dlcnMgd2hlbiBhIGNvbW1lbnQgaXMgbWFkZSBvbiBhIGNvbW1pdC5cbiAgICovXG4gIG9uQ29tbWVudE9uQ29tbWl0KGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBldmVudHMuT25FdmVudE9wdGlvbnMpOiBldmVudHMuUnVsZTtcblxuICAvKipcbiAgICogRGVmaW5lcyBhIENsb3VkV2F0Y2ggZXZlbnQgcnVsZSB3aGljaCB0cmlnZ2VycyB3aGVuIGEgY29tbWl0IGlzIHB1c2hlZCB0byBhIGJyYW5jaC5cbiAgICovXG4gIG9uQ29tbWl0KGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBPbkNvbW1pdE9wdGlvbnMpOiBldmVudHMuUnVsZTtcblxuICAvKipcbiAgICogR3JhbnQgdGhlIGdpdmVuIHByaW5jaXBhbCBpZGVudGl0eSBwZXJtaXNzaW9ucyB0byBwZXJmb3JtIHRoZSBhY3Rpb25zIG9uIHRoaXMgcmVwb3NpdG9yeS5cbiAgICovXG4gIGdyYW50KGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlLCAuLi5hY3Rpb25zOiBzdHJpbmdbXSk6IGlhbS5HcmFudDtcblxuICAvKipcbiAgICogR3JhbnQgdGhlIGdpdmVuIGlkZW50aXR5IHBlcm1pc3Npb25zIHRvIHB1bGwgdGhpcyByZXBvc2l0b3J5LlxuICAgKi9cbiAgZ3JhbnRQdWxsKGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50O1xuXG4gIC8qKlxuICAgKiBHcmFudCB0aGUgZ2l2ZW4gaWRlbnRpdHkgcGVybWlzc2lvbnMgdG8gcHVsbCBhbmQgcHVzaCB0aGlzIHJlcG9zaXRvcnkuXG4gICAqL1xuICBncmFudFB1bGxQdXNoKGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50O1xuXG4gIC8qKlxuICAgKiBHcmFudCB0aGUgZ2l2ZW4gaWRlbnRpdHkgcGVybWlzc2lvbnMgdG8gcmVhZCB0aGlzIHJlcG9zaXRvcnkuXG4gICAqL1xuICBncmFudFJlYWQoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQ7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBDb2RlU3RhciBOb3RpZmljYXRpb24gcnVsZSB0cmlnZ2VyZWQgd2hlbiB0aGUgcHJvamVjdFxuICAgKiBldmVudHMgc3BlY2lmaWVkIGJ5IHlvdSBhcmUgZW1pdHRlZC4gU2ltaWxhciB0byBgb25FdmVudGAgQVBJLlxuICAgKlxuICAgKiBZb3UgY2FuIGFsc28gdXNlIHRoZSBtZXRob2RzIHRvIGRlZmluZSBydWxlcyBmb3IgdGhlIHNwZWNpZmljIGV2ZW50IGVtaXR0ZWQuXG4gICAqIGVnOiBgbm90aWZ5T25QdWxsUmVxdXN0Q3JlYXRlZGAuXG4gICAqXG4gICAqIEByZXR1cm5zIENvZGVTdGFyIE5vdGlmaWNhdGlvbnMgcnVsZSBhc3NvY2lhdGVkIHdpdGggdGhpcyByZXBvc2l0b3J5LlxuICAgKi9cbiAgbm90aWZ5T24oXG4gICAgaWQ6IHN0cmluZyxcbiAgICB0YXJnZXQ6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGVUYXJnZXQsXG4gICAgb3B0aW9uczogUmVwb3NpdG9yeU5vdGlmeU9uT3B0aW9ucyxcbiAgKTogbm90aWZpY2F0aW9ucy5JTm90aWZpY2F0aW9uUnVsZTtcblxuICAvKipcbiAgICogRGVmaW5lcyBhIENvZGVTdGFyIE5vdGlmaWNhdGlvbiBydWxlIHdoaWNoIHRyaWdnZXJzIHdoZW4gYSBjb21tZW50IGlzIG1hZGUgb24gYSBwdWxsIHJlcXVlc3QuXG4gICAqL1xuICBub3RpZnlPblB1bGxSZXF1ZXN0Q29tbWVudChcbiAgICBpZDogc3RyaW5nLFxuICAgIHRhcmdldDogbm90aWZpY2F0aW9ucy5JTm90aWZpY2F0aW9uUnVsZVRhcmdldCxcbiAgICBvcHRpb25zPzogbm90aWZpY2F0aW9ucy5Ob3RpZmljYXRpb25SdWxlT3B0aW9ucyxcbiAgKTogbm90aWZpY2F0aW9ucy5JTm90aWZpY2F0aW9uUnVsZTtcblxuICAvKipcbiAgICogRGVmaW5lcyBhIENvZGVTdGFyIE5vdGlmaWNhdGlvbiBydWxlIHdoaWNoIHRyaWdnZXJzIHdoZW4gYW4gYXBwcm92YWwgc3RhdHVzIGlzIGNoYW5nZWQuXG4gICAqL1xuICBub3RpZnlPbkFwcHJvdmFsU3RhdHVzQ2hhbmdlZChcbiAgICBpZDogc3RyaW5nLFxuICAgIHRhcmdldDogbm90aWZpY2F0aW9ucy5JTm90aWZpY2F0aW9uUnVsZVRhcmdldCxcbiAgICBvcHRpb25zPzogbm90aWZpY2F0aW9ucy5Ob3RpZmljYXRpb25SdWxlT3B0aW9ucyxcbiAgKTogbm90aWZpY2F0aW9ucy5JTm90aWZpY2F0aW9uUnVsZTtcblxuICAvKipcbiAgICogRGVmaW5lcyBhIENvZGVTdGFyIE5vdGlmaWNhdGlvbiBydWxlIHdoaWNoIHRyaWdnZXJzIHdoZW4gYW4gYXBwcm92YWwgcnVsZSBpcyBvdmVycmlkZGVuLlxuICAgKi9cbiAgbm90aWZ5T25BcHByb3ZhbFJ1bGVPdmVycmlkZGVuKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgdGFyZ2V0OiBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlVGFyZ2V0LFxuICAgIG9wdGlvbnM/OiBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGVPcHRpb25zLFxuICApOiBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgQ29kZVN0YXIgTm90aWZpY2F0aW9uIHJ1bGUgd2hpY2ggdHJpZ2dlcnMgd2hlbiBhIHB1bGwgcmVxdWVzdCBpcyBjcmVhdGVkLlxuICAgKi9cbiAgbm90aWZ5T25QdWxsUmVxdWVzdENyZWF0ZWQoXG4gICAgaWQ6IHN0cmluZyxcbiAgICB0YXJnZXQ6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGVUYXJnZXQsXG4gICAgb3B0aW9ucz86IG5vdGlmaWNhdGlvbnMuTm90aWZpY2F0aW9uUnVsZU9wdGlvbnMsXG4gICk6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGU7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBDb2RlU3RhciBOb3RpZmljYXRpb24gcnVsZSB3aGljaCB0cmlnZ2VycyB3aGVuIGEgcHVsbCByZXF1ZXN0IGlzIG1lcmdlZC5cbiAgICogQGRlcHJlY2F0ZWQgdGhpcyBtZXRob2QgaGFzIGEgdHlwbyBpbiBpdHMgbmFtZSwgdXNlIG5vdGlmeU9uUHVsbFJlcXVlc3RNZXJnZWQgaW5zdGVhZFxuICAgKi9cbiAgbm90aWZpeU9uUHVsbFJlcXVlc3RNZXJnZWQoXG4gICAgaWQ6IHN0cmluZyxcbiAgICB0YXJnZXQ6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGVUYXJnZXQsXG4gICAgb3B0aW9ucz86IG5vdGlmaWNhdGlvbnMuTm90aWZpY2F0aW9uUnVsZU9wdGlvbnMsXG4gICk6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGU7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBDb2RlU3RhciBOb3RpZmljYXRpb24gcnVsZSB3aGljaCB0cmlnZ2VycyB3aGVuIGEgcHVsbCByZXF1ZXN0IGlzIG1lcmdlZC5cbiAgICovXG4gIG5vdGlmeU9uUHVsbFJlcXVlc3RNZXJnZWQoXG4gICAgaWQ6IHN0cmluZyxcbiAgICB0YXJnZXQ6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGVUYXJnZXQsXG4gICAgb3B0aW9ucz86IG5vdGlmaWNhdGlvbnMuTm90aWZpY2F0aW9uUnVsZU9wdGlvbnMsXG4gICk6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGU7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBDb2RlU3RhciBOb3RpZmljYXRpb24gcnVsZSB3aGljaCB0cmlnZ2VycyB3aGVuIGEgbmV3IGJyYW5jaCBvciB0YWcgaXMgY3JlYXRlZC5cbiAgICovXG4gIG5vdGlmeU9uQnJhbmNoT3JUYWdDcmVhdGVkKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgdGFyZ2V0OiBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlVGFyZ2V0LFxuICAgIG9wdGlvbnM/OiBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGVPcHRpb25zLFxuICApOiBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgQ29kZVN0YXIgTm90aWZpY2F0aW9uIHJ1bGUgd2hpY2ggdHJpZ2dlcnMgd2hlbiBhIGJyYW5jaCBvciB0YWcgaXMgZGVsZXRlZC5cbiAgICovXG4gIG5vdGlmeU9uQnJhbmNoT3JUYWdEZWxldGVkKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgdGFyZ2V0OiBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlVGFyZ2V0LFxuICAgIG9wdGlvbnM/OiBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGVPcHRpb25zLFxuICApOiBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIHRoZSBvbkNvbW1pdCgpIG1ldGhvZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBPbkNvbW1pdE9wdGlvbnMgZXh0ZW5kcyBldmVudHMuT25FdmVudE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGJyYW5jaCB0byBtb25pdG9yLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEFsbCBicmFuY2hlc1xuICAgKi9cbiAgcmVhZG9ubHkgYnJhbmNoZXM/OiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgcmVmZXJlbmNlIHRvIGEgQ29kZUNvbW1pdCBSZXBvc2l0b3J5LlxuICpcbiAqIElmIHlvdSB3YW50IHRvIGNyZWF0ZSBhIG5ldyBSZXBvc2l0b3J5IG1hbmFnZWQgYWxvbmdzaWRlIHlvdXIgQ0RLIGNvZGUsXG4gKiB1c2UgdGhlIGBSZXBvc2l0b3J5YCBjbGFzcy5cbiAqXG4gKiBJZiB5b3Ugd2FudCB0byByZWZlcmVuY2UgYW4gYWxyZWFkeSBleGlzdGluZyBSZXBvc2l0b3J5LFxuICogdXNlIHRoZSBgUmVwb3NpdG9yeS5pbXBvcnRgIG1ldGhvZC5cbiAqL1xuYWJzdHJhY3QgY2xhc3MgUmVwb3NpdG9yeUJhc2UgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElSZXBvc2l0b3J5IHtcbiAgLyoqIFRoZSBBUk4gb2YgdGhpcyBSZXBvc2l0b3J5LiAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgcmVwb3NpdG9yeUFybjogc3RyaW5nO1xuXG4gIC8qKiBUaGUgaHVtYW4tdmlzaWJsZSBuYW1lIG9mIHRoaXMgUmVwb3NpdG9yeS4gKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHJlcG9zaXRvcnlOYW1lOiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBIVFRQIGNsb25lIFVSTCAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgcmVwb3NpdG9yeUNsb25lVXJsSHR0cDogc3RyaW5nO1xuXG4gIC8qKiBUaGUgU1NIIGNsb25lIFVSTCAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgcmVwb3NpdG9yeUNsb25lVXJsU3NoOiBzdHJpbmc7XG5cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHJlcG9zaXRvcnlDbG9uZVVybEdyYzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgQ2xvdWRXYXRjaCBldmVudCBydWxlIHdoaWNoIHRyaWdnZXJzIGZvciByZXBvc2l0b3J5IGV2ZW50cy4gVXNlXG4gICAqIGBydWxlLmFkZEV2ZW50UGF0dGVybihwYXR0ZXJuKWAgdG8gc3BlY2lmeSBhIGZpbHRlci5cbiAgICovXG4gIHB1YmxpYyBvbkV2ZW50KGlkOiBzdHJpbmcsIG9wdGlvbnM6IGV2ZW50cy5PbkV2ZW50T3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZSh0aGlzLCBpZCwgb3B0aW9ucyk7XG4gICAgcnVsZS5hZGRFdmVudFBhdHRlcm4oe1xuICAgICAgc291cmNlOiBbJ2F3cy5jb2RlY29tbWl0J10sXG4gICAgICByZXNvdXJjZXM6IFt0aGlzLnJlcG9zaXRvcnlBcm5dLFxuICAgIH0pO1xuICAgIHJ1bGUuYWRkVGFyZ2V0KG9wdGlvbnMudGFyZ2V0KTtcbiAgICByZXR1cm4gcnVsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgQ2xvdWRXYXRjaCBldmVudCBydWxlIHdoaWNoIHRyaWdnZXJzIHdoZW4gYSBcIkNvZGVDb21taXRcbiAgICogUmVwb3NpdG9yeSBTdGF0ZSBDaGFuZ2VcIiBldmVudCBvY2N1cnMuXG4gICAqL1xuICBwdWJsaWMgb25TdGF0ZUNoYW5nZShpZDogc3RyaW5nLCBvcHRpb25zOiBldmVudHMuT25FdmVudE9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHJ1bGUgPSB0aGlzLm9uRXZlbnQoaWQsIG9wdGlvbnMpO1xuICAgIHJ1bGUuYWRkRXZlbnRQYXR0ZXJuKHtcbiAgICAgIGRldGFpbFR5cGU6IFsnQ29kZUNvbW1pdCBSZXBvc2l0b3J5IFN0YXRlIENoYW5nZSddLFxuICAgIH0pO1xuICAgIHJldHVybiBydWxlO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBDbG91ZFdhdGNoIGV2ZW50IHJ1bGUgd2hpY2ggdHJpZ2dlcnMgd2hlbiBhIHJlZmVyZW5jZSBpc1xuICAgKiBjcmVhdGVkIChpLmUuIGEgbmV3IGJyYW5jaC90YWcgaXMgY3JlYXRlZCkgdG8gdGhlIHJlcG9zaXRvcnkuXG4gICAqL1xuICBwdWJsaWMgb25SZWZlcmVuY2VDcmVhdGVkKGlkOiBzdHJpbmcsIG9wdGlvbnM6IGV2ZW50cy5PbkV2ZW50T3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgcnVsZSA9IHRoaXMub25TdGF0ZUNoYW5nZShpZCwgb3B0aW9ucyk7XG4gICAgcnVsZS5hZGRFdmVudFBhdHRlcm4oeyBkZXRhaWw6IHsgZXZlbnQ6IFsncmVmZXJlbmNlQ3JlYXRlZCddIH0gfSk7XG4gICAgcmV0dXJuIHJ1bGU7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBhIENsb3VkV2F0Y2ggZXZlbnQgcnVsZSB3aGljaCB0cmlnZ2VycyB3aGVuIGEgcmVmZXJlbmNlIGlzXG4gICAqIHVwZGF0ZWQgKGkuZS4gYSBjb21taXQgaXMgcHVzaGVkIHRvIGFuIGV4aXN0aW5nIG9yIG5ldyBicmFuY2gpIGZyb20gdGhlIHJlcG9zaXRvcnkuXG4gICAqL1xuICBwdWJsaWMgb25SZWZlcmVuY2VVcGRhdGVkKGlkOiBzdHJpbmcsIG9wdGlvbnM6IGV2ZW50cy5PbkV2ZW50T3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgcnVsZSA9IHRoaXMub25TdGF0ZUNoYW5nZShpZCwgb3B0aW9ucyk7XG4gICAgcnVsZS5hZGRFdmVudFBhdHRlcm4oeyBkZXRhaWw6IHsgZXZlbnQ6IFsncmVmZXJlbmNlQ3JlYXRlZCcsICdyZWZlcmVuY2VVcGRhdGVkJ10gfSB9KTtcbiAgICByZXR1cm4gcnVsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgQ2xvdWRXYXRjaCBldmVudCBydWxlIHdoaWNoIHRyaWdnZXJzIHdoZW4gYSByZWZlcmVuY2UgaXNcbiAgICogZGVsZXRlIChpLmUuIGEgYnJhbmNoL3RhZyBpcyBkZWxldGVkKSBmcm9tIHRoZSByZXBvc2l0b3J5LlxuICAgKi9cbiAgcHVibGljIG9uUmVmZXJlbmNlRGVsZXRlZChpZDogc3RyaW5nLCBvcHRpb25zOiBldmVudHMuT25FdmVudE9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHJ1bGUgPSB0aGlzLm9uU3RhdGVDaGFuZ2UoaWQsIG9wdGlvbnMpO1xuICAgIHJ1bGUuYWRkRXZlbnRQYXR0ZXJuKHsgZGV0YWlsOiB7IGV2ZW50OiBbJ3JlZmVyZW5jZURlbGV0ZWQnXSB9IH0pO1xuICAgIHJldHVybiBydWxlO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBDbG91ZFdhdGNoIGV2ZW50IHJ1bGUgd2hpY2ggdHJpZ2dlcnMgd2hlbiBhIHB1bGwgcmVxdWVzdCBzdGF0ZSBpcyBjaGFuZ2VkLlxuICAgKi9cbiAgcHVibGljIG9uUHVsbFJlcXVlc3RTdGF0ZUNoYW5nZShpZDogc3RyaW5nLCBvcHRpb25zOiBldmVudHMuT25FdmVudE9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHJ1bGUgPSB0aGlzLm9uRXZlbnQoaWQsIG9wdGlvbnMpO1xuICAgIHJ1bGUuYWRkRXZlbnRQYXR0ZXJuKHsgZGV0YWlsVHlwZTogWydDb2RlQ29tbWl0IFB1bGwgUmVxdWVzdCBTdGF0ZSBDaGFuZ2UnXSB9KTtcbiAgICByZXR1cm4gcnVsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgQ2xvdWRXYXRjaCBldmVudCBydWxlIHdoaWNoIHRyaWdnZXJzIHdoZW4gYSBjb21tZW50IGlzIG1hZGUgb24gYSBwdWxsIHJlcXVlc3QuXG4gICAqL1xuICBwdWJsaWMgb25Db21tZW50T25QdWxsUmVxdWVzdChpZDogc3RyaW5nLCBvcHRpb25zOiBldmVudHMuT25FdmVudE9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHJ1bGUgPSB0aGlzLm9uRXZlbnQoaWQsIG9wdGlvbnMpO1xuICAgIHJ1bGUuYWRkRXZlbnRQYXR0ZXJuKHsgZGV0YWlsVHlwZTogWydDb2RlQ29tbWl0IENvbW1lbnQgb24gUHVsbCBSZXF1ZXN0J10gfSk7XG4gICAgcmV0dXJuIHJ1bGU7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBhIENsb3VkV2F0Y2ggZXZlbnQgcnVsZSB3aGljaCB0cmlnZ2VycyB3aGVuIGEgY29tbWVudCBpcyBtYWRlIG9uIGEgY29tbWl0LlxuICAgKi9cbiAgcHVibGljIG9uQ29tbWVudE9uQ29tbWl0KGlkOiBzdHJpbmcsIG9wdGlvbnM6IGV2ZW50cy5PbkV2ZW50T3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgcnVsZSA9IHRoaXMub25FdmVudChpZCwgb3B0aW9ucyk7XG4gICAgcnVsZS5hZGRFdmVudFBhdHRlcm4oeyBkZXRhaWxUeXBlOiBbJ0NvZGVDb21taXQgQ29tbWVudCBvbiBDb21taXQnXSB9KTtcbiAgICByZXR1cm4gcnVsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgQ2xvdWRXYXRjaCBldmVudCBydWxlIHdoaWNoIHRyaWdnZXJzIHdoZW4gYSBjb21taXQgaXMgcHVzaGVkIHRvIGEgYnJhbmNoLlxuICAgKi9cbiAgcHVibGljIG9uQ29tbWl0KGlkOiBzdHJpbmcsIG9wdGlvbnM6IE9uQ29tbWl0T3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgcnVsZSA9IHRoaXMub25SZWZlcmVuY2VVcGRhdGVkKGlkLCBvcHRpb25zKTtcbiAgICBpZiAob3B0aW9ucy5icmFuY2hlcykge1xuICAgICAgcnVsZS5hZGRFdmVudFBhdHRlcm4oeyBkZXRhaWw6IHsgcmVmZXJlbmNlTmFtZTogb3B0aW9ucy5icmFuY2hlcyB9IH0pO1xuICAgIH1cbiAgICByZXR1cm4gcnVsZTtcbiAgfVxuXG4gIHB1YmxpYyBncmFudChncmFudGVlOiBpYW0uSUdyYW50YWJsZSwgLi4uYWN0aW9uczogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsKHtcbiAgICAgIGdyYW50ZWUsXG4gICAgICBhY3Rpb25zLFxuICAgICAgcmVzb3VyY2VBcm5zOiBbdGhpcy5yZXBvc2l0b3J5QXJuXSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBncmFudFB1bGwoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpIHtcbiAgICByZXR1cm4gdGhpcy5ncmFudChncmFudGVlLCAnY29kZWNvbW1pdDpHaXRQdWxsJyk7XG4gIH1cblxuICBwdWJsaWMgZ3JhbnRQdWxsUHVzaChncmFudGVlOiBpYW0uSUdyYW50YWJsZSkge1xuICAgIHRoaXMuZ3JhbnRQdWxsKGdyYW50ZWUpO1xuICAgIHJldHVybiB0aGlzLmdyYW50KGdyYW50ZWUsICdjb2RlY29tbWl0OkdpdFB1c2gnKTtcbiAgfVxuXG4gIHB1YmxpYyBncmFudFJlYWQoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpIHtcbiAgICB0aGlzLmdyYW50UHVsbChncmFudGVlKTtcbiAgICByZXR1cm4gdGhpcy5ncmFudChncmFudGVlLFxuICAgICAgJ2NvZGVjb21taXQ6RXZhbHVhdGVQdWxsUmVxdWVzdEFwcHJvdmFsUnVsZXMnLFxuICAgICAgJ2NvZGVjb21taXQ6R2V0KicsXG4gICAgICAnY29kZWNvbW1pdDpEZXNjcmliZSonLFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5T24oXG4gICAgaWQ6IHN0cmluZyxcbiAgICB0YXJnZXQ6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGVUYXJnZXQsXG4gICAgb3B0aW9uczogUmVwb3NpdG9yeU5vdGlmeU9uT3B0aW9ucyxcbiAgKTogbm90aWZpY2F0aW9ucy5JTm90aWZpY2F0aW9uUnVsZSB7XG4gICAgcmV0dXJuIG5ldyBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGUodGhpcywgaWQsIHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBzb3VyY2U6IHRoaXMsXG4gICAgICB0YXJnZXRzOiBbdGFyZ2V0XSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBub3RpZnlPblB1bGxSZXF1ZXN0Q29tbWVudChcbiAgICBpZDogc3RyaW5nLFxuICAgIHRhcmdldDogbm90aWZpY2F0aW9ucy5JTm90aWZpY2F0aW9uUnVsZVRhcmdldCxcbiAgICBvcHRpb25zPzogbm90aWZpY2F0aW9ucy5Ob3RpZmljYXRpb25SdWxlT3B0aW9ucyxcbiAgKTogbm90aWZpY2F0aW9ucy5JTm90aWZpY2F0aW9uUnVsZSB7XG4gICAgcmV0dXJuIHRoaXMubm90aWZ5T24oaWQsIHRhcmdldCwge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIGV2ZW50czogW1JlcG9zaXRvcnlOb3RpZmljYXRpb25FdmVudHMuUFVMTF9SRVFVRVNUX0NPTU1FTlRdLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG5vdGlmeU9uQXBwcm92YWxTdGF0dXNDaGFuZ2VkKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgdGFyZ2V0OiBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlVGFyZ2V0LFxuICAgIG9wdGlvbnM/OiBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGVPcHRpb25zLFxuICApOiBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlIHtcbiAgICByZXR1cm4gdGhpcy5ub3RpZnlPbihpZCwgdGFyZ2V0LCB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgZXZlbnRzOiBbUmVwb3NpdG9yeU5vdGlmaWNhdGlvbkV2ZW50cy5BUFBST1ZBTF9TVEFUVVNfQ0hBTkdFRF0sXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5T25BcHByb3ZhbFJ1bGVPdmVycmlkZGVuKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgdGFyZ2V0OiBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlVGFyZ2V0LFxuICAgIG9wdGlvbnM/OiBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGVPcHRpb25zLFxuICApOiBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlIHtcbiAgICByZXR1cm4gdGhpcy5ub3RpZnlPbihpZCwgdGFyZ2V0LCB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgZXZlbnRzOiBbUmVwb3NpdG9yeU5vdGlmaWNhdGlvbkV2ZW50cy5BUFBST1ZBTF9SVUxFX09WRVJSSURERU5dLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG5vdGlmeU9uUHVsbFJlcXVlc3RDcmVhdGVkKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgdGFyZ2V0OiBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlVGFyZ2V0LFxuICAgIG9wdGlvbnM/OiBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGVPcHRpb25zLFxuICApOiBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlIHtcbiAgICByZXR1cm4gdGhpcy5ub3RpZnlPbihpZCwgdGFyZ2V0LCB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgZXZlbnRzOiBbUmVwb3NpdG9yeU5vdGlmaWNhdGlvbkV2ZW50cy5QVUxMX1JFUVVFU1RfQ1JFQVRFRF0sXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbm90aWZpeU9uUHVsbFJlcXVlc3RNZXJnZWQoXG4gICAgaWQ6IHN0cmluZyxcbiAgICB0YXJnZXQ6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGVUYXJnZXQsXG4gICAgb3B0aW9ucz86IG5vdGlmaWNhdGlvbnMuTm90aWZpY2F0aW9uUnVsZU9wdGlvbnMsXG4gICk6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGUge1xuICAgIHJldHVybiB0aGlzLm5vdGlmeU9uUHVsbFJlcXVlc3RNZXJnZWQoaWQsIHRhcmdldCwgb3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5T25QdWxsUmVxdWVzdE1lcmdlZChcbiAgICBpZDogc3RyaW5nLFxuICAgIHRhcmdldDogbm90aWZpY2F0aW9ucy5JTm90aWZpY2F0aW9uUnVsZVRhcmdldCxcbiAgICBvcHRpb25zPzogbm90aWZpY2F0aW9ucy5Ob3RpZmljYXRpb25SdWxlT3B0aW9ucyxcbiAgKTogbm90aWZpY2F0aW9ucy5JTm90aWZpY2F0aW9uUnVsZSB7XG4gICAgcmV0dXJuIHRoaXMubm90aWZ5T24oaWQsIHRhcmdldCwge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIGV2ZW50czogW1JlcG9zaXRvcnlOb3RpZmljYXRpb25FdmVudHMuUFVMTF9SRVFVRVNUX01FUkdFRF0sXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5T25CcmFuY2hPclRhZ0NyZWF0ZWQoXG4gICAgaWQ6IHN0cmluZyxcbiAgICB0YXJnZXQ6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGVUYXJnZXQsXG4gICAgb3B0aW9ucz86IG5vdGlmaWNhdGlvbnMuTm90aWZpY2F0aW9uUnVsZU9wdGlvbnMsXG4gICk6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGUge1xuICAgIHJldHVybiB0aGlzLm5vdGlmeU9uKGlkLCB0YXJnZXQsIHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBldmVudHM6IFtSZXBvc2l0b3J5Tm90aWZpY2F0aW9uRXZlbnRzLkJSQU5DSF9PUl9UQUdfQ1JFQVRFRF0sXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5T25CcmFuY2hPclRhZ0RlbGV0ZWQoXG4gICAgaWQ6IHN0cmluZyxcbiAgICB0YXJnZXQ6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGVUYXJnZXQsXG4gICAgb3B0aW9ucz86IG5vdGlmaWNhdGlvbnMuTm90aWZpY2F0aW9uUnVsZU9wdGlvbnMsXG4gICk6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGUge1xuICAgIHJldHVybiB0aGlzLm5vdGlmeU9uKGlkLCB0YXJnZXQsIHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBldmVudHM6IFtSZXBvc2l0b3J5Tm90aWZpY2F0aW9uRXZlbnRzLkJSQU5DSF9PUl9UQUdfREVMRVRFRF0sXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYmluZEFzTm90aWZpY2F0aW9uUnVsZVNvdXJjZShfc2NvcGU6IENvbnN0cnVjdCk6IG5vdGlmaWNhdGlvbnMuTm90aWZpY2F0aW9uUnVsZVNvdXJjZUNvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNvdXJjZUFybjogdGhpcy5yZXBvc2l0b3J5QXJuLFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZXBvc2l0b3J5UHJvcHMge1xuICAvKipcbiAgICogTmFtZSBvZiB0aGUgcmVwb3NpdG9yeS5cbiAgICpcbiAgICogVGhpcyBwcm9wZXJ0eSBpcyByZXF1aXJlZCBmb3IgYWxsIENvZGVDb21taXQgcmVwb3NpdG9yaWVzLlxuICAgKi9cbiAgcmVhZG9ubHkgcmVwb3NpdG9yeU5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogQSBkZXNjcmlwdGlvbiBvZiB0aGUgcmVwb3NpdG9yeS4gVXNlIHRoZSBkZXNjcmlwdGlvbiB0byBpZGVudGlmeSB0aGVcbiAgICogcHVycG9zZSBvZiB0aGUgcmVwb3NpdG9yeS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBkZXNjcmlwdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgY29udGVudHMgd2l0aCB3aGljaCB0byBpbml0aWFsaXplIHRoZSByZXBvc2l0b3J5IGFmdGVyIGl0IGhhcyBiZWVuIGNyZWF0ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gaW5pdGlhbGl6YXRpb24gKGNyZWF0ZSBlbXB0eSByZXBvKVxuICAgKi9cbiAgcmVhZG9ubHkgY29kZT86IENvZGU7XG59XG5cbi8qKlxuICogUHJvdmlkZXMgYSBDb2RlQ29tbWl0IFJlcG9zaXRvcnkuXG4gKi9cbmV4cG9ydCBjbGFzcyBSZXBvc2l0b3J5IGV4dGVuZHMgUmVwb3NpdG9yeUJhc2Uge1xuXG4gIC8qKlxuICAgKiBJbXBvcnRzIGEgY29kZWNvbW1pdCByZXBvc2l0b3J5LlxuICAgKiBAcGFyYW0gcmVwb3NpdG9yeUFybiAoZS5nLiBgYXJuOmF3czpjb2RlY29tbWl0OnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6TXlEZW1vUmVwb2ApXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21SZXBvc2l0b3J5QXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHJlcG9zaXRvcnlBcm46IHN0cmluZyk6IElSZXBvc2l0b3J5IHtcbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHNjb3BlKTtcbiAgICBjb25zdCBhcm4gPSBzdGFjay5zcGxpdEFybihyZXBvc2l0b3J5QXJuLCBBcm5Gb3JtYXQuTk9fUkVTT1VSQ0VfTkFNRSk7XG4gICAgY29uc3QgcmVwb3NpdG9yeU5hbWUgPSBhcm4ucmVzb3VyY2U7XG4gICAgY29uc3QgcmVnaW9uID0gYXJuLnJlZ2lvbjtcblxuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFJlcG9zaXRvcnlCYXNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSByZXBvc2l0b3J5QXJuID0gcmVwb3NpdG9yeUFybjtcbiAgICAgIHB1YmxpYyByZWFkb25seSByZXBvc2l0b3J5TmFtZSA9IHJlcG9zaXRvcnlOYW1lO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHJlcG9zaXRvcnlDbG9uZVVybEh0dHAgPSBtYWtlQ2xvbmVVcmwoc3RhY2ssIHJlcG9zaXRvcnlOYW1lLCAnaHR0cHMnLCByZWdpb24pO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHJlcG9zaXRvcnlDbG9uZVVybFNzaCA9IG1ha2VDbG9uZVVybChzdGFjaywgcmVwb3NpdG9yeU5hbWUsICdzc2gnLCByZWdpb24pO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHJlcG9zaXRvcnlDbG9uZVVybEdyYyA9IG1ha2VDbG9uZVVybChzdGFjaywgcmVwb3NpdG9yeU5hbWUsICdncmMnLCByZWdpb24pO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCwge1xuICAgICAgYWNjb3VudDogYXJuLmFjY291bnQsXG4gICAgICByZWdpb24sXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGZyb21SZXBvc2l0b3J5TmFtZShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXBvc2l0b3J5TmFtZTogc3RyaW5nKTogSVJlcG9zaXRvcnkge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2Yoc2NvcGUpO1xuXG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVwb3NpdG9yeUJhc2Uge1xuICAgICAgcHVibGljIHJlcG9zaXRvcnlOYW1lID0gcmVwb3NpdG9yeU5hbWU7XG4gICAgICBwdWJsaWMgcmVwb3NpdG9yeUFybiA9IFN0YWNrLm9mKHNjb3BlKS5mb3JtYXRBcm4oe1xuICAgICAgICBzZXJ2aWNlOiAnY29kZWNvbW1pdCcsXG4gICAgICAgIHJlc291cmNlOiByZXBvc2l0b3J5TmFtZSxcbiAgICAgIH0pO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHJlcG9zaXRvcnlDbG9uZVVybEh0dHAgPSBtYWtlQ2xvbmVVcmwoc3RhY2ssIHJlcG9zaXRvcnlOYW1lLCAnaHR0cHMnKTtcbiAgICAgIHB1YmxpYyByZWFkb25seSByZXBvc2l0b3J5Q2xvbmVVcmxTc2ggPSBtYWtlQ2xvbmVVcmwoc3RhY2ssIHJlcG9zaXRvcnlOYW1lLCAnc3NoJyk7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcmVwb3NpdG9yeUNsb25lVXJsR3JjID0gbWFrZUNsb25lVXJsKHN0YWNrLCByZXBvc2l0b3J5TmFtZSwgJ2dyYycpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgcmVwb3NpdG9yeUFybjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgcmVwb3NpdG9yeU5hbWU6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IHJlcG9zaXRvcnlDbG9uZVVybEh0dHA6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IHJlcG9zaXRvcnlDbG9uZVVybFNzaDogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgcmVwb3NpdG9yeUNsb25lVXJsR3JjOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgdHJpZ2dlcnMgPSBuZXcgQXJyYXk8Q2ZuUmVwb3NpdG9yeS5SZXBvc2l0b3J5VHJpZ2dlclByb3BlcnR5PigpO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBSZXBvc2l0b3J5UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMucmVwb3NpdG9yeU5hbWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXBvc2l0b3J5ID0gbmV3IENmblJlcG9zaXRvcnkodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgcmVwb3NpdG9yeU5hbWU6IHByb3BzLnJlcG9zaXRvcnlOYW1lLFxuICAgICAgcmVwb3NpdG9yeURlc2NyaXB0aW9uOiBwcm9wcy5kZXNjcmlwdGlvbixcbiAgICAgIHRyaWdnZXJzOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMudHJpZ2dlcnMgfSwgeyBvbWl0RW1wdHlBcnJheTogdHJ1ZSB9KSxcbiAgICAgIGNvZGU6IChwcm9wcy5jb2RlPy5iaW5kKHRoaXMpKT8uY29kZSxcbiAgICB9KTtcblxuICAgIHRoaXMucmVwb3NpdG9yeU5hbWUgPSB0aGlzLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZShyZXBvc2l0b3J5LmF0dHJOYW1lKTtcbiAgICB0aGlzLnJlcG9zaXRvcnlBcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKHJlcG9zaXRvcnkuYXR0ckFybiwge1xuICAgICAgc2VydmljZTogJ2NvZGVjb21taXQnLFxuICAgICAgcmVzb3VyY2U6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgIH0pO1xuICAgIHRoaXMucmVwb3NpdG9yeUNsb25lVXJsSHR0cCA9IHJlcG9zaXRvcnkuYXR0ckNsb25lVXJsSHR0cDtcbiAgICB0aGlzLnJlcG9zaXRvcnlDbG9uZVVybFNzaCA9IHJlcG9zaXRvcnkuYXR0ckNsb25lVXJsU3NoO1xuICAgIHRoaXMucmVwb3NpdG9yeUNsb25lVXJsR3JjID0gbWFrZUNsb25lVXJsKFN0YWNrLm9mKHRoaXMpLCB0aGlzLnJlcG9zaXRvcnlOYW1lLCAnZ3JjJyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgdHJpZ2dlciB0byBub3RpZnkgYW5vdGhlciBzZXJ2aWNlIHRvIHJ1biBhY3Rpb25zIG9uIHJlcG9zaXRvcnkgZXZlbnRzLlxuICAgKiBAcGFyYW0gYXJuICAgQXJuIG9mIHRoZSByZXNvdXJjZSB0aGF0IHJlcG9zaXRvcnkgZXZlbnRzIHdpbGwgbm90aWZ5XG4gICAqIEBwYXJhbSBvcHRpb25zIFRyaWdnZXIgb3B0aW9ucyB0byBydW4gYWN0aW9uc1xuICAgKi9cbiAgcHVibGljIG5vdGlmeShhcm46IHN0cmluZywgb3B0aW9ucz86IFJlcG9zaXRvcnlUcmlnZ2VyT3B0aW9ucyk6IFJlcG9zaXRvcnkge1xuXG4gICAgbGV0IGV2dCA9IG9wdGlvbnMgJiYgb3B0aW9ucy5ldmVudHM7XG4gICAgaWYgKGV2dCAmJiBldnQubGVuZ3RoID4gMSAmJiBldnQuaW5kZXhPZihSZXBvc2l0b3J5RXZlbnRUcmlnZ2VyLkFMTCkgPiAtMSkge1xuICAgICAgZXZ0ID0gW1JlcG9zaXRvcnlFdmVudFRyaWdnZXIuQUxMXTtcbiAgICB9XG5cbiAgICBjb25zdCBjdXN0b21EYXRhID0gb3B0aW9ucyAmJiBvcHRpb25zLmN1c3RvbURhdGE7XG4gICAgY29uc3QgYnJhbmNoZXMgPSBvcHRpb25zICYmIG9wdGlvbnMuYnJhbmNoZXM7XG5cbiAgICBsZXQgbmFtZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5uYW1lO1xuICAgIGlmICghbmFtZSkge1xuICAgICAgbmFtZSA9IHRoaXMubm9kZS5wYXRoICsgJy8nICsgYXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRyaWdnZXJzLmZpbmQocHJvcCA9PiBwcm9wLm5hbWUgPT09IG5hbWUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBzZXQgcmVwb3NpdG9yeSB0cmlnZ2VyIG5hbWVkICR7bmFtZX0gYmVjYXVzZSB0cmlnZ2VyIG5hbWVzIG11c3QgYmUgdW5pcXVlYCk7XG4gICAgfVxuXG4gICAgdGhpcy50cmlnZ2Vycy5wdXNoKHtcbiAgICAgIGRlc3RpbmF0aW9uQXJuOiBhcm4sXG4gICAgICBuYW1lLFxuICAgICAgY3VzdG9tRGF0YSxcbiAgICAgIGJyYW5jaGVzLFxuICAgICAgZXZlbnRzOiBldnQgfHwgW1JlcG9zaXRvcnlFdmVudFRyaWdnZXIuQUxMXSxcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZXMgZm9yIGEgcmVwb3NpdG9yeSB0cmlnZ2VyIHRvIGFuIFNOUyB0b3BpYyBvciBMYW1iZGEgZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVwb3NpdG9yeVRyaWdnZXJPcHRpb25zIHtcbiAgLyoqXG4gICAqIEEgbmFtZSBmb3IgdGhlIHRyaWdnZXIuVHJpZ2dlcnMgb24gYSByZXBvc2l0b3J5IG11c3QgaGF2ZSB1bmlxdWUgbmFtZXMuXG4gICAqL1xuICByZWFkb25seSBuYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVwb3NpdG9yeSBldmVudHMgZm9yIHdoaWNoIEFXUyBDb2RlQ29tbWl0IHNlbmRzIGluZm9ybWF0aW9uIHRvIHRoZVxuICAgKiB0YXJnZXQsIHdoaWNoIHlvdSBzcGVjaWZpZWQgaW4gdGhlIERlc3RpbmF0aW9uQXJuIHByb3BlcnR5LklmIHlvdSBkb24ndFxuICAgKiBzcGVjaWZ5IGV2ZW50cywgdGhlIHRyaWdnZXIgcnVucyBmb3IgYWxsIHJlcG9zaXRvcnkgZXZlbnRzLlxuICAgKi9cbiAgcmVhZG9ubHkgZXZlbnRzPzogUmVwb3NpdG9yeUV2ZW50VHJpZ2dlcltdO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZXMgb2YgdGhlIGJyYW5jaGVzIGluIHRoZSBBV1MgQ29kZUNvbW1pdCByZXBvc2l0b3J5IHRoYXQgY29udGFpblxuICAgKiBldmVudHMgdGhhdCB5b3Ugd2FudCB0byBpbmNsdWRlIGluIHRoZSB0cmlnZ2VyLiBJZiB5b3UgZG9uJ3Qgc3BlY2lmeSBhdFxuICAgKiBsZWFzdCBvbmUgYnJhbmNoLCB0aGUgdHJpZ2dlciBhcHBsaWVzIHRvIGFsbCBicmFuY2hlcy5cbiAgICovXG4gIHJlYWRvbmx5IGJyYW5jaGVzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFdoZW4gYW4gZXZlbnQgaXMgdHJpZ2dlcmVkLCBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIHRoYXQgQVdTIENvZGVDb21taXRcbiAgICogaW5jbHVkZXMgd2hlbiBpdCBzZW5kcyBpbmZvcm1hdGlvbiB0byB0aGUgdGFyZ2V0LlxuICAgKi9cbiAgcmVhZG9ubHkgY3VzdG9tRGF0YT86IHN0cmluZztcbn1cblxuLyoqXG4gKiBSZXBvc2l0b3J5IGV2ZW50cyB0aGF0IHdpbGwgY2F1c2UgdGhlIHRyaWdnZXIgdG8gcnVuIGFjdGlvbnMgaW4gYW5vdGhlciBzZXJ2aWNlLlxuICovXG5leHBvcnQgZW51bSBSZXBvc2l0b3J5RXZlbnRUcmlnZ2VyIHtcbiAgQUxMID0gJ2FsbCcsXG4gIFVQREFURV9SRUYgPSAndXBkYXRlUmVmZXJlbmNlJyxcbiAgQ1JFQVRFX1JFRiA9ICdjcmVhdGVSZWZlcmVuY2UnLFxuICBERUxFVEVfUkVGID0gJ2RlbGV0ZVJlZmVyZW5jZSdcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBjbG9uZSBVUkwgZm9yIGEgcHJvdG9jb2wuXG4gKi9cbmZ1bmN0aW9uIG1ha2VDbG9uZVVybChzdGFjazogU3RhY2ssIHJlcG9zaXRvcnlOYW1lOiBzdHJpbmcsIHByb3RvY29sOiAnaHR0cHMnIHwgJ3NzaCcgfCAnZ3JjJywgcmVnaW9uPzogc3RyaW5nKSB7XG4gIHN3aXRjaCAocHJvdG9jb2wpIHtcbiAgICBjYXNlICdodHRwcyc6XG4gICAgY2FzZSAnc3NoJzpcbiAgICAgIHJldHVybiBgJHtwcm90b2NvbH06Ly9naXQtY29kZWNvbW1pdC4ke3JlZ2lvbiA/PyBzdGFjay5yZWdpb259LiR7c3RhY2sudXJsU3VmZml4fS92MS9yZXBvcy8ke3JlcG9zaXRvcnlOYW1lfWA7XG4gICAgY2FzZSAnZ3JjJzpcbiAgICAgIHJldHVybiBgY29kZWNvbW1pdDo6JHtyZWdpb24gPz8gc3RhY2sucmVnaW9ufTovLyR7cmVwb3NpdG9yeU5hbWV9YDtcbiAgfVxufVxuXG4vKipcbiAqIExpc3Qgb2YgZXZlbnQgdHlwZXMgZm9yIEFXUyBDb2RlQ29tbWl0XG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9kdGNvbnNvbGUvbGF0ZXN0L3VzZXJndWlkZS9jb25jZXB0cy5odG1sI2V2ZW50cy1yZWYtcmVwb3NpdG9yaWVzXG4gKi9cbmV4cG9ydCBlbnVtIFJlcG9zaXRvcnlOb3RpZmljYXRpb25FdmVudHMge1xuICAvKipcbiAgICogVHJpZ2dlciBub3RpY2F0aW9uIHdoZW4gY29tbWVudCBtYWRlIG9uIGNvbW1pdC5cbiAgICovXG4gIENPTU1JVF9DT01NRU5UID0gJ2NvZGVjb21taXQtcmVwb3NpdG9yeS1jb21tZW50cy1vbi1jb21taXRzJyxcblxuICAvKipcbiAgICogVHJpZ2dlciBub3RpZmljYXRpb24gd2hlbiBjb21tZW50IG1hZGUgb24gcHVsbCByZXF1ZXN0LlxuICAgKi9cbiAgUFVMTF9SRVFVRVNUX0NPTU1FTlQgPSAnY29kZWNvbW1pdC1yZXBvc2l0b3J5LWNvbW1lbnRzLW9uLXB1bGwtcmVxdWVzdHMnLFxuXG4gIC8qKlxuICAgKiBUcmlnZ2VyIG5vdGlmaWNhdGlvbiB3aGVuIGFwcHJvdmFsIHN0YXR1cyBjaGFuZ2VkLlxuICAgKi9cbiAgQVBQUk9WQUxfU1RBVFVTX0NIQU5HRUQgPSAnY29kZWNvbW1pdC1yZXBvc2l0b3J5LWFwcHJvdmFscy1zdGF0dXMtY2hhbmdlZCcsXG5cbiAgLyoqXG4gICAqIFRyaWdnZXIgbm90aWZpY2F0aW9ucyB3aGVuIGFwcHJvdmFsIHJ1bGUgaXMgb3ZlcnJpZGRlbi5cbiAgICovXG4gIEFQUFJPVkFMX1JVTEVfT1ZFUlJJRERFTiA9ICdjb2RlY29tbWl0LXJlcG9zaXRvcnktYXBwcm92YWxzLXJ1bGUtb3ZlcnJpZGUnLFxuXG4gIC8qKlxuICAgKiBUcmlnZ2VyIG5vdGlmaWNhdGlvbiB3aGVuIHB1bGwgcmVxdWVzdCBjcmVhdGVkLlxuICAgKi9cbiAgUFVMTF9SRVFVRVNUX0NSRUFURUQgPSAnY29kZWNvbW1pdC1yZXBvc2l0b3J5LXB1bGwtcmVxdWVzdC1jcmVhdGVkJyxcblxuICAvKipcbiAgICogVHJpZ2dlciBub3RpZmljYXRpb24gd2hlbiBwdWxsIHJlcXVlc3Qgc291cmNlIHVwZGF0ZWQuXG4gICAqL1xuICBQVUxMX1JFUVVFU1RfU09VUkNFX1VQREFURUQgPSAnY29kZWNvbW1pdC1yZXBvc2l0b3J5LXB1bGwtcmVxdWVzdC1zb3VyY2UtdXBkYXRlZCcsXG5cbiAgLyoqXG4gICAqIFRyaWdnZXIgbm90aWZpY2F0aW9uIHdoZW4gcHVsbCByZXF1ZXN0IHN0YXR1cyBpcyBjaGFuZ2VkLlxuICAgKi9cbiAgUFVMTF9SRVFVRVNUX1NUQVRVU19DSEFOR0VEID0gJ2NvZGVjb21taXQtcmVwb3NpdG9yeS1wdWxsLXJlcXVlc3Qtc3RhdHVzLWNoYW5nZWQnLFxuXG4gIC8qKlxuICAgKiBUcmlnZ2VyIG5vdGlmaWNhdGlvbiB3aGVuIHB1bGwgcmVxdXNldCBpcyBtZXJnZWQuXG4gICAqL1xuICBQVUxMX1JFUVVFU1RfTUVSR0VEID0gJ2NvZGVjb21taXQtcmVwb3NpdG9yeS1wdWxsLXJlcXVlc3QtbWVyZ2VkJyxcblxuICAvKipcbiAgICogVHJpZ2dlciBub3RpZmljYXRpb24gd2hlbiBhIGJyYW5jaCBvciB0YWcgaXMgY3JlYXRlZC5cbiAgICovXG4gIEJSQU5DSF9PUl9UQUdfQ1JFQVRFRCA9ICdjb2RlY29tbWl0LXJlcG9zaXRvcnktYnJhbmNoZXMtYW5kLXRhZ3MtY3JlYXRlZCcsXG5cbiAgLyoqXG4gICAqIFRyaWdnZXIgbm90aWZpY2F0aW9uIHdoZW4gYSBicmFuY2ggb3IgdGFnIGlzIGRlbGV0ZWQuXG4gICAqL1xuICBCUkFOQ0hfT1JfVEFHX0RFTEVURUQgPSAnY29kZWNvbW1pdC1yZXBvc2l0b3J5LWJyYW5jaGVzLWFuZC10YWdzLWRlbGV0ZWQnLFxuXG4gIC8qKlxuICAgKiBUcmlnZ2VyIG5vdGlmaWNhdGlvbiB3aGVuIGEgYnJhbmNoIG9yIHRhZyBpcyB1cGRhdGVkLlxuICAgKi9cbiAgQlJBTkNIX09SX1RBR19VUERBVEVEID0gJ2NvZGVjb21taXQtcmVwb3NpdG9yeS1icmFuY2hlcy1hbmQtdGFncy11cGRhdGVkJyxcbn1cbiJdfQ==