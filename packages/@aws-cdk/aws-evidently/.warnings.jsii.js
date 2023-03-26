function _aws_cdk_aws_evidently_CfnExperimentProps(p) {
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
function _aws_cdk_aws_evidently_CfnExperiment(p) {
}
function _aws_cdk_aws_evidently_CfnExperiment_MetricGoalObjectProperty(p) {
}
function _aws_cdk_aws_evidently_CfnExperiment_OnlineAbConfigObjectProperty(p) {
}
function _aws_cdk_aws_evidently_CfnExperiment_RunningStatusObjectProperty(p) {
}
function _aws_cdk_aws_evidently_CfnExperiment_TreatmentObjectProperty(p) {
}
function _aws_cdk_aws_evidently_CfnExperiment_TreatmentToWeightProperty(p) {
}
function _aws_cdk_aws_evidently_CfnFeatureProps(p) {
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
function _aws_cdk_aws_evidently_CfnFeature(p) {
}
function _aws_cdk_aws_evidently_CfnFeature_EntityOverrideProperty(p) {
}
function _aws_cdk_aws_evidently_CfnFeature_VariationObjectProperty(p) {
}
function _aws_cdk_aws_evidently_CfnLaunchProps(p) {
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
function _aws_cdk_aws_evidently_CfnLaunch(p) {
}
function _aws_cdk_aws_evidently_CfnLaunch_ExecutionStatusObjectProperty(p) {
}
function _aws_cdk_aws_evidently_CfnLaunch_GroupToWeightProperty(p) {
}
function _aws_cdk_aws_evidently_CfnLaunch_LaunchGroupObjectProperty(p) {
}
function _aws_cdk_aws_evidently_CfnLaunch_MetricDefinitionObjectProperty(p) {
}
function _aws_cdk_aws_evidently_CfnLaunch_SegmentOverrideProperty(p) {
}
function _aws_cdk_aws_evidently_CfnLaunch_StepConfigProperty(p) {
}
function _aws_cdk_aws_evidently_CfnProjectProps(p) {
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
function _aws_cdk_aws_evidently_CfnProject(p) {
}
function _aws_cdk_aws_evidently_CfnProject_AppConfigResourceObjectProperty(p) {
}
function _aws_cdk_aws_evidently_CfnProject_DataDeliveryObjectProperty(p) {
}
function _aws_cdk_aws_evidently_CfnProject_S3DestinationProperty(p) {
}
function _aws_cdk_aws_evidently_CfnSegmentProps(p) {
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
function _aws_cdk_aws_evidently_CfnSegment(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_evidently_CfnExperimentProps, _aws_cdk_aws_evidently_CfnExperiment, _aws_cdk_aws_evidently_CfnExperiment_MetricGoalObjectProperty, _aws_cdk_aws_evidently_CfnExperiment_OnlineAbConfigObjectProperty, _aws_cdk_aws_evidently_CfnExperiment_RunningStatusObjectProperty, _aws_cdk_aws_evidently_CfnExperiment_TreatmentObjectProperty, _aws_cdk_aws_evidently_CfnExperiment_TreatmentToWeightProperty, _aws_cdk_aws_evidently_CfnFeatureProps, _aws_cdk_aws_evidently_CfnFeature, _aws_cdk_aws_evidently_CfnFeature_EntityOverrideProperty, _aws_cdk_aws_evidently_CfnFeature_VariationObjectProperty, _aws_cdk_aws_evidently_CfnLaunchProps, _aws_cdk_aws_evidently_CfnLaunch, _aws_cdk_aws_evidently_CfnLaunch_ExecutionStatusObjectProperty, _aws_cdk_aws_evidently_CfnLaunch_GroupToWeightProperty, _aws_cdk_aws_evidently_CfnLaunch_LaunchGroupObjectProperty, _aws_cdk_aws_evidently_CfnLaunch_MetricDefinitionObjectProperty, _aws_cdk_aws_evidently_CfnLaunch_SegmentOverrideProperty, _aws_cdk_aws_evidently_CfnLaunch_StepConfigProperty, _aws_cdk_aws_evidently_CfnProjectProps, _aws_cdk_aws_evidently_CfnProject, _aws_cdk_aws_evidently_CfnProject_AppConfigResourceObjectProperty, _aws_cdk_aws_evidently_CfnProject_DataDeliveryObjectProperty, _aws_cdk_aws_evidently_CfnProject_S3DestinationProperty, _aws_cdk_aws_evidently_CfnSegmentProps, _aws_cdk_aws_evidently_CfnSegment };
