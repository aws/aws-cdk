function _aws_cdk_aws_codecommit_ReferenceEvent(p) {
}
function _aws_cdk_aws_codecommit_RepositoryNotifyOnOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.events != null)
            for (const o of p.events)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codecommit_RepositoryNotificationEvents(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codecommit_IRepository(p) {
}
function _aws_cdk_aws_codecommit_OnCommitOptions(p) {
}
function _aws_cdk_aws_codecommit_RepositoryProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.code))
            _aws_cdk_aws_codecommit_Code(p.code);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codecommit_Repository(p) {
}
function _aws_cdk_aws_codecommit_RepositoryTriggerOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.events != null)
            for (const o of p.events)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codecommit_RepositoryEventTrigger(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codecommit_RepositoryEventTrigger(p) {
}
function _aws_cdk_aws_codecommit_RepositoryNotificationEvents(p) {
}
function _aws_cdk_aws_codecommit_CodeConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.code))
            _aws_cdk_aws_codecommit_CfnRepository_CodeProperty(p.code);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codecommit_Code(p) {
}
function _aws_cdk_aws_codecommit_CfnRepositoryProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.code))
            _aws_cdk_aws_codecommit_CfnRepository_CodeProperty(p.code);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codecommit_CfnRepository(p) {
}
function _aws_cdk_aws_codecommit_CfnRepository_CodeProperty(p) {
}
function _aws_cdk_aws_codecommit_CfnRepository_RepositoryTriggerProperty(p) {
}
function _aws_cdk_aws_codecommit_CfnRepository_S3Property(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_codecommit_ReferenceEvent, _aws_cdk_aws_codecommit_RepositoryNotifyOnOptions, _aws_cdk_aws_codecommit_IRepository, _aws_cdk_aws_codecommit_OnCommitOptions, _aws_cdk_aws_codecommit_RepositoryProps, _aws_cdk_aws_codecommit_Repository, _aws_cdk_aws_codecommit_RepositoryTriggerOptions, _aws_cdk_aws_codecommit_RepositoryEventTrigger, _aws_cdk_aws_codecommit_RepositoryNotificationEvents, _aws_cdk_aws_codecommit_CodeConfig, _aws_cdk_aws_codecommit_Code, _aws_cdk_aws_codecommit_CfnRepositoryProps, _aws_cdk_aws_codecommit_CfnRepository, _aws_cdk_aws_codecommit_CfnRepository_CodeProperty, _aws_cdk_aws_codecommit_CfnRepository_RepositoryTriggerProperty, _aws_cdk_aws_codecommit_CfnRepository_S3Property };
