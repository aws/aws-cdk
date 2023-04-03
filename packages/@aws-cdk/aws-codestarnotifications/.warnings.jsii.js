function _aws_cdk_aws_codestarnotifications_CfnNotificationRuleProps(p) {
}
function _aws_cdk_aws_codestarnotifications_CfnNotificationRule(p) {
}
function _aws_cdk_aws_codestarnotifications_CfnNotificationRule_TargetProperty(p) {
}
function _aws_cdk_aws_codestarnotifications_DetailType(p) {
}
function _aws_cdk_aws_codestarnotifications_NotificationRuleOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.detailType))
            _aws_cdk_aws_codestarnotifications_DetailType(p.detailType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codestarnotifications_NotificationRuleProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.source))
            _aws_cdk_aws_codestarnotifications_INotificationRuleSource(p.source);
        if (p.targets != null)
            for (const o of p.targets)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codestarnotifications_INotificationRuleTarget(o);
        if (!visitedObjects.has(p.detailType))
            _aws_cdk_aws_codestarnotifications_DetailType(p.detailType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codestarnotifications_INotificationRule(p) {
}
function _aws_cdk_aws_codestarnotifications_NotificationRule(p) {
}
function _aws_cdk_aws_codestarnotifications_NotificationRuleSourceConfig(p) {
}
function _aws_cdk_aws_codestarnotifications_INotificationRuleSource(p) {
}
function _aws_cdk_aws_codestarnotifications_NotificationRuleTargetConfig(p) {
}
function _aws_cdk_aws_codestarnotifications_INotificationRuleTarget(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_codestarnotifications_CfnNotificationRuleProps, _aws_cdk_aws_codestarnotifications_CfnNotificationRule, _aws_cdk_aws_codestarnotifications_CfnNotificationRule_TargetProperty, _aws_cdk_aws_codestarnotifications_DetailType, _aws_cdk_aws_codestarnotifications_NotificationRuleOptions, _aws_cdk_aws_codestarnotifications_NotificationRuleProps, _aws_cdk_aws_codestarnotifications_INotificationRule, _aws_cdk_aws_codestarnotifications_NotificationRule, _aws_cdk_aws_codestarnotifications_NotificationRuleSourceConfig, _aws_cdk_aws_codestarnotifications_INotificationRuleSource, _aws_cdk_aws_codestarnotifications_NotificationRuleTargetConfig, _aws_cdk_aws_codestarnotifications_INotificationRuleTarget };
