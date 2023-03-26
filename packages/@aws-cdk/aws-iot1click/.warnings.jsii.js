function _aws_cdk_aws_iot1click_CfnDeviceProps(p) {
}
function _aws_cdk_aws_iot1click_CfnDevice(p) {
}
function _aws_cdk_aws_iot1click_CfnPlacementProps(p) {
}
function _aws_cdk_aws_iot1click_CfnPlacement(p) {
}
function _aws_cdk_aws_iot1click_CfnProjectProps(p) {
}
function _aws_cdk_aws_iot1click_CfnProject(p) {
}
function _aws_cdk_aws_iot1click_CfnProject_DeviceTemplateProperty(p) {
}
function _aws_cdk_aws_iot1click_CfnProject_PlacementTemplateProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_iot1click_CfnDeviceProps, _aws_cdk_aws_iot1click_CfnDevice, _aws_cdk_aws_iot1click_CfnPlacementProps, _aws_cdk_aws_iot1click_CfnPlacement, _aws_cdk_aws_iot1click_CfnProjectProps, _aws_cdk_aws_iot1click_CfnProject, _aws_cdk_aws_iot1click_CfnProject_DeviceTemplateProperty, _aws_cdk_aws_iot1click_CfnProject_PlacementTemplateProperty };
