function _aws_cdk_aws_ecr_CfnPublicRepositoryProps(p) {
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
function _aws_cdk_aws_ecr_CfnPublicRepository(p) {
}
function _aws_cdk_aws_ecr_CfnPublicRepository_RepositoryCatalogDataProperty(p) {
}
function _aws_cdk_aws_ecr_CfnPullThroughCacheRuleProps(p) {
}
function _aws_cdk_aws_ecr_CfnPullThroughCacheRule(p) {
}
function _aws_cdk_aws_ecr_CfnRegistryPolicyProps(p) {
}
function _aws_cdk_aws_ecr_CfnRegistryPolicy(p) {
}
function _aws_cdk_aws_ecr_CfnReplicationConfigurationProps(p) {
}
function _aws_cdk_aws_ecr_CfnReplicationConfiguration(p) {
}
function _aws_cdk_aws_ecr_CfnReplicationConfiguration_ReplicationConfigurationProperty(p) {
}
function _aws_cdk_aws_ecr_CfnReplicationConfiguration_ReplicationDestinationProperty(p) {
}
function _aws_cdk_aws_ecr_CfnReplicationConfiguration_ReplicationRuleProperty(p) {
}
function _aws_cdk_aws_ecr_CfnReplicationConfiguration_RepositoryFilterProperty(p) {
}
function _aws_cdk_aws_ecr_CfnRepositoryProps(p) {
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
function _aws_cdk_aws_ecr_CfnRepository(p) {
}
function _aws_cdk_aws_ecr_CfnRepository_EncryptionConfigurationProperty(p) {
}
function _aws_cdk_aws_ecr_CfnRepository_ImageScanningConfigurationProperty(p) {
}
function _aws_cdk_aws_ecr_CfnRepository_LifecyclePolicyProperty(p) {
}
function _aws_cdk_aws_ecr_IRepository(p) {
}
function _aws_cdk_aws_ecr_RepositoryBase(p) {
}
function _aws_cdk_aws_ecr_OnCloudTrailImagePushedOptions(p) {
}
function _aws_cdk_aws_ecr_OnImageScanCompletedOptions(p) {
}
function _aws_cdk_aws_ecr_RepositoryProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.encryption))
            _aws_cdk_aws_ecr_RepositoryEncryption(p.encryption);
        if (!visitedObjects.has(p.imageTagMutability))
            _aws_cdk_aws_ecr_TagMutability(p.imageTagMutability);
        if (p.lifecycleRules != null)
            for (const o of p.lifecycleRules)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecr_LifecycleRule(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecr_RepositoryAttributes(p) {
}
function _aws_cdk_aws_ecr_Repository(p) {
}
function _aws_cdk_aws_ecr_TagMutability(p) {
}
function _aws_cdk_aws_ecr_RepositoryEncryption(p) {
}
function _aws_cdk_aws_ecr_LifecycleRule(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.tagStatus))
            _aws_cdk_aws_ecr_TagStatus(p.tagStatus);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecr_TagStatus(p) {
}
function _aws_cdk_aws_ecr_AuthorizationToken(p) {
}
function _aws_cdk_aws_ecr_PublicGalleryAuthorizationToken(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_ecr_CfnPublicRepositoryProps, _aws_cdk_aws_ecr_CfnPublicRepository, _aws_cdk_aws_ecr_CfnPublicRepository_RepositoryCatalogDataProperty, _aws_cdk_aws_ecr_CfnPullThroughCacheRuleProps, _aws_cdk_aws_ecr_CfnPullThroughCacheRule, _aws_cdk_aws_ecr_CfnRegistryPolicyProps, _aws_cdk_aws_ecr_CfnRegistryPolicy, _aws_cdk_aws_ecr_CfnReplicationConfigurationProps, _aws_cdk_aws_ecr_CfnReplicationConfiguration, _aws_cdk_aws_ecr_CfnReplicationConfiguration_ReplicationConfigurationProperty, _aws_cdk_aws_ecr_CfnReplicationConfiguration_ReplicationDestinationProperty, _aws_cdk_aws_ecr_CfnReplicationConfiguration_ReplicationRuleProperty, _aws_cdk_aws_ecr_CfnReplicationConfiguration_RepositoryFilterProperty, _aws_cdk_aws_ecr_CfnRepositoryProps, _aws_cdk_aws_ecr_CfnRepository, _aws_cdk_aws_ecr_CfnRepository_EncryptionConfigurationProperty, _aws_cdk_aws_ecr_CfnRepository_ImageScanningConfigurationProperty, _aws_cdk_aws_ecr_CfnRepository_LifecyclePolicyProperty, _aws_cdk_aws_ecr_IRepository, _aws_cdk_aws_ecr_RepositoryBase, _aws_cdk_aws_ecr_OnCloudTrailImagePushedOptions, _aws_cdk_aws_ecr_OnImageScanCompletedOptions, _aws_cdk_aws_ecr_RepositoryProps, _aws_cdk_aws_ecr_RepositoryAttributes, _aws_cdk_aws_ecr_Repository, _aws_cdk_aws_ecr_TagMutability, _aws_cdk_aws_ecr_RepositoryEncryption, _aws_cdk_aws_ecr_LifecycleRule, _aws_cdk_aws_ecr_TagStatus, _aws_cdk_aws_ecr_AuthorizationToken, _aws_cdk_aws_ecr_PublicGalleryAuthorizationToken };
