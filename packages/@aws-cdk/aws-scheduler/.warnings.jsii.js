function _aws_cdk_aws_scheduler_CfnScheduleProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.flexibleTimeWindow))
            _aws_cdk_aws_scheduler_CfnSchedule_FlexibleTimeWindowProperty(p.flexibleTimeWindow);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_scheduler_CfnSchedule(p) {
}
function _aws_cdk_aws_scheduler_CfnSchedule_AwsVpcConfigurationProperty(p) {
}
function _aws_cdk_aws_scheduler_CfnSchedule_CapacityProviderStrategyItemProperty(p) {
}
function _aws_cdk_aws_scheduler_CfnSchedule_DeadLetterConfigProperty(p) {
}
function _aws_cdk_aws_scheduler_CfnSchedule_EcsParametersProperty(p) {
}
function _aws_cdk_aws_scheduler_CfnSchedule_EventBridgeParametersProperty(p) {
}
function _aws_cdk_aws_scheduler_CfnSchedule_FlexibleTimeWindowProperty(p) {
}
function _aws_cdk_aws_scheduler_CfnSchedule_KinesisParametersProperty(p) {
}
function _aws_cdk_aws_scheduler_CfnSchedule_NetworkConfigurationProperty(p) {
}
function _aws_cdk_aws_scheduler_CfnSchedule_PlacementConstraintProperty(p) {
}
function _aws_cdk_aws_scheduler_CfnSchedule_PlacementStrategyProperty(p) {
}
function _aws_cdk_aws_scheduler_CfnSchedule_RetryPolicyProperty(p) {
}
function _aws_cdk_aws_scheduler_CfnSchedule_SageMakerPipelineParameterProperty(p) {
}
function _aws_cdk_aws_scheduler_CfnSchedule_SageMakerPipelineParametersProperty(p) {
}
function _aws_cdk_aws_scheduler_CfnSchedule_SqsParametersProperty(p) {
}
function _aws_cdk_aws_scheduler_CfnSchedule_TargetProperty(p) {
}
function _aws_cdk_aws_scheduler_CfnScheduleGroupProps(p) {
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
function _aws_cdk_aws_scheduler_CfnScheduleGroup(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_scheduler_CfnScheduleProps, _aws_cdk_aws_scheduler_CfnSchedule, _aws_cdk_aws_scheduler_CfnSchedule_AwsVpcConfigurationProperty, _aws_cdk_aws_scheduler_CfnSchedule_CapacityProviderStrategyItemProperty, _aws_cdk_aws_scheduler_CfnSchedule_DeadLetterConfigProperty, _aws_cdk_aws_scheduler_CfnSchedule_EcsParametersProperty, _aws_cdk_aws_scheduler_CfnSchedule_EventBridgeParametersProperty, _aws_cdk_aws_scheduler_CfnSchedule_FlexibleTimeWindowProperty, _aws_cdk_aws_scheduler_CfnSchedule_KinesisParametersProperty, _aws_cdk_aws_scheduler_CfnSchedule_NetworkConfigurationProperty, _aws_cdk_aws_scheduler_CfnSchedule_PlacementConstraintProperty, _aws_cdk_aws_scheduler_CfnSchedule_PlacementStrategyProperty, _aws_cdk_aws_scheduler_CfnSchedule_RetryPolicyProperty, _aws_cdk_aws_scheduler_CfnSchedule_SageMakerPipelineParameterProperty, _aws_cdk_aws_scheduler_CfnSchedule_SageMakerPipelineParametersProperty, _aws_cdk_aws_scheduler_CfnSchedule_SqsParametersProperty, _aws_cdk_aws_scheduler_CfnSchedule_TargetProperty, _aws_cdk_aws_scheduler_CfnScheduleGroupProps, _aws_cdk_aws_scheduler_CfnScheduleGroup };
