function _aws_cdk_aws_waf_CfnByteMatchSetProps(p) {
}
function _aws_cdk_aws_waf_CfnByteMatchSet(p) {
}
function _aws_cdk_aws_waf_CfnByteMatchSet_ByteMatchTupleProperty(p) {
}
function _aws_cdk_aws_waf_CfnByteMatchSet_FieldToMatchProperty(p) {
}
function _aws_cdk_aws_waf_CfnIPSetProps(p) {
}
function _aws_cdk_aws_waf_CfnIPSet(p) {
}
function _aws_cdk_aws_waf_CfnIPSet_IPSetDescriptorProperty(p) {
}
function _aws_cdk_aws_waf_CfnRuleProps(p) {
}
function _aws_cdk_aws_waf_CfnRule(p) {
}
function _aws_cdk_aws_waf_CfnRule_PredicateProperty(p) {
}
function _aws_cdk_aws_waf_CfnSizeConstraintSetProps(p) {
}
function _aws_cdk_aws_waf_CfnSizeConstraintSet(p) {
}
function _aws_cdk_aws_waf_CfnSizeConstraintSet_FieldToMatchProperty(p) {
}
function _aws_cdk_aws_waf_CfnSizeConstraintSet_SizeConstraintProperty(p) {
}
function _aws_cdk_aws_waf_CfnSqlInjectionMatchSetProps(p) {
}
function _aws_cdk_aws_waf_CfnSqlInjectionMatchSet(p) {
}
function _aws_cdk_aws_waf_CfnSqlInjectionMatchSet_FieldToMatchProperty(p) {
}
function _aws_cdk_aws_waf_CfnSqlInjectionMatchSet_SqlInjectionMatchTupleProperty(p) {
}
function _aws_cdk_aws_waf_CfnWebACLProps(p) {
}
function _aws_cdk_aws_waf_CfnWebACL(p) {
}
function _aws_cdk_aws_waf_CfnWebACL_ActivatedRuleProperty(p) {
}
function _aws_cdk_aws_waf_CfnWebACL_WafActionProperty(p) {
}
function _aws_cdk_aws_waf_CfnXssMatchSetProps(p) {
}
function _aws_cdk_aws_waf_CfnXssMatchSet(p) {
}
function _aws_cdk_aws_waf_CfnXssMatchSet_FieldToMatchProperty(p) {
}
function _aws_cdk_aws_waf_CfnXssMatchSet_XssMatchTupleProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_waf_CfnByteMatchSetProps, _aws_cdk_aws_waf_CfnByteMatchSet, _aws_cdk_aws_waf_CfnByteMatchSet_ByteMatchTupleProperty, _aws_cdk_aws_waf_CfnByteMatchSet_FieldToMatchProperty, _aws_cdk_aws_waf_CfnIPSetProps, _aws_cdk_aws_waf_CfnIPSet, _aws_cdk_aws_waf_CfnIPSet_IPSetDescriptorProperty, _aws_cdk_aws_waf_CfnRuleProps, _aws_cdk_aws_waf_CfnRule, _aws_cdk_aws_waf_CfnRule_PredicateProperty, _aws_cdk_aws_waf_CfnSizeConstraintSetProps, _aws_cdk_aws_waf_CfnSizeConstraintSet, _aws_cdk_aws_waf_CfnSizeConstraintSet_FieldToMatchProperty, _aws_cdk_aws_waf_CfnSizeConstraintSet_SizeConstraintProperty, _aws_cdk_aws_waf_CfnSqlInjectionMatchSetProps, _aws_cdk_aws_waf_CfnSqlInjectionMatchSet, _aws_cdk_aws_waf_CfnSqlInjectionMatchSet_FieldToMatchProperty, _aws_cdk_aws_waf_CfnSqlInjectionMatchSet_SqlInjectionMatchTupleProperty, _aws_cdk_aws_waf_CfnWebACLProps, _aws_cdk_aws_waf_CfnWebACL, _aws_cdk_aws_waf_CfnWebACL_ActivatedRuleProperty, _aws_cdk_aws_waf_CfnWebACL_WafActionProperty, _aws_cdk_aws_waf_CfnXssMatchSetProps, _aws_cdk_aws_waf_CfnXssMatchSet, _aws_cdk_aws_waf_CfnXssMatchSet_FieldToMatchProperty, _aws_cdk_aws_waf_CfnXssMatchSet_XssMatchTupleProperty };
