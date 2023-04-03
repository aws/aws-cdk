"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaSubscription = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const sns = require("@aws-cdk/aws-sns");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
/**
 * Use a Lambda function as a subscription target
 */
class LambdaSubscription {
    constructor(fn, props = {}) {
        this.fn = fn;
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_sns_subscriptions_LambdaSubscriptionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, LambdaSubscription);
            }
            throw error;
        }
    }
    /**
     * Returns a configuration for a Lambda function to subscribe to an SNS topic
     */
    bind(topic) {
        // Create subscription under *consuming* construct to make sure it ends up
        // in the correct stack in cases of cross-stack subscriptions.
        if (!(this.fn instanceof constructs_1.Construct)) {
            throw new Error('The supplied lambda Function object must be an instance of Construct');
        }
        this.fn.addPermission(`AllowInvoke:${core_1.Names.nodeUniqueId(topic.node)}`, {
            sourceArn: topic.topicArn,
            principal: new iam.ServicePrincipal('sns.amazonaws.com'),
        });
        // if the topic and function are created in different stacks
        // then we need to make sure the topic is created first
        if (topic instanceof sns.Topic && topic.stack !== this.fn.stack) {
            this.fn.stack.addDependency(topic.stack);
        }
        return {
            subscriberScope: this.fn,
            subscriberId: topic.node.id,
            endpoint: this.fn.functionArn,
            protocol: sns.SubscriptionProtocol.LAMBDA,
            filterPolicy: this.props.filterPolicy,
            filterPolicyWithMessageBody: this.props.filterPolicyWithMessageBody,
            region: this.regionFromArn(topic),
            deadLetterQueue: this.props.deadLetterQueue,
        };
    }
    regionFromArn(topic) {
        // no need to specify `region` for topics defined within the same stack.
        if (topic instanceof sns.Topic) {
            if (topic.stack !== this.fn.stack) {
                // only if we know the region, will not work for
                // env agnostic stacks
                if (!core_1.Token.isUnresolved(topic.env.region) &&
                    (topic.env.region !== this.fn.env.region)) {
                    return topic.env.region;
                }
            }
            return undefined;
        }
        return core_1.Stack.of(topic).splitArn(topic.topicArn, core_1.ArnFormat.SLASH_RESOURCE_NAME).region;
    }
}
exports.LambdaSubscription = LambdaSubscription;
_a = JSII_RTTI_SYMBOL_1;
LambdaSubscription[_a] = { fqn: "@aws-cdk/aws-sns-subscriptions.LambdaSubscription", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGFtYmRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUV4Qyx3Q0FBd0M7QUFDeEMsd0NBQStEO0FBQy9ELDJDQUF1QztBQVN2Qzs7R0FFRztBQUNILE1BQWEsa0JBQWtCO0lBQzdCLFlBQTZCLEVBQW9CLEVBQW1CLFFBQWlDLEVBQUU7UUFBMUUsT0FBRSxHQUFGLEVBQUUsQ0FBa0I7UUFBbUIsVUFBSyxHQUFMLEtBQUssQ0FBOEI7Ozs7OzsrQ0FENUYsa0JBQWtCOzs7O0tBRTVCO0lBRUQ7O09BRUc7SUFDSSxJQUFJLENBQUMsS0FBaUI7UUFDM0IsMEVBQTBFO1FBQzFFLDhEQUE4RDtRQUM5RCxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxZQUFZLHNCQUFTLENBQUMsRUFBRTtZQUNuQyxNQUFNLElBQUksS0FBSyxDQUFDLHNFQUFzRSxDQUFDLENBQUM7U0FDekY7UUFFRCxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxlQUFlLFlBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUU7WUFDckUsU0FBUyxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3pCLFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQztTQUN6RCxDQUFDLENBQUM7UUFFSCw0REFBNEQ7UUFDNUQsdURBQXVEO1FBQ3ZELElBQUksS0FBSyxZQUFZLEdBQUcsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRTtZQUMvRCxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzFDO1FBRUQsT0FBTztZQUNMLGVBQWUsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUN4QixZQUFZLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzNCLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVc7WUFDN0IsUUFBUSxFQUFFLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNO1lBQ3pDLFlBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVk7WUFDckMsMkJBQTJCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQywyQkFBMkI7WUFDbkUsTUFBTSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO1lBQ2pDLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWU7U0FDNUMsQ0FBQztLQUNIO0lBRU8sYUFBYSxDQUFDLEtBQWlCO1FBQ3JDLHdFQUF3RTtRQUN4RSxJQUFJLEtBQUssWUFBWSxHQUFHLENBQUMsS0FBSyxFQUFFO1lBQzlCLElBQUksS0FBSyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRTtnQkFDakMsZ0RBQWdEO2dCQUNoRCxzQkFBc0I7Z0JBQ3RCLElBQUksQ0FBQyxZQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO29CQUN2QyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUMzQyxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO2lCQUN6QjthQUNGO1lBQ0QsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFDRCxPQUFPLFlBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsZ0JBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQztLQUN2Rjs7QUFuREgsZ0RBb0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgc25zIGZyb20gJ0Bhd3MtY2RrL2F3cy1zbnMnO1xuaW1wb3J0IHsgQXJuRm9ybWF0LCBOYW1lcywgU3RhY2ssIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvblByb3BzIH0gZnJvbSAnLi9zdWJzY3JpcHRpb24nO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgTGFtYmRhIHN1YnNjcmlwdGlvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIExhbWJkYVN1YnNjcmlwdGlvblByb3BzIGV4dGVuZHMgU3Vic2NyaXB0aW9uUHJvcHMge1xuXG59XG4vKipcbiAqIFVzZSBhIExhbWJkYSBmdW5jdGlvbiBhcyBhIHN1YnNjcmlwdGlvbiB0YXJnZXRcbiAqL1xuZXhwb3J0IGNsYXNzIExhbWJkYVN1YnNjcmlwdGlvbiBpbXBsZW1lbnRzIHNucy5JVG9waWNTdWJzY3JpcHRpb24ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGZuOiBsYW1iZGEuSUZ1bmN0aW9uLCBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBMYW1iZGFTdWJzY3JpcHRpb25Qcm9wcyA9IHt9KSB7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGNvbmZpZ3VyYXRpb24gZm9yIGEgTGFtYmRhIGZ1bmN0aW9uIHRvIHN1YnNjcmliZSB0byBhbiBTTlMgdG9waWNcbiAgICovXG4gIHB1YmxpYyBiaW5kKHRvcGljOiBzbnMuSVRvcGljKTogc25zLlRvcGljU3Vic2NyaXB0aW9uQ29uZmlnIHtcbiAgICAvLyBDcmVhdGUgc3Vic2NyaXB0aW9uIHVuZGVyICpjb25zdW1pbmcqIGNvbnN0cnVjdCB0byBtYWtlIHN1cmUgaXQgZW5kcyB1cFxuICAgIC8vIGluIHRoZSBjb3JyZWN0IHN0YWNrIGluIGNhc2VzIG9mIGNyb3NzLXN0YWNrIHN1YnNjcmlwdGlvbnMuXG4gICAgaWYgKCEodGhpcy5mbiBpbnN0YW5jZW9mIENvbnN0cnVjdCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHN1cHBsaWVkIGxhbWJkYSBGdW5jdGlvbiBvYmplY3QgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiBDb25zdHJ1Y3QnKTtcbiAgICB9XG5cbiAgICB0aGlzLmZuLmFkZFBlcm1pc3Npb24oYEFsbG93SW52b2tlOiR7TmFtZXMubm9kZVVuaXF1ZUlkKHRvcGljLm5vZGUpfWAsIHtcbiAgICAgIHNvdXJjZUFybjogdG9waWMudG9waWNBcm4sXG4gICAgICBwcmluY2lwYWw6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcblxuICAgIC8vIGlmIHRoZSB0b3BpYyBhbmQgZnVuY3Rpb24gYXJlIGNyZWF0ZWQgaW4gZGlmZmVyZW50IHN0YWNrc1xuICAgIC8vIHRoZW4gd2UgbmVlZCB0byBtYWtlIHN1cmUgdGhlIHRvcGljIGlzIGNyZWF0ZWQgZmlyc3RcbiAgICBpZiAodG9waWMgaW5zdGFuY2VvZiBzbnMuVG9waWMgJiYgdG9waWMuc3RhY2sgIT09IHRoaXMuZm4uc3RhY2spIHtcbiAgICAgIHRoaXMuZm4uc3RhY2suYWRkRGVwZW5kZW5jeSh0b3BpYy5zdGFjayk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHN1YnNjcmliZXJTY29wZTogdGhpcy5mbixcbiAgICAgIHN1YnNjcmliZXJJZDogdG9waWMubm9kZS5pZCxcbiAgICAgIGVuZHBvaW50OiB0aGlzLmZuLmZ1bmN0aW9uQXJuLFxuICAgICAgcHJvdG9jb2w6IHNucy5TdWJzY3JpcHRpb25Qcm90b2NvbC5MQU1CREEsXG4gICAgICBmaWx0ZXJQb2xpY3k6IHRoaXMucHJvcHMuZmlsdGVyUG9saWN5LFxuICAgICAgZmlsdGVyUG9saWN5V2l0aE1lc3NhZ2VCb2R5OiB0aGlzLnByb3BzLmZpbHRlclBvbGljeVdpdGhNZXNzYWdlQm9keSxcbiAgICAgIHJlZ2lvbjogdGhpcy5yZWdpb25Gcm9tQXJuKHRvcGljKSxcbiAgICAgIGRlYWRMZXR0ZXJRdWV1ZTogdGhpcy5wcm9wcy5kZWFkTGV0dGVyUXVldWUsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgcmVnaW9uRnJvbUFybih0b3BpYzogc25zLklUb3BpYyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgLy8gbm8gbmVlZCB0byBzcGVjaWZ5IGByZWdpb25gIGZvciB0b3BpY3MgZGVmaW5lZCB3aXRoaW4gdGhlIHNhbWUgc3RhY2suXG4gICAgaWYgKHRvcGljIGluc3RhbmNlb2Ygc25zLlRvcGljKSB7XG4gICAgICBpZiAodG9waWMuc3RhY2sgIT09IHRoaXMuZm4uc3RhY2spIHtcbiAgICAgICAgLy8gb25seSBpZiB3ZSBrbm93IHRoZSByZWdpb24sIHdpbGwgbm90IHdvcmsgZm9yXG4gICAgICAgIC8vIGVudiBhZ25vc3RpYyBzdGFja3NcbiAgICAgICAgaWYgKCFUb2tlbi5pc1VucmVzb2x2ZWQodG9waWMuZW52LnJlZ2lvbikgJiZcbiAgICAgICAgICAodG9waWMuZW52LnJlZ2lvbiAhPT0gdGhpcy5mbi5lbnYucmVnaW9uKSkge1xuICAgICAgICAgIHJldHVybiB0b3BpYy5lbnYucmVnaW9uO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gU3RhY2sub2YodG9waWMpLnNwbGl0QXJuKHRvcGljLnRvcGljQXJuLCBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRSkucmVnaW9uO1xuICB9XG59XG4iXX0=