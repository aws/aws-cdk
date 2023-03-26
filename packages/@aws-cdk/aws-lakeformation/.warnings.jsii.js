function _aws_cdk_aws_lakeformation_CfnDataCellsFilterProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.columnWildcard))
            _aws_cdk_aws_lakeformation_CfnDataCellsFilter_ColumnWildcardProperty(p.columnWildcard);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lakeformation_CfnDataCellsFilter(p) {
}
function _aws_cdk_aws_lakeformation_CfnDataCellsFilter_ColumnWildcardProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnDataCellsFilter_RowFilterProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnDataLakeSettingsProps(p) {
}
function _aws_cdk_aws_lakeformation_CfnDataLakeSettings(p) {
}
function _aws_cdk_aws_lakeformation_CfnDataLakeSettings_DataLakePrincipalProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnPermissionsProps(p) {
}
function _aws_cdk_aws_lakeformation_CfnPermissions(p) {
}
function _aws_cdk_aws_lakeformation_CfnPermissions_ColumnWildcardProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnPermissions_DataLakePrincipalProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnPermissions_DataLocationResourceProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnPermissions_DatabaseResourceProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnPermissions_ResourceProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnPermissions_TableResourceProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnPermissions_TableWildcardProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnPermissions_TableWithColumnsResourceProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnPrincipalPermissionsProps(p) {
}
function _aws_cdk_aws_lakeformation_CfnPrincipalPermissions(p) {
}
function _aws_cdk_aws_lakeformation_CfnPrincipalPermissions_ColumnWildcardProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnPrincipalPermissions_DataCellsFilterResourceProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnPrincipalPermissions_DataLakePrincipalProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnPrincipalPermissions_DataLocationResourceProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnPrincipalPermissions_DatabaseResourceProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnPrincipalPermissions_LFTagProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnPrincipalPermissions_LFTagKeyResourceProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnPrincipalPermissions_LFTagPolicyResourceProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnPrincipalPermissions_ResourceProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnPrincipalPermissions_TableResourceProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnPrincipalPermissions_TableWithColumnsResourceProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnResourceProps(p) {
}
function _aws_cdk_aws_lakeformation_CfnResource(p) {
}
function _aws_cdk_aws_lakeformation_CfnTagProps(p) {
}
function _aws_cdk_aws_lakeformation_CfnTag(p) {
}
function _aws_cdk_aws_lakeformation_CfnTagAssociationProps(p) {
}
function _aws_cdk_aws_lakeformation_CfnTagAssociation(p) {
}
function _aws_cdk_aws_lakeformation_CfnTagAssociation_DatabaseResourceProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnTagAssociation_LFTagPairProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnTagAssociation_ResourceProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnTagAssociation_TableResourceProperty(p) {
}
function _aws_cdk_aws_lakeformation_CfnTagAssociation_TableWithColumnsResourceProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_lakeformation_CfnDataCellsFilterProps, _aws_cdk_aws_lakeformation_CfnDataCellsFilter, _aws_cdk_aws_lakeformation_CfnDataCellsFilter_ColumnWildcardProperty, _aws_cdk_aws_lakeformation_CfnDataCellsFilter_RowFilterProperty, _aws_cdk_aws_lakeformation_CfnDataLakeSettingsProps, _aws_cdk_aws_lakeformation_CfnDataLakeSettings, _aws_cdk_aws_lakeformation_CfnDataLakeSettings_DataLakePrincipalProperty, _aws_cdk_aws_lakeformation_CfnPermissionsProps, _aws_cdk_aws_lakeformation_CfnPermissions, _aws_cdk_aws_lakeformation_CfnPermissions_ColumnWildcardProperty, _aws_cdk_aws_lakeformation_CfnPermissions_DataLakePrincipalProperty, _aws_cdk_aws_lakeformation_CfnPermissions_DataLocationResourceProperty, _aws_cdk_aws_lakeformation_CfnPermissions_DatabaseResourceProperty, _aws_cdk_aws_lakeformation_CfnPermissions_ResourceProperty, _aws_cdk_aws_lakeformation_CfnPermissions_TableResourceProperty, _aws_cdk_aws_lakeformation_CfnPermissions_TableWildcardProperty, _aws_cdk_aws_lakeformation_CfnPermissions_TableWithColumnsResourceProperty, _aws_cdk_aws_lakeformation_CfnPrincipalPermissionsProps, _aws_cdk_aws_lakeformation_CfnPrincipalPermissions, _aws_cdk_aws_lakeformation_CfnPrincipalPermissions_ColumnWildcardProperty, _aws_cdk_aws_lakeformation_CfnPrincipalPermissions_DataCellsFilterResourceProperty, _aws_cdk_aws_lakeformation_CfnPrincipalPermissions_DataLakePrincipalProperty, _aws_cdk_aws_lakeformation_CfnPrincipalPermissions_DataLocationResourceProperty, _aws_cdk_aws_lakeformation_CfnPrincipalPermissions_DatabaseResourceProperty, _aws_cdk_aws_lakeformation_CfnPrincipalPermissions_LFTagProperty, _aws_cdk_aws_lakeformation_CfnPrincipalPermissions_LFTagKeyResourceProperty, _aws_cdk_aws_lakeformation_CfnPrincipalPermissions_LFTagPolicyResourceProperty, _aws_cdk_aws_lakeformation_CfnPrincipalPermissions_ResourceProperty, _aws_cdk_aws_lakeformation_CfnPrincipalPermissions_TableResourceProperty, _aws_cdk_aws_lakeformation_CfnPrincipalPermissions_TableWithColumnsResourceProperty, _aws_cdk_aws_lakeformation_CfnResourceProps, _aws_cdk_aws_lakeformation_CfnResource, _aws_cdk_aws_lakeformation_CfnTagProps, _aws_cdk_aws_lakeformation_CfnTag, _aws_cdk_aws_lakeformation_CfnTagAssociationProps, _aws_cdk_aws_lakeformation_CfnTagAssociation, _aws_cdk_aws_lakeformation_CfnTagAssociation_DatabaseResourceProperty, _aws_cdk_aws_lakeformation_CfnTagAssociation_LFTagPairProperty, _aws_cdk_aws_lakeformation_CfnTagAssociation_ResourceProperty, _aws_cdk_aws_lakeformation_CfnTagAssociation_TableResourceProperty, _aws_cdk_aws_lakeformation_CfnTagAssociation_TableWithColumnsResourceProperty };
