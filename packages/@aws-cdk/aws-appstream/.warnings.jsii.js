function _aws_cdk_aws_appstream_CfnAppBlockProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.setupScriptDetails))
            _aws_cdk_aws_appstream_CfnAppBlock_ScriptDetailsProperty(p.setupScriptDetails);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appstream_CfnAppBlock(p) {
}
function _aws_cdk_aws_appstream_CfnAppBlock_S3LocationProperty(p) {
}
function _aws_cdk_aws_appstream_CfnAppBlock_ScriptDetailsProperty(p) {
}
function _aws_cdk_aws_appstream_CfnApplicationProps(p) {
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
function _aws_cdk_aws_appstream_CfnApplication(p) {
}
function _aws_cdk_aws_appstream_CfnApplication_S3LocationProperty(p) {
}
function _aws_cdk_aws_appstream_CfnApplicationEntitlementAssociationProps(p) {
}
function _aws_cdk_aws_appstream_CfnApplicationEntitlementAssociation(p) {
}
function _aws_cdk_aws_appstream_CfnApplicationFleetAssociationProps(p) {
}
function _aws_cdk_aws_appstream_CfnApplicationFleetAssociation(p) {
}
function _aws_cdk_aws_appstream_CfnDirectoryConfigProps(p) {
}
function _aws_cdk_aws_appstream_CfnDirectoryConfig(p) {
}
function _aws_cdk_aws_appstream_CfnDirectoryConfig_CertificateBasedAuthPropertiesProperty(p) {
}
function _aws_cdk_aws_appstream_CfnDirectoryConfig_ServiceAccountCredentialsProperty(p) {
}
function _aws_cdk_aws_appstream_CfnEntitlementProps(p) {
}
function _aws_cdk_aws_appstream_CfnEntitlement(p) {
}
function _aws_cdk_aws_appstream_CfnEntitlement_AttributeProperty(p) {
}
function _aws_cdk_aws_appstream_CfnFleetProps(p) {
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
function _aws_cdk_aws_appstream_CfnFleet(p) {
}
function _aws_cdk_aws_appstream_CfnFleet_ComputeCapacityProperty(p) {
}
function _aws_cdk_aws_appstream_CfnFleet_DomainJoinInfoProperty(p) {
}
function _aws_cdk_aws_appstream_CfnFleet_S3LocationProperty(p) {
}
function _aws_cdk_aws_appstream_CfnFleet_VpcConfigProperty(p) {
}
function _aws_cdk_aws_appstream_CfnImageBuilderProps(p) {
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
function _aws_cdk_aws_appstream_CfnImageBuilder(p) {
}
function _aws_cdk_aws_appstream_CfnImageBuilder_AccessEndpointProperty(p) {
}
function _aws_cdk_aws_appstream_CfnImageBuilder_DomainJoinInfoProperty(p) {
}
function _aws_cdk_aws_appstream_CfnImageBuilder_VpcConfigProperty(p) {
}
function _aws_cdk_aws_appstream_CfnStackProps(p) {
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
function _aws_cdk_aws_appstream_CfnStack(p) {
}
function _aws_cdk_aws_appstream_CfnStack_AccessEndpointProperty(p) {
}
function _aws_cdk_aws_appstream_CfnStack_ApplicationSettingsProperty(p) {
}
function _aws_cdk_aws_appstream_CfnStack_StorageConnectorProperty(p) {
}
function _aws_cdk_aws_appstream_CfnStack_StreamingExperienceSettingsProperty(p) {
}
function _aws_cdk_aws_appstream_CfnStack_UserSettingProperty(p) {
}
function _aws_cdk_aws_appstream_CfnStackFleetAssociationProps(p) {
}
function _aws_cdk_aws_appstream_CfnStackFleetAssociation(p) {
}
function _aws_cdk_aws_appstream_CfnStackUserAssociationProps(p) {
}
function _aws_cdk_aws_appstream_CfnStackUserAssociation(p) {
}
function _aws_cdk_aws_appstream_CfnUserProps(p) {
}
function _aws_cdk_aws_appstream_CfnUser(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_appstream_CfnAppBlockProps, _aws_cdk_aws_appstream_CfnAppBlock, _aws_cdk_aws_appstream_CfnAppBlock_S3LocationProperty, _aws_cdk_aws_appstream_CfnAppBlock_ScriptDetailsProperty, _aws_cdk_aws_appstream_CfnApplicationProps, _aws_cdk_aws_appstream_CfnApplication, _aws_cdk_aws_appstream_CfnApplication_S3LocationProperty, _aws_cdk_aws_appstream_CfnApplicationEntitlementAssociationProps, _aws_cdk_aws_appstream_CfnApplicationEntitlementAssociation, _aws_cdk_aws_appstream_CfnApplicationFleetAssociationProps, _aws_cdk_aws_appstream_CfnApplicationFleetAssociation, _aws_cdk_aws_appstream_CfnDirectoryConfigProps, _aws_cdk_aws_appstream_CfnDirectoryConfig, _aws_cdk_aws_appstream_CfnDirectoryConfig_CertificateBasedAuthPropertiesProperty, _aws_cdk_aws_appstream_CfnDirectoryConfig_ServiceAccountCredentialsProperty, _aws_cdk_aws_appstream_CfnEntitlementProps, _aws_cdk_aws_appstream_CfnEntitlement, _aws_cdk_aws_appstream_CfnEntitlement_AttributeProperty, _aws_cdk_aws_appstream_CfnFleetProps, _aws_cdk_aws_appstream_CfnFleet, _aws_cdk_aws_appstream_CfnFleet_ComputeCapacityProperty, _aws_cdk_aws_appstream_CfnFleet_DomainJoinInfoProperty, _aws_cdk_aws_appstream_CfnFleet_S3LocationProperty, _aws_cdk_aws_appstream_CfnFleet_VpcConfigProperty, _aws_cdk_aws_appstream_CfnImageBuilderProps, _aws_cdk_aws_appstream_CfnImageBuilder, _aws_cdk_aws_appstream_CfnImageBuilder_AccessEndpointProperty, _aws_cdk_aws_appstream_CfnImageBuilder_DomainJoinInfoProperty, _aws_cdk_aws_appstream_CfnImageBuilder_VpcConfigProperty, _aws_cdk_aws_appstream_CfnStackProps, _aws_cdk_aws_appstream_CfnStack, _aws_cdk_aws_appstream_CfnStack_AccessEndpointProperty, _aws_cdk_aws_appstream_CfnStack_ApplicationSettingsProperty, _aws_cdk_aws_appstream_CfnStack_StorageConnectorProperty, _aws_cdk_aws_appstream_CfnStack_StreamingExperienceSettingsProperty, _aws_cdk_aws_appstream_CfnStack_UserSettingProperty, _aws_cdk_aws_appstream_CfnStackFleetAssociationProps, _aws_cdk_aws_appstream_CfnStackFleetAssociation, _aws_cdk_aws_appstream_CfnStackUserAssociationProps, _aws_cdk_aws_appstream_CfnStackUserAssociation, _aws_cdk_aws_appstream_CfnUserProps, _aws_cdk_aws_appstream_CfnUser };
