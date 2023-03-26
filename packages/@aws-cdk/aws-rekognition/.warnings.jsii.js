function _aws_cdk_aws_rekognition_CfnCollectionProps(p) {
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
function _aws_cdk_aws_rekognition_CfnCollection(p) {
}
function _aws_cdk_aws_rekognition_CfnProjectProps(p) {
}
function _aws_cdk_aws_rekognition_CfnProject(p) {
}
function _aws_cdk_aws_rekognition_CfnStreamProcessorProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.kinesisVideoStream))
            _aws_cdk_aws_rekognition_CfnStreamProcessor_KinesisVideoStreamProperty(p.kinesisVideoStream);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_rekognition_CfnStreamProcessor(p) {
}
function _aws_cdk_aws_rekognition_CfnStreamProcessor_BoundingBoxProperty(p) {
}
function _aws_cdk_aws_rekognition_CfnStreamProcessor_ConnectedHomeSettingsProperty(p) {
}
function _aws_cdk_aws_rekognition_CfnStreamProcessor_DataSharingPreferenceProperty(p) {
}
function _aws_cdk_aws_rekognition_CfnStreamProcessor_FaceSearchSettingsProperty(p) {
}
function _aws_cdk_aws_rekognition_CfnStreamProcessor_KinesisDataStreamProperty(p) {
}
function _aws_cdk_aws_rekognition_CfnStreamProcessor_KinesisVideoStreamProperty(p) {
}
function _aws_cdk_aws_rekognition_CfnStreamProcessor_NotificationChannelProperty(p) {
}
function _aws_cdk_aws_rekognition_CfnStreamProcessor_S3DestinationProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_rekognition_CfnCollectionProps, _aws_cdk_aws_rekognition_CfnCollection, _aws_cdk_aws_rekognition_CfnProjectProps, _aws_cdk_aws_rekognition_CfnProject, _aws_cdk_aws_rekognition_CfnStreamProcessorProps, _aws_cdk_aws_rekognition_CfnStreamProcessor, _aws_cdk_aws_rekognition_CfnStreamProcessor_BoundingBoxProperty, _aws_cdk_aws_rekognition_CfnStreamProcessor_ConnectedHomeSettingsProperty, _aws_cdk_aws_rekognition_CfnStreamProcessor_DataSharingPreferenceProperty, _aws_cdk_aws_rekognition_CfnStreamProcessor_FaceSearchSettingsProperty, _aws_cdk_aws_rekognition_CfnStreamProcessor_KinesisDataStreamProperty, _aws_cdk_aws_rekognition_CfnStreamProcessor_KinesisVideoStreamProperty, _aws_cdk_aws_rekognition_CfnStreamProcessor_NotificationChannelProperty, _aws_cdk_aws_rekognition_CfnStreamProcessor_S3DestinationProperty };
