"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicBase = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const policy_1 = require("./policy");
const subscription_1 = require("./subscription");
/**
 * Either a new or imported Topic
 */
class TopicBase extends core_1.Resource {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        this.node.addValidation({ validate: () => this.policy?.document.validateForResourcePolicy() ?? [] });
    }
    /**
     * Subscribe some endpoint to this topic
     */
    addSubscription(topicSubscription) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_sns_ITopicSubscription(topicSubscription);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addSubscription);
            }
            throw error;
        }
        const subscriptionConfig = topicSubscription.bind(this);
        const scope = subscriptionConfig.subscriberScope || this;
        let id = subscriptionConfig.subscriberId;
        if (core_1.Token.isUnresolved(subscriptionConfig.subscriberId)) {
            id = this.nextTokenId(scope);
        }
        // We use the subscriber's id as the construct id. There's no meaning
        // to subscribing the same subscriber twice on the same topic.
        if (scope.node.tryFindChild(id)) {
            throw new Error(`A subscription with id "${id}" already exists under the scope ${scope.node.path}`);
        }
        const subscription = new subscription_1.Subscription(scope, id, {
            topic: this,
            ...subscriptionConfig,
        });
        // Add dependency for the subscription, for example for SQS subscription
        // the queue policy has to deploy before the subscription is created
        if (subscriptionConfig.subscriptionDependency) {
            subscription.node.addDependency(subscriptionConfig.subscriptionDependency);
        }
        return subscription;
    }
    /**
     * Adds a statement to the IAM resource policy associated with this topic.
     *
     * If this topic was created in this stack (`new Topic`), a topic policy
     * will be automatically created upon the first call to `addToPolicy`. If
     * the topic is imported (`Topic.import`), then this is a no-op.
     */
    addToResourcePolicy(statement) {
        if (!this.policy && this.autoCreatePolicy) {
            this.policy = new policy_1.TopicPolicy(this, 'Policy', { topics: [this] });
        }
        if (this.policy) {
            this.policy.document.addStatements(statement);
            return { statementAdded: true, policyDependable: this.policy };
        }
        return { statementAdded: false };
    }
    /**
     * Grant topic publishing permissions to the given identity
     */
    grantPublish(grantee) {
        return iam.Grant.addToPrincipalOrResource({
            grantee,
            actions: ['sns:Publish'],
            resourceArns: [this.topicArn],
            resource: this,
        });
    }
    /**
     * Represents a notification target
     * That allows SNS topic to associate with this rule target.
     */
    bindAsNotificationRuleTarget(_scope) {
        // SNS topic need to grant codestar-notifications service to publish
        // @see https://docs.aws.amazon.com/dtconsole/latest/userguide/set-up-sns.html
        this.grantPublish(new iam.ServicePrincipal('codestar-notifications.amazonaws.com'));
        return {
            targetType: 'SNS',
            targetAddress: this.topicArn,
        };
    }
    nextTokenId(scope) {
        let nextSuffix = 1;
        const re = /TokenSubscription:([\d]*)/gm;
        // Search through the construct and all of its children
        // for previous subscriptions that match our regex pattern
        for (const source of scope.node.findAll()) {
            const m = re.exec(source.node.id); // Use regex to find a match
            if (m !== null) { // if we found a match
                const matchSuffix = parseInt(m[1], 10); // get the suffix for that match (as integer)
                if (matchSuffix >= nextSuffix) { // check if the match suffix is larger or equal to currently proposed suffix
                    nextSuffix = matchSuffix + 1; // increment the suffix
                }
            }
        }
        return `TokenSubscription:${nextSuffix}`;
    }
}
exports.TopicBase = TopicBase;
_a = JSII_RTTI_SYMBOL_1;
TopicBase[_a] = { fqn: "@aws-cdk/aws-sns.TopicBase", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9waWMtYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRvcGljLWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esd0NBQXdDO0FBQ3hDLHdDQUEwRTtBQUcxRSxxQ0FBdUM7QUFFdkMsaURBQThDO0FBK0M5Qzs7R0FFRztBQUNILE1BQXNCLFNBQVUsU0FBUSxlQUFRO0lBZ0I5QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQXVCLEVBQUU7UUFDakUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMseUJBQXlCLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ3RHO0lBRUQ7O09BRUc7SUFDSSxlQUFlLENBQUMsaUJBQXFDOzs7Ozs7Ozs7O1FBQzFELE1BQU0sa0JBQWtCLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXhELE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUM7UUFDekQsSUFBSSxFQUFFLEdBQUcsa0JBQWtCLENBQUMsWUFBWSxDQUFDO1FBQ3pDLElBQUksWUFBSyxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUN2RCxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM5QjtRQUVELHFFQUFxRTtRQUNyRSw4REFBOEQ7UUFDOUQsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixFQUFFLG9DQUFvQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7U0FDckc7UUFFRCxNQUFNLFlBQVksR0FBRyxJQUFJLDJCQUFZLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUMvQyxLQUFLLEVBQUUsSUFBSTtZQUNYLEdBQUcsa0JBQWtCO1NBQ3RCLENBQUMsQ0FBQztRQUVILHdFQUF3RTtRQUN4RSxvRUFBb0U7UUFDcEUsSUFBSSxrQkFBa0IsQ0FBQyxzQkFBc0IsRUFBRTtZQUM3QyxZQUFZLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQzVFO1FBRUQsT0FBTyxZQUFZLENBQUM7S0FDckI7SUFFRDs7Ozs7O09BTUc7SUFDSSxtQkFBbUIsQ0FBQyxTQUE4QjtRQUN2RCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDekMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLG9CQUFXLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNuRTtRQUVELElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM5QyxPQUFPLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDaEU7UUFDRCxPQUFPLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxDQUFDO0tBQ2xDO0lBRUQ7O09BRUc7SUFDSSxZQUFZLENBQUMsT0FBdUI7UUFDekMsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDO1lBQ3hDLE9BQU87WUFDUCxPQUFPLEVBQUUsQ0FBQyxhQUFhLENBQUM7WUFDeEIsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUM3QixRQUFRLEVBQUUsSUFBSTtTQUNmLENBQUMsQ0FBQztLQUNKO0lBRUQ7OztPQUdHO0lBQ0ksNEJBQTRCLENBQUMsTUFBNEI7UUFDOUQsb0VBQW9FO1FBQ3BFLDhFQUE4RTtRQUM5RSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLHNDQUFzQyxDQUFDLENBQUMsQ0FBQztRQUNwRixPQUFPO1lBQ0wsVUFBVSxFQUFFLEtBQUs7WUFDakIsYUFBYSxFQUFFLElBQUksQ0FBQyxRQUFRO1NBQzdCLENBQUM7S0FDSDtJQUVPLFdBQVcsQ0FBQyxLQUFnQjtRQUNsQyxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDbkIsTUFBTSxFQUFFLEdBQUcsNkJBQTZCLENBQUM7UUFDekMsdURBQXVEO1FBQ3ZELDBEQUEwRDtRQUMxRCxLQUFLLE1BQU0sTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDekMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsNEJBQTRCO1lBQy9ELElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxFQUFFLHNCQUFzQjtnQkFDdEMsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLDZDQUE2QztnQkFDckYsSUFBSSxXQUFXLElBQUksVUFBVSxFQUFFLEVBQUUsNEVBQTRFO29CQUMzRyxVQUFVLEdBQUcsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLHVCQUF1QjtpQkFDdEQ7YUFDRjtTQUNGO1FBQ0QsT0FBTyxxQkFBcUIsVUFBVSxFQUFFLENBQUM7S0FDMUM7O0FBbEhILDhCQW9IQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIG5vdGlmaWNhdGlvbnMgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVzdGFybm90aWZpY2F0aW9ucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBJUmVzb3VyY2UsIFJlc291cmNlLCBSZXNvdXJjZVByb3BzLCBUb2tlbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY29uc3RydWN0cyBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgVG9waWNQb2xpY3kgfSBmcm9tICcuL3BvbGljeSc7XG5pbXBvcnQgeyBJVG9waWNTdWJzY3JpcHRpb24gfSBmcm9tICcuL3N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9zdWJzY3JpcHRpb24nO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gU05TIHRvcGljXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVRvcGljIGV4dGVuZHMgSVJlc291cmNlLCBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlVGFyZ2V0IHtcbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIHRvcGljXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IHRvcGljQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSB0b3BpY1xuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSB0b3BpY05hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogV2hldGhlciB0aGlzIHRvcGljIGlzIGFuIEFtYXpvbiBTTlMgRklGTyBxdWV1ZS4gSWYgZmFsc2UsIHRoaXMgaXMgYSBzdGFuZGFyZCB0b3BpYy5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgZmlmbzogYm9vbGVhbjtcblxuICAvKipcbiAgICogU3Vic2NyaWJlIHNvbWUgZW5kcG9pbnQgdG8gdGhpcyB0b3BpY1xuICAgKi9cbiAgYWRkU3Vic2NyaXB0aW9uKHN1YnNjcmlwdGlvbjogSVRvcGljU3Vic2NyaXB0aW9uKTogU3Vic2NyaXB0aW9uO1xuXG4gIC8qKlxuICAgKiBBZGRzIGEgc3RhdGVtZW50IHRvIHRoZSBJQU0gcmVzb3VyY2UgcG9saWN5IGFzc29jaWF0ZWQgd2l0aCB0aGlzIHRvcGljLlxuICAgKlxuICAgKiBJZiB0aGlzIHRvcGljIHdhcyBjcmVhdGVkIGluIHRoaXMgc3RhY2sgKGBuZXcgVG9waWNgKSwgYSB0b3BpYyBwb2xpY3lcbiAgICogd2lsbCBiZSBhdXRvbWF0aWNhbGx5IGNyZWF0ZWQgdXBvbiB0aGUgZmlyc3QgY2FsbCB0byBgYWRkVG9Qb2xpY3lgLiBJZlxuICAgKiB0aGUgdG9waWMgaXMgaW1wb3J0ZWQgKGBUb3BpYy5pbXBvcnRgKSwgdGhlbiB0aGlzIGlzIGEgbm8tb3AuXG4gICAqL1xuICBhZGRUb1Jlc291cmNlUG9saWN5KHN0YXRlbWVudDogaWFtLlBvbGljeVN0YXRlbWVudCk6IGlhbS5BZGRUb1Jlc291cmNlUG9saWN5UmVzdWx0O1xuXG4gIC8qKlxuICAgKiBHcmFudCB0b3BpYyBwdWJsaXNoaW5nIHBlcm1pc3Npb25zIHRvIHRoZSBnaXZlbiBpZGVudGl0eVxuICAgKi9cbiAgZ3JhbnRQdWJsaXNoKGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudDtcbn1cblxuLyoqXG4gKiBFaXRoZXIgYSBuZXcgb3IgaW1wb3J0ZWQgVG9waWNcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFRvcGljQmFzZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVRvcGljIHtcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHRvcGljQXJuOiBzdHJpbmc7XG5cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHRvcGljTmFtZTogc3RyaW5nO1xuXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBmaWZvOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBDb250cm9scyBhdXRvbWF0aWMgY3JlYXRpb24gb2YgcG9saWN5IG9iamVjdHMuXG4gICAqXG4gICAqIFNldCBieSBzdWJjbGFzc2VzLlxuICAgKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IGF1dG9DcmVhdGVQb2xpY3k6IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSBwb2xpY3k/OiBUb3BpY1BvbGljeTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUmVzb3VyY2VQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICB0aGlzLm5vZGUuYWRkVmFsaWRhdGlvbih7IHZhbGlkYXRlOiAoKSA9PiB0aGlzLnBvbGljeT8uZG9jdW1lbnQudmFsaWRhdGVGb3JSZXNvdXJjZVBvbGljeSgpID8/IFtdIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZSBzb21lIGVuZHBvaW50IHRvIHRoaXMgdG9waWNcbiAgICovXG4gIHB1YmxpYyBhZGRTdWJzY3JpcHRpb24odG9waWNTdWJzY3JpcHRpb246IElUb3BpY1N1YnNjcmlwdGlvbik6IFN1YnNjcmlwdGlvbiB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uQ29uZmlnID0gdG9waWNTdWJzY3JpcHRpb24uYmluZCh0aGlzKTtcblxuICAgIGNvbnN0IHNjb3BlID0gc3Vic2NyaXB0aW9uQ29uZmlnLnN1YnNjcmliZXJTY29wZSB8fCB0aGlzO1xuICAgIGxldCBpZCA9IHN1YnNjcmlwdGlvbkNvbmZpZy5zdWJzY3JpYmVySWQ7XG4gICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZChzdWJzY3JpcHRpb25Db25maWcuc3Vic2NyaWJlcklkKSkge1xuICAgICAgaWQgPSB0aGlzLm5leHRUb2tlbklkKHNjb3BlKTtcbiAgICB9XG5cbiAgICAvLyBXZSB1c2UgdGhlIHN1YnNjcmliZXIncyBpZCBhcyB0aGUgY29uc3RydWN0IGlkLiBUaGVyZSdzIG5vIG1lYW5pbmdcbiAgICAvLyB0byBzdWJzY3JpYmluZyB0aGUgc2FtZSBzdWJzY3JpYmVyIHR3aWNlIG9uIHRoZSBzYW1lIHRvcGljLlxuICAgIGlmIChzY29wZS5ub2RlLnRyeUZpbmRDaGlsZChpZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQSBzdWJzY3JpcHRpb24gd2l0aCBpZCBcIiR7aWR9XCIgYWxyZWFkeSBleGlzdHMgdW5kZXIgdGhlIHNjb3BlICR7c2NvcGUubm9kZS5wYXRofWApO1xuICAgIH1cblxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oc2NvcGUsIGlkLCB7XG4gICAgICB0b3BpYzogdGhpcyxcbiAgICAgIC4uLnN1YnNjcmlwdGlvbkNvbmZpZyxcbiAgICB9KTtcblxuICAgIC8vIEFkZCBkZXBlbmRlbmN5IGZvciB0aGUgc3Vic2NyaXB0aW9uLCBmb3IgZXhhbXBsZSBmb3IgU1FTIHN1YnNjcmlwdGlvblxuICAgIC8vIHRoZSBxdWV1ZSBwb2xpY3kgaGFzIHRvIGRlcGxveSBiZWZvcmUgdGhlIHN1YnNjcmlwdGlvbiBpcyBjcmVhdGVkXG4gICAgaWYgKHN1YnNjcmlwdGlvbkNvbmZpZy5zdWJzY3JpcHRpb25EZXBlbmRlbmN5KSB7XG4gICAgICBzdWJzY3JpcHRpb24ubm9kZS5hZGREZXBlbmRlbmN5KHN1YnNjcmlwdGlvbkNvbmZpZy5zdWJzY3JpcHRpb25EZXBlbmRlbmN5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBzdGF0ZW1lbnQgdG8gdGhlIElBTSByZXNvdXJjZSBwb2xpY3kgYXNzb2NpYXRlZCB3aXRoIHRoaXMgdG9waWMuXG4gICAqXG4gICAqIElmIHRoaXMgdG9waWMgd2FzIGNyZWF0ZWQgaW4gdGhpcyBzdGFjayAoYG5ldyBUb3BpY2ApLCBhIHRvcGljIHBvbGljeVxuICAgKiB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgY3JlYXRlZCB1cG9uIHRoZSBmaXJzdCBjYWxsIHRvIGBhZGRUb1BvbGljeWAuIElmXG4gICAqIHRoZSB0b3BpYyBpcyBpbXBvcnRlZCAoYFRvcGljLmltcG9ydGApLCB0aGVuIHRoaXMgaXMgYSBuby1vcC5cbiAgICovXG4gIHB1YmxpYyBhZGRUb1Jlc291cmNlUG9saWN5KHN0YXRlbWVudDogaWFtLlBvbGljeVN0YXRlbWVudCk6IGlhbS5BZGRUb1Jlc291cmNlUG9saWN5UmVzdWx0IHtcbiAgICBpZiAoIXRoaXMucG9saWN5ICYmIHRoaXMuYXV0b0NyZWF0ZVBvbGljeSkge1xuICAgICAgdGhpcy5wb2xpY3kgPSBuZXcgVG9waWNQb2xpY3kodGhpcywgJ1BvbGljeScsIHsgdG9waWNzOiBbdGhpc10gfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucG9saWN5KSB7XG4gICAgICB0aGlzLnBvbGljeS5kb2N1bWVudC5hZGRTdGF0ZW1lbnRzKHN0YXRlbWVudCk7XG4gICAgICByZXR1cm4geyBzdGF0ZW1lbnRBZGRlZDogdHJ1ZSwgcG9saWN5RGVwZW5kYWJsZTogdGhpcy5wb2xpY3kgfTtcbiAgICB9XG4gICAgcmV0dXJuIHsgc3RhdGVtZW50QWRkZWQ6IGZhbHNlIH07XG4gIH1cblxuICAvKipcbiAgICogR3JhbnQgdG9waWMgcHVibGlzaGluZyBwZXJtaXNzaW9ucyB0byB0aGUgZ2l2ZW4gaWRlbnRpdHlcbiAgICovXG4gIHB1YmxpYyBncmFudFB1Ymxpc2goZ3JhbnRlZTogaWFtLklHcmFudGFibGUpIHtcbiAgICByZXR1cm4gaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsT3JSZXNvdXJjZSh7XG4gICAgICBncmFudGVlLFxuICAgICAgYWN0aW9uczogWydzbnM6UHVibGlzaCddLFxuICAgICAgcmVzb3VyY2VBcm5zOiBbdGhpcy50b3BpY0Fybl0sXG4gICAgICByZXNvdXJjZTogdGhpcyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXByZXNlbnRzIGEgbm90aWZpY2F0aW9uIHRhcmdldFxuICAgKiBUaGF0IGFsbG93cyBTTlMgdG9waWMgdG8gYXNzb2NpYXRlIHdpdGggdGhpcyBydWxlIHRhcmdldC5cbiAgICovXG4gIHB1YmxpYyBiaW5kQXNOb3RpZmljYXRpb25SdWxlVGFyZ2V0KF9zY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QpOiBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGVUYXJnZXRDb25maWcge1xuICAgIC8vIFNOUyB0b3BpYyBuZWVkIHRvIGdyYW50IGNvZGVzdGFyLW5vdGlmaWNhdGlvbnMgc2VydmljZSB0byBwdWJsaXNoXG4gICAgLy8gQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZHRjb25zb2xlL2xhdGVzdC91c2VyZ3VpZGUvc2V0LXVwLXNucy5odG1sXG4gICAgdGhpcy5ncmFudFB1Ymxpc2gobmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdjb2Rlc3Rhci1ub3RpZmljYXRpb25zLmFtYXpvbmF3cy5jb20nKSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRhcmdldFR5cGU6ICdTTlMnLFxuICAgICAgdGFyZ2V0QWRkcmVzczogdGhpcy50b3BpY0FybixcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBuZXh0VG9rZW5JZChzY29wZTogQ29uc3RydWN0KSB7XG4gICAgbGV0IG5leHRTdWZmaXggPSAxO1xuICAgIGNvbnN0IHJlID0gL1Rva2VuU3Vic2NyaXB0aW9uOihbXFxkXSopL2dtO1xuICAgIC8vIFNlYXJjaCB0aHJvdWdoIHRoZSBjb25zdHJ1Y3QgYW5kIGFsbCBvZiBpdHMgY2hpbGRyZW5cbiAgICAvLyBmb3IgcHJldmlvdXMgc3Vic2NyaXB0aW9ucyB0aGF0IG1hdGNoIG91ciByZWdleCBwYXR0ZXJuXG4gICAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc2NvcGUubm9kZS5maW5kQWxsKCkpIHtcbiAgICAgIGNvbnN0IG0gPSByZS5leGVjKHNvdXJjZS5ub2RlLmlkKTsgLy8gVXNlIHJlZ2V4IHRvIGZpbmQgYSBtYXRjaFxuICAgICAgaWYgKG0gIT09IG51bGwpIHsgLy8gaWYgd2UgZm91bmQgYSBtYXRjaFxuICAgICAgICBjb25zdCBtYXRjaFN1ZmZpeCA9IHBhcnNlSW50KG1bMV0sIDEwKTsgLy8gZ2V0IHRoZSBzdWZmaXggZm9yIHRoYXQgbWF0Y2ggKGFzIGludGVnZXIpXG4gICAgICAgIGlmIChtYXRjaFN1ZmZpeCA+PSBuZXh0U3VmZml4KSB7IC8vIGNoZWNrIGlmIHRoZSBtYXRjaCBzdWZmaXggaXMgbGFyZ2VyIG9yIGVxdWFsIHRvIGN1cnJlbnRseSBwcm9wb3NlZCBzdWZmaXhcbiAgICAgICAgICBuZXh0U3VmZml4ID0gbWF0Y2hTdWZmaXggKyAxOyAvLyBpbmNyZW1lbnQgdGhlIHN1ZmZpeFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBgVG9rZW5TdWJzY3JpcHRpb246JHtuZXh0U3VmZml4fWA7XG4gIH1cblxufVxuIl19