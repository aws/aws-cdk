function _aws_cdk_aws_mediaconvert_CfnJobTemplateProps(p) {
}
function _aws_cdk_aws_mediaconvert_CfnJobTemplate(p) {
}
function _aws_cdk_aws_mediaconvert_CfnJobTemplate_AccelerationSettingsProperty(p) {
}
function _aws_cdk_aws_mediaconvert_CfnJobTemplate_HopDestinationProperty(p) {
}
function _aws_cdk_aws_mediaconvert_CfnPresetProps(p) {
}
function _aws_cdk_aws_mediaconvert_CfnPreset(p) {
}
function _aws_cdk_aws_mediaconvert_CfnQueueProps(p) {
}
function _aws_cdk_aws_mediaconvert_CfnQueue(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_mediaconvert_CfnJobTemplateProps, _aws_cdk_aws_mediaconvert_CfnJobTemplate, _aws_cdk_aws_mediaconvert_CfnJobTemplate_AccelerationSettingsProperty, _aws_cdk_aws_mediaconvert_CfnJobTemplate_HopDestinationProperty, _aws_cdk_aws_mediaconvert_CfnPresetProps, _aws_cdk_aws_mediaconvert_CfnPreset, _aws_cdk_aws_mediaconvert_CfnQueueProps, _aws_cdk_aws_mediaconvert_CfnQueue };
