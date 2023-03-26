function _aws_cdk_aws_autoscalingplans_CfnScalingPlanProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.applicationSource))
            _aws_cdk_aws_autoscalingplans_CfnScalingPlan_ApplicationSourceProperty(p.applicationSource);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscalingplans_CfnScalingPlan(p) {
}
function _aws_cdk_aws_autoscalingplans_CfnScalingPlan_ApplicationSourceProperty(p) {
}
function _aws_cdk_aws_autoscalingplans_CfnScalingPlan_CustomizedLoadMetricSpecificationProperty(p) {
}
function _aws_cdk_aws_autoscalingplans_CfnScalingPlan_CustomizedScalingMetricSpecificationProperty(p) {
}
function _aws_cdk_aws_autoscalingplans_CfnScalingPlan_MetricDimensionProperty(p) {
}
function _aws_cdk_aws_autoscalingplans_CfnScalingPlan_PredefinedLoadMetricSpecificationProperty(p) {
}
function _aws_cdk_aws_autoscalingplans_CfnScalingPlan_PredefinedScalingMetricSpecificationProperty(p) {
}
function _aws_cdk_aws_autoscalingplans_CfnScalingPlan_ScalingInstructionProperty(p) {
}
function _aws_cdk_aws_autoscalingplans_CfnScalingPlan_TagFilterProperty(p) {
}
function _aws_cdk_aws_autoscalingplans_CfnScalingPlan_TargetTrackingConfigurationProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_autoscalingplans_CfnScalingPlanProps, _aws_cdk_aws_autoscalingplans_CfnScalingPlan, _aws_cdk_aws_autoscalingplans_CfnScalingPlan_ApplicationSourceProperty, _aws_cdk_aws_autoscalingplans_CfnScalingPlan_CustomizedLoadMetricSpecificationProperty, _aws_cdk_aws_autoscalingplans_CfnScalingPlan_CustomizedScalingMetricSpecificationProperty, _aws_cdk_aws_autoscalingplans_CfnScalingPlan_MetricDimensionProperty, _aws_cdk_aws_autoscalingplans_CfnScalingPlan_PredefinedLoadMetricSpecificationProperty, _aws_cdk_aws_autoscalingplans_CfnScalingPlan_PredefinedScalingMetricSpecificationProperty, _aws_cdk_aws_autoscalingplans_CfnScalingPlan_ScalingInstructionProperty, _aws_cdk_aws_autoscalingplans_CfnScalingPlan_TagFilterProperty, _aws_cdk_aws_autoscalingplans_CfnScalingPlan_TargetTrackingConfigurationProperty };
