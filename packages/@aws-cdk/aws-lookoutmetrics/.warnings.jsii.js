function _aws_cdk_aws_lookoutmetrics_CfnAlertProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.action))
            _aws_cdk_aws_lookoutmetrics_CfnAlert_ActionProperty(p.action);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lookoutmetrics_CfnAlert(p) {
}
function _aws_cdk_aws_lookoutmetrics_CfnAlert_ActionProperty(p) {
}
function _aws_cdk_aws_lookoutmetrics_CfnAlert_LambdaConfigurationProperty(p) {
}
function _aws_cdk_aws_lookoutmetrics_CfnAlert_SNSConfigurationProperty(p) {
}
function _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetectorProps(p) {
}
function _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector(p) {
}
function _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_AnomalyDetectorConfigProperty(p) {
}
function _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_AppFlowConfigProperty(p) {
}
function _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_CloudwatchConfigProperty(p) {
}
function _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_CsvFormatDescriptorProperty(p) {
}
function _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_FileFormatDescriptorProperty(p) {
}
function _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_JsonFormatDescriptorProperty(p) {
}
function _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_MetricProperty(p) {
}
function _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_MetricSetProperty(p) {
}
function _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_MetricSourceProperty(p) {
}
function _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_RDSSourceConfigProperty(p) {
}
function _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_RedshiftSourceConfigProperty(p) {
}
function _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_S3SourceConfigProperty(p) {
}
function _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_TimestampColumnProperty(p) {
}
function _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_VpcConfigurationProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_lookoutmetrics_CfnAlertProps, _aws_cdk_aws_lookoutmetrics_CfnAlert, _aws_cdk_aws_lookoutmetrics_CfnAlert_ActionProperty, _aws_cdk_aws_lookoutmetrics_CfnAlert_LambdaConfigurationProperty, _aws_cdk_aws_lookoutmetrics_CfnAlert_SNSConfigurationProperty, _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetectorProps, _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector, _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_AnomalyDetectorConfigProperty, _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_AppFlowConfigProperty, _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_CloudwatchConfigProperty, _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_CsvFormatDescriptorProperty, _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_FileFormatDescriptorProperty, _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_JsonFormatDescriptorProperty, _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_MetricProperty, _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_MetricSetProperty, _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_MetricSourceProperty, _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_RDSSourceConfigProperty, _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_RedshiftSourceConfigProperty, _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_S3SourceConfigProperty, _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_TimestampColumnProperty, _aws_cdk_aws_lookoutmetrics_CfnAnomalyDetector_VpcConfigurationProperty };
