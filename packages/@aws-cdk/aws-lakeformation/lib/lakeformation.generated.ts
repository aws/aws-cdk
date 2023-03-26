// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:54.656Z","fingerprint":"J9UUtlwLBLtpQygIga3SwtqHyYc4cAQn9/McnvS3to0="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnDataCellsFilter`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html
 */
export interface CfnDataCellsFilterProps {

    /**
     * UTF-8 string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html#aws-glue-api-regex-oneLine) .
     *
     * A database in the Data Catalog .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-databasename
     */
    readonly databaseName: string;

    /**
     * UTF-8 string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html#aws-glue-api-regex-oneLine) .
     *
     * The name given by the user to the data filter cell.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-name
     */
    readonly name: string;

    /**
     * Catalog id string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html#aws-glue-api-regex-oneLine) .
     *
     * The ID of the catalog to which the table belongs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-tablecatalogid
     */
    readonly tableCatalogId: string;

    /**
     * UTF-8 string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html#aws-glue-api-regex-oneLine) .
     *
     * A table in the database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-tablename
     */
    readonly tableName: string;

    /**
     * An array of UTF-8 strings. A list of column names.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-columnnames
     */
    readonly columnNames?: string[];

    /**
     * A wildcard with exclusions. You must specify either a `ColumnNames` list or the `ColumnWildCard` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-columnwildcard
     */
    readonly columnWildcard?: CfnDataCellsFilter.ColumnWildcardProperty | cdk.IResolvable;

    /**
     * A PartiQL predicate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-rowfilter
     */
    readonly rowFilter?: CfnDataCellsFilter.RowFilterProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnDataCellsFilterProps`
 *
 * @param properties - the TypeScript properties of a `CfnDataCellsFilterProps`
 *
 * @returns the result of the validation.
 */
function CfnDataCellsFilterPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('columnNames', cdk.listValidator(cdk.validateString))(properties.columnNames));
    errors.collect(cdk.propertyValidator('columnWildcard', CfnDataCellsFilter_ColumnWildcardPropertyValidator)(properties.columnWildcard));
    errors.collect(cdk.propertyValidator('databaseName', cdk.requiredValidator)(properties.databaseName));
    errors.collect(cdk.propertyValidator('databaseName', cdk.validateString)(properties.databaseName));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('rowFilter', CfnDataCellsFilter_RowFilterPropertyValidator)(properties.rowFilter));
    errors.collect(cdk.propertyValidator('tableCatalogId', cdk.requiredValidator)(properties.tableCatalogId));
    errors.collect(cdk.propertyValidator('tableCatalogId', cdk.validateString)(properties.tableCatalogId));
    errors.collect(cdk.propertyValidator('tableName', cdk.requiredValidator)(properties.tableName));
    errors.collect(cdk.propertyValidator('tableName', cdk.validateString)(properties.tableName));
    return errors.wrap('supplied properties not correct for "CfnDataCellsFilterProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::DataCellsFilter` resource
 *
 * @param properties - the TypeScript properties of a `CfnDataCellsFilterProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::DataCellsFilter` resource.
 */
// @ts-ignore TS6133
function cfnDataCellsFilterPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataCellsFilterPropsValidator(properties).assertSuccess();
    return {
        DatabaseName: cdk.stringToCloudFormation(properties.databaseName),
        Name: cdk.stringToCloudFormation(properties.name),
        TableCatalogId: cdk.stringToCloudFormation(properties.tableCatalogId),
        TableName: cdk.stringToCloudFormation(properties.tableName),
        ColumnNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.columnNames),
        ColumnWildcard: cfnDataCellsFilterColumnWildcardPropertyToCloudFormation(properties.columnWildcard),
        RowFilter: cfnDataCellsFilterRowFilterPropertyToCloudFormation(properties.rowFilter),
    };
}

// @ts-ignore TS6133
function CfnDataCellsFilterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataCellsFilterProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataCellsFilterProps>();
    ret.addPropertyResult('databaseName', 'DatabaseName', cfn_parse.FromCloudFormation.getString(properties.DatabaseName));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('tableCatalogId', 'TableCatalogId', cfn_parse.FromCloudFormation.getString(properties.TableCatalogId));
    ret.addPropertyResult('tableName', 'TableName', cfn_parse.FromCloudFormation.getString(properties.TableName));
    ret.addPropertyResult('columnNames', 'ColumnNames', properties.ColumnNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ColumnNames) : undefined);
    ret.addPropertyResult('columnWildcard', 'ColumnWildcard', properties.ColumnWildcard != null ? CfnDataCellsFilterColumnWildcardPropertyFromCloudFormation(properties.ColumnWildcard) : undefined);
    ret.addPropertyResult('rowFilter', 'RowFilter', properties.RowFilter != null ? CfnDataCellsFilterRowFilterPropertyFromCloudFormation(properties.RowFilter) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::LakeFormation::DataCellsFilter`
 *
 * A structure that represents a data cell filter with column-level, row-level, and/or cell-level security. Data cell filters belong to a specific table in a Data Catalog . During a stack operation, AWS CloudFormation calls the AWS Lake Formation `CreateDataCellsFilter` API operation to create a `DataCellsFilter` resource, and calls the `DeleteDataCellsFilter` API operation to delete it.
 *
 * @cloudformationResource AWS::LakeFormation::DataCellsFilter
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html
 */
export class CfnDataCellsFilter extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::LakeFormation::DataCellsFilter";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataCellsFilter {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDataCellsFilterPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDataCellsFilter(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * UTF-8 string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html#aws-glue-api-regex-oneLine) .
     *
     * A database in the Data Catalog .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-databasename
     */
    public databaseName: string;

    /**
     * UTF-8 string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html#aws-glue-api-regex-oneLine) .
     *
     * The name given by the user to the data filter cell.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-name
     */
    public name: string;

    /**
     * Catalog id string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html#aws-glue-api-regex-oneLine) .
     *
     * The ID of the catalog to which the table belongs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-tablecatalogid
     */
    public tableCatalogId: string;

    /**
     * UTF-8 string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html#aws-glue-api-regex-oneLine) .
     *
     * A table in the database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-tablename
     */
    public tableName: string;

    /**
     * An array of UTF-8 strings. A list of column names.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-columnnames
     */
    public columnNames: string[] | undefined;

    /**
     * A wildcard with exclusions. You must specify either a `ColumnNames` list or the `ColumnWildCard` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-columnwildcard
     */
    public columnWildcard: CfnDataCellsFilter.ColumnWildcardProperty | cdk.IResolvable | undefined;

    /**
     * A PartiQL predicate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-rowfilter
     */
    public rowFilter: CfnDataCellsFilter.RowFilterProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::LakeFormation::DataCellsFilter`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDataCellsFilterProps) {
        super(scope, id, { type: CfnDataCellsFilter.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'databaseName', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'tableCatalogId', this);
        cdk.requireProperty(props, 'tableName', this);

        this.databaseName = props.databaseName;
        this.name = props.name;
        this.tableCatalogId = props.tableCatalogId;
        this.tableName = props.tableName;
        this.columnNames = props.columnNames;
        this.columnWildcard = props.columnWildcard;
        this.rowFilter = props.rowFilter;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataCellsFilter.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            databaseName: this.databaseName,
            name: this.name,
            tableCatalogId: this.tableCatalogId,
            tableName: this.tableName,
            columnNames: this.columnNames,
            columnWildcard: this.columnWildcard,
            rowFilter: this.rowFilter,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDataCellsFilterPropsToCloudFormation(props);
    }
}

export namespace CfnDataCellsFilter {
    /**
     * A wildcard object, consisting of an optional list of excluded column names or indexes.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-datacellsfilter-columnwildcard.html
     */
    export interface ColumnWildcardProperty {
        /**
         * Excludes column names. Any column with this name will be excluded.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-datacellsfilter-columnwildcard.html#cfn-lakeformation-datacellsfilter-columnwildcard-excludedcolumnnames
         */
        readonly excludedColumnNames?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `ColumnWildcardProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnWildcardProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataCellsFilter_ColumnWildcardPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('excludedColumnNames', cdk.listValidator(cdk.validateString))(properties.excludedColumnNames));
    return errors.wrap('supplied properties not correct for "ColumnWildcardProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::DataCellsFilter.ColumnWildcard` resource
 *
 * @param properties - the TypeScript properties of a `ColumnWildcardProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::DataCellsFilter.ColumnWildcard` resource.
 */
// @ts-ignore TS6133
function cfnDataCellsFilterColumnWildcardPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataCellsFilter_ColumnWildcardPropertyValidator(properties).assertSuccess();
    return {
        ExcludedColumnNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.excludedColumnNames),
    };
}

