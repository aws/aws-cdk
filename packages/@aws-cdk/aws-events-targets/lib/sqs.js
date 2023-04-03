"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqsQueue = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const util_1 = require("./util");
/**
 * Use an SQS Queue as a target for Amazon EventBridge rules.
 *
 * @example
 *   /// fixture=withRepoAndSqsQueue
 *   // publish to an SQS queue every time code is committed
 *   // to a CodeCommit repository
 *   repository.onCommit('onCommit', { target: new targets.SqsQueue(queue) });
 *
 */
class SqsQueue {
    constructor(queue, props = {}) {
        this.queue = queue;
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_targets_SqsQueueProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SqsQueue);
            }
            throw error;
        }
        if (props.messageGroupId !== undefined && !queue.fifo) {
            throw new Error('messageGroupId cannot be specified for non-FIFO queues');
        }
    }
    /**
     * Returns a RuleTarget that can be used to trigger this SQS queue as a
     * result from an EventBridge event.
     *
     * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/resource-based-policies-eventbridge.html#sqs-permissions
     */
    bind(rule, _id) {
        const restrictToSameAccount = core_1.FeatureFlags.of(rule).isEnabled(cxapi.EVENTS_TARGET_QUEUE_SAME_ACCOUNT);
        let conditions = {};
        if (!this.queue.encryptionMasterKey) {
            conditions = {
                ArnEquals: { 'aws:SourceArn': rule.ruleArn },
            };
        }
        else if (restrictToSameAccount) {
            // Add only the account id as a condition, to avoid circular dependency. See issue #11158.
            conditions = {
                StringEquals: { 'aws:SourceAccount': rule.env.account },
            };
        }
        // deduplicated automatically
        this.queue.grantSendMessages(new iam.ServicePrincipal('events.amazonaws.com', { conditions }));
        if (this.props.deadLetterQueue) {
            util_1.addToDeadLetterQueueResourcePolicy(rule, this.props.deadLetterQueue);
        }
        return {
            ...util_1.bindBaseTargetConfig(this.props),
            arn: this.queue.queueArn,
            input: this.props.message,
            targetResource: this.queue,
            sqsParameters: this.props.messageGroupId ? { messageGroupId: this.props.messageGroupId } : undefined,
        };
    }
}
exports.SqsQueue = SqsQueue;
_a = JSII_RTTI_SYMBOL_1;
SqsQueue[_a] = { fqn: "@aws-cdk/aws-events-targets.SqsQueue", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3FzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3FzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHdDQUF3QztBQUV4Qyx3Q0FBNkM7QUFDN0MseUNBQXlDO0FBQ3pDLGlDQUFtRztBQTBCbkc7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBYSxRQUFRO0lBRW5CLFlBQTRCLEtBQWlCLEVBQW1CLFFBQXVCLEVBQUU7UUFBN0QsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUFtQixVQUFLLEdBQUwsS0FBSyxDQUFvQjs7Ozs7OytDQUY5RSxRQUFROzs7O1FBR2pCLElBQUksS0FBSyxDQUFDLGNBQWMsS0FBSyxTQUFTLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO1lBQ3JELE1BQU0sSUFBSSxLQUFLLENBQUMsd0RBQXdELENBQUMsQ0FBQztTQUMzRTtLQUNGO0lBRUQ7Ozs7O09BS0c7SUFDSSxJQUFJLENBQUMsSUFBa0IsRUFBRSxHQUFZO1FBQzFDLE1BQU0scUJBQXFCLEdBQUcsbUJBQVksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1FBRXRHLElBQUksVUFBVSxHQUFRLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsRUFBRTtZQUNuQyxVQUFVLEdBQUc7Z0JBQ1gsU0FBUyxFQUFFLEVBQUUsZUFBZSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUU7YUFDN0MsQ0FBQztTQUNIO2FBQU0sSUFBSSxxQkFBcUIsRUFBRTtZQUNoQywwRkFBMEY7WUFDMUYsVUFBVSxHQUFHO2dCQUNYLFlBQVksRUFBRSxFQUFFLG1CQUFtQixFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFO2FBQ3hELENBQUM7U0FDSDtRQUVELDZCQUE2QjtRQUM3QixJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLHNCQUFzQixFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRS9GLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUU7WUFDOUIseUNBQWtDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDdEU7UUFFRCxPQUFPO1lBQ0wsR0FBRywyQkFBb0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ25DLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVE7WUFDeEIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTztZQUN6QixjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDMUIsYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTO1NBQ3JHLENBQUM7S0FDSDs7QUEzQ0gsNEJBNkNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1ldmVudHMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgc3FzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zcXMnO1xuaW1wb3J0IHsgRmVhdHVyZUZsYWdzIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgYWRkVG9EZWFkTGV0dGVyUXVldWVSZXNvdXJjZVBvbGljeSwgVGFyZ2V0QmFzZVByb3BzLCBiaW5kQmFzZVRhcmdldENvbmZpZyB9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogQ3VzdG9taXplIHRoZSBTUVMgUXVldWUgRXZlbnQgVGFyZ2V0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3FzUXVldWVQcm9wcyBleHRlbmRzIFRhcmdldEJhc2VQcm9wcyB7XG5cbiAgLyoqXG4gICAqIE1lc3NhZ2UgR3JvdXAgSUQgZm9yIG1lc3NhZ2VzIHNlbnQgdG8gdGhpcyBxdWV1ZVxuICAgKlxuICAgKiBSZXF1aXJlZCBmb3IgRklGTyBxdWV1ZXMsIGxlYXZlIGVtcHR5IGZvciByZWd1bGFyIHF1ZXVlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBtZXNzYWdlIGdyb3VwIElEIChyZWd1bGFyIHF1ZXVlKVxuICAgKi9cbiAgcmVhZG9ubHkgbWVzc2FnZUdyb3VwSWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBtZXNzYWdlIHRvIHNlbmQgdG8gdGhlIHF1ZXVlLlxuICAgKlxuICAgKiBNdXN0IGJlIGEgdmFsaWQgSlNPTiB0ZXh0IHBhc3NlZCB0byB0aGUgdGFyZ2V0IHF1ZXVlLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0aGUgZW50aXJlIEV2ZW50QnJpZGdlIGV2ZW50XG4gICAqL1xuICByZWFkb25seSBtZXNzYWdlPzogZXZlbnRzLlJ1bGVUYXJnZXRJbnB1dDtcbn1cblxuLyoqXG4gKiBVc2UgYW4gU1FTIFF1ZXVlIGFzIGEgdGFyZ2V0IGZvciBBbWF6b24gRXZlbnRCcmlkZ2UgcnVsZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqICAgLy8vIGZpeHR1cmU9d2l0aFJlcG9BbmRTcXNRdWV1ZVxuICogICAvLyBwdWJsaXNoIHRvIGFuIFNRUyBxdWV1ZSBldmVyeSB0aW1lIGNvZGUgaXMgY29tbWl0dGVkXG4gKiAgIC8vIHRvIGEgQ29kZUNvbW1pdCByZXBvc2l0b3J5XG4gKiAgIHJlcG9zaXRvcnkub25Db21taXQoJ29uQ29tbWl0JywgeyB0YXJnZXQ6IG5ldyB0YXJnZXRzLlNxc1F1ZXVlKHF1ZXVlKSB9KTtcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBTcXNRdWV1ZSBpbXBsZW1lbnRzIGV2ZW50cy5JUnVsZVRhcmdldCB7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHF1ZXVlOiBzcXMuSVF1ZXVlLCBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBTcXNRdWV1ZVByb3BzID0ge30pIHtcbiAgICBpZiAocHJvcHMubWVzc2FnZUdyb3VwSWQgIT09IHVuZGVmaW5lZCAmJiAhcXVldWUuZmlmbykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdtZXNzYWdlR3JvdXBJZCBjYW5ub3QgYmUgc3BlY2lmaWVkIGZvciBub24tRklGTyBxdWV1ZXMnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIFJ1bGVUYXJnZXQgdGhhdCBjYW4gYmUgdXNlZCB0byB0cmlnZ2VyIHRoaXMgU1FTIHF1ZXVlIGFzIGFcbiAgICogcmVzdWx0IGZyb20gYW4gRXZlbnRCcmlkZ2UgZXZlbnQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2V2ZW50YnJpZGdlL2xhdGVzdC91c2VyZ3VpZGUvcmVzb3VyY2UtYmFzZWQtcG9saWNpZXMtZXZlbnRicmlkZ2UuaHRtbCNzcXMtcGVybWlzc2lvbnNcbiAgICovXG4gIHB1YmxpYyBiaW5kKHJ1bGU6IGV2ZW50cy5JUnVsZSwgX2lkPzogc3RyaW5nKTogZXZlbnRzLlJ1bGVUYXJnZXRDb25maWcge1xuICAgIGNvbnN0IHJlc3RyaWN0VG9TYW1lQWNjb3VudCA9IEZlYXR1cmVGbGFncy5vZihydWxlKS5pc0VuYWJsZWQoY3hhcGkuRVZFTlRTX1RBUkdFVF9RVUVVRV9TQU1FX0FDQ09VTlQpO1xuXG4gICAgbGV0IGNvbmRpdGlvbnM6IGFueSA9IHt9O1xuICAgIGlmICghdGhpcy5xdWV1ZS5lbmNyeXB0aW9uTWFzdGVyS2V5KSB7XG4gICAgICBjb25kaXRpb25zID0ge1xuICAgICAgICBBcm5FcXVhbHM6IHsgJ2F3czpTb3VyY2VBcm4nOiBydWxlLnJ1bGVBcm4gfSxcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChyZXN0cmljdFRvU2FtZUFjY291bnQpIHtcbiAgICAgIC8vIEFkZCBvbmx5IHRoZSBhY2NvdW50IGlkIGFzIGEgY29uZGl0aW9uLCB0byBhdm9pZCBjaXJjdWxhciBkZXBlbmRlbmN5LiBTZWUgaXNzdWUgIzExMTU4LlxuICAgICAgY29uZGl0aW9ucyA9IHtcbiAgICAgICAgU3RyaW5nRXF1YWxzOiB7ICdhd3M6U291cmNlQWNjb3VudCc6IHJ1bGUuZW52LmFjY291bnQgfSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gZGVkdXBsaWNhdGVkIGF1dG9tYXRpY2FsbHlcbiAgICB0aGlzLnF1ZXVlLmdyYW50U2VuZE1lc3NhZ2VzKG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZXZlbnRzLmFtYXpvbmF3cy5jb20nLCB7IGNvbmRpdGlvbnMgfSkpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuZGVhZExldHRlclF1ZXVlKSB7XG4gICAgICBhZGRUb0RlYWRMZXR0ZXJRdWV1ZVJlc291cmNlUG9saWN5KHJ1bGUsIHRoaXMucHJvcHMuZGVhZExldHRlclF1ZXVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uYmluZEJhc2VUYXJnZXRDb25maWcodGhpcy5wcm9wcyksXG4gICAgICBhcm46IHRoaXMucXVldWUucXVldWVBcm4sXG4gICAgICBpbnB1dDogdGhpcy5wcm9wcy5tZXNzYWdlLFxuICAgICAgdGFyZ2V0UmVzb3VyY2U6IHRoaXMucXVldWUsXG4gICAgICBzcXNQYXJhbWV0ZXJzOiB0aGlzLnByb3BzLm1lc3NhZ2VHcm91cElkID8geyBtZXNzYWdlR3JvdXBJZDogdGhpcy5wcm9wcy5tZXNzYWdlR3JvdXBJZCB9IDogdW5kZWZpbmVkLFxuICAgIH07XG4gIH1cblxufVxuIl19