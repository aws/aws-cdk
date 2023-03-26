function _aws_cdk_aws_macie_CfnAllowListProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.criteria))
            _aws_cdk_aws_macie_CfnAllowList_CriteriaProperty(p.criteria);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_macie_CfnAllowList(p) {
}
function _aws_cdk_aws_macie_CfnAllowList_CriteriaProperty(p) {
}
function _aws_cdk_aws_macie_CfnAllowList_S3WordsListProperty(p) {
}
function _aws_cdk_aws_macie_CfnCustomDataIdentifierProps(p) {
}
function _aws_cdk_aws_macie_CfnCustomDataIdentifier(p) {
}
function _aws_cdk_aws_macie_CfnFindingsFilterProps(p) {
}
function _aws_cdk_aws_macie_CfnFindingsFilter(p) {
}
function _aws_cdk_aws_macie_CfnFindingsFilter_CriterionAdditionalPropertiesProperty(p) {
}
function _aws_cdk_aws_macie_CfnFindingsFilter_FindingCriteriaProperty(p) {
}
function _aws_cdk_aws_macie_CfnFindingsFilter_FindingsFilterListItemProperty(p) {
}
function _aws_cdk_aws_macie_CfnSessionProps(p) {
}
function _aws_cdk_aws_macie_CfnSession(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_macie_CfnAllowListProps, _aws_cdk_aws_macie_CfnAllowList, _aws_cdk_aws_macie_CfnAllowList_CriteriaProperty, _aws_cdk_aws_macie_CfnAllowList_S3WordsListProperty, _aws_cdk_aws_macie_CfnCustomDataIdentifierProps, _aws_cdk_aws_macie_CfnCustomDataIdentifier, _aws_cdk_aws_macie_CfnFindingsFilterProps, _aws_cdk_aws_macie_CfnFindingsFilter, _aws_cdk_aws_macie_CfnFindingsFilter_CriterionAdditionalPropertiesProperty, _aws_cdk_aws_macie_CfnFindingsFilter_FindingCriteriaProperty, _aws_cdk_aws_macie_CfnFindingsFilter_FindingsFilterListItemProperty, _aws_cdk_aws_macie_CfnSessionProps, _aws_cdk_aws_macie_CfnSession };
