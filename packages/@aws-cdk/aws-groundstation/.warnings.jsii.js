function _aws_cdk_aws_groundstation_CfnConfigProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.configData))
            _aws_cdk_aws_groundstation_CfnConfig_ConfigDataProperty(p.configData);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_groundstation_CfnConfig(p) {
}
function _aws_cdk_aws_groundstation_CfnConfig_AntennaDownlinkConfigProperty(p) {
}
function _aws_cdk_aws_groundstation_CfnConfig_AntennaDownlinkDemodDecodeConfigProperty(p) {
}
function _aws_cdk_aws_groundstation_CfnConfig_AntennaUplinkConfigProperty(p) {
}
function _aws_cdk_aws_groundstation_CfnConfig_ConfigDataProperty(p) {
}
function _aws_cdk_aws_groundstation_CfnConfig_DataflowEndpointConfigProperty(p) {
}
function _aws_cdk_aws_groundstation_CfnConfig_DecodeConfigProperty(p) {
}
function _aws_cdk_aws_groundstation_CfnConfig_DemodulationConfigProperty(p) {
}
function _aws_cdk_aws_groundstation_CfnConfig_EirpProperty(p) {
}
function _aws_cdk_aws_groundstation_CfnConfig_FrequencyProperty(p) {
}
function _aws_cdk_aws_groundstation_CfnConfig_FrequencyBandwidthProperty(p) {
}
function _aws_cdk_aws_groundstation_CfnConfig_S3RecordingConfigProperty(p) {
}
function _aws_cdk_aws_groundstation_CfnConfig_SpectrumConfigProperty(p) {
}
function _aws_cdk_aws_groundstation_CfnConfig_TrackingConfigProperty(p) {
}
function _aws_cdk_aws_groundstation_CfnConfig_UplinkEchoConfigProperty(p) {
}
function _aws_cdk_aws_groundstation_CfnConfig_UplinkSpectrumConfigProperty(p) {
}
function _aws_cdk_aws_groundstation_CfnDataflowEndpointGroupProps(p) {
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
function _aws_cdk_aws_groundstation_CfnDataflowEndpointGroup(p) {
}
function _aws_cdk_aws_groundstation_CfnDataflowEndpointGroup_DataflowEndpointProperty(p) {
}
function _aws_cdk_aws_groundstation_CfnDataflowEndpointGroup_EndpointDetailsProperty(p) {
}
function _aws_cdk_aws_groundstation_CfnDataflowEndpointGroup_SecurityDetailsProperty(p) {
}
function _aws_cdk_aws_groundstation_CfnDataflowEndpointGroup_SocketAddressProperty(p) {
}
function _aws_cdk_aws_groundstation_CfnMissionProfileProps(p) {
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
function _aws_cdk_aws_groundstation_CfnMissionProfile(p) {
}
function _aws_cdk_aws_groundstation_CfnMissionProfile_DataflowEdgeProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_groundstation_CfnConfigProps, _aws_cdk_aws_groundstation_CfnConfig, _aws_cdk_aws_groundstation_CfnConfig_AntennaDownlinkConfigProperty, _aws_cdk_aws_groundstation_CfnConfig_AntennaDownlinkDemodDecodeConfigProperty, _aws_cdk_aws_groundstation_CfnConfig_AntennaUplinkConfigProperty, _aws_cdk_aws_groundstation_CfnConfig_ConfigDataProperty, _aws_cdk_aws_groundstation_CfnConfig_DataflowEndpointConfigProperty, _aws_cdk_aws_groundstation_CfnConfig_DecodeConfigProperty, _aws_cdk_aws_groundstation_CfnConfig_DemodulationConfigProperty, _aws_cdk_aws_groundstation_CfnConfig_EirpProperty, _aws_cdk_aws_groundstation_CfnConfig_FrequencyProperty, _aws_cdk_aws_groundstation_CfnConfig_FrequencyBandwidthProperty, _aws_cdk_aws_groundstation_CfnConfig_S3RecordingConfigProperty, _aws_cdk_aws_groundstation_CfnConfig_SpectrumConfigProperty, _aws_cdk_aws_groundstation_CfnConfig_TrackingConfigProperty, _aws_cdk_aws_groundstation_CfnConfig_UplinkEchoConfigProperty, _aws_cdk_aws_groundstation_CfnConfig_UplinkSpectrumConfigProperty, _aws_cdk_aws_groundstation_CfnDataflowEndpointGroupProps, _aws_cdk_aws_groundstation_CfnDataflowEndpointGroup, _aws_cdk_aws_groundstation_CfnDataflowEndpointGroup_DataflowEndpointProperty, _aws_cdk_aws_groundstation_CfnDataflowEndpointGroup_EndpointDetailsProperty, _aws_cdk_aws_groundstation_CfnDataflowEndpointGroup_SecurityDetailsProperty, _aws_cdk_aws_groundstation_CfnDataflowEndpointGroup_SocketAddressProperty, _aws_cdk_aws_groundstation_CfnMissionProfileProps, _aws_cdk_aws_groundstation_CfnMissionProfile, _aws_cdk_aws_groundstation_CfnMissionProfile_DataflowEdgeProperty };
