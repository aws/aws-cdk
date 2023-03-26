function _aws_cdk_aws_redshiftserverless_CfnNamespaceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.namespace))
            _aws_cdk_aws_redshiftserverless_CfnNamespace_NamespaceProperty(p.namespace);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_redshiftserverless_CfnNamespace(p) {
}
function _aws_cdk_aws_redshiftserverless_CfnNamespace_NamespaceProperty(p) {
}
function _aws_cdk_aws_redshiftserverless_CfnWorkgroupProps(p) {
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
function _aws_cdk_aws_redshiftserverless_CfnWorkgroup(p) {
}
function _aws_cdk_aws_redshiftserverless_CfnWorkgroup_ConfigParameterProperty(p) {
}
function _aws_cdk_aws_redshiftserverless_CfnWorkgroup_EndpointProperty(p) {
}
function _aws_cdk_aws_redshiftserverless_CfnWorkgroup_NetworkInterfaceProperty(p) {
}
function _aws_cdk_aws_redshiftserverless_CfnWorkgroup_VpcEndpointProperty(p) {
}
function _aws_cdk_aws_redshiftserverless_CfnWorkgroup_WorkgroupProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_redshiftserverless_CfnNamespaceProps, _aws_cdk_aws_redshiftserverless_CfnNamespace, _aws_cdk_aws_redshiftserverless_CfnNamespace_NamespaceProperty, _aws_cdk_aws_redshiftserverless_CfnWorkgroupProps, _aws_cdk_aws_redshiftserverless_CfnWorkgroup, _aws_cdk_aws_redshiftserverless_CfnWorkgroup_ConfigParameterProperty, _aws_cdk_aws_redshiftserverless_CfnWorkgroup_EndpointProperty, _aws_cdk_aws_redshiftserverless_CfnWorkgroup_NetworkInterfaceProperty, _aws_cdk_aws_redshiftserverless_CfnWorkgroup_VpcEndpointProperty, _aws_cdk_aws_redshiftserverless_CfnWorkgroup_WorkgroupProperty };
