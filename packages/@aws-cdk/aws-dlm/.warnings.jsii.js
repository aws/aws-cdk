function _aws_cdk_aws_dlm_CfnLifecyclePolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.policyDetails))
            _aws_cdk_aws_dlm_CfnLifecyclePolicy_PolicyDetailsProperty(p.policyDetails);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_dlm_CfnLifecyclePolicy(p) {
}
function _aws_cdk_aws_dlm_CfnLifecyclePolicy_ActionProperty(p) {
}
function _aws_cdk_aws_dlm_CfnLifecyclePolicy_ArchiveRetainRuleProperty(p) {
}
function _aws_cdk_aws_dlm_CfnLifecyclePolicy_ArchiveRuleProperty(p) {
}
function _aws_cdk_aws_dlm_CfnLifecyclePolicy_CreateRuleProperty(p) {
}
function _aws_cdk_aws_dlm_CfnLifecyclePolicy_CrossRegionCopyActionProperty(p) {
}
function _aws_cdk_aws_dlm_CfnLifecyclePolicy_CrossRegionCopyDeprecateRuleProperty(p) {
}
function _aws_cdk_aws_dlm_CfnLifecyclePolicy_CrossRegionCopyRetainRuleProperty(p) {
}
function _aws_cdk_aws_dlm_CfnLifecyclePolicy_CrossRegionCopyRuleProperty(p) {
}
function _aws_cdk_aws_dlm_CfnLifecyclePolicy_DeprecateRuleProperty(p) {
}
function _aws_cdk_aws_dlm_CfnLifecyclePolicy_EncryptionConfigurationProperty(p) {
}
function _aws_cdk_aws_dlm_CfnLifecyclePolicy_EventParametersProperty(p) {
}
function _aws_cdk_aws_dlm_CfnLifecyclePolicy_EventSourceProperty(p) {
}
function _aws_cdk_aws_dlm_CfnLifecyclePolicy_FastRestoreRuleProperty(p) {
}
function _aws_cdk_aws_dlm_CfnLifecyclePolicy_ParametersProperty(p) {
}
function _aws_cdk_aws_dlm_CfnLifecyclePolicy_PolicyDetailsProperty(p) {
}
function _aws_cdk_aws_dlm_CfnLifecyclePolicy_RetainRuleProperty(p) {
}
function _aws_cdk_aws_dlm_CfnLifecyclePolicy_RetentionArchiveTierProperty(p) {
}
function _aws_cdk_aws_dlm_CfnLifecyclePolicy_ScheduleProperty(p) {
}
function _aws_cdk_aws_dlm_CfnLifecyclePolicy_ShareRuleProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_dlm_CfnLifecyclePolicyProps, _aws_cdk_aws_dlm_CfnLifecyclePolicy, _aws_cdk_aws_dlm_CfnLifecyclePolicy_ActionProperty, _aws_cdk_aws_dlm_CfnLifecyclePolicy_ArchiveRetainRuleProperty, _aws_cdk_aws_dlm_CfnLifecyclePolicy_ArchiveRuleProperty, _aws_cdk_aws_dlm_CfnLifecyclePolicy_CreateRuleProperty, _aws_cdk_aws_dlm_CfnLifecyclePolicy_CrossRegionCopyActionProperty, _aws_cdk_aws_dlm_CfnLifecyclePolicy_CrossRegionCopyDeprecateRuleProperty, _aws_cdk_aws_dlm_CfnLifecyclePolicy_CrossRegionCopyRetainRuleProperty, _aws_cdk_aws_dlm_CfnLifecyclePolicy_CrossRegionCopyRuleProperty, _aws_cdk_aws_dlm_CfnLifecyclePolicy_DeprecateRuleProperty, _aws_cdk_aws_dlm_CfnLifecyclePolicy_EncryptionConfigurationProperty, _aws_cdk_aws_dlm_CfnLifecyclePolicy_EventParametersProperty, _aws_cdk_aws_dlm_CfnLifecyclePolicy_EventSourceProperty, _aws_cdk_aws_dlm_CfnLifecyclePolicy_FastRestoreRuleProperty, _aws_cdk_aws_dlm_CfnLifecyclePolicy_ParametersProperty, _aws_cdk_aws_dlm_CfnLifecyclePolicy_PolicyDetailsProperty, _aws_cdk_aws_dlm_CfnLifecyclePolicy_RetainRuleProperty, _aws_cdk_aws_dlm_CfnLifecyclePolicy_RetentionArchiveTierProperty, _aws_cdk_aws_dlm_CfnLifecyclePolicy_ScheduleProperty, _aws_cdk_aws_dlm_CfnLifecyclePolicy_ShareRuleProperty };
