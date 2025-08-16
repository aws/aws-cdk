function _aws_cdk_aws_rum_alpha_IAppMonitor(p) {
}
function _aws_cdk_aws_rum_alpha_CustomEventsConfig(p) {
}
function _aws_cdk_aws_rum_alpha_JavaScriptSourceMapsConfig(p) {
}
function _aws_cdk_aws_rum_alpha_DeobfuscationConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.javaScriptSourceMaps))
            _aws_cdk_aws_rum_alpha_JavaScriptSourceMapsConfig(p.javaScriptSourceMaps);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_rum_alpha_AppMonitorConfiguration(p) {
}
function _aws_cdk_aws_rum_alpha_AppMonitorProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.appMonitorConfiguration))
            _aws_cdk_aws_rum_alpha_AppMonitorConfiguration(p.appMonitorConfiguration);
        if (!visitedObjects.has(p.customEvents))
            _aws_cdk_aws_rum_alpha_CustomEventsConfig(p.customEvents);
        if (!visitedObjects.has(p.deobfuscationConfiguration))
            _aws_cdk_aws_rum_alpha_DeobfuscationConfig(p.deobfuscationConfiguration);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_rum_alpha_AppMonitorAttributes(p) {
}
function _aws_cdk_aws_rum_alpha_AppMonitor(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_rum_alpha_IAppMonitor, _aws_cdk_aws_rum_alpha_CustomEventsConfig, _aws_cdk_aws_rum_alpha_JavaScriptSourceMapsConfig, _aws_cdk_aws_rum_alpha_DeobfuscationConfig, _aws_cdk_aws_rum_alpha_AppMonitorConfiguration, _aws_cdk_aws_rum_alpha_AppMonitorProps, _aws_cdk_aws_rum_alpha_AppMonitorAttributes, _aws_cdk_aws_rum_alpha_AppMonitor };
