function _aws_cdk_aws_iotanalytics_CfnChannelProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.channelStorage))
            _aws_cdk_aws_iotanalytics_CfnChannel_ChannelStorageProperty(p.channelStorage);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_iotanalytics_CfnChannel(p) {
}
function _aws_cdk_aws_iotanalytics_CfnChannel_ChannelStorageProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnChannel_CustomerManagedS3Property(p) {
}
function _aws_cdk_aws_iotanalytics_CfnChannel_RetentionPeriodProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDatasetProps(p) {
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
function _aws_cdk_aws_iotanalytics_CfnDataset(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDataset_ActionProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDataset_ContainerActionProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDataset_DatasetContentDeliveryRuleProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDataset_DatasetContentDeliveryRuleDestinationProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDataset_DatasetContentVersionValueProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDataset_DeltaTimeProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDataset_DeltaTimeSessionWindowConfigurationProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDataset_FilterProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDataset_GlueConfigurationProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDataset_IotEventsDestinationConfigurationProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDataset_LateDataRuleProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDataset_LateDataRuleConfigurationProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDataset_OutputFileUriValueProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDataset_QueryActionProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDataset_ResourceConfigurationProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDataset_RetentionPeriodProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDataset_S3DestinationConfigurationProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDataset_ScheduleProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDataset_TriggerProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDataset_TriggeringDatasetProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDataset_VariableProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDataset_VersioningConfigurationProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDatastoreProps(p) {
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
function _aws_cdk_aws_iotanalytics_CfnDatastore(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDatastore_ColumnProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDatastore_CustomerManagedS3Property(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDatastore_CustomerManagedS3StorageProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDatastore_DatastorePartitionProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDatastore_DatastorePartitionsProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDatastore_DatastoreStorageProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDatastore_FileFormatConfigurationProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDatastore_IotSiteWiseMultiLayerStorageProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDatastore_ParquetConfigurationProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDatastore_PartitionProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDatastore_RetentionPeriodProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDatastore_SchemaDefinitionProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnDatastore_TimestampPartitionProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnPipelineProps(p) {
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
function _aws_cdk_aws_iotanalytics_CfnPipeline(p) {
}
function _aws_cdk_aws_iotanalytics_CfnPipeline_ActivityProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnPipeline_AddAttributesProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnPipeline_ChannelProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnPipeline_DatastoreProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnPipeline_DeviceRegistryEnrichProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnPipeline_DeviceShadowEnrichProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnPipeline_FilterProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnPipeline_LambdaProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnPipeline_MathProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnPipeline_RemoveAttributesProperty(p) {
}
function _aws_cdk_aws_iotanalytics_CfnPipeline_SelectAttributesProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_iotanalytics_CfnChannelProps, _aws_cdk_aws_iotanalytics_CfnChannel, _aws_cdk_aws_iotanalytics_CfnChannel_ChannelStorageProperty, _aws_cdk_aws_iotanalytics_CfnChannel_CustomerManagedS3Property, _aws_cdk_aws_iotanalytics_CfnChannel_RetentionPeriodProperty, _aws_cdk_aws_iotanalytics_CfnDatasetProps, _aws_cdk_aws_iotanalytics_CfnDataset, _aws_cdk_aws_iotanalytics_CfnDataset_ActionProperty, _aws_cdk_aws_iotanalytics_CfnDataset_ContainerActionProperty, _aws_cdk_aws_iotanalytics_CfnDataset_DatasetContentDeliveryRuleProperty, _aws_cdk_aws_iotanalytics_CfnDataset_DatasetContentDeliveryRuleDestinationProperty, _aws_cdk_aws_iotanalytics_CfnDataset_DatasetContentVersionValueProperty, _aws_cdk_aws_iotanalytics_CfnDataset_DeltaTimeProperty, _aws_cdk_aws_iotanalytics_CfnDataset_DeltaTimeSessionWindowConfigurationProperty, _aws_cdk_aws_iotanalytics_CfnDataset_FilterProperty, _aws_cdk_aws_iotanalytics_CfnDataset_GlueConfigurationProperty, _aws_cdk_aws_iotanalytics_CfnDataset_IotEventsDestinationConfigurationProperty, _aws_cdk_aws_iotanalytics_CfnDataset_LateDataRuleProperty, _aws_cdk_aws_iotanalytics_CfnDataset_LateDataRuleConfigurationProperty, _aws_cdk_aws_iotanalytics_CfnDataset_OutputFileUriValueProperty, _aws_cdk_aws_iotanalytics_CfnDataset_QueryActionProperty, _aws_cdk_aws_iotanalytics_CfnDataset_ResourceConfigurationProperty, _aws_cdk_aws_iotanalytics_CfnDataset_RetentionPeriodProperty, _aws_cdk_aws_iotanalytics_CfnDataset_S3DestinationConfigurationProperty, _aws_cdk_aws_iotanalytics_CfnDataset_ScheduleProperty, _aws_cdk_aws_iotanalytics_CfnDataset_TriggerProperty, _aws_cdk_aws_iotanalytics_CfnDataset_TriggeringDatasetProperty, _aws_cdk_aws_iotanalytics_CfnDataset_VariableProperty, _aws_cdk_aws_iotanalytics_CfnDataset_VersioningConfigurationProperty, _aws_cdk_aws_iotanalytics_CfnDatastoreProps, _aws_cdk_aws_iotanalytics_CfnDatastore, _aws_cdk_aws_iotanalytics_CfnDatastore_ColumnProperty, _aws_cdk_aws_iotanalytics_CfnDatastore_CustomerManagedS3Property, _aws_cdk_aws_iotanalytics_CfnDatastore_CustomerManagedS3StorageProperty, _aws_cdk_aws_iotanalytics_CfnDatastore_DatastorePartitionProperty, _aws_cdk_aws_iotanalytics_CfnDatastore_DatastorePartitionsProperty, _aws_cdk_aws_iotanalytics_CfnDatastore_DatastoreStorageProperty, _aws_cdk_aws_iotanalytics_CfnDatastore_FileFormatConfigurationProperty, _aws_cdk_aws_iotanalytics_CfnDatastore_IotSiteWiseMultiLayerStorageProperty, _aws_cdk_aws_iotanalytics_CfnDatastore_ParquetConfigurationProperty, _aws_cdk_aws_iotanalytics_CfnDatastore_PartitionProperty, _aws_cdk_aws_iotanalytics_CfnDatastore_RetentionPeriodProperty, _aws_cdk_aws_iotanalytics_CfnDatastore_SchemaDefinitionProperty, _aws_cdk_aws_iotanalytics_CfnDatastore_TimestampPartitionProperty, _aws_cdk_aws_iotanalytics_CfnPipelineProps, _aws_cdk_aws_iotanalytics_CfnPipeline, _aws_cdk_aws_iotanalytics_CfnPipeline_ActivityProperty, _aws_cdk_aws_iotanalytics_CfnPipeline_AddAttributesProperty, _aws_cdk_aws_iotanalytics_CfnPipeline_ChannelProperty, _aws_cdk_aws_iotanalytics_CfnPipeline_DatastoreProperty, _aws_cdk_aws_iotanalytics_CfnPipeline_DeviceRegistryEnrichProperty, _aws_cdk_aws_iotanalytics_CfnPipeline_DeviceShadowEnrichProperty, _aws_cdk_aws_iotanalytics_CfnPipeline_FilterProperty, _aws_cdk_aws_iotanalytics_CfnPipeline_LambdaProperty, _aws_cdk_aws_iotanalytics_CfnPipeline_MathProperty, _aws_cdk_aws_iotanalytics_CfnPipeline_RemoveAttributesProperty, _aws_cdk_aws_iotanalytics_CfnPipeline_SelectAttributesProperty };
