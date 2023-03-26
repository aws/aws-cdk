function _aws_cdk_aws_memorydb_CfnACLProps(p) {
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
function _aws_cdk_aws_memorydb_CfnACL(p) {
}
function _aws_cdk_aws_memorydb_CfnClusterProps(p) {
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
function _aws_cdk_aws_memorydb_CfnCluster(p) {
}
function _aws_cdk_aws_memorydb_CfnCluster_EndpointProperty(p) {
}
function _aws_cdk_aws_memorydb_CfnParameterGroupProps(p) {
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
function _aws_cdk_aws_memorydb_CfnParameterGroup(p) {
}
function _aws_cdk_aws_memorydb_CfnSubnetGroupProps(p) {
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
function _aws_cdk_aws_memorydb_CfnSubnetGroup(p) {
}
function _aws_cdk_aws_memorydb_CfnUserProps(p) {
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
function _aws_cdk_aws_memorydb_CfnUser(p) {
}
function _aws_cdk_aws_memorydb_CfnUser_AuthenticationModeProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_memorydb_CfnACLProps, _aws_cdk_aws_memorydb_CfnACL, _aws_cdk_aws_memorydb_CfnClusterProps, _aws_cdk_aws_memorydb_CfnCluster, _aws_cdk_aws_memorydb_CfnCluster_EndpointProperty, _aws_cdk_aws_memorydb_CfnParameterGroupProps, _aws_cdk_aws_memorydb_CfnParameterGroup, _aws_cdk_aws_memorydb_CfnSubnetGroupProps, _aws_cdk_aws_memorydb_CfnSubnetGroup, _aws_cdk_aws_memorydb_CfnUserProps, _aws_cdk_aws_memorydb_CfnUser, _aws_cdk_aws_memorydb_CfnUser_AuthenticationModeProperty };
