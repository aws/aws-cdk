function _aws_cdk_aws_elasticache_CfnCacheClusterProps(p) {
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
function _aws_cdk_aws_elasticache_CfnCacheCluster(p) {
}
function _aws_cdk_aws_elasticache_CfnCacheCluster_CloudWatchLogsDestinationDetailsProperty(p) {
}
function _aws_cdk_aws_elasticache_CfnCacheCluster_DestinationDetailsProperty(p) {
}
function _aws_cdk_aws_elasticache_CfnCacheCluster_KinesisFirehoseDestinationDetailsProperty(p) {
}
function _aws_cdk_aws_elasticache_CfnCacheCluster_LogDeliveryConfigurationRequestProperty(p) {
}
function _aws_cdk_aws_elasticache_CfnGlobalReplicationGroupProps(p) {
}
function _aws_cdk_aws_elasticache_CfnGlobalReplicationGroup(p) {
}
function _aws_cdk_aws_elasticache_CfnGlobalReplicationGroup_GlobalReplicationGroupMemberProperty(p) {
}
function _aws_cdk_aws_elasticache_CfnGlobalReplicationGroup_RegionalConfigurationProperty(p) {
}
function _aws_cdk_aws_elasticache_CfnGlobalReplicationGroup_ReshardingConfigurationProperty(p) {
}
function _aws_cdk_aws_elasticache_CfnParameterGroupProps(p) {
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
function _aws_cdk_aws_elasticache_CfnParameterGroup(p) {
}
function _aws_cdk_aws_elasticache_CfnReplicationGroupProps(p) {
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
function _aws_cdk_aws_elasticache_CfnReplicationGroup(p) {
}
function _aws_cdk_aws_elasticache_CfnReplicationGroup_CloudWatchLogsDestinationDetailsProperty(p) {
}
function _aws_cdk_aws_elasticache_CfnReplicationGroup_DestinationDetailsProperty(p) {
}
function _aws_cdk_aws_elasticache_CfnReplicationGroup_KinesisFirehoseDestinationDetailsProperty(p) {
}
function _aws_cdk_aws_elasticache_CfnReplicationGroup_LogDeliveryConfigurationRequestProperty(p) {
}
function _aws_cdk_aws_elasticache_CfnReplicationGroup_NodeGroupConfigurationProperty(p) {
}
function _aws_cdk_aws_elasticache_CfnSecurityGroupProps(p) {
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
function _aws_cdk_aws_elasticache_CfnSecurityGroup(p) {
}
function _aws_cdk_aws_elasticache_CfnSecurityGroupIngressProps(p) {
}
function _aws_cdk_aws_elasticache_CfnSecurityGroupIngress(p) {
}
function _aws_cdk_aws_elasticache_CfnSubnetGroupProps(p) {
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
function _aws_cdk_aws_elasticache_CfnSubnetGroup(p) {
}
function _aws_cdk_aws_elasticache_CfnUserProps(p) {
}
function _aws_cdk_aws_elasticache_CfnUser(p) {
}
function _aws_cdk_aws_elasticache_CfnUser_AuthenticationModeProperty(p) {
}
function _aws_cdk_aws_elasticache_CfnUserGroupProps(p) {
}
function _aws_cdk_aws_elasticache_CfnUserGroup(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_elasticache_CfnCacheClusterProps, _aws_cdk_aws_elasticache_CfnCacheCluster, _aws_cdk_aws_elasticache_CfnCacheCluster_CloudWatchLogsDestinationDetailsProperty, _aws_cdk_aws_elasticache_CfnCacheCluster_DestinationDetailsProperty, _aws_cdk_aws_elasticache_CfnCacheCluster_KinesisFirehoseDestinationDetailsProperty, _aws_cdk_aws_elasticache_CfnCacheCluster_LogDeliveryConfigurationRequestProperty, _aws_cdk_aws_elasticache_CfnGlobalReplicationGroupProps, _aws_cdk_aws_elasticache_CfnGlobalReplicationGroup, _aws_cdk_aws_elasticache_CfnGlobalReplicationGroup_GlobalReplicationGroupMemberProperty, _aws_cdk_aws_elasticache_CfnGlobalReplicationGroup_RegionalConfigurationProperty, _aws_cdk_aws_elasticache_CfnGlobalReplicationGroup_ReshardingConfigurationProperty, _aws_cdk_aws_elasticache_CfnParameterGroupProps, _aws_cdk_aws_elasticache_CfnParameterGroup, _aws_cdk_aws_elasticache_CfnReplicationGroupProps, _aws_cdk_aws_elasticache_CfnReplicationGroup, _aws_cdk_aws_elasticache_CfnReplicationGroup_CloudWatchLogsDestinationDetailsProperty, _aws_cdk_aws_elasticache_CfnReplicationGroup_DestinationDetailsProperty, _aws_cdk_aws_elasticache_CfnReplicationGroup_KinesisFirehoseDestinationDetailsProperty, _aws_cdk_aws_elasticache_CfnReplicationGroup_LogDeliveryConfigurationRequestProperty, _aws_cdk_aws_elasticache_CfnReplicationGroup_NodeGroupConfigurationProperty, _aws_cdk_aws_elasticache_CfnSecurityGroupProps, _aws_cdk_aws_elasticache_CfnSecurityGroup, _aws_cdk_aws_elasticache_CfnSecurityGroupIngressProps, _aws_cdk_aws_elasticache_CfnSecurityGroupIngress, _aws_cdk_aws_elasticache_CfnSubnetGroupProps, _aws_cdk_aws_elasticache_CfnSubnetGroup, _aws_cdk_aws_elasticache_CfnUserProps, _aws_cdk_aws_elasticache_CfnUser, _aws_cdk_aws_elasticache_CfnUser_AuthenticationModeProperty, _aws_cdk_aws_elasticache_CfnUserGroupProps, _aws_cdk_aws_elasticache_CfnUserGroup };
