function _aws_cdk_aws_m2_CfnApplicationProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.definition))
            _aws_cdk_aws_m2_CfnApplication_DefinitionProperty(p.definition);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_m2_CfnApplication(p) {
}
function _aws_cdk_aws_m2_CfnApplication_DefinitionProperty(p) {
}
function _aws_cdk_aws_m2_CfnEnvironmentProps(p) {
}
function _aws_cdk_aws_m2_CfnEnvironment(p) {
}
function _aws_cdk_aws_m2_CfnEnvironment_EfsStorageConfigurationProperty(p) {
}
function _aws_cdk_aws_m2_CfnEnvironment_FsxStorageConfigurationProperty(p) {
}
function _aws_cdk_aws_m2_CfnEnvironment_HighAvailabilityConfigProperty(p) {
}
function _aws_cdk_aws_m2_CfnEnvironment_StorageConfigurationProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_m2_CfnApplicationProps, _aws_cdk_aws_m2_CfnApplication, _aws_cdk_aws_m2_CfnApplication_DefinitionProperty, _aws_cdk_aws_m2_CfnEnvironmentProps, _aws_cdk_aws_m2_CfnEnvironment, _aws_cdk_aws_m2_CfnEnvironment_EfsStorageConfigurationProperty, _aws_cdk_aws_m2_CfnEnvironment_FsxStorageConfigurationProperty, _aws_cdk_aws_m2_CfnEnvironment_HighAvailabilityConfigProperty, _aws_cdk_aws_m2_CfnEnvironment_StorageConfigurationProperty };
