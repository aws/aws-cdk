function _aws_cdk_aws_elasticloadbalancing_CfnLoadBalancerProps(p) {
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
function _aws_cdk_aws_elasticloadbalancing_CfnLoadBalancer(p) {
}
function _aws_cdk_aws_elasticloadbalancing_CfnLoadBalancer_AccessLoggingPolicyProperty(p) {
}
function _aws_cdk_aws_elasticloadbalancing_CfnLoadBalancer_AppCookieStickinessPolicyProperty(p) {
}
function _aws_cdk_aws_elasticloadbalancing_CfnLoadBalancer_ConnectionDrainingPolicyProperty(p) {
}
function _aws_cdk_aws_elasticloadbalancing_CfnLoadBalancer_ConnectionSettingsProperty(p) {
}
function _aws_cdk_aws_elasticloadbalancing_CfnLoadBalancer_HealthCheckProperty(p) {
}
function _aws_cdk_aws_elasticloadbalancing_CfnLoadBalancer_LBCookieStickinessPolicyProperty(p) {
}
function _aws_cdk_aws_elasticloadbalancing_CfnLoadBalancer_ListenersProperty(p) {
}
function _aws_cdk_aws_elasticloadbalancing_CfnLoadBalancer_PoliciesProperty(p) {
}
function _aws_cdk_aws_elasticloadbalancing_LoadBalancerProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.accessLoggingPolicy))
            _aws_cdk_aws_elasticloadbalancing_CfnLoadBalancer_AccessLoggingPolicyProperty(p.accessLoggingPolicy);
        if (!visitedObjects.has(p.healthCheck))
            _aws_cdk_aws_elasticloadbalancing_HealthCheck(p.healthCheck);
        if (p.listeners != null)
            for (const o of p.listeners)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_elasticloadbalancing_LoadBalancerListener(o);
        if (p.targets != null)
            for (const o of p.targets)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_elasticloadbalancing_ILoadBalancerTarget(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_elasticloadbalancing_HealthCheck(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.protocol))
            _aws_cdk_aws_elasticloadbalancing_LoadBalancingProtocol(p.protocol);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_elasticloadbalancing_ILoadBalancerTarget(p) {
}
function _aws_cdk_aws_elasticloadbalancing_LoadBalancerListener(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.allowConnectionsFrom != null)
            for (const o of p.allowConnectionsFrom)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_IConnectable(o);
        if (!visitedObjects.has(p.externalProtocol))
            _aws_cdk_aws_elasticloadbalancing_LoadBalancingProtocol(p.externalProtocol);
        if (!visitedObjects.has(p.internalProtocol))
            _aws_cdk_aws_elasticloadbalancing_LoadBalancingProtocol(p.internalProtocol);
        if ("sslCertificateId" in p)
            print("@aws-cdk/aws-elasticloadbalancing.LoadBalancerListener#sslCertificateId", "- use sslCertificateArn instead");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_elasticloadbalancing_LoadBalancingProtocol(p) {
}
function _aws_cdk_aws_elasticloadbalancing_LoadBalancer(p) {
}
function _aws_cdk_aws_elasticloadbalancing_ListenerPort(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_elasticloadbalancing_CfnLoadBalancerProps, _aws_cdk_aws_elasticloadbalancing_CfnLoadBalancer, _aws_cdk_aws_elasticloadbalancing_CfnLoadBalancer_AccessLoggingPolicyProperty, _aws_cdk_aws_elasticloadbalancing_CfnLoadBalancer_AppCookieStickinessPolicyProperty, _aws_cdk_aws_elasticloadbalancing_CfnLoadBalancer_ConnectionDrainingPolicyProperty, _aws_cdk_aws_elasticloadbalancing_CfnLoadBalancer_ConnectionSettingsProperty, _aws_cdk_aws_elasticloadbalancing_CfnLoadBalancer_HealthCheckProperty, _aws_cdk_aws_elasticloadbalancing_CfnLoadBalancer_LBCookieStickinessPolicyProperty, _aws_cdk_aws_elasticloadbalancing_CfnLoadBalancer_ListenersProperty, _aws_cdk_aws_elasticloadbalancing_CfnLoadBalancer_PoliciesProperty, _aws_cdk_aws_elasticloadbalancing_LoadBalancerProps, _aws_cdk_aws_elasticloadbalancing_HealthCheck, _aws_cdk_aws_elasticloadbalancing_ILoadBalancerTarget, _aws_cdk_aws_elasticloadbalancing_LoadBalancerListener, _aws_cdk_aws_elasticloadbalancing_LoadBalancingProtocol, _aws_cdk_aws_elasticloadbalancing_LoadBalancer, _aws_cdk_aws_elasticloadbalancing_ListenerPort };
