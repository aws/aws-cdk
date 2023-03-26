function _aws_cdk_aws_panorama_CfnApplicationInstanceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.manifestPayload))
            _aws_cdk_aws_panorama_CfnApplicationInstance_ManifestPayloadProperty(p.manifestPayload);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_panorama_CfnApplicationInstance(p) {
}
function _aws_cdk_aws_panorama_CfnApplicationInstance_ManifestOverridesPayloadProperty(p) {
}
function _aws_cdk_aws_panorama_CfnApplicationInstance_ManifestPayloadProperty(p) {
}
function _aws_cdk_aws_panorama_CfnPackageProps(p) {
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
function _aws_cdk_aws_panorama_CfnPackage(p) {
}
function _aws_cdk_aws_panorama_CfnPackage_StorageLocationProperty(p) {
}
function _aws_cdk_aws_panorama_CfnPackageVersionProps(p) {
}
function _aws_cdk_aws_panorama_CfnPackageVersion(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_panorama_CfnApplicationInstanceProps, _aws_cdk_aws_panorama_CfnApplicationInstance, _aws_cdk_aws_panorama_CfnApplicationInstance_ManifestOverridesPayloadProperty, _aws_cdk_aws_panorama_CfnApplicationInstance_ManifestPayloadProperty, _aws_cdk_aws_panorama_CfnPackageProps, _aws_cdk_aws_panorama_CfnPackage, _aws_cdk_aws_panorama_CfnPackage_StorageLocationProperty, _aws_cdk_aws_panorama_CfnPackageVersionProps, _aws_cdk_aws_panorama_CfnPackageVersion };
