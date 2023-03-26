function _aws_cdk_aws_networkmanager_CfnConnectAttachmentProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.options))
            _aws_cdk_aws_networkmanager_CfnConnectAttachment_ConnectAttachmentOptionsProperty(p.options);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_networkmanager_CfnConnectAttachment(p) {
}
function _aws_cdk_aws_networkmanager_CfnConnectAttachment_ConnectAttachmentOptionsProperty(p) {
}
function _aws_cdk_aws_networkmanager_CfnConnectAttachment_ProposedSegmentChangeProperty(p) {
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
function _aws_cdk_aws_networkmanager_CfnConnectPeerProps(p) {
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
function _aws_cdk_aws_networkmanager_CfnConnectPeer(p) {
}
function _aws_cdk_aws_networkmanager_CfnConnectPeer_BgpOptionsProperty(p) {
}
function _aws_cdk_aws_networkmanager_CfnConnectPeer_ConnectPeerBgpConfigurationProperty(p) {
}
function _aws_cdk_aws_networkmanager_CfnConnectPeer_ConnectPeerConfigurationProperty(p) {
}
function _aws_cdk_aws_networkmanager_CfnCoreNetworkProps(p) {
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
function _aws_cdk_aws_networkmanager_CfnCoreNetwork(p) {
}
function _aws_cdk_aws_networkmanager_CfnCoreNetwork_CoreNetworkEdgeProperty(p) {
}
function _aws_cdk_aws_networkmanager_CfnCoreNetwork_CoreNetworkSegmentProperty(p) {
}
function _aws_cdk_aws_networkmanager_CfnCustomerGatewayAssociationProps(p) {
}
function _aws_cdk_aws_networkmanager_CfnCustomerGatewayAssociation(p) {
}
function _aws_cdk_aws_networkmanager_CfnDeviceProps(p) {
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
function _aws_cdk_aws_networkmanager_CfnDevice(p) {
}
function _aws_cdk_aws_networkmanager_CfnDevice_LocationProperty(p) {
}
function _aws_cdk_aws_networkmanager_CfnGlobalNetworkProps(p) {
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
function _aws_cdk_aws_networkmanager_CfnGlobalNetwork(p) {
}
function _aws_cdk_aws_networkmanager_CfnLinkProps(p) {
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
function _aws_cdk_aws_networkmanager_CfnLink(p) {
}
function _aws_cdk_aws_networkmanager_CfnLink_BandwidthProperty(p) {
}
function _aws_cdk_aws_networkmanager_CfnLinkAssociationProps(p) {
}
function _aws_cdk_aws_networkmanager_CfnLinkAssociation(p) {
}
function _aws_cdk_aws_networkmanager_CfnSiteProps(p) {
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
function _aws_cdk_aws_networkmanager_CfnSite(p) {
}
function _aws_cdk_aws_networkmanager_CfnSite_LocationProperty(p) {
}
function _aws_cdk_aws_networkmanager_CfnSiteToSiteVpnAttachmentProps(p) {
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
function _aws_cdk_aws_networkmanager_CfnSiteToSiteVpnAttachment(p) {
}
function _aws_cdk_aws_networkmanager_CfnSiteToSiteVpnAttachment_ProposedSegmentChangeProperty(p) {
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
function _aws_cdk_aws_networkmanager_CfnTransitGatewayRegistrationProps(p) {
}
function _aws_cdk_aws_networkmanager_CfnTransitGatewayRegistration(p) {
}
function _aws_cdk_aws_networkmanager_CfnVpcAttachmentProps(p) {
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
function _aws_cdk_aws_networkmanager_CfnVpcAttachment(p) {
}
function _aws_cdk_aws_networkmanager_CfnVpcAttachment_ProposedSegmentChangeProperty(p) {
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
function _aws_cdk_aws_networkmanager_CfnVpcAttachment_VpcOptionsProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_networkmanager_CfnConnectAttachmentProps, _aws_cdk_aws_networkmanager_CfnConnectAttachment, _aws_cdk_aws_networkmanager_CfnConnectAttachment_ConnectAttachmentOptionsProperty, _aws_cdk_aws_networkmanager_CfnConnectAttachment_ProposedSegmentChangeProperty, _aws_cdk_aws_networkmanager_CfnConnectPeerProps, _aws_cdk_aws_networkmanager_CfnConnectPeer, _aws_cdk_aws_networkmanager_CfnConnectPeer_BgpOptionsProperty, _aws_cdk_aws_networkmanager_CfnConnectPeer_ConnectPeerBgpConfigurationProperty, _aws_cdk_aws_networkmanager_CfnConnectPeer_ConnectPeerConfigurationProperty, _aws_cdk_aws_networkmanager_CfnCoreNetworkProps, _aws_cdk_aws_networkmanager_CfnCoreNetwork, _aws_cdk_aws_networkmanager_CfnCoreNetwork_CoreNetworkEdgeProperty, _aws_cdk_aws_networkmanager_CfnCoreNetwork_CoreNetworkSegmentProperty, _aws_cdk_aws_networkmanager_CfnCustomerGatewayAssociationProps, _aws_cdk_aws_networkmanager_CfnCustomerGatewayAssociation, _aws_cdk_aws_networkmanager_CfnDeviceProps, _aws_cdk_aws_networkmanager_CfnDevice, _aws_cdk_aws_networkmanager_CfnDevice_LocationProperty, _aws_cdk_aws_networkmanager_CfnGlobalNetworkProps, _aws_cdk_aws_networkmanager_CfnGlobalNetwork, _aws_cdk_aws_networkmanager_CfnLinkProps, _aws_cdk_aws_networkmanager_CfnLink, _aws_cdk_aws_networkmanager_CfnLink_BandwidthProperty, _aws_cdk_aws_networkmanager_CfnLinkAssociationProps, _aws_cdk_aws_networkmanager_CfnLinkAssociation, _aws_cdk_aws_networkmanager_CfnSiteProps, _aws_cdk_aws_networkmanager_CfnSite, _aws_cdk_aws_networkmanager_CfnSite_LocationProperty, _aws_cdk_aws_networkmanager_CfnSiteToSiteVpnAttachmentProps, _aws_cdk_aws_networkmanager_CfnSiteToSiteVpnAttachment, _aws_cdk_aws_networkmanager_CfnSiteToSiteVpnAttachment_ProposedSegmentChangeProperty, _aws_cdk_aws_networkmanager_CfnTransitGatewayRegistrationProps, _aws_cdk_aws_networkmanager_CfnTransitGatewayRegistration, _aws_cdk_aws_networkmanager_CfnVpcAttachmentProps, _aws_cdk_aws_networkmanager_CfnVpcAttachment, _aws_cdk_aws_networkmanager_CfnVpcAttachment_ProposedSegmentChangeProperty, _aws_cdk_aws_networkmanager_CfnVpcAttachment_VpcOptionsProperty };
