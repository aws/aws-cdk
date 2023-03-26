function _aws_cdk_aws_devopsguru_CfnNotificationChannelProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.config))
            _aws_cdk_aws_devopsguru_CfnNotificationChannel_NotificationChannelConfigProperty(p.config);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_devopsguru_CfnNotificationChannel(p) {
}
function _aws_cdk_aws_devopsguru_CfnNotificationChannel_NotificationChannelConfigProperty(p) {
}
function _aws_cdk_aws_devopsguru_CfnNotificationChannel_NotificationFilterConfigProperty(p) {
}
function _aws_cdk_aws_devopsguru_CfnNotificationChannel_SnsChannelConfigProperty(p) {
}
function _aws_cdk_aws_devopsguru_CfnResourceCollectionProps(p) {
}
function _aws_cdk_aws_devopsguru_CfnResourceCollection(p) {
}
function _aws_cdk_aws_devopsguru_CfnResourceCollection_CloudFormationCollectionFilterProperty(p) {
}
function _aws_cdk_aws_devopsguru_CfnResourceCollection_ResourceCollectionFilterProperty(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_devopsguru_CfnResourceCollection_TagCollectionProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_devopsguru_CfnResourceCollection_TagCollectionProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_devopsguru_CfnNotificationChannelProps, _aws_cdk_aws_devopsguru_CfnNotificationChannel, _aws_cdk_aws_devopsguru_CfnNotificationChannel_NotificationChannelConfigProperty, _aws_cdk_aws_devopsguru_CfnNotificationChannel_NotificationFilterConfigProperty, _aws_cdk_aws_devopsguru_CfnNotificationChannel_SnsChannelConfigProperty, _aws_cdk_aws_devopsguru_CfnResourceCollectionProps, _aws_cdk_aws_devopsguru_CfnResourceCollection, _aws_cdk_aws_devopsguru_CfnResourceCollection_CloudFormationCollectionFilterProperty, _aws_cdk_aws_devopsguru_CfnResourceCollection_ResourceCollectionFilterProperty, _aws_cdk_aws_devopsguru_CfnResourceCollection_TagCollectionProperty };
