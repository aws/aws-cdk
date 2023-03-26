function _aws_cdk_aws_eventschemas_CfnDiscovererProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_eventschemas_CfnDiscoverer_TagsEntryProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eventschemas_CfnDiscoverer(p) {
}
function _aws_cdk_aws_eventschemas_CfnDiscoverer_TagsEntryProperty(p) {
}
function _aws_cdk_aws_eventschemas_CfnRegistryProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_eventschemas_CfnRegistry_TagsEntryProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eventschemas_CfnRegistry(p) {
}
function _aws_cdk_aws_eventschemas_CfnRegistry_TagsEntryProperty(p) {
}
function _aws_cdk_aws_eventschemas_CfnRegistryPolicyProps(p) {
}
function _aws_cdk_aws_eventschemas_CfnRegistryPolicy(p) {
}
function _aws_cdk_aws_eventschemas_CfnSchemaProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_eventschemas_CfnSchema_TagsEntryProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eventschemas_CfnSchema(p) {
}
function _aws_cdk_aws_eventschemas_CfnSchema_TagsEntryProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_eventschemas_CfnDiscovererProps, _aws_cdk_aws_eventschemas_CfnDiscoverer, _aws_cdk_aws_eventschemas_CfnDiscoverer_TagsEntryProperty, _aws_cdk_aws_eventschemas_CfnRegistryProps, _aws_cdk_aws_eventschemas_CfnRegistry, _aws_cdk_aws_eventschemas_CfnRegistry_TagsEntryProperty, _aws_cdk_aws_eventschemas_CfnRegistryPolicyProps, _aws_cdk_aws_eventschemas_CfnRegistryPolicy, _aws_cdk_aws_eventschemas_CfnSchemaProps, _aws_cdk_aws_eventschemas_CfnSchema, _aws_cdk_aws_eventschemas_CfnSchema_TagsEntryProperty };
