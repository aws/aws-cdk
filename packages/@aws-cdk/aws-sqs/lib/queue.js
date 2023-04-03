"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = exports.FifoThroughputLimit = exports.DeduplicationScope = exports.QueueEncryption = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const core_1 = require("@aws-cdk/core");
const queue_base_1 = require("./queue-base");
const sqs_generated_1 = require("./sqs.generated");
const validate_props_1 = require("./validate-props");
/**
 * What kind of encryption to apply to this queue
 */
var QueueEncryption;
(function (QueueEncryption) {
    /**
     * Messages in the queue are not encrypted
     */
    QueueEncryption["UNENCRYPTED"] = "NONE";
    /**
     * Server-side KMS encryption with a KMS key managed by SQS.
     */
    QueueEncryption["KMS_MANAGED"] = "KMS_MANAGED";
    /**
     * Server-side encryption with a KMS key managed by the user.
     *
     * If `encryptionKey` is specified, this key will be used, otherwise, one will be defined.
     */
    QueueEncryption["KMS"] = "KMS";
    /**
     * Server-side encryption key managed by SQS (SSE-SQS).
     *
     * To learn more about SSE-SQS on Amazon SQS, please visit the
     * [Amazon SQS documentation](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-server-side-encryption.html).
     */
    QueueEncryption["SQS_MANAGED"] = "SQS_MANAGED";
})(QueueEncryption = exports.QueueEncryption || (exports.QueueEncryption = {}));
/**
 * What kind of deduplication scope to apply
 */
var DeduplicationScope;
(function (DeduplicationScope) {
    /**
     * Deduplication occurs at the message group level
     */
    DeduplicationScope["MESSAGE_GROUP"] = "messageGroup";
    /**
     * Deduplication occurs at the message queue level
     */
    DeduplicationScope["QUEUE"] = "queue";
})(DeduplicationScope = exports.DeduplicationScope || (exports.DeduplicationScope = {}));
/**
 * Whether the FIFO queue throughput quota applies to the entire queue or per message group
 */
var FifoThroughputLimit;
(function (FifoThroughputLimit) {
    /**
     * Throughput quota applies per queue
     */
    FifoThroughputLimit["PER_QUEUE"] = "perQueue";
    /**
     * Throughput quota applies per message group id
     */
    FifoThroughputLimit["PER_MESSAGE_GROUP_ID"] = "perMessageGroupId";
})(FifoThroughputLimit = exports.FifoThroughputLimit || (exports.FifoThroughputLimit = {}));
/**
 * A new Amazon SQS queue
 */
