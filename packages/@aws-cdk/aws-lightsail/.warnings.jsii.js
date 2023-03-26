function _aws_cdk_aws_lightsail_CfnAlarmProps(p) {
}
function _aws_cdk_aws_lightsail_CfnAlarm(p) {
}
function _aws_cdk_aws_lightsail_CfnBucketProps(p) {
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
function _aws_cdk_aws_lightsail_CfnBucket(p) {
}
function _aws_cdk_aws_lightsail_CfnBucket_AccessRulesProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnCertificateProps(p) {
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
function _aws_cdk_aws_lightsail_CfnCertificate(p) {
}
function _aws_cdk_aws_lightsail_CfnContainerProps(p) {
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
function _aws_cdk_aws_lightsail_CfnContainer(p) {
}
function _aws_cdk_aws_lightsail_CfnContainer_ContainerProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnContainer_ContainerServiceDeploymentProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnContainer_EnvironmentVariableProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnContainer_HealthCheckConfigProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnContainer_PortInfoProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnContainer_PublicDomainNameProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnContainer_PublicEndpointProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnDatabaseProps(p) {
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
function _aws_cdk_aws_lightsail_CfnDatabase(p) {
}
function _aws_cdk_aws_lightsail_CfnDatabase_RelationalDatabaseParameterProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnDiskProps(p) {
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
function _aws_cdk_aws_lightsail_CfnDisk(p) {
}
function _aws_cdk_aws_lightsail_CfnDisk_AddOnProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnDisk_AutoSnapshotAddOnProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnDisk_LocationProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnDistributionProps(p) {
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
function _aws_cdk_aws_lightsail_CfnDistribution(p) {
}
function _aws_cdk_aws_lightsail_CfnDistribution_CacheBehaviorProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnDistribution_CacheBehaviorPerPathProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnDistribution_CacheSettingsProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnDistribution_CookieObjectProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnDistribution_HeaderObjectProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnDistribution_InputOriginProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnDistribution_QueryStringObjectProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnInstanceProps(p) {
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
function _aws_cdk_aws_lightsail_CfnInstance(p) {
}
function _aws_cdk_aws_lightsail_CfnInstance_AddOnProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnInstance_AutoSnapshotAddOnProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnInstance_DiskProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnInstance_HardwareProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnInstance_LocationProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnInstance_MonthlyTransferProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnInstance_NetworkingProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnInstance_PortProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnInstance_StateProperty(p) {
}
function _aws_cdk_aws_lightsail_CfnLoadBalancerProps(p) {
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
function _aws_cdk_aws_lightsail_CfnLoadBalancer(p) {
}
function _aws_cdk_aws_lightsail_CfnLoadBalancerTlsCertificateProps(p) {
}
function _aws_cdk_aws_lightsail_CfnLoadBalancerTlsCertificate(p) {
}
function _aws_cdk_aws_lightsail_CfnStaticIpProps(p) {
}
function _aws_cdk_aws_lightsail_CfnStaticIp(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_lightsail_CfnAlarmProps, _aws_cdk_aws_lightsail_CfnAlarm, _aws_cdk_aws_lightsail_CfnBucketProps, _aws_cdk_aws_lightsail_CfnBucket, _aws_cdk_aws_lightsail_CfnBucket_AccessRulesProperty, _aws_cdk_aws_lightsail_CfnCertificateProps, _aws_cdk_aws_lightsail_CfnCertificate, _aws_cdk_aws_lightsail_CfnContainerProps, _aws_cdk_aws_lightsail_CfnContainer, _aws_cdk_aws_lightsail_CfnContainer_ContainerProperty, _aws_cdk_aws_lightsail_CfnContainer_ContainerServiceDeploymentProperty, _aws_cdk_aws_lightsail_CfnContainer_EnvironmentVariableProperty, _aws_cdk_aws_lightsail_CfnContainer_HealthCheckConfigProperty, _aws_cdk_aws_lightsail_CfnContainer_PortInfoProperty, _aws_cdk_aws_lightsail_CfnContainer_PublicDomainNameProperty, _aws_cdk_aws_lightsail_CfnContainer_PublicEndpointProperty, _aws_cdk_aws_lightsail_CfnDatabaseProps, _aws_cdk_aws_lightsail_CfnDatabase, _aws_cdk_aws_lightsail_CfnDatabase_RelationalDatabaseParameterProperty, _aws_cdk_aws_lightsail_CfnDiskProps, _aws_cdk_aws_lightsail_CfnDisk, _aws_cdk_aws_lightsail_CfnDisk_AddOnProperty, _aws_cdk_aws_lightsail_CfnDisk_AutoSnapshotAddOnProperty, _aws_cdk_aws_lightsail_CfnDisk_LocationProperty, _aws_cdk_aws_lightsail_CfnDistributionProps, _aws_cdk_aws_lightsail_CfnDistribution, _aws_cdk_aws_lightsail_CfnDistribution_CacheBehaviorProperty, _aws_cdk_aws_lightsail_CfnDistribution_CacheBehaviorPerPathProperty, _aws_cdk_aws_lightsail_CfnDistribution_CacheSettingsProperty, _aws_cdk_aws_lightsail_CfnDistribution_CookieObjectProperty, _aws_cdk_aws_lightsail_CfnDistribution_HeaderObjectProperty, _aws_cdk_aws_lightsail_CfnDistribution_InputOriginProperty, _aws_cdk_aws_lightsail_CfnDistribution_QueryStringObjectProperty, _aws_cdk_aws_lightsail_CfnInstanceProps, _aws_cdk_aws_lightsail_CfnInstance, _aws_cdk_aws_lightsail_CfnInstance_AddOnProperty, _aws_cdk_aws_lightsail_CfnInstance_AutoSnapshotAddOnProperty, _aws_cdk_aws_lightsail_CfnInstance_DiskProperty, _aws_cdk_aws_lightsail_CfnInstance_HardwareProperty, _aws_cdk_aws_lightsail_CfnInstance_LocationProperty, _aws_cdk_aws_lightsail_CfnInstance_MonthlyTransferProperty, _aws_cdk_aws_lightsail_CfnInstance_NetworkingProperty, _aws_cdk_aws_lightsail_CfnInstance_PortProperty, _aws_cdk_aws_lightsail_CfnInstance_StateProperty, _aws_cdk_aws_lightsail_CfnLoadBalancerProps, _aws_cdk_aws_lightsail_CfnLoadBalancer, _aws_cdk_aws_lightsail_CfnLoadBalancerTlsCertificateProps, _aws_cdk_aws_lightsail_CfnLoadBalancerTlsCertificate, _aws_cdk_aws_lightsail_CfnStaticIpProps, _aws_cdk_aws_lightsail_CfnStaticIp };
