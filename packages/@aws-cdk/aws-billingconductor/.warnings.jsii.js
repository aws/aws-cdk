function _aws_cdk_aws_billingconductor_CfnBillingGroupProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.accountGrouping))
            _aws_cdk_aws_billingconductor_CfnBillingGroup_AccountGroupingProperty(p.accountGrouping);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_billingconductor_CfnBillingGroup(p) {
}
function _aws_cdk_aws_billingconductor_CfnBillingGroup_AccountGroupingProperty(p) {
}
function _aws_cdk_aws_billingconductor_CfnBillingGroup_ComputationPreferenceProperty(p) {
}
function _aws_cdk_aws_billingconductor_CfnCustomLineItemProps(p) {
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
function _aws_cdk_aws_billingconductor_CfnCustomLineItem(p) {
}
function _aws_cdk_aws_billingconductor_CfnCustomLineItem_BillingPeriodRangeProperty(p) {
}
function _aws_cdk_aws_billingconductor_CfnCustomLineItem_CustomLineItemChargeDetailsProperty(p) {
}
function _aws_cdk_aws_billingconductor_CfnCustomLineItem_CustomLineItemFlatChargeDetailsProperty(p) {
}
function _aws_cdk_aws_billingconductor_CfnCustomLineItem_CustomLineItemPercentageChargeDetailsProperty(p) {
}
function _aws_cdk_aws_billingconductor_CfnPricingPlanProps(p) {
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
function _aws_cdk_aws_billingconductor_CfnPricingPlan(p) {
}
function _aws_cdk_aws_billingconductor_CfnPricingRuleProps(p) {
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
function _aws_cdk_aws_billingconductor_CfnPricingRule(p) {
}
function _aws_cdk_aws_billingconductor_CfnPricingRule_FreeTierProperty(p) {
}
function _aws_cdk_aws_billingconductor_CfnPricingRule_TieringProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_billingconductor_CfnBillingGroupProps, _aws_cdk_aws_billingconductor_CfnBillingGroup, _aws_cdk_aws_billingconductor_CfnBillingGroup_AccountGroupingProperty, _aws_cdk_aws_billingconductor_CfnBillingGroup_ComputationPreferenceProperty, _aws_cdk_aws_billingconductor_CfnCustomLineItemProps, _aws_cdk_aws_billingconductor_CfnCustomLineItem, _aws_cdk_aws_billingconductor_CfnCustomLineItem_BillingPeriodRangeProperty, _aws_cdk_aws_billingconductor_CfnCustomLineItem_CustomLineItemChargeDetailsProperty, _aws_cdk_aws_billingconductor_CfnCustomLineItem_CustomLineItemFlatChargeDetailsProperty, _aws_cdk_aws_billingconductor_CfnCustomLineItem_CustomLineItemPercentageChargeDetailsProperty, _aws_cdk_aws_billingconductor_CfnPricingPlanProps, _aws_cdk_aws_billingconductor_CfnPricingPlan, _aws_cdk_aws_billingconductor_CfnPricingRuleProps, _aws_cdk_aws_billingconductor_CfnPricingRule, _aws_cdk_aws_billingconductor_CfnPricingRule_FreeTierProperty, _aws_cdk_aws_billingconductor_CfnPricingRule_TieringProperty };
