function _aws_cdk_aws_fis_CfnExperimentTemplateProps(p) {
}
function _aws_cdk_aws_fis_CfnExperimentTemplate(p) {
}
function _aws_cdk_aws_fis_CfnExperimentTemplate_CloudWatchLogsConfigurationProperty(p) {
}
function _aws_cdk_aws_fis_CfnExperimentTemplate_ExperimentTemplateActionProperty(p) {
}
function _aws_cdk_aws_fis_CfnExperimentTemplate_ExperimentTemplateLogConfigurationProperty(p) {
}
function _aws_cdk_aws_fis_CfnExperimentTemplate_ExperimentTemplateStopConditionProperty(p) {
}
function _aws_cdk_aws_fis_CfnExperimentTemplate_ExperimentTemplateTargetProperty(p) {
}
function _aws_cdk_aws_fis_CfnExperimentTemplate_ExperimentTemplateTargetFilterProperty(p) {
}
function _aws_cdk_aws_fis_CfnExperimentTemplate_S3ConfigurationProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_fis_CfnExperimentTemplateProps, _aws_cdk_aws_fis_CfnExperimentTemplate, _aws_cdk_aws_fis_CfnExperimentTemplate_CloudWatchLogsConfigurationProperty, _aws_cdk_aws_fis_CfnExperimentTemplate_ExperimentTemplateActionProperty, _aws_cdk_aws_fis_CfnExperimentTemplate_ExperimentTemplateLogConfigurationProperty, _aws_cdk_aws_fis_CfnExperimentTemplate_ExperimentTemplateStopConditionProperty, _aws_cdk_aws_fis_CfnExperimentTemplate_ExperimentTemplateTargetProperty, _aws_cdk_aws_fis_CfnExperimentTemplate_ExperimentTemplateTargetFilterProperty, _aws_cdk_aws_fis_CfnExperimentTemplate_S3ConfigurationProperty };