// @ts-ignore TS6133
function CfnDataCellsFilterColumnWildcardPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataCellsFilter.ColumnWildcardProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataCellsFilter.ColumnWildcardProperty>();
    ret.addPropertyResult('excludedColumnNames', 'ExcludedColumnNames', properties.ExcludedColumnNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ExcludedColumnNames) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataCellsFilter {
    /**
     * A PartiQL predicate.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-datacellsfilter-rowfilter.html
     */
    export interface RowFilterProperty {
        /**
         * A wildcard for all rows.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-datacellsfilter-rowfilter.html#cfn-lakeformation-datacellsfilter-rowfilter-allrowswildcard
         */
        readonly allRowsWildcard?: any | cdk.IResolvable;
        /**
         * A filter expression.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-datacellsfilter-rowfilter.html#cfn-lakeformation-datacellsfilter-rowfilter-filterexpression
         */
        readonly filterExpression?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RowFilterProperty`
 *
 * @param properties - the TypeScript properties of a `RowFilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataCellsFilter_RowFilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allRowsWildcard', cdk.validateObject)(properties.allRowsWildcard));
    errors.collect(cdk.propertyValidator('filterExpression', cdk.validateString)(properties.filterExpression));
    return errors.wrap('supplied properties not correct for "RowFilterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::DataCellsFilter.RowFilter` resource
 *
 * @param properties - the TypeScript properties of a `RowFilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::DataCellsFilter.RowFilter` resource.
 */
// @ts-ignore TS6133
function cfnDataCellsFilterRowFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataCellsFilter_RowFilterPropertyValidator(properties).assertSuccess();
    return {
        AllRowsWildcard: cdk.objectToCloudFormation(properties.allRowsWildcard),
        FilterExpression: cdk.stringToCloudFormation(properties.filterExpression),
    };
}

// @ts-ignore TS6133
function CfnDataCellsFilterRowFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataCellsFilter.RowFilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataCellsFilter.RowFilterProperty>();
    ret.addPropertyResult('allRowsWildcard', 'AllRowsWildcard', properties.AllRowsWildcard != null ? cfn_parse.FromCloudFormation.getAny(properties.AllRowsWildcard) : undefined);
    ret.addPropertyResult('filterExpression', 'FilterExpression', properties.FilterExpression != null ? cfn_parse.FromCloudFormation.getString(properties.FilterExpression) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnDataLakeSettings`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datalakesettings.html
 */
export interface CfnDataLakeSettingsProps {

    /**
     * A list of AWS Lake Formation principals.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datalakesettings.html#cfn-lakeformation-datalakesettings-admins
     */
    readonly admins?: Array<CfnDataLakeSettings.DataLakePrincipalProperty | cdk.IResolvable> | cdk.IResolvable | cdk.IResolvable;

    /**
     * An array of UTF-8 strings.
     *
     * A list of the resource-owning account IDs that the caller's account can use to share their user access details (user ARNs). The user ARNs can be logged in the resource owner's CloudTrail log. You may want to specify this property when you are in a high-trust boundary, such as the same team or company.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datalakesettings.html#cfn-lakeformation-datalakesettings-trustedresourceowners
     */
    readonly trustedResourceOwners?: string[];
}

/**
 * Determine whether the given properties match those of a `CfnDataLakeSettingsProps`
 *
 * @param properties - the TypeScript properties of a `CfnDataLakeSettingsProps`
 *
 * @returns the result of the validation.
 */
function CfnDataLakeSettingsPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('admins', cdk.listValidator(CfnDataLakeSettings_DataLakePrincipalPropertyValidator))(properties.admins));
    errors.collect(cdk.propertyValidator('trustedResourceOwners', cdk.listValidator(cdk.validateString))(properties.trustedResourceOwners));
    return errors.wrap('supplied properties not correct for "CfnDataLakeSettingsProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::DataLakeSettings` resource
 *
 * @param properties - the TypeScript properties of a `CfnDataLakeSettingsProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::DataLakeSettings` resource.
 */
// @ts-ignore TS6133
function cfnDataLakeSettingsPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataLakeSettingsPropsValidator(properties).assertSuccess();
    return {
        Admins: cdk.listMapper(cfnDataLakeSettingsDataLakePrincipalPropertyToCloudFormation)(properties.admins),
        TrustedResourceOwners: cdk.listMapper(cdk.stringToCloudFormation)(properties.trustedResourceOwners),
    };
}

// @ts-ignore TS6133
function CfnDataLakeSettingsPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataLakeSettingsProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataLakeSettingsProps>();
    ret.addPropertyResult('admins', 'Admins', properties.Admins != null ? cfn_parse.FromCloudFormation.getArray(CfnDataLakeSettingsDataLakePrincipalPropertyFromCloudFormation)(properties.Admins) : undefined);
    ret.addPropertyResult('trustedResourceOwners', 'TrustedResourceOwners', properties.TrustedResourceOwners != null ? cfn_parse.FromCloudFormation.getStringArray(properties.TrustedResourceOwners) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::LakeFormation::DataLakeSettings`
 *
 * The `AWS::LakeFormation::DataLakeSettings` resource is an AWS Lake Formation resource type that manages the data lake settings for your account. Note that the CloudFormation template only supports updating the `Admins` list. It does not support updating the [CreateDatabaseDefaultPermissions](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-settings.html#aws-lake-formation-api-aws-lake-formation-api-settings-DataLakeSettings) or [CreateTableDefaultPermissions](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-settings.html#aws-lake-formation-api-aws-lake-formation-api-settings-DataLakeSettings) . Those permissions can only be edited in the DataLakeSettings resource via the API.
 *
 * @cloudformationResource AWS::LakeFormation::DataLakeSettings
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datalakesettings.html
 */
export class CfnDataLakeSettings extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::LakeFormation::DataLakeSettings";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataLakeSettings {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDataLakeSettingsPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDataLakeSettings(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * A list of AWS Lake Formation principals.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datalakesettings.html#cfn-lakeformation-datalakesettings-admins
     */
    public admins: Array<CfnDataLakeSettings.DataLakePrincipalProperty | cdk.IResolvable> | cdk.IResolvable | cdk.IResolvable | undefined;

    /**
     * An array of UTF-8 strings.
     *
     * A list of the resource-owning account IDs that the caller's account can use to share their user access details (user ARNs). The user ARNs can be logged in the resource owner's CloudTrail log. You may want to specify this property when you are in a high-trust boundary, such as the same team or company.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datalakesettings.html#cfn-lakeformation-datalakesettings-trustedresourceowners
     */
    public trustedResourceOwners: string[] | undefined;

    /**
     * Create a new `AWS::LakeFormation::DataLakeSettings`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDataLakeSettingsProps = {}) {
        super(scope, id, { type: CfnDataLakeSettings.CFN_RESOURCE_TYPE_NAME, properties: props });

        this.admins = props.admins;
        this.trustedResourceOwners = props.trustedResourceOwners;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataLakeSettings.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            admins: this.admins,
            trustedResourceOwners: this.trustedResourceOwners,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDataLakeSettingsPropsToCloudFormation(props);
    }
}

export namespace CfnDataLakeSettings {
    /**
     * The Lake Formation principal.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-datalakesettings-datalakeprincipal.html
     */
    export interface DataLakePrincipalProperty {
        /**
         * An identifier for the Lake Formation principal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-datalakesettings-datalakeprincipal.html#cfn-lakeformation-datalakesettings-datalakeprincipal-datalakeprincipalidentifier
         */
        readonly dataLakePrincipalIdentifier?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DataLakePrincipalProperty`
 *
 * @param properties - the TypeScript properties of a `DataLakePrincipalProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataLakeSettings_DataLakePrincipalPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataLakePrincipalIdentifier', cdk.validateString)(properties.dataLakePrincipalIdentifier));
    return errors.wrap('supplied properties not correct for "DataLakePrincipalProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::DataLakeSettings.DataLakePrincipal` resource
 *
 * @param properties - the TypeScript properties of a `DataLakePrincipalProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::DataLakeSettings.DataLakePrincipal` resource.
 */
// @ts-ignore TS6133
function cfnDataLakeSettingsDataLakePrincipalPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataLakeSettings_DataLakePrincipalPropertyValidator(properties).assertSuccess();
    return {
        DataLakePrincipalIdentifier: cdk.stringToCloudFormation(properties.dataLakePrincipalIdentifier),
    };
}

// @ts-ignore TS6133
function CfnDataLakeSettingsDataLakePrincipalPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataLakeSettings.DataLakePrincipalProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataLakeSettings.DataLakePrincipalProperty>();
    ret.addPropertyResult('dataLakePrincipalIdentifier', 'DataLakePrincipalIdentifier', properties.DataLakePrincipalIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DataLakePrincipalIdentifier) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnPermissions`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-permissions.html
 */
export interface CfnPermissionsProps {

    /**
     * The AWS Lake Formation principal.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-permissions.html#cfn-lakeformation-permissions-datalakeprincipal
     */
    readonly dataLakePrincipal: CfnPermissions.DataLakePrincipalProperty | cdk.IResolvable;

    /**
     * A structure for the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-permissions.html#cfn-lakeformation-permissions-resource
     */
    readonly resource: CfnPermissions.ResourceProperty | cdk.IResolvable;

    /**
     * The permissions granted or revoked.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-permissions.html#cfn-lakeformation-permissions-permissions
     */
    readonly permissions?: string[];

    /**
     * Indicates the ability to grant permissions (as a subset of permissions granted).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-permissions.html#cfn-lakeformation-permissions-permissionswithgrantoption
     */
    readonly permissionsWithGrantOption?: string[];
}

/**
 * Determine whether the given properties match those of a `CfnPermissionsProps`
 *
 * @param properties - the TypeScript properties of a `CfnPermissionsProps`
 *
 * @returns the result of the validation.
 */
function CfnPermissionsPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataLakePrincipal', cdk.requiredValidator)(properties.dataLakePrincipal));
    errors.collect(cdk.propertyValidator('dataLakePrincipal', CfnPermissions_DataLakePrincipalPropertyValidator)(properties.dataLakePrincipal));
    errors.collect(cdk.propertyValidator('permissions', cdk.listValidator(cdk.validateString))(properties.permissions));
    errors.collect(cdk.propertyValidator('permissionsWithGrantOption', cdk.listValidator(cdk.validateString))(properties.permissionsWithGrantOption));
    errors.collect(cdk.propertyValidator('resource', cdk.requiredValidator)(properties.resource));
    errors.collect(cdk.propertyValidator('resource', CfnPermissions_ResourcePropertyValidator)(properties.resource));
    return errors.wrap('supplied properties not correct for "CfnPermissionsProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::Permissions` resource
 *
 * @param properties - the TypeScript properties of a `CfnPermissionsProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::Permissions` resource.
 */
// @ts-ignore TS6133
function cfnPermissionsPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPermissionsPropsValidator(properties).assertSuccess();
    return {
        DataLakePrincipal: cfnPermissionsDataLakePrincipalPropertyToCloudFormation(properties.dataLakePrincipal),
        Resource: cfnPermissionsResourcePropertyToCloudFormation(properties.resource),
        Permissions: cdk.listMapper(cdk.stringToCloudFormation)(properties.permissions),
        PermissionsWithGrantOption: cdk.listMapper(cdk.stringToCloudFormation)(properties.permissionsWithGrantOption),
    };
}

// @ts-ignore TS6133
function CfnPermissionsPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPermissionsProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissionsProps>();
    ret.addPropertyResult('dataLakePrincipal', 'DataLakePrincipal', CfnPermissionsDataLakePrincipalPropertyFromCloudFormation(properties.DataLakePrincipal));
    ret.addPropertyResult('resource', 'Resource', CfnPermissionsResourcePropertyFromCloudFormation(properties.Resource));
    ret.addPropertyResult('permissions', 'Permissions', properties.Permissions != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Permissions) : undefined);
    ret.addPropertyResult('permissionsWithGrantOption', 'PermissionsWithGrantOption', properties.PermissionsWithGrantOption != null ? cfn_parse.FromCloudFormation.getStringArray(properties.PermissionsWithGrantOption) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::LakeFormation::Permissions`
 *
 * The `AWS::LakeFormation::Permissions` resource represents the permissions that a principal has on an AWS Glue Data Catalog resource (such as AWS Glue database or AWS Glue tables). When you upload a permissions stack, the permissions are granted to the principal and when you remove the stack, the permissions are revoked from the principal. If you remove a stack, and the principal does not have the permissions referenced in the stack then AWS Lake Formation will throw an error because you can’t call revoke on non-existing permissions. To successfully remove the stack, you’ll need to regrant those permissions and then remove the stack.
 *
 * > New versions of AWS Lake Formation permission resources are now available. For more information, see: [AWS:LakeFormation::PrincipalPermissions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-principalpermissions.html)
 *
 * @cloudformationResource AWS::LakeFormation::Permissions
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-permissions.html
 */
export class CfnPermissions extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::LakeFormation::Permissions";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPermissions {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPermissionsPropsFromCloudFormation(resourceProperties);
        const ret = new CfnPermissions(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The AWS Lake Formation principal.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-permissions.html#cfn-lakeformation-permissions-datalakeprincipal
     */
    public dataLakePrincipal: CfnPermissions.DataLakePrincipalProperty | cdk.IResolvable;

    /**
     * A structure for the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-permissions.html#cfn-lakeformation-permissions-resource
     */
    public resource: CfnPermissions.ResourceProperty | cdk.IResolvable;

    /**
     * The permissions granted or revoked.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-permissions.html#cfn-lakeformation-permissions-permissions
     */
    public permissions: string[] | undefined;

    /**
     * Indicates the ability to grant permissions (as a subset of permissions granted).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-permissions.html#cfn-lakeformation-permissions-permissionswithgrantoption
     */
    public permissionsWithGrantOption: string[] | undefined;

    /**
     * Create a new `AWS::LakeFormation::Permissions`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPermissionsProps) {
        super(scope, id, { type: CfnPermissions.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'dataLakePrincipal', this);
        cdk.requireProperty(props, 'resource', this);

        this.dataLakePrincipal = props.dataLakePrincipal;
        this.resource = props.resource;
        this.permissions = props.permissions;
        this.permissionsWithGrantOption = props.permissionsWithGrantOption;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPermissions.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            dataLakePrincipal: this.dataLakePrincipal,
            resource: this.resource,
            permissions: this.permissions,
            permissionsWithGrantOption: this.permissionsWithGrantOption,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPermissionsPropsToCloudFormation(props);
    }
}

export namespace CfnPermissions {
    /**
     * A wildcard object, consisting of an optional list of excluded column names or indexes.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-columnwildcard.html
     */
    export interface ColumnWildcardProperty {
        /**
         * Excludes column names. Any column with this name will be excluded.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-columnwildcard.html#cfn-lakeformation-permissions-columnwildcard-excludedcolumnnames
         */
        readonly excludedColumnNames?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `ColumnWildcardProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnWildcardProperty`
 *
 * @returns the result of the validation.
 */
function CfnPermissions_ColumnWildcardPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('excludedColumnNames', cdk.listValidator(cdk.validateString))(properties.excludedColumnNames));
    return errors.wrap('supplied properties not correct for "ColumnWildcardProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::Permissions.ColumnWildcard` resource
 *
 * @param properties - the TypeScript properties of a `ColumnWildcardProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::Permissions.ColumnWildcard` resource.
 */
// @ts-ignore TS6133
function cfnPermissionsColumnWildcardPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPermissions_ColumnWildcardPropertyValidator(properties).assertSuccess();
    return {
        ExcludedColumnNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.excludedColumnNames),
    };
}

