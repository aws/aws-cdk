function _aws_cdk_aws_autoscaling_common_ScalingInterval(p) {
}
function _aws_cdk_aws_autoscaling_common_CompleteScalingInterval(p) {
}
function _aws_cdk_aws_autoscaling_common_Alarms(p) {
}
function _aws_cdk_aws_autoscaling_common_IRandomGenerator(p) {
}
function _aws_cdk_aws_autoscaling_common_ArbitraryIntervals(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.intervals != null)
            for (const o of p.intervals)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_autoscaling_common_ScalingInterval(o);
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_autoscaling_common_ScalingInterval, _aws_cdk_aws_autoscaling_common_CompleteScalingInterval, _aws_cdk_aws_autoscaling_common_Alarms, _aws_cdk_aws_autoscaling_common_IRandomGenerator, _aws_cdk_aws_autoscaling_common_ArbitraryIntervals };
