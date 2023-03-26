function _aws_cdk_aws_supportapp_CfnAccountAliasProps(p) {
}
function _aws_cdk_aws_supportapp_CfnAccountAlias(p) {
}
function _aws_cdk_aws_supportapp_CfnSlackChannelConfigurationProps(p) {
}
function _aws_cdk_aws_supportapp_CfnSlackChannelConfiguration(p) {
}
function _aws_cdk_aws_supportapp_CfnSlackWorkspaceConfigurationProps(p) {
}
function _aws_cdk_aws_supportapp_CfnSlackWorkspaceConfiguration(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_supportapp_CfnAccountAliasProps, _aws_cdk_aws_supportapp_CfnAccountAlias, _aws_cdk_aws_supportapp_CfnSlackChannelConfigurationProps, _aws_cdk_aws_supportapp_CfnSlackChannelConfiguration, _aws_cdk_aws_supportapp_CfnSlackWorkspaceConfigurationProps, _aws_cdk_aws_supportapp_CfnSlackWorkspaceConfiguration };
