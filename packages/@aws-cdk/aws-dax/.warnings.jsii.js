function _aws_cdk_aws_dax_CfnClusterProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.sseSpecification))
            _aws_cdk_aws_dax_CfnCluster_SSESpecificationProperty(p.sseSpecification);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_dax_CfnCluster(p) {
}
function _aws_cdk_aws_dax_CfnCluster_SSESpecificationProperty(p) {
}
function _aws_cdk_aws_dax_CfnParameterGroupProps(p) {
}
function _aws_cdk_aws_dax_CfnParameterGroup(p) {
}
function _aws_cdk_aws_dax_CfnSubnetGroupProps(p) {
}
function _aws_cdk_aws_dax_CfnSubnetGroup(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_dax_CfnClusterProps, _aws_cdk_aws_dax_CfnCluster, _aws_cdk_aws_dax_CfnCluster_SSESpecificationProperty, _aws_cdk_aws_dax_CfnParameterGroupProps, _aws_cdk_aws_dax_CfnParameterGroup, _aws_cdk_aws_dax_CfnSubnetGroupProps, _aws_cdk_aws_dax_CfnSubnetGroup };
