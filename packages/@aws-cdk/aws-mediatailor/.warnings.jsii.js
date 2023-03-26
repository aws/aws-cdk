function _aws_cdk_aws_mediatailor_CfnPlaybackConfigurationProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.availSuppression))
            _aws_cdk_aws_mediatailor_CfnPlaybackConfiguration_AvailSuppressionProperty(p.availSuppression);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_mediatailor_CfnPlaybackConfiguration(p) {
}
function _aws_cdk_aws_mediatailor_CfnPlaybackConfiguration_AdMarkerPassthroughProperty(p) {
}
function _aws_cdk_aws_mediatailor_CfnPlaybackConfiguration_AvailSuppressionProperty(p) {
}
function _aws_cdk_aws_mediatailor_CfnPlaybackConfiguration_BumperProperty(p) {
}
function _aws_cdk_aws_mediatailor_CfnPlaybackConfiguration_CdnConfigurationProperty(p) {
}
function _aws_cdk_aws_mediatailor_CfnPlaybackConfiguration_DashConfigurationProperty(p) {
}
function _aws_cdk_aws_mediatailor_CfnPlaybackConfiguration_HlsConfigurationProperty(p) {
}
function _aws_cdk_aws_mediatailor_CfnPlaybackConfiguration_LivePreRollConfigurationProperty(p) {
}
function _aws_cdk_aws_mediatailor_CfnPlaybackConfiguration_ManifestProcessingRulesProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_mediatailor_CfnPlaybackConfigurationProps, _aws_cdk_aws_mediatailor_CfnPlaybackConfiguration, _aws_cdk_aws_mediatailor_CfnPlaybackConfiguration_AdMarkerPassthroughProperty, _aws_cdk_aws_mediatailor_CfnPlaybackConfiguration_AvailSuppressionProperty, _aws_cdk_aws_mediatailor_CfnPlaybackConfiguration_BumperProperty, _aws_cdk_aws_mediatailor_CfnPlaybackConfiguration_CdnConfigurationProperty, _aws_cdk_aws_mediatailor_CfnPlaybackConfiguration_DashConfigurationProperty, _aws_cdk_aws_mediatailor_CfnPlaybackConfiguration_HlsConfigurationProperty, _aws_cdk_aws_mediatailor_CfnPlaybackConfiguration_LivePreRollConfigurationProperty, _aws_cdk_aws_mediatailor_CfnPlaybackConfiguration_ManifestProcessingRulesProperty };
