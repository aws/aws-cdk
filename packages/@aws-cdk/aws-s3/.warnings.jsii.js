function _aws_cdk_aws_s3_IBucket(p) {
}
function _aws_cdk_aws_s3_BucketAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("bucketWebsiteNewUrlFormat" in p)
            print("@aws-cdk/aws-s3.BucketAttributes#bucketWebsiteNewUrlFormat", "The correct website url format can be inferred automatically from the bucket `region`.\nAlways provide the bucket region if the `bucketWebsiteUrl` will be used.\nAlternatively provide the full `bucketWebsiteUrl` manually.");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_s3_BucketBase(p) {
}
function _aws_cdk_aws_s3_BlockPublicAccessOptions(p) {
}
function _aws_cdk_aws_s3_BlockPublicAccess(p) {
}
function _aws_cdk_aws_s3_BucketMetrics(p) {
}
function _aws_cdk_aws_s3_HttpMethods(p) {
}
function _aws_cdk_aws_s3_CorsRule(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.allowedMethods != null)
            for (const o of p.allowedMethods)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_s3_HttpMethods(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_s3_RedirectProtocol(p) {
}
function _aws_cdk_aws_s3_RedirectTarget(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.protocol))
            _aws_cdk_aws_s3_RedirectProtocol(p.protocol);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_s3_InventoryFormat(p) {
}
function _aws_cdk_aws_s3_InventoryFrequency(p) {
}
function _aws_cdk_aws_s3_InventoryObjectVersion(p) {
}
function _aws_cdk_aws_s3_InventoryDestination(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.bucket))
            _aws_cdk_aws_s3_IBucket(p.bucket);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_s3_Inventory(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.destination))
            _aws_cdk_aws_s3_InventoryDestination(p.destination);
        if (!visitedObjects.has(p.format))
            _aws_cdk_aws_s3_InventoryFormat(p.format);
        if (!visitedObjects.has(p.frequency))
            _aws_cdk_aws_s3_InventoryFrequency(p.frequency);
        if (!visitedObjects.has(p.includeObjectVersions))
            _aws_cdk_aws_s3_InventoryObjectVersion(p.includeObjectVersions);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_s3_ObjectOwnership(p) {
}
function _aws_cdk_aws_s3_IntelligentTieringConfiguration(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_s3_Tag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_s3_BucketProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.accessControl))
            _aws_cdk_aws_s3_BucketAccessControl(p.accessControl);
        if (!visitedObjects.has(p.blockPublicAccess))
            _aws_cdk_aws_s3_BlockPublicAccess(p.blockPublicAccess);
        if (p.cors != null)
            for (const o of p.cors)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_s3_CorsRule(o);
        if (!visitedObjects.has(p.encryption))
            _aws_cdk_aws_s3_BucketEncryption(p.encryption);
        if (p.intelligentTieringConfigurations != null)
            for (const o of p.intelligentTieringConfigurations)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_s3_IntelligentTieringConfiguration(o);
        if (p.inventories != null)
            for (const o of p.inventories)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_s3_Inventory(o);
        if (p.lifecycleRules != null)
            for (const o of p.lifecycleRules)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_s3_LifecycleRule(o);
        if (p.metrics != null)
            for (const o of p.metrics)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_s3_BucketMetrics(o);
        if (!visitedObjects.has(p.objectLockDefaultRetention))
            _aws_cdk_aws_s3_ObjectLockRetention(p.objectLockDefaultRetention);
        if (!visitedObjects.has(p.objectOwnership))
            _aws_cdk_aws_s3_ObjectOwnership(p.objectOwnership);
        if (!visitedObjects.has(p.serverAccessLogsBucket))
            _aws_cdk_aws_s3_IBucket(p.serverAccessLogsBucket);
        if (!visitedObjects.has(p.websiteRedirect))
            _aws_cdk_aws_s3_RedirectTarget(p.websiteRedirect);
        if (p.websiteRoutingRules != null)
            for (const o of p.websiteRoutingRules)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_s3_RoutingRule(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_s3_Tag(p) {
}
function _aws_cdk_aws_s3_Bucket(p) {
}
function _aws_cdk_aws_s3_BucketEncryption(p) {
}
function _aws_cdk_aws_s3_EventType(p) {
}
function _aws_cdk_aws_s3_NotificationKeyFilter(p) {
}
function _aws_cdk_aws_s3_OnCloudTrailBucketEventOptions(p) {
}
function _aws_cdk_aws_s3_BucketAccessControl(p) {
}
function _aws_cdk_aws_s3_RoutingRuleCondition(p) {
}
function _aws_cdk_aws_s3_ReplaceKey(p) {
}
function _aws_cdk_aws_s3_RoutingRule(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.condition))
            _aws_cdk_aws_s3_RoutingRuleCondition(p.condition);
        if (!visitedObjects.has(p.protocol))
            _aws_cdk_aws_s3_RedirectProtocol(p.protocol);
        if (!visitedObjects.has(p.replaceKey))
            _aws_cdk_aws_s3_ReplaceKey(p.replaceKey);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_s3_ObjectLockMode(p) {
}
function _aws_cdk_aws_s3_ObjectLockRetention(p) {
}
function _aws_cdk_aws_s3_VirtualHostedStyleUrlOptions(p) {
}
function _aws_cdk_aws_s3_TransferAccelerationUrlOptions(p) {
}
function _aws_cdk_aws_s3_BucketPolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.bucket))
            _aws_cdk_aws_s3_IBucket(p.bucket);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_s3_BucketPolicy(p) {
}
function _aws_cdk_aws_s3_IBucketNotificationDestination(p) {
}
function _aws_cdk_aws_s3_BucketNotificationDestinationConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_s3_BucketNotificationDestinationType(p.type);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_s3_BucketNotificationDestinationType(p) {
}
function _aws_cdk_aws_s3_Location(p) {
}
function _aws_cdk_aws_s3_LifecycleRule(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.noncurrentVersionTransitions != null)
            for (const o of p.noncurrentVersionTransitions)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_s3_NoncurrentVersionTransition(o);
        if (p.transitions != null)
            for (const o of p.transitions)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_s3_Transition(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_s3_Transition(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.storageClass))
            _aws_cdk_aws_s3_StorageClass(p.storageClass);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_s3_NoncurrentVersionTransition(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.storageClass))
            _aws_cdk_aws_s3_StorageClass(p.storageClass);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_s3_StorageClass(p) {
}
function _aws_cdk_aws_s3_CfnAccessPointProps(p) {
}
function _aws_cdk_aws_s3_CfnAccessPoint(p) {
}
function _aws_cdk_aws_s3_CfnAccessPoint_PolicyStatusProperty(p) {
}
function _aws_cdk_aws_s3_CfnAccessPoint_PublicAccessBlockConfigurationProperty(p) {
}
function _aws_cdk_aws_s3_CfnAccessPoint_VpcConfigurationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucketProps(p) {
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
function _aws_cdk_aws_s3_CfnBucket(p) {
}
function _aws_cdk_aws_s3_CfnBucket_AbortIncompleteMultipartUploadProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_AccelerateConfigurationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_AccessControlTranslationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_AnalyticsConfigurationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_BucketEncryptionProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_CorsConfigurationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_CorsRuleProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_DataExportProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_DefaultRetentionProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_DeleteMarkerReplicationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_DestinationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_EncryptionConfigurationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_EventBridgeConfigurationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_FilterRuleProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_IntelligentTieringConfigurationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_InventoryConfigurationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_LambdaConfigurationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_LifecycleConfigurationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_LoggingConfigurationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_MetricsProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_MetricsConfigurationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_NoncurrentVersionExpirationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_NoncurrentVersionTransitionProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_NotificationConfigurationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_NotificationFilterProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_ObjectLockConfigurationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_ObjectLockRuleProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_OwnershipControlsProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_OwnershipControlsRuleProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_PublicAccessBlockConfigurationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_QueueConfigurationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_RedirectAllRequestsToProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_RedirectRuleProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_ReplicaModificationsProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_ReplicationConfigurationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_ReplicationDestinationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_ReplicationRuleProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_ReplicationRuleAndOperatorProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_ReplicationRuleFilterProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_ReplicationTimeProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_ReplicationTimeValueProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_RoutingRuleProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_RoutingRuleConditionProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_RuleProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_S3KeyFilterProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_ServerSideEncryptionByDefaultProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_ServerSideEncryptionRuleProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_SourceSelectionCriteriaProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_SseKmsEncryptedObjectsProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_StorageClassAnalysisProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_TagFilterProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_TieringProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_TopicConfigurationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_TransitionProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_VersioningConfigurationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucket_WebsiteConfigurationProperty(p) {
}
function _aws_cdk_aws_s3_CfnBucketPolicyProps(p) {
}
function _aws_cdk_aws_s3_CfnBucketPolicy(p) {
}
function _aws_cdk_aws_s3_CfnMultiRegionAccessPointProps(p) {
}
function _aws_cdk_aws_s3_CfnMultiRegionAccessPoint(p) {
}
function _aws_cdk_aws_s3_CfnMultiRegionAccessPoint_PublicAccessBlockConfigurationProperty(p) {
}
function _aws_cdk_aws_s3_CfnMultiRegionAccessPoint_RegionProperty(p) {
}
function _aws_cdk_aws_s3_CfnMultiRegionAccessPointPolicyProps(p) {
}
function _aws_cdk_aws_s3_CfnMultiRegionAccessPointPolicy(p) {
}
function _aws_cdk_aws_s3_CfnMultiRegionAccessPointPolicy_PolicyStatusProperty(p) {
}
function _aws_cdk_aws_s3_CfnStorageLensProps(p) {
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
function _aws_cdk_aws_s3_CfnStorageLens(p) {
}
function _aws_cdk_aws_s3_CfnStorageLens_AccountLevelProperty(p) {
}
function _aws_cdk_aws_s3_CfnStorageLens_ActivityMetricsProperty(p) {
}
function _aws_cdk_aws_s3_CfnStorageLens_AdvancedCostOptimizationMetricsProperty(p) {
}
function _aws_cdk_aws_s3_CfnStorageLens_AdvancedDataProtectionMetricsProperty(p) {
}
function _aws_cdk_aws_s3_CfnStorageLens_AwsOrgProperty(p) {
}
function _aws_cdk_aws_s3_CfnStorageLens_BucketLevelProperty(p) {
}
function _aws_cdk_aws_s3_CfnStorageLens_BucketsAndRegionsProperty(p) {
}
function _aws_cdk_aws_s3_CfnStorageLens_CloudWatchMetricsProperty(p) {
}
function _aws_cdk_aws_s3_CfnStorageLens_DataExportProperty(p) {
}
function _aws_cdk_aws_s3_CfnStorageLens_DetailedStatusCodesMetricsProperty(p) {
}
function _aws_cdk_aws_s3_CfnStorageLens_EncryptionProperty(p) {
}
function _aws_cdk_aws_s3_CfnStorageLens_PrefixLevelProperty(p) {
}
function _aws_cdk_aws_s3_CfnStorageLens_PrefixLevelStorageMetricsProperty(p) {
}
function _aws_cdk_aws_s3_CfnStorageLens_S3BucketDestinationProperty(p) {
}
function _aws_cdk_aws_s3_CfnStorageLens_SSEKMSProperty(p) {
}
function _aws_cdk_aws_s3_CfnStorageLens_SelectionCriteriaProperty(p) {
}
function _aws_cdk_aws_s3_CfnStorageLens_StorageLensConfigurationProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_s3_IBucket, _aws_cdk_aws_s3_BucketAttributes, _aws_cdk_aws_s3_BucketBase, _aws_cdk_aws_s3_BlockPublicAccessOptions, _aws_cdk_aws_s3_BlockPublicAccess, _aws_cdk_aws_s3_BucketMetrics, _aws_cdk_aws_s3_HttpMethods, _aws_cdk_aws_s3_CorsRule, _aws_cdk_aws_s3_RedirectProtocol, _aws_cdk_aws_s3_RedirectTarget, _aws_cdk_aws_s3_InventoryFormat, _aws_cdk_aws_s3_InventoryFrequency, _aws_cdk_aws_s3_InventoryObjectVersion, _aws_cdk_aws_s3_InventoryDestination, _aws_cdk_aws_s3_Inventory, _aws_cdk_aws_s3_ObjectOwnership, _aws_cdk_aws_s3_IntelligentTieringConfiguration, _aws_cdk_aws_s3_BucketProps, _aws_cdk_aws_s3_Tag, _aws_cdk_aws_s3_Bucket, _aws_cdk_aws_s3_BucketEncryption, _aws_cdk_aws_s3_EventType, _aws_cdk_aws_s3_NotificationKeyFilter, _aws_cdk_aws_s3_OnCloudTrailBucketEventOptions, _aws_cdk_aws_s3_BucketAccessControl, _aws_cdk_aws_s3_RoutingRuleCondition, _aws_cdk_aws_s3_ReplaceKey, _aws_cdk_aws_s3_RoutingRule, _aws_cdk_aws_s3_ObjectLockMode, _aws_cdk_aws_s3_ObjectLockRetention, _aws_cdk_aws_s3_VirtualHostedStyleUrlOptions, _aws_cdk_aws_s3_TransferAccelerationUrlOptions, _aws_cdk_aws_s3_BucketPolicyProps, _aws_cdk_aws_s3_BucketPolicy, _aws_cdk_aws_s3_IBucketNotificationDestination, _aws_cdk_aws_s3_BucketNotificationDestinationConfig, _aws_cdk_aws_s3_BucketNotificationDestinationType, _aws_cdk_aws_s3_Location, _aws_cdk_aws_s3_LifecycleRule, _aws_cdk_aws_s3_Transition, _aws_cdk_aws_s3_NoncurrentVersionTransition, _aws_cdk_aws_s3_StorageClass, _aws_cdk_aws_s3_CfnAccessPointProps, _aws_cdk_aws_s3_CfnAccessPoint, _aws_cdk_aws_s3_CfnAccessPoint_PolicyStatusProperty, _aws_cdk_aws_s3_CfnAccessPoint_PublicAccessBlockConfigurationProperty, _aws_cdk_aws_s3_CfnAccessPoint_VpcConfigurationProperty, _aws_cdk_aws_s3_CfnBucketProps, _aws_cdk_aws_s3_CfnBucket, _aws_cdk_aws_s3_CfnBucket_AbortIncompleteMultipartUploadProperty, _aws_cdk_aws_s3_CfnBucket_AccelerateConfigurationProperty, _aws_cdk_aws_s3_CfnBucket_AccessControlTranslationProperty, _aws_cdk_aws_s3_CfnBucket_AnalyticsConfigurationProperty, _aws_cdk_aws_s3_CfnBucket_BucketEncryptionProperty, _aws_cdk_aws_s3_CfnBucket_CorsConfigurationProperty, _aws_cdk_aws_s3_CfnBucket_CorsRuleProperty, _aws_cdk_aws_s3_CfnBucket_DataExportProperty, _aws_cdk_aws_s3_CfnBucket_DefaultRetentionProperty, _aws_cdk_aws_s3_CfnBucket_DeleteMarkerReplicationProperty, _aws_cdk_aws_s3_CfnBucket_DestinationProperty, _aws_cdk_aws_s3_CfnBucket_EncryptionConfigurationProperty, _aws_cdk_aws_s3_CfnBucket_EventBridgeConfigurationProperty, _aws_cdk_aws_s3_CfnBucket_FilterRuleProperty, _aws_cdk_aws_s3_CfnBucket_IntelligentTieringConfigurationProperty, _aws_cdk_aws_s3_CfnBucket_InventoryConfigurationProperty, _aws_cdk_aws_s3_CfnBucket_LambdaConfigurationProperty, _aws_cdk_aws_s3_CfnBucket_LifecycleConfigurationProperty, _aws_cdk_aws_s3_CfnBucket_LoggingConfigurationProperty, _aws_cdk_aws_s3_CfnBucket_MetricsProperty, _aws_cdk_aws_s3_CfnBucket_MetricsConfigurationProperty, _aws_cdk_aws_s3_CfnBucket_NoncurrentVersionExpirationProperty, _aws_cdk_aws_s3_CfnBucket_NoncurrentVersionTransitionProperty, _aws_cdk_aws_s3_CfnBucket_NotificationConfigurationProperty, _aws_cdk_aws_s3_CfnBucket_NotificationFilterProperty, _aws_cdk_aws_s3_CfnBucket_ObjectLockConfigurationProperty, _aws_cdk_aws_s3_CfnBucket_ObjectLockRuleProperty, _aws_cdk_aws_s3_CfnBucket_OwnershipControlsProperty, _aws_cdk_aws_s3_CfnBucket_OwnershipControlsRuleProperty, _aws_cdk_aws_s3_CfnBucket_PublicAccessBlockConfigurationProperty, _aws_cdk_aws_s3_CfnBucket_QueueConfigurationProperty, _aws_cdk_aws_s3_CfnBucket_RedirectAllRequestsToProperty, _aws_cdk_aws_s3_CfnBucket_RedirectRuleProperty, _aws_cdk_aws_s3_CfnBucket_ReplicaModificationsProperty, _aws_cdk_aws_s3_CfnBucket_ReplicationConfigurationProperty, _aws_cdk_aws_s3_CfnBucket_ReplicationDestinationProperty, _aws_cdk_aws_s3_CfnBucket_ReplicationRuleProperty, _aws_cdk_aws_s3_CfnBucket_ReplicationRuleAndOperatorProperty, _aws_cdk_aws_s3_CfnBucket_ReplicationRuleFilterProperty, _aws_cdk_aws_s3_CfnBucket_ReplicationTimeProperty, _aws_cdk_aws_s3_CfnBucket_ReplicationTimeValueProperty, _aws_cdk_aws_s3_CfnBucket_RoutingRuleProperty, _aws_cdk_aws_s3_CfnBucket_RoutingRuleConditionProperty, _aws_cdk_aws_s3_CfnBucket_RuleProperty, _aws_cdk_aws_s3_CfnBucket_S3KeyFilterProperty, _aws_cdk_aws_s3_CfnBucket_ServerSideEncryptionByDefaultProperty, _aws_cdk_aws_s3_CfnBucket_ServerSideEncryptionRuleProperty, _aws_cdk_aws_s3_CfnBucket_SourceSelectionCriteriaProperty, _aws_cdk_aws_s3_CfnBucket_SseKmsEncryptedObjectsProperty, _aws_cdk_aws_s3_CfnBucket_StorageClassAnalysisProperty, _aws_cdk_aws_s3_CfnBucket_TagFilterProperty, _aws_cdk_aws_s3_CfnBucket_TieringProperty, _aws_cdk_aws_s3_CfnBucket_TopicConfigurationProperty, _aws_cdk_aws_s3_CfnBucket_TransitionProperty, _aws_cdk_aws_s3_CfnBucket_VersioningConfigurationProperty, _aws_cdk_aws_s3_CfnBucket_WebsiteConfigurationProperty, _aws_cdk_aws_s3_CfnBucketPolicyProps, _aws_cdk_aws_s3_CfnBucketPolicy, _aws_cdk_aws_s3_CfnMultiRegionAccessPointProps, _aws_cdk_aws_s3_CfnMultiRegionAccessPoint, _aws_cdk_aws_s3_CfnMultiRegionAccessPoint_PublicAccessBlockConfigurationProperty, _aws_cdk_aws_s3_CfnMultiRegionAccessPoint_RegionProperty, _aws_cdk_aws_s3_CfnMultiRegionAccessPointPolicyProps, _aws_cdk_aws_s3_CfnMultiRegionAccessPointPolicy, _aws_cdk_aws_s3_CfnMultiRegionAccessPointPolicy_PolicyStatusProperty, _aws_cdk_aws_s3_CfnStorageLensProps, _aws_cdk_aws_s3_CfnStorageLens, _aws_cdk_aws_s3_CfnStorageLens_AccountLevelProperty, _aws_cdk_aws_s3_CfnStorageLens_ActivityMetricsProperty, _aws_cdk_aws_s3_CfnStorageLens_AdvancedCostOptimizationMetricsProperty, _aws_cdk_aws_s3_CfnStorageLens_AdvancedDataProtectionMetricsProperty, _aws_cdk_aws_s3_CfnStorageLens_AwsOrgProperty, _aws_cdk_aws_s3_CfnStorageLens_BucketLevelProperty, _aws_cdk_aws_s3_CfnStorageLens_BucketsAndRegionsProperty, _aws_cdk_aws_s3_CfnStorageLens_CloudWatchMetricsProperty, _aws_cdk_aws_s3_CfnStorageLens_DataExportProperty, _aws_cdk_aws_s3_CfnStorageLens_DetailedStatusCodesMetricsProperty, _aws_cdk_aws_s3_CfnStorageLens_EncryptionProperty, _aws_cdk_aws_s3_CfnStorageLens_PrefixLevelProperty, _aws_cdk_aws_s3_CfnStorageLens_PrefixLevelStorageMetricsProperty, _aws_cdk_aws_s3_CfnStorageLens_S3BucketDestinationProperty, _aws_cdk_aws_s3_CfnStorageLens_SSEKMSProperty, _aws_cdk_aws_s3_CfnStorageLens_SelectionCriteriaProperty, _aws_cdk_aws_s3_CfnStorageLens_StorageLensConfigurationProperty };
