function _aws_cdk_aws_resourceexplorer2_CfnDefaultViewAssociationProps(p) {
}
function _aws_cdk_aws_resourceexplorer2_CfnDefaultViewAssociation(p) {
}
function _aws_cdk_aws_resourceexplorer2_CfnIndexProps(p) {
}
function _aws_cdk_aws_resourceexplorer2_CfnIndex(p) {
}
function _aws_cdk_aws_resourceexplorer2_CfnViewProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.filters))
            _aws_cdk_aws_resourceexplorer2_CfnView_FiltersProperty(p.filters);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_resourceexplorer2_CfnView(p) {
}
function _aws_cdk_aws_resourceexplorer2_CfnView_FiltersProperty(p) {
}
function _aws_cdk_aws_resourceexplorer2_CfnView_IncludedPropertyProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_resourceexplorer2_CfnDefaultViewAssociationProps, _aws_cdk_aws_resourceexplorer2_CfnDefaultViewAssociation, _aws_cdk_aws_resourceexplorer2_CfnIndexProps, _aws_cdk_aws_resourceexplorer2_CfnIndex, _aws_cdk_aws_resourceexplorer2_CfnViewProps, _aws_cdk_aws_resourceexplorer2_CfnView, _aws_cdk_aws_resourceexplorer2_CfnView_FiltersProperty, _aws_cdk_aws_resourceexplorer2_CfnView_IncludedPropertyProperty };
