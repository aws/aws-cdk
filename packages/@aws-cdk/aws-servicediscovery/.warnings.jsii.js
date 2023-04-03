function _aws_cdk_aws_servicediscovery_IInstance(p) {
}
function _aws_cdk_aws_servicediscovery_BaseInstanceProps(p) {
}
function _aws_cdk_aws_servicediscovery_InstanceBase(p) {
}
function _aws_cdk_aws_servicediscovery_AliasTargetInstanceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.service))
            _aws_cdk_aws_servicediscovery_IService(p.service);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_servicediscovery_AliasTargetInstance(p) {
}
function _aws_cdk_aws_servicediscovery_CnameInstanceBaseProps(p) {
}
function _aws_cdk_aws_servicediscovery_CnameInstanceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.service))
            _aws_cdk_aws_servicediscovery_IService(p.service);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_servicediscovery_CnameInstance(p) {
}
function _aws_cdk_aws_servicediscovery_IpInstanceBaseProps(p) {
}
function _aws_cdk_aws_servicediscovery_IpInstanceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.service))
            _aws_cdk_aws_servicediscovery_IService(p.service);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_servicediscovery_IpInstance(p) {
}
function _aws_cdk_aws_servicediscovery_NonIpInstanceBaseProps(p) {
}
function _aws_cdk_aws_servicediscovery_NonIpInstanceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.service))
            _aws_cdk_aws_servicediscovery_IService(p.service);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_servicediscovery_NonIpInstance(p) {
}
function _aws_cdk_aws_servicediscovery_INamespace(p) {
}
function _aws_cdk_aws_servicediscovery_BaseNamespaceProps(p) {
}
function _aws_cdk_aws_servicediscovery_NamespaceType(p) {
}
function _aws_cdk_aws_servicediscovery_HttpNamespaceProps(p) {
}
function _aws_cdk_aws_servicediscovery_IHttpNamespace(p) {
}
function _aws_cdk_aws_servicediscovery_HttpNamespaceAttributes(p) {
}
function _aws_cdk_aws_servicediscovery_HttpNamespace(p) {
}
function _aws_cdk_aws_servicediscovery_PrivateDnsNamespaceProps(p) {
}
function _aws_cdk_aws_servicediscovery_IPrivateDnsNamespace(p) {
}
function _aws_cdk_aws_servicediscovery_PrivateDnsNamespaceAttributes(p) {
}
function _aws_cdk_aws_servicediscovery_PrivateDnsNamespace(p) {
}
function _aws_cdk_aws_servicediscovery_PublicDnsNamespaceProps(p) {
}
function _aws_cdk_aws_servicediscovery_IPublicDnsNamespace(p) {
}
function _aws_cdk_aws_servicediscovery_PublicDnsNamespaceAttributes(p) {
}
function _aws_cdk_aws_servicediscovery_PublicDnsNamespace(p) {
}
function _aws_cdk_aws_servicediscovery_IService(p) {
}
function _aws_cdk_aws_servicediscovery_BaseServiceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.customHealthCheck))
            _aws_cdk_aws_servicediscovery_HealthCheckCustomConfig(p.customHealthCheck);
        if (!visitedObjects.has(p.healthCheck))
            _aws_cdk_aws_servicediscovery_HealthCheckConfig(p.healthCheck);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_servicediscovery_DnsServiceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.discoveryType))
            _aws_cdk_aws_servicediscovery_DiscoveryType(p.discoveryType);
        if (!visitedObjects.has(p.dnsRecordType))
            _aws_cdk_aws_servicediscovery_DnsRecordType(p.dnsRecordType);
        if (!visitedObjects.has(p.routingPolicy))
            _aws_cdk_aws_servicediscovery_RoutingPolicy(p.routingPolicy);
        if (!visitedObjects.has(p.customHealthCheck))
            _aws_cdk_aws_servicediscovery_HealthCheckCustomConfig(p.customHealthCheck);
        if (!visitedObjects.has(p.healthCheck))
            _aws_cdk_aws_servicediscovery_HealthCheckConfig(p.healthCheck);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_servicediscovery_ServiceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.namespace))
            _aws_cdk_aws_servicediscovery_INamespace(p.namespace);
        if (!visitedObjects.has(p.discoveryType))
            _aws_cdk_aws_servicediscovery_DiscoveryType(p.discoveryType);
        if (!visitedObjects.has(p.dnsRecordType))
            _aws_cdk_aws_servicediscovery_DnsRecordType(p.dnsRecordType);
        if (!visitedObjects.has(p.routingPolicy))
            _aws_cdk_aws_servicediscovery_RoutingPolicy(p.routingPolicy);
        if (!visitedObjects.has(p.customHealthCheck))
            _aws_cdk_aws_servicediscovery_HealthCheckCustomConfig(p.customHealthCheck);
        if (!visitedObjects.has(p.healthCheck))
            _aws_cdk_aws_servicediscovery_HealthCheckConfig(p.healthCheck);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_servicediscovery_ServiceAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.dnsRecordType))
            _aws_cdk_aws_servicediscovery_DnsRecordType(p.dnsRecordType);
        if (!visitedObjects.has(p.namespace))
            _aws_cdk_aws_servicediscovery_INamespace(p.namespace);
        if (!visitedObjects.has(p.routingPolicy))
            _aws_cdk_aws_servicediscovery_RoutingPolicy(p.routingPolicy);
        if (!visitedObjects.has(p.discoveryType))
            _aws_cdk_aws_servicediscovery_DiscoveryType(p.discoveryType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_servicediscovery_Service(p) {
}
function _aws_cdk_aws_servicediscovery_HealthCheckConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_servicediscovery_HealthCheckType(p.type);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_servicediscovery_HealthCheckCustomConfig(p) {
}
function _aws_cdk_aws_servicediscovery_DiscoveryType(p) {
}
function _aws_cdk_aws_servicediscovery_DnsRecordType(p) {
}
function _aws_cdk_aws_servicediscovery_RoutingPolicy(p) {
}
function _aws_cdk_aws_servicediscovery_HealthCheckType(p) {
}
function _aws_cdk_aws_servicediscovery_CfnHttpNamespaceProps(p) {
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
function _aws_cdk_aws_servicediscovery_CfnHttpNamespace(p) {
}
function _aws_cdk_aws_servicediscovery_CfnInstanceProps(p) {
}
function _aws_cdk_aws_servicediscovery_CfnInstance(p) {
}
function _aws_cdk_aws_servicediscovery_CfnPrivateDnsNamespaceProps(p) {
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
function _aws_cdk_aws_servicediscovery_CfnPrivateDnsNamespace(p) {
}
function _aws_cdk_aws_servicediscovery_CfnPrivateDnsNamespace_PrivateDnsPropertiesMutableProperty(p) {
}
function _aws_cdk_aws_servicediscovery_CfnPrivateDnsNamespace_PropertiesProperty(p) {
}
function _aws_cdk_aws_servicediscovery_CfnPrivateDnsNamespace_SOAProperty(p) {
}
function _aws_cdk_aws_servicediscovery_CfnPublicDnsNamespaceProps(p) {
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
function _aws_cdk_aws_servicediscovery_CfnPublicDnsNamespace(p) {
}
function _aws_cdk_aws_servicediscovery_CfnPublicDnsNamespace_PropertiesProperty(p) {
}
function _aws_cdk_aws_servicediscovery_CfnPublicDnsNamespace_PublicDnsPropertiesMutableProperty(p) {
}
function _aws_cdk_aws_servicediscovery_CfnPublicDnsNamespace_SOAProperty(p) {
}
function _aws_cdk_aws_servicediscovery_CfnServiceProps(p) {
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
function _aws_cdk_aws_servicediscovery_CfnService(p) {
}
function _aws_cdk_aws_servicediscovery_CfnService_DnsConfigProperty(p) {
}
function _aws_cdk_aws_servicediscovery_CfnService_DnsRecordProperty(p) {
}
function _aws_cdk_aws_servicediscovery_CfnService_HealthCheckConfigProperty(p) {
}
function _aws_cdk_aws_servicediscovery_CfnService_HealthCheckCustomConfigProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_servicediscovery_IInstance, _aws_cdk_aws_servicediscovery_BaseInstanceProps, _aws_cdk_aws_servicediscovery_InstanceBase, _aws_cdk_aws_servicediscovery_AliasTargetInstanceProps, _aws_cdk_aws_servicediscovery_AliasTargetInstance, _aws_cdk_aws_servicediscovery_CnameInstanceBaseProps, _aws_cdk_aws_servicediscovery_CnameInstanceProps, _aws_cdk_aws_servicediscovery_CnameInstance, _aws_cdk_aws_servicediscovery_IpInstanceBaseProps, _aws_cdk_aws_servicediscovery_IpInstanceProps, _aws_cdk_aws_servicediscovery_IpInstance, _aws_cdk_aws_servicediscovery_NonIpInstanceBaseProps, _aws_cdk_aws_servicediscovery_NonIpInstanceProps, _aws_cdk_aws_servicediscovery_NonIpInstance, _aws_cdk_aws_servicediscovery_INamespace, _aws_cdk_aws_servicediscovery_BaseNamespaceProps, _aws_cdk_aws_servicediscovery_NamespaceType, _aws_cdk_aws_servicediscovery_HttpNamespaceProps, _aws_cdk_aws_servicediscovery_IHttpNamespace, _aws_cdk_aws_servicediscovery_HttpNamespaceAttributes, _aws_cdk_aws_servicediscovery_HttpNamespace, _aws_cdk_aws_servicediscovery_PrivateDnsNamespaceProps, _aws_cdk_aws_servicediscovery_IPrivateDnsNamespace, _aws_cdk_aws_servicediscovery_PrivateDnsNamespaceAttributes, _aws_cdk_aws_servicediscovery_PrivateDnsNamespace, _aws_cdk_aws_servicediscovery_PublicDnsNamespaceProps, _aws_cdk_aws_servicediscovery_IPublicDnsNamespace, _aws_cdk_aws_servicediscovery_PublicDnsNamespaceAttributes, _aws_cdk_aws_servicediscovery_PublicDnsNamespace, _aws_cdk_aws_servicediscovery_IService, _aws_cdk_aws_servicediscovery_BaseServiceProps, _aws_cdk_aws_servicediscovery_DnsServiceProps, _aws_cdk_aws_servicediscovery_ServiceProps, _aws_cdk_aws_servicediscovery_ServiceAttributes, _aws_cdk_aws_servicediscovery_Service, _aws_cdk_aws_servicediscovery_HealthCheckConfig, _aws_cdk_aws_servicediscovery_HealthCheckCustomConfig, _aws_cdk_aws_servicediscovery_DiscoveryType, _aws_cdk_aws_servicediscovery_DnsRecordType, _aws_cdk_aws_servicediscovery_RoutingPolicy, _aws_cdk_aws_servicediscovery_HealthCheckType, _aws_cdk_aws_servicediscovery_CfnHttpNamespaceProps, _aws_cdk_aws_servicediscovery_CfnHttpNamespace, _aws_cdk_aws_servicediscovery_CfnInstanceProps, _aws_cdk_aws_servicediscovery_CfnInstance, _aws_cdk_aws_servicediscovery_CfnPrivateDnsNamespaceProps, _aws_cdk_aws_servicediscovery_CfnPrivateDnsNamespace, _aws_cdk_aws_servicediscovery_CfnPrivateDnsNamespace_PrivateDnsPropertiesMutableProperty, _aws_cdk_aws_servicediscovery_CfnPrivateDnsNamespace_PropertiesProperty, _aws_cdk_aws_servicediscovery_CfnPrivateDnsNamespace_SOAProperty, _aws_cdk_aws_servicediscovery_CfnPublicDnsNamespaceProps, _aws_cdk_aws_servicediscovery_CfnPublicDnsNamespace, _aws_cdk_aws_servicediscovery_CfnPublicDnsNamespace_PropertiesProperty, _aws_cdk_aws_servicediscovery_CfnPublicDnsNamespace_PublicDnsPropertiesMutableProperty, _aws_cdk_aws_servicediscovery_CfnPublicDnsNamespace_SOAProperty, _aws_cdk_aws_servicediscovery_CfnServiceProps, _aws_cdk_aws_servicediscovery_CfnService, _aws_cdk_aws_servicediscovery_CfnService_DnsConfigProperty, _aws_cdk_aws_servicediscovery_CfnService_DnsRecordProperty, _aws_cdk_aws_servicediscovery_CfnService_HealthCheckConfigProperty, _aws_cdk_aws_servicediscovery_CfnService_HealthCheckCustomConfigProperty };