class Queue extends queue_base_1.QueueBase {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.queueName,
        });
        this.autoCreatePolicy = true;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_sqs_QueueProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Queue);
            }
            throw error;
        }
        validate_props_1.validateProps(props);
        const redrivePolicy = props.deadLetterQueue
            ? {
                deadLetterTargetArn: props.deadLetterQueue.queue.queueArn,
                maxReceiveCount: props.deadLetterQueue.maxReceiveCount,
            }
            : undefined;
        const { encryptionMasterKey, encryptionProps } = _determineEncryptionProps.call(this);
        const fifoProps = this.determineFifoProps(props);
        this.fifo = fifoProps.fifoQueue || false;
        const queue = new sqs_generated_1.CfnQueue(this, 'Resource', {
            queueName: this.physicalName,
            ...fifoProps,
            ...encryptionProps,
            redrivePolicy,
            delaySeconds: props.deliveryDelay && props.deliveryDelay.toSeconds(),
            maximumMessageSize: props.maxMessageSizeBytes,
            messageRetentionPeriod: props.retentionPeriod && props.retentionPeriod.toSeconds(),
            receiveMessageWaitTimeSeconds: props.receiveMessageWaitTime && props.receiveMessageWaitTime.toSeconds(),
            visibilityTimeout: props.visibilityTimeout && props.visibilityTimeout.toSeconds(),
        });
        queue.applyRemovalPolicy(props.removalPolicy ?? core_1.RemovalPolicy.DESTROY);
        this.queueArn = this.getResourceArnAttribute(queue.attrArn, {
            service: 'sqs',
            resource: this.physicalName,
        });
        this.queueName = this.getResourceNameAttribute(queue.attrQueueName);
        this.encryptionMasterKey = encryptionMasterKey;
        this.queueUrl = queue.ref;
        this.deadLetterQueue = props.deadLetterQueue;
        function _determineEncryptionProps() {
            let encryption = props.encryption;
            if (encryption === QueueEncryption.SQS_MANAGED && props.encryptionMasterKey) {
                throw new Error("'encryptionMasterKey' is not supported if encryption type 'SQS_MANAGED' is used");
            }
            if (encryption !== QueueEncryption.KMS && props.encryptionMasterKey) {
                encryption = QueueEncryption.KMS; // KMS is implied by specifying an encryption key
            }
            if (!encryption) {
                return { encryptionProps: {} };
            }
            if (encryption === QueueEncryption.UNENCRYPTED) {
                return {
                    encryptionProps: {
                        sqsManagedSseEnabled: false,
                    },
                };
            }
            if (encryption === QueueEncryption.KMS_MANAGED) {
                return {
                    encryptionProps: {
                        kmsMasterKeyId: 'alias/aws/sqs',
                        kmsDataKeyReusePeriodSeconds: props.dataKeyReuse && props.dataKeyReuse.toSeconds(),
                    },
                };
            }
            if (encryption === QueueEncryption.KMS) {
                const masterKey = props.encryptionMasterKey || new kms.Key(this, 'Key', {
                    description: `Created by ${this.node.path}`,
                });
                return {
                    encryptionMasterKey: masterKey,
                    encryptionProps: {
                        kmsMasterKeyId: masterKey.keyArn,
                        kmsDataKeyReusePeriodSeconds: props.dataKeyReuse && props.dataKeyReuse.toSeconds(),
                    },
                };
            }
            if (encryption === QueueEncryption.SQS_MANAGED) {
                return {
                    encryptionProps: {
                        sqsManagedSseEnabled: true,
                    },
                };
            }
            throw new Error(`Unexpected 'encryptionType': ${encryption}`);
        }
        // Enforce encryption of data in transit
        if (props.enforceSSL) {
            this.enforceSSLStatement();
        }
    }
    /**
     * Import an existing SQS queue provided an ARN
     *
     * @param scope The parent creating construct
     * @param id The construct's name
     * @param queueArn queue ARN (i.e. arn:aws:sqs:us-east-2:444455556666:queue1)
     */
    static fromQueueArn(scope, id, queueArn) {
        return Queue.fromQueueAttributes(scope, id, { queueArn });
    }
    /**
     * Import an existing queue
     */
    static fromQueueAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_sqs_QueueAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromQueueAttributes);
            }
            throw error;
        }
        const stack = core_1.Stack.of(scope);
        const parsedArn = stack.splitArn(attrs.queueArn, core_1.ArnFormat.NO_RESOURCE_NAME);
        const queueName = attrs.queueName || parsedArn.resource;
        const queueUrl = attrs.queueUrl || `https://sqs.${parsedArn.region}.${stack.urlSuffix}/${parsedArn.account}/${queueName}`;
        class Import extends queue_base_1.QueueBase {
            constructor() {
                super(...arguments);
                this.queueArn = attrs.queueArn; // arn:aws:sqs:us-east-1:123456789012:queue1
                this.queueUrl = queueUrl;
                this.queueName = queueName;
                this.encryptionMasterKey = attrs.keyArn
                    ? kms.Key.fromKeyArn(this, 'Key', attrs.keyArn)
                    : undefined;
                this.fifo = this.determineFifo();
                this.autoCreatePolicy = false;
            }
            /**
             * Determine fifo flag based on queueName and fifo attribute
             */
            determineFifo() {
                if (core_1.Token.isUnresolved(this.queueArn)) {
                    return attrs.fifo || false;
                }
                else {
                    if (typeof attrs.fifo !== 'undefined') {
                        if (attrs.fifo && !queueName.endsWith('.fifo')) {
                            throw new Error("FIFO queue names must end in '.fifo'");
                        }
                        if (!attrs.fifo && queueName.endsWith('.fifo')) {
                            throw new Error("Non-FIFO queue name may not end in '.fifo'");
                        }
                    }
                    return queueName.endsWith('.fifo') ? true : false;
                }
            }
        }
        return new Import(scope, id);
    }
    /**
     * Look at the props, see if the FIFO props agree, and return the correct subset of props
     */
    determineFifoProps(props) {
        // Check if any of the signals that we have say that this is a FIFO queue.
        let fifoQueue = props.fifo;
        const queueName = props.queueName;
        if (typeof fifoQueue === 'undefined' && queueName && !core_1.Token.isUnresolved(queueName) && queueName.endsWith('.fifo')) {
            fifoQueue = true;
        }
        if (typeof fifoQueue === 'undefined' && props.contentBasedDeduplication) {
            fifoQueue = true;
        }
        if (typeof fifoQueue === 'undefined' && props.deduplicationScope) {
            fifoQueue = true;
        }
        if (typeof fifoQueue === 'undefined' && props.fifoThroughputLimit) {
            fifoQueue = true;
        }
        // If we have a name, see that it agrees with the FIFO setting
        if (typeof queueName === 'string') {
            if (fifoQueue && !queueName.endsWith('.fifo')) {
                throw new Error("FIFO queue names must end in '.fifo'");
            }
            if (!fifoQueue && queueName.endsWith('.fifo')) {
                throw new Error("Non-FIFO queue name may not end in '.fifo'");
            }
        }
        if (props.contentBasedDeduplication && !fifoQueue) {
            throw new Error('Content-based deduplication can only be defined for FIFO queues');
        }
        if (props.deduplicationScope && !fifoQueue) {
            throw new Error('Deduplication scope can only be defined for FIFO queues');
        }
        if (props.fifoThroughputLimit && !fifoQueue) {
            throw new Error('FIFO throughput limit can only be defined for FIFO queues');
        }
        return {
            contentBasedDeduplication: props.contentBasedDeduplication,
            deduplicationScope: props.deduplicationScope,
            fifoThroughputLimit: props.fifoThroughputLimit,
            fifoQueue,
        };
    }
    /**
     * Adds an iam statement to enforce encryption of data in transit.
     */
    enforceSSLStatement() {
        const statement = new iam.PolicyStatement({
            actions: ['sqs:*'],
            conditions: {
                Bool: { 'aws:SecureTransport': 'false' },
            },
            effect: iam.Effect.DENY,
            resources: [this.queueArn],
            principals: [new iam.AnyPrincipal()],
        });
        this.addToResourcePolicy(statement);
    }
}
exports.Queue = Queue;
_a = JSII_RTTI_SYMBOL_1;
Queue[_a] = { fqn: "@aws-cdk/aws-sqs.Queue", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJxdWV1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLHdDQUFpRjtBQUVqRiw2Q0FBa0U7QUFDbEUsbURBQTJDO0FBQzNDLHFEQUFpRDtBQStMakQ7O0dBRUc7QUFDSCxJQUFZLGVBeUJYO0FBekJELFdBQVksZUFBZTtJQUN6Qjs7T0FFRztJQUNILHVDQUFvQixDQUFBO0lBRXBCOztPQUVHO0lBQ0gsOENBQTJCLENBQUE7SUFFM0I7Ozs7T0FJRztJQUNILDhCQUFXLENBQUE7SUFFWDs7Ozs7T0FLRztJQUNILDhDQUEyQixDQUFBO0FBQzdCLENBQUMsRUF6QlcsZUFBZSxHQUFmLHVCQUFlLEtBQWYsdUJBQWUsUUF5QjFCO0FBRUQ7O0dBRUc7QUFDSCxJQUFZLGtCQVNYO0FBVEQsV0FBWSxrQkFBa0I7SUFDNUI7O09BRUc7SUFDSCxvREFBOEIsQ0FBQTtJQUM5Qjs7T0FFRztJQUNILHFDQUFlLENBQUE7QUFDakIsQ0FBQyxFQVRXLGtCQUFrQixHQUFsQiwwQkFBa0IsS0FBbEIsMEJBQWtCLFFBUzdCO0FBRUQ7O0dBRUc7QUFDSCxJQUFZLG1CQVNYO0FBVEQsV0FBWSxtQkFBbUI7SUFDN0I7O09BRUc7SUFDSCw2Q0FBc0IsQ0FBQTtJQUN0Qjs7T0FFRztJQUNILGlFQUEwQyxDQUFBO0FBQzVDLENBQUMsRUFUVyxtQkFBbUIsR0FBbkIsMkJBQW1CLEtBQW5CLDJCQUFtQixRQVM5QjtBQUVEOztHQUVHO0FBQ0gsTUFBYSxLQUFNLFNBQVEsc0JBQVM7SUF3RmxDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsUUFBb0IsRUFBRTtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLFlBQVksRUFBRSxLQUFLLENBQUMsU0FBUztTQUM5QixDQUFDLENBQUM7UUFMYyxxQkFBZ0IsR0FBRyxJQUFJLENBQUM7Ozs7Ozsr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QyxlQUFlLENBQUM7WUFDeEMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDO1lBQ2xCLFVBQVUsRUFBRTtnQkFDVixJQUFJLEVBQUUsRUFBRSxxQkFBcUIsRUFBRSxPQUFPLEVBQUU7YUFDekM7WUFDRCxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJO1lBQ3ZCLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDMUIsVUFBVSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDckMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3JDOztBQXhQSCxzQkF5UEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnQGF3cy1jZGsvYXdzLWttcyc7XG5pbXBvcnQgeyBEdXJhdGlvbiwgUmVtb3ZhbFBvbGljeSwgU3RhY2ssIFRva2VuLCBBcm5Gb3JtYXQgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSVF1ZXVlLCBRdWV1ZUF0dHJpYnV0ZXMsIFF1ZXVlQmFzZSB9IGZyb20gJy4vcXVldWUtYmFzZSc7XG5pbXBvcnQgeyBDZm5RdWV1ZSB9IGZyb20gJy4vc3FzLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyB2YWxpZGF0ZVByb3BzIH0gZnJvbSAnLi92YWxpZGF0ZS1wcm9wcyc7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgY3JlYXRpbmcgYSBuZXcgUXVldWVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBRdWV1ZVByb3BzIHtcbiAgLyoqXG4gICAqIEEgbmFtZSBmb3IgdGhlIHF1ZXVlLlxuICAgKlxuICAgKiBJZiBzcGVjaWZpZWQgYW5kIHRoaXMgaXMgYSBGSUZPIHF1ZXVlLCBtdXN0IGVuZCBpbiB0aGUgc3RyaW5nICcuZmlmbycuXG4gICAqXG4gICAqIEBkZWZhdWx0IENsb3VkRm9ybWF0aW9uLWdlbmVyYXRlZCBuYW1lXG4gICAqL1xuICByZWFkb25seSBxdWV1ZU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2Ygc2Vjb25kcyB0aGF0IEFtYXpvbiBTUVMgcmV0YWlucyBhIG1lc3NhZ2UuXG4gICAqXG4gICAqIFlvdSBjYW4gc3BlY2lmeSBhbiBpbnRlZ2VyIHZhbHVlIGZyb20gNjAgc2Vjb25kcyAoMSBtaW51dGUpIHRvIDEyMDk2MDBcbiAgICogc2Vjb25kcyAoMTQgZGF5cykuIFRoZSBkZWZhdWx0IHZhbHVlIGlzIDM0NTYwMCBzZWNvbmRzICg0IGRheXMpLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEdXJhdGlvbi5kYXlzKDQpXG4gICAqL1xuICByZWFkb25seSByZXRlbnRpb25QZXJpb2Q/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogVGhlIHRpbWUgaW4gc2Vjb25kcyB0aGF0IHRoZSBkZWxpdmVyeSBvZiBhbGwgbWVzc2FnZXMgaW4gdGhlIHF1ZXVlIGlzIGRlbGF5ZWQuXG4gICAqXG4gICAqIFlvdSBjYW4gc3BlY2lmeSBhbiBpbnRlZ2VyIHZhbHVlIG9mIDAgdG8gOTAwICgxNSBtaW51dGVzKS4gVGhlIGRlZmF1bHRcbiAgICogdmFsdWUgaXMgMC5cbiAgICpcbiAgICogQGRlZmF1bHQgMFxuICAgKi9cbiAgcmVhZG9ubHkgZGVsaXZlcnlEZWxheT86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgbGltaXQgb2YgaG93IG1hbnkgYnl0ZXMgdGhhdCBhIG1lc3NhZ2UgY2FuIGNvbnRhaW4gYmVmb3JlIEFtYXpvbiBTUVMgcmVqZWN0cyBpdC5cbiAgICpcbiAgICogWW91IGNhbiBzcGVjaWZ5IGFuIGludGVnZXIgdmFsdWUgZnJvbSAxMDI0IGJ5dGVzICgxIEtpQikgdG8gMjYyMTQ0IGJ5dGVzXG4gICAqICgyNTYgS2lCKS4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgMjYyMTQ0ICgyNTYgS2lCKS5cbiAgICpcbiAgICogQGRlZmF1bHQgMjU2S2lCXG4gICAqL1xuICByZWFkb25seSBtYXhNZXNzYWdlU2l6ZUJ5dGVzPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBEZWZhdWx0IHdhaXQgdGltZSBmb3IgUmVjZWl2ZU1lc3NhZ2UgY2FsbHMuXG4gICAqXG4gICAqIERvZXMgbm90IHdhaXQgaWYgc2V0IHRvIDAsIG90aGVyd2lzZSB3YWl0cyB0aGlzIGFtb3VudCBvZiBzZWNvbmRzXG4gICAqIGJ5IGRlZmF1bHQgZm9yIG1lc3NhZ2VzIHRvIGFycml2ZS5cbiAgICpcbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBBbWF6b24gU1FTIExvbmcgUG9sbC5cbiAgICpcbiAgICogIEBkZWZhdWx0IDBcbiAgICovXG4gIHJlYWRvbmx5IHJlY2VpdmVNZXNzYWdlV2FpdFRpbWU/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogVGltZW91dCBvZiBwcm9jZXNzaW5nIGEgc2luZ2xlIG1lc3NhZ2UuXG4gICAqXG4gICAqIEFmdGVyIGRlcXVldWluZywgdGhlIHByb2Nlc3NvciBoYXMgdGhpcyBtdWNoIHRpbWUgdG8gaGFuZGxlIHRoZSBtZXNzYWdlXG4gICAqIGFuZCBkZWxldGUgaXQgZnJvbSB0aGUgcXVldWUgYmVmb3JlIGl0IGJlY29tZXMgdmlzaWJsZSBhZ2FpbiBmb3IgZGVxdWV1ZWluZ1xuICAgKiBieSBhbm90aGVyIHByb2Nlc3Nvci5cbiAgICpcbiAgICogVmFsdWVzIG11c3QgYmUgZnJvbSAwIHRvIDQzMjAwIHNlY29uZHMgKDEyIGhvdXJzKS4gSWYgeW91IGRvbid0IHNwZWNpZnlcbiAgICogYSB2YWx1ZSwgQVdTIENsb3VkRm9ybWF0aW9uIHVzZXMgdGhlIGRlZmF1bHQgdmFsdWUgb2YgMzAgc2Vjb25kcy5cbiAgICpcbiAgICogQGRlZmF1bHQgRHVyYXRpb24uc2Vjb25kcygzMClcbiAgICovXG4gIHJlYWRvbmx5IHZpc2liaWxpdHlUaW1lb3V0PzogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFNlbmQgbWVzc2FnZXMgdG8gdGhpcyBxdWV1ZSBpZiB0aGV5IHdlcmUgdW5zdWNjZXNzZnVsbHkgZGVxdWV1ZWQgYSBudW1iZXIgb2YgdGltZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IG5vIGRlYWQtbGV0dGVyIHF1ZXVlXG4gICAqL1xuICByZWFkb25seSBkZWFkTGV0dGVyUXVldWU/OiBEZWFkTGV0dGVyUXVldWU7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGNvbnRlbnRzIG9mIHRoZSBxdWV1ZSBhcmUgZW5jcnlwdGVkLCBhbmQgYnkgd2hhdCB0eXBlIG9mIGtleS5cbiAgICpcbiAgICogQmUgYXdhcmUgdGhhdCBlbmNyeXB0aW9uIGlzIG5vdCBhdmFpbGFibGUgaW4gYWxsIHJlZ2lvbnMsIHBsZWFzZSBzZWUgdGhlIGRvY3NcbiAgICogZm9yIGN1cnJlbnQgYXZhaWxhYmlsaXR5IGRldGFpbHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IFNRU19NQU5BR0VEIChTU0UtU1FTKSBmb3IgbmV3bHkgY3JlYXRlZCBxdWV1ZXNcbiAgICovXG4gIHJlYWRvbmx5IGVuY3J5cHRpb24/OiBRdWV1ZUVuY3J5cHRpb247XG5cbiAgLyoqXG4gICAqIEV4dGVybmFsIEtNUyBrZXkgdG8gdXNlIGZvciBxdWV1ZSBlbmNyeXB0aW9uLlxuICAgKlxuICAgKiBJbmRpdmlkdWFsIG1lc3NhZ2VzIHdpbGwgYmUgZW5jcnlwdGVkIHVzaW5nIGRhdGEga2V5cy4gVGhlIGRhdGEga2V5cyBpblxuICAgKiB0dXJuIHdpbGwgYmUgZW5jcnlwdGVkIHVzaW5nIHRoaXMga2V5LCBhbmQgcmV1c2VkIGZvciBhIG1heGltdW0gb2ZcbiAgICogYGRhdGFLZXlSZXVzZVNlY3NgIHNlY29uZHMuXG4gICAqXG4gICAqIElmIHRoZSAnZW5jcnlwdGlvbk1hc3RlcktleScgcHJvcGVydHkgaXMgc2V0LCAnZW5jcnlwdGlvbicgdHlwZSB3aWxsIGJlXG4gICAqIGltcGxpY2l0bHkgc2V0IHRvIFwiS01TXCIuXG4gICAqXG4gICAqIEBkZWZhdWx0IElmIGVuY3J5cHRpb24gaXMgc2V0IHRvIEtNUyBhbmQgbm90IHNwZWNpZmllZCwgYSBrZXkgd2lsbCBiZSBjcmVhdGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgZW5jcnlwdGlvbk1hc3RlcktleT86IGttcy5JS2V5O1xuXG4gIC8qKlxuICAgKiBUaGUgbGVuZ3RoIG9mIHRpbWUgdGhhdCBBbWF6b24gU1FTIHJldXNlcyBhIGRhdGEga2V5IGJlZm9yZSBjYWxsaW5nIEtNUyBhZ2Fpbi5cbiAgICpcbiAgICogVGhlIHZhbHVlIG11c3QgYmUgYW4gaW50ZWdlciBiZXR3ZWVuIDYwICgxIG1pbnV0ZSkgYW5kIDg2LDQwMCAoMjRcbiAgICogaG91cnMpLiBUaGUgZGVmYXVsdCBpcyAzMDAgKDUgbWludXRlcykuXG4gICAqXG4gICAqIEBkZWZhdWx0IER1cmF0aW9uLm1pbnV0ZXMoNSlcbiAgICovXG4gIHJlYWRvbmx5IGRhdGFLZXlSZXVzZT86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoaXMgYSBmaXJzdC1pbi1maXJzdC1vdXQgKEZJRk8pIHF1ZXVlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZSwgdW5sZXNzIHF1ZXVlTmFtZSBlbmRzIGluICcuZmlmbycgb3IgJ2NvbnRlbnRCYXNlZERlZHVwbGljYXRpb24nIGlzIHRydWUuXG4gICAqL1xuICByZWFkb25seSBmaWZvPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHdoZXRoZXIgdG8gZW5hYmxlIGNvbnRlbnQtYmFzZWQgZGVkdXBsaWNhdGlvbi5cbiAgICpcbiAgICogRHVyaW5nIHRoZSBkZWR1cGxpY2F0aW9uIGludGVydmFsICg1IG1pbnV0ZXMpLCBBbWF6b24gU1FTIHRyZWF0c1xuICAgKiBtZXNzYWdlcyB0aGF0IGFyZSBzZW50IHdpdGggaWRlbnRpY2FsIGNvbnRlbnQgKGV4Y2x1ZGluZyBhdHRyaWJ1dGVzKSBhc1xuICAgKiBkdXBsaWNhdGVzIGFuZCBkZWxpdmVycyBvbmx5IG9uZSBjb3B5IG9mIHRoZSBtZXNzYWdlLlxuICAgKlxuICAgKiBJZiB5b3UgZG9uJ3QgZW5hYmxlIGNvbnRlbnQtYmFzZWQgZGVkdXBsaWNhdGlvbiBhbmQgeW91IHdhbnQgdG8gZGVkdXBsaWNhdGVcbiAgICogbWVzc2FnZXMsIHByb3ZpZGUgYW4gZXhwbGljaXQgZGVkdXBsaWNhdGlvbiBJRCBpbiB5b3VyIFNlbmRNZXNzYWdlKCkgY2FsbC5cbiAgICpcbiAgICogKE9ubHkgYXBwbGllcyB0byBGSUZPIHF1ZXVlcy4pXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBjb250ZW50QmFzZWREZWR1cGxpY2F0aW9uPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogRm9yIGhpZ2ggdGhyb3VnaHB1dCBmb3IgRklGTyBxdWV1ZXMsIHNwZWNpZmllcyB3aGV0aGVyIG1lc3NhZ2UgZGVkdXBsaWNhdGlvblxuICAgKiBvY2N1cnMgYXQgdGhlIG1lc3NhZ2UgZ3JvdXAgb3IgcXVldWUgbGV2ZWwuXG4gICAqXG4gICAqIChPbmx5IGFwcGxpZXMgdG8gRklGTyBxdWV1ZXMuKVxuICAgKlxuICAgKiBAZGVmYXVsdCBEZWR1cGxpY2F0aW9uU2NvcGUuUVVFVUVcbiAgICovXG4gIHJlYWRvbmx5IGRlZHVwbGljYXRpb25TY29wZT86IERlZHVwbGljYXRpb25TY29wZTtcblxuICAvKipcbiAgICogRm9yIGhpZ2ggdGhyb3VnaHB1dCBmb3IgRklGTyBxdWV1ZXMsIHNwZWNpZmllcyB3aGV0aGVyIHRoZSBGSUZPIHF1ZXVlXG4gICAqIHRocm91Z2hwdXQgcXVvdGEgYXBwbGllcyB0byB0aGUgZW50aXJlIHF1ZXVlIG9yIHBlciBtZXNzYWdlIGdyb3VwLlxuICAgKlxuICAgKiAoT25seSBhcHBsaWVzIHRvIEZJRk8gcXVldWVzLilcbiAgICpcbiAgICogQGRlZmF1bHQgRmlmb1Rocm91Z2hwdXRMaW1pdC5QRVJfUVVFVUVcbiAgICovXG4gIHJlYWRvbmx5IGZpZm9UaHJvdWdocHV0TGltaXQ/OiBGaWZvVGhyb3VnaHB1dExpbWl0O1xuXG4gIC8qKlxuICAgKiBQb2xpY3kgdG8gYXBwbHkgd2hlbiB0aGUgcXVldWUgaXMgcmVtb3ZlZCBmcm9tIHRoZSBzdGFja1xuICAgKlxuICAgKiBFdmVuIHRob3VnaCBxdWV1ZXMgYXJlIHRlY2huaWNhbGx5IHN0YXRlZnVsLCB0aGVpciBjb250ZW50cyBhcmUgdHJhbnNpZW50IGFuZCBpdFxuICAgKiBpcyBjb21tb24gdG8gYWRkIGFuZCByZW1vdmUgUXVldWVzIHdoaWxlIHJlYXJjaGl0ZWN0aW5nIHlvdXIgYXBwbGljYXRpb24uIFRoZVxuICAgKiBkZWZhdWx0IGlzIHRoZXJlZm9yZSBgREVTVFJPWWAuIENoYW5nZSBpdCB0byBgUkVUQUlOYCBpZiB0aGUgbWVzc2FnZXMgYXJlIHNvXG4gICAqIHZhbHVhYmxlIHRoYXQgYWNjaWRlbnRhbGx5IGxvc2luZyB0aGVtIHdvdWxkIGJlIHVuYWNjZXB0YWJsZS5cbiAgICpcbiAgICogQGRlZmF1bHQgUmVtb3ZhbFBvbGljeS5ERVNUUk9ZXG4gICAqL1xuICByZWFkb25seSByZW1vdmFsUG9saWN5PzogUmVtb3ZhbFBvbGljeTtcblxuICAvKipcbiAgICogRW5mb3JjZSBlbmNyeXB0aW9uIG9mIGRhdGEgaW4gdHJhbnNpdC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTU2ltcGxlUXVldWVTZXJ2aWNlL2xhdGVzdC9TUVNEZXZlbG9wZXJHdWlkZS9zcXMtc2VjdXJpdHktYmVzdC1wcmFjdGljZXMuaHRtbCNlbmZvcmNlLWVuY3J5cHRpb24tZGF0YS1pbi10cmFuc2l0XG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBlbmZvcmNlU1NMPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBEZWFkIGxldHRlciBxdWV1ZSBzZXR0aW5nc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIERlYWRMZXR0ZXJRdWV1ZSB7XG4gIC8qKlxuICAgKiBUaGUgZGVhZC1sZXR0ZXIgcXVldWUgdG8gd2hpY2ggQW1hem9uIFNRUyBtb3ZlcyBtZXNzYWdlcyBhZnRlciB0aGUgdmFsdWUgb2YgbWF4UmVjZWl2ZUNvdW50IGlzIGV4Y2VlZGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgcXVldWU6IElRdWV1ZTtcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiB0aW1lcyBhIG1lc3NhZ2UgY2FuIGJlIHVuc3VjY2VzZnVsbHkgZGVxdWV1ZWQgYmVmb3JlIGJlaW5nIG1vdmVkIHRvIHRoZSBkZWFkLWxldHRlciBxdWV1ZS5cbiAgICovXG4gIHJlYWRvbmx5IG1heFJlY2VpdmVDb3VudDogbnVtYmVyO1xufVxuXG4vKipcbiAqIFdoYXQga2luZCBvZiBlbmNyeXB0aW9uIHRvIGFwcGx5IHRvIHRoaXMgcXVldWVcbiAqL1xuZXhwb3J0IGVudW0gUXVldWVFbmNyeXB0aW9uIHtcbiAgLyoqXG4gICAqIE1lc3NhZ2VzIGluIHRoZSBxdWV1ZSBhcmUgbm90IGVuY3J5cHRlZFxuICAgKi9cbiAgVU5FTkNSWVBURUQgPSAnTk9ORScsXG5cbiAgLyoqXG4gICAqIFNlcnZlci1zaWRlIEtNUyBlbmNyeXB0aW9uIHdpdGggYSBLTVMga2V5IG1hbmFnZWQgYnkgU1FTLlxuICAgKi9cbiAgS01TX01BTkFHRUQgPSAnS01TX01BTkFHRUQnLFxuXG4gIC8qKlxuICAgKiBTZXJ2ZXItc2lkZSBlbmNyeXB0aW9uIHdpdGggYSBLTVMga2V5IG1hbmFnZWQgYnkgdGhlIHVzZXIuXG4gICAqXG4gICAqIElmIGBlbmNyeXB0aW9uS2V5YCBpcyBzcGVjaWZpZWQsIHRoaXMga2V5IHdpbGwgYmUgdXNlZCwgb3RoZXJ3aXNlLCBvbmUgd2lsbCBiZSBkZWZpbmVkLlxuICAgKi9cbiAgS01TID0gJ0tNUycsXG5cbiAgLyoqXG4gICAqIFNlcnZlci1zaWRlIGVuY3J5cHRpb24ga2V5IG1hbmFnZWQgYnkgU1FTIChTU0UtU1FTKS5cbiAgICpcbiAgICogVG8gbGVhcm4gbW9yZSBhYm91dCBTU0UtU1FTIG9uIEFtYXpvbiBTUVMsIHBsZWFzZSB2aXNpdCB0aGVcbiAgICogW0FtYXpvbiBTUVMgZG9jdW1lbnRhdGlvbl0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU1NpbXBsZVF1ZXVlU2VydmljZS9sYXRlc3QvU1FTRGV2ZWxvcGVyR3VpZGUvc3FzLXNlcnZlci1zaWRlLWVuY3J5cHRpb24uaHRtbCkuXG4gICAqL1xuICBTUVNfTUFOQUdFRCA9ICdTUVNfTUFOQUdFRCdcbn1cblxuLyoqXG4gKiBXaGF0IGtpbmQgb2YgZGVkdXBsaWNhdGlvbiBzY29wZSB0byBhcHBseVxuICovXG5leHBvcnQgZW51bSBEZWR1cGxpY2F0aW9uU2NvcGUge1xuICAvKipcbiAgICogRGVkdXBsaWNhdGlvbiBvY2N1cnMgYXQgdGhlIG1lc3NhZ2UgZ3JvdXAgbGV2ZWxcbiAgICovXG4gIE1FU1NBR0VfR1JPVVAgPSAnbWVzc2FnZUdyb3VwJyxcbiAgLyoqXG4gICAqIERlZHVwbGljYXRpb24gb2NjdXJzIGF0IHRoZSBtZXNzYWdlIHF1ZXVlIGxldmVsXG4gICAqL1xuICBRVUVVRSA9ICdxdWV1ZScsXG59XG5cbi8qKlxuICogV2hldGhlciB0aGUgRklGTyBxdWV1ZSB0aHJvdWdocHV0IHF1b3RhIGFwcGxpZXMgdG8gdGhlIGVudGlyZSBxdWV1ZSBvciBwZXIgbWVzc2FnZSBncm91cFxuICovXG5leHBvcnQgZW51bSBGaWZvVGhyb3VnaHB1dExpbWl0IHtcbiAgLyoqXG4gICAqIFRocm91Z2hwdXQgcXVvdGEgYXBwbGllcyBwZXIgcXVldWVcbiAgICovXG4gIFBFUl9RVUVVRSA9ICdwZXJRdWV1ZScsXG4gIC8qKlxuICAgKiBUaHJvdWdocHV0IHF1b3RhIGFwcGxpZXMgcGVyIG1lc3NhZ2UgZ3JvdXAgaWRcbiAgICovXG4gIFBFUl9NRVNTQUdFX0dST1VQX0lEID0gJ3Blck1lc3NhZ2VHcm91cElkJyxcbn1cblxuLyoqXG4gKiBBIG5ldyBBbWF6b24gU1FTIHF1ZXVlXG4gKi9cbmV4cG9ydCBjbGFzcyBRdWV1ZSBleHRlbmRzIFF1ZXVlQmFzZSB7XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyBTUVMgcXVldWUgcHJvdmlkZWQgYW4gQVJOXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSBUaGUgcGFyZW50IGNyZWF0aW5nIGNvbnN0cnVjdFxuICAgKiBAcGFyYW0gaWQgVGhlIGNvbnN0cnVjdCdzIG5hbWVcbiAgICogQHBhcmFtIHF1ZXVlQXJuIHF1ZXVlIEFSTiAoaS5lLiBhcm46YXdzOnNxczp1cy1lYXN0LTI6NDQ0NDU1NTU2NjY2OnF1ZXVlMSlcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVF1ZXVlQXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHF1ZXVlQXJuOiBzdHJpbmcpOiBJUXVldWUge1xuICAgIHJldHVybiBRdWV1ZS5mcm9tUXVldWVBdHRyaWJ1dGVzKHNjb3BlLCBpZCwgeyBxdWV1ZUFybiB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgcXVldWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVF1ZXVlQXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogUXVldWVBdHRyaWJ1dGVzKTogSVF1ZXVlIHtcbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHNjb3BlKTtcbiAgICBjb25zdCBwYXJzZWRBcm4gPSBzdGFjay5zcGxpdEFybihhdHRycy5xdWV1ZUFybiwgQXJuRm9ybWF0Lk5PX1JFU09VUkNFX05BTUUpO1xuICAgIGNvbnN0IHF1ZXVlTmFtZSA9IGF0dHJzLnF1ZXVlTmFtZSB8fCBwYXJzZWRBcm4ucmVzb3VyY2U7XG4gICAgY29uc3QgcXVldWVVcmwgPSBhdHRycy5xdWV1ZVVybCB8fCBgaHR0cHM6Ly9zcXMuJHtwYXJzZWRBcm4ucmVnaW9ufS4ke3N0YWNrLnVybFN1ZmZpeH0vJHtwYXJzZWRBcm4uYWNjb3VudH0vJHtxdWV1ZU5hbWV9YDtcblxuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFF1ZXVlQmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcXVldWVBcm4gPSBhdHRycy5xdWV1ZUFybjsgLy8gYXJuOmF3czpzcXM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpxdWV1ZTFcbiAgICAgIHB1YmxpYyByZWFkb25seSBxdWV1ZVVybCA9IHF1ZXVlVXJsO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHF1ZXVlTmFtZSA9IHF1ZXVlTmFtZTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBlbmNyeXB0aW9uTWFzdGVyS2V5ID0gYXR0cnMua2V5QXJuXG4gICAgICAgID8ga21zLktleS5mcm9tS2V5QXJuKHRoaXMsICdLZXknLCBhdHRycy5rZXlBcm4pXG4gICAgICAgIDogdW5kZWZpbmVkO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGZpZm86IGJvb2xlYW4gPSB0aGlzLmRldGVybWluZUZpZm8oKTtcblxuICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGF1dG9DcmVhdGVQb2xpY3kgPSBmYWxzZTtcblxuICAgICAgLyoqXG4gICAgICAgKiBEZXRlcm1pbmUgZmlmbyBmbGFnIGJhc2VkIG9uIHF1ZXVlTmFtZSBhbmQgZmlmbyBhdHRyaWJ1dGVcbiAgICAgICAqL1xuICAgICAgcHJpdmF0ZSBkZXRlcm1pbmVGaWZvKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKHRoaXMucXVldWVBcm4pKSB7XG4gICAgICAgICAgcmV0dXJuIGF0dHJzLmZpZm8gfHwgZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBhdHRycy5maWZvICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWYgKGF0dHJzLmZpZm8gJiYgIXF1ZXVlTmFtZS5lbmRzV2l0aCgnLmZpZm8nKSkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGSUZPIHF1ZXVlIG5hbWVzIG11c3QgZW5kIGluICcuZmlmbydcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWF0dHJzLmZpZm8gJiYgcXVldWVOYW1lLmVuZHNXaXRoKCcuZmlmbycpKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vbi1GSUZPIHF1ZXVlIG5hbWUgbWF5IG5vdCBlbmQgaW4gJy5maWZvJ1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHF1ZXVlTmFtZS5lbmRzV2l0aCgnLmZpZm8nKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGlzIHF1ZXVlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcXVldWVBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhpcyBxdWV1ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHF1ZXVlTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgVVJMIG9mIHRoaXMgcXVldWVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBxdWV1ZVVybDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJZiB0aGlzIHF1ZXVlIGlzIGVuY3J5cHRlZCwgdGhpcyBpcyB0aGUgS01TIGtleS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBlbmNyeXB0aW9uTWFzdGVyS2V5Pzoga21zLklLZXk7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhpcyBxdWV1ZSBpcyBhbiBBbWF6b24gU1FTIEZJRk8gcXVldWUuIElmIGZhbHNlLCB0aGlzIGlzIGEgc3RhbmRhcmQgcXVldWUuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZmlmbzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgdGhpcyBxdWV1ZSBpcyBjb25maWd1cmVkIHdpdGggYSBkZWFkLWxldHRlciBxdWV1ZSwgdGhpcyBpcyB0aGUgZGVhZC1sZXR0ZXIgcXVldWUgc2V0dGluZ3MuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGVhZExldHRlclF1ZXVlPzogRGVhZExldHRlclF1ZXVlO1xuXG4gIHByb3RlY3RlZCByZWFkb25seSBhdXRvQ3JlYXRlUG9saWN5ID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUXVldWVQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLnF1ZXVlTmFtZSxcbiAgICB9KTtcblxuICAgIHZhbGlkYXRlUHJvcHMocHJvcHMpO1xuXG4gICAgY29uc3QgcmVkcml2ZVBvbGljeSA9IHByb3BzLmRlYWRMZXR0ZXJRdWV1ZVxuICAgICAgPyB7XG4gICAgICAgIGRlYWRMZXR0ZXJUYXJnZXRBcm46IHByb3BzLmRlYWRMZXR0ZXJRdWV1ZS5xdWV1ZS5xdWV1ZUFybixcbiAgICAgICAgbWF4UmVjZWl2ZUNvdW50OiBwcm9wcy5kZWFkTGV0dGVyUXVldWUubWF4UmVjZWl2ZUNvdW50LFxuICAgICAgfVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCB7IGVuY3J5cHRpb25NYXN0ZXJLZXksIGVuY3J5cHRpb25Qcm9wcyB9ID0gX2RldGVybWluZUVuY3J5cHRpb25Qcm9wcy5jYWxsKHRoaXMpO1xuXG4gICAgY29uc3QgZmlmb1Byb3BzID0gdGhpcy5kZXRlcm1pbmVGaWZvUHJvcHMocHJvcHMpO1xuICAgIHRoaXMuZmlmbyA9IGZpZm9Qcm9wcy5maWZvUXVldWUgfHwgZmFsc2U7XG5cbiAgICBjb25zdCBxdWV1ZSA9IG5ldyBDZm5RdWV1ZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBxdWV1ZU5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgLi4uZmlmb1Byb3BzLFxuICAgICAgLi4uZW5jcnlwdGlvblByb3BzLFxuICAgICAgcmVkcml2ZVBvbGljeSxcbiAgICAgIGRlbGF5U2Vjb25kczogcHJvcHMuZGVsaXZlcnlEZWxheSAmJiBwcm9wcy5kZWxpdmVyeURlbGF5LnRvU2Vjb25kcygpLFxuICAgICAgbWF4aW11bU1lc3NhZ2VTaXplOiBwcm9wcy5tYXhNZXNzYWdlU2l6ZUJ5dGVzLFxuICAgICAgbWVzc2FnZVJldGVudGlvblBlcmlvZDogcHJvcHMucmV0ZW50aW9uUGVyaW9kICYmIHByb3BzLnJldGVudGlvblBlcmlvZC50b1NlY29uZHMoKSxcbiAgICAgIHJlY2VpdmVNZXNzYWdlV2FpdFRpbWVTZWNvbmRzOiBwcm9wcy5yZWNlaXZlTWVzc2FnZVdhaXRUaW1lICYmIHByb3BzLnJlY2VpdmVNZXNzYWdlV2FpdFRpbWUudG9TZWNvbmRzKCksXG4gICAgICB2aXNpYmlsaXR5VGltZW91dDogcHJvcHMudmlzaWJpbGl0eVRpbWVvdXQgJiYgcHJvcHMudmlzaWJpbGl0eVRpbWVvdXQudG9TZWNvbmRzKCksXG4gICAgfSk7XG4gICAgcXVldWUuYXBwbHlSZW1vdmFsUG9saWN5KHByb3BzLnJlbW92YWxQb2xpY3kgPz8gUmVtb3ZhbFBvbGljeS5ERVNUUk9ZKTtcblxuICAgIHRoaXMucXVldWVBcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKHF1ZXVlLmF0dHJBcm4sIHtcbiAgICAgIHNlcnZpY2U6ICdzcXMnLFxuICAgICAgcmVzb3VyY2U6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgIH0pO1xuICAgIHRoaXMucXVldWVOYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUocXVldWUuYXR0clF1ZXVlTmFtZSk7XG4gICAgdGhpcy5lbmNyeXB0aW9uTWFzdGVyS2V5ID0gZW5jcnlwdGlvbk1hc3RlcktleTtcbiAgICB0aGlzLnF1ZXVlVXJsID0gcXVldWUucmVmO1xuICAgIHRoaXMuZGVhZExldHRlclF1ZXVlID0gcHJvcHMuZGVhZExldHRlclF1ZXVlO1xuXG4gICAgZnVuY3Rpb24gX2RldGVybWluZUVuY3J5cHRpb25Qcm9wcyh0aGlzOiBRdWV1ZSk6IHsgZW5jcnlwdGlvblByb3BzOiBFbmNyeXB0aW9uUHJvcHMsIGVuY3J5cHRpb25NYXN0ZXJLZXk/OiBrbXMuSUtleSB9IHtcbiAgICAgIGxldCBlbmNyeXB0aW9uID0gcHJvcHMuZW5jcnlwdGlvbjtcblxuICAgICAgaWYgKGVuY3J5cHRpb24gPT09IFF1ZXVlRW5jcnlwdGlvbi5TUVNfTUFOQUdFRCAmJiBwcm9wcy5lbmNyeXB0aW9uTWFzdGVyS2V5KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIidlbmNyeXB0aW9uTWFzdGVyS2V5JyBpcyBub3Qgc3VwcG9ydGVkIGlmIGVuY3J5cHRpb24gdHlwZSAnU1FTX01BTkFHRUQnIGlzIHVzZWRcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbmNyeXB0aW9uICE9PSBRdWV1ZUVuY3J5cHRpb24uS01TICYmIHByb3BzLmVuY3J5cHRpb25NYXN0ZXJLZXkpIHtcbiAgICAgICAgZW5jcnlwdGlvbiA9IFF1ZXVlRW5jcnlwdGlvbi5LTVM7IC8vIEtNUyBpcyBpbXBsaWVkIGJ5IHNwZWNpZnlpbmcgYW4gZW5jcnlwdGlvbiBrZXlcbiAgICAgIH1cblxuICAgICAgaWYgKCFlbmNyeXB0aW9uKSB7XG4gICAgICAgIHJldHVybiB7IGVuY3J5cHRpb25Qcm9wczoge30gfTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVuY3J5cHRpb24gPT09IFF1ZXVlRW5jcnlwdGlvbi5VTkVOQ1JZUFRFRCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVuY3J5cHRpb25Qcm9wczoge1xuICAgICAgICAgICAgc3FzTWFuYWdlZFNzZUVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChlbmNyeXB0aW9uID09PSBRdWV1ZUVuY3J5cHRpb24uS01TX01BTkFHRUQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlbmNyeXB0aW9uUHJvcHM6IHtcbiAgICAgICAgICAgIGttc01hc3RlcktleUlkOiAnYWxpYXMvYXdzL3NxcycsXG4gICAgICAgICAgICBrbXNEYXRhS2V5UmV1c2VQZXJpb2RTZWNvbmRzOiBwcm9wcy5kYXRhS2V5UmV1c2UgJiYgcHJvcHMuZGF0YUtleVJldXNlLnRvU2Vjb25kcygpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChlbmNyeXB0aW9uID09PSBRdWV1ZUVuY3J5cHRpb24uS01TKSB7XG4gICAgICAgIGNvbnN0IG1hc3RlcktleSA9IHByb3BzLmVuY3J5cHRpb25NYXN0ZXJLZXkgfHwgbmV3IGttcy5LZXkodGhpcywgJ0tleScsIHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjogYENyZWF0ZWQgYnkgJHt0aGlzLm5vZGUucGF0aH1gLFxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVuY3J5cHRpb25NYXN0ZXJLZXk6IG1hc3RlcktleSxcbiAgICAgICAgICBlbmNyeXB0aW9uUHJvcHM6IHtcbiAgICAgICAgICAgIGttc01hc3RlcktleUlkOiBtYXN0ZXJLZXkua2V5QXJuLFxuICAgICAgICAgICAga21zRGF0YUtleVJldXNlUGVyaW9kU2Vjb25kczogcHJvcHMuZGF0YUtleVJldXNlICYmIHByb3BzLmRhdGFLZXlSZXVzZS50b1NlY29uZHMoKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoZW5jcnlwdGlvbiA9PT0gUXVldWVFbmNyeXB0aW9uLlNRU19NQU5BR0VEKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZW5jcnlwdGlvblByb3BzOiB7XG4gICAgICAgICAgICBzcXNNYW5hZ2VkU3NlRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgJ2VuY3J5cHRpb25UeXBlJzogJHtlbmNyeXB0aW9ufWApO1xuICAgIH1cblxuICAgIC8vIEVuZm9yY2UgZW5jcnlwdGlvbiBvZiBkYXRhIGluIHRyYW5zaXRcbiAgICBpZiAocHJvcHMuZW5mb3JjZVNTTCkge1xuICAgICAgdGhpcy5lbmZvcmNlU1NMU3RhdGVtZW50KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIExvb2sgYXQgdGhlIHByb3BzLCBzZWUgaWYgdGhlIEZJRk8gcHJvcHMgYWdyZWUsIGFuZCByZXR1cm4gdGhlIGNvcnJlY3Qgc3Vic2V0IG9mIHByb3BzXG4gICAqL1xuICBwcml2YXRlIGRldGVybWluZUZpZm9Qcm9wcyhwcm9wczogUXVldWVQcm9wcyk6IEZpZm9Qcm9wcyB7XG4gICAgLy8gQ2hlY2sgaWYgYW55IG9mIHRoZSBzaWduYWxzIHRoYXQgd2UgaGF2ZSBzYXkgdGhhdCB0aGlzIGlzIGEgRklGTyBxdWV1ZS5cbiAgICBsZXQgZmlmb1F1ZXVlID0gcHJvcHMuZmlmbztcbiAgICBjb25zdCBxdWV1ZU5hbWUgPSBwcm9wcy5xdWV1ZU5hbWU7XG4gICAgaWYgKHR5cGVvZiBmaWZvUXVldWUgPT09ICd1bmRlZmluZWQnICYmIHF1ZXVlTmFtZSAmJiAhVG9rZW4uaXNVbnJlc29sdmVkKHF1ZXVlTmFtZSkgJiYgcXVldWVOYW1lLmVuZHNXaXRoKCcuZmlmbycpKSB7IGZpZm9RdWV1ZSA9IHRydWU7IH1cbiAgICBpZiAodHlwZW9mIGZpZm9RdWV1ZSA9PT0gJ3VuZGVmaW5lZCcgJiYgcHJvcHMuY29udGVudEJhc2VkRGVkdXBsaWNhdGlvbikgeyBmaWZvUXVldWUgPSB0cnVlOyB9XG4gICAgaWYgKHR5cGVvZiBmaWZvUXVldWUgPT09ICd1bmRlZmluZWQnICYmIHByb3BzLmRlZHVwbGljYXRpb25TY29wZSkgeyBmaWZvUXVldWUgPSB0cnVlOyB9XG4gICAgaWYgKHR5cGVvZiBmaWZvUXVldWUgPT09ICd1bmRlZmluZWQnICYmIHByb3BzLmZpZm9UaHJvdWdocHV0TGltaXQpIHsgZmlmb1F1ZXVlID0gdHJ1ZTsgfVxuXG4gICAgLy8gSWYgd2UgaGF2ZSBhIG5hbWUsIHNlZSB0aGF0IGl0IGFncmVlcyB3aXRoIHRoZSBGSUZPIHNldHRpbmdcbiAgICBpZiAodHlwZW9mIHF1ZXVlTmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmIChmaWZvUXVldWUgJiYgIXF1ZXVlTmFtZS5lbmRzV2l0aCgnLmZpZm8nKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGSUZPIHF1ZXVlIG5hbWVzIG11c3QgZW5kIGluICcuZmlmbydcIik7XG4gICAgICB9XG4gICAgICBpZiAoIWZpZm9RdWV1ZSAmJiBxdWV1ZU5hbWUuZW5kc1dpdGgoJy5maWZvJykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm9uLUZJRk8gcXVldWUgbmFtZSBtYXkgbm90IGVuZCBpbiAnLmZpZm8nXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwcm9wcy5jb250ZW50QmFzZWREZWR1cGxpY2F0aW9uICYmICFmaWZvUXVldWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ29udGVudC1iYXNlZCBkZWR1cGxpY2F0aW9uIGNhbiBvbmx5IGJlIGRlZmluZWQgZm9yIEZJRk8gcXVldWVzJyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmRlZHVwbGljYXRpb25TY29wZSAmJiAhZmlmb1F1ZXVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RlZHVwbGljYXRpb24gc2NvcGUgY2FuIG9ubHkgYmUgZGVmaW5lZCBmb3IgRklGTyBxdWV1ZXMnKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuZmlmb1Rocm91Z2hwdXRMaW1pdCAmJiAhZmlmb1F1ZXVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZJRk8gdGhyb3VnaHB1dCBsaW1pdCBjYW4gb25seSBiZSBkZWZpbmVkIGZvciBGSUZPIHF1ZXVlcycpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBjb250ZW50QmFzZWREZWR1cGxpY2F0aW9uOiBwcm9wcy5jb250ZW50QmFzZWREZWR1cGxpY2F0aW9uLFxuICAgICAgZGVkdXBsaWNhdGlvblNjb3BlOiBwcm9wcy5kZWR1cGxpY2F0aW9uU2NvcGUsXG4gICAgICBmaWZvVGhyb3VnaHB1dExpbWl0OiBwcm9wcy5maWZvVGhyb3VnaHB1dExpbWl0LFxuICAgICAgZmlmb1F1ZXVlLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBpYW0gc3RhdGVtZW50IHRvIGVuZm9yY2UgZW5jcnlwdGlvbiBvZiBkYXRhIGluIHRyYW5zaXQuXG4gICAqL1xuICBwcml2YXRlIGVuZm9yY2VTU0xTdGF0ZW1lbnQoKSB7XG4gICAgY29uc3Qgc3RhdGVtZW50ID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydzcXM6KiddLFxuICAgICAgY29uZGl0aW9uczoge1xuICAgICAgICBCb29sOiB7ICdhd3M6U2VjdXJlVHJhbnNwb3J0JzogJ2ZhbHNlJyB9LFxuICAgICAgfSxcbiAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5ERU5ZLFxuICAgICAgcmVzb3VyY2VzOiBbdGhpcy5xdWV1ZUFybl0sXG4gICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5BbnlQcmluY2lwYWwoKV0sXG4gICAgfSk7XG4gICAgdGhpcy5hZGRUb1Jlc291cmNlUG9saWN5KHN0YXRlbWVudCk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIEZpZm9Qcm9wcyB7XG4gIHJlYWRvbmx5IGZpZm9RdWV1ZT86IGJvb2xlYW47XG4gIHJlYWRvbmx5IGNvbnRlbnRCYXNlZERlZHVwbGljYXRpb24/OiBib29sZWFuO1xuICByZWFkb25seSBkZWR1cGxpY2F0aW9uU2NvcGU/OiBEZWR1cGxpY2F0aW9uU2NvcGU7XG4gIHJlYWRvbmx5IGZpZm9UaHJvdWdocHV0TGltaXQ/OiBGaWZvVGhyb3VnaHB1dExpbWl0O1xufVxuXG5pbnRlcmZhY2UgRW5jcnlwdGlvblByb3BzIHtcbiAgcmVhZG9ubHkga21zTWFzdGVyS2V5SWQ/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IGttc0RhdGFLZXlSZXVzZVBlcmlvZFNlY29uZHM/OiBudW1iZXI7XG4gIHJlYWRvbmx5IHNxc01hbmFnZWRTc2VFbmFibGVkPzogYm9vbGVhbjtcbn1cbiJdfQ==