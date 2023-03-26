function _aws_cdk_aws_route53recoverycontrol_CfnClusterProps(p) {
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
function _aws_cdk_aws_route53recoverycontrol_CfnCluster(p) {
}
function _aws_cdk_aws_route53recoverycontrol_CfnCluster_ClusterEndpointProperty(p) {
}
function _aws_cdk_aws_route53recoverycontrol_CfnControlPanelProps(p) {
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
function _aws_cdk_aws_route53recoverycontrol_CfnControlPanel(p) {
}
function _aws_cdk_aws_route53recoverycontrol_CfnRoutingControlProps(p) {
}
function _aws_cdk_aws_route53recoverycontrol_CfnRoutingControl(p) {
}
function _aws_cdk_aws_route53recoverycontrol_CfnSafetyRuleProps(p) {
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
function _aws_cdk_aws_route53recoverycontrol_CfnSafetyRule(p) {
}
function _aws_cdk_aws_route53recoverycontrol_CfnSafetyRule_AssertionRuleProperty(p) {
}
function _aws_cdk_aws_route53recoverycontrol_CfnSafetyRule_GatingRuleProperty(p) {
}
function _aws_cdk_aws_route53recoverycontrol_CfnSafetyRule_RuleConfigProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_route53recoverycontrol_CfnClusterProps, _aws_cdk_aws_route53recoverycontrol_CfnCluster, _aws_cdk_aws_route53recoverycontrol_CfnCluster_ClusterEndpointProperty, _aws_cdk_aws_route53recoverycontrol_CfnControlPanelProps, _aws_cdk_aws_route53recoverycontrol_CfnControlPanel, _aws_cdk_aws_route53recoverycontrol_CfnRoutingControlProps, _aws_cdk_aws_route53recoverycontrol_CfnRoutingControl, _aws_cdk_aws_route53recoverycontrol_CfnSafetyRuleProps, _aws_cdk_aws_route53recoverycontrol_CfnSafetyRule, _aws_cdk_aws_route53recoverycontrol_CfnSafetyRule_AssertionRuleProperty, _aws_cdk_aws_route53recoverycontrol_CfnSafetyRule_GatingRuleProperty, _aws_cdk_aws_route53recoverycontrol_CfnSafetyRule_RuleConfigProperty };
