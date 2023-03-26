function _aws_cdk_aws_guardduty_CfnDetectorProps(p) {
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
function _aws_cdk_aws_guardduty_CfnDetector(p) {
}
function _aws_cdk_aws_guardduty_CfnDetector_CFNDataSourceConfigurationsProperty(p) {
}
function _aws_cdk_aws_guardduty_CfnDetector_CFNKubernetesAuditLogsConfigurationProperty(p) {
}
function _aws_cdk_aws_guardduty_CfnDetector_CFNKubernetesConfigurationProperty(p) {
}
function _aws_cdk_aws_guardduty_CfnDetector_CFNMalwareProtectionConfigurationProperty(p) {
}
function _aws_cdk_aws_guardduty_CfnDetector_CFNS3LogsConfigurationProperty(p) {
}
function _aws_cdk_aws_guardduty_CfnDetector_CFNScanEc2InstanceWithFindingsConfigurationProperty(p) {
}
function _aws_cdk_aws_guardduty_CfnFilterProps(p) {
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
function _aws_cdk_aws_guardduty_CfnFilter(p) {
}
function _aws_cdk_aws_guardduty_CfnFilter_ConditionProperty(p) {
}
function _aws_cdk_aws_guardduty_CfnFilter_FindingCriteriaProperty(p) {
}
function _aws_cdk_aws_guardduty_CfnIPSetProps(p) {
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
function _aws_cdk_aws_guardduty_CfnIPSet(p) {
}
function _aws_cdk_aws_guardduty_CfnMasterProps(p) {
}
function _aws_cdk_aws_guardduty_CfnMaster(p) {
}
function _aws_cdk_aws_guardduty_CfnMemberProps(p) {
}
function _aws_cdk_aws_guardduty_CfnMember(p) {
}
function _aws_cdk_aws_guardduty_CfnThreatIntelSetProps(p) {
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
function _aws_cdk_aws_guardduty_CfnThreatIntelSet(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_guardduty_CfnDetectorProps, _aws_cdk_aws_guardduty_CfnDetector, _aws_cdk_aws_guardduty_CfnDetector_CFNDataSourceConfigurationsProperty, _aws_cdk_aws_guardduty_CfnDetector_CFNKubernetesAuditLogsConfigurationProperty, _aws_cdk_aws_guardduty_CfnDetector_CFNKubernetesConfigurationProperty, _aws_cdk_aws_guardduty_CfnDetector_CFNMalwareProtectionConfigurationProperty, _aws_cdk_aws_guardduty_CfnDetector_CFNS3LogsConfigurationProperty, _aws_cdk_aws_guardduty_CfnDetector_CFNScanEc2InstanceWithFindingsConfigurationProperty, _aws_cdk_aws_guardduty_CfnFilterProps, _aws_cdk_aws_guardduty_CfnFilter, _aws_cdk_aws_guardduty_CfnFilter_ConditionProperty, _aws_cdk_aws_guardduty_CfnFilter_FindingCriteriaProperty, _aws_cdk_aws_guardduty_CfnIPSetProps, _aws_cdk_aws_guardduty_CfnIPSet, _aws_cdk_aws_guardduty_CfnMasterProps, _aws_cdk_aws_guardduty_CfnMaster, _aws_cdk_aws_guardduty_CfnMemberProps, _aws_cdk_aws_guardduty_CfnMember, _aws_cdk_aws_guardduty_CfnThreatIntelSetProps, _aws_cdk_aws_guardduty_CfnThreatIntelSet };
