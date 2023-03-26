function _aws_cdk_aws_chatbot_CfnSlackChannelConfigurationProps(p) {
}
function _aws_cdk_aws_chatbot_CfnSlackChannelConfiguration(p) {
}
function _aws_cdk_aws_chatbot_SlackChannelConfigurationProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.loggingLevel))
            _aws_cdk_aws_chatbot_LoggingLevel(p.loggingLevel);
        if (p.notificationTopics != null)
            for (const o of p.notificationTopics)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-sns/.warnings.jsii.js")._aws_cdk_aws_sns_ITopic(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_chatbot_LoggingLevel(p) {
}
function _aws_cdk_aws_chatbot_ISlackChannelConfiguration(p) {
}
function _aws_cdk_aws_chatbot_SlackChannelConfiguration(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_chatbot_CfnSlackChannelConfigurationProps, _aws_cdk_aws_chatbot_CfnSlackChannelConfiguration, _aws_cdk_aws_chatbot_SlackChannelConfigurationProps, _aws_cdk_aws_chatbot_LoggingLevel, _aws_cdk_aws_chatbot_ISlackChannelConfiguration, _aws_cdk_aws_chatbot_SlackChannelConfiguration };
