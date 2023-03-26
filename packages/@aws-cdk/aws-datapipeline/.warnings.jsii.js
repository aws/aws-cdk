function _aws_cdk_aws_datapipeline_CfnPipelineProps(p) {
}
function _aws_cdk_aws_datapipeline_CfnPipeline(p) {
}
function _aws_cdk_aws_datapipeline_CfnPipeline_FieldProperty(p) {
}
function _aws_cdk_aws_datapipeline_CfnPipeline_ParameterAttributeProperty(p) {
}
function _aws_cdk_aws_datapipeline_CfnPipeline_ParameterObjectProperty(p) {
}
function _aws_cdk_aws_datapipeline_CfnPipeline_ParameterValueProperty(p) {
}
function _aws_cdk_aws_datapipeline_CfnPipeline_PipelineObjectProperty(p) {
}
function _aws_cdk_aws_datapipeline_CfnPipeline_PipelineTagProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_datapipeline_CfnPipelineProps, _aws_cdk_aws_datapipeline_CfnPipeline, _aws_cdk_aws_datapipeline_CfnPipeline_FieldProperty, _aws_cdk_aws_datapipeline_CfnPipeline_ParameterAttributeProperty, _aws_cdk_aws_datapipeline_CfnPipeline_ParameterObjectProperty, _aws_cdk_aws_datapipeline_CfnPipeline_ParameterValueProperty, _aws_cdk_aws_datapipeline_CfnPipeline_PipelineObjectProperty, _aws_cdk_aws_datapipeline_CfnPipeline_PipelineTagProperty };
