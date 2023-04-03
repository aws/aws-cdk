function _aws_cdk_aws_sns_TopicPolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.topics != null)
            for (const o of p.topics)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_sns_ITopic(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_sns_TopicPolicy(p) {
}
function _aws_cdk_aws_sns_TopicProps(p) {
}
function _aws_cdk_aws_sns_Topic(p) {
}
function _aws_cdk_aws_sns_ITopic(p) {
}
function _aws_cdk_aws_sns_TopicBase(p) {
}
function _aws_cdk_aws_sns_SubscriptionOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.protocol))
            _aws_cdk_aws_sns_SubscriptionProtocol(p.protocol);
        if (p.filterPolicy != null)
            for (const o of Object.values(p.filterPolicy))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_sns_SubscriptionFilter(o);
        if (p.filterPolicyWithMessageBody != null)
            for (const o of Object.values(p.filterPolicyWithMessageBody))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_sns_FilterOrPolicy(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_sns_SubscriptionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.topic))
            _aws_cdk_aws_sns_ITopic(p.topic);
        if (!visitedObjects.has(p.protocol))
            _aws_cdk_aws_sns_SubscriptionProtocol(p.protocol);
        if (p.filterPolicy != null)
            for (const o of Object.values(p.filterPolicy))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_sns_SubscriptionFilter(o);
        if (p.filterPolicyWithMessageBody != null)
            for (const o of Object.values(p.filterPolicyWithMessageBody))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_sns_FilterOrPolicy(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_sns_Subscription(p) {
}
function _aws_cdk_aws_sns_SubscriptionProtocol(p) {
}
function _aws_cdk_aws_sns_FilterOrPolicyType(p) {
}
function _aws_cdk_aws_sns_FilterOrPolicy(p) {
}
function _aws_cdk_aws_sns_Filter(p) {
}
function _aws_cdk_aws_sns_Policy(p) {
}
function _aws_cdk_aws_sns_TopicSubscriptionConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.protocol))
            _aws_cdk_aws_sns_SubscriptionProtocol(p.protocol);
        if (p.filterPolicy != null)
            for (const o of Object.values(p.filterPolicy))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_sns_SubscriptionFilter(o);
        if (p.filterPolicyWithMessageBody != null)
            for (const o of Object.values(p.filterPolicyWithMessageBody))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_sns_FilterOrPolicy(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_sns_ITopicSubscription(p) {
}
function _aws_cdk_aws_sns_StringConditions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("blacklist" in p)
            print("@aws-cdk/aws-sns.StringConditions#blacklist", "use `denylist`");
        if ("whitelist" in p)
            print("@aws-cdk/aws-sns.StringConditions#whitelist", "use `allowlist`");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_sns_BetweenCondition(p) {
}
function _aws_cdk_aws_sns_NumericConditions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.between))
            _aws_cdk_aws_sns_BetweenCondition(p.between);
        if (!visitedObjects.has(p.betweenStrict))
            _aws_cdk_aws_sns_BetweenCondition(p.betweenStrict);
        if ("whitelist" in p)
            print("@aws-cdk/aws-sns.NumericConditions#whitelist", "use `allowlist`");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_sns_SubscriptionFilter(p) {
}
function _aws_cdk_aws_sns_CfnSubscriptionProps(p) {
}
function _aws_cdk_aws_sns_CfnSubscription(p) {
}
function _aws_cdk_aws_sns_CfnTopicProps(p) {
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
function _aws_cdk_aws_sns_CfnTopic(p) {
}
function _aws_cdk_aws_sns_CfnTopic_SubscriptionProperty(p) {
}
function _aws_cdk_aws_sns_CfnTopicPolicyProps(p) {
}
function _aws_cdk_aws_sns_CfnTopicPolicy(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_sns_TopicPolicyProps, _aws_cdk_aws_sns_TopicPolicy, _aws_cdk_aws_sns_TopicProps, _aws_cdk_aws_sns_Topic, _aws_cdk_aws_sns_ITopic, _aws_cdk_aws_sns_TopicBase, _aws_cdk_aws_sns_SubscriptionOptions, _aws_cdk_aws_sns_SubscriptionProps, _aws_cdk_aws_sns_Subscription, _aws_cdk_aws_sns_SubscriptionProtocol, _aws_cdk_aws_sns_FilterOrPolicyType, _aws_cdk_aws_sns_FilterOrPolicy, _aws_cdk_aws_sns_Filter, _aws_cdk_aws_sns_Policy, _aws_cdk_aws_sns_TopicSubscriptionConfig, _aws_cdk_aws_sns_ITopicSubscription, _aws_cdk_aws_sns_StringConditions, _aws_cdk_aws_sns_BetweenCondition, _aws_cdk_aws_sns_NumericConditions, _aws_cdk_aws_sns_SubscriptionFilter, _aws_cdk_aws_sns_CfnSubscriptionProps, _aws_cdk_aws_sns_CfnSubscription, _aws_cdk_aws_sns_CfnTopicProps, _aws_cdk_aws_sns_CfnTopic, _aws_cdk_aws_sns_CfnTopic_SubscriptionProperty, _aws_cdk_aws_sns_CfnTopicPolicyProps, _aws_cdk_aws_sns_CfnTopicPolicy };
