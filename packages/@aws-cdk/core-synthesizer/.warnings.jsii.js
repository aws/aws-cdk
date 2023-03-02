function _aws_cdk_core_synthesizer_IStagingStack(p) {
}
function _aws_cdk_core_synthesizer_StagingStackProps(p) {
}
function _aws_cdk_core_synthesizer_StagingStack(p) {
}
function _aws_cdk_core_synthesizer_NewStackSynthesizerProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.stagingStack))
            _aws_cdk_core_synthesizer_IStagingStack(p.stagingStack);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_synthesizer_NewStackSynthesizer(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_core_synthesizer_IStagingStack, _aws_cdk_core_synthesizer_StagingStackProps, _aws_cdk_core_synthesizer_StagingStack, _aws_cdk_core_synthesizer_NewStackSynthesizerProps, _aws_cdk_core_synthesizer_NewStackSynthesizer };
