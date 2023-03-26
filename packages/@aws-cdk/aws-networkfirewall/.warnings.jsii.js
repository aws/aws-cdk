function _aws_cdk_aws_networkfirewall_CfnFirewallProps(p) {
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
function _aws_cdk_aws_networkfirewall_CfnFirewall(p) {
}
function _aws_cdk_aws_networkfirewall_CfnFirewall_SubnetMappingProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnFirewallPolicyProps(p) {
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
function _aws_cdk_aws_networkfirewall_CfnFirewallPolicy(p) {
}
function _aws_cdk_aws_networkfirewall_CfnFirewallPolicy_ActionDefinitionProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnFirewallPolicy_CustomActionProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnFirewallPolicy_DimensionProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnFirewallPolicy_FirewallPolicyProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnFirewallPolicy_PublishMetricActionProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnFirewallPolicy_StatefulEngineOptionsProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnFirewallPolicy_StatefulRuleGroupOverrideProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnFirewallPolicy_StatefulRuleGroupReferenceProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnFirewallPolicy_StatelessRuleGroupReferenceProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnLoggingConfigurationProps(p) {
}
function _aws_cdk_aws_networkfirewall_CfnLoggingConfiguration(p) {
}
function _aws_cdk_aws_networkfirewall_CfnLoggingConfiguration_LogDestinationConfigProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnLoggingConfiguration_LoggingConfigurationProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroupProps(p) {
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
function _aws_cdk_aws_networkfirewall_CfnRuleGroup(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_ActionDefinitionProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_AddressProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_CustomActionProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_DimensionProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_HeaderProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_IPSetProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_IPSetReferenceProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_MatchAttributesProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_PortRangeProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_PortSetProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_PublishMetricActionProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_ReferenceSetsProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_RuleDefinitionProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_RuleGroupProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_RuleOptionProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_RuleVariablesProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_RulesSourceProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_RulesSourceListProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_StatefulRuleProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_StatefulRuleOptionsProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_StatelessRuleProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_StatelessRulesAndCustomActionsProperty(p) {
}
function _aws_cdk_aws_networkfirewall_CfnRuleGroup_TCPFlagFieldProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_networkfirewall_CfnFirewallProps, _aws_cdk_aws_networkfirewall_CfnFirewall, _aws_cdk_aws_networkfirewall_CfnFirewall_SubnetMappingProperty, _aws_cdk_aws_networkfirewall_CfnFirewallPolicyProps, _aws_cdk_aws_networkfirewall_CfnFirewallPolicy, _aws_cdk_aws_networkfirewall_CfnFirewallPolicy_ActionDefinitionProperty, _aws_cdk_aws_networkfirewall_CfnFirewallPolicy_CustomActionProperty, _aws_cdk_aws_networkfirewall_CfnFirewallPolicy_DimensionProperty, _aws_cdk_aws_networkfirewall_CfnFirewallPolicy_FirewallPolicyProperty, _aws_cdk_aws_networkfirewall_CfnFirewallPolicy_PublishMetricActionProperty, _aws_cdk_aws_networkfirewall_CfnFirewallPolicy_StatefulEngineOptionsProperty, _aws_cdk_aws_networkfirewall_CfnFirewallPolicy_StatefulRuleGroupOverrideProperty, _aws_cdk_aws_networkfirewall_CfnFirewallPolicy_StatefulRuleGroupReferenceProperty, _aws_cdk_aws_networkfirewall_CfnFirewallPolicy_StatelessRuleGroupReferenceProperty, _aws_cdk_aws_networkfirewall_CfnLoggingConfigurationProps, _aws_cdk_aws_networkfirewall_CfnLoggingConfiguration, _aws_cdk_aws_networkfirewall_CfnLoggingConfiguration_LogDestinationConfigProperty, _aws_cdk_aws_networkfirewall_CfnLoggingConfiguration_LoggingConfigurationProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroupProps, _aws_cdk_aws_networkfirewall_CfnRuleGroup, _aws_cdk_aws_networkfirewall_CfnRuleGroup_ActionDefinitionProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroup_AddressProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroup_CustomActionProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroup_DimensionProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroup_HeaderProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroup_IPSetProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroup_IPSetReferenceProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroup_MatchAttributesProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroup_PortRangeProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroup_PortSetProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroup_PublishMetricActionProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroup_ReferenceSetsProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroup_RuleDefinitionProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroup_RuleGroupProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroup_RuleOptionProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroup_RuleVariablesProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroup_RulesSourceProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroup_RulesSourceListProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroup_StatefulRuleProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroup_StatefulRuleOptionsProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroup_StatelessRuleProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroup_StatelessRulesAndCustomActionsProperty, _aws_cdk_aws_networkfirewall_CfnRuleGroup_TCPFlagFieldProperty };
