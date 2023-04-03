"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqsSubscription = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const sns = require("@aws-cdk/aws-sns");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const constructs_1 = require("constructs");
/**
 * Use an SQS queue as a subscription target
 */
class SqsSubscription {
    constructor(queue, props = {}) {
        this.queue = queue;
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_sns_subscriptions_SqsSubscriptionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SqsSubscription);
            }
            throw error;
        }
    }
    /**
     * Returns a configuration for an SQS queue to subscribe to an SNS topic
     */
    bind(topic) {
        // Create subscription under *consuming* construct to make sure it ends up
        // in the correct stack in cases of cross-stack subscriptions.
        if (!(this.queue instanceof constructs_1.Construct)) {
            throw new Error('The supplied Queue object must be an instance of Construct');
        }
        const snsServicePrincipal = new iam.ServicePrincipal('sns.amazonaws.com');
        // add a statement to the queue resource policy which allows this topic
        // to send messages to the queue.
        const queuePolicyDependable = this.queue.addToResourcePolicy(new iam.PolicyStatement({
            resources: [this.queue.queueArn],
            actions: ['sqs:SendMessage'],
            principals: [snsServicePrincipal],
            conditions: {
                ArnEquals: { 'aws:SourceArn': topic.topicArn },
            },
        })).policyDependable;
        // if the queue is encrypted, add a statement to the key resource policy
        // which allows this topic to decrypt KMS keys
        if (this.queue.encryptionMasterKey) {
            this.queue.encryptionMasterKey.addToResourcePolicy(new iam.PolicyStatement({
                resources: ['*'],
                actions: ['kms:Decrypt', 'kms:GenerateDataKey'],
                principals: [snsServicePrincipal],
                conditions: core_1.FeatureFlags.of(topic).isEnabled(cxapi.SNS_SUBSCRIPTIONS_SQS_DECRYPTION_POLICY)
                    ? { ArnEquals: { 'aws:SourceArn': topic.topicArn } }
                    : undefined,
            }));
        }
        // if the topic and queue are created in different stacks
        // then we need to make sure the topic is created first
        if (topic instanceof sns.Topic && topic.stack !== this.queue.stack) {
            this.queue.stack.addDependency(topic.stack);
        }
        return {
            subscriberScope: this.queue,
            subscriberId: core_1.Names.nodeUniqueId(topic.node),
            endpoint: this.queue.queueArn,
            protocol: sns.SubscriptionProtocol.SQS,
            rawMessageDelivery: this.props.rawMessageDelivery,
            filterPolicy: this.props.filterPolicy,
            filterPolicyWithMessageBody: this.props.filterPolicyWithMessageBody,
            region: this.regionFromArn(topic),
            deadLetterQueue: this.props.deadLetterQueue,
            subscriptionDependency: queuePolicyDependable,
        };
    }
    regionFromArn(topic) {
        // no need to specify `region` for topics defined within the same stack
        if (topic instanceof sns.Topic) {
            if (topic.stack !== this.queue.stack) {
                // only if we know the region, will not work for
                // env agnostic stacks
                if (!core_1.Token.isUnresolved(topic.env.region) &&
                    (topic.env.region !== this.queue.env.region)) {
                    return topic.env.region;
                }
            }
            return undefined;
        }
        return core_1.Stack.of(topic).splitArn(topic.topicArn, core_1.ArnFormat.SLASH_RESOURCE_NAME).region;
    }
}
exports.SqsSubscription = SqsSubscription;
_a = JSII_RTTI_SYMBOL_1;
SqsSubscription[_a] = { fqn: "@aws-cdk/aws-sns-subscriptions.SqsSubscription", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3FzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3FzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFFeEMsd0NBQTZFO0FBQzdFLHlDQUF5QztBQUN6QywyQ0FBdUM7QUFpQnZDOztHQUVHO0FBQ0gsTUFBYSxlQUFlO0lBQzFCLFlBQTZCLEtBQWlCLEVBQW1CLFFBQThCLEVBQUU7UUFBcEUsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUFtQixVQUFLLEdBQUwsS0FBSyxDQUEyQjs7Ozs7OytDQUR0RixlQUFlOzs7O0tBRXpCO0lBRUQ7O09BRUc7SUFDSSxJQUFJLENBQUMsS0FBaUI7UUFDM0IsMEVBQTBFO1FBQzFFLDhEQUE4RDtRQUM5RCxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxZQUFZLHNCQUFTLENBQUMsRUFBRTtZQUN0QyxNQUFNLElBQUksS0FBSyxDQUFDLDREQUE0RCxDQUFDLENBQUM7U0FDL0U7UUFDRCxNQUFNLG1CQUFtQixHQUFHLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFFMUUsdUVBQXVFO1FBQ3ZFLGlDQUFpQztRQUNqQyxNQUFNLHFCQUFxQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ25GLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO1lBQ2hDLE9BQU8sRUFBRSxDQUFDLGlCQUFpQixDQUFDO1lBQzVCLFVBQVUsRUFBRSxDQUFDLG1CQUFtQixDQUFDO1lBQ2pDLFVBQVUsRUFBRTtnQkFDVixTQUFTLEVBQUUsRUFBRSxlQUFlLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRTthQUMvQztTQUNGLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDO1FBRXJCLHdFQUF3RTtRQUN4RSw4Q0FBOEM7UUFDOUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixFQUFFO1lBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsbUJBQW1CLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO2dCQUN6RSxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7Z0JBQ2hCLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBRSxxQkFBcUIsQ0FBQztnQkFDL0MsVUFBVSxFQUFFLENBQUMsbUJBQW1CLENBQUM7Z0JBQ2pDLFVBQVUsRUFBRSxtQkFBWSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLHVDQUF1QyxDQUFDO29CQUN6RixDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRSxlQUFlLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFFO29CQUNwRCxDQUFDLENBQUMsU0FBUzthQUNkLENBQUMsQ0FBQyxDQUFDO1NBQ0w7UUFFRCx5REFBeUQ7UUFDekQsdURBQXVEO1FBQ3ZELElBQUksS0FBSyxZQUFZLEdBQUcsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtZQUNsRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdDO1FBRUQsT0FBTztZQUNMLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSztZQUMzQixZQUFZLEVBQUUsWUFBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQzVDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVE7WUFDN0IsUUFBUSxFQUFFLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHO1lBQ3RDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCO1lBQ2pELFlBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVk7WUFDckMsMkJBQTJCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQywyQkFBMkI7WUFDbkUsTUFBTSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO1lBQ2pDLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWU7WUFDM0Msc0JBQXNCLEVBQUUscUJBQXFCO1NBQzlDLENBQUM7S0FDSDtJQUVPLGFBQWEsQ0FBQyxLQUFpQjtRQUNyQyx1RUFBdUU7UUFDdkUsSUFBSSxLQUFLLFlBQVksR0FBRyxDQUFDLEtBQUssRUFBRTtZQUM5QixJQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7Z0JBQ3BDLGdEQUFnRDtnQkFDaEQsc0JBQXNCO2dCQUN0QixJQUFJLENBQUMsWUFBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztvQkFDdkMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtvQkFDOUMsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztpQkFDekI7YUFDRjtZQUNELE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBQ0QsT0FBTyxZQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLGdCQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxNQUFNLENBQUM7S0FDdkY7O0FBekVILDBDQTBFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIHNucyBmcm9tICdAYXdzLWNkay9hd3Mtc25zJztcbmltcG9ydCAqIGFzIHNxcyBmcm9tICdAYXdzLWNkay9hd3Mtc3FzJztcbmltcG9ydCB7IEFybkZvcm1hdCwgRmVhdHVyZUZsYWdzLCBOYW1lcywgU3RhY2ssIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb25Qcm9wcyB9IGZyb20gJy4vc3Vic2NyaXB0aW9uJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhbiBTUVMgc3Vic2NyaXB0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3FzU3Vic2NyaXB0aW9uUHJvcHMgZXh0ZW5kcyBTdWJzY3JpcHRpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbWVzc2FnZSB0byB0aGUgcXVldWUgaXMgdGhlIHNhbWUgYXMgaXQgd2FzIHNlbnQgdG8gdGhlIHRvcGljXG4gICAqXG4gICAqIElmIGZhbHNlLCB0aGUgbWVzc2FnZSB3aWxsIGJlIHdyYXBwZWQgaW4gYW4gU05TIGVudmVsb3BlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcmF3TWVzc2FnZURlbGl2ZXJ5PzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBVc2UgYW4gU1FTIHF1ZXVlIGFzIGEgc3Vic2NyaXB0aW9uIHRhcmdldFxuICovXG5leHBvcnQgY2xhc3MgU3FzU3Vic2NyaXB0aW9uIGltcGxlbWVudHMgc25zLklUb3BpY1N1YnNjcmlwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcXVldWU6IHNxcy5JUXVldWUsIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IFNxc1N1YnNjcmlwdGlvblByb3BzID0ge30pIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgY29uZmlndXJhdGlvbiBmb3IgYW4gU1FTIHF1ZXVlIHRvIHN1YnNjcmliZSB0byBhbiBTTlMgdG9waWNcbiAgICovXG4gIHB1YmxpYyBiaW5kKHRvcGljOiBzbnMuSVRvcGljKTogc25zLlRvcGljU3Vic2NyaXB0aW9uQ29uZmlnIHtcbiAgICAvLyBDcmVhdGUgc3Vic2NyaXB0aW9uIHVuZGVyICpjb25zdW1pbmcqIGNvbnN0cnVjdCB0byBtYWtlIHN1cmUgaXQgZW5kcyB1cFxuICAgIC8vIGluIHRoZSBjb3JyZWN0IHN0YWNrIGluIGNhc2VzIG9mIGNyb3NzLXN0YWNrIHN1YnNjcmlwdGlvbnMuXG4gICAgaWYgKCEodGhpcy5xdWV1ZSBpbnN0YW5jZW9mIENvbnN0cnVjdCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHN1cHBsaWVkIFF1ZXVlIG9iamVjdCBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIENvbnN0cnVjdCcpO1xuICAgIH1cbiAgICBjb25zdCBzbnNTZXJ2aWNlUHJpbmNpcGFsID0gbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpO1xuXG4gICAgLy8gYWRkIGEgc3RhdGVtZW50IHRvIHRoZSBxdWV1ZSByZXNvdXJjZSBwb2xpY3kgd2hpY2ggYWxsb3dzIHRoaXMgdG9waWNcbiAgICAvLyB0byBzZW5kIG1lc3NhZ2VzIHRvIHRoZSBxdWV1ZS5cbiAgICBjb25zdCBxdWV1ZVBvbGljeURlcGVuZGFibGUgPSB0aGlzLnF1ZXVlLmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbdGhpcy5xdWV1ZS5xdWV1ZUFybl0sXG4gICAgICBhY3Rpb25zOiBbJ3NxczpTZW5kTWVzc2FnZSddLFxuICAgICAgcHJpbmNpcGFsczogW3Nuc1NlcnZpY2VQcmluY2lwYWxdLFxuICAgICAgY29uZGl0aW9uczoge1xuICAgICAgICBBcm5FcXVhbHM6IHsgJ2F3czpTb3VyY2VBcm4nOiB0b3BpYy50b3BpY0FybiB9LFxuICAgICAgfSxcbiAgICB9KSkucG9saWN5RGVwZW5kYWJsZTtcblxuICAgIC8vIGlmIHRoZSBxdWV1ZSBpcyBlbmNyeXB0ZWQsIGFkZCBhIHN0YXRlbWVudCB0byB0aGUga2V5IHJlc291cmNlIHBvbGljeVxuICAgIC8vIHdoaWNoIGFsbG93cyB0aGlzIHRvcGljIHRvIGRlY3J5cHQgS01TIGtleXNcbiAgICBpZiAodGhpcy5xdWV1ZS5lbmNyeXB0aW9uTWFzdGVyS2V5KSB7XG4gICAgICB0aGlzLnF1ZXVlLmVuY3J5cHRpb25NYXN0ZXJLZXkuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgIGFjdGlvbnM6IFsna21zOkRlY3J5cHQnLCAna21zOkdlbmVyYXRlRGF0YUtleSddLFxuICAgICAgICBwcmluY2lwYWxzOiBbc25zU2VydmljZVByaW5jaXBhbF0sXG4gICAgICAgIGNvbmRpdGlvbnM6IEZlYXR1cmVGbGFncy5vZih0b3BpYykuaXNFbmFibGVkKGN4YXBpLlNOU19TVUJTQ1JJUFRJT05TX1NRU19ERUNSWVBUSU9OX1BPTElDWSlcbiAgICAgICAgICA/IHsgQXJuRXF1YWxzOiB7ICdhd3M6U291cmNlQXJuJzogdG9waWMudG9waWNBcm4gfSB9XG4gICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgLy8gaWYgdGhlIHRvcGljIGFuZCBxdWV1ZSBhcmUgY3JlYXRlZCBpbiBkaWZmZXJlbnQgc3RhY2tzXG4gICAgLy8gdGhlbiB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB0aGUgdG9waWMgaXMgY3JlYXRlZCBmaXJzdFxuICAgIGlmICh0b3BpYyBpbnN0YW5jZW9mIHNucy5Ub3BpYyAmJiB0b3BpYy5zdGFjayAhPT0gdGhpcy5xdWV1ZS5zdGFjaykge1xuICAgICAgdGhpcy5xdWV1ZS5zdGFjay5hZGREZXBlbmRlbmN5KHRvcGljLnN0YWNrKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc3Vic2NyaWJlclNjb3BlOiB0aGlzLnF1ZXVlLFxuICAgICAgc3Vic2NyaWJlcklkOiBOYW1lcy5ub2RlVW5pcXVlSWQodG9waWMubm9kZSksXG4gICAgICBlbmRwb2ludDogdGhpcy5xdWV1ZS5xdWV1ZUFybixcbiAgICAgIHByb3RvY29sOiBzbnMuU3Vic2NyaXB0aW9uUHJvdG9jb2wuU1FTLFxuICAgICAgcmF3TWVzc2FnZURlbGl2ZXJ5OiB0aGlzLnByb3BzLnJhd01lc3NhZ2VEZWxpdmVyeSxcbiAgICAgIGZpbHRlclBvbGljeTogdGhpcy5wcm9wcy5maWx0ZXJQb2xpY3ksXG4gICAgICBmaWx0ZXJQb2xpY3lXaXRoTWVzc2FnZUJvZHk6IHRoaXMucHJvcHMuZmlsdGVyUG9saWN5V2l0aE1lc3NhZ2VCb2R5LFxuICAgICAgcmVnaW9uOiB0aGlzLnJlZ2lvbkZyb21Bcm4odG9waWMpLFxuICAgICAgZGVhZExldHRlclF1ZXVlOiB0aGlzLnByb3BzLmRlYWRMZXR0ZXJRdWV1ZSxcbiAgICAgIHN1YnNjcmlwdGlvbkRlcGVuZGVuY3k6IHF1ZXVlUG9saWN5RGVwZW5kYWJsZSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSByZWdpb25Gcm9tQXJuKHRvcGljOiBzbnMuSVRvcGljKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAvLyBubyBuZWVkIHRvIHNwZWNpZnkgYHJlZ2lvbmAgZm9yIHRvcGljcyBkZWZpbmVkIHdpdGhpbiB0aGUgc2FtZSBzdGFja1xuICAgIGlmICh0b3BpYyBpbnN0YW5jZW9mIHNucy5Ub3BpYykge1xuICAgICAgaWYgKHRvcGljLnN0YWNrICE9PSB0aGlzLnF1ZXVlLnN0YWNrKSB7XG4gICAgICAgIC8vIG9ubHkgaWYgd2Uga25vdyB0aGUgcmVnaW9uLCB3aWxsIG5vdCB3b3JrIGZvclxuICAgICAgICAvLyBlbnYgYWdub3N0aWMgc3RhY2tzXG4gICAgICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKHRvcGljLmVudi5yZWdpb24pICYmXG4gICAgICAgICAgKHRvcGljLmVudi5yZWdpb24gIT09IHRoaXMucXVldWUuZW52LnJlZ2lvbikpIHtcbiAgICAgICAgICByZXR1cm4gdG9waWMuZW52LnJlZ2lvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIFN0YWNrLm9mKHRvcGljKS5zcGxpdEFybih0b3BpYy50b3BpY0FybiwgQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUpLnJlZ2lvbjtcbiAgfVxufVxuIl19