function _aws_cdk_aws_ssmincidents_CfnReplicationSetProps(p) {
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
function _aws_cdk_aws_ssmincidents_CfnReplicationSet(p) {
}
function _aws_cdk_aws_ssmincidents_CfnReplicationSet_RegionConfigurationProperty(p) {
}
function _aws_cdk_aws_ssmincidents_CfnReplicationSet_ReplicationRegionProperty(p) {
}
function _aws_cdk_aws_ssmincidents_CfnResponsePlanProps(p) {
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
function _aws_cdk_aws_ssmincidents_CfnResponsePlan(p) {
}
function _aws_cdk_aws_ssmincidents_CfnResponsePlan_ActionProperty(p) {
}
function _aws_cdk_aws_ssmincidents_CfnResponsePlan_ChatChannelProperty(p) {
}
function _aws_cdk_aws_ssmincidents_CfnResponsePlan_DynamicSsmParameterProperty(p) {
}
function _aws_cdk_aws_ssmincidents_CfnResponsePlan_DynamicSsmParameterValueProperty(p) {
}
function _aws_cdk_aws_ssmincidents_CfnResponsePlan_IncidentTemplateProperty(p) {
}
function _aws_cdk_aws_ssmincidents_CfnResponsePlan_IntegrationProperty(p) {
}
function _aws_cdk_aws_ssmincidents_CfnResponsePlan_NotificationTargetItemProperty(p) {
}
function _aws_cdk_aws_ssmincidents_CfnResponsePlan_PagerDutyConfigurationProperty(p) {
}
function _aws_cdk_aws_ssmincidents_CfnResponsePlan_PagerDutyIncidentConfigurationProperty(p) {
}
function _aws_cdk_aws_ssmincidents_CfnResponsePlan_SsmAutomationProperty(p) {
}
function _aws_cdk_aws_ssmincidents_CfnResponsePlan_SsmParameterProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_ssmincidents_CfnReplicationSetProps, _aws_cdk_aws_ssmincidents_CfnReplicationSet, _aws_cdk_aws_ssmincidents_CfnReplicationSet_RegionConfigurationProperty, _aws_cdk_aws_ssmincidents_CfnReplicationSet_ReplicationRegionProperty, _aws_cdk_aws_ssmincidents_CfnResponsePlanProps, _aws_cdk_aws_ssmincidents_CfnResponsePlan, _aws_cdk_aws_ssmincidents_CfnResponsePlan_ActionProperty, _aws_cdk_aws_ssmincidents_CfnResponsePlan_ChatChannelProperty, _aws_cdk_aws_ssmincidents_CfnResponsePlan_DynamicSsmParameterProperty, _aws_cdk_aws_ssmincidents_CfnResponsePlan_DynamicSsmParameterValueProperty, _aws_cdk_aws_ssmincidents_CfnResponsePlan_IncidentTemplateProperty, _aws_cdk_aws_ssmincidents_CfnResponsePlan_IntegrationProperty, _aws_cdk_aws_ssmincidents_CfnResponsePlan_NotificationTargetItemProperty, _aws_cdk_aws_ssmincidents_CfnResponsePlan_PagerDutyConfigurationProperty, _aws_cdk_aws_ssmincidents_CfnResponsePlan_PagerDutyIncidentConfigurationProperty, _aws_cdk_aws_ssmincidents_CfnResponsePlan_SsmAutomationProperty, _aws_cdk_aws_ssmincidents_CfnResponsePlan_SsmParameterProperty };
