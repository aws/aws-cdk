function _aws_cdk_aws_sqs_QueuePolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.queues != null)
            for (const o of p.queues)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_sqs_IQueue(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_sqs_QueuePolicy(p) {
}
function _aws_cdk_aws_sqs_QueueProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.deadLetterQueue))
            _aws_cdk_aws_sqs_DeadLetterQueue(p.deadLetterQueue);
        if (!visitedObjects.has(p.deduplicationScope))
            _aws_cdk_aws_sqs_DeduplicationScope(p.deduplicationScope);
        if (!visitedObjects.has(p.encryption))
            _aws_cdk_aws_sqs_QueueEncryption(p.encryption);
        if (!visitedObjects.has(p.fifoThroughputLimit))
            _aws_cdk_aws_sqs_FifoThroughputLimit(p.fifoThroughputLimit);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_sqs_DeadLetterQueue(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.queue))
            _aws_cdk_aws_sqs_IQueue(p.queue);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_sqs_QueueEncryption(p) {
}
function _aws_cdk_aws_sqs_DeduplicationScope(p) {
}
function _aws_cdk_aws_sqs_FifoThroughputLimit(p) {
}
function _aws_cdk_aws_sqs_Queue(p) {
}
function _aws_cdk_aws_sqs_IQueue(p) {
}
function _aws_cdk_aws_sqs_QueueBase(p) {
}
function _aws_cdk_aws_sqs_QueueAttributes(p) {
}
function _aws_cdk_aws_sqs_CfnQueueProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_sqs_CfnQueue(p) {
}
function _aws_cdk_aws_sqs_CfnQueuePolicyProps(p) {
}
function _aws_cdk_aws_sqs_CfnQueuePolicy(p) {
}
function print(name, deprecationMessage) {
    const deprecated = process.env.JSII_DEPRECATED;
    const deprecationMode = ["warn", "fail", "quiet"].includes(deprecated) ? deprecated : "warn";
    const message = `${name} is deprecated.\n  ${deprecationMessage.trim()}\n  This API will be removed in the next major release.`;
    switch (deprecationMode) {
        case "fail":
            throw new DeprecationError(message);
        case "warn":
            console.warn("[WARNING]", message);
            break;
    }
}
function getPropertyDescriptor(obj, prop) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    if (descriptor) {
        return descriptor;
    }
    const proto = Object.getPrototypeOf(obj);
    const prototypeDescriptor = proto && getPropertyDescriptor(proto, prop);
    if (prototypeDescriptor) {
        return prototypeDescriptor;
    }
    return {};
}
const visitedObjects = new Set();
class DeprecationError extends Error {
    constructor(...args) {
        super(...args);
        Object.defineProperty(this, "name", {
            configurable: false,
            enumerable: true,
            value: "DeprecationError",
            writable: false,
        });
    }
}
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_sqs_QueuePolicyProps, _aws_cdk_aws_sqs_QueuePolicy, _aws_cdk_aws_sqs_QueueProps, _aws_cdk_aws_sqs_DeadLetterQueue, _aws_cdk_aws_sqs_QueueEncryption, _aws_cdk_aws_sqs_DeduplicationScope, _aws_cdk_aws_sqs_FifoThroughputLimit, _aws_cdk_aws_sqs_Queue, _aws_cdk_aws_sqs_IQueue, _aws_cdk_aws_sqs_QueueBase, _aws_cdk_aws_sqs_QueueAttributes, _aws_cdk_aws_sqs_CfnQueueProps, _aws_cdk_aws_sqs_CfnQueue, _aws_cdk_aws_sqs_CfnQueuePolicyProps, _aws_cdk_aws_sqs_CfnQueuePolicy };
