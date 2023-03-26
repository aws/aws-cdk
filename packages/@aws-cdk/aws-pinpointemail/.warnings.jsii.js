function _aws_cdk_aws_pinpointemail_CfnConfigurationSetProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.deliveryOptions))
            _aws_cdk_aws_pinpointemail_CfnConfigurationSet_DeliveryOptionsProperty(p.deliveryOptions);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_pinpointemail_CfnConfigurationSet_TagsProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_pinpointemail_CfnConfigurationSet(p) {
}
function _aws_cdk_aws_pinpointemail_CfnConfigurationSet_DeliveryOptionsProperty(p) {
}
function _aws_cdk_aws_pinpointemail_CfnConfigurationSet_ReputationOptionsProperty(p) {
}
function _aws_cdk_aws_pinpointemail_CfnConfigurationSet_SendingOptionsProperty(p) {
}
function _aws_cdk_aws_pinpointemail_CfnConfigurationSet_TagsProperty(p) {
}
function _aws_cdk_aws_pinpointemail_CfnConfigurationSet_TrackingOptionsProperty(p) {
}
function _aws_cdk_aws_pinpointemail_CfnConfigurationSetEventDestinationProps(p) {
}
function _aws_cdk_aws_pinpointemail_CfnConfigurationSetEventDestination(p) {
}
function _aws_cdk_aws_pinpointemail_CfnConfigurationSetEventDestination_CloudWatchDestinationProperty(p) {
}
function _aws_cdk_aws_pinpointemail_CfnConfigurationSetEventDestination_DimensionConfigurationProperty(p) {
}
function _aws_cdk_aws_pinpointemail_CfnConfigurationSetEventDestination_EventDestinationProperty(p) {
}
function _aws_cdk_aws_pinpointemail_CfnConfigurationSetEventDestination_KinesisFirehoseDestinationProperty(p) {
}
function _aws_cdk_aws_pinpointemail_CfnConfigurationSetEventDestination_PinpointDestinationProperty(p) {
}
function _aws_cdk_aws_pinpointemail_CfnConfigurationSetEventDestination_SnsDestinationProperty(p) {
}
function _aws_cdk_aws_pinpointemail_CfnDedicatedIpPoolProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_pinpointemail_CfnDedicatedIpPool_TagsProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_pinpointemail_CfnDedicatedIpPool(p) {
}
function _aws_cdk_aws_pinpointemail_CfnDedicatedIpPool_TagsProperty(p) {
}
function _aws_cdk_aws_pinpointemail_CfnIdentityProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_pinpointemail_CfnIdentity_TagsProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_pinpointemail_CfnIdentity(p) {
}
function _aws_cdk_aws_pinpointemail_CfnIdentity_MailFromAttributesProperty(p) {
}
function _aws_cdk_aws_pinpointemail_CfnIdentity_TagsProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_pinpointemail_CfnConfigurationSetProps, _aws_cdk_aws_pinpointemail_CfnConfigurationSet, _aws_cdk_aws_pinpointemail_CfnConfigurationSet_DeliveryOptionsProperty, _aws_cdk_aws_pinpointemail_CfnConfigurationSet_ReputationOptionsProperty, _aws_cdk_aws_pinpointemail_CfnConfigurationSet_SendingOptionsProperty, _aws_cdk_aws_pinpointemail_CfnConfigurationSet_TagsProperty, _aws_cdk_aws_pinpointemail_CfnConfigurationSet_TrackingOptionsProperty, _aws_cdk_aws_pinpointemail_CfnConfigurationSetEventDestinationProps, _aws_cdk_aws_pinpointemail_CfnConfigurationSetEventDestination, _aws_cdk_aws_pinpointemail_CfnConfigurationSetEventDestination_CloudWatchDestinationProperty, _aws_cdk_aws_pinpointemail_CfnConfigurationSetEventDestination_DimensionConfigurationProperty, _aws_cdk_aws_pinpointemail_CfnConfigurationSetEventDestination_EventDestinationProperty, _aws_cdk_aws_pinpointemail_CfnConfigurationSetEventDestination_KinesisFirehoseDestinationProperty, _aws_cdk_aws_pinpointemail_CfnConfigurationSetEventDestination_PinpointDestinationProperty, _aws_cdk_aws_pinpointemail_CfnConfigurationSetEventDestination_SnsDestinationProperty, _aws_cdk_aws_pinpointemail_CfnDedicatedIpPoolProps, _aws_cdk_aws_pinpointemail_CfnDedicatedIpPool, _aws_cdk_aws_pinpointemail_CfnDedicatedIpPool_TagsProperty, _aws_cdk_aws_pinpointemail_CfnIdentityProps, _aws_cdk_aws_pinpointemail_CfnIdentity, _aws_cdk_aws_pinpointemail_CfnIdentity_MailFromAttributesProperty, _aws_cdk_aws_pinpointemail_CfnIdentity_TagsProperty };
