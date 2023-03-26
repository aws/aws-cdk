function _aws_cdk_aws_applicationautoscaling_CfnScalableTargetProps(p) {
}
function _aws_cdk_aws_applicationautoscaling_CfnScalableTarget(p) {
}
function _aws_cdk_aws_applicationautoscaling_CfnScalableTarget_ScalableTargetActionProperty(p) {
}
function _aws_cdk_aws_applicationautoscaling_CfnScalableTarget_ScheduledActionProperty(p) {
}
function _aws_cdk_aws_applicationautoscaling_CfnScalableTarget_SuspendedStateProperty(p) {
}
function _aws_cdk_aws_applicationautoscaling_CfnScalingPolicyProps(p) {
}
function _aws_cdk_aws_applicationautoscaling_CfnScalingPolicy(p) {
}
function _aws_cdk_aws_applicationautoscaling_CfnScalingPolicy_CustomizedMetricSpecificationProperty(p) {
}
function _aws_cdk_aws_applicationautoscaling_CfnScalingPolicy_MetricDimensionProperty(p) {
}
function _aws_cdk_aws_applicationautoscaling_CfnScalingPolicy_PredefinedMetricSpecificationProperty(p) {
}
function _aws_cdk_aws_applicationautoscaling_CfnScalingPolicy_StepAdjustmentProperty(p) {
}
function _aws_cdk_aws_applicationautoscaling_CfnScalingPolicy_StepScalingPolicyConfigurationProperty(p) {
}
function _aws_cdk_aws_applicationautoscaling_CfnScalingPolicy_TargetTrackingScalingPolicyConfigurationProperty(p) {
}
function _aws_cdk_aws_applicationautoscaling_BaseScalableAttributeProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.serviceNamespace))
            _aws_cdk_aws_applicationautoscaling_ServiceNamespace(p.serviceNamespace);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_applicationautoscaling_BaseScalableAttribute(p) {
}
function _aws_cdk_aws_applicationautoscaling_EnableScalingProps(p) {
}
function _aws_cdk_aws_applicationautoscaling_Schedule(p) {
}
function _aws_cdk_aws_applicationautoscaling_CronOptions(p) {
}
function _aws_cdk_aws_applicationautoscaling_IScalableTarget(p) {
}
function _aws_cdk_aws_applicationautoscaling_ScalableTargetProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.serviceNamespace))
            _aws_cdk_aws_applicationautoscaling_ServiceNamespace(p.serviceNamespace);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_applicationautoscaling_ScalableTarget(p) {
}
function _aws_cdk_aws_applicationautoscaling_ScalingSchedule(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.schedule))
            _aws_cdk_aws_applicationautoscaling_Schedule(p.schedule);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_applicationautoscaling_ServiceNamespace(p) {
}
function _aws_cdk_aws_applicationautoscaling_BasicStepScalingPolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.scalingSteps != null)
            for (const o of p.scalingSteps)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_applicationautoscaling_ScalingInterval(o);
        if (!visitedObjects.has(p.adjustmentType))
            _aws_cdk_aws_applicationautoscaling_AdjustmentType(p.adjustmentType);
        if (!visitedObjects.has(p.metricAggregationType))
            _aws_cdk_aws_applicationautoscaling_MetricAggregationType(p.metricAggregationType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_applicationautoscaling_StepScalingPolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.scalingTarget))
            _aws_cdk_aws_applicationautoscaling_IScalableTarget(p.scalingTarget);
        if (p.scalingSteps != null)
            for (const o of p.scalingSteps)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_applicationautoscaling_ScalingInterval(o);
        if (!visitedObjects.has(p.adjustmentType))
            _aws_cdk_aws_applicationautoscaling_AdjustmentType(p.adjustmentType);
        if (!visitedObjects.has(p.metricAggregationType))
            _aws_cdk_aws_applicationautoscaling_MetricAggregationType(p.metricAggregationType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_applicationautoscaling_StepScalingPolicy(p) {
}
function _aws_cdk_aws_applicationautoscaling_ScalingInterval(p) {
}
function _aws_cdk_aws_applicationautoscaling_StepScalingActionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.scalingTarget))
            _aws_cdk_aws_applicationautoscaling_IScalableTarget(p.scalingTarget);
        if (!visitedObjects.has(p.adjustmentType))
            _aws_cdk_aws_applicationautoscaling_AdjustmentType(p.adjustmentType);
        if (!visitedObjects.has(p.metricAggregationType))
            _aws_cdk_aws_applicationautoscaling_MetricAggregationType(p.metricAggregationType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_applicationautoscaling_StepScalingAction(p) {
}
function _aws_cdk_aws_applicationautoscaling_AdjustmentType(p) {
}
function _aws_cdk_aws_applicationautoscaling_MetricAggregationType(p) {
}
function _aws_cdk_aws_applicationautoscaling_AdjustmentTier(p) {
}
function _aws_cdk_aws_applicationautoscaling_BaseTargetTrackingProps(p) {
}
function _aws_cdk_aws_applicationautoscaling_BasicTargetTrackingScalingPolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.predefinedMetric))
            _aws_cdk_aws_applicationautoscaling_PredefinedMetric(p.predefinedMetric);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_applicationautoscaling_TargetTrackingScalingPolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.scalingTarget))
            _aws_cdk_aws_applicationautoscaling_IScalableTarget(p.scalingTarget);
        if (!visitedObjects.has(p.predefinedMetric))
            _aws_cdk_aws_applicationautoscaling_PredefinedMetric(p.predefinedMetric);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_applicationautoscaling_TargetTrackingScalingPolicy(p) {
}
function _aws_cdk_aws_applicationautoscaling_PredefinedMetric(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        const ns = require("./lib/target-tracking-scaling-policy.js");
        if (Object.values(ns.PredefinedMetric).filter(x => x === p).length > 1)
            return;
        if (p === ns.PredefinedMetric.DYANMODB_WRITE_CAPACITY_UTILIZATION)
            print("@aws-cdk/aws-applicationautoscaling.PredefinedMetric#DYANMODB_WRITE_CAPACITY_UTILIZATION", "use `PredefinedMetric.DYNAMODB_WRITE_CAPACITY_UTILIZATION`");
    }
    finally {
        visitedObjects.delete(p);
    }
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_applicationautoscaling_CfnScalableTargetProps, _aws_cdk_aws_applicationautoscaling_CfnScalableTarget, _aws_cdk_aws_applicationautoscaling_CfnScalableTarget_ScalableTargetActionProperty, _aws_cdk_aws_applicationautoscaling_CfnScalableTarget_ScheduledActionProperty, _aws_cdk_aws_applicationautoscaling_CfnScalableTarget_SuspendedStateProperty, _aws_cdk_aws_applicationautoscaling_CfnScalingPolicyProps, _aws_cdk_aws_applicationautoscaling_CfnScalingPolicy, _aws_cdk_aws_applicationautoscaling_CfnScalingPolicy_CustomizedMetricSpecificationProperty, _aws_cdk_aws_applicationautoscaling_CfnScalingPolicy_MetricDimensionProperty, _aws_cdk_aws_applicationautoscaling_CfnScalingPolicy_PredefinedMetricSpecificationProperty, _aws_cdk_aws_applicationautoscaling_CfnScalingPolicy_StepAdjustmentProperty, _aws_cdk_aws_applicationautoscaling_CfnScalingPolicy_StepScalingPolicyConfigurationProperty, _aws_cdk_aws_applicationautoscaling_CfnScalingPolicy_TargetTrackingScalingPolicyConfigurationProperty, _aws_cdk_aws_applicationautoscaling_BaseScalableAttributeProps, _aws_cdk_aws_applicationautoscaling_BaseScalableAttribute, _aws_cdk_aws_applicationautoscaling_EnableScalingProps, _aws_cdk_aws_applicationautoscaling_Schedule, _aws_cdk_aws_applicationautoscaling_CronOptions, _aws_cdk_aws_applicationautoscaling_IScalableTarget, _aws_cdk_aws_applicationautoscaling_ScalableTargetProps, _aws_cdk_aws_applicationautoscaling_ScalableTarget, _aws_cdk_aws_applicationautoscaling_ScalingSchedule, _aws_cdk_aws_applicationautoscaling_ServiceNamespace, _aws_cdk_aws_applicationautoscaling_BasicStepScalingPolicyProps, _aws_cdk_aws_applicationautoscaling_StepScalingPolicyProps, _aws_cdk_aws_applicationautoscaling_StepScalingPolicy, _aws_cdk_aws_applicationautoscaling_ScalingInterval, _aws_cdk_aws_applicationautoscaling_StepScalingActionProps, _aws_cdk_aws_applicationautoscaling_StepScalingAction, _aws_cdk_aws_applicationautoscaling_AdjustmentType, _aws_cdk_aws_applicationautoscaling_MetricAggregationType, _aws_cdk_aws_applicationautoscaling_AdjustmentTier, _aws_cdk_aws_applicationautoscaling_BaseTargetTrackingProps, _aws_cdk_aws_applicationautoscaling_BasicTargetTrackingScalingPolicyProps, _aws_cdk_aws_applicationautoscaling_TargetTrackingScalingPolicyProps, _aws_cdk_aws_applicationautoscaling_TargetTrackingScalingPolicy, _aws_cdk_aws_applicationautoscaling_PredefinedMetric };
