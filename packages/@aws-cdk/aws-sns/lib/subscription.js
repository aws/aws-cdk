"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Policy = exports.Filter = exports.FilterOrPolicy = exports.FilterOrPolicyType = exports.SubscriptionProtocol = exports.Subscription = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const sns_generated_1 = require("./sns.generated");
/**
 * A new subscription.
 *
 * Prefer to use the `ITopic.addSubscription()` methods to create instances of
 * this class.
 */
class Subscription extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_sns_SubscriptionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Subscription);
            }
            throw error;
        }
        if (props.rawMessageDelivery &&
            [
                SubscriptionProtocol.HTTP,
                SubscriptionProtocol.HTTPS,
                SubscriptionProtocol.SQS,
                SubscriptionProtocol.FIREHOSE,
            ]
                .indexOf(props.protocol) < 0) {
            throw new Error('Raw message delivery can only be enabled for HTTP, HTTPS, SQS, and Firehose subscriptions.');
        }
        if (props.filterPolicy) {
            if (Object.keys(props.filterPolicy).length > 5) {
                throw new Error('A filter policy can have a maximum of 5 attribute names.');
            }
            this.filterPolicy = Object.entries(props.filterPolicy)
                .reduce((acc, [k, v]) => ({ ...acc, [k]: v.conditions }), {});
            let total = 1;
            Object.values(this.filterPolicy).forEach(filter => { total *= filter.length; });
            if (total > 150) {
                throw new Error(`The total combination of values (${total}) must not exceed 150.`);
            }
        }
        else if (props.filterPolicyWithMessageBody) {
            if (Object.keys(props.filterPolicyWithMessageBody).length > 5) {
                throw new Error('A filter policy can have a maximum of 5 attribute names.');
            }
            this.filterPolicyWithMessageBody = props.filterPolicyWithMessageBody;
        }
        if (props.protocol === SubscriptionProtocol.FIREHOSE && !props.subscriptionRoleArn) {
            throw new Error('Subscription role arn is required field for subscriptions with a firehose protocol.');
        }
        // Format filter policy
        const filterPolicy = this.filterPolicyWithMessageBody
            ? buildFilterPolicyWithMessageBody(this.filterPolicyWithMessageBody)
            : this.filterPolicy;
        this.deadLetterQueue = this.buildDeadLetterQueue(props);
        new sns_generated_1.CfnSubscription(this, 'Resource', {
            endpoint: props.endpoint,
            protocol: props.protocol,
            topicArn: props.topic.topicArn,
            rawMessageDelivery: props.rawMessageDelivery,
            filterPolicy,
            filterPolicyScope: this.filterPolicyWithMessageBody ? 'MessageBody' : undefined,
            region: props.region,
            redrivePolicy: this.buildDeadLetterConfig(this.deadLetterQueue),
            subscriptionRoleArn: props.subscriptionRoleArn,
        });
    }
    buildDeadLetterQueue(props) {
        if (!props.deadLetterQueue) {
            return undefined;
        }
        const deadLetterQueue = props.deadLetterQueue;
        deadLetterQueue.addToResourcePolicy(new aws_iam_1.PolicyStatement({
            resources: [deadLetterQueue.queueArn],
            actions: ['sqs:SendMessage'],
            principals: [new aws_iam_1.ServicePrincipal('sns.amazonaws.com')],
            conditions: {
                ArnEquals: { 'aws:SourceArn': props.topic.topicArn },
            },
        }));
        return deadLetterQueue;
    }
    buildDeadLetterConfig(deadLetterQueue) {
        if (deadLetterQueue) {
            return {
                deadLetterTargetArn: deadLetterQueue.queueArn,
            };
        }
        else {
            return undefined;
        }
    }
}
exports.Subscription = Subscription;
_a = JSII_RTTI_SYMBOL_1;
Subscription[_a] = { fqn: "@aws-cdk/aws-sns.Subscription", version: "0.0.0" };
/**
 * The type of subscription, controlling the type of the endpoint parameter.
 */
