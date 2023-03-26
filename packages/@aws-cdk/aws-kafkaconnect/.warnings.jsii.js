function _aws_cdk_aws_kafkaconnect_CfnConnectorProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.capacity))
            _aws_cdk_aws_kafkaconnect_CfnConnector_CapacityProperty(p.capacity);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_kafkaconnect_CfnConnector(p) {
}
function _aws_cdk_aws_kafkaconnect_CfnConnector_ApacheKafkaClusterProperty(p) {
}
function _aws_cdk_aws_kafkaconnect_CfnConnector_AutoScalingProperty(p) {
}
function _aws_cdk_aws_kafkaconnect_CfnConnector_CapacityProperty(p) {
}
function _aws_cdk_aws_kafkaconnect_CfnConnector_CloudWatchLogsLogDeliveryProperty(p) {
}
function _aws_cdk_aws_kafkaconnect_CfnConnector_CustomPluginProperty(p) {
}
function _aws_cdk_aws_kafkaconnect_CfnConnector_FirehoseLogDeliveryProperty(p) {
}
function _aws_cdk_aws_kafkaconnect_CfnConnector_KafkaClusterProperty(p) {
}
function _aws_cdk_aws_kafkaconnect_CfnConnector_KafkaClusterClientAuthenticationProperty(p) {
}
function _aws_cdk_aws_kafkaconnect_CfnConnector_KafkaClusterEncryptionInTransitProperty(p) {
}
function _aws_cdk_aws_kafkaconnect_CfnConnector_LogDeliveryProperty(p) {
}
function _aws_cdk_aws_kafkaconnect_CfnConnector_PluginProperty(p) {
}
function _aws_cdk_aws_kafkaconnect_CfnConnector_ProvisionedCapacityProperty(p) {
}
function _aws_cdk_aws_kafkaconnect_CfnConnector_S3LogDeliveryProperty(p) {
}
function _aws_cdk_aws_kafkaconnect_CfnConnector_ScaleInPolicyProperty(p) {
}
function _aws_cdk_aws_kafkaconnect_CfnConnector_ScaleOutPolicyProperty(p) {
}
function _aws_cdk_aws_kafkaconnect_CfnConnector_VpcProperty(p) {
}
function _aws_cdk_aws_kafkaconnect_CfnConnector_WorkerConfigurationProperty(p) {
}
function _aws_cdk_aws_kafkaconnect_CfnConnector_WorkerLogDeliveryProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_kafkaconnect_CfnConnectorProps, _aws_cdk_aws_kafkaconnect_CfnConnector, _aws_cdk_aws_kafkaconnect_CfnConnector_ApacheKafkaClusterProperty, _aws_cdk_aws_kafkaconnect_CfnConnector_AutoScalingProperty, _aws_cdk_aws_kafkaconnect_CfnConnector_CapacityProperty, _aws_cdk_aws_kafkaconnect_CfnConnector_CloudWatchLogsLogDeliveryProperty, _aws_cdk_aws_kafkaconnect_CfnConnector_CustomPluginProperty, _aws_cdk_aws_kafkaconnect_CfnConnector_FirehoseLogDeliveryProperty, _aws_cdk_aws_kafkaconnect_CfnConnector_KafkaClusterProperty, _aws_cdk_aws_kafkaconnect_CfnConnector_KafkaClusterClientAuthenticationProperty, _aws_cdk_aws_kafkaconnect_CfnConnector_KafkaClusterEncryptionInTransitProperty, _aws_cdk_aws_kafkaconnect_CfnConnector_LogDeliveryProperty, _aws_cdk_aws_kafkaconnect_CfnConnector_PluginProperty, _aws_cdk_aws_kafkaconnect_CfnConnector_ProvisionedCapacityProperty, _aws_cdk_aws_kafkaconnect_CfnConnector_S3LogDeliveryProperty, _aws_cdk_aws_kafkaconnect_CfnConnector_ScaleInPolicyProperty, _aws_cdk_aws_kafkaconnect_CfnConnector_ScaleOutPolicyProperty, _aws_cdk_aws_kafkaconnect_CfnConnector_VpcProperty, _aws_cdk_aws_kafkaconnect_CfnConnector_WorkerConfigurationProperty, _aws_cdk_aws_kafkaconnect_CfnConnector_WorkerLogDeliveryProperty };
