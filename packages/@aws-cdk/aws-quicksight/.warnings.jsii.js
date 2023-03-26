function _aws_cdk_aws_quicksight_CfnAnalysisProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.sourceEntity))
            _aws_cdk_aws_quicksight_CfnAnalysis_AnalysisSourceEntityProperty(p.sourceEntity);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_quicksight_CfnAnalysis(p) {
}
function _aws_cdk_aws_quicksight_CfnAnalysis_AnalysisErrorProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnAnalysis_AnalysisSourceEntityProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnAnalysis_AnalysisSourceTemplateProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnAnalysis_DataSetReferenceProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnAnalysis_DateTimeParameterProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnAnalysis_DecimalParameterProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnAnalysis_IntegerParameterProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnAnalysis_ParametersProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnAnalysis_ResourcePermissionProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnAnalysis_SheetProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnAnalysis_StringParameterProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDashboardProps(p) {
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
function _aws_cdk_aws_quicksight_CfnDashboard(p) {
}
function _aws_cdk_aws_quicksight_CfnDashboard_AdHocFilteringOptionProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDashboard_DashboardErrorProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDashboard_DashboardPublishOptionsProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDashboard_DashboardSourceEntityProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDashboard_DashboardSourceTemplateProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDashboard_DashboardVersionProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDashboard_DataSetReferenceProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDashboard_DateTimeParameterProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDashboard_DecimalParameterProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDashboard_ExportToCSVOptionProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDashboard_IntegerParameterProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDashboard_ParametersProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDashboard_ResourcePermissionProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDashboard_SheetProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDashboard_SheetControlsOptionProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDashboard_StringParameterProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSetProps(p) {
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
function _aws_cdk_aws_quicksight_CfnDataSet(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_CalculatedColumnProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_CastColumnTypeOperationProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_ColumnDescriptionProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_ColumnGroupProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_ColumnLevelPermissionRuleProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_ColumnTagProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_CreateColumnsOperationProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_CustomSqlProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_DataSetUsageConfigurationProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_FieldFolderProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_FilterOperationProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_GeoSpatialColumnGroupProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_IngestionWaitPolicyProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_InputColumnProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_JoinInstructionProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_JoinKeyPropertiesProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_LogicalTableProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_LogicalTableSourceProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_OutputColumnProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_PhysicalTableProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_ProjectOperationProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_RelationalTableProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_RenameColumnOperationProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_ResourcePermissionProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_RowLevelPermissionDataSetProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_S3SourceProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_TagColumnOperationProperty(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_quicksight_CfnDataSet_ColumnTagProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_quicksight_CfnDataSet_TransformOperationProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSet_UploadSettingsProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSourceProps(p) {
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
function _aws_cdk_aws_quicksight_CfnDataSource(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_AmazonElasticsearchParametersProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_AmazonOpenSearchParametersProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_AthenaParametersProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_AuroraParametersProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_AuroraPostgreSqlParametersProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_CredentialPairProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_DataSourceCredentialsProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_DataSourceErrorInfoProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_DataSourceParametersProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_DatabricksParametersProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_ManifestFileLocationProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_MariaDbParametersProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_MySqlParametersProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_OracleParametersProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_PostgreSqlParametersProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_PrestoParametersProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_RdsParametersProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_RedshiftParametersProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_ResourcePermissionProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_S3ParametersProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_SnowflakeParametersProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_SparkParametersProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_SqlServerParametersProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_SslPropertiesProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_TeradataParametersProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnDataSource_VpcConnectionPropertiesProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTemplateProps(p) {
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
function _aws_cdk_aws_quicksight_CfnTemplate(p) {
}
function _aws_cdk_aws_quicksight_CfnTemplate_ColumnGroupColumnSchemaProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTemplate_ColumnGroupSchemaProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTemplate_ColumnSchemaProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTemplate_DataSetConfigurationProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTemplate_DataSetReferenceProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTemplate_DataSetSchemaProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTemplate_ResourcePermissionProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTemplate_SheetProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTemplate_TemplateErrorProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTemplate_TemplateSourceAnalysisProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTemplate_TemplateSourceEntityProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTemplate_TemplateSourceTemplateProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTemplate_TemplateVersionProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnThemeProps(p) {
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
function _aws_cdk_aws_quicksight_CfnTheme(p) {
}
function _aws_cdk_aws_quicksight_CfnTheme_BorderStyleProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTheme_DataColorPaletteProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTheme_FontProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTheme_GutterStyleProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTheme_MarginStyleProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTheme_ResourcePermissionProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTheme_SheetStyleProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTheme_ThemeConfigurationProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTheme_ThemeErrorProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTheme_ThemeVersionProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTheme_TileLayoutStyleProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTheme_TileStyleProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTheme_TypographyProperty(p) {
}
function _aws_cdk_aws_quicksight_CfnTheme_UIColorPaletteProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_quicksight_CfnAnalysisProps, _aws_cdk_aws_quicksight_CfnAnalysis, _aws_cdk_aws_quicksight_CfnAnalysis_AnalysisErrorProperty, _aws_cdk_aws_quicksight_CfnAnalysis_AnalysisSourceEntityProperty, _aws_cdk_aws_quicksight_CfnAnalysis_AnalysisSourceTemplateProperty, _aws_cdk_aws_quicksight_CfnAnalysis_DataSetReferenceProperty, _aws_cdk_aws_quicksight_CfnAnalysis_DateTimeParameterProperty, _aws_cdk_aws_quicksight_CfnAnalysis_DecimalParameterProperty, _aws_cdk_aws_quicksight_CfnAnalysis_IntegerParameterProperty, _aws_cdk_aws_quicksight_CfnAnalysis_ParametersProperty, _aws_cdk_aws_quicksight_CfnAnalysis_ResourcePermissionProperty, _aws_cdk_aws_quicksight_CfnAnalysis_SheetProperty, _aws_cdk_aws_quicksight_CfnAnalysis_StringParameterProperty, _aws_cdk_aws_quicksight_CfnDashboardProps, _aws_cdk_aws_quicksight_CfnDashboard, _aws_cdk_aws_quicksight_CfnDashboard_AdHocFilteringOptionProperty, _aws_cdk_aws_quicksight_CfnDashboard_DashboardErrorProperty, _aws_cdk_aws_quicksight_CfnDashboard_DashboardPublishOptionsProperty, _aws_cdk_aws_quicksight_CfnDashboard_DashboardSourceEntityProperty, _aws_cdk_aws_quicksight_CfnDashboard_DashboardSourceTemplateProperty, _aws_cdk_aws_quicksight_CfnDashboard_DashboardVersionProperty, _aws_cdk_aws_quicksight_CfnDashboard_DataSetReferenceProperty, _aws_cdk_aws_quicksight_CfnDashboard_DateTimeParameterProperty, _aws_cdk_aws_quicksight_CfnDashboard_DecimalParameterProperty, _aws_cdk_aws_quicksight_CfnDashboard_ExportToCSVOptionProperty, _aws_cdk_aws_quicksight_CfnDashboard_IntegerParameterProperty, _aws_cdk_aws_quicksight_CfnDashboard_ParametersProperty, _aws_cdk_aws_quicksight_CfnDashboard_ResourcePermissionProperty, _aws_cdk_aws_quicksight_CfnDashboard_SheetProperty, _aws_cdk_aws_quicksight_CfnDashboard_SheetControlsOptionProperty, _aws_cdk_aws_quicksight_CfnDashboard_StringParameterProperty, _aws_cdk_aws_quicksight_CfnDataSetProps, _aws_cdk_aws_quicksight_CfnDataSet, _aws_cdk_aws_quicksight_CfnDataSet_CalculatedColumnProperty, _aws_cdk_aws_quicksight_CfnDataSet_CastColumnTypeOperationProperty, _aws_cdk_aws_quicksight_CfnDataSet_ColumnDescriptionProperty, _aws_cdk_aws_quicksight_CfnDataSet_ColumnGroupProperty, _aws_cdk_aws_quicksight_CfnDataSet_ColumnLevelPermissionRuleProperty, _aws_cdk_aws_quicksight_CfnDataSet_ColumnTagProperty, _aws_cdk_aws_quicksight_CfnDataSet_CreateColumnsOperationProperty, _aws_cdk_aws_quicksight_CfnDataSet_CustomSqlProperty, _aws_cdk_aws_quicksight_CfnDataSet_DataSetUsageConfigurationProperty, _aws_cdk_aws_quicksight_CfnDataSet_FieldFolderProperty, _aws_cdk_aws_quicksight_CfnDataSet_FilterOperationProperty, _aws_cdk_aws_quicksight_CfnDataSet_GeoSpatialColumnGroupProperty, _aws_cdk_aws_quicksight_CfnDataSet_IngestionWaitPolicyProperty, _aws_cdk_aws_quicksight_CfnDataSet_InputColumnProperty, _aws_cdk_aws_quicksight_CfnDataSet_JoinInstructionProperty, _aws_cdk_aws_quicksight_CfnDataSet_JoinKeyPropertiesProperty, _aws_cdk_aws_quicksight_CfnDataSet_LogicalTableProperty, _aws_cdk_aws_quicksight_CfnDataSet_LogicalTableSourceProperty, _aws_cdk_aws_quicksight_CfnDataSet_OutputColumnProperty, _aws_cdk_aws_quicksight_CfnDataSet_PhysicalTableProperty, _aws_cdk_aws_quicksight_CfnDataSet_ProjectOperationProperty, _aws_cdk_aws_quicksight_CfnDataSet_RelationalTableProperty, _aws_cdk_aws_quicksight_CfnDataSet_RenameColumnOperationProperty, _aws_cdk_aws_quicksight_CfnDataSet_ResourcePermissionProperty, _aws_cdk_aws_quicksight_CfnDataSet_RowLevelPermissionDataSetProperty, _aws_cdk_aws_quicksight_CfnDataSet_S3SourceProperty, _aws_cdk_aws_quicksight_CfnDataSet_TagColumnOperationProperty, _aws_cdk_aws_quicksight_CfnDataSet_TransformOperationProperty, _aws_cdk_aws_quicksight_CfnDataSet_UploadSettingsProperty, _aws_cdk_aws_quicksight_CfnDataSourceProps, _aws_cdk_aws_quicksight_CfnDataSource, _aws_cdk_aws_quicksight_CfnDataSource_AmazonElasticsearchParametersProperty, _aws_cdk_aws_quicksight_CfnDataSource_AmazonOpenSearchParametersProperty, _aws_cdk_aws_quicksight_CfnDataSource_AthenaParametersProperty, _aws_cdk_aws_quicksight_CfnDataSource_AuroraParametersProperty, _aws_cdk_aws_quicksight_CfnDataSource_AuroraPostgreSqlParametersProperty, _aws_cdk_aws_quicksight_CfnDataSource_CredentialPairProperty, _aws_cdk_aws_quicksight_CfnDataSource_DataSourceCredentialsProperty, _aws_cdk_aws_quicksight_CfnDataSource_DataSourceErrorInfoProperty, _aws_cdk_aws_quicksight_CfnDataSource_DataSourceParametersProperty, _aws_cdk_aws_quicksight_CfnDataSource_DatabricksParametersProperty, _aws_cdk_aws_quicksight_CfnDataSource_ManifestFileLocationProperty, _aws_cdk_aws_quicksight_CfnDataSource_MariaDbParametersProperty, _aws_cdk_aws_quicksight_CfnDataSource_MySqlParametersProperty, _aws_cdk_aws_quicksight_CfnDataSource_OracleParametersProperty, _aws_cdk_aws_quicksight_CfnDataSource_PostgreSqlParametersProperty, _aws_cdk_aws_quicksight_CfnDataSource_PrestoParametersProperty, _aws_cdk_aws_quicksight_CfnDataSource_RdsParametersProperty, _aws_cdk_aws_quicksight_CfnDataSource_RedshiftParametersProperty, _aws_cdk_aws_quicksight_CfnDataSource_ResourcePermissionProperty, _aws_cdk_aws_quicksight_CfnDataSource_S3ParametersProperty, _aws_cdk_aws_quicksight_CfnDataSource_SnowflakeParametersProperty, _aws_cdk_aws_quicksight_CfnDataSource_SparkParametersProperty, _aws_cdk_aws_quicksight_CfnDataSource_SqlServerParametersProperty, _aws_cdk_aws_quicksight_CfnDataSource_SslPropertiesProperty, _aws_cdk_aws_quicksight_CfnDataSource_TeradataParametersProperty, _aws_cdk_aws_quicksight_CfnDataSource_VpcConnectionPropertiesProperty, _aws_cdk_aws_quicksight_CfnTemplateProps, _aws_cdk_aws_quicksight_CfnTemplate, _aws_cdk_aws_quicksight_CfnTemplate_ColumnGroupColumnSchemaProperty, _aws_cdk_aws_quicksight_CfnTemplate_ColumnGroupSchemaProperty, _aws_cdk_aws_quicksight_CfnTemplate_ColumnSchemaProperty, _aws_cdk_aws_quicksight_CfnTemplate_DataSetConfigurationProperty, _aws_cdk_aws_quicksight_CfnTemplate_DataSetReferenceProperty, _aws_cdk_aws_quicksight_CfnTemplate_DataSetSchemaProperty, _aws_cdk_aws_quicksight_CfnTemplate_ResourcePermissionProperty, _aws_cdk_aws_quicksight_CfnTemplate_SheetProperty, _aws_cdk_aws_quicksight_CfnTemplate_TemplateErrorProperty, _aws_cdk_aws_quicksight_CfnTemplate_TemplateSourceAnalysisProperty, _aws_cdk_aws_quicksight_CfnTemplate_TemplateSourceEntityProperty, _aws_cdk_aws_quicksight_CfnTemplate_TemplateSourceTemplateProperty, _aws_cdk_aws_quicksight_CfnTemplate_TemplateVersionProperty, _aws_cdk_aws_quicksight_CfnThemeProps, _aws_cdk_aws_quicksight_CfnTheme, _aws_cdk_aws_quicksight_CfnTheme_BorderStyleProperty, _aws_cdk_aws_quicksight_CfnTheme_DataColorPaletteProperty, _aws_cdk_aws_quicksight_CfnTheme_FontProperty, _aws_cdk_aws_quicksight_CfnTheme_GutterStyleProperty, _aws_cdk_aws_quicksight_CfnTheme_MarginStyleProperty, _aws_cdk_aws_quicksight_CfnTheme_ResourcePermissionProperty, _aws_cdk_aws_quicksight_CfnTheme_SheetStyleProperty, _aws_cdk_aws_quicksight_CfnTheme_ThemeConfigurationProperty, _aws_cdk_aws_quicksight_CfnTheme_ThemeErrorProperty, _aws_cdk_aws_quicksight_CfnTheme_ThemeVersionProperty, _aws_cdk_aws_quicksight_CfnTheme_TileLayoutStyleProperty, _aws_cdk_aws_quicksight_CfnTheme_TileStyleProperty, _aws_cdk_aws_quicksight_CfnTheme_TypographyProperty, _aws_cdk_aws_quicksight_CfnTheme_UIColorPaletteProperty };
