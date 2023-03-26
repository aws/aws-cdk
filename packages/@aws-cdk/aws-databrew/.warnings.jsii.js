function _aws_cdk_aws_databrew_CfnDatasetProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.input))
            _aws_cdk_aws_databrew_CfnDataset_InputProperty(p.input);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_databrew_CfnDataset(p) {
}
function _aws_cdk_aws_databrew_CfnDataset_CsvOptionsProperty(p) {
}
function _aws_cdk_aws_databrew_CfnDataset_DataCatalogInputDefinitionProperty(p) {
}
function _aws_cdk_aws_databrew_CfnDataset_DatabaseInputDefinitionProperty(p) {
}
function _aws_cdk_aws_databrew_CfnDataset_DatasetParameterProperty(p) {
}
function _aws_cdk_aws_databrew_CfnDataset_DatetimeOptionsProperty(p) {
}
function _aws_cdk_aws_databrew_CfnDataset_ExcelOptionsProperty(p) {
}
function _aws_cdk_aws_databrew_CfnDataset_FilesLimitProperty(p) {
}
function _aws_cdk_aws_databrew_CfnDataset_FilterExpressionProperty(p) {
}
function _aws_cdk_aws_databrew_CfnDataset_FilterValueProperty(p) {
}
function _aws_cdk_aws_databrew_CfnDataset_FormatOptionsProperty(p) {
}
function _aws_cdk_aws_databrew_CfnDataset_InputProperty(p) {
}
function _aws_cdk_aws_databrew_CfnDataset_JsonOptionsProperty(p) {
}
function _aws_cdk_aws_databrew_CfnDataset_MetadataProperty(p) {
}
function _aws_cdk_aws_databrew_CfnDataset_PathOptionsProperty(p) {
}
function _aws_cdk_aws_databrew_CfnDataset_PathParameterProperty(p) {
}
function _aws_cdk_aws_databrew_CfnDataset_S3LocationProperty(p) {
}
function _aws_cdk_aws_databrew_CfnJobProps(p) {
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
function _aws_cdk_aws_databrew_CfnJob(p) {
}
function _aws_cdk_aws_databrew_CfnJob_AllowedStatisticsProperty(p) {
}
function _aws_cdk_aws_databrew_CfnJob_ColumnSelectorProperty(p) {
}
function _aws_cdk_aws_databrew_CfnJob_ColumnStatisticsConfigurationProperty(p) {
}
function _aws_cdk_aws_databrew_CfnJob_CsvOutputOptionsProperty(p) {
}
function _aws_cdk_aws_databrew_CfnJob_DataCatalogOutputProperty(p) {
}
function _aws_cdk_aws_databrew_CfnJob_DatabaseOutputProperty(p) {
}
function _aws_cdk_aws_databrew_CfnJob_DatabaseTableOutputOptionsProperty(p) {
}
function _aws_cdk_aws_databrew_CfnJob_EntityDetectorConfigurationProperty(p) {
}
function _aws_cdk_aws_databrew_CfnJob_JobSampleProperty(p) {
}
function _aws_cdk_aws_databrew_CfnJob_OutputProperty(p) {
}
function _aws_cdk_aws_databrew_CfnJob_OutputFormatOptionsProperty(p) {
}
function _aws_cdk_aws_databrew_CfnJob_OutputLocationProperty(p) {
}
function _aws_cdk_aws_databrew_CfnJob_ProfileConfigurationProperty(p) {
}
function _aws_cdk_aws_databrew_CfnJob_RecipeProperty(p) {
}
function _aws_cdk_aws_databrew_CfnJob_S3LocationProperty(p) {
}
function _aws_cdk_aws_databrew_CfnJob_S3TableOutputOptionsProperty(p) {
}
function _aws_cdk_aws_databrew_CfnJob_StatisticOverrideProperty(p) {
}
function _aws_cdk_aws_databrew_CfnJob_StatisticsConfigurationProperty(p) {
}
function _aws_cdk_aws_databrew_CfnJob_ValidationConfigurationProperty(p) {
}
function _aws_cdk_aws_databrew_CfnProjectProps(p) {
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
function _aws_cdk_aws_databrew_CfnProject(p) {
}
function _aws_cdk_aws_databrew_CfnProject_SampleProperty(p) {
}
function _aws_cdk_aws_databrew_CfnRecipeProps(p) {
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
function _aws_cdk_aws_databrew_CfnRecipe(p) {
}
function _aws_cdk_aws_databrew_CfnRecipe_ActionProperty(p) {
}
function _aws_cdk_aws_databrew_CfnRecipe_ConditionExpressionProperty(p) {
}
function _aws_cdk_aws_databrew_CfnRecipe_DataCatalogInputDefinitionProperty(p) {
}
function _aws_cdk_aws_databrew_CfnRecipe_InputProperty(p) {
}
function _aws_cdk_aws_databrew_CfnRecipe_RecipeParametersProperty(p) {
}
function _aws_cdk_aws_databrew_CfnRecipe_RecipeStepProperty(p) {
}
function _aws_cdk_aws_databrew_CfnRecipe_S3LocationProperty(p) {
}
function _aws_cdk_aws_databrew_CfnRecipe_SecondaryInputProperty(p) {
}
function _aws_cdk_aws_databrew_CfnRulesetProps(p) {
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
function _aws_cdk_aws_databrew_CfnRuleset(p) {
}
function _aws_cdk_aws_databrew_CfnRuleset_ColumnSelectorProperty(p) {
}
function _aws_cdk_aws_databrew_CfnRuleset_RuleProperty(p) {
}
function _aws_cdk_aws_databrew_CfnRuleset_SubstitutionValueProperty(p) {
}
function _aws_cdk_aws_databrew_CfnRuleset_ThresholdProperty(p) {
}
function _aws_cdk_aws_databrew_CfnScheduleProps(p) {
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
function _aws_cdk_aws_databrew_CfnSchedule(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_databrew_CfnDatasetProps, _aws_cdk_aws_databrew_CfnDataset, _aws_cdk_aws_databrew_CfnDataset_CsvOptionsProperty, _aws_cdk_aws_databrew_CfnDataset_DataCatalogInputDefinitionProperty, _aws_cdk_aws_databrew_CfnDataset_DatabaseInputDefinitionProperty, _aws_cdk_aws_databrew_CfnDataset_DatasetParameterProperty, _aws_cdk_aws_databrew_CfnDataset_DatetimeOptionsProperty, _aws_cdk_aws_databrew_CfnDataset_ExcelOptionsProperty, _aws_cdk_aws_databrew_CfnDataset_FilesLimitProperty, _aws_cdk_aws_databrew_CfnDataset_FilterExpressionProperty, _aws_cdk_aws_databrew_CfnDataset_FilterValueProperty, _aws_cdk_aws_databrew_CfnDataset_FormatOptionsProperty, _aws_cdk_aws_databrew_CfnDataset_InputProperty, _aws_cdk_aws_databrew_CfnDataset_JsonOptionsProperty, _aws_cdk_aws_databrew_CfnDataset_MetadataProperty, _aws_cdk_aws_databrew_CfnDataset_PathOptionsProperty, _aws_cdk_aws_databrew_CfnDataset_PathParameterProperty, _aws_cdk_aws_databrew_CfnDataset_S3LocationProperty, _aws_cdk_aws_databrew_CfnJobProps, _aws_cdk_aws_databrew_CfnJob, _aws_cdk_aws_databrew_CfnJob_AllowedStatisticsProperty, _aws_cdk_aws_databrew_CfnJob_ColumnSelectorProperty, _aws_cdk_aws_databrew_CfnJob_ColumnStatisticsConfigurationProperty, _aws_cdk_aws_databrew_CfnJob_CsvOutputOptionsProperty, _aws_cdk_aws_databrew_CfnJob_DataCatalogOutputProperty, _aws_cdk_aws_databrew_CfnJob_DatabaseOutputProperty, _aws_cdk_aws_databrew_CfnJob_DatabaseTableOutputOptionsProperty, _aws_cdk_aws_databrew_CfnJob_EntityDetectorConfigurationProperty, _aws_cdk_aws_databrew_CfnJob_JobSampleProperty, _aws_cdk_aws_databrew_CfnJob_OutputProperty, _aws_cdk_aws_databrew_CfnJob_OutputFormatOptionsProperty, _aws_cdk_aws_databrew_CfnJob_OutputLocationProperty, _aws_cdk_aws_databrew_CfnJob_ProfileConfigurationProperty, _aws_cdk_aws_databrew_CfnJob_RecipeProperty, _aws_cdk_aws_databrew_CfnJob_S3LocationProperty, _aws_cdk_aws_databrew_CfnJob_S3TableOutputOptionsProperty, _aws_cdk_aws_databrew_CfnJob_StatisticOverrideProperty, _aws_cdk_aws_databrew_CfnJob_StatisticsConfigurationProperty, _aws_cdk_aws_databrew_CfnJob_ValidationConfigurationProperty, _aws_cdk_aws_databrew_CfnProjectProps, _aws_cdk_aws_databrew_CfnProject, _aws_cdk_aws_databrew_CfnProject_SampleProperty, _aws_cdk_aws_databrew_CfnRecipeProps, _aws_cdk_aws_databrew_CfnRecipe, _aws_cdk_aws_databrew_CfnRecipe_ActionProperty, _aws_cdk_aws_databrew_CfnRecipe_ConditionExpressionProperty, _aws_cdk_aws_databrew_CfnRecipe_DataCatalogInputDefinitionProperty, _aws_cdk_aws_databrew_CfnRecipe_InputProperty, _aws_cdk_aws_databrew_CfnRecipe_RecipeParametersProperty, _aws_cdk_aws_databrew_CfnRecipe_RecipeStepProperty, _aws_cdk_aws_databrew_CfnRecipe_S3LocationProperty, _aws_cdk_aws_databrew_CfnRecipe_SecondaryInputProperty, _aws_cdk_aws_databrew_CfnRulesetProps, _aws_cdk_aws_databrew_CfnRuleset, _aws_cdk_aws_databrew_CfnRuleset_ColumnSelectorProperty, _aws_cdk_aws_databrew_CfnRuleset_RuleProperty, _aws_cdk_aws_databrew_CfnRuleset_SubstitutionValueProperty, _aws_cdk_aws_databrew_CfnRuleset_ThresholdProperty, _aws_cdk_aws_databrew_CfnScheduleProps, _aws_cdk_aws_databrew_CfnSchedule };
