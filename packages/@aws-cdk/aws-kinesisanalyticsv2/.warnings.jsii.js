function _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.applicationConfiguration))
            _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_ApplicationConfigurationProperty(p.applicationConfiguration);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_ApplicationCodeConfigurationProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_ApplicationConfigurationProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_ApplicationMaintenanceConfigurationProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_ApplicationRestoreConfigurationProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_ApplicationSnapshotConfigurationProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_CSVMappingParametersProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_CatalogConfigurationProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_CheckpointConfigurationProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_CodeContentProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_CustomArtifactConfigurationProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_DeployAsApplicationConfigurationProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_EnvironmentPropertiesProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_FlinkApplicationConfigurationProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_FlinkRunConfigurationProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_GlueDataCatalogConfigurationProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_InputProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_InputLambdaProcessorProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_InputParallelismProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_InputProcessingConfigurationProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_InputSchemaProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_JSONMappingParametersProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_KinesisFirehoseInputProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_KinesisStreamsInputProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_MappingParametersProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_MavenReferenceProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_MonitoringConfigurationProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_ParallelismConfigurationProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_PropertyGroupProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_RecordColumnProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_RecordFormatProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_RunConfigurationProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_S3ContentBaseLocationProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_S3ContentLocationProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_SqlApplicationConfigurationProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_VpcConfigurationProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_ZeppelinApplicationConfigurationProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_ZeppelinMonitoringConfigurationProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationCloudWatchLoggingOptionProps(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationCloudWatchLoggingOption(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationCloudWatchLoggingOption_CloudWatchLoggingOptionProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationOutputProps(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationOutput(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationOutput_DestinationSchemaProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationOutput_KinesisFirehoseOutputProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationOutput_KinesisStreamsOutputProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationOutput_LambdaOutputProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationOutput_OutputProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationReferenceDataSourceProps(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationReferenceDataSource(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationReferenceDataSource_CSVMappingParametersProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationReferenceDataSource_JSONMappingParametersProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationReferenceDataSource_MappingParametersProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationReferenceDataSource_RecordColumnProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationReferenceDataSource_RecordFormatProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationReferenceDataSource_ReferenceDataSourceProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationReferenceDataSource_ReferenceSchemaProperty(p) {
}
function _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationReferenceDataSource_S3ReferenceDataSourceProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationProps, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_ApplicationCodeConfigurationProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_ApplicationConfigurationProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_ApplicationMaintenanceConfigurationProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_ApplicationRestoreConfigurationProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_ApplicationSnapshotConfigurationProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_CSVMappingParametersProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_CatalogConfigurationProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_CheckpointConfigurationProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_CodeContentProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_CustomArtifactConfigurationProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_DeployAsApplicationConfigurationProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_EnvironmentPropertiesProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_FlinkApplicationConfigurationProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_FlinkRunConfigurationProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_GlueDataCatalogConfigurationProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_InputProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_InputLambdaProcessorProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_InputParallelismProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_InputProcessingConfigurationProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_InputSchemaProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_JSONMappingParametersProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_KinesisFirehoseInputProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_KinesisStreamsInputProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_MappingParametersProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_MavenReferenceProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_MonitoringConfigurationProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_ParallelismConfigurationProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_PropertyGroupProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_RecordColumnProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_RecordFormatProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_RunConfigurationProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_S3ContentBaseLocationProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_S3ContentLocationProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_SqlApplicationConfigurationProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_VpcConfigurationProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_ZeppelinApplicationConfigurationProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplication_ZeppelinMonitoringConfigurationProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationCloudWatchLoggingOptionProps, _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationCloudWatchLoggingOption, _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationCloudWatchLoggingOption_CloudWatchLoggingOptionProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationOutputProps, _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationOutput, _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationOutput_DestinationSchemaProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationOutput_KinesisFirehoseOutputProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationOutput_KinesisStreamsOutputProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationOutput_LambdaOutputProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationOutput_OutputProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationReferenceDataSourceProps, _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationReferenceDataSource, _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationReferenceDataSource_CSVMappingParametersProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationReferenceDataSource_JSONMappingParametersProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationReferenceDataSource_MappingParametersProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationReferenceDataSource_RecordColumnProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationReferenceDataSource_RecordFormatProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationReferenceDataSource_ReferenceDataSourceProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationReferenceDataSource_ReferenceSchemaProperty, _aws_cdk_aws_kinesisanalyticsv2_CfnApplicationReferenceDataSource_S3ReferenceDataSourceProperty };
