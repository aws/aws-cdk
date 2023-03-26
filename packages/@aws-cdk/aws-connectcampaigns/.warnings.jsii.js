function _aws_cdk_aws_connectcampaigns_CfnCampaignProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.dialerConfig))
            _aws_cdk_aws_connectcampaigns_CfnCampaign_DialerConfigProperty(p.dialerConfig);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_connectcampaigns_CfnCampaign(p) {
}
function _aws_cdk_aws_connectcampaigns_CfnCampaign_DialerConfigProperty(p) {
}
function _aws_cdk_aws_connectcampaigns_CfnCampaign_OutboundCallConfigProperty(p) {
}
function _aws_cdk_aws_connectcampaigns_CfnCampaign_PredictiveDialerConfigProperty(p) {
}
function _aws_cdk_aws_connectcampaigns_CfnCampaign_ProgressiveDialerConfigProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_connectcampaigns_CfnCampaignProps, _aws_cdk_aws_connectcampaigns_CfnCampaign, _aws_cdk_aws_connectcampaigns_CfnCampaign_DialerConfigProperty, _aws_cdk_aws_connectcampaigns_CfnCampaign_OutboundCallConfigProperty, _aws_cdk_aws_connectcampaigns_CfnCampaign_PredictiveDialerConfigProperty, _aws_cdk_aws_connectcampaigns_CfnCampaign_ProgressiveDialerConfigProperty };
