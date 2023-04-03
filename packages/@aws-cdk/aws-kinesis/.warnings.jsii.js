function _aws_cdk_aws_kinesis_IStream(p) {
}
function _aws_cdk_aws_kinesis_StreamAttributes(p) {
}
function _aws_cdk_aws_kinesis_StreamProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.encryption))
            _aws_cdk_aws_kinesis_StreamEncryption(p.encryption);
        if (!visitedObjects.has(p.streamMode))
            _aws_cdk_aws_kinesis_StreamMode(p.streamMode);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_kinesis_Stream(p) {
}
function _aws_cdk_aws_kinesis_StreamEncryption(p) {
}
function _aws_cdk_aws_kinesis_StreamMode(p) {
}
function _aws_cdk_aws_kinesis_CfnStreamProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.streamEncryption))
            _aws_cdk_aws_kinesis_CfnStream_StreamEncryptionProperty(p.streamEncryption);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_kinesis_CfnStream(p) {
}
function _aws_cdk_aws_kinesis_CfnStream_StreamEncryptionProperty(p) {
}
function _aws_cdk_aws_kinesis_CfnStream_StreamModeDetailsProperty(p) {
}
function _aws_cdk_aws_kinesis_CfnStreamConsumerProps(p) {
}
function _aws_cdk_aws_kinesis_CfnStreamConsumer(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_kinesis_IStream, _aws_cdk_aws_kinesis_StreamAttributes, _aws_cdk_aws_kinesis_StreamProps, _aws_cdk_aws_kinesis_Stream, _aws_cdk_aws_kinesis_StreamEncryption, _aws_cdk_aws_kinesis_StreamMode, _aws_cdk_aws_kinesis_CfnStreamProps, _aws_cdk_aws_kinesis_CfnStream, _aws_cdk_aws_kinesis_CfnStream_StreamEncryptionProperty, _aws_cdk_aws_kinesis_CfnStream_StreamModeDetailsProperty, _aws_cdk_aws_kinesis_CfnStreamConsumerProps, _aws_cdk_aws_kinesis_CfnStreamConsumer };
