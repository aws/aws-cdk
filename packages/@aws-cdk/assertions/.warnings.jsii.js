function _aws_cdk_assertions_Capture(p) {
}
function _aws_cdk_assertions_Template(p) {
}
function _aws_cdk_assertions_TemplateParsingOptions(p) {
}
function _aws_cdk_assertions_Match(p) {
}
function _aws_cdk_assertions_Matcher(p) {
}
function _aws_cdk_assertions_MatchFailure(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.matcher))
            _aws_cdk_assertions_Matcher(p.matcher);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_assertions_MatchCapture(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.capture))
            _aws_cdk_assertions_Capture(p.capture);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_assertions_MatchResult(p) {
}
function _aws_cdk_assertions_Annotations(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_assertions_Capture, _aws_cdk_assertions_Template, _aws_cdk_assertions_TemplateParsingOptions, _aws_cdk_assertions_Match, _aws_cdk_assertions_Matcher, _aws_cdk_assertions_MatchFailure, _aws_cdk_assertions_MatchCapture, _aws_cdk_assertions_MatchResult, _aws_cdk_assertions_Annotations };
