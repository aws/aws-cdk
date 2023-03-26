function _aws_cdk_aws_wafregional_CfnByteMatchSetProps(p) {
}
function _aws_cdk_aws_wafregional_CfnByteMatchSet(p) {
}
function _aws_cdk_aws_wafregional_CfnByteMatchSet_ByteMatchTupleProperty(p) {
}
function _aws_cdk_aws_wafregional_CfnByteMatchSet_FieldToMatchProperty(p) {
}
function _aws_cdk_aws_wafregional_CfnGeoMatchSetProps(p) {
}
function _aws_cdk_aws_wafregional_CfnGeoMatchSet(p) {
}
function _aws_cdk_aws_wafregional_CfnGeoMatchSet_GeoMatchConstraintProperty(p) {
}
function _aws_cdk_aws_wafregional_CfnIPSetProps(p) {
}
function _aws_cdk_aws_wafregional_CfnIPSet(p) {
}
function _aws_cdk_aws_wafregional_CfnIPSet_IPSetDescriptorProperty(p) {
}
function _aws_cdk_aws_wafregional_CfnRateBasedRuleProps(p) {
}
function _aws_cdk_aws_wafregional_CfnRateBasedRule(p) {
}
function _aws_cdk_aws_wafregional_CfnRateBasedRule_PredicateProperty(p) {
}
function _aws_cdk_aws_wafregional_CfnRegexPatternSetProps(p) {
}
function _aws_cdk_aws_wafregional_CfnRegexPatternSet(p) {
}
function _aws_cdk_aws_wafregional_CfnRuleProps(p) {
}
function _aws_cdk_aws_wafregional_CfnRule(p) {
}
function _aws_cdk_aws_wafregional_CfnRule_PredicateProperty(p) {
}
function _aws_cdk_aws_wafregional_CfnSizeConstraintSetProps(p) {
}
function _aws_cdk_aws_wafregional_CfnSizeConstraintSet(p) {
}
function _aws_cdk_aws_wafregional_CfnSizeConstraintSet_FieldToMatchProperty(p) {
}
function _aws_cdk_aws_wafregional_CfnSizeConstraintSet_SizeConstraintProperty(p) {
}
function _aws_cdk_aws_wafregional_CfnSqlInjectionMatchSetProps(p) {
}
function _aws_cdk_aws_wafregional_CfnSqlInjectionMatchSet(p) {
}
function _aws_cdk_aws_wafregional_CfnSqlInjectionMatchSet_FieldToMatchProperty(p) {
}
function _aws_cdk_aws_wafregional_CfnSqlInjectionMatchSet_SqlInjectionMatchTupleProperty(p) {
}
function _aws_cdk_aws_wafregional_CfnWebACLProps(p) {
}
function _aws_cdk_aws_wafregional_CfnWebACL(p) {
}
function _aws_cdk_aws_wafregional_CfnWebACL_ActionProperty(p) {
}
function _aws_cdk_aws_wafregional_CfnWebACL_RuleProperty(p) {
}
function _aws_cdk_aws_wafregional_CfnWebACLAssociationProps(p) {
}
function _aws_cdk_aws_wafregional_CfnWebACLAssociation(p) {
}
function _aws_cdk_aws_wafregional_CfnXssMatchSetProps(p) {
}
function _aws_cdk_aws_wafregional_CfnXssMatchSet(p) {
}
function _aws_cdk_aws_wafregional_CfnXssMatchSet_FieldToMatchProperty(p) {
}
function _aws_cdk_aws_wafregional_CfnXssMatchSet_XssMatchTupleProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_wafregional_CfnByteMatchSetProps, _aws_cdk_aws_wafregional_CfnByteMatchSet, _aws_cdk_aws_wafregional_CfnByteMatchSet_ByteMatchTupleProperty, _aws_cdk_aws_wafregional_CfnByteMatchSet_FieldToMatchProperty, _aws_cdk_aws_wafregional_CfnGeoMatchSetProps, _aws_cdk_aws_wafregional_CfnGeoMatchSet, _aws_cdk_aws_wafregional_CfnGeoMatchSet_GeoMatchConstraintProperty, _aws_cdk_aws_wafregional_CfnIPSetProps, _aws_cdk_aws_wafregional_CfnIPSet, _aws_cdk_aws_wafregional_CfnIPSet_IPSetDescriptorProperty, _aws_cdk_aws_wafregional_CfnRateBasedRuleProps, _aws_cdk_aws_wafregional_CfnRateBasedRule, _aws_cdk_aws_wafregional_CfnRateBasedRule_PredicateProperty, _aws_cdk_aws_wafregional_CfnRegexPatternSetProps, _aws_cdk_aws_wafregional_CfnRegexPatternSet, _aws_cdk_aws_wafregional_CfnRuleProps, _aws_cdk_aws_wafregional_CfnRule, _aws_cdk_aws_wafregional_CfnRule_PredicateProperty, _aws_cdk_aws_wafregional_CfnSizeConstraintSetProps, _aws_cdk_aws_wafregional_CfnSizeConstraintSet, _aws_cdk_aws_wafregional_CfnSizeConstraintSet_FieldToMatchProperty, _aws_cdk_aws_wafregional_CfnSizeConstraintSet_SizeConstraintProperty, _aws_cdk_aws_wafregional_CfnSqlInjectionMatchSetProps, _aws_cdk_aws_wafregional_CfnSqlInjectionMatchSet, _aws_cdk_aws_wafregional_CfnSqlInjectionMatchSet_FieldToMatchProperty, _aws_cdk_aws_wafregional_CfnSqlInjectionMatchSet_SqlInjectionMatchTupleProperty, _aws_cdk_aws_wafregional_CfnWebACLProps, _aws_cdk_aws_wafregional_CfnWebACL, _aws_cdk_aws_wafregional_CfnWebACL_ActionProperty, _aws_cdk_aws_wafregional_CfnWebACL_RuleProperty, _aws_cdk_aws_wafregional_CfnWebACLAssociationProps, _aws_cdk_aws_wafregional_CfnWebACLAssociation, _aws_cdk_aws_wafregional_CfnXssMatchSetProps, _aws_cdk_aws_wafregional_CfnXssMatchSet, _aws_cdk_aws_wafregional_CfnXssMatchSet_FieldToMatchProperty, _aws_cdk_aws_wafregional_CfnXssMatchSet_XssMatchTupleProperty };
