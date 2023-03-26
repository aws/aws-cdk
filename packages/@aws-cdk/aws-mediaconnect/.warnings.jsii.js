function _aws_cdk_aws_mediaconnect_CfnFlowProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.source))
            _aws_cdk_aws_mediaconnect_CfnFlow_SourceProperty(p.source);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_mediaconnect_CfnFlow(p) {
}
function _aws_cdk_aws_mediaconnect_CfnFlow_EncryptionProperty(p) {
}
function _aws_cdk_aws_mediaconnect_CfnFlow_FailoverConfigProperty(p) {
}
function _aws_cdk_aws_mediaconnect_CfnFlow_SourceProperty(p) {
}
function _aws_cdk_aws_mediaconnect_CfnFlow_SourcePriorityProperty(p) {
}
function _aws_cdk_aws_mediaconnect_CfnFlowEntitlementProps(p) {
}
function _aws_cdk_aws_mediaconnect_CfnFlowEntitlement(p) {
}
function _aws_cdk_aws_mediaconnect_CfnFlowEntitlement_EncryptionProperty(p) {
}
function _aws_cdk_aws_mediaconnect_CfnFlowOutputProps(p) {
}
function _aws_cdk_aws_mediaconnect_CfnFlowOutput(p) {
}
function _aws_cdk_aws_mediaconnect_CfnFlowOutput_EncryptionProperty(p) {
}
function _aws_cdk_aws_mediaconnect_CfnFlowOutput_VpcInterfaceAttachmentProperty(p) {
}
function _aws_cdk_aws_mediaconnect_CfnFlowSourceProps(p) {
}
function _aws_cdk_aws_mediaconnect_CfnFlowSource(p) {
}
function _aws_cdk_aws_mediaconnect_CfnFlowSource_EncryptionProperty(p) {
}
function _aws_cdk_aws_mediaconnect_CfnFlowVpcInterfaceProps(p) {
}
function _aws_cdk_aws_mediaconnect_CfnFlowVpcInterface(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_mediaconnect_CfnFlowProps, _aws_cdk_aws_mediaconnect_CfnFlow, _aws_cdk_aws_mediaconnect_CfnFlow_EncryptionProperty, _aws_cdk_aws_mediaconnect_CfnFlow_FailoverConfigProperty, _aws_cdk_aws_mediaconnect_CfnFlow_SourceProperty, _aws_cdk_aws_mediaconnect_CfnFlow_SourcePriorityProperty, _aws_cdk_aws_mediaconnect_CfnFlowEntitlementProps, _aws_cdk_aws_mediaconnect_CfnFlowEntitlement, _aws_cdk_aws_mediaconnect_CfnFlowEntitlement_EncryptionProperty, _aws_cdk_aws_mediaconnect_CfnFlowOutputProps, _aws_cdk_aws_mediaconnect_CfnFlowOutput, _aws_cdk_aws_mediaconnect_CfnFlowOutput_EncryptionProperty, _aws_cdk_aws_mediaconnect_CfnFlowOutput_VpcInterfaceAttachmentProperty, _aws_cdk_aws_mediaconnect_CfnFlowSourceProps, _aws_cdk_aws_mediaconnect_CfnFlowSource, _aws_cdk_aws_mediaconnect_CfnFlowSource_EncryptionProperty, _aws_cdk_aws_mediaconnect_CfnFlowVpcInterfaceProps, _aws_cdk_aws_mediaconnect_CfnFlowVpcInterface };
