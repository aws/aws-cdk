function _aws_cdk_aws_globalaccelerator_CfnAcceleratorProps(p) {
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
function _aws_cdk_aws_globalaccelerator_CfnAccelerator(p) {
}
function _aws_cdk_aws_globalaccelerator_CfnEndpointGroupProps(p) {
}
function _aws_cdk_aws_globalaccelerator_CfnEndpointGroup(p) {
}
function _aws_cdk_aws_globalaccelerator_CfnEndpointGroup_EndpointConfigurationProperty(p) {
}
function _aws_cdk_aws_globalaccelerator_CfnEndpointGroup_PortOverrideProperty(p) {
}
function _aws_cdk_aws_globalaccelerator_CfnListenerProps(p) {
}
function _aws_cdk_aws_globalaccelerator_CfnListener(p) {
}
function _aws_cdk_aws_globalaccelerator_CfnListener_PortRangeProperty(p) {
}
function _aws_cdk_aws_globalaccelerator_IAccelerator(p) {
}
function _aws_cdk_aws_globalaccelerator_AcceleratorProps(p) {
}
function _aws_cdk_aws_globalaccelerator_AcceleratorAttributes(p) {
}
function _aws_cdk_aws_globalaccelerator_Accelerator(p) {
}
function _aws_cdk_aws_globalaccelerator_IListener(p) {
}
function _aws_cdk_aws_globalaccelerator_ListenerOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.portRanges != null)
            for (const o of p.portRanges)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_globalaccelerator_PortRange(o);
        if (!visitedObjects.has(p.clientAffinity))
            _aws_cdk_aws_globalaccelerator_ClientAffinity(p.clientAffinity);
        if (!visitedObjects.has(p.protocol))
            _aws_cdk_aws_globalaccelerator_ConnectionProtocol(p.protocol);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_globalaccelerator_ListenerProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.accelerator))
            _aws_cdk_aws_globalaccelerator_IAccelerator(p.accelerator);
        if (p.portRanges != null)
            for (const o of p.portRanges)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_globalaccelerator_PortRange(o);
        if (!visitedObjects.has(p.clientAffinity))
            _aws_cdk_aws_globalaccelerator_ClientAffinity(p.clientAffinity);
        if (!visitedObjects.has(p.protocol))
            _aws_cdk_aws_globalaccelerator_ConnectionProtocol(p.protocol);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_globalaccelerator_PortRange(p) {
}
function _aws_cdk_aws_globalaccelerator_ConnectionProtocol(p) {
}
function _aws_cdk_aws_globalaccelerator_ClientAffinity(p) {
}
function _aws_cdk_aws_globalaccelerator_Listener(p) {
}
function _aws_cdk_aws_globalaccelerator_IEndpointGroup(p) {
}
function _aws_cdk_aws_globalaccelerator_EndpointGroupOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.endpoints != null)
            for (const o of p.endpoints)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_globalaccelerator_IEndpoint(o);
        if (!visitedObjects.has(p.healthCheckProtocol))
            _aws_cdk_aws_globalaccelerator_HealthCheckProtocol(p.healthCheckProtocol);
        if (p.portOverrides != null)
            for (const o of p.portOverrides)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_globalaccelerator_PortOverride(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_globalaccelerator_PortOverride(p) {
}
function _aws_cdk_aws_globalaccelerator_HealthCheckProtocol(p) {
}
function _aws_cdk_aws_globalaccelerator_EndpointGroupProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.listener))
            _aws_cdk_aws_globalaccelerator_IListener(p.listener);
        if (p.endpoints != null)
            for (const o of p.endpoints)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_globalaccelerator_IEndpoint(o);
        if (!visitedObjects.has(p.healthCheckProtocol))
            _aws_cdk_aws_globalaccelerator_HealthCheckProtocol(p.healthCheckProtocol);
        if (p.portOverrides != null)
            for (const o of p.portOverrides)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_globalaccelerator_PortOverride(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_globalaccelerator_EndpointGroup(p) {
}
function _aws_cdk_aws_globalaccelerator_IEndpoint(p) {
}
function _aws_cdk_aws_globalaccelerator_RawEndpointProps(p) {
}
function _aws_cdk_aws_globalaccelerator_RawEndpoint(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_globalaccelerator_CfnAcceleratorProps, _aws_cdk_aws_globalaccelerator_CfnAccelerator, _aws_cdk_aws_globalaccelerator_CfnEndpointGroupProps, _aws_cdk_aws_globalaccelerator_CfnEndpointGroup, _aws_cdk_aws_globalaccelerator_CfnEndpointGroup_EndpointConfigurationProperty, _aws_cdk_aws_globalaccelerator_CfnEndpointGroup_PortOverrideProperty, _aws_cdk_aws_globalaccelerator_CfnListenerProps, _aws_cdk_aws_globalaccelerator_CfnListener, _aws_cdk_aws_globalaccelerator_CfnListener_PortRangeProperty, _aws_cdk_aws_globalaccelerator_IAccelerator, _aws_cdk_aws_globalaccelerator_AcceleratorProps, _aws_cdk_aws_globalaccelerator_AcceleratorAttributes, _aws_cdk_aws_globalaccelerator_Accelerator, _aws_cdk_aws_globalaccelerator_IListener, _aws_cdk_aws_globalaccelerator_ListenerOptions, _aws_cdk_aws_globalaccelerator_ListenerProps, _aws_cdk_aws_globalaccelerator_PortRange, _aws_cdk_aws_globalaccelerator_ConnectionProtocol, _aws_cdk_aws_globalaccelerator_ClientAffinity, _aws_cdk_aws_globalaccelerator_Listener, _aws_cdk_aws_globalaccelerator_IEndpointGroup, _aws_cdk_aws_globalaccelerator_EndpointGroupOptions, _aws_cdk_aws_globalaccelerator_PortOverride, _aws_cdk_aws_globalaccelerator_HealthCheckProtocol, _aws_cdk_aws_globalaccelerator_EndpointGroupProps, _aws_cdk_aws_globalaccelerator_EndpointGroup, _aws_cdk_aws_globalaccelerator_IEndpoint, _aws_cdk_aws_globalaccelerator_RawEndpointProps, _aws_cdk_aws_globalaccelerator_RawEndpoint };
