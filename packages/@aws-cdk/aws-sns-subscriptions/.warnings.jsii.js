function _aws_cdk_aws_sns_subscriptions_SubscriptionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.filterPolicy != null)
            for (const o of Object.values(p.filterPolicy))
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-sns/.warnings.jsii.js")._aws_cdk_aws_sns_SubscriptionFilter(o);
        if (p.filterPolicyWithMessageBody != null)
            for (const o of Object.values(p.filterPolicyWithMessageBody))
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-sns/.warnings.jsii.js")._aws_cdk_aws_sns_FilterOrPolicy(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_sns_subscriptions_EmailSubscriptionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.filterPolicy != null)
            for (const o of Object.values(p.filterPolicy))
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-sns/.warnings.jsii.js")._aws_cdk_aws_sns_SubscriptionFilter(o);
        if (p.filterPolicyWithMessageBody != null)
            for (const o of Object.values(p.filterPolicyWithMessageBody))
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-sns/.warnings.jsii.js")._aws_cdk_aws_sns_FilterOrPolicy(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_sns_subscriptions_EmailSubscription(p) {
}
function _aws_cdk_aws_sns_subscriptions_LambdaSubscriptionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.filterPolicy != null)
            for (const o of Object.values(p.filterPolicy))
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-sns/.warnings.jsii.js")._aws_cdk_aws_sns_SubscriptionFilter(o);
        if (p.filterPolicyWithMessageBody != null)
            for (const o of Object.values(p.filterPolicyWithMessageBody))
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-sns/.warnings.jsii.js")._aws_cdk_aws_sns_FilterOrPolicy(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_sns_subscriptions_LambdaSubscription(p) {
}
function _aws_cdk_aws_sns_subscriptions_SqsSubscriptionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.filterPolicy != null)
            for (const o of Object.values(p.filterPolicy))
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-sns/.warnings.jsii.js")._aws_cdk_aws_sns_SubscriptionFilter(o);
        if (p.filterPolicyWithMessageBody != null)
            for (const o of Object.values(p.filterPolicyWithMessageBody))
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-sns/.warnings.jsii.js")._aws_cdk_aws_sns_FilterOrPolicy(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_sns_subscriptions_SqsSubscription(p) {
}
function _aws_cdk_aws_sns_subscriptions_UrlSubscriptionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.filterPolicy != null)
            for (const o of Object.values(p.filterPolicy))
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-sns/.warnings.jsii.js")._aws_cdk_aws_sns_SubscriptionFilter(o);
        if (p.filterPolicyWithMessageBody != null)
            for (const o of Object.values(p.filterPolicyWithMessageBody))
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-sns/.warnings.jsii.js")._aws_cdk_aws_sns_FilterOrPolicy(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_sns_subscriptions_UrlSubscription(p) {
}
function _aws_cdk_aws_sns_subscriptions_SmsSubscriptionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.filterPolicy != null)
            for (const o of Object.values(p.filterPolicy))
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-sns/.warnings.jsii.js")._aws_cdk_aws_sns_SubscriptionFilter(o);
        if (p.filterPolicyWithMessageBody != null)
            for (const o of Object.values(p.filterPolicyWithMessageBody))
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-sns/.warnings.jsii.js")._aws_cdk_aws_sns_FilterOrPolicy(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_sns_subscriptions_SmsSubscription(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_sns_subscriptions_SubscriptionProps, _aws_cdk_aws_sns_subscriptions_EmailSubscriptionProps, _aws_cdk_aws_sns_subscriptions_EmailSubscription, _aws_cdk_aws_sns_subscriptions_LambdaSubscriptionProps, _aws_cdk_aws_sns_subscriptions_LambdaSubscription, _aws_cdk_aws_sns_subscriptions_SqsSubscriptionProps, _aws_cdk_aws_sns_subscriptions_SqsSubscription, _aws_cdk_aws_sns_subscriptions_UrlSubscriptionProps, _aws_cdk_aws_sns_subscriptions_UrlSubscription, _aws_cdk_aws_sns_subscriptions_SmsSubscriptionProps, _aws_cdk_aws_sns_subscriptions_SmsSubscription };
