function _aws_cdk_aws_cloudtrail_TrailProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.insightTypes != null)
            for (const o of p.insightTypes)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudtrail_InsightType(o);
        if ("kmsKey" in p)
            print("@aws-cdk/aws-cloudtrail.TrailProps#kmsKey", "- use encryptionKey instead.");
        if (!visitedObjects.has(p.managementEvents))
            _aws_cdk_aws_cloudtrail_ReadWriteType(p.managementEvents);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudtrail_ReadWriteType(p) {
}
function _aws_cdk_aws_cloudtrail_InsightType(p) {
}
function _aws_cdk_aws_cloudtrail_Trail(p) {
}
function _aws_cdk_aws_cloudtrail_AddEventSelectorOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.excludeManagementEventSources != null)
            for (const o of p.excludeManagementEventSources)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudtrail_ManagementEventSources(o);
        if (!visitedObjects.has(p.readWriteType))
            _aws_cdk_aws_cloudtrail_ReadWriteType(p.readWriteType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudtrail_ManagementEventSources(p) {
}
function _aws_cdk_aws_cloudtrail_S3EventSelector(p) {
}
function _aws_cdk_aws_cloudtrail_DataResourceType(p) {
}
function _aws_cdk_aws_cloudtrail_CfnChannelProps(p) {
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
function _aws_cdk_aws_cloudtrail_CfnChannel(p) {
}
function _aws_cdk_aws_cloudtrail_CfnChannel_DestinationProperty(p) {
}
function _aws_cdk_aws_cloudtrail_CfnEventDataStoreProps(p) {
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
function _aws_cdk_aws_cloudtrail_CfnEventDataStore(p) {
}
function _aws_cdk_aws_cloudtrail_CfnEventDataStore_AdvancedEventSelectorProperty(p) {
}
function _aws_cdk_aws_cloudtrail_CfnEventDataStore_AdvancedFieldSelectorProperty(p) {
}
function _aws_cdk_aws_cloudtrail_CfnResourcePolicyProps(p) {
}
function _aws_cdk_aws_cloudtrail_CfnResourcePolicy(p) {
}
function _aws_cdk_aws_cloudtrail_CfnTrailProps(p) {
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
function _aws_cdk_aws_cloudtrail_CfnTrail(p) {
}
function _aws_cdk_aws_cloudtrail_CfnTrail_DataResourceProperty(p) {
}
function _aws_cdk_aws_cloudtrail_CfnTrail_EventSelectorProperty(p) {
}
function _aws_cdk_aws_cloudtrail_CfnTrail_InsightSelectorProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_cloudtrail_TrailProps, _aws_cdk_aws_cloudtrail_ReadWriteType, _aws_cdk_aws_cloudtrail_InsightType, _aws_cdk_aws_cloudtrail_Trail, _aws_cdk_aws_cloudtrail_AddEventSelectorOptions, _aws_cdk_aws_cloudtrail_ManagementEventSources, _aws_cdk_aws_cloudtrail_S3EventSelector, _aws_cdk_aws_cloudtrail_DataResourceType, _aws_cdk_aws_cloudtrail_CfnChannelProps, _aws_cdk_aws_cloudtrail_CfnChannel, _aws_cdk_aws_cloudtrail_CfnChannel_DestinationProperty, _aws_cdk_aws_cloudtrail_CfnEventDataStoreProps, _aws_cdk_aws_cloudtrail_CfnEventDataStore, _aws_cdk_aws_cloudtrail_CfnEventDataStore_AdvancedEventSelectorProperty, _aws_cdk_aws_cloudtrail_CfnEventDataStore_AdvancedFieldSelectorProperty, _aws_cdk_aws_cloudtrail_CfnResourcePolicyProps, _aws_cdk_aws_cloudtrail_CfnResourcePolicy, _aws_cdk_aws_cloudtrail_CfnTrailProps, _aws_cdk_aws_cloudtrail_CfnTrail, _aws_cdk_aws_cloudtrail_CfnTrail_DataResourceProperty, _aws_cdk_aws_cloudtrail_CfnTrail_EventSelectorProperty, _aws_cdk_aws_cloudtrail_CfnTrail_InsightSelectorProperty };
