function _aws_cdk_aws_xray_CfnGroupProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.insightsConfiguration))
            _aws_cdk_aws_xray_CfnGroup_InsightsConfigurationProperty(p.insightsConfiguration);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_xray_CfnGroup(p) {
}
function _aws_cdk_aws_xray_CfnGroup_InsightsConfigurationProperty(p) {
}
function _aws_cdk_aws_xray_CfnGroup_TagsItemsProperty(p) {
}
function _aws_cdk_aws_xray_CfnResourcePolicyProps(p) {
}
function _aws_cdk_aws_xray_CfnResourcePolicy(p) {
}
function _aws_cdk_aws_xray_CfnSamplingRuleProps(p) {
}
function _aws_cdk_aws_xray_CfnSamplingRule(p) {
}
function _aws_cdk_aws_xray_CfnSamplingRule_SamplingRuleProperty(p) {
}
function _aws_cdk_aws_xray_CfnSamplingRule_SamplingRuleRecordProperty(p) {
}
function _aws_cdk_aws_xray_CfnSamplingRule_SamplingRuleUpdateProperty(p) {
}
function _aws_cdk_aws_xray_CfnSamplingRule_TagsItemsProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_xray_CfnGroupProps, _aws_cdk_aws_xray_CfnGroup, _aws_cdk_aws_xray_CfnGroup_InsightsConfigurationProperty, _aws_cdk_aws_xray_CfnGroup_TagsItemsProperty, _aws_cdk_aws_xray_CfnResourcePolicyProps, _aws_cdk_aws_xray_CfnResourcePolicy, _aws_cdk_aws_xray_CfnSamplingRuleProps, _aws_cdk_aws_xray_CfnSamplingRule, _aws_cdk_aws_xray_CfnSamplingRule_SamplingRuleProperty, _aws_cdk_aws_xray_CfnSamplingRule_SamplingRuleRecordProperty, _aws_cdk_aws_xray_CfnSamplingRule_SamplingRuleUpdateProperty, _aws_cdk_aws_xray_CfnSamplingRule_TagsItemsProperty };