// @ts-ignore TS6133
function CfnPermissionsColumnWildcardPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPermissions.ColumnWildcardProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissions.ColumnWildcardProperty>();
    ret.addPropertyResult('excludedColumnNames', 'ExcludedColumnNames', properties.ExcludedColumnNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ExcludedColumnNames) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPermissions {
    /**
     * The Lake Formation principal.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-datalakeprincipal.html
     */
    export interface DataLakePrincipalProperty {
        /**
         * An identifier for the Lake Formation principal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-datalakeprincipal.html#cfn-lakeformation-permissions-datalakeprincipal-datalakeprincipalidentifier
         */
        readonly dataLakePrincipalIdentifier?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DataLakePrincipalProperty`
 *
 * @param properties - the TypeScript properties of a `DataLakePrincipalProperty`
 *
 * @returns the result of the validation.
 */
function CfnPermissions_DataLakePrincipalPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataLakePrincipalIdentifier', cdk.validateString)(properties.dataLakePrincipalIdentifier));
    return errors.wrap('supplied properties not correct for "DataLakePrincipalProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::Permissions.DataLakePrincipal` resource
 *
 * @param properties - the TypeScript properties of a `DataLakePrincipalProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::Permissions.DataLakePrincipal` resource.
 */
// @ts-ignore TS6133
function cfnPermissionsDataLakePrincipalPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPermissions_DataLakePrincipalPropertyValidator(properties).assertSuccess();
    return {
        DataLakePrincipalIdentifier: cdk.stringToCloudFormation(properties.dataLakePrincipalIdentifier),
    };
}

// @ts-ignore TS6133
function CfnPermissionsDataLakePrincipalPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPermissions.DataLakePrincipalProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissions.DataLakePrincipalProperty>();
    ret.addPropertyResult('dataLakePrincipalIdentifier', 'DataLakePrincipalIdentifier', properties.DataLakePrincipalIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DataLakePrincipalIdentifier) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPermissions {
    /**
     * A structure for a data location object where permissions are granted or revoked.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-datalocationresource.html
     */
    export interface DataLocationResourceProperty {
        /**
         * The identifier for the Data Catalog . By default, it is the account ID of the caller.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-datalocationresource.html#cfn-lakeformation-permissions-datalocationresource-catalogid
         */
        readonly catalogId?: string;
        /**
         * The Amazon Resource Name (ARN) that uniquely identifies the data location resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-datalocationresource.html#cfn-lakeformation-permissions-datalocationresource-s3resource
         */
        readonly s3Resource?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DataLocationResourceProperty`
 *
 * @param properties - the TypeScript properties of a `DataLocationResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnPermissions_DataLocationResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('catalogId', cdk.validateString)(properties.catalogId));
    errors.collect(cdk.propertyValidator('s3Resource', cdk.validateString)(properties.s3Resource));
    return errors.wrap('supplied properties not correct for "DataLocationResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::Permissions.DataLocationResource` resource
 *
 * @param properties - the TypeScript properties of a `DataLocationResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::Permissions.DataLocationResource` resource.
 */
// @ts-ignore TS6133
function cfnPermissionsDataLocationResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPermissions_DataLocationResourcePropertyValidator(properties).assertSuccess();
    return {
        CatalogId: cdk.stringToCloudFormation(properties.catalogId),
        S3Resource: cdk.stringToCloudFormation(properties.s3Resource),
    };
}

// @ts-ignore TS6133
function CfnPermissionsDataLocationResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPermissions.DataLocationResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissions.DataLocationResourceProperty>();
    ret.addPropertyResult('catalogId', 'CatalogId', properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined);
    ret.addPropertyResult('s3Resource', 'S3Resource', properties.S3Resource != null ? cfn_parse.FromCloudFormation.getString(properties.S3Resource) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPermissions {
    /**
     * A structure for the database object.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-databaseresource.html
     */
    export interface DatabaseResourceProperty {
        /**
         * The identifier for the Data Catalog . By default, it is the account ID of the caller.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-databaseresource.html#cfn-lakeformation-permissions-databaseresource-catalogid
         */
        readonly catalogId?: string;
        /**
         * The name of the database resource. Unique to the Data Catalog.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-databaseresource.html#cfn-lakeformation-permissions-databaseresource-name
         */
        readonly name?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DatabaseResourceProperty`
 *
 * @param properties - the TypeScript properties of a `DatabaseResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnPermissions_DatabaseResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('catalogId', cdk.validateString)(properties.catalogId));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "DatabaseResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::Permissions.DatabaseResource` resource
 *
 * @param properties - the TypeScript properties of a `DatabaseResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::Permissions.DatabaseResource` resource.
 */
// @ts-ignore TS6133
function cfnPermissionsDatabaseResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPermissions_DatabaseResourcePropertyValidator(properties).assertSuccess();
    return {
        CatalogId: cdk.stringToCloudFormation(properties.catalogId),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnPermissionsDatabaseResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPermissions.DatabaseResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissions.DatabaseResourceProperty>();
    ret.addPropertyResult('catalogId', 'CatalogId', properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPermissions {
    /**
     * A structure for the resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-resource.html
     */
    export interface ResourceProperty {
        /**
         * A structure for a data location object where permissions are granted or revoked.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-resource.html#cfn-lakeformation-permissions-resource-datalocationresource
         */
        readonly dataLocationResource?: CfnPermissions.DataLocationResourceProperty | cdk.IResolvable;
        /**
         * A structure for the database object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-resource.html#cfn-lakeformation-permissions-resource-databaseresource
         */
        readonly databaseResource?: CfnPermissions.DatabaseResourceProperty | cdk.IResolvable;
        /**
         * A structure for the table object. A table is a metadata definition that represents your data. You can Grant and Revoke table privileges to a principal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-resource.html#cfn-lakeformation-permissions-resource-tableresource
         */
        readonly tableResource?: CfnPermissions.TableResourceProperty | cdk.IResolvable;
        /**
         * A structure for a table with columns object. This object is only used when granting a SELECT permission.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-resource.html#cfn-lakeformation-permissions-resource-tablewithcolumnsresource
         */
        readonly tableWithColumnsResource?: CfnPermissions.TableWithColumnsResourceProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ResourceProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnPermissions_ResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataLocationResource', CfnPermissions_DataLocationResourcePropertyValidator)(properties.dataLocationResource));
    errors.collect(cdk.propertyValidator('databaseResource', CfnPermissions_DatabaseResourcePropertyValidator)(properties.databaseResource));
    errors.collect(cdk.propertyValidator('tableResource', CfnPermissions_TableResourcePropertyValidator)(properties.tableResource));
    errors.collect(cdk.propertyValidator('tableWithColumnsResource', CfnPermissions_TableWithColumnsResourcePropertyValidator)(properties.tableWithColumnsResource));
    return errors.wrap('supplied properties not correct for "ResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::Permissions.Resource` resource
 *
 * @param properties - the TypeScript properties of a `ResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::Permissions.Resource` resource.
 */
// @ts-ignore TS6133
function cfnPermissionsResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPermissions_ResourcePropertyValidator(properties).assertSuccess();
    return {
        DataLocationResource: cfnPermissionsDataLocationResourcePropertyToCloudFormation(properties.dataLocationResource),
        DatabaseResource: cfnPermissionsDatabaseResourcePropertyToCloudFormation(properties.databaseResource),
        TableResource: cfnPermissionsTableResourcePropertyToCloudFormation(properties.tableResource),
        TableWithColumnsResource: cfnPermissionsTableWithColumnsResourcePropertyToCloudFormation(properties.tableWithColumnsResource),
    };
}

// @ts-ignore TS6133
function CfnPermissionsResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPermissions.ResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissions.ResourceProperty>();
    ret.addPropertyResult('dataLocationResource', 'DataLocationResource', properties.DataLocationResource != null ? CfnPermissionsDataLocationResourcePropertyFromCloudFormation(properties.DataLocationResource) : undefined);
    ret.addPropertyResult('databaseResource', 'DatabaseResource', properties.DatabaseResource != null ? CfnPermissionsDatabaseResourcePropertyFromCloudFormation(properties.DatabaseResource) : undefined);
    ret.addPropertyResult('tableResource', 'TableResource', properties.TableResource != null ? CfnPermissionsTableResourcePropertyFromCloudFormation(properties.TableResource) : undefined);
    ret.addPropertyResult('tableWithColumnsResource', 'TableWithColumnsResource', properties.TableWithColumnsResource != null ? CfnPermissionsTableWithColumnsResourcePropertyFromCloudFormation(properties.TableWithColumnsResource) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPermissions {
    /**
     * A structure for the table object. A table is a metadata definition that represents your data. You can Grant and Revoke table privileges to a principal.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tableresource.html
     */
    export interface TableResourceProperty {
        /**
         * The identifier for the Data Catalog . By default, it is the account ID of the caller.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tableresource.html#cfn-lakeformation-permissions-tableresource-catalogid
         */
        readonly catalogId?: string;
        /**
         * The name of the database for the table. Unique to a Data Catalog. A database is a set of associated table definitions organized into a logical group. You can Grant and Revoke database privileges to a principal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tableresource.html#cfn-lakeformation-permissions-tableresource-databasename
         */
        readonly databaseName?: string;
        /**
         * The name of the table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tableresource.html#cfn-lakeformation-permissions-tableresource-name
         */
        readonly name?: string;
        /**
         * An empty object representing all tables under a database. If this field is specified instead of the `Name` field, all tables under `DatabaseName` will have permission changes applied.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tableresource.html#cfn-lakeformation-permissions-tableresource-tablewildcard
         */
        readonly tableWildcard?: CfnPermissions.TableWildcardProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TableResourceProperty`
 *
 * @param properties - the TypeScript properties of a `TableResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnPermissions_TableResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('catalogId', cdk.validateString)(properties.catalogId));
    errors.collect(cdk.propertyValidator('databaseName', cdk.validateString)(properties.databaseName));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tableWildcard', CfnPermissions_TableWildcardPropertyValidator)(properties.tableWildcard));
    return errors.wrap('supplied properties not correct for "TableResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::Permissions.TableResource` resource
 *
 * @param properties - the TypeScript properties of a `TableResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::Permissions.TableResource` resource.
 */
// @ts-ignore TS6133
function cfnPermissionsTableResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPermissions_TableResourcePropertyValidator(properties).assertSuccess();
    return {
        CatalogId: cdk.stringToCloudFormation(properties.catalogId),
        DatabaseName: cdk.stringToCloudFormation(properties.databaseName),
        Name: cdk.stringToCloudFormation(properties.name),
        TableWildcard: cfnPermissionsTableWildcardPropertyToCloudFormation(properties.tableWildcard),
    };
}

// @ts-ignore TS6133
function CfnPermissionsTableResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPermissions.TableResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissions.TableResourceProperty>();
    ret.addPropertyResult('catalogId', 'CatalogId', properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined);
    ret.addPropertyResult('databaseName', 'DatabaseName', properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tableWildcard', 'TableWildcard', properties.TableWildcard != null ? CfnPermissionsTableWildcardPropertyFromCloudFormation(properties.TableWildcard) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPermissions {
    /**
     * A wildcard object representing every table under a database.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tablewildcard.html
     */
    export interface TableWildcardProperty {
    }
}

/**
 * Determine whether the given properties match those of a `TableWildcardProperty`
 *
 * @param properties - the TypeScript properties of a `TableWildcardProperty`
 *
 * @returns the result of the validation.
 */
function CfnPermissions_TableWildcardPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    return errors.wrap('supplied properties not correct for "TableWildcardProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::Permissions.TableWildcard` resource
 *
 * @param properties - the TypeScript properties of a `TableWildcardProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::Permissions.TableWildcard` resource.
 */
// @ts-ignore TS6133
function cfnPermissionsTableWildcardPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPermissions_TableWildcardPropertyValidator(properties).assertSuccess();
    return {
    };
}

// @ts-ignore TS6133
function CfnPermissionsTableWildcardPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPermissions.TableWildcardProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissions.TableWildcardProperty>();
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPermissions {
    /**
     * A structure for a table with columns object. This object is only used when granting a SELECT permission.
     *
     * This object must take a value for at least one of `ColumnsNames` , `ColumnsIndexes` , or `ColumnsWildcard` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tablewithcolumnsresource.html
     */
    export interface TableWithColumnsResourceProperty {
        /**
         * The identifier for the Data Catalog . By default, it is the account ID of the caller.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tablewithcolumnsresource.html#cfn-lakeformation-permissions-tablewithcolumnsresource-catalogid
         */
        readonly catalogId?: string;
        /**
         * The list of column names for the table. At least one of `ColumnNames` or `ColumnWildcard` is required.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tablewithcolumnsresource.html#cfn-lakeformation-permissions-tablewithcolumnsresource-columnnames
         */
        readonly columnNames?: string[];
        /**
         * A wildcard specified by a `ColumnWildcard` object. At least one of `ColumnNames` or `ColumnWildcard` is required.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tablewithcolumnsresource.html#cfn-lakeformation-permissions-tablewithcolumnsresource-columnwildcard
         */
        readonly columnWildcard?: CfnPermissions.ColumnWildcardProperty | cdk.IResolvable;
        /**
         * The name of the database for the table with columns resource. Unique to the Data Catalog. A database is a set of associated table definitions organized into a logical group. You can Grant and Revoke database privileges to a principal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tablewithcolumnsresource.html#cfn-lakeformation-permissions-tablewithcolumnsresource-databasename
         */
        readonly databaseName?: string;
        /**
         * The name of the table resource. A table is a metadata definition that represents your data. You can Grant and Revoke table privileges to a principal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tablewithcolumnsresource.html#cfn-lakeformation-permissions-tablewithcolumnsresource-name
         */
        readonly name?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TableWithColumnsResourceProperty`
 *
 * @param properties - the TypeScript properties of a `TableWithColumnsResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnPermissions_TableWithColumnsResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('catalogId', cdk.validateString)(properties.catalogId));
    errors.collect(cdk.propertyValidator('columnNames', cdk.listValidator(cdk.validateString))(properties.columnNames));
    errors.collect(cdk.propertyValidator('columnWildcard', CfnPermissions_ColumnWildcardPropertyValidator)(properties.columnWildcard));
    errors.collect(cdk.propertyValidator('databaseName', cdk.validateString)(properties.databaseName));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "TableWithColumnsResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::Permissions.TableWithColumnsResource` resource
 *
 * @param properties - the TypeScript properties of a `TableWithColumnsResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::Permissions.TableWithColumnsResource` resource.
 */
// @ts-ignore TS6133
function cfnPermissionsTableWithColumnsResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPermissions_TableWithColumnsResourcePropertyValidator(properties).assertSuccess();
    return {
        CatalogId: cdk.stringToCloudFormation(properties.catalogId),
        ColumnNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.columnNames),
        ColumnWildcard: cfnPermissionsColumnWildcardPropertyToCloudFormation(properties.columnWildcard),
        DatabaseName: cdk.stringToCloudFormation(properties.databaseName),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnPermissionsTableWithColumnsResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPermissions.TableWithColumnsResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissions.TableWithColumnsResourceProperty>();
    ret.addPropertyResult('catalogId', 'CatalogId', properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined);
    ret.addPropertyResult('columnNames', 'ColumnNames', properties.ColumnNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ColumnNames) : undefined);
    ret.addPropertyResult('columnWildcard', 'ColumnWildcard', properties.ColumnWildcard != null ? CfnPermissionsColumnWildcardPropertyFromCloudFormation(properties.ColumnWildcard) : undefined);
    ret.addPropertyResult('databaseName', 'DatabaseName', properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnPrincipalPermissions`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-principalpermissions.html
 */
export interface CfnPrincipalPermissionsProps {

    /**
     * The permissions granted or revoked.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-principalpermissions.html#cfn-lakeformation-principalpermissions-permissions
     */
    readonly permissions: string[];

    /**
     * Indicates the ability to grant permissions (as a subset of permissions granted).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-principalpermissions.html#cfn-lakeformation-principalpermissions-permissionswithgrantoption
     */
    readonly permissionsWithGrantOption: string[];

    /**
     * The principal to be granted a permission.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-principalpermissions.html#cfn-lakeformation-principalpermissions-principal
     */
    readonly principal: CfnPrincipalPermissions.DataLakePrincipalProperty | cdk.IResolvable;

    /**
     * The resource to be granted or revoked permissions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-principalpermissions.html#cfn-lakeformation-principalpermissions-resource
     */
    readonly resource: CfnPrincipalPermissions.ResourceProperty | cdk.IResolvable;

    /**
     * The identifier for the Data Catalog . By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-principalpermissions.html#cfn-lakeformation-principalpermissions-catalog
     */
    readonly catalog?: string;
}

/**
 * Determine whether the given properties match those of a `CfnPrincipalPermissionsProps`
 *
 * @param properties - the TypeScript properties of a `CfnPrincipalPermissionsProps`
 *
 * @returns the result of the validation.
 */
function CfnPrincipalPermissionsPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('catalog', cdk.validateString)(properties.catalog));
    errors.collect(cdk.propertyValidator('permissions', cdk.requiredValidator)(properties.permissions));
    errors.collect(cdk.propertyValidator('permissions', cdk.listValidator(cdk.validateString))(properties.permissions));
    errors.collect(cdk.propertyValidator('permissionsWithGrantOption', cdk.requiredValidator)(properties.permissionsWithGrantOption));
    errors.collect(cdk.propertyValidator('permissionsWithGrantOption', cdk.listValidator(cdk.validateString))(properties.permissionsWithGrantOption));
    errors.collect(cdk.propertyValidator('principal', cdk.requiredValidator)(properties.principal));
    errors.collect(cdk.propertyValidator('principal', CfnPrincipalPermissions_DataLakePrincipalPropertyValidator)(properties.principal));
    errors.collect(cdk.propertyValidator('resource', cdk.requiredValidator)(properties.resource));
    errors.collect(cdk.propertyValidator('resource', CfnPrincipalPermissions_ResourcePropertyValidator)(properties.resource));
    return errors.wrap('supplied properties not correct for "CfnPrincipalPermissionsProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions` resource
 *
 * @param properties - the TypeScript properties of a `CfnPrincipalPermissionsProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions` resource.
 */
// @ts-ignore TS6133
function cfnPrincipalPermissionsPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPrincipalPermissionsPropsValidator(properties).assertSuccess();
    return {
        Permissions: cdk.listMapper(cdk.stringToCloudFormation)(properties.permissions),
        PermissionsWithGrantOption: cdk.listMapper(cdk.stringToCloudFormation)(properties.permissionsWithGrantOption),
        Principal: cfnPrincipalPermissionsDataLakePrincipalPropertyToCloudFormation(properties.principal),
        Resource: cfnPrincipalPermissionsResourcePropertyToCloudFormation(properties.resource),
        Catalog: cdk.stringToCloudFormation(properties.catalog),
    };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPrincipalPermissionsProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissionsProps>();
    ret.addPropertyResult('permissions', 'Permissions', cfn_parse.FromCloudFormation.getStringArray(properties.Permissions));
    ret.addPropertyResult('permissionsWithGrantOption', 'PermissionsWithGrantOption', cfn_parse.FromCloudFormation.getStringArray(properties.PermissionsWithGrantOption));
    ret.addPropertyResult('principal', 'Principal', CfnPrincipalPermissionsDataLakePrincipalPropertyFromCloudFormation(properties.Principal));
    ret.addPropertyResult('resource', 'Resource', CfnPrincipalPermissionsResourcePropertyFromCloudFormation(properties.Resource));
    ret.addPropertyResult('catalog', 'Catalog', properties.Catalog != null ? cfn_parse.FromCloudFormation.getString(properties.Catalog) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::LakeFormation::PrincipalPermissions`
 *
 * The `AWS::LakeFormation::PrincipalPermissions` resource represents the permissions that a principal has on a Data Catalog resource (such as AWS Glue databases or AWS Glue tables). When you create a `PrincipalPermissions` resource, the permissions are granted via the AWS Lake Formation `GrantPermissions` API operation. When you delete a `PrincipalPermissions` resource, the permissions on principal-resource pair are revoked via the AWS Lake Formation `RevokePermissions` API operation.
 *
 * @cloudformationResource AWS::LakeFormation::PrincipalPermissions
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-principalpermissions.html
 */
export class CfnPrincipalPermissions extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::LakeFormation::PrincipalPermissions";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPrincipalPermissions {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPrincipalPermissionsPropsFromCloudFormation(resourceProperties);
        const ret = new CfnPrincipalPermissions(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Json encoding of the input principal. For example: `{"DataLakePrincipalIdentifier":"arn:aws:iam::123456789012:role/ExampleRole"}`
     * @cloudformationAttribute PrincipalIdentifier
     */
    public readonly attrPrincipalIdentifier: string;

    /**
     * Json encoding of the input resource. For example: `{"Catalog":null,"Database":null,"Table":null,"TableWithColumns":null,"DataLocation":null,"DataCellsFilter":{"TableCatalogId":"123456789012","DatabaseName":"ExampleDatabase","TableName":"ExampleTable","Name":"ExampleFilter"},"LFTag":null,"LFTagPolicy":null}`
     * @cloudformationAttribute ResourceIdentifier
     */
    public readonly attrResourceIdentifier: string;

    /**
     * The permissions granted or revoked.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-principalpermissions.html#cfn-lakeformation-principalpermissions-permissions
     */
    public permissions: string[];

    /**
     * Indicates the ability to grant permissions (as a subset of permissions granted).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-principalpermissions.html#cfn-lakeformation-principalpermissions-permissionswithgrantoption
     */
    public permissionsWithGrantOption: string[];

    /**
     * The principal to be granted a permission.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-principalpermissions.html#cfn-lakeformation-principalpermissions-principal
     */
    public principal: CfnPrincipalPermissions.DataLakePrincipalProperty | cdk.IResolvable;

    /**
     * The resource to be granted or revoked permissions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-principalpermissions.html#cfn-lakeformation-principalpermissions-resource
     */
    public resource: CfnPrincipalPermissions.ResourceProperty | cdk.IResolvable;

    /**
     * The identifier for the Data Catalog . By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-principalpermissions.html#cfn-lakeformation-principalpermissions-catalog
     */
    public catalog: string | undefined;

    /**
     * Create a new `AWS::LakeFormation::PrincipalPermissions`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPrincipalPermissionsProps) {
        super(scope, id, { type: CfnPrincipalPermissions.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'permissions', this);
        cdk.requireProperty(props, 'permissionsWithGrantOption', this);
        cdk.requireProperty(props, 'principal', this);
        cdk.requireProperty(props, 'resource', this);
        this.attrPrincipalIdentifier = cdk.Token.asString(this.getAtt('PrincipalIdentifier', cdk.ResolutionTypeHint.STRING));
        this.attrResourceIdentifier = cdk.Token.asString(this.getAtt('ResourceIdentifier', cdk.ResolutionTypeHint.STRING));

        this.permissions = props.permissions;
        this.permissionsWithGrantOption = props.permissionsWithGrantOption;
        this.principal = props.principal;
        this.resource = props.resource;
        this.catalog = props.catalog;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPrincipalPermissions.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            permissions: this.permissions,
            permissionsWithGrantOption: this.permissionsWithGrantOption,
            principal: this.principal,
            resource: this.resource,
            catalog: this.catalog,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPrincipalPermissionsPropsToCloudFormation(props);
    }
}

export namespace CfnPrincipalPermissions {
    /**
     * A wildcard object, consisting of an optional list of excluded column names or indexes.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-columnwildcard.html
     */
    export interface ColumnWildcardProperty {
        /**
         * Excludes column names. Any column with this name will be excluded.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-columnwildcard.html#cfn-lakeformation-principalpermissions-columnwildcard-excludedcolumnnames
         */
        readonly excludedColumnNames?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `ColumnWildcardProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnWildcardProperty`
 *
 * @returns the result of the validation.
 */
function CfnPrincipalPermissions_ColumnWildcardPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('excludedColumnNames', cdk.listValidator(cdk.validateString))(properties.excludedColumnNames));
    return errors.wrap('supplied properties not correct for "ColumnWildcardProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions.ColumnWildcard` resource
 *
 * @param properties - the TypeScript properties of a `ColumnWildcardProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions.ColumnWildcard` resource.
 */
// @ts-ignore TS6133
function cfnPrincipalPermissionsColumnWildcardPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPrincipalPermissions_ColumnWildcardPropertyValidator(properties).assertSuccess();
    return {
        ExcludedColumnNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.excludedColumnNames),
    };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsColumnWildcardPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPrincipalPermissions.ColumnWildcardProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissions.ColumnWildcardProperty>();
    ret.addPropertyResult('excludedColumnNames', 'ExcludedColumnNames', properties.ExcludedColumnNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ExcludedColumnNames) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPrincipalPermissions {
    /**
     * A structure that describes certain columns on certain rows.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-datacellsfilterresource.html
     */
    export interface DataCellsFilterResourceProperty {
        /**
         * A database in the Data Catalog .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-datacellsfilterresource.html#cfn-lakeformation-principalpermissions-datacellsfilterresource-databasename
         */
        readonly databaseName: string;
        /**
         * The name given by the user to the data filter cell.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-datacellsfilterresource.html#cfn-lakeformation-principalpermissions-datacellsfilterresource-name
         */
        readonly name: string;
        /**
         * The ID of the catalog to which the table belongs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-datacellsfilterresource.html#cfn-lakeformation-principalpermissions-datacellsfilterresource-tablecatalogid
         */
        readonly tableCatalogId: string;
        /**
         * The name of the table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-datacellsfilterresource.html#cfn-lakeformation-principalpermissions-datacellsfilterresource-tablename
         */
        readonly tableName: string;
    }
}

/**
 * Determine whether the given properties match those of a `DataCellsFilterResourceProperty`
 *
 * @param properties - the TypeScript properties of a `DataCellsFilterResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnPrincipalPermissions_DataCellsFilterResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('databaseName', cdk.requiredValidator)(properties.databaseName));
    errors.collect(cdk.propertyValidator('databaseName', cdk.validateString)(properties.databaseName));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tableCatalogId', cdk.requiredValidator)(properties.tableCatalogId));
    errors.collect(cdk.propertyValidator('tableCatalogId', cdk.validateString)(properties.tableCatalogId));
    errors.collect(cdk.propertyValidator('tableName', cdk.requiredValidator)(properties.tableName));
    errors.collect(cdk.propertyValidator('tableName', cdk.validateString)(properties.tableName));
    return errors.wrap('supplied properties not correct for "DataCellsFilterResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions.DataCellsFilterResource` resource
 *
 * @param properties - the TypeScript properties of a `DataCellsFilterResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions.DataCellsFilterResource` resource.
 */
// @ts-ignore TS6133
function cfnPrincipalPermissionsDataCellsFilterResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPrincipalPermissions_DataCellsFilterResourcePropertyValidator(properties).assertSuccess();
    return {
        DatabaseName: cdk.stringToCloudFormation(properties.databaseName),
        Name: cdk.stringToCloudFormation(properties.name),
        TableCatalogId: cdk.stringToCloudFormation(properties.tableCatalogId),
        TableName: cdk.stringToCloudFormation(properties.tableName),
    };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsDataCellsFilterResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPrincipalPermissions.DataCellsFilterResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissions.DataCellsFilterResourceProperty>();
    ret.addPropertyResult('databaseName', 'DatabaseName', cfn_parse.FromCloudFormation.getString(properties.DatabaseName));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('tableCatalogId', 'TableCatalogId', cfn_parse.FromCloudFormation.getString(properties.TableCatalogId));
    ret.addPropertyResult('tableName', 'TableName', cfn_parse.FromCloudFormation.getString(properties.TableName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPrincipalPermissions {
    /**
     * The AWS Lake Formation principal.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-datalakeprincipal.html
     */
    export interface DataLakePrincipalProperty {
        /**
         * An identifier for the AWS Lake Formation principal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-datalakeprincipal.html#cfn-lakeformation-principalpermissions-datalakeprincipal-datalakeprincipalidentifier
         */
        readonly dataLakePrincipalIdentifier?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DataLakePrincipalProperty`
 *
 * @param properties - the TypeScript properties of a `DataLakePrincipalProperty`
 *
 * @returns the result of the validation.
 */
function CfnPrincipalPermissions_DataLakePrincipalPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataLakePrincipalIdentifier', cdk.validateString)(properties.dataLakePrincipalIdentifier));
    return errors.wrap('supplied properties not correct for "DataLakePrincipalProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions.DataLakePrincipal` resource
 *
 * @param properties - the TypeScript properties of a `DataLakePrincipalProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions.DataLakePrincipal` resource.
 */
// @ts-ignore TS6133
function cfnPrincipalPermissionsDataLakePrincipalPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPrincipalPermissions_DataLakePrincipalPropertyValidator(properties).assertSuccess();
    return {
        DataLakePrincipalIdentifier: cdk.stringToCloudFormation(properties.dataLakePrincipalIdentifier),
    };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsDataLakePrincipalPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPrincipalPermissions.DataLakePrincipalProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissions.DataLakePrincipalProperty>();
    ret.addPropertyResult('dataLakePrincipalIdentifier', 'DataLakePrincipalIdentifier', properties.DataLakePrincipalIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DataLakePrincipalIdentifier) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPrincipalPermissions {
    /**
     * A structure for a data location object where permissions are granted or revoked.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-datalocationresource.html
     */
    export interface DataLocationResourceProperty {
        /**
         * The identifier for the Data Catalog where the location is registered with AWS Lake Formation .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-datalocationresource.html#cfn-lakeformation-principalpermissions-datalocationresource-catalogid
         */
        readonly catalogId: string;
        /**
         * The Amazon Resource Name (ARN) that uniquely identifies the data location resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-datalocationresource.html#cfn-lakeformation-principalpermissions-datalocationresource-resourcearn
         */
        readonly resourceArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `DataLocationResourceProperty`
 *
 * @param properties - the TypeScript properties of a `DataLocationResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnPrincipalPermissions_DataLocationResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('catalogId', cdk.requiredValidator)(properties.catalogId));
    errors.collect(cdk.propertyValidator('catalogId', cdk.validateString)(properties.catalogId));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.requiredValidator)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    return errors.wrap('supplied properties not correct for "DataLocationResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions.DataLocationResource` resource
 *
 * @param properties - the TypeScript properties of a `DataLocationResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions.DataLocationResource` resource.
 */
// @ts-ignore TS6133
function cfnPrincipalPermissionsDataLocationResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPrincipalPermissions_DataLocationResourcePropertyValidator(properties).assertSuccess();
    return {
        CatalogId: cdk.stringToCloudFormation(properties.catalogId),
        ResourceArn: cdk.stringToCloudFormation(properties.resourceArn),
    };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsDataLocationResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPrincipalPermissions.DataLocationResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissions.DataLocationResourceProperty>();
    ret.addPropertyResult('catalogId', 'CatalogId', cfn_parse.FromCloudFormation.getString(properties.CatalogId));
    ret.addPropertyResult('resourceArn', 'ResourceArn', cfn_parse.FromCloudFormation.getString(properties.ResourceArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPrincipalPermissions {
    /**
     * A structure for the database object.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-databaseresource.html
     */
    export interface DatabaseResourceProperty {
        /**
         * The identifier for the Data Catalog. By default, it is the account ID of the caller.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-databaseresource.html#cfn-lakeformation-principalpermissions-databaseresource-catalogid
         */
        readonly catalogId: string;
        /**
         * The name of the database resource. Unique to the Data Catalog.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-databaseresource.html#cfn-lakeformation-principalpermissions-databaseresource-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `DatabaseResourceProperty`
 *
 * @param properties - the TypeScript properties of a `DatabaseResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnPrincipalPermissions_DatabaseResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('catalogId', cdk.requiredValidator)(properties.catalogId));
    errors.collect(cdk.propertyValidator('catalogId', cdk.validateString)(properties.catalogId));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "DatabaseResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions.DatabaseResource` resource
 *
 * @param properties - the TypeScript properties of a `DatabaseResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions.DatabaseResource` resource.
 */
// @ts-ignore TS6133
function cfnPrincipalPermissionsDatabaseResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPrincipalPermissions_DatabaseResourcePropertyValidator(properties).assertSuccess();
    return {
        CatalogId: cdk.stringToCloudFormation(properties.catalogId),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsDatabaseResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPrincipalPermissions.DatabaseResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissions.DatabaseResourceProperty>();
    ret.addPropertyResult('catalogId', 'CatalogId', cfn_parse.FromCloudFormation.getString(properties.CatalogId));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPrincipalPermissions {
    /**
     * The LF-tag key and values attached to a resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-lftag.html
     */
    export interface LFTagProperty {
        /**
         * The key-name for the LF-tag.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-lftag.html#cfn-lakeformation-principalpermissions-lftag-tagkey
         */
        readonly tagKey?: string;
        /**
         * A list of possible values of the corresponding `TagKey` of an LF-tag key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-lftag.html#cfn-lakeformation-principalpermissions-lftag-tagvalues
         */
        readonly tagValues?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `LFTagProperty`
 *
 * @param properties - the TypeScript properties of a `LFTagProperty`
 *
 * @returns the result of the validation.
 */
function CfnPrincipalPermissions_LFTagPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('tagKey', cdk.validateString)(properties.tagKey));
    errors.collect(cdk.propertyValidator('tagValues', cdk.listValidator(cdk.validateString))(properties.tagValues));
    return errors.wrap('supplied properties not correct for "LFTagProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions.LFTag` resource
 *
 * @param properties - the TypeScript properties of a `LFTagProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions.LFTag` resource.
 */
// @ts-ignore TS6133
function cfnPrincipalPermissionsLFTagPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPrincipalPermissions_LFTagPropertyValidator(properties).assertSuccess();
    return {
        TagKey: cdk.stringToCloudFormation(properties.tagKey),
        TagValues: cdk.listMapper(cdk.stringToCloudFormation)(properties.tagValues),
    };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsLFTagPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPrincipalPermissions.LFTagProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissions.LFTagProperty>();
    ret.addPropertyResult('tagKey', 'TagKey', properties.TagKey != null ? cfn_parse.FromCloudFormation.getString(properties.TagKey) : undefined);
    ret.addPropertyResult('tagValues', 'TagValues', properties.TagValues != null ? cfn_parse.FromCloudFormation.getStringArray(properties.TagValues) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPrincipalPermissions {
    /**
     * A structure containing an LF-tag key and values for a resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-lftagkeyresource.html
     */
    export interface LFTagKeyResourceProperty {
        /**
         * The identifier for the Data Catalog where the location is registered with Data Catalog .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-lftagkeyresource.html#cfn-lakeformation-principalpermissions-lftagkeyresource-catalogid
         */
        readonly catalogId: string;
        /**
         * The key-name for the LF-tag.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-lftagkeyresource.html#cfn-lakeformation-principalpermissions-lftagkeyresource-tagkey
         */
        readonly tagKey: string;
        /**
         * A list of possible values for the corresponding `TagKey` of an LF-tag key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-lftagkeyresource.html#cfn-lakeformation-principalpermissions-lftagkeyresource-tagvalues
         */
        readonly tagValues: string[];
    }
}

/**
 * Determine whether the given properties match those of a `LFTagKeyResourceProperty`
 *
 * @param properties - the TypeScript properties of a `LFTagKeyResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnPrincipalPermissions_LFTagKeyResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('catalogId', cdk.requiredValidator)(properties.catalogId));
    errors.collect(cdk.propertyValidator('catalogId', cdk.validateString)(properties.catalogId));
    errors.collect(cdk.propertyValidator('tagKey', cdk.requiredValidator)(properties.tagKey));
    errors.collect(cdk.propertyValidator('tagKey', cdk.validateString)(properties.tagKey));
    errors.collect(cdk.propertyValidator('tagValues', cdk.requiredValidator)(properties.tagValues));
    errors.collect(cdk.propertyValidator('tagValues', cdk.listValidator(cdk.validateString))(properties.tagValues));
    return errors.wrap('supplied properties not correct for "LFTagKeyResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions.LFTagKeyResource` resource
 *
 * @param properties - the TypeScript properties of a `LFTagKeyResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions.LFTagKeyResource` resource.
 */
// @ts-ignore TS6133
function cfnPrincipalPermissionsLFTagKeyResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPrincipalPermissions_LFTagKeyResourcePropertyValidator(properties).assertSuccess();
    return {
        CatalogId: cdk.stringToCloudFormation(properties.catalogId),
        TagKey: cdk.stringToCloudFormation(properties.tagKey),
        TagValues: cdk.listMapper(cdk.stringToCloudFormation)(properties.tagValues),
    };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsLFTagKeyResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPrincipalPermissions.LFTagKeyResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissions.LFTagKeyResourceProperty>();
    ret.addPropertyResult('catalogId', 'CatalogId', cfn_parse.FromCloudFormation.getString(properties.CatalogId));
    ret.addPropertyResult('tagKey', 'TagKey', cfn_parse.FromCloudFormation.getString(properties.TagKey));
    ret.addPropertyResult('tagValues', 'TagValues', cfn_parse.FromCloudFormation.getStringArray(properties.TagValues));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPrincipalPermissions {
    /**
     * A list of LF-tag conditions that define a resource's LF-tag policy.
     *
     * A structure that allows an admin to grant user permissions on certain conditions. For example, granting a role access to all columns that do not have the LF-tag 'PII' in tables that have the LF-tag 'Prod'.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-lftagpolicyresource.html
     */
    export interface LFTagPolicyResourceProperty {
        /**
         * The identifier for the Data Catalog . The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your AWS Lake Formation environment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-lftagpolicyresource.html#cfn-lakeformation-principalpermissions-lftagpolicyresource-catalogid
         */
        readonly catalogId: string;
        /**
         * A list of LF-tag conditions that apply to the resource's LF-tag policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-lftagpolicyresource.html#cfn-lakeformation-principalpermissions-lftagpolicyresource-expression
         */
        readonly expression: Array<CfnPrincipalPermissions.LFTagProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The resource type for which the LF-tag policy applies.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-lftagpolicyresource.html#cfn-lakeformation-principalpermissions-lftagpolicyresource-resourcetype
         */
        readonly resourceType: string;
    }
}

/**
 * Determine whether the given properties match those of a `LFTagPolicyResourceProperty`
 *
 * @param properties - the TypeScript properties of a `LFTagPolicyResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnPrincipalPermissions_LFTagPolicyResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('catalogId', cdk.requiredValidator)(properties.catalogId));
    errors.collect(cdk.propertyValidator('catalogId', cdk.validateString)(properties.catalogId));
    errors.collect(cdk.propertyValidator('expression', cdk.requiredValidator)(properties.expression));
    errors.collect(cdk.propertyValidator('expression', cdk.listValidator(CfnPrincipalPermissions_LFTagPropertyValidator))(properties.expression));
    errors.collect(cdk.propertyValidator('resourceType', cdk.requiredValidator)(properties.resourceType));
    errors.collect(cdk.propertyValidator('resourceType', cdk.validateString)(properties.resourceType));
    return errors.wrap('supplied properties not correct for "LFTagPolicyResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions.LFTagPolicyResource` resource
 *
 * @param properties - the TypeScript properties of a `LFTagPolicyResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions.LFTagPolicyResource` resource.
 */
// @ts-ignore TS6133
function cfnPrincipalPermissionsLFTagPolicyResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPrincipalPermissions_LFTagPolicyResourcePropertyValidator(properties).assertSuccess();
    return {
        CatalogId: cdk.stringToCloudFormation(properties.catalogId),
        Expression: cdk.listMapper(cfnPrincipalPermissionsLFTagPropertyToCloudFormation)(properties.expression),
        ResourceType: cdk.stringToCloudFormation(properties.resourceType),
    };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsLFTagPolicyResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPrincipalPermissions.LFTagPolicyResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissions.LFTagPolicyResourceProperty>();
    ret.addPropertyResult('catalogId', 'CatalogId', cfn_parse.FromCloudFormation.getString(properties.CatalogId));
    ret.addPropertyResult('expression', 'Expression', cfn_parse.FromCloudFormation.getArray(CfnPrincipalPermissionsLFTagPropertyFromCloudFormation)(properties.Expression));
    ret.addPropertyResult('resourceType', 'ResourceType', cfn_parse.FromCloudFormation.getString(properties.ResourceType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPrincipalPermissions {
    /**
     * A structure for the resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-resource.html
     */
    export interface ResourceProperty {
        /**
         * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your AWS Lake Formation environment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-resource.html#cfn-lakeformation-principalpermissions-resource-catalog
         */
        readonly catalog?: any | cdk.IResolvable;
        /**
         * A data cell filter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-resource.html#cfn-lakeformation-principalpermissions-resource-datacellsfilter
         */
        readonly dataCellsFilter?: CfnPrincipalPermissions.DataCellsFilterResourceProperty | cdk.IResolvable;
        /**
         * The location of an Amazon S3 path where permissions are granted or revoked.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-resource.html#cfn-lakeformation-principalpermissions-resource-datalocation
         */
        readonly dataLocation?: CfnPrincipalPermissions.DataLocationResourceProperty | cdk.IResolvable;
        /**
         * The database for the resource. Unique to the Data Catalog. A database is a set of associated table definitions organized into a logical group. You can Grant and Revoke database permissions to a principal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-resource.html#cfn-lakeformation-principalpermissions-resource-database
         */
        readonly database?: CfnPrincipalPermissions.DatabaseResourceProperty | cdk.IResolvable;
        /**
         * The LF-tag key and values attached to a resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-resource.html#cfn-lakeformation-principalpermissions-resource-lftag
         */
        readonly lfTag?: CfnPrincipalPermissions.LFTagKeyResourceProperty | cdk.IResolvable;
        /**
         * A list of LF-tag conditions that define a resource's LF-tag policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-resource.html#cfn-lakeformation-principalpermissions-resource-lftagpolicy
         */
        readonly lfTagPolicy?: CfnPrincipalPermissions.LFTagPolicyResourceProperty | cdk.IResolvable;
        /**
         * The table for the resource. A table is a metadata definition that represents your data. You can Grant and Revoke table privileges to a principal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-resource.html#cfn-lakeformation-principalpermissions-resource-table
         */
        readonly table?: CfnPrincipalPermissions.TableResourceProperty | cdk.IResolvable;
        /**
         * The table with columns for the resource. A principal with permissions to this resource can select metadata from the columns of a table in the Data Catalog and the underlying data in Amazon S3.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-resource.html#cfn-lakeformation-principalpermissions-resource-tablewithcolumns
         */
        readonly tableWithColumns?: CfnPrincipalPermissions.TableWithColumnsResourceProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ResourceProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnPrincipalPermissions_ResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('catalog', cdk.validateObject)(properties.catalog));
    errors.collect(cdk.propertyValidator('dataCellsFilter', CfnPrincipalPermissions_DataCellsFilterResourcePropertyValidator)(properties.dataCellsFilter));
    errors.collect(cdk.propertyValidator('dataLocation', CfnPrincipalPermissions_DataLocationResourcePropertyValidator)(properties.dataLocation));
    errors.collect(cdk.propertyValidator('database', CfnPrincipalPermissions_DatabaseResourcePropertyValidator)(properties.database));
    errors.collect(cdk.propertyValidator('lfTag', CfnPrincipalPermissions_LFTagKeyResourcePropertyValidator)(properties.lfTag));
    errors.collect(cdk.propertyValidator('lfTagPolicy', CfnPrincipalPermissions_LFTagPolicyResourcePropertyValidator)(properties.lfTagPolicy));
    errors.collect(cdk.propertyValidator('table', CfnPrincipalPermissions_TableResourcePropertyValidator)(properties.table));
    errors.collect(cdk.propertyValidator('tableWithColumns', CfnPrincipalPermissions_TableWithColumnsResourcePropertyValidator)(properties.tableWithColumns));
    return errors.wrap('supplied properties not correct for "ResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions.Resource` resource
 *
 * @param properties - the TypeScript properties of a `ResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions.Resource` resource.
 */
// @ts-ignore TS6133
function cfnPrincipalPermissionsResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPrincipalPermissions_ResourcePropertyValidator(properties).assertSuccess();
    return {
        Catalog: cdk.objectToCloudFormation(properties.catalog),
        DataCellsFilter: cfnPrincipalPermissionsDataCellsFilterResourcePropertyToCloudFormation(properties.dataCellsFilter),
        DataLocation: cfnPrincipalPermissionsDataLocationResourcePropertyToCloudFormation(properties.dataLocation),
        Database: cfnPrincipalPermissionsDatabaseResourcePropertyToCloudFormation(properties.database),
        LFTag: cfnPrincipalPermissionsLFTagKeyResourcePropertyToCloudFormation(properties.lfTag),
        LFTagPolicy: cfnPrincipalPermissionsLFTagPolicyResourcePropertyToCloudFormation(properties.lfTagPolicy),
        Table: cfnPrincipalPermissionsTableResourcePropertyToCloudFormation(properties.table),
        TableWithColumns: cfnPrincipalPermissionsTableWithColumnsResourcePropertyToCloudFormation(properties.tableWithColumns),
    };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPrincipalPermissions.ResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissions.ResourceProperty>();
    ret.addPropertyResult('catalog', 'Catalog', properties.Catalog != null ? cfn_parse.FromCloudFormation.getAny(properties.Catalog) : undefined);
    ret.addPropertyResult('dataCellsFilter', 'DataCellsFilter', properties.DataCellsFilter != null ? CfnPrincipalPermissionsDataCellsFilterResourcePropertyFromCloudFormation(properties.DataCellsFilter) : undefined);
    ret.addPropertyResult('dataLocation', 'DataLocation', properties.DataLocation != null ? CfnPrincipalPermissionsDataLocationResourcePropertyFromCloudFormation(properties.DataLocation) : undefined);
    ret.addPropertyResult('database', 'Database', properties.Database != null ? CfnPrincipalPermissionsDatabaseResourcePropertyFromCloudFormation(properties.Database) : undefined);
    ret.addPropertyResult('lfTag', 'LFTag', properties.LFTag != null ? CfnPrincipalPermissionsLFTagKeyResourcePropertyFromCloudFormation(properties.LFTag) : undefined);
    ret.addPropertyResult('lfTagPolicy', 'LFTagPolicy', properties.LFTagPolicy != null ? CfnPrincipalPermissionsLFTagPolicyResourcePropertyFromCloudFormation(properties.LFTagPolicy) : undefined);
    ret.addPropertyResult('table', 'Table', properties.Table != null ? CfnPrincipalPermissionsTableResourcePropertyFromCloudFormation(properties.Table) : undefined);
    ret.addPropertyResult('tableWithColumns', 'TableWithColumns', properties.TableWithColumns != null ? CfnPrincipalPermissionsTableWithColumnsResourcePropertyFromCloudFormation(properties.TableWithColumns) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPrincipalPermissions {
    /**
     * A structure for the table object. A table is a metadata definition that represents your data. You can Grant and Revoke table privileges to a principal.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-tableresource.html
     */
    export interface TableResourceProperty {
        /**
         * `CfnPrincipalPermissions.TableResourceProperty.CatalogId`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-tableresource.html#cfn-lakeformation-principalpermissions-tableresource-catalogid
         */
        readonly catalogId: string;
        /**
         * The name of the database for the table. Unique to a Data Catalog. A database is a set of associated table definitions organized into a logical group. You can Grant and Revoke database privileges to a principal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-tableresource.html#cfn-lakeformation-principalpermissions-tableresource-databasename
         */
        readonly databaseName: string;
        /**
         * The name of the table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-tableresource.html#cfn-lakeformation-principalpermissions-tableresource-name
         */
        readonly name?: string;
        /**
         * A wildcard object representing every table under a database.
         *
         * At least one of `TableResource$Name` or `TableResource$TableWildcard` is required.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-tableresource.html#cfn-lakeformation-principalpermissions-tableresource-tablewildcard
         */
        readonly tableWildcard?: any | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TableResourceProperty`
 *
 * @param properties - the TypeScript properties of a `TableResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnPrincipalPermissions_TableResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('catalogId', cdk.requiredValidator)(properties.catalogId));
    errors.collect(cdk.propertyValidator('catalogId', cdk.validateString)(properties.catalogId));
    errors.collect(cdk.propertyValidator('databaseName', cdk.requiredValidator)(properties.databaseName));
    errors.collect(cdk.propertyValidator('databaseName', cdk.validateString)(properties.databaseName));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tableWildcard', cdk.validateObject)(properties.tableWildcard));
    return errors.wrap('supplied properties not correct for "TableResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions.TableResource` resource
 *
 * @param properties - the TypeScript properties of a `TableResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions.TableResource` resource.
 */
// @ts-ignore TS6133
function cfnPrincipalPermissionsTableResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPrincipalPermissions_TableResourcePropertyValidator(properties).assertSuccess();
    return {
        CatalogId: cdk.stringToCloudFormation(properties.catalogId),
        DatabaseName: cdk.stringToCloudFormation(properties.databaseName),
        Name: cdk.stringToCloudFormation(properties.name),
        TableWildcard: cdk.objectToCloudFormation(properties.tableWildcard),
    };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsTableResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPrincipalPermissions.TableResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissions.TableResourceProperty>();
    ret.addPropertyResult('catalogId', 'CatalogId', cfn_parse.FromCloudFormation.getString(properties.CatalogId));
    ret.addPropertyResult('databaseName', 'DatabaseName', cfn_parse.FromCloudFormation.getString(properties.DatabaseName));
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tableWildcard', 'TableWildcard', properties.TableWildcard != null ? cfn_parse.FromCloudFormation.getAny(properties.TableWildcard) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPrincipalPermissions {
    /**
     * A structure for a table with columns object. This object is only used when granting a SELECT permission.
     *
     * This object must take a value for at least one of `ColumnsNames` , `ColumnsIndexes` , or `ColumnsWildcard` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-tablewithcolumnsresource.html
     */
    export interface TableWithColumnsResourceProperty {
        /**
         * The identifier for the Data Catalog where the location is registered with AWS Lake Formation .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-tablewithcolumnsresource.html#cfn-lakeformation-principalpermissions-tablewithcolumnsresource-catalogid
         */
        readonly catalogId: string;
        /**
         * The list of column names for the table. At least one of `ColumnNames` or `ColumnWildcard` is required.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-tablewithcolumnsresource.html#cfn-lakeformation-principalpermissions-tablewithcolumnsresource-columnnames
         */
        readonly columnNames?: string[];
        /**
         * A wildcard specified by a `ColumnWildcard` object. At least one of `ColumnNames` or `ColumnWildcard` is required.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-tablewithcolumnsresource.html#cfn-lakeformation-principalpermissions-tablewithcolumnsresource-columnwildcard
         */
        readonly columnWildcard?: CfnPrincipalPermissions.ColumnWildcardProperty | cdk.IResolvable;
        /**
         * The name of the database for the table with columns resource. Unique to the Data Catalog. A database is a set of associated table definitions organized into a logical group. You can Grant and Revoke database privileges to a principal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-tablewithcolumnsresource.html#cfn-lakeformation-principalpermissions-tablewithcolumnsresource-databasename
         */
        readonly databaseName: string;
        /**
         * The name of the table resource. A table is a metadata definition that represents your data. You can Grant and Revoke table privileges to a principal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-tablewithcolumnsresource.html#cfn-lakeformation-principalpermissions-tablewithcolumnsresource-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `TableWithColumnsResourceProperty`
 *
 * @param properties - the TypeScript properties of a `TableWithColumnsResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnPrincipalPermissions_TableWithColumnsResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('catalogId', cdk.requiredValidator)(properties.catalogId));
    errors.collect(cdk.propertyValidator('catalogId', cdk.validateString)(properties.catalogId));
    errors.collect(cdk.propertyValidator('columnNames', cdk.listValidator(cdk.validateString))(properties.columnNames));
    errors.collect(cdk.propertyValidator('columnWildcard', CfnPrincipalPermissions_ColumnWildcardPropertyValidator)(properties.columnWildcard));
    errors.collect(cdk.propertyValidator('databaseName', cdk.requiredValidator)(properties.databaseName));
    errors.collect(cdk.propertyValidator('databaseName', cdk.validateString)(properties.databaseName));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "TableWithColumnsResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions.TableWithColumnsResource` resource
 *
 * @param properties - the TypeScript properties of a `TableWithColumnsResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::PrincipalPermissions.TableWithColumnsResource` resource.
 */
// @ts-ignore TS6133
function cfnPrincipalPermissionsTableWithColumnsResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPrincipalPermissions_TableWithColumnsResourcePropertyValidator(properties).assertSuccess();
    return {
        CatalogId: cdk.stringToCloudFormation(properties.catalogId),
        ColumnNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.columnNames),
        ColumnWildcard: cfnPrincipalPermissionsColumnWildcardPropertyToCloudFormation(properties.columnWildcard),
        DatabaseName: cdk.stringToCloudFormation(properties.databaseName),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsTableWithColumnsResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPrincipalPermissions.TableWithColumnsResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissions.TableWithColumnsResourceProperty>();
    ret.addPropertyResult('catalogId', 'CatalogId', cfn_parse.FromCloudFormation.getString(properties.CatalogId));
    ret.addPropertyResult('columnNames', 'ColumnNames', properties.ColumnNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ColumnNames) : undefined);
    ret.addPropertyResult('columnWildcard', 'ColumnWildcard', properties.ColumnWildcard != null ? CfnPrincipalPermissionsColumnWildcardPropertyFromCloudFormation(properties.ColumnWildcard) : undefined);
    ret.addPropertyResult('databaseName', 'DatabaseName', cfn_parse.FromCloudFormation.getString(properties.DatabaseName));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnResource`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-resource.html
 */
export interface CfnResourceProps {

    /**
     * The Amazon Resource Name (ARN) of the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-resource.html#cfn-lakeformation-resource-resourcearn
     */
    readonly resourceArn: string;

    /**
     * Designates a trusted caller, an IAM principal, by registering this caller with the Data Catalog .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-resource.html#cfn-lakeformation-resource-useservicelinkedrole
     */
    readonly useServiceLinkedRole: boolean | cdk.IResolvable;

    /**
     * The IAM role that registered a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-resource.html#cfn-lakeformation-resource-rolearn
     */
    readonly roleArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnResourceProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceProps`
 *
 * @returns the result of the validation.
 */
function CfnResourcePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resourceArn', cdk.requiredValidator)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('useServiceLinkedRole', cdk.requiredValidator)(properties.useServiceLinkedRole));
    errors.collect(cdk.propertyValidator('useServiceLinkedRole', cdk.validateBoolean)(properties.useServiceLinkedRole));
    return errors.wrap('supplied properties not correct for "CfnResourceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::Resource` resource
 *
 * @param properties - the TypeScript properties of a `CfnResourceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::Resource` resource.
 */
// @ts-ignore TS6133
function cfnResourcePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResourcePropsValidator(properties).assertSuccess();
    return {
        ResourceArn: cdk.stringToCloudFormation(properties.resourceArn),
        UseServiceLinkedRole: cdk.booleanToCloudFormation(properties.useServiceLinkedRole),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnResourcePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceProps>();
    ret.addPropertyResult('resourceArn', 'ResourceArn', cfn_parse.FromCloudFormation.getString(properties.ResourceArn));
    ret.addPropertyResult('useServiceLinkedRole', 'UseServiceLinkedRole', cfn_parse.FromCloudFormation.getBoolean(properties.UseServiceLinkedRole));
    ret.addPropertyResult('roleArn', 'RoleArn', properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::LakeFormation::Resource`
 *
 * The `AWS::LakeFormation::Resource` represents the data (  buckets and folders) that is being registered with AWS Lake Formation . During a stack operation, AWS CloudFormation calls the AWS Lake Formation [`RegisterResource`](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-credential-vending.html#aws-lake-formation-api-credential-vending-RegisterResource) API operation to register the resource. To remove a `Resource` type, AWS CloudFormation calls the AWS Lake Formation [`DeregisterResource`](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-credential-vending.html#aws-lake-formation-api-credential-vending-DeregisterResource) API operation.
 *
 * @cloudformationResource AWS::LakeFormation::Resource
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-resource.html
 */
export class CfnResource extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::LakeFormation::Resource";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResource {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnResourcePropsFromCloudFormation(resourceProperties);
        const ret = new CfnResource(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-resource.html#cfn-lakeformation-resource-resourcearn
     */
    public resourceArn: string;

    /**
     * Designates a trusted caller, an IAM principal, by registering this caller with the Data Catalog .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-resource.html#cfn-lakeformation-resource-useservicelinkedrole
     */
    public useServiceLinkedRole: boolean | cdk.IResolvable;

    /**
     * The IAM role that registered a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-resource.html#cfn-lakeformation-resource-rolearn
     */
    public roleArn: string | undefined;

    /**
     * Create a new `AWS::LakeFormation::Resource`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnResourceProps) {
        super(scope, id, { type: CfnResource.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'resourceArn', this);
        cdk.requireProperty(props, 'useServiceLinkedRole', this);

        this.resourceArn = props.resourceArn;
        this.useServiceLinkedRole = props.useServiceLinkedRole;
        this.roleArn = props.roleArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnResource.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            resourceArn: this.resourceArn,
            useServiceLinkedRole: this.useServiceLinkedRole,
            roleArn: this.roleArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnResourcePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnTag`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tag.html
 */
export interface CfnTagProps {

    /**
     * UTF-8 string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html#aws-glue-api-regex-oneLine) .
     *
     * The key-name for the LF-tag.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tag.html#cfn-lakeformation-tag-tagkey
     */
    readonly tagKey: string;

    /**
     * An array of UTF-8 strings, not less than 1 or more than 50 strings.
     *
     * A list of possible values of the corresponding `TagKey` of an LF-tag key-value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tag.html#cfn-lakeformation-tag-tagvalues
     */
    readonly tagValues: string[];

    /**
     * Catalog id string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html#aws-glue-api-regex-oneLine) .
     *
     * The identifier for the Data Catalog . By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your AWS Lake Formation environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tag.html#cfn-lakeformation-tag-catalogid
     */
    readonly catalogId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnTagProps`
 *
 * @param properties - the TypeScript properties of a `CfnTagProps`
 *
 * @returns the result of the validation.
 */
function CfnTagPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('catalogId', cdk.validateString)(properties.catalogId));
    errors.collect(cdk.propertyValidator('tagKey', cdk.requiredValidator)(properties.tagKey));
    errors.collect(cdk.propertyValidator('tagKey', cdk.validateString)(properties.tagKey));
    errors.collect(cdk.propertyValidator('tagValues', cdk.requiredValidator)(properties.tagValues));
    errors.collect(cdk.propertyValidator('tagValues', cdk.listValidator(cdk.validateString))(properties.tagValues));
    return errors.wrap('supplied properties not correct for "CfnTagProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::Tag` resource
 *
 * @param properties - the TypeScript properties of a `CfnTagProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::Tag` resource.
 */
// @ts-ignore TS6133
function cfnTagPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTagPropsValidator(properties).assertSuccess();
    return {
        TagKey: cdk.stringToCloudFormation(properties.tagKey),
        TagValues: cdk.listMapper(cdk.stringToCloudFormation)(properties.tagValues),
        CatalogId: cdk.stringToCloudFormation(properties.catalogId),
    };
}

// @ts-ignore TS6133
function CfnTagPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTagProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTagProps>();
    ret.addPropertyResult('tagKey', 'TagKey', cfn_parse.FromCloudFormation.getString(properties.TagKey));
    ret.addPropertyResult('tagValues', 'TagValues', cfn_parse.FromCloudFormation.getStringArray(properties.TagValues));
    ret.addPropertyResult('catalogId', 'CatalogId', properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::LakeFormation::Tag`
 *
 * The `AWS::LakeFormation::Tag` resource represents an LF-tag, which consists of a key and one or more possible values for the key. During a stack operation, AWS CloudFormation calls the AWS Lake Formation `CreateLFTag` API to create a tag, and `UpdateLFTag` API to update a tag resource, and a `DeleteLFTag` to delete it.
 *
 * @cloudformationResource AWS::LakeFormation::Tag
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tag.html
 */
export class CfnTag extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::LakeFormation::Tag";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTag {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnTagPropsFromCloudFormation(resourceProperties);
        const ret = new CfnTag(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * UTF-8 string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html#aws-glue-api-regex-oneLine) .
     *
     * The key-name for the LF-tag.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tag.html#cfn-lakeformation-tag-tagkey
     */
    public tagKey: string;

    /**
     * An array of UTF-8 strings, not less than 1 or more than 50 strings.
     *
     * A list of possible values of the corresponding `TagKey` of an LF-tag key-value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tag.html#cfn-lakeformation-tag-tagvalues
     */
    public tagValues: string[];

    /**
     * Catalog id string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html#aws-glue-api-regex-oneLine) .
     *
     * The identifier for the Data Catalog . By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your AWS Lake Formation environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tag.html#cfn-lakeformation-tag-catalogid
     */
    public catalogId: string | undefined;

    /**
     * Create a new `AWS::LakeFormation::Tag`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTagProps) {
        super(scope, id, { type: CfnTag.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'tagKey', this);
        cdk.requireProperty(props, 'tagValues', this);

        this.tagKey = props.tagKey;
        this.tagValues = props.tagValues;
        this.catalogId = props.catalogId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnTag.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            tagKey: this.tagKey,
            tagValues: this.tagValues,
            catalogId: this.catalogId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnTagPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnTagAssociation`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tagassociation.html
 */
export interface CfnTagAssociationProps {

    /**
     * A structure containing an LF-tag key-value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tagassociation.html#cfn-lakeformation-tagassociation-lftags
     */
    readonly lfTags: Array<CfnTagAssociation.LFTagPairProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * UTF-8 string (valid values: `DATABASE | TABLE` ).
     *
     * The resource for which the LF-tag policy applies.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tagassociation.html#cfn-lakeformation-tagassociation-resource
     */
    readonly resource: CfnTagAssociation.ResourceProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnTagAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnTagAssociationProps`
 *
 * @returns the result of the validation.
 */
function CfnTagAssociationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('lfTags', cdk.requiredValidator)(properties.lfTags));
    errors.collect(cdk.propertyValidator('lfTags', cdk.listValidator(CfnTagAssociation_LFTagPairPropertyValidator))(properties.lfTags));
    errors.collect(cdk.propertyValidator('resource', cdk.requiredValidator)(properties.resource));
    errors.collect(cdk.propertyValidator('resource', CfnTagAssociation_ResourcePropertyValidator)(properties.resource));
    return errors.wrap('supplied properties not correct for "CfnTagAssociationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::TagAssociation` resource
 *
 * @param properties - the TypeScript properties of a `CfnTagAssociationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::TagAssociation` resource.
 */
// @ts-ignore TS6133
function cfnTagAssociationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTagAssociationPropsValidator(properties).assertSuccess();
    return {
        LFTags: cdk.listMapper(cfnTagAssociationLFTagPairPropertyToCloudFormation)(properties.lfTags),
        Resource: cfnTagAssociationResourcePropertyToCloudFormation(properties.resource),
    };
}

// @ts-ignore TS6133
function CfnTagAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTagAssociationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTagAssociationProps>();
    ret.addPropertyResult('lfTags', 'LFTags', cfn_parse.FromCloudFormation.getArray(CfnTagAssociationLFTagPairPropertyFromCloudFormation)(properties.LFTags));
    ret.addPropertyResult('resource', 'Resource', CfnTagAssociationResourcePropertyFromCloudFormation(properties.Resource));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::LakeFormation::TagAssociation`
 *
 * The `AWS::LakeFormation::TagAssociation` resource represents an assignment of an LF-tag to a Data Catalog resource (database, table, or column). During a stack operation, CloudFormation calls AWS Lake Formation `AddLFTagsToResource` API to create a `TagAssociation` resource and calls the `RemoveLFTagsToResource` API to delete it.
 *
 * @cloudformationResource AWS::LakeFormation::TagAssociation
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tagassociation.html
 */
export class CfnTagAssociation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::LakeFormation::TagAssociation";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTagAssociation {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnTagAssociationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnTagAssociation(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Json encoding of the input resource.
     *
     * **Examples** - Database: `{"Catalog":null,"Database":{"CatalogId":"123456789012","Name":"ExampleDbName"},"Table":null,"TableWithColumns":null}`
     * - Table: `{"Catalog":null,"Database":null,"Table":{"CatalogId":"123456789012","DatabaseName":"ExampleDbName","Name":"ExampleTableName","TableWildcard":null},"TableWithColumns":null}`
     * - Columns: `{"Catalog":null,"Database":null,"Table":null,"TableWithColumns":{"CatalogId":"123456789012","DatabaseName":"ExampleDbName","Name":"ExampleTableName","ColumnNames":["ExampleColName1","ExampleColName2"]}}`
     * @cloudformationAttribute ResourceIdentifier
     */
    public readonly attrResourceIdentifier: string;

    /**
     * Json encoding of the input LFTags list.
     *
     * For example: `[{"CatalogId":null,"TagKey":"tagKey1","TagValues":null},{"CatalogId":null,"TagKey":"tagKey2","TagValues":null}]`
     * @cloudformationAttribute TagsIdentifier
     */
    public readonly attrTagsIdentifier: string;

    /**
     * A structure containing an LF-tag key-value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tagassociation.html#cfn-lakeformation-tagassociation-lftags
     */
    public lfTags: Array<CfnTagAssociation.LFTagPairProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * UTF-8 string (valid values: `DATABASE | TABLE` ).
     *
     * The resource for which the LF-tag policy applies.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tagassociation.html#cfn-lakeformation-tagassociation-resource
     */
    public resource: CfnTagAssociation.ResourceProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::LakeFormation::TagAssociation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTagAssociationProps) {
        super(scope, id, { type: CfnTagAssociation.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'lfTags', this);
        cdk.requireProperty(props, 'resource', this);
        this.attrResourceIdentifier = cdk.Token.asString(this.getAtt('ResourceIdentifier', cdk.ResolutionTypeHint.STRING));
        this.attrTagsIdentifier = cdk.Token.asString(this.getAtt('TagsIdentifier', cdk.ResolutionTypeHint.STRING));

        this.lfTags = props.lfTags;
        this.resource = props.resource;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnTagAssociation.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            lfTags: this.lfTags,
            resource: this.resource,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnTagAssociationPropsToCloudFormation(props);
    }
}

export namespace CfnTagAssociation {
    /**
     * A structure for the database object.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-databaseresource.html
     */
    export interface DatabaseResourceProperty {
        /**
         * The identifier for the Data Catalog . By default, it should be the account ID of the caller.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-databaseresource.html#cfn-lakeformation-tagassociation-databaseresource-catalogid
         */
        readonly catalogId: string;
        /**
         * The name of the database resource. Unique to the Data Catalog.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-databaseresource.html#cfn-lakeformation-tagassociation-databaseresource-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `DatabaseResourceProperty`
 *
 * @param properties - the TypeScript properties of a `DatabaseResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnTagAssociation_DatabaseResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('catalogId', cdk.requiredValidator)(properties.catalogId));
    errors.collect(cdk.propertyValidator('catalogId', cdk.validateString)(properties.catalogId));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "DatabaseResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::TagAssociation.DatabaseResource` resource
 *
 * @param properties - the TypeScript properties of a `DatabaseResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::TagAssociation.DatabaseResource` resource.
 */
// @ts-ignore TS6133
function cfnTagAssociationDatabaseResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTagAssociation_DatabaseResourcePropertyValidator(properties).assertSuccess();
    return {
        CatalogId: cdk.stringToCloudFormation(properties.catalogId),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnTagAssociationDatabaseResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTagAssociation.DatabaseResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTagAssociation.DatabaseResourceProperty>();
    ret.addPropertyResult('catalogId', 'CatalogId', cfn_parse.FromCloudFormation.getString(properties.CatalogId));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTagAssociation {
    /**
     * A structure containing the catalog ID, tag key, and tag values of an LF-tag key-value pair.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-lftagpair.html
     */
    export interface LFTagPairProperty {
        /**
         * The identifier for the Data Catalog . By default, it is the account ID of the caller.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-lftagpair.html#cfn-lakeformation-tagassociation-lftagpair-catalogid
         */
        readonly catalogId: string;
        /**
         * The key-name for the LF-tag.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-lftagpair.html#cfn-lakeformation-tagassociation-lftagpair-tagkey
         */
        readonly tagKey: string;
        /**
         * A list of possible values of the corresponding `TagKey` of an LF-tag key-value pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-lftagpair.html#cfn-lakeformation-tagassociation-lftagpair-tagvalues
         */
        readonly tagValues: string[];
    }
}

/**
 * Determine whether the given properties match those of a `LFTagPairProperty`
 *
 * @param properties - the TypeScript properties of a `LFTagPairProperty`
 *
 * @returns the result of the validation.
 */
function CfnTagAssociation_LFTagPairPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('catalogId', cdk.requiredValidator)(properties.catalogId));
    errors.collect(cdk.propertyValidator('catalogId', cdk.validateString)(properties.catalogId));
    errors.collect(cdk.propertyValidator('tagKey', cdk.requiredValidator)(properties.tagKey));
    errors.collect(cdk.propertyValidator('tagKey', cdk.validateString)(properties.tagKey));
    errors.collect(cdk.propertyValidator('tagValues', cdk.requiredValidator)(properties.tagValues));
    errors.collect(cdk.propertyValidator('tagValues', cdk.listValidator(cdk.validateString))(properties.tagValues));
    return errors.wrap('supplied properties not correct for "LFTagPairProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::TagAssociation.LFTagPair` resource
 *
 * @param properties - the TypeScript properties of a `LFTagPairProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::TagAssociation.LFTagPair` resource.
 */
// @ts-ignore TS6133
function cfnTagAssociationLFTagPairPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTagAssociation_LFTagPairPropertyValidator(properties).assertSuccess();
    return {
        CatalogId: cdk.stringToCloudFormation(properties.catalogId),
        TagKey: cdk.stringToCloudFormation(properties.tagKey),
        TagValues: cdk.listMapper(cdk.stringToCloudFormation)(properties.tagValues),
    };
}

// @ts-ignore TS6133
function CfnTagAssociationLFTagPairPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTagAssociation.LFTagPairProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTagAssociation.LFTagPairProperty>();
    ret.addPropertyResult('catalogId', 'CatalogId', cfn_parse.FromCloudFormation.getString(properties.CatalogId));
    ret.addPropertyResult('tagKey', 'TagKey', cfn_parse.FromCloudFormation.getString(properties.TagKey));
    ret.addPropertyResult('tagValues', 'TagValues', cfn_parse.FromCloudFormation.getStringArray(properties.TagValues));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTagAssociation {
    /**
     * A structure for the resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-resource.html
     */
    export interface ResourceProperty {
        /**
         * The identifier for the Data Catalog. By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your AWS Lake Formation environment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-resource.html#cfn-lakeformation-tagassociation-resource-catalog
         */
        readonly catalog?: any | cdk.IResolvable;
        /**
         * The database for the resource. Unique to the Data Catalog. A database is a set of associated table definitions organized into a logical group. You can Grant and Revoke database permissions to a principal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-resource.html#cfn-lakeformation-tagassociation-resource-database
         */
        readonly database?: CfnTagAssociation.DatabaseResourceProperty | cdk.IResolvable;
        /**
         * The table for the resource. A table is a metadata definition that represents your data. You can Grant and Revoke table privileges to a principal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-resource.html#cfn-lakeformation-tagassociation-resource-table
         */
        readonly table?: CfnTagAssociation.TableResourceProperty | cdk.IResolvable;
        /**
         * The table with columns for the resource. A principal with permissions to this resource can select metadata from the columns of a table in the Data Catalog and the underlying data in Amazon S3.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-resource.html#cfn-lakeformation-tagassociation-resource-tablewithcolumns
         */
        readonly tableWithColumns?: CfnTagAssociation.TableWithColumnsResourceProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ResourceProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnTagAssociation_ResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('catalog', cdk.validateObject)(properties.catalog));
    errors.collect(cdk.propertyValidator('database', CfnTagAssociation_DatabaseResourcePropertyValidator)(properties.database));
    errors.collect(cdk.propertyValidator('table', CfnTagAssociation_TableResourcePropertyValidator)(properties.table));
    errors.collect(cdk.propertyValidator('tableWithColumns', CfnTagAssociation_TableWithColumnsResourcePropertyValidator)(properties.tableWithColumns));
    return errors.wrap('supplied properties not correct for "ResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::TagAssociation.Resource` resource
 *
 * @param properties - the TypeScript properties of a `ResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::TagAssociation.Resource` resource.
 */
// @ts-ignore TS6133
function cfnTagAssociationResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTagAssociation_ResourcePropertyValidator(properties).assertSuccess();
    return {
        Catalog: cdk.objectToCloudFormation(properties.catalog),
        Database: cfnTagAssociationDatabaseResourcePropertyToCloudFormation(properties.database),
        Table: cfnTagAssociationTableResourcePropertyToCloudFormation(properties.table),
        TableWithColumns: cfnTagAssociationTableWithColumnsResourcePropertyToCloudFormation(properties.tableWithColumns),
    };
}

// @ts-ignore TS6133
function CfnTagAssociationResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTagAssociation.ResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTagAssociation.ResourceProperty>();
    ret.addPropertyResult('catalog', 'Catalog', properties.Catalog != null ? cfn_parse.FromCloudFormation.getAny(properties.Catalog) : undefined);
    ret.addPropertyResult('database', 'Database', properties.Database != null ? CfnTagAssociationDatabaseResourcePropertyFromCloudFormation(properties.Database) : undefined);
    ret.addPropertyResult('table', 'Table', properties.Table != null ? CfnTagAssociationTableResourcePropertyFromCloudFormation(properties.Table) : undefined);
    ret.addPropertyResult('tableWithColumns', 'TableWithColumns', properties.TableWithColumns != null ? CfnTagAssociationTableWithColumnsResourcePropertyFromCloudFormation(properties.TableWithColumns) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTagAssociation {
    /**
     * A structure for the table object. A table is a metadata definition that represents your data. You can Grant and Revoke table privileges to a principal.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-tableresource.html
     */
    export interface TableResourceProperty {
        /**
         * The identifier for the Data Catalog . By default, it is the account ID of the caller.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-tableresource.html#cfn-lakeformation-tagassociation-tableresource-catalogid
         */
        readonly catalogId: string;
        /**
         * The name of the database for the table. Unique to a Data Catalog. A database is a set of associated table definitions organized into a logical group. You can Grant and Revoke database privileges to a principal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-tableresource.html#cfn-lakeformation-tagassociation-tableresource-databasename
         */
        readonly databaseName: string;
        /**
         * The name of the table.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-tableresource.html#cfn-lakeformation-tagassociation-tableresource-name
         */
        readonly name?: string;
        /**
         * A wildcard object representing every table under a database.
         *
         * At least one of `TableResource$Name` or `TableResource$TableWildcard` is required.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-tableresource.html#cfn-lakeformation-tagassociation-tableresource-tablewildcard
         */
        readonly tableWildcard?: any | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TableResourceProperty`
 *
 * @param properties - the TypeScript properties of a `TableResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnTagAssociation_TableResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('catalogId', cdk.requiredValidator)(properties.catalogId));
    errors.collect(cdk.propertyValidator('catalogId', cdk.validateString)(properties.catalogId));
    errors.collect(cdk.propertyValidator('databaseName', cdk.requiredValidator)(properties.databaseName));
    errors.collect(cdk.propertyValidator('databaseName', cdk.validateString)(properties.databaseName));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tableWildcard', cdk.validateObject)(properties.tableWildcard));
    return errors.wrap('supplied properties not correct for "TableResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::TagAssociation.TableResource` resource
 *
 * @param properties - the TypeScript properties of a `TableResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::TagAssociation.TableResource` resource.
 */
// @ts-ignore TS6133
function cfnTagAssociationTableResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTagAssociation_TableResourcePropertyValidator(properties).assertSuccess();
    return {
        CatalogId: cdk.stringToCloudFormation(properties.catalogId),
        DatabaseName: cdk.stringToCloudFormation(properties.databaseName),
        Name: cdk.stringToCloudFormation(properties.name),
        TableWildcard: cdk.objectToCloudFormation(properties.tableWildcard),
    };
}

// @ts-ignore TS6133
function CfnTagAssociationTableResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTagAssociation.TableResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTagAssociation.TableResourceProperty>();
    ret.addPropertyResult('catalogId', 'CatalogId', cfn_parse.FromCloudFormation.getString(properties.CatalogId));
    ret.addPropertyResult('databaseName', 'DatabaseName', cfn_parse.FromCloudFormation.getString(properties.DatabaseName));
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tableWildcard', 'TableWildcard', properties.TableWildcard != null ? cfn_parse.FromCloudFormation.getAny(properties.TableWildcard) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTagAssociation {
    /**
     * A structure for a table with columns object. This object is only used when granting a SELECT permission.
     *
     * This object must take a value for at least one of `ColumnsNames` , `ColumnsIndexes` , or `ColumnsWildcard` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-tablewithcolumnsresource.html
     */
    export interface TableWithColumnsResourceProperty {
        /**
         * A wildcard object representing every table under a database.
         *
         * At least one of TableResource$Name or TableResource$TableWildcard is required.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-tablewithcolumnsresource.html#cfn-lakeformation-tagassociation-tablewithcolumnsresource-catalogid
         */
        readonly catalogId: string;
        /**
         * The list of column names for the table. At least one of `ColumnNames` or `ColumnWildcard` is required.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-tablewithcolumnsresource.html#cfn-lakeformation-tagassociation-tablewithcolumnsresource-columnnames
         */
        readonly columnNames: string[];
        /**
         * The name of the database for the table with columns resource. Unique to the Data Catalog. A database is a set of associated table definitions organized into a logical group. You can Grant and Revoke database privileges to a principal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-tablewithcolumnsresource.html#cfn-lakeformation-tagassociation-tablewithcolumnsresource-databasename
         */
        readonly databaseName: string;
        /**
         * The name of the table resource. A table is a metadata definition that represents your data. You can Grant and Revoke table privileges to a principal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-tablewithcolumnsresource.html#cfn-lakeformation-tagassociation-tablewithcolumnsresource-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `TableWithColumnsResourceProperty`
 *
 * @param properties - the TypeScript properties of a `TableWithColumnsResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnTagAssociation_TableWithColumnsResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('catalogId', cdk.requiredValidator)(properties.catalogId));
    errors.collect(cdk.propertyValidator('catalogId', cdk.validateString)(properties.catalogId));
    errors.collect(cdk.propertyValidator('columnNames', cdk.requiredValidator)(properties.columnNames));
    errors.collect(cdk.propertyValidator('columnNames', cdk.listValidator(cdk.validateString))(properties.columnNames));
    errors.collect(cdk.propertyValidator('databaseName', cdk.requiredValidator)(properties.databaseName));
    errors.collect(cdk.propertyValidator('databaseName', cdk.validateString)(properties.databaseName));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "TableWithColumnsResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LakeFormation::TagAssociation.TableWithColumnsResource` resource
 *
 * @param properties - the TypeScript properties of a `TableWithColumnsResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LakeFormation::TagAssociation.TableWithColumnsResource` resource.
 */
// @ts-ignore TS6133
function cfnTagAssociationTableWithColumnsResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTagAssociation_TableWithColumnsResourcePropertyValidator(properties).assertSuccess();
    return {
        CatalogId: cdk.stringToCloudFormation(properties.catalogId),
        ColumnNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.columnNames),
        DatabaseName: cdk.stringToCloudFormation(properties.databaseName),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnTagAssociationTableWithColumnsResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTagAssociation.TableWithColumnsResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTagAssociation.TableWithColumnsResourceProperty>();
    ret.addPropertyResult('catalogId', 'CatalogId', cfn_parse.FromCloudFormation.getString(properties.CatalogId));
    ret.addPropertyResult('columnNames', 'ColumnNames', cfn_parse.FromCloudFormation.getStringArray(properties.ColumnNames));
    ret.addPropertyResult('databaseName', 'DatabaseName', cfn_parse.FromCloudFormation.getString(properties.DatabaseName));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
