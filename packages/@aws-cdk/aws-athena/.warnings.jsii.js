function _aws_cdk_aws_athena_CfnDataCatalogProps(p) {
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
function _aws_cdk_aws_athena_CfnDataCatalog(p) {
}
function _aws_cdk_aws_athena_CfnNamedQueryProps(p) {
}
function _aws_cdk_aws_athena_CfnNamedQuery(p) {
}
function _aws_cdk_aws_athena_CfnPreparedStatementProps(p) {
}
function _aws_cdk_aws_athena_CfnPreparedStatement(p) {
}
function _aws_cdk_aws_athena_CfnWorkGroupProps(p) {
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
function _aws_cdk_aws_athena_CfnWorkGroup(p) {
}
function _aws_cdk_aws_athena_CfnWorkGroup_EncryptionConfigurationProperty(p) {
}
function _aws_cdk_aws_athena_CfnWorkGroup_EngineVersionProperty(p) {
}
function _aws_cdk_aws_athena_CfnWorkGroup_ResultConfigurationProperty(p) {
}
function _aws_cdk_aws_athena_CfnWorkGroup_WorkGroupConfigurationProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_athena_CfnDataCatalogProps, _aws_cdk_aws_athena_CfnDataCatalog, _aws_cdk_aws_athena_CfnNamedQueryProps, _aws_cdk_aws_athena_CfnNamedQuery, _aws_cdk_aws_athena_CfnPreparedStatementProps, _aws_cdk_aws_athena_CfnPreparedStatement, _aws_cdk_aws_athena_CfnWorkGroupProps, _aws_cdk_aws_athena_CfnWorkGroup, _aws_cdk_aws_athena_CfnWorkGroup_EncryptionConfigurationProperty, _aws_cdk_aws_athena_CfnWorkGroup_EngineVersionProperty, _aws_cdk_aws_athena_CfnWorkGroup_ResultConfigurationProperty, _aws_cdk_aws_athena_CfnWorkGroup_WorkGroupConfigurationProperty };
