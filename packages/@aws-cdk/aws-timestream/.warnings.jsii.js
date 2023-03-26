function _aws_cdk_aws_timestream_CfnDatabaseProps(p) {
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
function _aws_cdk_aws_timestream_CfnDatabase(p) {
}
function _aws_cdk_aws_timestream_CfnScheduledQueryProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.errorReportConfiguration))
            _aws_cdk_aws_timestream_CfnScheduledQuery_ErrorReportConfigurationProperty(p.errorReportConfiguration);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_timestream_CfnScheduledQuery(p) {
}
function _aws_cdk_aws_timestream_CfnScheduledQuery_DimensionMappingProperty(p) {
}
function _aws_cdk_aws_timestream_CfnScheduledQuery_ErrorReportConfigurationProperty(p) {
}
function _aws_cdk_aws_timestream_CfnScheduledQuery_MixedMeasureMappingProperty(p) {
}
function _aws_cdk_aws_timestream_CfnScheduledQuery_MultiMeasureAttributeMappingProperty(p) {
}
function _aws_cdk_aws_timestream_CfnScheduledQuery_MultiMeasureMappingsProperty(p) {
}
function _aws_cdk_aws_timestream_CfnScheduledQuery_NotificationConfigurationProperty(p) {
}
function _aws_cdk_aws_timestream_CfnScheduledQuery_S3ConfigurationProperty(p) {
}
function _aws_cdk_aws_timestream_CfnScheduledQuery_ScheduleConfigurationProperty(p) {
}
function _aws_cdk_aws_timestream_CfnScheduledQuery_SnsConfigurationProperty(p) {
}
function _aws_cdk_aws_timestream_CfnScheduledQuery_TargetConfigurationProperty(p) {
}
function _aws_cdk_aws_timestream_CfnScheduledQuery_TimestreamConfigurationProperty(p) {
}
function _aws_cdk_aws_timestream_CfnTableProps(p) {
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
function _aws_cdk_aws_timestream_CfnTable(p) {
}
function _aws_cdk_aws_timestream_CfnTable_MagneticStoreRejectedDataLocationProperty(p) {
}
function _aws_cdk_aws_timestream_CfnTable_MagneticStoreWritePropertiesProperty(p) {
}
function _aws_cdk_aws_timestream_CfnTable_RetentionPropertiesProperty(p) {
}
function _aws_cdk_aws_timestream_CfnTable_S3ConfigurationProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_timestream_CfnDatabaseProps, _aws_cdk_aws_timestream_CfnDatabase, _aws_cdk_aws_timestream_CfnScheduledQueryProps, _aws_cdk_aws_timestream_CfnScheduledQuery, _aws_cdk_aws_timestream_CfnScheduledQuery_DimensionMappingProperty, _aws_cdk_aws_timestream_CfnScheduledQuery_ErrorReportConfigurationProperty, _aws_cdk_aws_timestream_CfnScheduledQuery_MixedMeasureMappingProperty, _aws_cdk_aws_timestream_CfnScheduledQuery_MultiMeasureAttributeMappingProperty, _aws_cdk_aws_timestream_CfnScheduledQuery_MultiMeasureMappingsProperty, _aws_cdk_aws_timestream_CfnScheduledQuery_NotificationConfigurationProperty, _aws_cdk_aws_timestream_CfnScheduledQuery_S3ConfigurationProperty, _aws_cdk_aws_timestream_CfnScheduledQuery_ScheduleConfigurationProperty, _aws_cdk_aws_timestream_CfnScheduledQuery_SnsConfigurationProperty, _aws_cdk_aws_timestream_CfnScheduledQuery_TargetConfigurationProperty, _aws_cdk_aws_timestream_CfnScheduledQuery_TimestreamConfigurationProperty, _aws_cdk_aws_timestream_CfnTableProps, _aws_cdk_aws_timestream_CfnTable, _aws_cdk_aws_timestream_CfnTable_MagneticStoreRejectedDataLocationProperty, _aws_cdk_aws_timestream_CfnTable_MagneticStoreWritePropertiesProperty, _aws_cdk_aws_timestream_CfnTable_RetentionPropertiesProperty, _aws_cdk_aws_timestream_CfnTable_S3ConfigurationProperty };