var SubscriptionProtocol;
(function (SubscriptionProtocol) {
    /**
     * JSON-encoded message is POSTED to an HTTP url.
     */
    SubscriptionProtocol["HTTP"] = "http";
    /**
     * JSON-encoded message is POSTed to an HTTPS url.
     */
    SubscriptionProtocol["HTTPS"] = "https";
    /**
     * Notifications are sent via email.
     */
    SubscriptionProtocol["EMAIL"] = "email";
    /**
     * Notifications are JSON-encoded and sent via mail.
     */
    SubscriptionProtocol["EMAIL_JSON"] = "email-json";
    /**
     * Notification is delivered by SMS
     */
    SubscriptionProtocol["SMS"] = "sms";
    /**
     * Notifications are enqueued into an SQS queue.
     */
    SubscriptionProtocol["SQS"] = "sqs";
    /**
     * JSON-encoded notifications are sent to a mobile app endpoint.
     */
    SubscriptionProtocol["APPLICATION"] = "application";
    /**
     * Notifications trigger a Lambda function.
     */
    SubscriptionProtocol["LAMBDA"] = "lambda";
    /**
     * Notifications put records into a firehose delivery stream.
     */
    SubscriptionProtocol["FIREHOSE"] = "firehose";
})(SubscriptionProtocol = exports.SubscriptionProtocol || (exports.SubscriptionProtocol = {}));
function buildFilterPolicyWithMessageBody(inputObject, depth = 1, totalCombinationValues = [1]) {
    const result = {};
    for (const [key, filterOrPolicy] of Object.entries(inputObject)) {
        if (filterOrPolicy.isPolicy()) {
            result[key] = buildFilterPolicyWithMessageBody(filterOrPolicy.policyDoc, depth + 1, totalCombinationValues);
        }
        else if (filterOrPolicy.isFilter()) {
            const filter = filterOrPolicy.filterDoc.conditions;
            result[key] = filter;
            totalCombinationValues[0] *= filter.length * depth;
        }
    }
    // https://docs.aws.amazon.com/sns/latest/dg/subscription-filter-policy-constraints.html
    if (totalCombinationValues[0] > 150) {
        throw new Error(`The total combination of values (${totalCombinationValues}) must not exceed 150.`);
    }
    return result;
}
;
/**
 * The type of the MessageBody at a given key value pair
 */
var FilterOrPolicyType;
(function (FilterOrPolicyType) {
    /**
     * The filter of the MessageBody
     */
    FilterOrPolicyType[FilterOrPolicyType["FILTER"] = 0] = "FILTER";
    /**
     * A nested key of the MessageBody
     */
    FilterOrPolicyType[FilterOrPolicyType["POLICY"] = 1] = "POLICY";
})(FilterOrPolicyType = exports.FilterOrPolicyType || (exports.FilterOrPolicyType = {}));
/**
 * Class for building the FilterPolicy by avoiding union types
 */
class FilterOrPolicy {
    /**
     * Filter of MessageBody
     * @param filter
     * @returns
     */
    static filter(filter) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_sns_SubscriptionFilter(filter);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.filter);
            }
            throw error;
        }
        return new Filter(filter);
    }
    /**
     * Policy of MessageBody
     * @param policy
     * @returns
     */
    static policy(policy) {
        return new Policy(policy);
    }
    /**
     * Check if instance is `Policy` type
     */
    isPolicy() {
        return this.type === FilterOrPolicyType.POLICY;
    }
    /**
     * Check if instance is `Filter` type
     */
    isFilter() {
        return this.type === FilterOrPolicyType.FILTER;
    }
}
exports.FilterOrPolicy = FilterOrPolicy;
_b = JSII_RTTI_SYMBOL_1;
FilterOrPolicy[_b] = { fqn: "@aws-cdk/aws-sns.FilterOrPolicy", version: "0.0.0" };
/**
 * Filter implementation of FilterOrPolicy
 */
class Filter extends FilterOrPolicy {
    /**
     * Policy constructor
     * @param filterDoc filter argument to construct
     */
    constructor(filterDoc) {
        super();
        this.filterDoc = filterDoc;
        /**
         * Type used in DFS buildFilterPolicyWithMessageBody to determine json value type
         */
        this.type = FilterOrPolicyType.FILTER;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_sns_SubscriptionFilter(filterDoc);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Filter);
            }
            throw error;
        }
    }
}
exports.Filter = Filter;
_c = JSII_RTTI_SYMBOL_1;
Filter[_c] = { fqn: "@aws-cdk/aws-sns.Filter", version: "0.0.0" };
/**
 * Policy Implementation of FilterOrPolicy
 */
