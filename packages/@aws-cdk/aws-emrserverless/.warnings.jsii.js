function _aws_cdk_aws_emrserverless_CfnApplicationProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.autoStartConfiguration))
            _aws_cdk_aws_emrserverless_CfnApplication_AutoStartConfigurationProperty(p.autoStartConfiguration);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_emrserverless_CfnApplication(p) {
}
function _aws_cdk_aws_emrserverless_CfnApplication_AutoStartConfigurationProperty(p) {
}
function _aws_cdk_aws_emrserverless_CfnApplication_AutoStopConfigurationProperty(p) {
}
function _aws_cdk_aws_emrserverless_CfnApplication_InitialCapacityConfigProperty(p) {
}
function _aws_cdk_aws_emrserverless_CfnApplication_InitialCapacityConfigKeyValuePairProperty(p) {
}
function _aws_cdk_aws_emrserverless_CfnApplication_MaximumAllowedResourcesProperty(p) {
}
function _aws_cdk_aws_emrserverless_CfnApplication_NetworkConfigurationProperty(p) {
}
function _aws_cdk_aws_emrserverless_CfnApplication_WorkerConfigurationProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_emrserverless_CfnApplicationProps, _aws_cdk_aws_emrserverless_CfnApplication, _aws_cdk_aws_emrserverless_CfnApplication_AutoStartConfigurationProperty, _aws_cdk_aws_emrserverless_CfnApplication_AutoStopConfigurationProperty, _aws_cdk_aws_emrserverless_CfnApplication_InitialCapacityConfigProperty, _aws_cdk_aws_emrserverless_CfnApplication_InitialCapacityConfigKeyValuePairProperty, _aws_cdk_aws_emrserverless_CfnApplication_MaximumAllowedResourcesProperty, _aws_cdk_aws_emrserverless_CfnApplication_NetworkConfigurationProperty, _aws_cdk_aws_emrserverless_CfnApplication_WorkerConfigurationProperty };
