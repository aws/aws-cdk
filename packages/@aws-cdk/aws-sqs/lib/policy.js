"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueuePolicy = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const sqs_generated_1 = require("./sqs.generated");
/**
 * The policy for an SQS Queue
 *
 * Policies define the operations that are allowed on this resource.
 *
 * You almost never need to define this construct directly.
 *
 * All AWS resources that support resource policies have a method called
 * `addToResourcePolicy()`, which will automatically create a new resource
 * policy if one doesn't exist yet, otherwise it will add to the existing
 * policy.
 *
 * Prefer to use `addToResourcePolicy()` instead.
 */
class QueuePolicy extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        /**
         * The IAM policy document for this policy.
         */
        this.document = new aws_iam_1.PolicyDocument();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_sqs_QueuePolicyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, QueuePolicy);
            }
            throw error;
        }
        new sqs_generated_1.CfnQueuePolicy(this, 'Resource', {
            policyDocument: this.document,
            queues: props.queues.map(q => q.queueUrl),
        });
    }
    /**
     * Not currently supported by AWS CloudFormation.
     *
     * This attribute temporarily existed in CloudFormation, and then was removed again.
     *
     * @attribute
     */
    get queuePolicyId() {
        throw new Error('QueuePolicy.queuePolicyId has been removed from CloudFormation');
    }
}
exports.QueuePolicy = QueuePolicy;
_a = JSII_RTTI_SYMBOL_1;
QueuePolicy[_a] = { fqn: "@aws-cdk/aws-sqs.QueuePolicy", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9saWN5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicG9saWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDhDQUFrRDtBQUNsRCx3Q0FBeUM7QUFHekMsbURBQWlEO0FBWWpEOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxNQUFhLFdBQVksU0FBUSxlQUFRO0lBTXZDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBdUI7UUFDL0QsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQU5uQjs7V0FFRztRQUNhLGFBQVEsR0FBRyxJQUFJLHdCQUFjLEVBQUUsQ0FBQzs7Ozs7OytDQUpyQyxXQUFXOzs7O1FBU3BCLElBQUksOEJBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ25DLGNBQWMsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUM3QixNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1NBQzFDLENBQUMsQ0FBQztLQUNKO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsSUFBVyxhQUFhO1FBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0VBQWdFLENBQUMsQ0FBQztLQUNuRjs7QUF4Qkgsa0NBeUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUG9saWN5RG9jdW1lbnQgfSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IFJlc291cmNlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElRdWV1ZSB9IGZyb20gJy4vcXVldWUtYmFzZSc7XG5pbXBvcnQgeyBDZm5RdWV1ZVBvbGljeSB9IGZyb20gJy4vc3FzLmdlbmVyYXRlZCc7XG5cbi8qKlxuICogUHJvcGVydGllcyB0byBhc3NvY2lhdGUgU1FTIHF1ZXVlcyB3aXRoIGEgcG9saWN5XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUXVldWVQb2xpY3lQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgc2V0IG9mIHF1ZXVlcyB0aGlzIHBvbGljeSBhcHBsaWVzIHRvLlxuICAgKi9cbiAgcmVhZG9ubHkgcXVldWVzOiBJUXVldWVbXTtcbn1cblxuLyoqXG4gKiBUaGUgcG9saWN5IGZvciBhbiBTUVMgUXVldWVcbiAqXG4gKiBQb2xpY2llcyBkZWZpbmUgdGhlIG9wZXJhdGlvbnMgdGhhdCBhcmUgYWxsb3dlZCBvbiB0aGlzIHJlc291cmNlLlxuICpcbiAqIFlvdSBhbG1vc3QgbmV2ZXIgbmVlZCB0byBkZWZpbmUgdGhpcyBjb25zdHJ1Y3QgZGlyZWN0bHkuXG4gKlxuICogQWxsIEFXUyByZXNvdXJjZXMgdGhhdCBzdXBwb3J0IHJlc291cmNlIHBvbGljaWVzIGhhdmUgYSBtZXRob2QgY2FsbGVkXG4gKiBgYWRkVG9SZXNvdXJjZVBvbGljeSgpYCwgd2hpY2ggd2lsbCBhdXRvbWF0aWNhbGx5IGNyZWF0ZSBhIG5ldyByZXNvdXJjZVxuICogcG9saWN5IGlmIG9uZSBkb2Vzbid0IGV4aXN0IHlldCwgb3RoZXJ3aXNlIGl0IHdpbGwgYWRkIHRvIHRoZSBleGlzdGluZ1xuICogcG9saWN5LlxuICpcbiAqIFByZWZlciB0byB1c2UgYGFkZFRvUmVzb3VyY2VQb2xpY3koKWAgaW5zdGVhZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFF1ZXVlUG9saWN5IGV4dGVuZHMgUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIElBTSBwb2xpY3kgZG9jdW1lbnQgZm9yIHRoaXMgcG9saWN5LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGRvY3VtZW50ID0gbmV3IFBvbGljeURvY3VtZW50KCk7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFF1ZXVlUG9saWN5UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgbmV3IENmblF1ZXVlUG9saWN5KHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHBvbGljeURvY3VtZW50OiB0aGlzLmRvY3VtZW50LFxuICAgICAgcXVldWVzOiBwcm9wcy5xdWV1ZXMubWFwKHEgPT4gcS5xdWV1ZVVybCksXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTm90IGN1cnJlbnRseSBzdXBwb3J0ZWQgYnkgQVdTIENsb3VkRm9ybWF0aW9uLlxuICAgKlxuICAgKiBUaGlzIGF0dHJpYnV0ZSB0ZW1wb3JhcmlseSBleGlzdGVkIGluIENsb3VkRm9ybWF0aW9uLCBhbmQgdGhlbiB3YXMgcmVtb3ZlZCBhZ2Fpbi5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIGdldCBxdWV1ZVBvbGljeUlkKCk6IHN0cmluZyB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdRdWV1ZVBvbGljeS5xdWV1ZVBvbGljeUlkIGhhcyBiZWVuIHJlbW92ZWQgZnJvbSBDbG91ZEZvcm1hdGlvbicpO1xuICB9XG59XG4iXX0=