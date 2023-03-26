function _aws_cdk_aws_mediapackage_CfnAssetProps(p) {
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
function _aws_cdk_aws_mediapackage_CfnAsset(p) {
}
function _aws_cdk_aws_mediapackage_CfnAsset_EgressEndpointProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnChannelProps(p) {
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
function _aws_cdk_aws_mediapackage_CfnChannel(p) {
}
function _aws_cdk_aws_mediapackage_CfnChannel_HlsIngestProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnChannel_IngestEndpointProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnChannel_LogConfigurationProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnOriginEndpointProps(p) {
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
function _aws_cdk_aws_mediapackage_CfnOriginEndpoint(p) {
}
function _aws_cdk_aws_mediapackage_CfnOriginEndpoint_AuthorizationProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnOriginEndpoint_CmafEncryptionProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnOriginEndpoint_CmafPackageProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnOriginEndpoint_DashEncryptionProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnOriginEndpoint_DashPackageProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnOriginEndpoint_EncryptionContractConfigurationProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnOriginEndpoint_HlsEncryptionProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnOriginEndpoint_HlsManifestProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnOriginEndpoint_HlsPackageProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnOriginEndpoint_MssEncryptionProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnOriginEndpoint_MssPackageProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnOriginEndpoint_SpekeKeyProviderProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnOriginEndpoint_StreamSelectionProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnPackagingConfigurationProps(p) {
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
function _aws_cdk_aws_mediapackage_CfnPackagingConfiguration(p) {
}
function _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_CmafEncryptionProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_CmafPackageProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_DashEncryptionProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_DashManifestProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_DashPackageProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_EncryptionContractConfigurationProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_HlsEncryptionProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_HlsManifestProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_HlsPackageProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_MssEncryptionProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_MssManifestProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_MssPackageProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_SpekeKeyProviderProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_StreamSelectionProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnPackagingGroupProps(p) {
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
function _aws_cdk_aws_mediapackage_CfnPackagingGroup(p) {
}
function _aws_cdk_aws_mediapackage_CfnPackagingGroup_AuthorizationProperty(p) {
}
function _aws_cdk_aws_mediapackage_CfnPackagingGroup_LogConfigurationProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_mediapackage_CfnAssetProps, _aws_cdk_aws_mediapackage_CfnAsset, _aws_cdk_aws_mediapackage_CfnAsset_EgressEndpointProperty, _aws_cdk_aws_mediapackage_CfnChannelProps, _aws_cdk_aws_mediapackage_CfnChannel, _aws_cdk_aws_mediapackage_CfnChannel_HlsIngestProperty, _aws_cdk_aws_mediapackage_CfnChannel_IngestEndpointProperty, _aws_cdk_aws_mediapackage_CfnChannel_LogConfigurationProperty, _aws_cdk_aws_mediapackage_CfnOriginEndpointProps, _aws_cdk_aws_mediapackage_CfnOriginEndpoint, _aws_cdk_aws_mediapackage_CfnOriginEndpoint_AuthorizationProperty, _aws_cdk_aws_mediapackage_CfnOriginEndpoint_CmafEncryptionProperty, _aws_cdk_aws_mediapackage_CfnOriginEndpoint_CmafPackageProperty, _aws_cdk_aws_mediapackage_CfnOriginEndpoint_DashEncryptionProperty, _aws_cdk_aws_mediapackage_CfnOriginEndpoint_DashPackageProperty, _aws_cdk_aws_mediapackage_CfnOriginEndpoint_EncryptionContractConfigurationProperty, _aws_cdk_aws_mediapackage_CfnOriginEndpoint_HlsEncryptionProperty, _aws_cdk_aws_mediapackage_CfnOriginEndpoint_HlsManifestProperty, _aws_cdk_aws_mediapackage_CfnOriginEndpoint_HlsPackageProperty, _aws_cdk_aws_mediapackage_CfnOriginEndpoint_MssEncryptionProperty, _aws_cdk_aws_mediapackage_CfnOriginEndpoint_MssPackageProperty, _aws_cdk_aws_mediapackage_CfnOriginEndpoint_SpekeKeyProviderProperty, _aws_cdk_aws_mediapackage_CfnOriginEndpoint_StreamSelectionProperty, _aws_cdk_aws_mediapackage_CfnPackagingConfigurationProps, _aws_cdk_aws_mediapackage_CfnPackagingConfiguration, _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_CmafEncryptionProperty, _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_CmafPackageProperty, _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_DashEncryptionProperty, _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_DashManifestProperty, _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_DashPackageProperty, _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_EncryptionContractConfigurationProperty, _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_HlsEncryptionProperty, _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_HlsManifestProperty, _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_HlsPackageProperty, _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_MssEncryptionProperty, _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_MssManifestProperty, _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_MssPackageProperty, _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_SpekeKeyProviderProperty, _aws_cdk_aws_mediapackage_CfnPackagingConfiguration_StreamSelectionProperty, _aws_cdk_aws_mediapackage_CfnPackagingGroupProps, _aws_cdk_aws_mediapackage_CfnPackagingGroup, _aws_cdk_aws_mediapackage_CfnPackagingGroup_AuthorizationProperty, _aws_cdk_aws_mediapackage_CfnPackagingGroup_LogConfigurationProperty };
