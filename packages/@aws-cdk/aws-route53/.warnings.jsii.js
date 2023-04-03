function _aws_cdk_aws_route53_IAliasRecordTarget(p) {
}
function _aws_cdk_aws_route53_AliasRecordTargetConfig(p) {
}
function _aws_cdk_aws_route53_CommonHostedZoneProps(p) {
}
function _aws_cdk_aws_route53_HostedZoneProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.vpcs != null)
            for (const o of p.vpcs)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_IVpc(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_route53_HostedZone(p) {
}
function _aws_cdk_aws_route53_PublicHostedZoneProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("crossAccountZoneDelegationPrincipal" in p)
            print("@aws-cdk/aws-route53.PublicHostedZoneProps#crossAccountZoneDelegationPrincipal", "Create the Role yourself and call `hostedZone.grantDelegation()`.");
        if ("crossAccountZoneDelegationRoleName" in p)
            print("@aws-cdk/aws-route53.PublicHostedZoneProps#crossAccountZoneDelegationRoleName", "Create the Role yourself and call `hostedZone.grantDelegation()`.");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_route53_IPublicHostedZone(p) {
}
function _aws_cdk_aws_route53_PublicHostedZone(p) {
}
function _aws_cdk_aws_route53_ZoneDelegationOptions(p) {
}
function _aws_cdk_aws_route53_PrivateHostedZoneProps(p) {
}
function _aws_cdk_aws_route53_IPrivateHostedZone(p) {
}
function _aws_cdk_aws_route53_PrivateHostedZone(p) {
}
function _aws_cdk_aws_route53_HostedZoneProviderProps(p) {
}
function _aws_cdk_aws_route53_IHostedZone(p) {
}
function _aws_cdk_aws_route53_HostedZoneAttributes(p) {
}
function _aws_cdk_aws_route53_PublicHostedZoneAttributes(p) {
}
function _aws_cdk_aws_route53_IRecordSet(p) {
}
function _aws_cdk_aws_route53_RecordType(p) {
}
function _aws_cdk_aws_route53_RecordSetOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.zone))
            _aws_cdk_aws_route53_IHostedZone(p.zone);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_route53_RecordTarget(p) {
}
function _aws_cdk_aws_route53_RecordSetProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.recordType))
            _aws_cdk_aws_route53_RecordType(p.recordType);
        if (!visitedObjects.has(p.target))
            _aws_cdk_aws_route53_RecordTarget(p.target);
        if (!visitedObjects.has(p.zone))
            _aws_cdk_aws_route53_IHostedZone(p.zone);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_route53_RecordSet(p) {
}
function _aws_cdk_aws_route53_AddressRecordTarget(p) {
}
function _aws_cdk_aws_route53_ARecordProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.target))
            _aws_cdk_aws_route53_RecordTarget(p.target);
        if (!visitedObjects.has(p.zone))
            _aws_cdk_aws_route53_IHostedZone(p.zone);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_route53_ARecord(p) {
}
function _aws_cdk_aws_route53_AaaaRecordProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.target))
            _aws_cdk_aws_route53_RecordTarget(p.target);
        if (!visitedObjects.has(p.zone))
            _aws_cdk_aws_route53_IHostedZone(p.zone);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_route53_AaaaRecord(p) {
}
function _aws_cdk_aws_route53_CnameRecordProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.zone))
            _aws_cdk_aws_route53_IHostedZone(p.zone);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_route53_CnameRecord(p) {
}
function _aws_cdk_aws_route53_TxtRecordProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.zone))
            _aws_cdk_aws_route53_IHostedZone(p.zone);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_route53_TxtRecord(p) {
}
function _aws_cdk_aws_route53_SrvRecordValue(p) {
}
function _aws_cdk_aws_route53_SrvRecordProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.values != null)
            for (const o of p.values)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_route53_SrvRecordValue(o);
        if (!visitedObjects.has(p.zone))
            _aws_cdk_aws_route53_IHostedZone(p.zone);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_route53_SrvRecord(p) {
}
function _aws_cdk_aws_route53_CaaTag(p) {
}
function _aws_cdk_aws_route53_CaaRecordValue(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.tag))
            _aws_cdk_aws_route53_CaaTag(p.tag);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_route53_CaaRecordProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.values != null)
            for (const o of p.values)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_route53_CaaRecordValue(o);
        if (!visitedObjects.has(p.zone))
            _aws_cdk_aws_route53_IHostedZone(p.zone);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_route53_CaaRecord(p) {
}
function _aws_cdk_aws_route53_CaaAmazonRecordProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.zone))
            _aws_cdk_aws_route53_IHostedZone(p.zone);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_route53_CaaAmazonRecord(p) {
}
function _aws_cdk_aws_route53_MxRecordValue(p) {
}
function _aws_cdk_aws_route53_MxRecordProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.values != null)
            for (const o of p.values)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_route53_MxRecordValue(o);
        if (!visitedObjects.has(p.zone))
            _aws_cdk_aws_route53_IHostedZone(p.zone);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_route53_MxRecord(p) {
}
function _aws_cdk_aws_route53_NsRecordProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.zone))
            _aws_cdk_aws_route53_IHostedZone(p.zone);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_route53_NsRecord(p) {
}
function _aws_cdk_aws_route53_DsRecordProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.zone))
            _aws_cdk_aws_route53_IHostedZone(p.zone);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_route53_DsRecord(p) {
}
function _aws_cdk_aws_route53_ZoneDelegationRecordProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.zone))
            _aws_cdk_aws_route53_IHostedZone(p.zone);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_route53_ZoneDelegationRecord(p) {
}
function _aws_cdk_aws_route53_CrossAccountZoneDelegationRecordProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.delegatedZone))
            _aws_cdk_aws_route53_IHostedZone(p.delegatedZone);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_route53_CrossAccountZoneDelegationRecord(p) {
}
function _aws_cdk_aws_route53_VpcEndpointServiceDomainNameProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.publicHostedZone))
            _aws_cdk_aws_route53_IPublicHostedZone(p.publicHostedZone);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_route53_VpcEndpointServiceDomainName(p) {
}
function _aws_cdk_aws_route53_CfnCidrCollectionProps(p) {
}
function _aws_cdk_aws_route53_CfnCidrCollection(p) {
}
function _aws_cdk_aws_route53_CfnCidrCollection_LocationProperty(p) {
}
function _aws_cdk_aws_route53_CfnDNSSECProps(p) {
}
function _aws_cdk_aws_route53_CfnDNSSEC(p) {
}
function _aws_cdk_aws_route53_CfnHealthCheckProps(p) {
}
function _aws_cdk_aws_route53_CfnHealthCheck(p) {
}
function _aws_cdk_aws_route53_CfnHealthCheck_AlarmIdentifierProperty(p) {
}
function _aws_cdk_aws_route53_CfnHealthCheck_HealthCheckConfigProperty(p) {
}
function _aws_cdk_aws_route53_CfnHealthCheck_HealthCheckTagProperty(p) {
}
function _aws_cdk_aws_route53_CfnHostedZoneProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.hostedZoneTags != null)
            for (const o of p.hostedZoneTags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_route53_CfnHostedZone_HostedZoneTagProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_route53_CfnHostedZone(p) {
}
function _aws_cdk_aws_route53_CfnHostedZone_HostedZoneConfigProperty(p) {
}
function _aws_cdk_aws_route53_CfnHostedZone_HostedZoneTagProperty(p) {
}
function _aws_cdk_aws_route53_CfnHostedZone_QueryLoggingConfigProperty(p) {
}
function _aws_cdk_aws_route53_CfnHostedZone_VPCProperty(p) {
}
function _aws_cdk_aws_route53_CfnKeySigningKeyProps(p) {
}
function _aws_cdk_aws_route53_CfnKeySigningKey(p) {
}
function _aws_cdk_aws_route53_CfnRecordSetProps(p) {
}
function _aws_cdk_aws_route53_CfnRecordSet(p) {
}
function _aws_cdk_aws_route53_CfnRecordSet_AliasTargetProperty(p) {
}
function _aws_cdk_aws_route53_CfnRecordSet_CidrRoutingConfigProperty(p) {
}
function _aws_cdk_aws_route53_CfnRecordSet_GeoLocationProperty(p) {
}
function _aws_cdk_aws_route53_CfnRecordSetGroupProps(p) {
}
function _aws_cdk_aws_route53_CfnRecordSetGroup(p) {
}
function _aws_cdk_aws_route53_CfnRecordSetGroup_AliasTargetProperty(p) {
}
function _aws_cdk_aws_route53_CfnRecordSetGroup_CidrRoutingConfigProperty(p) {
}
function _aws_cdk_aws_route53_CfnRecordSetGroup_GeoLocationProperty(p) {
}
function _aws_cdk_aws_route53_CfnRecordSetGroup_RecordSetProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_route53_IAliasRecordTarget, _aws_cdk_aws_route53_AliasRecordTargetConfig, _aws_cdk_aws_route53_CommonHostedZoneProps, _aws_cdk_aws_route53_HostedZoneProps, _aws_cdk_aws_route53_HostedZone, _aws_cdk_aws_route53_PublicHostedZoneProps, _aws_cdk_aws_route53_IPublicHostedZone, _aws_cdk_aws_route53_PublicHostedZone, _aws_cdk_aws_route53_ZoneDelegationOptions, _aws_cdk_aws_route53_PrivateHostedZoneProps, _aws_cdk_aws_route53_IPrivateHostedZone, _aws_cdk_aws_route53_PrivateHostedZone, _aws_cdk_aws_route53_HostedZoneProviderProps, _aws_cdk_aws_route53_IHostedZone, _aws_cdk_aws_route53_HostedZoneAttributes, _aws_cdk_aws_route53_PublicHostedZoneAttributes, _aws_cdk_aws_route53_IRecordSet, _aws_cdk_aws_route53_RecordType, _aws_cdk_aws_route53_RecordSetOptions, _aws_cdk_aws_route53_RecordTarget, _aws_cdk_aws_route53_RecordSetProps, _aws_cdk_aws_route53_RecordSet, _aws_cdk_aws_route53_AddressRecordTarget, _aws_cdk_aws_route53_ARecordProps, _aws_cdk_aws_route53_ARecord, _aws_cdk_aws_route53_AaaaRecordProps, _aws_cdk_aws_route53_AaaaRecord, _aws_cdk_aws_route53_CnameRecordProps, _aws_cdk_aws_route53_CnameRecord, _aws_cdk_aws_route53_TxtRecordProps, _aws_cdk_aws_route53_TxtRecord, _aws_cdk_aws_route53_SrvRecordValue, _aws_cdk_aws_route53_SrvRecordProps, _aws_cdk_aws_route53_SrvRecord, _aws_cdk_aws_route53_CaaTag, _aws_cdk_aws_route53_CaaRecordValue, _aws_cdk_aws_route53_CaaRecordProps, _aws_cdk_aws_route53_CaaRecord, _aws_cdk_aws_route53_CaaAmazonRecordProps, _aws_cdk_aws_route53_CaaAmazonRecord, _aws_cdk_aws_route53_MxRecordValue, _aws_cdk_aws_route53_MxRecordProps, _aws_cdk_aws_route53_MxRecord, _aws_cdk_aws_route53_NsRecordProps, _aws_cdk_aws_route53_NsRecord, _aws_cdk_aws_route53_DsRecordProps, _aws_cdk_aws_route53_DsRecord, _aws_cdk_aws_route53_ZoneDelegationRecordProps, _aws_cdk_aws_route53_ZoneDelegationRecord, _aws_cdk_aws_route53_CrossAccountZoneDelegationRecordProps, _aws_cdk_aws_route53_CrossAccountZoneDelegationRecord, _aws_cdk_aws_route53_VpcEndpointServiceDomainNameProps, _aws_cdk_aws_route53_VpcEndpointServiceDomainName, _aws_cdk_aws_route53_CfnCidrCollectionProps, _aws_cdk_aws_route53_CfnCidrCollection, _aws_cdk_aws_route53_CfnCidrCollection_LocationProperty, _aws_cdk_aws_route53_CfnDNSSECProps, _aws_cdk_aws_route53_CfnDNSSEC, _aws_cdk_aws_route53_CfnHealthCheckProps, _aws_cdk_aws_route53_CfnHealthCheck, _aws_cdk_aws_route53_CfnHealthCheck_AlarmIdentifierProperty, _aws_cdk_aws_route53_CfnHealthCheck_HealthCheckConfigProperty, _aws_cdk_aws_route53_CfnHealthCheck_HealthCheckTagProperty, _aws_cdk_aws_route53_CfnHostedZoneProps, _aws_cdk_aws_route53_CfnHostedZone, _aws_cdk_aws_route53_CfnHostedZone_HostedZoneConfigProperty, _aws_cdk_aws_route53_CfnHostedZone_HostedZoneTagProperty, _aws_cdk_aws_route53_CfnHostedZone_QueryLoggingConfigProperty, _aws_cdk_aws_route53_CfnHostedZone_VPCProperty, _aws_cdk_aws_route53_CfnKeySigningKeyProps, _aws_cdk_aws_route53_CfnKeySigningKey, _aws_cdk_aws_route53_CfnRecordSetProps, _aws_cdk_aws_route53_CfnRecordSet, _aws_cdk_aws_route53_CfnRecordSet_AliasTargetProperty, _aws_cdk_aws_route53_CfnRecordSet_CidrRoutingConfigProperty, _aws_cdk_aws_route53_CfnRecordSet_GeoLocationProperty, _aws_cdk_aws_route53_CfnRecordSetGroupProps, _aws_cdk_aws_route53_CfnRecordSetGroup, _aws_cdk_aws_route53_CfnRecordSetGroup_AliasTargetProperty, _aws_cdk_aws_route53_CfnRecordSetGroup_CidrRoutingConfigProperty, _aws_cdk_aws_route53_CfnRecordSetGroup_GeoLocationProperty, _aws_cdk_aws_route53_CfnRecordSetGroup_RecordSetProperty };
