function _aws_cdk_aws_ssmcontacts_CfnContactProps(p) {
}
function _aws_cdk_aws_ssmcontacts_CfnContact(p) {
}
function _aws_cdk_aws_ssmcontacts_CfnContact_ChannelTargetInfoProperty(p) {
}
function _aws_cdk_aws_ssmcontacts_CfnContact_ContactTargetInfoProperty(p) {
}
function _aws_cdk_aws_ssmcontacts_CfnContact_StageProperty(p) {
}
function _aws_cdk_aws_ssmcontacts_CfnContact_TargetsProperty(p) {
}
function _aws_cdk_aws_ssmcontacts_CfnContactChannelProps(p) {
}
function _aws_cdk_aws_ssmcontacts_CfnContactChannel(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_ssmcontacts_CfnContactProps, _aws_cdk_aws_ssmcontacts_CfnContact, _aws_cdk_aws_ssmcontacts_CfnContact_ChannelTargetInfoProperty, _aws_cdk_aws_ssmcontacts_CfnContact_ContactTargetInfoProperty, _aws_cdk_aws_ssmcontacts_CfnContact_StageProperty, _aws_cdk_aws_ssmcontacts_CfnContact_TargetsProperty, _aws_cdk_aws_ssmcontacts_CfnContactChannelProps, _aws_cdk_aws_ssmcontacts_CfnContactChannel };
