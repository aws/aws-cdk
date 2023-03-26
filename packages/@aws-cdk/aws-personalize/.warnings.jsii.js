function _aws_cdk_aws_personalize_CfnDatasetProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.datasetImportJob))
            _aws_cdk_aws_personalize_CfnDataset_DatasetImportJobProperty(p.datasetImportJob);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_personalize_CfnDataset(p) {
}
function _aws_cdk_aws_personalize_CfnDataset_DataSourceProperty(p) {
}
function _aws_cdk_aws_personalize_CfnDataset_DatasetImportJobProperty(p) {
}
function _aws_cdk_aws_personalize_CfnDatasetGroupProps(p) {
}
function _aws_cdk_aws_personalize_CfnDatasetGroup(p) {
}
function _aws_cdk_aws_personalize_CfnSchemaProps(p) {
}
function _aws_cdk_aws_personalize_CfnSchema(p) {
}
function _aws_cdk_aws_personalize_CfnSolutionProps(p) {
}
function _aws_cdk_aws_personalize_CfnSolution(p) {
}
function _aws_cdk_aws_personalize_CfnSolution_AlgorithmHyperParameterRangesProperty(p) {
}
function _aws_cdk_aws_personalize_CfnSolution_AutoMLConfigProperty(p) {
}
function _aws_cdk_aws_personalize_CfnSolution_CategoricalHyperParameterRangeProperty(p) {
}
function _aws_cdk_aws_personalize_CfnSolution_ContinuousHyperParameterRangeProperty(p) {
}
function _aws_cdk_aws_personalize_CfnSolution_HpoConfigProperty(p) {
}
function _aws_cdk_aws_personalize_CfnSolution_HpoObjectiveProperty(p) {
}
function _aws_cdk_aws_personalize_CfnSolution_HpoResourceConfigProperty(p) {
}
function _aws_cdk_aws_personalize_CfnSolution_IntegerHyperParameterRangeProperty(p) {
}
function _aws_cdk_aws_personalize_CfnSolution_SolutionConfigProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_personalize_CfnDatasetProps, _aws_cdk_aws_personalize_CfnDataset, _aws_cdk_aws_personalize_CfnDataset_DataSourceProperty, _aws_cdk_aws_personalize_CfnDataset_DatasetImportJobProperty, _aws_cdk_aws_personalize_CfnDatasetGroupProps, _aws_cdk_aws_personalize_CfnDatasetGroup, _aws_cdk_aws_personalize_CfnSchemaProps, _aws_cdk_aws_personalize_CfnSchema, _aws_cdk_aws_personalize_CfnSolutionProps, _aws_cdk_aws_personalize_CfnSolution, _aws_cdk_aws_personalize_CfnSolution_AlgorithmHyperParameterRangesProperty, _aws_cdk_aws_personalize_CfnSolution_AutoMLConfigProperty, _aws_cdk_aws_personalize_CfnSolution_CategoricalHyperParameterRangeProperty, _aws_cdk_aws_personalize_CfnSolution_ContinuousHyperParameterRangeProperty, _aws_cdk_aws_personalize_CfnSolution_HpoConfigProperty, _aws_cdk_aws_personalize_CfnSolution_HpoObjectiveProperty, _aws_cdk_aws_personalize_CfnSolution_HpoResourceConfigProperty, _aws_cdk_aws_personalize_CfnSolution_IntegerHyperParameterRangeProperty, _aws_cdk_aws_personalize_CfnSolution_SolutionConfigProperty };
