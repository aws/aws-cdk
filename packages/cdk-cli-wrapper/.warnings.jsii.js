function cdk_cli_wrapper_ICdk(p) {
}
function cdk_cli_wrapper_SynthFastOptions(p) {
}
function cdk_cli_wrapper_Environment(p) {
}
function cdk_cli_wrapper_CdkCliWrapperOptions(p) {
}
function cdk_cli_wrapper_CdkCliWrapper(p) {
}
function cdk_cli_wrapper_SynthOptions(p) {
}
function cdk_cli_wrapper_RequireApproval(p) {
}
function cdk_cli_wrapper_DefaultCdkOptions(p) {
}
function cdk_cli_wrapper_DeployOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.progress))
            cdk_cli_wrapper_StackActivityProgress(p.progress);
        if (!visitedObjects.has(p.requireApproval))
            cdk_cli_wrapper_RequireApproval(p.requireApproval);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function cdk_cli_wrapper_StackActivityProgress(p) {
}
function cdk_cli_wrapper_DestroyOptions(p) {
}
function cdk_cli_wrapper_ListOptions(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, cdk_cli_wrapper_ICdk, cdk_cli_wrapper_SynthFastOptions, cdk_cli_wrapper_Environment, cdk_cli_wrapper_CdkCliWrapperOptions, cdk_cli_wrapper_CdkCliWrapper, cdk_cli_wrapper_SynthOptions, cdk_cli_wrapper_RequireApproval, cdk_cli_wrapper_DefaultCdkOptions, cdk_cli_wrapper_DeployOptions, cdk_cli_wrapper_StackActivityProgress, cdk_cli_wrapper_DestroyOptions, cdk_cli_wrapper_ListOptions };