class Policy extends FilterOrPolicy {
    /**
     * Policy constructor
     * @param policyDoc policy argument to construct
     */
    constructor(policyDoc) {
        super();
        this.policyDoc = policyDoc;
        /**
         * Type used in DFS buildFilterPolicyWithMessageBody to determine json value type
         */
        this.type = FilterOrPolicyType.POLICY;
    }
}
exports.Policy = Policy;
_d = JSII_RTTI_SYMBOL_1;
Policy[_d] = { fqn: "@aws-cdk/aws-sns.Policy", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3Vic2NyaXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDhDQUFxRTtBQUVyRSx3Q0FBeUM7QUFFekMsbURBQWtEO0FBNEVsRDs7Ozs7R0FLRztBQUNILE1BQWEsWUFBYSxTQUFRLGVBQVE7SUFXeEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF3QjtRQUNoRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBWlIsWUFBWTs7OztRQWNyQixJQUFJLEtBQUssQ0FBQyxrQkFBa0I7WUFDMUI7Z0JBQ0Usb0JBQW9CLENBQUMsSUFBSTtnQkFDekIsb0JBQW9CLENBQUMsS0FBSztnQkFDMUIsb0JBQW9CLENBQUMsR0FBRztnQkFDeEIsb0JBQW9CLENBQUMsUUFBUTthQUM5QjtpQkFDRSxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNoQyxNQUFNLElBQUksS0FBSyxDQUFDLDRGQUE0RixDQUFDLENBQUM7U0FDL0c7UUFFRCxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUU7WUFDdEIsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUM5QyxNQUFNLElBQUksS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7YUFDN0U7WUFFRCxJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztpQkFDbkQsTUFBTSxDQUNMLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsRUFDaEQsRUFBRSxD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QkFZQzs7O0FBRUQ7O0dBRUc7QUFDSCxNQUFhLE1BQU8sU0FBUSxjQUFjO0lBS3hDOzs7T0FHRztJQUNILFlBQW1DLFNBQWtEO1FBQ25GLEtBQUssRUFBRSxDQUFDO1FBRHlCLGNBQVMsR0FBVCxTQUFTLENBQXlDO1FBUnJGOztXQUVHO1FBQ2EsU0FBSSxHQUFHLGtCQUFrQixDQUFDLE1BQU0sQ0FBQztLQU9oRDs7QUFYSCx3QkFZQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBvbGljeVN0YXRlbWVudCwgU2VydmljZVByaW5jaXBhbCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgSVF1ZXVlIH0gZnJvbSAnQGF3cy1jZGsvYXdzLXNxcyc7XG5pbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5TdWJzY3JpcHRpb24gfSBmcm9tICcuL3Nucy5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uRmlsdGVyIH0gZnJvbSAnLi9zdWJzY3JpcHRpb24tZmlsdGVyJztcbmltcG9ydCB7IElUb3BpYyB9IGZyb20gJy4vdG9waWMtYmFzZSc7XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgY3JlYXRpbmcgYSBuZXcgc3Vic2NyaXB0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3Vic2NyaXB0aW9uT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBXaGF0IHR5cGUgb2Ygc3Vic2NyaXB0aW9uIHRvIGFkZC5cbiAgICovXG4gIHJlYWRvbmx5IHByb3RvY29sOiBTdWJzY3JpcHRpb25Qcm90b2NvbDtcblxuICAvKipcbiAgICogVGhlIHN1YnNjcmlwdGlvbiBlbmRwb2ludC5cbiAgICpcbiAgICogVGhlIG1lYW5pbmcgb2YgdGhpcyB2YWx1ZSBkZXBlbmRzIG9uIHRoZSB2YWx1ZSBmb3IgJ3Byb3RvY29sJy5cbiAgICovXG4gIHJlYWRvbmx5IGVuZHBvaW50OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIHRydWUgaWYgcmF3IG1lc3NhZ2UgZGVsaXZlcnkgaXMgZW5hYmxlZCBmb3IgdGhlIHN1YnNjcmlwdGlvbi4gUmF3IG1lc3NhZ2VzIGFyZSBmcmVlIG9mIEpTT04gZm9ybWF0dGluZyBhbmQgY2FuIGJlXG4gICAqIHNlbnQgdG8gSFRUUC9TIGFuZCBBbWF6b24gU1FTIGVuZHBvaW50cy4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBHZXRTdWJzY3JpcHRpb25BdHRyaWJ1dGVzIGluIHRoZSBBbWF6b24gU2ltcGxlXG4gICAqIE5vdGlmaWNhdGlvbiBTZXJ2aWNlIEFQSSBSZWZlcmVuY2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSByYXdNZXNzYWdlRGVsaXZlcnk/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgZmlsdGVyIHBvbGljeS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBhbGwgbWVzc2FnZXMgYXJlIGRlbGl2ZXJlZFxuICAgKi9cbiAgcmVhZG9ubHkgZmlsdGVyUG9saWN5PyA6IHsgW2F0dHJpYnV0ZTogc3RyaW5nXTogU3Vic2NyaXB0aW9uRmlsdGVyIH07XG5cbiAgLyoqXG4gICAqIFRoZSBmaWx0ZXIgcG9saWN5IHRoYXQgaXMgYXBwbGllZCBvbiB0aGUgbWVzc2FnZSBib2R5LlxuICAgKiBUbyBhcHBseSBhIGZpbHRlciBwb2xpY3kgdG8gdGhlIG1lc3NhZ2UgYXR0cmlidXRlcywgdXNlIGBmaWx0ZXJQb2xpY3lgLiBBIG1heGltdW0gb2Ygb25lIG9mIGBmaWx0ZXJQb2xpY3lXaXRoTWVzc2FnZUJvZHlgIGFuZCBgZmlsdGVyUG9saWN5YCBtYXkgYmUgdXNlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBhbGwgbWVzc2FnZXMgYXJlIGRlbGl2ZXJlZFxuICAgKi9cbiAgcmVhZG9ubHkgZmlsdGVyUG9saWN5V2l0aE1lc3NhZ2VCb2R5PzogeyBbYXR0cmlidXRlOiBzdHJpbmddOiBGaWx0ZXJPclBvbGljeSB9O1xuXG4gIC8qKlxuICAgKiBUaGUgcmVnaW9uIHdoZXJlIHRoZSB0b3BpYyByZXNpZGVzLCBpbiB0aGUgY2FzZSBvZiBjcm9zcy1yZWdpb24gc3Vic2NyaXB0aW9uc1xuICAgKiBAbGluayBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utc25zLXN1YnNjcmlwdGlvbi5odG1sI2Nmbi1zbnMtc3Vic2NyaXB0aW9uLXJlZ2lvblxuICAgKiBAZGVmYXVsdCAtIHRoZSByZWdpb24gd2hlcmUgdGhlIENsb3VkRm9ybWF0aW9uIHN0YWNrIGlzIGJlaW5nIGRlcGxveWVkLlxuICAgKi9cbiAgcmVhZG9ubHkgcmVnaW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBRdWV1ZSB0byBiZSB1c2VkIGFzIGRlYWQgbGV0dGVyIHF1ZXVlLlxuICAgKiBJZiBub3QgcGFzc2VkIG5vIGRlYWQgbGV0dGVyIHF1ZXVlIGlzIGVuYWJsZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZGVhZCBsZXR0ZXIgcXVldWUgZW5hYmxlZC5cbiAgICovXG4gIHJlYWRvbmx5IGRlYWRMZXR0ZXJRdWV1ZT86IElRdWV1ZTtcblxuICAvKipcbiAgICogQXJuIG9mIHJvbGUgYWxsb3dpbmcgYWNjZXNzIHRvIGZpcmVob3NlIGRlbGl2ZXJ5IHN0cmVhbS5cbiAgICogUmVxdWlyZWQgZm9yIGEgZmlyZWhvc2Ugc3Vic2NyaXB0aW9uIHByb3RvY29sLlxuICAgKiBAZGVmYXVsdCAtIE5vIHN1YnNjcmlwdGlvbiByb2xlIGlzIHByb3ZpZGVkXG4gICAqL1xuICByZWFkb25seSBzdWJzY3JpcHRpb25Sb2xlQXJuPzogc3RyaW5nO1xufVxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBjcmVhdGluZyBhIG5ldyBzdWJzY3JpcHRpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdWJzY3JpcHRpb25Qcm9wcyBleHRlbmRzIFN1YnNjcmlwdGlvbk9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHRvcGljIHRvIHN1YnNjcmliZSB0by5cbiAgICovXG4gIHJlYWRvbmx5IHRvcGljOiBJVG9waWM7XG59XG5cbi8qKlxuICogQSBuZXcgc3Vic2NyaXB0aW9uLlxuICpcbiAqIFByZWZlciB0byB1c2UgdGhlIGBJVG9waWMuYWRkU3Vic2NyaXB0aW9uKClgIG1ldGhvZHMgdG8gY3JlYXRlIGluc3RhbmNlcyBvZlxuICogdGhpcyBjbGFzcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFN1YnNjcmlwdGlvbiBleHRlbmRzIFJlc291cmNlIHtcblxuICAvKipcbiAgICogVGhlIERMUSBhc3NvY2lhdGVkIHdpdGggdGhpcyBzdWJzY3JpcHRpb24gaWYgcHJlc2VudC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkZWFkTGV0dGVyUXVldWU/OiBJUXVldWU7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBmaWx0ZXJQb2xpY3k/OiB7IFthdHRyaWJ1dGU6IHN0cmluZ106IGFueVtdIH07XG5cbiAgcHJpdmF0ZSByZWFkb25seSBmaWx0ZXJQb2xpY3lXaXRoTWVzc2FnZUJvZHk/IDoge1thdHRyaWJ1dGU6IHN0cmluZ106IEZpbHRlck9yUG9saWN5IH07XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFN1YnNjcmlwdGlvblByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGlmIChwcm9wcy5yYXdNZXNzYWdlRGVsaXZlcnkgJiZcbiAgICAgIFtcbiAgICAgICAgU3Vic2NyaXB0aW9uUHJvdG9jb2wuSFRUUCxcbiAgICAgICAgU3Vic2NyaXB0aW9uUHJvdG9jb2wuSFRUUFMsXG4gICAgICAgIFN1YnNjcmlwdGlvblByb3RvY29sLlNRUyxcbiAgICAgICAgU3Vic2NyaXB0aW9uUHJvdG9jb2wuRklSRUhPU0UsXG4gICAgICBdXG4gICAgICAgIC5pbmRleE9mKHByb3BzLnByb3RvY29sKSA8IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmF3IG1lc3NhZ2UgZGVsaXZlcnkgY2FuIG9ubHkgYmUgZW5hYmxlZCBmb3IgSFRUUCwgSFRUUFMsIFNRUywgYW5kIEZpcmVob3NlIHN1YnNjcmlwdGlvbnMuJyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmZpbHRlclBvbGljeSkge1xuICAgICAgaWYgKE9iamVjdC5rZXlzKHByb3BzLmZpbHRlclBvbGljeSkubGVuZ3RoID4gNSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgZmlsdGVyIHBvbGljeSBjYW4gaGF2ZSBhIG1heGltdW0gb2YgNSBhdHRyaWJ1dGUgbmFtZXMuJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZmlsdGVyUG9saWN5ID0gT2JqZWN0LmVudHJpZXMocHJvcHMuZmlsdGVyUG9saWN5KVxuICAgICAgICAucmVkdWNlKFxuICAgICAgICAgIChhY2MsIFtrLCB2XSkgPT4gKHsgLi4uYWNjLCBba106IHYuY29uZGl0aW9ucyB9KSxcbiAgICAgICAgICB7fSxcbiAgICAgICAgKTtcblxuICAgICAgbGV0IHRvdGFsID0gMTtcbiAgICAgIE9iamVjdC52YWx1ZXModGhpcy5maWx0ZXJQb2xpY3kpLmZvckVhY2goZmlsdGVyID0+IHsgdG90YWwgKj0gZmlsdGVyLmxlbmd0aDsgfSk7XG4gICAgICBpZiAodG90YWwgPiAxNTApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgdG90YWwgY29tYmluYXRpb24gb2YgdmFsdWVzICgke3RvdGFsfSkgbXVzdCBub3QgZXhjZWVkIDE1MC5gKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHByb3BzLmZpbHRlclBvbGljeVdpdGhNZXNzYWdlQm9keSkge1xuICAgICAgaWYgKE9iamVjdC5rZXlzKHByb3BzLmZpbHRlclBvbGljeVdpdGhNZXNzYWdlQm9keSkubGVuZ3RoID4gNSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgZmlsdGVyIHBvbGljeSBjYW4gaGF2ZSBhIG1heGltdW0gb2YgNSBhdHRyaWJ1dGUgbmFtZXMuJyk7XG4gICAgICB9XG4gICAgICB0aGlzLmZpbHRlclBvbGljeVdpdGhNZXNzYWdlQm9keSA9IHByb3BzLmZpbHRlclBvbGljeVdpdGhNZXNzYWdlQm9keTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMucHJvdG9jb2wgPT09IFN1YnNjcmlwdGlvblByb3RvY29sLkZJUkVIT1NFICYmICFwcm9wcy5zdWJzY3JpcHRpb25Sb2xlQXJuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N1YnNjcmlwdGlvbiByb2xlIGFybiBpcyByZXF1aXJlZCBmaWVsZCBmb3Igc3Vic2NyaXB0aW9ucyB3aXRoIGEgZmlyZWhvc2UgcHJvdG9jb2wuJyk7XG4gICAgfVxuXG4gICAgLy8gRm9ybWF0IGZpbHRlciBwb2xpY3lcbiAgICBjb25zdCBmaWx0ZXJQb2xpY3kgPSB0aGlzLmZpbHRlclBvbGljeVdpdGhNZXNzYWdlQm9keVxuICAgICAgPyBidWlsZEZpbHRlclBvbGljeVdpdGhNZXNzYWdlQm9keSh0aGlzLmZpbHRlclBvbGljeVdpdGhNZXNzYWdlQm9keSlcbiAgICAgIDogdGhpcy5maWx0ZXJQb2xpY3k7XG5cbiAgICB0aGlzLmRlYWRMZXR0ZXJRdWV1ZSA9IHRoaXMuYnVpbGREZWFkTGV0dGVyUXVldWUocHJvcHMpO1xuICAgIG5ldyBDZm5TdWJzY3JpcHRpb24odGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgZW5kcG9pbnQ6IHByb3BzLmVuZHBvaW50LFxuICAgICAgcHJvdG9jb2w6IHByb3BzLnByb3RvY29sLFxuICAgICAgdG9waWNBcm46IHByb3BzLnRvcGljLnRvcGljQXJuLFxuICAgICAgcmF3TWVzc2FnZURlbGl2ZXJ5OiBwcm9wcy5yYXdNZXNzYWdlRGVsaXZlcnksXG4gICAgICBmaWx0ZXJQb2xpY3ksXG4gICAgICBmaWx0ZXJQb2xpY3lTY29wZTogdGhpcy5maWx0ZXJQb2xpY3lXaXRoTWVzc2FnZUJvZHkgPyAnTWVzc2FnZUJvZHknIDogdW5kZWZpbmVkLFxuICAgICAgcmVnaW9uOiBwcm9wcy5yZWdpb24sXG4gICAgICByZWRyaXZlUG9saWN5OiB0aGlzLmJ1aWxkRGVhZExldHRlckNvbmZpZyh0aGlzLmRlYWRMZXR0ZXJRdWV1ZSksXG4gICAgICBzdWJzY3JpcHRpb25Sb2xlQXJuOiBwcm9wcy5zdWJzY3JpcHRpb25Sb2xlQXJuLFxuICAgIH0pO1xuXG4gIH1cblxuICBwcml2YXRlIGJ1aWxkRGVhZExldHRlclF1ZXVlKHByb3BzOiBTdWJzY3JpcHRpb25Qcm9wcykge1xuICAgIGlmICghcHJvcHMuZGVhZExldHRlclF1ZXVlKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IGRlYWRMZXR0ZXJRdWV1ZSA9IHByb3BzLmRlYWRMZXR0ZXJRdWV1ZTtcblxuICAgIGRlYWRMZXR0ZXJRdWV1ZS5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbZGVhZExldHRlclF1ZXVlLnF1ZXVlQXJuXSxcbiAgICAgIGFjdGlvbnM6IFsnc3FzOlNlbmRNZXNzYWdlJ10sXG4gICAgICBwcmluY2lwYWxzOiBbbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyldLFxuICAgICAgY29uZGl0aW9uczoge1xuICAgICAgICBBcm5FcXVhbHM6IHsgJ2F3czpTb3VyY2VBcm4nOiBwcm9wcy50b3BpYy50b3BpY0FybiB9LFxuICAgICAgfSxcbiAgICB9KSk7XG5cbiAgICByZXR1cm4gZGVhZExldHRlclF1ZXVlO1xuICB9XG5cbiAgcHJpdmF0ZSBidWlsZERlYWRMZXR0ZXJDb25maWcoZGVhZExldHRlclF1ZXVlPzogSVF1ZXVlKSB7XG4gICAgaWYgKGRlYWRMZXR0ZXJRdWV1ZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGVhZExldHRlclRhcmdldEFybjogZGVhZExldHRlclF1ZXVlLnF1ZXVlQXJuLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgdHlwZSBvZiBzdWJzY3JpcHRpb24sIGNvbnRyb2xsaW5nIHRoZSB0eXBlIG9mIHRoZSBlbmRwb2ludCBwYXJhbWV0ZXIuXG4gKi9cbmV4cG9ydCBlbnVtIFN1YnNjcmlwdGlvblByb3RvY29sIHtcbiAgLyoqXG4gICAqIEpTT04tZW5jb2RlZCBtZXNzYWdlIGlzIFBPU1RFRCB0byBhbiBIVFRQIHVybC5cbiAgICovXG4gIEhUVFAgPSAnaHR0cCcsXG5cbiAgLyoqXG4gICAqIEpTT04tZW5jb2RlZCBtZXNzYWdlIGlzIFBPU1RlZCB0byBhbiBIVFRQUyB1cmwuXG4gICAqL1xuICBIVFRQUyA9ICdodHRwcycsXG5cbiAgLyoqXG4gICAqIE5vdGlmaWNhdGlvbnMgYXJlIHNlbnQgdmlhIGVtYWlsLlxuICAgKi9cbiAgRU1BSUwgPSAnZW1haWwnLFxuXG4gIC8qKlxuICAgKiBOb3RpZmljYXRpb25zIGFyZSBKU09OLWVuY29kZWQgYW5kIHNlbnQgdmlhIG1haWwuXG4gICAqL1xuICBFTUFJTF9KU09OID0gJ2VtYWlsLWpzb24nLFxuXG4gIC8qKlxuICAgKiBOb3RpZmljYXRpb24gaXMgZGVsaXZlcmVkIGJ5IFNNU1xuICAgKi9cbiAgU01TID0gJ3NtcycsXG5cbiAgLyoqXG4gICAqIE5vdGlmaWNhdGlvbnMgYXJlIGVucXVldWVkIGludG8gYW4gU1FTIHF1ZXVlLlxuICAgKi9cbiAgU1FTID0gJ3NxcycsXG5cbiAgLyoqXG4gICAqIEpTT04tZW5jb2RlZCBub3RpZmljYXRpb25zIGFyZSBzZW50IHRvIGEgbW9iaWxlIGFwcCBlbmRwb2ludC5cbiAgICovXG4gIEFQUExJQ0FUSU9OID0gJ2FwcGxpY2F0aW9uJyxcblxuICAvKipcbiAgICogTm90aWZpY2F0aW9ucyB0cmlnZ2VyIGEgTGFtYmRhIGZ1bmN0aW9uLlxuICAgKi9cbiAgTEFNQkRBID0gJ2xhbWJkYScsXG5cbiAgLyoqXG4gICAqIE5vdGlmaWNhdGlvbnMgcHV0IHJlY29yZHMgaW50byBhIGZpcmVob3NlIGRlbGl2ZXJ5IHN0cmVhbS5cbiAgICovXG4gIEZJUkVIT1NFID0gJ2ZpcmVob3NlJ1xufVxuXG5mdW5jdGlvbiBidWlsZEZpbHRlclBvbGljeVdpdGhNZXNzYWdlQm9keShcbiAgaW5wdXRPYmplY3Q6IHsgW2tleTogc3RyaW5nXTogRmlsdGVyT3JQb2xpY3kgfSxcbiAgZGVwdGggPSAxLFxuICB0b3RhbENvbWJpbmF0aW9uVmFsdWVzID0gWzFdLFxuKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gIGNvbnN0IHJlc3VsdDogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHt9O1xuXG4gIGZvciAoY29uc3QgW2tleSwgZmlsdGVyT3JQb2xpY3ldIG9mIE9iamVjdC5lbnRyaWVzKGlucHV0T2JqZWN0KSkge1xuICAgIGlmIChmaWx0ZXJPclBvbGljeS5pc1BvbGljeSgpKSB7XG4gICAgICByZXN1bHRba2V5XSA9IGJ1aWxkRmlsdGVyUG9saWN5V2l0aE1lc3NhZ2VCb2R5KGZpbHRlck9yUG9saWN5LnBvbGljeURvYywgZGVwdGggKyAxLCB0b3RhbENvbWJpbmF0aW9uVmFsdWVzKTtcbiAgICB9IGVsc2UgaWYgKGZpbHRlck9yUG9saWN5LmlzRmlsdGVyKCkpIHtcbiAgICAgIGNvbnN0IGZpbHRlciA9IGZpbHRlck9yUG9saWN5LmZpbHRlckRvYy5jb25kaXRpb25zO1xuICAgICAgcmVzdWx0W2tleV0gPSBmaWx0ZXI7XG4gICAgICB0b3RhbENvbWJpbmF0aW9uVmFsdWVzWzBdICo9IGZpbHRlci5sZW5ndGggKiBkZXB0aDtcbiAgICB9XG4gIH1cblxuICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc25zL2xhdGVzdC9kZy9zdWJzY3JpcHRpb24tZmlsdGVyLXBvbGljeS1jb25zdHJhaW50cy5odG1sXG4gIGlmICh0b3RhbENvbWJpbmF0aW9uVmFsdWVzWzBdID4gMTUwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgdG90YWwgY29tYmluYXRpb24gb2YgdmFsdWVzICgke3RvdGFsQ29tYmluYXRpb25WYWx1ZXN9KSBtdXN0IG5vdCBleGNlZWQgMTUwLmApO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogVGhlIHR5cGUgb2YgdGhlIE1lc3NhZ2VCb2R5IGF0IGEgZ2l2ZW4ga2V5IHZhbHVlIHBhaXJcbiAqL1xuZXhwb3J0IGVudW0gRmlsdGVyT3JQb2xpY3lUeXBlIHtcbiAgLyoqXG4gICAqIFRoZSBmaWx0ZXIgb2YgdGhlIE1lc3NhZ2VCb2R5XG4gICAqL1xuICBGSUxURVIsXG4gIC8qKlxuICAgKiBBIG5lc3RlZCBrZXkgb2YgdGhlIE1lc3NhZ2VCb2R5XG4gICAqL1xuICBQT0xJQ1ksXG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIGJ1aWxkaW5nIHRoZSBGaWx0ZXJQb2xpY3kgYnkgYXZvaWRpbmcgdW5pb24gdHlwZXNcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEZpbHRlck9yUG9saWN5IHtcbiAgLyoqXG4gICAqIEZpbHRlciBvZiBNZXNzYWdlQm9keVxuICAgKiBAcGFyYW0gZmlsdGVyXG4gICAqIEByZXR1cm5zXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZpbHRlcihmaWx0ZXI6IFN1YnNjcmlwdGlvbkZpbHRlcikge1xuICAgIHJldHVybiBuZXcgRmlsdGVyKGZpbHRlcik7XG4gIH1cblxuICAvKipcbiAgICogUG9saWN5IG9mIE1lc3NhZ2VCb2R5XG4gICAqIEBwYXJhbSBwb2xpY3lcbiAgICogQHJldHVybnNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcG9saWN5KHBvbGljeTogeyBbYXR0cmlidXRlOiBzdHJpbmddOiBGaWx0ZXJPclBvbGljeSB9KSB7XG4gICAgcmV0dXJuIG5ldyBQb2xpY3kocG9saWN5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUeXBlIHN3aXRjaCBmb3IgZGlzYW1iaWd1YXRpbmcgYmV0d2VlbiBzdWJjbGFzc2VzXG4gICAqL1xuICBhYnN0cmFjdCByZWFkb25seSB0eXBlOiBGaWx0ZXJPclBvbGljeVR5cGU7XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGluc3RhbmNlIGlzIGBQb2xpY3lgIHR5cGVcbiAgICovXG4gIHB1YmxpYyBpc1BvbGljeSgpOiB0aGlzIGlzIFBvbGljeSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gRmlsdGVyT3JQb2xpY3lUeXBlLlBPTElDWTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBpbnN0YW5jZSBpcyBgRmlsdGVyYCB0eXBlXG4gICAqL1xuICBwdWJsaWMgaXNGaWx0ZXIoKTogdGhpcyBpcyBGaWx0ZXIge1xuICAgIHJldHVybiB0aGlzLnR5cGUgPT09IEZpbHRlck9yUG9saWN5VHlwZS5GSUxURVI7XG4gIH1cbn1cblxuLyoqXG4gKiBGaWx0ZXIgaW1wbGVtZW50YXRpb24gb2YgRmlsdGVyT3JQb2xpY3lcbiAqL1xuZXhwb3J0IGNsYXNzIEZpbHRlciBleHRlbmRzIEZpbHRlck9yUG9saWN5IHtcbiAgLyoqXG4gICAqIFR5cGUgdXNlZCBpbiBERlMgYnVpbGRGaWx0ZXJQb2xpY3lXaXRoTWVzc2FnZUJvZHkgdG8gZGV0ZXJtaW5lIGpzb24gdmFsdWUgdHlwZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHR5cGUgPSBGaWx0ZXJPclBvbGljeVR5cGUuRklMVEVSO1xuICAvKipcbiAgICogUG9saWN5IGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSBmaWx0ZXJEb2MgZmlsdGVyIGFyZ3VtZW50IHRvIGNvbnN0cnVjdFxuICAgKi9cbiAgcHVibGljIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBmaWx0ZXJEb2M6IFN1YnNjcmlwdGlvbkZpbHRlcikge1xuICAgIHN1cGVyKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBQb2xpY3kgSW1wbGVtZW50YXRpb24gb2YgRmlsdGVyT3JQb2xpY3lcbiAqL1xuZXhwb3J0IGNsYXNzIFBvbGljeSBleHRlbmRzIEZpbHRlck9yUG9saWN5IHtcbiAgLyoqXG4gICAqIFR5cGUgdXNlZCBpbiBERlMgYnVpbGRGaWx0ZXJQb2xpY3lXaXRoTWVzc2FnZUJvZHkgdG8gZGV0ZXJtaW5lIGpzb24gdmFsdWUgdHlwZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHR5cGUgPSBGaWx0ZXJPclBvbGljeVR5cGUuUE9MSUNZO1xuICAvKipcbiAgICogUG9saWN5IGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSBwb2xpY3lEb2MgcG9saWN5IGFyZ3VtZW50IHRvIGNvbnN0cnVjdFxuICAgKi9cbiAgcHVibGljIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBwb2xpY3lEb2M6IHsgW2F0dHJpYnV0ZTogc3RyaW5nXTogRmlsdGVyT3JQb2xpY3kgfSkge1xuICAgIHN1cGVyKCk7XG4gIH1cbn1cbiJdfQ==