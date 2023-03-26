function _aws_cdk_aws_elasticbeanstalk_CfnApplicationProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.resourceLifecycleConfig))
            _aws_cdk_aws_elasticbeanstalk_CfnApplication_ApplicationResourceLifecycleConfigProperty(p.resourceLifecycleConfig);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_elasticbeanstalk_CfnApplication(p) {
}
function _aws_cdk_aws_elasticbeanstalk_CfnApplication_ApplicationResourceLifecycleConfigProperty(p) {
}
function _aws_cdk_aws_elasticbeanstalk_CfnApplication_ApplicationVersionLifecycleConfigProperty(p) {
}
function _aws_cdk_aws_elasticbeanstalk_CfnApplication_MaxAgeRuleProperty(p) {
}
function _aws_cdk_aws_elasticbeanstalk_CfnApplication_MaxCountRuleProperty(p) {
}
function _aws_cdk_aws_elasticbeanstalk_CfnApplicationVersionProps(p) {
}
function _aws_cdk_aws_elasticbeanstalk_CfnApplicationVersion(p) {
}
function _aws_cdk_aws_elasticbeanstalk_CfnApplicationVersion_SourceBundleProperty(p) {
}
function _aws_cdk_aws_elasticbeanstalk_CfnConfigurationTemplateProps(p) {
}
function _aws_cdk_aws_elasticbeanstalk_CfnConfigurationTemplate(p) {
}
function _aws_cdk_aws_elasticbeanstalk_CfnConfigurationTemplate_ConfigurationOptionSettingProperty(p) {
}
function _aws_cdk_aws_elasticbeanstalk_CfnConfigurationTemplate_SourceConfigurationProperty(p) {
}
function _aws_cdk_aws_elasticbeanstalk_CfnEnvironmentProps(p) {
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
function _aws_cdk_aws_elasticbeanstalk_CfnEnvironment(p) {
}
function _aws_cdk_aws_elasticbeanstalk_CfnEnvironment_OptionSettingProperty(p) {
}
function _aws_cdk_aws_elasticbeanstalk_CfnEnvironment_TierProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_elasticbeanstalk_CfnApplicationProps, _aws_cdk_aws_elasticbeanstalk_CfnApplication, _aws_cdk_aws_elasticbeanstalk_CfnApplication_ApplicationResourceLifecycleConfigProperty, _aws_cdk_aws_elasticbeanstalk_CfnApplication_ApplicationVersionLifecycleConfigProperty, _aws_cdk_aws_elasticbeanstalk_CfnApplication_MaxAgeRuleProperty, _aws_cdk_aws_elasticbeanstalk_CfnApplication_MaxCountRuleProperty, _aws_cdk_aws_elasticbeanstalk_CfnApplicationVersionProps, _aws_cdk_aws_elasticbeanstalk_CfnApplicationVersion, _aws_cdk_aws_elasticbeanstalk_CfnApplicationVersion_SourceBundleProperty, _aws_cdk_aws_elasticbeanstalk_CfnConfigurationTemplateProps, _aws_cdk_aws_elasticbeanstalk_CfnConfigurationTemplate, _aws_cdk_aws_elasticbeanstalk_CfnConfigurationTemplate_ConfigurationOptionSettingProperty, _aws_cdk_aws_elasticbeanstalk_CfnConfigurationTemplate_SourceConfigurationProperty, _aws_cdk_aws_elasticbeanstalk_CfnEnvironmentProps, _aws_cdk_aws_elasticbeanstalk_CfnEnvironment, _aws_cdk_aws_elasticbeanstalk_CfnEnvironment_OptionSettingProperty, _aws_cdk_aws_elasticbeanstalk_CfnEnvironment_TierProperty };
