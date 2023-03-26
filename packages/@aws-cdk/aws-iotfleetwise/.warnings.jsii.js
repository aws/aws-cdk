function _aws_cdk_aws_iotfleetwise_CfnCampaignProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.collectionScheme))
            _aws_cdk_aws_iotfleetwise_CfnCampaign_CollectionSchemeProperty(p.collectionScheme);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_iotfleetwise_CfnCampaign(p) {
}
function _aws_cdk_aws_iotfleetwise_CfnCampaign_CollectionSchemeProperty(p) {
}
function _aws_cdk_aws_iotfleetwise_CfnCampaign_ConditionBasedCollectionSchemeProperty(p) {
}
function _aws_cdk_aws_iotfleetwise_CfnCampaign_SignalInformationProperty(p) {
}
function _aws_cdk_aws_iotfleetwise_CfnCampaign_TimeBasedCollectionSchemeProperty(p) {
}
function _aws_cdk_aws_iotfleetwise_CfnDecoderManifestProps(p) {
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
function _aws_cdk_aws_iotfleetwise_CfnDecoderManifest(p) {
}
function _aws_cdk_aws_iotfleetwise_CfnDecoderManifest_CanInterfaceProperty(p) {
}
function _aws_cdk_aws_iotfleetwise_CfnDecoderManifest_CanSignalProperty(p) {
}
function _aws_cdk_aws_iotfleetwise_CfnDecoderManifest_NetworkInterfacesItemsProperty(p) {
}
function _aws_cdk_aws_iotfleetwise_CfnDecoderManifest_ObdInterfaceProperty(p) {
}
function _aws_cdk_aws_iotfleetwise_CfnDecoderManifest_ObdSignalProperty(p) {
}
function _aws_cdk_aws_iotfleetwise_CfnDecoderManifest_SignalDecodersItemsProperty(p) {
}
function _aws_cdk_aws_iotfleetwise_CfnFleetProps(p) {
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
function _aws_cdk_aws_iotfleetwise_CfnFleet(p) {
}
function _aws_cdk_aws_iotfleetwise_CfnModelManifestProps(p) {
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
function _aws_cdk_aws_iotfleetwise_CfnModelManifest(p) {
}
function _aws_cdk_aws_iotfleetwise_CfnSignalCatalogProps(p) {
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
function _aws_cdk_aws_iotfleetwise_CfnSignalCatalog(p) {
}
function _aws_cdk_aws_iotfleetwise_CfnSignalCatalog_ActuatorProperty(p) {
}
function _aws_cdk_aws_iotfleetwise_CfnSignalCatalog_AttributeProperty(p) {
}
function _aws_cdk_aws_iotfleetwise_CfnSignalCatalog_BranchProperty(p) {
}
function _aws_cdk_aws_iotfleetwise_CfnSignalCatalog_NodeProperty(p) {
}
function _aws_cdk_aws_iotfleetwise_CfnSignalCatalog_NodeCountsProperty(p) {
}
function _aws_cdk_aws_iotfleetwise_CfnSignalCatalog_SensorProperty(p) {
}
function _aws_cdk_aws_iotfleetwise_CfnVehicleProps(p) {
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
function _aws_cdk_aws_iotfleetwise_CfnVehicle(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_iotfleetwise_CfnCampaignProps, _aws_cdk_aws_iotfleetwise_CfnCampaign, _aws_cdk_aws_iotfleetwise_CfnCampaign_CollectionSchemeProperty, _aws_cdk_aws_iotfleetwise_CfnCampaign_ConditionBasedCollectionSchemeProperty, _aws_cdk_aws_iotfleetwise_CfnCampaign_SignalInformationProperty, _aws_cdk_aws_iotfleetwise_CfnCampaign_TimeBasedCollectionSchemeProperty, _aws_cdk_aws_iotfleetwise_CfnDecoderManifestProps, _aws_cdk_aws_iotfleetwise_CfnDecoderManifest, _aws_cdk_aws_iotfleetwise_CfnDecoderManifest_CanInterfaceProperty, _aws_cdk_aws_iotfleetwise_CfnDecoderManifest_CanSignalProperty, _aws_cdk_aws_iotfleetwise_CfnDecoderManifest_NetworkInterfacesItemsProperty, _aws_cdk_aws_iotfleetwise_CfnDecoderManifest_ObdInterfaceProperty, _aws_cdk_aws_iotfleetwise_CfnDecoderManifest_ObdSignalProperty, _aws_cdk_aws_iotfleetwise_CfnDecoderManifest_SignalDecodersItemsProperty, _aws_cdk_aws_iotfleetwise_CfnFleetProps, _aws_cdk_aws_iotfleetwise_CfnFleet, _aws_cdk_aws_iotfleetwise_CfnModelManifestProps, _aws_cdk_aws_iotfleetwise_CfnModelManifest, _aws_cdk_aws_iotfleetwise_CfnSignalCatalogProps, _aws_cdk_aws_iotfleetwise_CfnSignalCatalog, _aws_cdk_aws_iotfleetwise_CfnSignalCatalog_ActuatorProperty, _aws_cdk_aws_iotfleetwise_CfnSignalCatalog_AttributeProperty, _aws_cdk_aws_iotfleetwise_CfnSignalCatalog_BranchProperty, _aws_cdk_aws_iotfleetwise_CfnSignalCatalog_NodeProperty, _aws_cdk_aws_iotfleetwise_CfnSignalCatalog_NodeCountsProperty, _aws_cdk_aws_iotfleetwise_CfnSignalCatalog_SensorProperty, _aws_cdk_aws_iotfleetwise_CfnVehicleProps, _aws_cdk_aws_iotfleetwise_CfnVehicle };
