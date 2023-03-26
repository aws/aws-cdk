function _aws_cdk_aws_route53recoveryreadiness_CfnCellProps(p) {
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
function _aws_cdk_aws_route53recoveryreadiness_CfnCell(p) {
}
function _aws_cdk_aws_route53recoveryreadiness_CfnReadinessCheckProps(p) {
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
function _aws_cdk_aws_route53recoveryreadiness_CfnReadinessCheck(p) {
}
function _aws_cdk_aws_route53recoveryreadiness_CfnRecoveryGroupProps(p) {
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
function _aws_cdk_aws_route53recoveryreadiness_CfnRecoveryGroup(p) {
}
function _aws_cdk_aws_route53recoveryreadiness_CfnResourceSetProps(p) {
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
function _aws_cdk_aws_route53recoveryreadiness_CfnResourceSet(p) {
}
function _aws_cdk_aws_route53recoveryreadiness_CfnResourceSet_DNSTargetResourceProperty(p) {
}
function _aws_cdk_aws_route53recoveryreadiness_CfnResourceSet_NLBResourceProperty(p) {
}
function _aws_cdk_aws_route53recoveryreadiness_CfnResourceSet_R53ResourceRecordProperty(p) {
}
function _aws_cdk_aws_route53recoveryreadiness_CfnResourceSet_ResourceProperty(p) {
}
function _aws_cdk_aws_route53recoveryreadiness_CfnResourceSet_TargetResourceProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_route53recoveryreadiness_CfnCellProps, _aws_cdk_aws_route53recoveryreadiness_CfnCell, _aws_cdk_aws_route53recoveryreadiness_CfnReadinessCheckProps, _aws_cdk_aws_route53recoveryreadiness_CfnReadinessCheck, _aws_cdk_aws_route53recoveryreadiness_CfnRecoveryGroupProps, _aws_cdk_aws_route53recoveryreadiness_CfnRecoveryGroup, _aws_cdk_aws_route53recoveryreadiness_CfnResourceSetProps, _aws_cdk_aws_route53recoveryreadiness_CfnResourceSet, _aws_cdk_aws_route53recoveryreadiness_CfnResourceSet_DNSTargetResourceProperty, _aws_cdk_aws_route53recoveryreadiness_CfnResourceSet_NLBResourceProperty, _aws_cdk_aws_route53recoveryreadiness_CfnResourceSet_R53ResourceRecordProperty, _aws_cdk_aws_route53recoveryreadiness_CfnResourceSet_ResourceProperty, _aws_cdk_aws_route53recoveryreadiness_CfnResourceSet_TargetResourceProperty };
