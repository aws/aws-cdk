/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * A structure that represents a data cell filter with column-level, row-level, and/or cell-level security.
 *
 * Data cell filters belong to a specific table in a Data Catalog . During a stack operation, AWS CloudFormation calls the AWS Lake Formation `CreateDataCellsFilter` API operation to create a `DataCellsFilter` resource, and calls the `DeleteDataCellsFilter` API operation to delete it.
 *
 * @cloudformationResource AWS::LakeFormation::DataCellsFilter
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html
 */
export class CfnDataCellsFilter extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::LakeFormation::DataCellsFilter";

  /**
   * Build a CfnDataCellsFilter from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDataCellsFilter(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * An array of UTF-8 strings.
   */
  public columnNames?: Array<string>;

  /**
   * A wildcard with exclusions.
   */
  public columnWildcard?: CfnDataCellsFilter.ColumnWildcardProperty | cdk.IResolvable;

  /**
   * UTF-8 string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html) .
   */
  public databaseName: string;

  /**
   * UTF-8 string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html) .
   */
  public name: string;

  /**
   * A PartiQL predicate.
   */
  public rowFilter?: cdk.IResolvable | CfnDataCellsFilter.RowFilterProperty;

  /**
   * Catalog id string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html) .
   */
  public tableCatalogId: string;

  /**
   * UTF-8 string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html) .
   */
  public tableName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDataCellsFilterProps) {
    super(scope, id, {
      "type": CfnDataCellsFilter.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "databaseName", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "tableCatalogId", this);
    cdk.requireProperty(props, "tableName", this);

    this.columnNames = props.columnNames;
    this.columnWildcard = props.columnWildcard;
    this.databaseName = props.databaseName;
    this.name = props.name;
    this.rowFilter = props.rowFilter;
    this.tableCatalogId = props.tableCatalogId;
    this.tableName = props.tableName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "columnNames": this.columnNames,
      "columnWildcard": this.columnWildcard,
      "databaseName": this.databaseName,
      "name": this.name,
      "rowFilter": this.rowFilter,
      "tableCatalogId": this.tableCatalogId,
      "tableName": this.tableName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataCellsFilter.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDataCellsFilterPropsToCloudFormation(props);
  }
}

export namespace CfnDataCellsFilter {
  /**
   * A PartiQL predicate.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-datacellsfilter-rowfilter.html
   */
  export interface RowFilterProperty {
    /**
     * A wildcard for all rows.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-datacellsfilter-rowfilter.html#cfn-lakeformation-datacellsfilter-rowfilter-allrowswildcard
     */
    readonly allRowsWildcard?: any | cdk.IResolvable;

    /**
     * A filter expression.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-datacellsfilter-rowfilter.html#cfn-lakeformation-datacellsfilter-rowfilter-filterexpression
     */
    readonly filterExpression?: string;
  }

  /**
   * A wildcard object, consisting of an optional list of excluded column names or indexes.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-datacellsfilter-columnwildcard.html
   */
  export interface ColumnWildcardProperty {
    /**
     * Excludes column names.
     *
     * Any column with this name will be excluded.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-datacellsfilter-columnwildcard.html#cfn-lakeformation-datacellsfilter-columnwildcard-excludedcolumnnames
     */
    readonly excludedColumnNames?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnDataCellsFilter`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html
 */
export interface CfnDataCellsFilterProps {
  /**
   * An array of UTF-8 strings.
   *
   * A list of column names.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-columnnames
   */
  readonly columnNames?: Array<string>;

  /**
   * A wildcard with exclusions.
   *
   * You must specify either a `ColumnNames` list or the `ColumnWildCard` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-columnwildcard
   */
  readonly columnWildcard?: CfnDataCellsFilter.ColumnWildcardProperty | cdk.IResolvable;

  /**
   * UTF-8 string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html) .
   *
   * A database in the Data Catalog .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-databasename
   */
  readonly databaseName: string;

  /**
   * UTF-8 string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html) .
   *
   * The name given by the user to the data filter cell.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-name
   */
  readonly name: string;

  /**
   * A PartiQL predicate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-rowfilter
   */
  readonly rowFilter?: cdk.IResolvable | CfnDataCellsFilter.RowFilterProperty;

  /**
   * Catalog id string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html) .
   *
   * The ID of the catalog to which the table belongs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-tablecatalogid
   */
  readonly tableCatalogId: string;

  /**
   * UTF-8 string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html) .
   *
   * A table in the database.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datacellsfilter.html#cfn-lakeformation-datacellsfilter-tablename
   */
  readonly tableName: string;
}

/**
 * Determine whether the given properties match those of a `RowFilterProperty`
 *
 * @param properties - the TypeScript properties of a `RowFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataCellsFilterRowFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allRowsWildcard", cdk.validateObject)(properties.allRowsWildcard));
  errors.collect(cdk.propertyValidator("filterExpression", cdk.validateString)(properties.filterExpression));
  return errors.wrap("supplied properties not correct for \"RowFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataCellsFilterRowFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataCellsFilterRowFilterPropertyValidator(properties).assertSuccess();
  return {
    "AllRowsWildcard": cdk.objectToCloudFormation(properties.allRowsWildcard),
    "FilterExpression": cdk.stringToCloudFormation(properties.filterExpression)
  };
}

// @ts-ignore TS6133
function CfnDataCellsFilterRowFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataCellsFilter.RowFilterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataCellsFilter.RowFilterProperty>();
  ret.addPropertyResult("allRowsWildcard", "AllRowsWildcard", (properties.AllRowsWildcard != null ? cfn_parse.FromCloudFormation.getAny(properties.AllRowsWildcard) : undefined));
  ret.addPropertyResult("filterExpression", "FilterExpression", (properties.FilterExpression != null ? cfn_parse.FromCloudFormation.getString(properties.FilterExpression) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ColumnWildcardProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnWildcardProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataCellsFilterColumnWildcardPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("excludedColumnNames", cdk.listValidator(cdk.validateString))(properties.excludedColumnNames));
  return errors.wrap("supplied properties not correct for \"ColumnWildcardProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataCellsFilterColumnWildcardPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataCellsFilterColumnWildcardPropertyValidator(properties).assertSuccess();
  return {
    "ExcludedColumnNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.excludedColumnNames)
  };
}

// @ts-ignore TS6133
function CfnDataCellsFilterColumnWildcardPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataCellsFilter.ColumnWildcardProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataCellsFilter.ColumnWildcardProperty>();
  ret.addPropertyResult("excludedColumnNames", "ExcludedColumnNames", (properties.ExcludedColumnNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExcludedColumnNames) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDataCellsFilterProps`
 *
 * @param properties - the TypeScript properties of a `CfnDataCellsFilterProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataCellsFilterPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("columnNames", cdk.listValidator(cdk.validateString))(properties.columnNames));
  errors.collect(cdk.propertyValidator("columnWildcard", CfnDataCellsFilterColumnWildcardPropertyValidator)(properties.columnWildcard));
  errors.collect(cdk.propertyValidator("databaseName", cdk.requiredValidator)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("rowFilter", CfnDataCellsFilterRowFilterPropertyValidator)(properties.rowFilter));
  errors.collect(cdk.propertyValidator("tableCatalogId", cdk.requiredValidator)(properties.tableCatalogId));
  errors.collect(cdk.propertyValidator("tableCatalogId", cdk.validateString)(properties.tableCatalogId));
  errors.collect(cdk.propertyValidator("tableName", cdk.requiredValidator)(properties.tableName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  return errors.wrap("supplied properties not correct for \"CfnDataCellsFilterProps\"");
}

// @ts-ignore TS6133
function convertCfnDataCellsFilterPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataCellsFilterPropsValidator(properties).assertSuccess();
  return {
    "ColumnNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.columnNames),
    "ColumnWildcard": convertCfnDataCellsFilterColumnWildcardPropertyToCloudFormation(properties.columnWildcard),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RowFilter": convertCfnDataCellsFilterRowFilterPropertyToCloudFormation(properties.rowFilter),
    "TableCatalogId": cdk.stringToCloudFormation(properties.tableCatalogId),
    "TableName": cdk.stringToCloudFormation(properties.tableName)
  };
}

// @ts-ignore TS6133
function CfnDataCellsFilterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataCellsFilterProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataCellsFilterProps>();
  ret.addPropertyResult("columnNames", "ColumnNames", (properties.ColumnNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ColumnNames) : undefined));
  ret.addPropertyResult("columnWildcard", "ColumnWildcard", (properties.ColumnWildcard != null ? CfnDataCellsFilterColumnWildcardPropertyFromCloudFormation(properties.ColumnWildcard) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("rowFilter", "RowFilter", (properties.RowFilter != null ? CfnDataCellsFilterRowFilterPropertyFromCloudFormation(properties.RowFilter) : undefined));
  ret.addPropertyResult("tableCatalogId", "TableCatalogId", (properties.TableCatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.TableCatalogId) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::LakeFormation::DataLakeSettings` resource is an AWS Lake Formation resource type that manages the data lake settings for your account.
 *
 * @cloudformationResource AWS::LakeFormation::DataLakeSettings
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datalakesettings.html
 */
export class CfnDataLakeSettings extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::LakeFormation::DataLakeSettings";

  /**
   * Build a CfnDataLakeSettings from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDataLakeSettings(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A list of AWS Lake Formation principals.
   */
  public admins?: Array<CfnDataLakeSettings.DataLakePrincipalProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Whether to allow Amazon EMR clusters or other third-party query engines to access data managed by Lake Formation .
   */
  public allowExternalDataFiltering?: boolean | cdk.IResolvable;

  /**
   * Specifies whether query engines and applications can get credentials without IAM session tags if the user has full table access.
   */
  public allowFullTableExternalDataAccess?: boolean | cdk.IResolvable;

  /**
   * Lake Formation relies on a privileged process secured by Amazon EMR or the third party integrator to tag the user's role while assuming it.
   */
  public authorizedSessionTagValueList?: Array<string>;

  /**
   * Specifies whether access control on a newly created database is managed by Lake Formation permissions or exclusively by IAM permissions.
   */
  public createDatabaseDefaultPermissions?: Array<cdk.IResolvable | CfnDataLakeSettings.PrincipalPermissionsProperty> | cdk.IResolvable;

  /**
   * Specifies whether access control on a newly created table is managed by Lake Formation permissions or exclusively by IAM permissions.
   */
  public createTableDefaultPermissions?: Array<cdk.IResolvable | CfnDataLakeSettings.PrincipalPermissionsProperty> | cdk.IResolvable;

  /**
   * A list of the account IDs of AWS accounts with Amazon EMR clusters or third-party engines that are allwed to perform data filtering.
   */
  public externalDataFilteringAllowList?: Array<CfnDataLakeSettings.DataLakePrincipalProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specifies whether the data lake settings are updated by adding new values to the current settings ( `APPEND` ) or by replacing the current settings with new settings ( `REPLACE` ).
   */
  public mutationType?: string;

  /**
   * A key-value map that provides an additional configuration on your data lake.
   */
  public parameters?: any | cdk.IResolvable;

  /**
   * An array of UTF-8 strings.
   */
  public trustedResourceOwners?: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDataLakeSettingsProps = {}) {
    super(scope, id, {
      "type": CfnDataLakeSettings.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.admins = props.admins;
    this.allowExternalDataFiltering = props.allowExternalDataFiltering;
    this.allowFullTableExternalDataAccess = props.allowFullTableExternalDataAccess;
    this.authorizedSessionTagValueList = props.authorizedSessionTagValueList;
    this.createDatabaseDefaultPermissions = props.createDatabaseDefaultPermissions;
    this.createTableDefaultPermissions = props.createTableDefaultPermissions;
    this.externalDataFilteringAllowList = props.externalDataFilteringAllowList;
    this.mutationType = props.mutationType;
    this.parameters = props.parameters;
    this.trustedResourceOwners = props.trustedResourceOwners;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "admins": this.admins,
      "allowExternalDataFiltering": this.allowExternalDataFiltering,
      "allowFullTableExternalDataAccess": this.allowFullTableExternalDataAccess,
      "authorizedSessionTagValueList": this.authorizedSessionTagValueList,
      "createDatabaseDefaultPermissions": this.createDatabaseDefaultPermissions,
      "createTableDefaultPermissions": this.createTableDefaultPermissions,
      "externalDataFilteringAllowList": this.externalDataFilteringAllowList,
      "mutationType": this.mutationType,
      "parameters": this.parameters,
      "trustedResourceOwners": this.trustedResourceOwners
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataLakeSettings.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDataLakeSettingsPropsToCloudFormation(props);
  }
}

export namespace CfnDataLakeSettings {
  /**
   * The Lake Formation principal.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-datalakesettings-datalakeprincipal.html
   */
  export interface DataLakePrincipalProperty {
    /**
     * An identifier for the Lake Formation principal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-datalakesettings-datalakeprincipal.html#cfn-lakeformation-datalakesettings-datalakeprincipal-datalakeprincipalidentifier
     */
    readonly dataLakePrincipalIdentifier: string;
  }

  /**
   * Permissions granted to a principal.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-datalakesettings-principalpermissions.html
   */
  export interface PrincipalPermissionsProperty {
    /**
     * The permissions that are granted to the principal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-datalakesettings-principalpermissions.html#cfn-lakeformation-datalakesettings-principalpermissions-permissions
     */
    readonly permissions: Array<string>;

    /**
     * The principal who is granted permissions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-datalakesettings-principalpermissions.html#cfn-lakeformation-datalakesettings-principalpermissions-principal
     */
    readonly principal: CfnDataLakeSettings.DataLakePrincipalProperty | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnDataLakeSettings`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datalakesettings.html
 */
export interface CfnDataLakeSettingsProps {
  /**
   * A list of AWS Lake Formation principals.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datalakesettings.html#cfn-lakeformation-datalakesettings-admins
   */
  readonly admins?: Array<CfnDataLakeSettings.DataLakePrincipalProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Whether to allow Amazon EMR clusters or other third-party query engines to access data managed by Lake Formation .
   *
   * If set to true, you allow Amazon EMR clusters or other third-party engines to access data in Amazon S3 locations that are registered with Lake Formation .
   *
   * If false or null, no third-party query engines will be able to access data in Amazon S3 locations that are registered with Lake Formation.
   *
   * For more information, see [External data filtering setting](https://docs.aws.amazon.com/lake-formation/latest/dg/initial-LF-setup.html#external-data-filter) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datalakesettings.html#cfn-lakeformation-datalakesettings-allowexternaldatafiltering
   */
  readonly allowExternalDataFiltering?: boolean | cdk.IResolvable;

  /**
   * Specifies whether query engines and applications can get credentials without IAM session tags if the user has full table access.
   *
   * It provides query engines and applications performance benefits as well as simplifies data access. Amazon EMR on Amazon EC2 is able to leverage this setting.
   *
   * For more information, see [](https://docs.aws.amazon.com/lake-formation/latest/dg/using-cred-vending.html)
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datalakesettings.html#cfn-lakeformation-datalakesettings-allowfulltableexternaldataaccess
   */
  readonly allowFullTableExternalDataAccess?: boolean | cdk.IResolvable;

  /**
   * Lake Formation relies on a privileged process secured by Amazon EMR or the third party integrator to tag the user's role while assuming it.
   *
   * Lake Formation will publish the acceptable key-value pair, for example key = "LakeFormationTrustedCaller" and value = "TRUE" and the third party integrator must properly tag the temporary security credentials that will be used to call Lake Formation 's administrative API operations.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datalakesettings.html#cfn-lakeformation-datalakesettings-authorizedsessiontagvaluelist
   */
  readonly authorizedSessionTagValueList?: Array<string>;

  /**
   * Specifies whether access control on a newly created database is managed by Lake Formation permissions or exclusively by IAM permissions.
   *
   * A null value indicates that the access is controlled by Lake Formation permissions. `ALL` permissions assigned to `IAM_ALLOWED_PRINCIPALS` group indicates that the user's IAM permissions determine the access to the database. This is referred to as the setting "Use only IAM access control," and is to support backward compatibility with the AWS Glue permission model implemented by IAM permissions.
   *
   * The only permitted values are an empty array or an array that contains a single JSON object that grants `ALL` to `IAM_ALLOWED_PRINCIPALS` .
   *
   * For more information, see [Changing the default security settings for your data lake](https://docs.aws.amazon.com/lake-formation/latest/dg/change-settings.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datalakesettings.html#cfn-lakeformation-datalakesettings-createdatabasedefaultpermissions
   */
  readonly createDatabaseDefaultPermissions?: Array<cdk.IResolvable | CfnDataLakeSettings.PrincipalPermissionsProperty> | cdk.IResolvable;

  /**
   * Specifies whether access control on a newly created table is managed by Lake Formation permissions or exclusively by IAM permissions.
   *
   * A null value indicates that the access is controlled by Lake Formation permissions. `ALL` permissions assigned to `IAM_ALLOWED_PRINCIPALS` group indicate that the user's IAM permissions determine the access to the table. This is referred to as the setting "Use only IAM access control," and is to support the backward compatibility with the AWS Glue permission model implemented by IAM permissions.
   *
   * The only permitted values are an empty array or an array that contains a single JSON object that grants `ALL` permissions to `IAM_ALLOWED_PRINCIPALS` .
   *
   * For more information, see [Changing the default security settings for your data lake](https://docs.aws.amazon.com/lake-formation/latest/dg/change-settings.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datalakesettings.html#cfn-lakeformation-datalakesettings-createtabledefaultpermissions
   */
  readonly createTableDefaultPermissions?: Array<cdk.IResolvable | CfnDataLakeSettings.PrincipalPermissionsProperty> | cdk.IResolvable;

  /**
   * A list of the account IDs of AWS accounts with Amazon EMR clusters or third-party engines that are allwed to perform data filtering.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datalakesettings.html#cfn-lakeformation-datalakesettings-externaldatafilteringallowlist
   */
  readonly externalDataFilteringAllowList?: Array<CfnDataLakeSettings.DataLakePrincipalProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specifies whether the data lake settings are updated by adding new values to the current settings ( `APPEND` ) or by replacing the current settings with new settings ( `REPLACE` ).
   *
   * > If you choose `REPLACE` , your current data lake settings will be replaced with the new values in your template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datalakesettings.html#cfn-lakeformation-datalakesettings-mutationtype
   */
  readonly mutationType?: string;

  /**
   * A key-value map that provides an additional configuration on your data lake.
   *
   * `CrossAccountVersion` is the key you can configure in the `Parameters` field. Accepted values for the `CrossAccountVersion` key are 1, 2, and 3.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datalakesettings.html#cfn-lakeformation-datalakesettings-parameters
   */
  readonly parameters?: any | cdk.IResolvable;

  /**
   * An array of UTF-8 strings.
   *
   * A list of the resource-owning account IDs that the caller's account can use to share their user access details (user ARNs). The user ARNs can be logged in the resource owner's CloudTrail log. You may want to specify this property when you are in a high-trust boundary, such as the same team or company.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-datalakesettings.html#cfn-lakeformation-datalakesettings-trustedresourceowners
   */
  readonly trustedResourceOwners?: Array<string>;
}

/**
 * Determine whether the given properties match those of a `DataLakePrincipalProperty`
 *
 * @param properties - the TypeScript properties of a `DataLakePrincipalProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataLakeSettingsDataLakePrincipalPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataLakePrincipalIdentifier", cdk.requiredValidator)(properties.dataLakePrincipalIdentifier));
  errors.collect(cdk.propertyValidator("dataLakePrincipalIdentifier", cdk.validateString)(properties.dataLakePrincipalIdentifier));
  return errors.wrap("supplied properties not correct for \"DataLakePrincipalProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataLakeSettingsDataLakePrincipalPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataLakeSettingsDataLakePrincipalPropertyValidator(properties).assertSuccess();
  return {
    "DataLakePrincipalIdentifier": cdk.stringToCloudFormation(properties.dataLakePrincipalIdentifier)
  };
}

// @ts-ignore TS6133
function CfnDataLakeSettingsDataLakePrincipalPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataLakeSettings.DataLakePrincipalProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataLakeSettings.DataLakePrincipalProperty>();
  ret.addPropertyResult("dataLakePrincipalIdentifier", "DataLakePrincipalIdentifier", (properties.DataLakePrincipalIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DataLakePrincipalIdentifier) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PrincipalPermissionsProperty`
 *
 * @param properties - the TypeScript properties of a `PrincipalPermissionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataLakeSettingsPrincipalPermissionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("permissions", cdk.requiredValidator)(properties.permissions));
  errors.collect(cdk.propertyValidator("permissions", cdk.listValidator(cdk.validateString))(properties.permissions));
  errors.collect(cdk.propertyValidator("principal", cdk.requiredValidator)(properties.principal));
  errors.collect(cdk.propertyValidator("principal", CfnDataLakeSettingsDataLakePrincipalPropertyValidator)(properties.principal));
  return errors.wrap("supplied properties not correct for \"PrincipalPermissionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataLakeSettingsPrincipalPermissionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataLakeSettingsPrincipalPermissionsPropertyValidator(properties).assertSuccess();
  return {
    "Permissions": cdk.listMapper(cdk.stringToCloudFormation)(properties.permissions),
    "Principal": convertCfnDataLakeSettingsDataLakePrincipalPropertyToCloudFormation(properties.principal)
  };
}

// @ts-ignore TS6133
function CfnDataLakeSettingsPrincipalPermissionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataLakeSettings.PrincipalPermissionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataLakeSettings.PrincipalPermissionsProperty>();
  ret.addPropertyResult("permissions", "Permissions", (properties.Permissions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Permissions) : undefined));
  ret.addPropertyResult("principal", "Principal", (properties.Principal != null ? CfnDataLakeSettingsDataLakePrincipalPropertyFromCloudFormation(properties.Principal) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDataLakeSettingsProps`
 *
 * @param properties - the TypeScript properties of a `CfnDataLakeSettingsProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataLakeSettingsPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("admins", cdk.listValidator(CfnDataLakeSettingsDataLakePrincipalPropertyValidator))(properties.admins));
  errors.collect(cdk.propertyValidator("allowExternalDataFiltering", cdk.validateBoolean)(properties.allowExternalDataFiltering));
  errors.collect(cdk.propertyValidator("allowFullTableExternalDataAccess", cdk.validateBoolean)(properties.allowFullTableExternalDataAccess));
  errors.collect(cdk.propertyValidator("authorizedSessionTagValueList", cdk.listValidator(cdk.validateString))(properties.authorizedSessionTagValueList));
  errors.collect(cdk.propertyValidator("createDatabaseDefaultPermissions", cdk.listValidator(CfnDataLakeSettingsPrincipalPermissionsPropertyValidator))(properties.createDatabaseDefaultPermissions));
  errors.collect(cdk.propertyValidator("createTableDefaultPermissions", cdk.listValidator(CfnDataLakeSettingsPrincipalPermissionsPropertyValidator))(properties.createTableDefaultPermissions));
  errors.collect(cdk.propertyValidator("externalDataFilteringAllowList", cdk.listValidator(CfnDataLakeSettingsDataLakePrincipalPropertyValidator))(properties.externalDataFilteringAllowList));
  errors.collect(cdk.propertyValidator("mutationType", cdk.validateString)(properties.mutationType));
  errors.collect(cdk.propertyValidator("parameters", cdk.validateObject)(properties.parameters));
  errors.collect(cdk.propertyValidator("trustedResourceOwners", cdk.listValidator(cdk.validateString))(properties.trustedResourceOwners));
  return errors.wrap("supplied properties not correct for \"CfnDataLakeSettingsProps\"");
}

// @ts-ignore TS6133
function convertCfnDataLakeSettingsPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataLakeSettingsPropsValidator(properties).assertSuccess();
  return {
    "Admins": cdk.listMapper(convertCfnDataLakeSettingsDataLakePrincipalPropertyToCloudFormation)(properties.admins),
    "AllowExternalDataFiltering": cdk.booleanToCloudFormation(properties.allowExternalDataFiltering),
    "AllowFullTableExternalDataAccess": cdk.booleanToCloudFormation(properties.allowFullTableExternalDataAccess),
    "AuthorizedSessionTagValueList": cdk.listMapper(cdk.stringToCloudFormation)(properties.authorizedSessionTagValueList),
    "CreateDatabaseDefaultPermissions": cdk.listMapper(convertCfnDataLakeSettingsPrincipalPermissionsPropertyToCloudFormation)(properties.createDatabaseDefaultPermissions),
    "CreateTableDefaultPermissions": cdk.listMapper(convertCfnDataLakeSettingsPrincipalPermissionsPropertyToCloudFormation)(properties.createTableDefaultPermissions),
    "ExternalDataFilteringAllowList": cdk.listMapper(convertCfnDataLakeSettingsDataLakePrincipalPropertyToCloudFormation)(properties.externalDataFilteringAllowList),
    "MutationType": cdk.stringToCloudFormation(properties.mutationType),
    "Parameters": cdk.objectToCloudFormation(properties.parameters),
    "TrustedResourceOwners": cdk.listMapper(cdk.stringToCloudFormation)(properties.trustedResourceOwners)
  };
}

// @ts-ignore TS6133
function CfnDataLakeSettingsPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataLakeSettingsProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataLakeSettingsProps>();
  ret.addPropertyResult("admins", "Admins", (properties.Admins != null ? cfn_parse.FromCloudFormation.getArray(CfnDataLakeSettingsDataLakePrincipalPropertyFromCloudFormation)(properties.Admins) : undefined));
  ret.addPropertyResult("allowExternalDataFiltering", "AllowExternalDataFiltering", (properties.AllowExternalDataFiltering != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowExternalDataFiltering) : undefined));
  ret.addPropertyResult("allowFullTableExternalDataAccess", "AllowFullTableExternalDataAccess", (properties.AllowFullTableExternalDataAccess != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowFullTableExternalDataAccess) : undefined));
  ret.addPropertyResult("authorizedSessionTagValueList", "AuthorizedSessionTagValueList", (properties.AuthorizedSessionTagValueList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AuthorizedSessionTagValueList) : undefined));
  ret.addPropertyResult("createDatabaseDefaultPermissions", "CreateDatabaseDefaultPermissions", (properties.CreateDatabaseDefaultPermissions != null ? cfn_parse.FromCloudFormation.getArray(CfnDataLakeSettingsPrincipalPermissionsPropertyFromCloudFormation)(properties.CreateDatabaseDefaultPermissions) : undefined));
  ret.addPropertyResult("createTableDefaultPermissions", "CreateTableDefaultPermissions", (properties.CreateTableDefaultPermissions != null ? cfn_parse.FromCloudFormation.getArray(CfnDataLakeSettingsPrincipalPermissionsPropertyFromCloudFormation)(properties.CreateTableDefaultPermissions) : undefined));
  ret.addPropertyResult("externalDataFilteringAllowList", "ExternalDataFilteringAllowList", (properties.ExternalDataFilteringAllowList != null ? cfn_parse.FromCloudFormation.getArray(CfnDataLakeSettingsDataLakePrincipalPropertyFromCloudFormation)(properties.ExternalDataFilteringAllowList) : undefined));
  ret.addPropertyResult("mutationType", "MutationType", (properties.MutationType != null ? cfn_parse.FromCloudFormation.getString(properties.MutationType) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined));
  ret.addPropertyResult("trustedResourceOwners", "TrustedResourceOwners", (properties.TrustedResourceOwners != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TrustedResourceOwners) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::LakeFormation::Permissions` resource represents the permissions that a principal has on an AWS Glue Data Catalog resource (such as AWS Glue database or AWS Glue tables).
 *
 * When you upload a permissions stack, the permissions are granted to the principal and when you remove the stack, the permissions are revoked from the principal. If you remove a stack, and the principal does not have the permissions referenced in the stack then AWS Lake Formation will throw an error because you can’t call revoke on non-existing permissions. To successfully remove the stack, you’ll need to regrant those permissions and then remove the stack.
 *
 * > New versions of AWS Lake Formation permission resources are now available. For more information, see: [AWS:LakeFormation::PrincipalPermissions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-principalpermissions.html)
 *
 * @cloudformationResource AWS::LakeFormation::Permissions
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-permissions.html
 */
export class CfnPermissions extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::LakeFormation::Permissions";

  /**
   * Build a CfnPermissions from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPermissions(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A unique identifier for the batch permissions request entry.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The AWS Lake Formation principal.
   */
  public dataLakePrincipal: CfnPermissions.DataLakePrincipalProperty | cdk.IResolvable;

  /**
   * The permissions granted or revoked.
   */
  public permissions?: Array<string>;

  /**
   * Indicates the ability to grant permissions (as a subset of permissions granted).
   */
  public permissionsWithGrantOption?: Array<string>;

  /**
   * A structure for the resource.
   */
  public resource: cdk.IResolvable | CfnPermissions.ResourceProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPermissionsProps) {
    super(scope, id, {
      "type": CfnPermissions.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "dataLakePrincipal", this);
    cdk.requireProperty(props, "resource", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.dataLakePrincipal = props.dataLakePrincipal;
    this.permissions = props.permissions;
    this.permissionsWithGrantOption = props.permissionsWithGrantOption;
    this.resource = props.resource;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "dataLakePrincipal": this.dataLakePrincipal,
      "permissions": this.permissions,
      "permissionsWithGrantOption": this.permissionsWithGrantOption,
      "resource": this.resource
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPermissions.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPermissionsPropsToCloudFormation(props);
  }
}

export namespace CfnPermissions {
  /**
   * The Lake Formation principal.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-datalakeprincipal.html
   */
  export interface DataLakePrincipalProperty {
    /**
     * An identifier for the Lake Formation principal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-datalakeprincipal.html#cfn-lakeformation-permissions-datalakeprincipal-datalakeprincipalidentifier
     */
    readonly dataLakePrincipalIdentifier?: string;
  }

  /**
   * A structure for the resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-resource.html
   */
  export interface ResourceProperty {
    /**
     * A structure for the database object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-resource.html#cfn-lakeformation-permissions-resource-databaseresource
     */
    readonly databaseResource?: CfnPermissions.DatabaseResourceProperty | cdk.IResolvable;

    /**
     * A structure for a data location object where permissions are granted or revoked.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-resource.html#cfn-lakeformation-permissions-resource-datalocationresource
     */
    readonly dataLocationResource?: CfnPermissions.DataLocationResourceProperty | cdk.IResolvable;

    /**
     * A structure for the table object.
     *
     * A table is a metadata definition that represents your data. You can Grant and Revoke table privileges to a principal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-resource.html#cfn-lakeformation-permissions-resource-tableresource
     */
    readonly tableResource?: cdk.IResolvable | CfnPermissions.TableResourceProperty;

    /**
     * A structure for a table with columns object.
     *
     * This object is only used when granting a SELECT permission.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-resource.html#cfn-lakeformation-permissions-resource-tablewithcolumnsresource
     */
    readonly tableWithColumnsResource?: cdk.IResolvable | CfnPermissions.TableWithColumnsResourceProperty;
  }

  /**
   * A structure for the table object.
   *
   * A table is a metadata definition that represents your data. You can Grant and Revoke table privileges to a principal.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tableresource.html
   */
  export interface TableResourceProperty {
    /**
     * The identifier for the Data Catalog .
     *
     * By default, it is the account ID of the caller.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tableresource.html#cfn-lakeformation-permissions-tableresource-catalogid
     */
    readonly catalogId?: string;

    /**
     * The name of the database for the table.
     *
     * Unique to a Data Catalog. A database is a set of associated table definitions organized into a logical group. You can Grant and Revoke database privileges to a principal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tableresource.html#cfn-lakeformation-permissions-tableresource-databasename
     */
    readonly databaseName?: string;

    /**
     * The name of the table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tableresource.html#cfn-lakeformation-permissions-tableresource-name
     */
    readonly name?: string;

    /**
     * An empty object representing all tables under a database.
     *
     * If this field is specified instead of the `Name` field, all tables under `DatabaseName` will have permission changes applied.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tableresource.html#cfn-lakeformation-permissions-tableresource-tablewildcard
     */
    readonly tableWildcard?: cdk.IResolvable | CfnPermissions.TableWildcardProperty;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tablewildcard.html
   */
  export interface TableWildcardProperty {

  }

  /**
   * A structure for the database object.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-databaseresource.html
   */
  export interface DatabaseResourceProperty {
    /**
     * The identifier for the Data Catalog .
     *
     * By default, it is the account ID of the caller.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-databaseresource.html#cfn-lakeformation-permissions-databaseresource-catalogid
     */
    readonly catalogId?: string;

    /**
     * The name of the database resource.
     *
     * Unique to the Data Catalog.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-databaseresource.html#cfn-lakeformation-permissions-databaseresource-name
     */
    readonly name?: string;
  }

  /**
   * A structure for a data location object where permissions are granted or revoked.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-datalocationresource.html
   */
  export interface DataLocationResourceProperty {
    /**
     * The identifier for the Data Catalog .
     *
     * By default, it is the account ID of the caller.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-datalocationresource.html#cfn-lakeformation-permissions-datalocationresource-catalogid
     */
    readonly catalogId?: string;

    /**
     * The Amazon Resource Name (ARN) that uniquely identifies the data location resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-datalocationresource.html#cfn-lakeformation-permissions-datalocationresource-s3resource
     */
    readonly s3Resource?: string;
  }

  /**
   * A structure for a table with columns object. This object is only used when granting a SELECT permission.
   *
   * This object must take a value for at least one of `ColumnsNames` , `ColumnsIndexes` , or `ColumnsWildcard` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tablewithcolumnsresource.html
   */
  export interface TableWithColumnsResourceProperty {
    /**
     * The identifier for the Data Catalog .
     *
     * By default, it is the account ID of the caller.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tablewithcolumnsresource.html#cfn-lakeformation-permissions-tablewithcolumnsresource-catalogid
     */
    readonly catalogId?: string;

    /**
     * The list of column names for the table.
     *
     * At least one of `ColumnNames` or `ColumnWildcard` is required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tablewithcolumnsresource.html#cfn-lakeformation-permissions-tablewithcolumnsresource-columnnames
     */
    readonly columnNames?: Array<string>;

    /**
     * A wildcard specified by a `ColumnWildcard` object.
     *
     * At least one of `ColumnNames` or `ColumnWildcard` is required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tablewithcolumnsresource.html#cfn-lakeformation-permissions-tablewithcolumnsresource-columnwildcard
     */
    readonly columnWildcard?: CfnPermissions.ColumnWildcardProperty | cdk.IResolvable;

    /**
     * The name of the database for the table with columns resource.
     *
     * Unique to the Data Catalog. A database is a set of associated table definitions organized into a logical group. You can Grant and Revoke database privileges to a principal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tablewithcolumnsresource.html#cfn-lakeformation-permissions-tablewithcolumnsresource-databasename
     */
    readonly databaseName?: string;

    /**
     * The name of the table resource.
     *
     * A table is a metadata definition that represents your data. You can Grant and Revoke table privileges to a principal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-tablewithcolumnsresource.html#cfn-lakeformation-permissions-tablewithcolumnsresource-name
     */
    readonly name?: string;
  }

  /**
   * A wildcard object, consisting of an optional list of excluded column names or indexes.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-columnwildcard.html
   */
  export interface ColumnWildcardProperty {
    /**
     * Excludes column names.
     *
     * Any column with this name will be excluded.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-permissions-columnwildcard.html#cfn-lakeformation-permissions-columnwildcard-excludedcolumnnames
     */
    readonly excludedColumnNames?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnPermissions`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-permissions.html
 */
export interface CfnPermissionsProps {
  /**
   * The AWS Lake Formation principal.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-permissions.html#cfn-lakeformation-permissions-datalakeprincipal
   */
  readonly dataLakePrincipal: CfnPermissions.DataLakePrincipalProperty | cdk.IResolvable;

  /**
   * The permissions granted or revoked.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-permissions.html#cfn-lakeformation-permissions-permissions
   */
  readonly permissions?: Array<string>;

  /**
   * Indicates the ability to grant permissions (as a subset of permissions granted).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-permissions.html#cfn-lakeformation-permissions-permissionswithgrantoption
   */
  readonly permissionsWithGrantOption?: Array<string>;

  /**
   * A structure for the resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-permissions.html#cfn-lakeformation-permissions-resource
   */
  readonly resource: cdk.IResolvable | CfnPermissions.ResourceProperty;
}

/**
 * Determine whether the given properties match those of a `DataLakePrincipalProperty`
 *
 * @param properties - the TypeScript properties of a `DataLakePrincipalProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPermissionsDataLakePrincipalPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataLakePrincipalIdentifier", cdk.validateString)(properties.dataLakePrincipalIdentifier));
  return errors.wrap("supplied properties not correct for \"DataLakePrincipalProperty\"");
}

// @ts-ignore TS6133
function convertCfnPermissionsDataLakePrincipalPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPermissionsDataLakePrincipalPropertyValidator(properties).assertSuccess();
  return {
    "DataLakePrincipalIdentifier": cdk.stringToCloudFormation(properties.dataLakePrincipalIdentifier)
  };
}

// @ts-ignore TS6133
function CfnPermissionsDataLakePrincipalPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPermissions.DataLakePrincipalProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissions.DataLakePrincipalProperty>();
  ret.addPropertyResult("dataLakePrincipalIdentifier", "DataLakePrincipalIdentifier", (properties.DataLakePrincipalIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DataLakePrincipalIdentifier) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TableWildcardProperty`
 *
 * @param properties - the TypeScript properties of a `TableWildcardProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPermissionsTableWildcardPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  return errors.wrap("supplied properties not correct for \"TableWildcardProperty\"");
}

// @ts-ignore TS6133
function convertCfnPermissionsTableWildcardPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPermissionsTableWildcardPropertyValidator(properties).assertSuccess();
  return {};
}

// @ts-ignore TS6133
function CfnPermissionsTableWildcardPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPermissions.TableWildcardProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissions.TableWildcardProperty>();
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TableResourceProperty`
 *
 * @param properties - the TypeScript properties of a `TableResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPermissionsTableResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tableWildcard", CfnPermissionsTableWildcardPropertyValidator)(properties.tableWildcard));
  return errors.wrap("supplied properties not correct for \"TableResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnPermissionsTableResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPermissionsTableResourcePropertyValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "Name": cdk.stringToCloudFormation(properties.name),
    "TableWildcard": convertCfnPermissionsTableWildcardPropertyToCloudFormation(properties.tableWildcard)
  };
}

// @ts-ignore TS6133
function CfnPermissionsTableResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPermissions.TableResourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissions.TableResourceProperty>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tableWildcard", "TableWildcard", (properties.TableWildcard != null ? CfnPermissionsTableWildcardPropertyFromCloudFormation(properties.TableWildcard) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DatabaseResourceProperty`
 *
 * @param properties - the TypeScript properties of a `DatabaseResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPermissionsDatabaseResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"DatabaseResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnPermissionsDatabaseResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPermissionsDatabaseResourcePropertyValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnPermissionsDatabaseResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPermissions.DatabaseResourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissions.DatabaseResourceProperty>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataLocationResourceProperty`
 *
 * @param properties - the TypeScript properties of a `DataLocationResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPermissionsDataLocationResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("s3Resource", cdk.validateString)(properties.s3Resource));
  return errors.wrap("supplied properties not correct for \"DataLocationResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnPermissionsDataLocationResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPermissionsDataLocationResourcePropertyValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "S3Resource": cdk.stringToCloudFormation(properties.s3Resource)
  };
}

// @ts-ignore TS6133
function CfnPermissionsDataLocationResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPermissions.DataLocationResourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissions.DataLocationResourceProperty>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("s3Resource", "S3Resource", (properties.S3Resource != null ? cfn_parse.FromCloudFormation.getString(properties.S3Resource) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ColumnWildcardProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnWildcardProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPermissionsColumnWildcardPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("excludedColumnNames", cdk.listValidator(cdk.validateString))(properties.excludedColumnNames));
  return errors.wrap("supplied properties not correct for \"ColumnWildcardProperty\"");
}

// @ts-ignore TS6133
function convertCfnPermissionsColumnWildcardPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPermissionsColumnWildcardPropertyValidator(properties).assertSuccess();
  return {
    "ExcludedColumnNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.excludedColumnNames)
  };
}

// @ts-ignore TS6133
function CfnPermissionsColumnWildcardPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPermissions.ColumnWildcardProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissions.ColumnWildcardProperty>();
  ret.addPropertyResult("excludedColumnNames", "ExcludedColumnNames", (properties.ExcludedColumnNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExcludedColumnNames) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TableWithColumnsResourceProperty`
 *
 * @param properties - the TypeScript properties of a `TableWithColumnsResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPermissionsTableWithColumnsResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("columnNames", cdk.listValidator(cdk.validateString))(properties.columnNames));
  errors.collect(cdk.propertyValidator("columnWildcard", CfnPermissionsColumnWildcardPropertyValidator)(properties.columnWildcard));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"TableWithColumnsResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnPermissionsTableWithColumnsResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPermissionsTableWithColumnsResourcePropertyValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "ColumnNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.columnNames),
    "ColumnWildcard": convertCfnPermissionsColumnWildcardPropertyToCloudFormation(properties.columnWildcard),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnPermissionsTableWithColumnsResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPermissions.TableWithColumnsResourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissions.TableWithColumnsResourceProperty>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("columnNames", "ColumnNames", (properties.ColumnNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ColumnNames) : undefined));
  ret.addPropertyResult("columnWildcard", "ColumnWildcard", (properties.ColumnWildcard != null ? CfnPermissionsColumnWildcardPropertyFromCloudFormation(properties.ColumnWildcard) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResourceProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPermissionsResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataLocationResource", CfnPermissionsDataLocationResourcePropertyValidator)(properties.dataLocationResource));
  errors.collect(cdk.propertyValidator("databaseResource", CfnPermissionsDatabaseResourcePropertyValidator)(properties.databaseResource));
  errors.collect(cdk.propertyValidator("tableResource", CfnPermissionsTableResourcePropertyValidator)(properties.tableResource));
  errors.collect(cdk.propertyValidator("tableWithColumnsResource", CfnPermissionsTableWithColumnsResourcePropertyValidator)(properties.tableWithColumnsResource));
  return errors.wrap("supplied properties not correct for \"ResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnPermissionsResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPermissionsResourcePropertyValidator(properties).assertSuccess();
  return {
    "DataLocationResource": convertCfnPermissionsDataLocationResourcePropertyToCloudFormation(properties.dataLocationResource),
    "DatabaseResource": convertCfnPermissionsDatabaseResourcePropertyToCloudFormation(properties.databaseResource),
    "TableResource": convertCfnPermissionsTableResourcePropertyToCloudFormation(properties.tableResource),
    "TableWithColumnsResource": convertCfnPermissionsTableWithColumnsResourcePropertyToCloudFormation(properties.tableWithColumnsResource)
  };
}

// @ts-ignore TS6133
function CfnPermissionsResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPermissions.ResourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissions.ResourceProperty>();
  ret.addPropertyResult("databaseResource", "DatabaseResource", (properties.DatabaseResource != null ? CfnPermissionsDatabaseResourcePropertyFromCloudFormation(properties.DatabaseResource) : undefined));
  ret.addPropertyResult("dataLocationResource", "DataLocationResource", (properties.DataLocationResource != null ? CfnPermissionsDataLocationResourcePropertyFromCloudFormation(properties.DataLocationResource) : undefined));
  ret.addPropertyResult("tableResource", "TableResource", (properties.TableResource != null ? CfnPermissionsTableResourcePropertyFromCloudFormation(properties.TableResource) : undefined));
  ret.addPropertyResult("tableWithColumnsResource", "TableWithColumnsResource", (properties.TableWithColumnsResource != null ? CfnPermissionsTableWithColumnsResourcePropertyFromCloudFormation(properties.TableWithColumnsResource) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPermissionsProps`
 *
 * @param properties - the TypeScript properties of a `CfnPermissionsProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPermissionsPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataLakePrincipal", cdk.requiredValidator)(properties.dataLakePrincipal));
  errors.collect(cdk.propertyValidator("dataLakePrincipal", CfnPermissionsDataLakePrincipalPropertyValidator)(properties.dataLakePrincipal));
  errors.collect(cdk.propertyValidator("permissions", cdk.listValidator(cdk.validateString))(properties.permissions));
  errors.collect(cdk.propertyValidator("permissionsWithGrantOption", cdk.listValidator(cdk.validateString))(properties.permissionsWithGrantOption));
  errors.collect(cdk.propertyValidator("resource", cdk.requiredValidator)(properties.resource));
  errors.collect(cdk.propertyValidator("resource", CfnPermissionsResourcePropertyValidator)(properties.resource));
  return errors.wrap("supplied properties not correct for \"CfnPermissionsProps\"");
}

// @ts-ignore TS6133
function convertCfnPermissionsPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPermissionsPropsValidator(properties).assertSuccess();
  return {
    "DataLakePrincipal": convertCfnPermissionsDataLakePrincipalPropertyToCloudFormation(properties.dataLakePrincipal),
    "Permissions": cdk.listMapper(cdk.stringToCloudFormation)(properties.permissions),
    "PermissionsWithGrantOption": cdk.listMapper(cdk.stringToCloudFormation)(properties.permissionsWithGrantOption),
    "Resource": convertCfnPermissionsResourcePropertyToCloudFormation(properties.resource)
  };
}

// @ts-ignore TS6133
function CfnPermissionsPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPermissionsProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPermissionsProps>();
  ret.addPropertyResult("dataLakePrincipal", "DataLakePrincipal", (properties.DataLakePrincipal != null ? CfnPermissionsDataLakePrincipalPropertyFromCloudFormation(properties.DataLakePrincipal) : undefined));
  ret.addPropertyResult("permissions", "Permissions", (properties.Permissions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Permissions) : undefined));
  ret.addPropertyResult("permissionsWithGrantOption", "PermissionsWithGrantOption", (properties.PermissionsWithGrantOption != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.PermissionsWithGrantOption) : undefined));
  ret.addPropertyResult("resource", "Resource", (properties.Resource != null ? CfnPermissionsResourcePropertyFromCloudFormation(properties.Resource) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::LakeFormation::PrincipalPermissions` resource represents the permissions that a principal has on a Data Catalog resource (such as AWS Glue databases or AWS Glue tables).
 *
 * When you create a `PrincipalPermissions` resource, the permissions are granted via the AWS Lake Formation `GrantPermissions` API operation. When you delete a `PrincipalPermissions` resource, the permissions on principal-resource pair are revoked via the AWS Lake Formation `RevokePermissions` API operation.
 *
 * @cloudformationResource AWS::LakeFormation::PrincipalPermissions
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-principalpermissions.html
 */
export class CfnPrincipalPermissions extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::LakeFormation::PrincipalPermissions";

  /**
   * Build a CfnPrincipalPermissions from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPrincipalPermissions(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Json encoding of the input principal. For example: `{"DataLakePrincipalIdentifier":"arn:aws:iam::123456789012:role/ExampleRole"}`
   *
   * @cloudformationAttribute PrincipalIdentifier
   */
  public readonly attrPrincipalIdentifier: string;

  /**
   * Json encoding of the input resource. For example: `{"Catalog":null,"Database":null,"Table":null,"TableWithColumns":null,"DataLocation":null,"DataCellsFilter":{"TableCatalogId":"123456789012","DatabaseName":"ExampleDatabase","TableName":"ExampleTable","Name":"ExampleFilter"},"LFTag":null,"LFTagPolicy":null}`
   *
   * @cloudformationAttribute ResourceIdentifier
   */
  public readonly attrResourceIdentifier: string;

  /**
   * The identifier for the Data Catalog .
   */
  public catalog?: string;

  /**
   * The permissions granted or revoked.
   */
  public permissions: Array<string>;

  /**
   * Indicates the ability to grant permissions (as a subset of permissions granted).
   */
  public permissionsWithGrantOption: Array<string>;

  /**
   * The principal to be granted a permission.
   */
  public principal: CfnPrincipalPermissions.DataLakePrincipalProperty | cdk.IResolvable;

  /**
   * The resource to be granted or revoked permissions.
   */
  public resource: cdk.IResolvable | CfnPrincipalPermissions.ResourceProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPrincipalPermissionsProps) {
    super(scope, id, {
      "type": CfnPrincipalPermissions.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "permissions", this);
    cdk.requireProperty(props, "permissionsWithGrantOption", this);
    cdk.requireProperty(props, "principal", this);
    cdk.requireProperty(props, "resource", this);

    this.attrPrincipalIdentifier = cdk.Token.asString(this.getAtt("PrincipalIdentifier", cdk.ResolutionTypeHint.STRING));
    this.attrResourceIdentifier = cdk.Token.asString(this.getAtt("ResourceIdentifier", cdk.ResolutionTypeHint.STRING));
    this.catalog = props.catalog;
    this.permissions = props.permissions;
    this.permissionsWithGrantOption = props.permissionsWithGrantOption;
    this.principal = props.principal;
    this.resource = props.resource;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "catalog": this.catalog,
      "permissions": this.permissions,
      "permissionsWithGrantOption": this.permissionsWithGrantOption,
      "principal": this.principal,
      "resource": this.resource
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPrincipalPermissions.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPrincipalPermissionsPropsToCloudFormation(props);
  }
}

export namespace CfnPrincipalPermissions {
  /**
   * A structure for the resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-resource.html
   */
  export interface ResourceProperty {
    /**
     * The identifier for the Data Catalog.
     *
     * By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your AWS Lake Formation environment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-resource.html#cfn-lakeformation-principalpermissions-resource-catalog
     */
    readonly catalog?: any | cdk.IResolvable;

    /**
     * The database for the resource.
     *
     * Unique to the Data Catalog. A database is a set of associated table definitions organized into a logical group. You can Grant and Revoke database permissions to a principal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-resource.html#cfn-lakeformation-principalpermissions-resource-database
     */
    readonly database?: CfnPrincipalPermissions.DatabaseResourceProperty | cdk.IResolvable;

    /**
     * A data cell filter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-resource.html#cfn-lakeformation-principalpermissions-resource-datacellsfilter
     */
    readonly dataCellsFilter?: CfnPrincipalPermissions.DataCellsFilterResourceProperty | cdk.IResolvable;

    /**
     * The location of an Amazon S3 path where permissions are granted or revoked.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-resource.html#cfn-lakeformation-principalpermissions-resource-datalocation
     */
    readonly dataLocation?: CfnPrincipalPermissions.DataLocationResourceProperty | cdk.IResolvable;

    /**
     * The LF-tag key and values attached to a resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-resource.html#cfn-lakeformation-principalpermissions-resource-lftag
     */
    readonly lfTag?: cdk.IResolvable | CfnPrincipalPermissions.LFTagKeyResourceProperty;

    /**
     * A list of LF-tag conditions that define a resource's LF-tag policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-resource.html#cfn-lakeformation-principalpermissions-resource-lftagpolicy
     */
    readonly lfTagPolicy?: cdk.IResolvable | CfnPrincipalPermissions.LFTagPolicyResourceProperty;

    /**
     * The table for the resource.
     *
     * A table is a metadata definition that represents your data. You can Grant and Revoke table privileges to a principal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-resource.html#cfn-lakeformation-principalpermissions-resource-table
     */
    readonly table?: cdk.IResolvable | CfnPrincipalPermissions.TableResourceProperty;

    /**
     * The table with columns for the resource.
     *
     * A principal with permissions to this resource can select metadata from the columns of a table in the Data Catalog and the underlying data in Amazon S3.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-resource.html#cfn-lakeformation-principalpermissions-resource-tablewithcolumns
     */
    readonly tableWithColumns?: cdk.IResolvable | CfnPrincipalPermissions.TableWithColumnsResourceProperty;
  }

  /**
   * A structure containing an LF-tag key and values for a resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-lftagkeyresource.html
   */
  export interface LFTagKeyResourceProperty {
    /**
     * The identifier for the Data Catalog where the location is registered with Data Catalog .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-lftagkeyresource.html#cfn-lakeformation-principalpermissions-lftagkeyresource-catalogid
     */
    readonly catalogId: string;

    /**
     * The key-name for the LF-tag.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-lftagkeyresource.html#cfn-lakeformation-principalpermissions-lftagkeyresource-tagkey
     */
    readonly tagKey: string;

    /**
     * A list of possible values for the corresponding `TagKey` of an LF-tag key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-lftagkeyresource.html#cfn-lakeformation-principalpermissions-lftagkeyresource-tagvalues
     */
    readonly tagValues: Array<string>;
  }

  /**
   * A structure for the table object.
   *
   * A table is a metadata definition that represents your data. You can Grant and Revoke table privileges to a principal.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-tableresource.html
   */
  export interface TableResourceProperty {
    /**
     * The identifier for the Data Catalog.
     *
     * By default, it is the account ID of the caller.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-tableresource.html#cfn-lakeformation-principalpermissions-tableresource-catalogid
     */
    readonly catalogId: string;

    /**
     * The name of the database for the table.
     *
     * Unique to a Data Catalog. A database is a set of associated table definitions organized into a logical group. You can Grant and Revoke database privileges to a principal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-tableresource.html#cfn-lakeformation-principalpermissions-tableresource-databasename
     */
    readonly databaseName: string;

    /**
     * The name of the table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-tableresource.html#cfn-lakeformation-principalpermissions-tableresource-name
     */
    readonly name?: string;

    /**
     * A wildcard object representing every table under a database.
     *
     * At least one of `TableResource$Name` or `TableResource$TableWildcard` is required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-tableresource.html#cfn-lakeformation-principalpermissions-tableresource-tablewildcard
     */
    readonly tableWildcard?: any | cdk.IResolvable;
  }

  /**
   * A structure that describes certain columns on certain rows.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-datacellsfilterresource.html
   */
  export interface DataCellsFilterResourceProperty {
    /**
     * A database in the Data Catalog .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-datacellsfilterresource.html#cfn-lakeformation-principalpermissions-datacellsfilterresource-databasename
     */
    readonly databaseName: string;

    /**
     * The name given by the user to the data filter cell.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-datacellsfilterresource.html#cfn-lakeformation-principalpermissions-datacellsfilterresource-name
     */
    readonly name: string;

    /**
     * The ID of the catalog to which the table belongs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-datacellsfilterresource.html#cfn-lakeformation-principalpermissions-datacellsfilterresource-tablecatalogid
     */
    readonly tableCatalogId: string;

    /**
     * The name of the table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-datacellsfilterresource.html#cfn-lakeformation-principalpermissions-datacellsfilterresource-tablename
     */
    readonly tableName: string;
  }

  /**
   * A structure for a table with columns object. This object is only used when granting a SELECT permission.
   *
   * This object must take a value for at least one of `ColumnsNames` , `ColumnsIndexes` , or `ColumnsWildcard` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-tablewithcolumnsresource.html
   */
  export interface TableWithColumnsResourceProperty {
    /**
     * The identifier for the Data Catalog where the location is registered with AWS Lake Formation .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-tablewithcolumnsresource.html#cfn-lakeformation-principalpermissions-tablewithcolumnsresource-catalogid
     */
    readonly catalogId: string;

    /**
     * The list of column names for the table.
     *
     * At least one of `ColumnNames` or `ColumnWildcard` is required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-tablewithcolumnsresource.html#cfn-lakeformation-principalpermissions-tablewithcolumnsresource-columnnames
     */
    readonly columnNames?: Array<string>;

    /**
     * A wildcard specified by a `ColumnWildcard` object.
     *
     * At least one of `ColumnNames` or `ColumnWildcard` is required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-tablewithcolumnsresource.html#cfn-lakeformation-principalpermissions-tablewithcolumnsresource-columnwildcard
     */
    readonly columnWildcard?: CfnPrincipalPermissions.ColumnWildcardProperty | cdk.IResolvable;

    /**
     * The name of the database for the table with columns resource.
     *
     * Unique to the Data Catalog. A database is a set of associated table definitions organized into a logical group. You can Grant and Revoke database privileges to a principal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-tablewithcolumnsresource.html#cfn-lakeformation-principalpermissions-tablewithcolumnsresource-databasename
     */
    readonly databaseName: string;

    /**
     * The name of the table resource.
     *
     * A table is a metadata definition that represents your data. You can Grant and Revoke table privileges to a principal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-tablewithcolumnsresource.html#cfn-lakeformation-principalpermissions-tablewithcolumnsresource-name
     */
    readonly name: string;
  }

  /**
   * A wildcard object, consisting of an optional list of excluded column names or indexes.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-columnwildcard.html
   */
  export interface ColumnWildcardProperty {
    /**
     * Excludes column names.
     *
     * Any column with this name will be excluded.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-columnwildcard.html#cfn-lakeformation-principalpermissions-columnwildcard-excludedcolumnnames
     */
    readonly excludedColumnNames?: Array<string>;
  }

  /**
   * A list of LF-tag conditions that define a resource's LF-tag policy.
   *
   * A structure that allows an admin to grant user permissions on certain conditions. For example, granting a role access to all columns that do not have the LF-tag 'PII' in tables that have the LF-tag 'Prod'.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-lftagpolicyresource.html
   */
  export interface LFTagPolicyResourceProperty {
    /**
     * The identifier for the Data Catalog .
     *
     * The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your AWS Lake Formation environment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-lftagpolicyresource.html#cfn-lakeformation-principalpermissions-lftagpolicyresource-catalogid
     */
    readonly catalogId: string;

    /**
     * A list of LF-tag conditions that apply to the resource's LF-tag policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-lftagpolicyresource.html#cfn-lakeformation-principalpermissions-lftagpolicyresource-expression
     */
    readonly expression: Array<cdk.IResolvable | CfnPrincipalPermissions.LFTagProperty> | cdk.IResolvable;

    /**
     * The resource type for which the LF-tag policy applies.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-lftagpolicyresource.html#cfn-lakeformation-principalpermissions-lftagpolicyresource-resourcetype
     */
    readonly resourceType: string;
  }

  /**
   * The LF-tag key and values attached to a resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-lftag.html
   */
  export interface LFTagProperty {
    /**
     * The key-name for the LF-tag.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-lftag.html#cfn-lakeformation-principalpermissions-lftag-tagkey
     */
    readonly tagKey?: string;

    /**
     * A list of possible values of the corresponding `TagKey` of an LF-tag key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-lftag.html#cfn-lakeformation-principalpermissions-lftag-tagvalues
     */
    readonly tagValues?: Array<string>;
  }

  /**
   * A structure for the database object.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-databaseresource.html
   */
  export interface DatabaseResourceProperty {
    /**
     * The identifier for the Data Catalog.
     *
     * By default, it is the account ID of the caller.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-databaseresource.html#cfn-lakeformation-principalpermissions-databaseresource-catalogid
     */
    readonly catalogId: string;

    /**
     * The name of the database resource.
     *
     * Unique to the Data Catalog.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-databaseresource.html#cfn-lakeformation-principalpermissions-databaseresource-name
     */
    readonly name: string;
  }

  /**
   * A structure for a data location object where permissions are granted or revoked.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-datalocationresource.html
   */
  export interface DataLocationResourceProperty {
    /**
     * The identifier for the Data Catalog where the location is registered with AWS Lake Formation .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-datalocationresource.html#cfn-lakeformation-principalpermissions-datalocationresource-catalogid
     */
    readonly catalogId: string;

    /**
     * The Amazon Resource Name (ARN) that uniquely identifies the data location resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-datalocationresource.html#cfn-lakeformation-principalpermissions-datalocationresource-resourcearn
     */
    readonly resourceArn: string;
  }

  /**
   * The AWS Lake Formation principal.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-datalakeprincipal.html
   */
  export interface DataLakePrincipalProperty {
    /**
     * An identifier for the AWS Lake Formation principal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-principalpermissions-datalakeprincipal.html#cfn-lakeformation-principalpermissions-datalakeprincipal-datalakeprincipalidentifier
     */
    readonly dataLakePrincipalIdentifier?: string;
  }
}

/**
 * Properties for defining a `CfnPrincipalPermissions`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-principalpermissions.html
 */
export interface CfnPrincipalPermissionsProps {
  /**
   * The identifier for the Data Catalog .
   *
   * By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your Lake Formation environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-principalpermissions.html#cfn-lakeformation-principalpermissions-catalog
   */
  readonly catalog?: string;

  /**
   * The permissions granted or revoked.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-principalpermissions.html#cfn-lakeformation-principalpermissions-permissions
   */
  readonly permissions: Array<string>;

  /**
   * Indicates the ability to grant permissions (as a subset of permissions granted).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-principalpermissions.html#cfn-lakeformation-principalpermissions-permissionswithgrantoption
   */
  readonly permissionsWithGrantOption: Array<string>;

  /**
   * The principal to be granted a permission.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-principalpermissions.html#cfn-lakeformation-principalpermissions-principal
   */
  readonly principal: CfnPrincipalPermissions.DataLakePrincipalProperty | cdk.IResolvable;

  /**
   * The resource to be granted or revoked permissions.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-principalpermissions.html#cfn-lakeformation-principalpermissions-resource
   */
  readonly resource: cdk.IResolvable | CfnPrincipalPermissions.ResourceProperty;
}

/**
 * Determine whether the given properties match those of a `LFTagKeyResourceProperty`
 *
 * @param properties - the TypeScript properties of a `LFTagKeyResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPrincipalPermissionsLFTagKeyResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.requiredValidator)(properties.catalogId));
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("tagKey", cdk.requiredValidator)(properties.tagKey));
  errors.collect(cdk.propertyValidator("tagKey", cdk.validateString)(properties.tagKey));
  errors.collect(cdk.propertyValidator("tagValues", cdk.requiredValidator)(properties.tagValues));
  errors.collect(cdk.propertyValidator("tagValues", cdk.listValidator(cdk.validateString))(properties.tagValues));
  return errors.wrap("supplied properties not correct for \"LFTagKeyResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnPrincipalPermissionsLFTagKeyResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPrincipalPermissionsLFTagKeyResourcePropertyValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "TagKey": cdk.stringToCloudFormation(properties.tagKey),
    "TagValues": cdk.listMapper(cdk.stringToCloudFormation)(properties.tagValues)
  };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsLFTagKeyResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPrincipalPermissions.LFTagKeyResourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissions.LFTagKeyResourceProperty>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("tagKey", "TagKey", (properties.TagKey != null ? cfn_parse.FromCloudFormation.getString(properties.TagKey) : undefined));
  ret.addPropertyResult("tagValues", "TagValues", (properties.TagValues != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TagValues) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TableResourceProperty`
 *
 * @param properties - the TypeScript properties of a `TableResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPrincipalPermissionsTableResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.requiredValidator)(properties.catalogId));
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("databaseName", cdk.requiredValidator)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tableWildcard", cdk.validateObject)(properties.tableWildcard));
  return errors.wrap("supplied properties not correct for \"TableResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnPrincipalPermissionsTableResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPrincipalPermissionsTableResourcePropertyValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "Name": cdk.stringToCloudFormation(properties.name),
    "TableWildcard": cdk.objectToCloudFormation(properties.tableWildcard)
  };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsTableResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPrincipalPermissions.TableResourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissions.TableResourceProperty>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tableWildcard", "TableWildcard", (properties.TableWildcard != null ? cfn_parse.FromCloudFormation.getAny(properties.TableWildcard) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataCellsFilterResourceProperty`
 *
 * @param properties - the TypeScript properties of a `DataCellsFilterResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPrincipalPermissionsDataCellsFilterResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("databaseName", cdk.requiredValidator)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tableCatalogId", cdk.requiredValidator)(properties.tableCatalogId));
  errors.collect(cdk.propertyValidator("tableCatalogId", cdk.validateString)(properties.tableCatalogId));
  errors.collect(cdk.propertyValidator("tableName", cdk.requiredValidator)(properties.tableName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  return errors.wrap("supplied properties not correct for \"DataCellsFilterResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnPrincipalPermissionsDataCellsFilterResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPrincipalPermissionsDataCellsFilterResourcePropertyValidator(properties).assertSuccess();
  return {
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "Name": cdk.stringToCloudFormation(properties.name),
    "TableCatalogId": cdk.stringToCloudFormation(properties.tableCatalogId),
    "TableName": cdk.stringToCloudFormation(properties.tableName)
  };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsDataCellsFilterResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPrincipalPermissions.DataCellsFilterResourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissions.DataCellsFilterResourceProperty>();
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tableCatalogId", "TableCatalogId", (properties.TableCatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.TableCatalogId) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ColumnWildcardProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnWildcardProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPrincipalPermissionsColumnWildcardPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("excludedColumnNames", cdk.listValidator(cdk.validateString))(properties.excludedColumnNames));
  return errors.wrap("supplied properties not correct for \"ColumnWildcardProperty\"");
}

// @ts-ignore TS6133
function convertCfnPrincipalPermissionsColumnWildcardPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPrincipalPermissionsColumnWildcardPropertyValidator(properties).assertSuccess();
  return {
    "ExcludedColumnNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.excludedColumnNames)
  };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsColumnWildcardPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPrincipalPermissions.ColumnWildcardProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissions.ColumnWildcardProperty>();
  ret.addPropertyResult("excludedColumnNames", "ExcludedColumnNames", (properties.ExcludedColumnNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExcludedColumnNames) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TableWithColumnsResourceProperty`
 *
 * @param properties - the TypeScript properties of a `TableWithColumnsResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPrincipalPermissionsTableWithColumnsResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.requiredValidator)(properties.catalogId));
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("columnNames", cdk.listValidator(cdk.validateString))(properties.columnNames));
  errors.collect(cdk.propertyValidator("columnWildcard", CfnPrincipalPermissionsColumnWildcardPropertyValidator)(properties.columnWildcard));
  errors.collect(cdk.propertyValidator("databaseName", cdk.requiredValidator)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"TableWithColumnsResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnPrincipalPermissionsTableWithColumnsResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPrincipalPermissionsTableWithColumnsResourcePropertyValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "ColumnNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.columnNames),
    "ColumnWildcard": convertCfnPrincipalPermissionsColumnWildcardPropertyToCloudFormation(properties.columnWildcard),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsTableWithColumnsResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPrincipalPermissions.TableWithColumnsResourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissions.TableWithColumnsResourceProperty>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("columnNames", "ColumnNames", (properties.ColumnNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ColumnNames) : undefined));
  ret.addPropertyResult("columnWildcard", "ColumnWildcard", (properties.ColumnWildcard != null ? CfnPrincipalPermissionsColumnWildcardPropertyFromCloudFormation(properties.ColumnWildcard) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LFTagProperty`
 *
 * @param properties - the TypeScript properties of a `LFTagProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPrincipalPermissionsLFTagPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("tagKey", cdk.validateString)(properties.tagKey));
  errors.collect(cdk.propertyValidator("tagValues", cdk.listValidator(cdk.validateString))(properties.tagValues));
  return errors.wrap("supplied properties not correct for \"LFTagProperty\"");
}

// @ts-ignore TS6133
function convertCfnPrincipalPermissionsLFTagPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPrincipalPermissionsLFTagPropertyValidator(properties).assertSuccess();
  return {
    "TagKey": cdk.stringToCloudFormation(properties.tagKey),
    "TagValues": cdk.listMapper(cdk.stringToCloudFormation)(properties.tagValues)
  };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsLFTagPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPrincipalPermissions.LFTagProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissions.LFTagProperty>();
  ret.addPropertyResult("tagKey", "TagKey", (properties.TagKey != null ? cfn_parse.FromCloudFormation.getString(properties.TagKey) : undefined));
  ret.addPropertyResult("tagValues", "TagValues", (properties.TagValues != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TagValues) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LFTagPolicyResourceProperty`
 *
 * @param properties - the TypeScript properties of a `LFTagPolicyResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPrincipalPermissionsLFTagPolicyResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.requiredValidator)(properties.catalogId));
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("expression", cdk.requiredValidator)(properties.expression));
  errors.collect(cdk.propertyValidator("expression", cdk.listValidator(CfnPrincipalPermissionsLFTagPropertyValidator))(properties.expression));
  errors.collect(cdk.propertyValidator("resourceType", cdk.requiredValidator)(properties.resourceType));
  errors.collect(cdk.propertyValidator("resourceType", cdk.validateString)(properties.resourceType));
  return errors.wrap("supplied properties not correct for \"LFTagPolicyResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnPrincipalPermissionsLFTagPolicyResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPrincipalPermissionsLFTagPolicyResourcePropertyValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "Expression": cdk.listMapper(convertCfnPrincipalPermissionsLFTagPropertyToCloudFormation)(properties.expression),
    "ResourceType": cdk.stringToCloudFormation(properties.resourceType)
  };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsLFTagPolicyResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPrincipalPermissions.LFTagPolicyResourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissions.LFTagPolicyResourceProperty>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("expression", "Expression", (properties.Expression != null ? cfn_parse.FromCloudFormation.getArray(CfnPrincipalPermissionsLFTagPropertyFromCloudFormation)(properties.Expression) : undefined));
  ret.addPropertyResult("resourceType", "ResourceType", (properties.ResourceType != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DatabaseResourceProperty`
 *
 * @param properties - the TypeScript properties of a `DatabaseResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPrincipalPermissionsDatabaseResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.requiredValidator)(properties.catalogId));
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"DatabaseResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnPrincipalPermissionsDatabaseResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPrincipalPermissionsDatabaseResourcePropertyValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsDatabaseResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPrincipalPermissions.DatabaseResourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissions.DatabaseResourceProperty>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataLocationResourceProperty`
 *
 * @param properties - the TypeScript properties of a `DataLocationResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPrincipalPermissionsDataLocationResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.requiredValidator)(properties.catalogId));
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.requiredValidator)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.validateString)(properties.resourceArn));
  return errors.wrap("supplied properties not correct for \"DataLocationResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnPrincipalPermissionsDataLocationResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPrincipalPermissionsDataLocationResourcePropertyValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "ResourceArn": cdk.stringToCloudFormation(properties.resourceArn)
  };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsDataLocationResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPrincipalPermissions.DataLocationResourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissions.DataLocationResourceProperty>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("resourceArn", "ResourceArn", (properties.ResourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResourceProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPrincipalPermissionsResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalog", cdk.validateObject)(properties.catalog));
  errors.collect(cdk.propertyValidator("dataCellsFilter", CfnPrincipalPermissionsDataCellsFilterResourcePropertyValidator)(properties.dataCellsFilter));
  errors.collect(cdk.propertyValidator("dataLocation", CfnPrincipalPermissionsDataLocationResourcePropertyValidator)(properties.dataLocation));
  errors.collect(cdk.propertyValidator("database", CfnPrincipalPermissionsDatabaseResourcePropertyValidator)(properties.database));
  errors.collect(cdk.propertyValidator("lfTag", CfnPrincipalPermissionsLFTagKeyResourcePropertyValidator)(properties.lfTag));
  errors.collect(cdk.propertyValidator("lfTagPolicy", CfnPrincipalPermissionsLFTagPolicyResourcePropertyValidator)(properties.lfTagPolicy));
  errors.collect(cdk.propertyValidator("table", CfnPrincipalPermissionsTableResourcePropertyValidator)(properties.table));
  errors.collect(cdk.propertyValidator("tableWithColumns", CfnPrincipalPermissionsTableWithColumnsResourcePropertyValidator)(properties.tableWithColumns));
  return errors.wrap("supplied properties not correct for \"ResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnPrincipalPermissionsResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPrincipalPermissionsResourcePropertyValidator(properties).assertSuccess();
  return {
    "Catalog": cdk.objectToCloudFormation(properties.catalog),
    "DataCellsFilter": convertCfnPrincipalPermissionsDataCellsFilterResourcePropertyToCloudFormation(properties.dataCellsFilter),
    "DataLocation": convertCfnPrincipalPermissionsDataLocationResourcePropertyToCloudFormation(properties.dataLocation),
    "Database": convertCfnPrincipalPermissionsDatabaseResourcePropertyToCloudFormation(properties.database),
    "LFTag": convertCfnPrincipalPermissionsLFTagKeyResourcePropertyToCloudFormation(properties.lfTag),
    "LFTagPolicy": convertCfnPrincipalPermissionsLFTagPolicyResourcePropertyToCloudFormation(properties.lfTagPolicy),
    "Table": convertCfnPrincipalPermissionsTableResourcePropertyToCloudFormation(properties.table),
    "TableWithColumns": convertCfnPrincipalPermissionsTableWithColumnsResourcePropertyToCloudFormation(properties.tableWithColumns)
  };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPrincipalPermissions.ResourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissions.ResourceProperty>();
  ret.addPropertyResult("catalog", "Catalog", (properties.Catalog != null ? cfn_parse.FromCloudFormation.getAny(properties.Catalog) : undefined));
  ret.addPropertyResult("database", "Database", (properties.Database != null ? CfnPrincipalPermissionsDatabaseResourcePropertyFromCloudFormation(properties.Database) : undefined));
  ret.addPropertyResult("dataCellsFilter", "DataCellsFilter", (properties.DataCellsFilter != null ? CfnPrincipalPermissionsDataCellsFilterResourcePropertyFromCloudFormation(properties.DataCellsFilter) : undefined));
  ret.addPropertyResult("dataLocation", "DataLocation", (properties.DataLocation != null ? CfnPrincipalPermissionsDataLocationResourcePropertyFromCloudFormation(properties.DataLocation) : undefined));
  ret.addPropertyResult("lfTag", "LFTag", (properties.LFTag != null ? CfnPrincipalPermissionsLFTagKeyResourcePropertyFromCloudFormation(properties.LFTag) : undefined));
  ret.addPropertyResult("lfTagPolicy", "LFTagPolicy", (properties.LFTagPolicy != null ? CfnPrincipalPermissionsLFTagPolicyResourcePropertyFromCloudFormation(properties.LFTagPolicy) : undefined));
  ret.addPropertyResult("table", "Table", (properties.Table != null ? CfnPrincipalPermissionsTableResourcePropertyFromCloudFormation(properties.Table) : undefined));
  ret.addPropertyResult("tableWithColumns", "TableWithColumns", (properties.TableWithColumns != null ? CfnPrincipalPermissionsTableWithColumnsResourcePropertyFromCloudFormation(properties.TableWithColumns) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataLakePrincipalProperty`
 *
 * @param properties - the TypeScript properties of a `DataLakePrincipalProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPrincipalPermissionsDataLakePrincipalPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataLakePrincipalIdentifier", cdk.validateString)(properties.dataLakePrincipalIdentifier));
  return errors.wrap("supplied properties not correct for \"DataLakePrincipalProperty\"");
}

// @ts-ignore TS6133
function convertCfnPrincipalPermissionsDataLakePrincipalPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPrincipalPermissionsDataLakePrincipalPropertyValidator(properties).assertSuccess();
  return {
    "DataLakePrincipalIdentifier": cdk.stringToCloudFormation(properties.dataLakePrincipalIdentifier)
  };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsDataLakePrincipalPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPrincipalPermissions.DataLakePrincipalProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissions.DataLakePrincipalProperty>();
  ret.addPropertyResult("dataLakePrincipalIdentifier", "DataLakePrincipalIdentifier", (properties.DataLakePrincipalIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DataLakePrincipalIdentifier) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPrincipalPermissionsProps`
 *
 * @param properties - the TypeScript properties of a `CfnPrincipalPermissionsProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPrincipalPermissionsPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalog", cdk.validateString)(properties.catalog));
  errors.collect(cdk.propertyValidator("permissions", cdk.requiredValidator)(properties.permissions));
  errors.collect(cdk.propertyValidator("permissions", cdk.listValidator(cdk.validateString))(properties.permissions));
  errors.collect(cdk.propertyValidator("permissionsWithGrantOption", cdk.requiredValidator)(properties.permissionsWithGrantOption));
  errors.collect(cdk.propertyValidator("permissionsWithGrantOption", cdk.listValidator(cdk.validateString))(properties.permissionsWithGrantOption));
  errors.collect(cdk.propertyValidator("principal", cdk.requiredValidator)(properties.principal));
  errors.collect(cdk.propertyValidator("principal", CfnPrincipalPermissionsDataLakePrincipalPropertyValidator)(properties.principal));
  errors.collect(cdk.propertyValidator("resource", cdk.requiredValidator)(properties.resource));
  errors.collect(cdk.propertyValidator("resource", CfnPrincipalPermissionsResourcePropertyValidator)(properties.resource));
  return errors.wrap("supplied properties not correct for \"CfnPrincipalPermissionsProps\"");
}

// @ts-ignore TS6133
function convertCfnPrincipalPermissionsPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPrincipalPermissionsPropsValidator(properties).assertSuccess();
  return {
    "Catalog": cdk.stringToCloudFormation(properties.catalog),
    "Permissions": cdk.listMapper(cdk.stringToCloudFormation)(properties.permissions),
    "PermissionsWithGrantOption": cdk.listMapper(cdk.stringToCloudFormation)(properties.permissionsWithGrantOption),
    "Principal": convertCfnPrincipalPermissionsDataLakePrincipalPropertyToCloudFormation(properties.principal),
    "Resource": convertCfnPrincipalPermissionsResourcePropertyToCloudFormation(properties.resource)
  };
}

// @ts-ignore TS6133
function CfnPrincipalPermissionsPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPrincipalPermissionsProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPrincipalPermissionsProps>();
  ret.addPropertyResult("catalog", "Catalog", (properties.Catalog != null ? cfn_parse.FromCloudFormation.getString(properties.Catalog) : undefined));
  ret.addPropertyResult("permissions", "Permissions", (properties.Permissions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Permissions) : undefined));
  ret.addPropertyResult("permissionsWithGrantOption", "PermissionsWithGrantOption", (properties.PermissionsWithGrantOption != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.PermissionsWithGrantOption) : undefined));
  ret.addPropertyResult("principal", "Principal", (properties.Principal != null ? CfnPrincipalPermissionsDataLakePrincipalPropertyFromCloudFormation(properties.Principal) : undefined));
  ret.addPropertyResult("resource", "Resource", (properties.Resource != null ? CfnPrincipalPermissionsResourcePropertyFromCloudFormation(properties.Resource) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::LakeFormation::Resource` represents the data (  buckets and folders) that is being registered with AWS Lake Formation .
 *
 * During a stack operation, AWS CloudFormation calls the AWS Lake Formation [`RegisterResource`](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-credential-vending.html#aws-lake-formation-api-credential-vending-RegisterResource) API operation to register the resource. To remove a `Resource` type, AWS CloudFormation calls the AWS Lake Formation [`DeregisterResource`](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-credential-vending.html#aws-lake-formation-api-credential-vending-DeregisterResource) API operation.
 *
 * @cloudformationResource AWS::LakeFormation::Resource
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-resource.html
 */
export class CfnResource extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::LakeFormation::Resource";

  /**
   * Build a CfnResource from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnResource(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The Amazon Resource Name (ARN) of the resource.
   */
  public resourceArn: string;

  /**
   * The IAM role that registered a resource.
   */
  public roleArn?: string;

  /**
   * Designates a trusted caller, an IAM principal, by registering this caller with the Data Catalog .
   */
  public useServiceLinkedRole: boolean | cdk.IResolvable;

  /**
   * Allows Lake Formation to assume a role to access tables in a federated database.
   */
  public withFederation?: boolean | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnResourceProps) {
    super(scope, id, {
      "type": CfnResource.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "resourceArn", this);
    cdk.requireProperty(props, "useServiceLinkedRole", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.resourceArn = props.resourceArn;
    this.roleArn = props.roleArn;
    this.useServiceLinkedRole = props.useServiceLinkedRole;
    this.withFederation = props.withFederation;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "resourceArn": this.resourceArn,
      "roleArn": this.roleArn,
      "useServiceLinkedRole": this.useServiceLinkedRole,
      "withFederation": this.withFederation
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnResource.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnResourcePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnResource`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-resource.html
 */
export interface CfnResourceProps {
  /**
   * The Amazon Resource Name (ARN) of the resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-resource.html#cfn-lakeformation-resource-resourcearn
   */
  readonly resourceArn: string;

  /**
   * The IAM role that registered a resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-resource.html#cfn-lakeformation-resource-rolearn
   */
  readonly roleArn?: string;

  /**
   * Designates a trusted caller, an IAM principal, by registering this caller with the Data Catalog .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-resource.html#cfn-lakeformation-resource-useservicelinkedrole
   */
  readonly useServiceLinkedRole: boolean | cdk.IResolvable;

  /**
   * Allows Lake Formation to assume a role to access tables in a federated database.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-resource.html#cfn-lakeformation-resource-withfederation
   */
  readonly withFederation?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnResourceProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourcePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("resourceArn", cdk.requiredValidator)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.validateString)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("useServiceLinkedRole", cdk.requiredValidator)(properties.useServiceLinkedRole));
  errors.collect(cdk.propertyValidator("useServiceLinkedRole", cdk.validateBoolean)(properties.useServiceLinkedRole));
  errors.collect(cdk.propertyValidator("withFederation", cdk.validateBoolean)(properties.withFederation));
  return errors.wrap("supplied properties not correct for \"CfnResourceProps\"");
}

// @ts-ignore TS6133
function convertCfnResourcePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourcePropsValidator(properties).assertSuccess();
  return {
    "ResourceArn": cdk.stringToCloudFormation(properties.resourceArn),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "UseServiceLinkedRole": cdk.booleanToCloudFormation(properties.useServiceLinkedRole),
    "WithFederation": cdk.booleanToCloudFormation(properties.withFederation)
  };
}

// @ts-ignore TS6133
function CfnResourcePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceProps>();
  ret.addPropertyResult("resourceArn", "ResourceArn", (properties.ResourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceArn) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("useServiceLinkedRole", "UseServiceLinkedRole", (properties.UseServiceLinkedRole != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseServiceLinkedRole) : undefined));
  ret.addPropertyResult("withFederation", "WithFederation", (properties.WithFederation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.WithFederation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::LakeFormation::Tag` resource represents an LF-tag, which consists of a key and one or more possible values for the key.
 *
 * During a stack operation, AWS CloudFormation calls the AWS Lake Formation `CreateLFTag` API to create a tag, and `UpdateLFTag` API to update a tag resource, and a `DeleteLFTag` to delete it.
 *
 * @cloudformationResource AWS::LakeFormation::Tag
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tag.html
 */
export class CfnTag extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::LakeFormation::Tag";

  /**
   * Build a CfnTag from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTag(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Catalog id string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html) .
   */
  public catalogId?: string;

  /**
   * UTF-8 string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html) .
   */
  public tagKey: string;

  /**
   * An array of UTF-8 strings, not less than 1 or more than 50 strings.
   */
  public tagValues: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTagProps) {
    super(scope, id, {
      "type": CfnTag.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "tagKey", this);
    cdk.requireProperty(props, "tagValues", this);

    this.catalogId = props.catalogId;
    this.tagKey = props.tagKey;
    this.tagValues = props.tagValues;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "catalogId": this.catalogId,
      "tagKey": this.tagKey,
      "tagValues": this.tagValues
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTag.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTagPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnTag`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tag.html
 */
export interface CfnTagProps {
  /**
   * Catalog id string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html) .
   *
   * The identifier for the Data Catalog . By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your AWS Lake Formation environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tag.html#cfn-lakeformation-tag-catalogid
   */
  readonly catalogId?: string;

  /**
   * UTF-8 string, not less than 1 or more than 255 bytes long, matching the [single-line string pattern](https://docs.aws.amazon.com/lake-formation/latest/dg/aws-lake-formation-api-aws-lake-formation-api-common.html) .
   *
   * The key-name for the LF-tag.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tag.html#cfn-lakeformation-tag-tagkey
   */
  readonly tagKey: string;

  /**
   * An array of UTF-8 strings, not less than 1 or more than 50 strings.
   *
   * A list of possible values of the corresponding `TagKey` of an LF-tag key-value pair.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tag.html#cfn-lakeformation-tag-tagvalues
   */
  readonly tagValues: Array<string>;
}

/**
 * Determine whether the given properties match those of a `CfnTagProps`
 *
 * @param properties - the TypeScript properties of a `CfnTagProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTagPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("tagKey", cdk.requiredValidator)(properties.tagKey));
  errors.collect(cdk.propertyValidator("tagKey", cdk.validateString)(properties.tagKey));
  errors.collect(cdk.propertyValidator("tagValues", cdk.requiredValidator)(properties.tagValues));
  errors.collect(cdk.propertyValidator("tagValues", cdk.listValidator(cdk.validateString))(properties.tagValues));
  return errors.wrap("supplied properties not correct for \"CfnTagProps\"");
}

// @ts-ignore TS6133
function convertCfnTagPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTagPropsValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "TagKey": cdk.stringToCloudFormation(properties.tagKey),
    "TagValues": cdk.listMapper(cdk.stringToCloudFormation)(properties.tagValues)
  };
}

// @ts-ignore TS6133
function CfnTagPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTagProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTagProps>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("tagKey", "TagKey", (properties.TagKey != null ? cfn_parse.FromCloudFormation.getString(properties.TagKey) : undefined));
  ret.addPropertyResult("tagValues", "TagValues", (properties.TagValues != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TagValues) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::LakeFormation::TagAssociation` resource represents an assignment of an LF-tag to a Data Catalog resource (database, table, or column).
 *
 * During a stack operation, CloudFormation calls AWS Lake Formation `AddLFTagsToResource` API to create a `TagAssociation` resource and calls the `RemoveLFTagsToResource` API to delete it.
 *
 * @cloudformationResource AWS::LakeFormation::TagAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tagassociation.html
 */
export class CfnTagAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::LakeFormation::TagAssociation";

  /**
   * Build a CfnTagAssociation from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTagAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
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
   *
   * @cloudformationAttribute ResourceIdentifier
   */
  public readonly attrResourceIdentifier: string;

  /**
   * Json encoding of the input LFTags list.
   *
   * For example: `[{"CatalogId":null,"TagKey":"tagKey1","TagValues":null},{"CatalogId":null,"TagKey":"tagKey2","TagValues":null}]`
   *
   * @cloudformationAttribute TagsIdentifier
   */
  public readonly attrTagsIdentifier: string;

  /**
   * A structure containing an LF-tag key-value pair.
   */
  public lfTags: Array<cdk.IResolvable | CfnTagAssociation.LFTagPairProperty> | cdk.IResolvable;

  /**
   * UTF-8 string (valid values: `DATABASE | TABLE` ).
   */
  public resource: cdk.IResolvable | CfnTagAssociation.ResourceProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTagAssociationProps) {
    super(scope, id, {
      "type": CfnTagAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "lfTags", this);
    cdk.requireProperty(props, "resource", this);

    this.attrResourceIdentifier = cdk.Token.asString(this.getAtt("ResourceIdentifier", cdk.ResolutionTypeHint.STRING));
    this.attrTagsIdentifier = cdk.Token.asString(this.getAtt("TagsIdentifier", cdk.ResolutionTypeHint.STRING));
    this.lfTags = props.lfTags;
    this.resource = props.resource;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "lfTags": this.lfTags,
      "resource": this.resource
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTagAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTagAssociationPropsToCloudFormation(props);
  }
}

export namespace CfnTagAssociation {
  /**
   * A structure containing the catalog ID, tag key, and tag values of an LF-tag key-value pair.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-lftagpair.html
   */
  export interface LFTagPairProperty {
    /**
     * The identifier for the Data Catalog .
     *
     * By default, it is the account ID of the caller.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-lftagpair.html#cfn-lakeformation-tagassociation-lftagpair-catalogid
     */
    readonly catalogId: string;

    /**
     * The key-name for the LF-tag.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-lftagpair.html#cfn-lakeformation-tagassociation-lftagpair-tagkey
     */
    readonly tagKey: string;

    /**
     * A list of possible values of the corresponding `TagKey` of an LF-tag key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-lftagpair.html#cfn-lakeformation-tagassociation-lftagpair-tagvalues
     */
    readonly tagValues: Array<string>;
  }

  /**
   * A structure for the resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-resource.html
   */
  export interface ResourceProperty {
    /**
     * The identifier for the Data Catalog.
     *
     * By default, the account ID. The Data Catalog is the persistent metadata store. It contains database definitions, table definitions, and other control information to manage your AWS Lake Formation environment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-resource.html#cfn-lakeformation-tagassociation-resource-catalog
     */
    readonly catalog?: any | cdk.IResolvable;

    /**
     * The database for the resource.
     *
     * Unique to the Data Catalog. A database is a set of associated table definitions organized into a logical group. You can Grant and Revoke database permissions to a principal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-resource.html#cfn-lakeformation-tagassociation-resource-database
     */
    readonly database?: CfnTagAssociation.DatabaseResourceProperty | cdk.IResolvable;

    /**
     * The table for the resource.
     *
     * A table is a metadata definition that represents your data. You can Grant and Revoke table privileges to a principal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-resource.html#cfn-lakeformation-tagassociation-resource-table
     */
    readonly table?: cdk.IResolvable | CfnTagAssociation.TableResourceProperty;

    /**
     * The table with columns for the resource.
     *
     * A principal with permissions to this resource can select metadata from the columns of a table in the Data Catalog and the underlying data in Amazon S3.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-resource.html#cfn-lakeformation-tagassociation-resource-tablewithcolumns
     */
    readonly tableWithColumns?: cdk.IResolvable | CfnTagAssociation.TableWithColumnsResourceProperty;
  }

  /**
   * A structure for the table object.
   *
   * A table is a metadata definition that represents your data. You can Grant and Revoke table privileges to a principal.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-tableresource.html
   */
  export interface TableResourceProperty {
    /**
     * The identifier for the Data Catalog .
     *
     * By default, it is the account ID of the caller.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-tableresource.html#cfn-lakeformation-tagassociation-tableresource-catalogid
     */
    readonly catalogId: string;

    /**
     * The name of the database for the table.
     *
     * Unique to a Data Catalog. A database is a set of associated table definitions organized into a logical group. You can Grant and Revoke database privileges to a principal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-tableresource.html#cfn-lakeformation-tagassociation-tableresource-databasename
     */
    readonly databaseName: string;

    /**
     * The name of the table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-tableresource.html#cfn-lakeformation-tagassociation-tableresource-name
     */
    readonly name?: string;

    /**
     * A wildcard object representing every table under a database.This is an object with no properties that effectively behaves as a true or false depending on whether not it is passed as a parameter. The valid inputs for a property with this type in either yaml or json is null or {}.
     *
     * At least one of `TableResource$Name` or `TableResource$TableWildcard` is required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-tableresource.html#cfn-lakeformation-tagassociation-tableresource-tablewildcard
     */
    readonly tableWildcard?: any | cdk.IResolvable;
  }

  /**
   * A structure for a table with columns object. This object is only used when granting a SELECT permission.
   *
   * This object must take a value for at least one of `ColumnsNames` , `ColumnsIndexes` , or `ColumnsWildcard` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-tablewithcolumnsresource.html
   */
  export interface TableWithColumnsResourceProperty {
    /**
     * A wildcard object representing every table under a database.
     *
     * At least one of TableResource$Name or TableResource$TableWildcard is required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-tablewithcolumnsresource.html#cfn-lakeformation-tagassociation-tablewithcolumnsresource-catalogid
     */
    readonly catalogId: string;

    /**
     * The list of column names for the table.
     *
     * At least one of `ColumnNames` or `ColumnWildcard` is required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-tablewithcolumnsresource.html#cfn-lakeformation-tagassociation-tablewithcolumnsresource-columnnames
     */
    readonly columnNames: Array<string>;

    /**
     * The name of the database for the table with columns resource.
     *
     * Unique to the Data Catalog. A database is a set of associated table definitions organized into a logical group. You can Grant and Revoke database privileges to a principal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-tablewithcolumnsresource.html#cfn-lakeformation-tagassociation-tablewithcolumnsresource-databasename
     */
    readonly databaseName: string;

    /**
     * The name of the table resource.
     *
     * A table is a metadata definition that represents your data. You can Grant and Revoke table privileges to a principal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-tablewithcolumnsresource.html#cfn-lakeformation-tagassociation-tablewithcolumnsresource-name
     */
    readonly name: string;
  }

  /**
   * A structure for the database object.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-databaseresource.html
   */
  export interface DatabaseResourceProperty {
    /**
     * The identifier for the Data Catalog .
     *
     * By default, it should be the account ID of the caller.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-databaseresource.html#cfn-lakeformation-tagassociation-databaseresource-catalogid
     */
    readonly catalogId: string;

    /**
     * The name of the database resource.
     *
     * Unique to the Data Catalog.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lakeformation-tagassociation-databaseresource.html#cfn-lakeformation-tagassociation-databaseresource-name
     */
    readonly name: string;
  }
}

/**
 * Properties for defining a `CfnTagAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tagassociation.html
 */
export interface CfnTagAssociationProps {
  /**
   * A structure containing an LF-tag key-value pair.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tagassociation.html#cfn-lakeformation-tagassociation-lftags
   */
  readonly lfTags: Array<cdk.IResolvable | CfnTagAssociation.LFTagPairProperty> | cdk.IResolvable;

  /**
   * UTF-8 string (valid values: `DATABASE | TABLE` ).
   *
   * The resource for which the LF-tag policy applies.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lakeformation-tagassociation.html#cfn-lakeformation-tagassociation-resource
   */
  readonly resource: cdk.IResolvable | CfnTagAssociation.ResourceProperty;
}

/**
 * Determine whether the given properties match those of a `LFTagPairProperty`
 *
 * @param properties - the TypeScript properties of a `LFTagPairProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTagAssociationLFTagPairPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.requiredValidator)(properties.catalogId));
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("tagKey", cdk.requiredValidator)(properties.tagKey));
  errors.collect(cdk.propertyValidator("tagKey", cdk.validateString)(properties.tagKey));
  errors.collect(cdk.propertyValidator("tagValues", cdk.requiredValidator)(properties.tagValues));
  errors.collect(cdk.propertyValidator("tagValues", cdk.listValidator(cdk.validateString))(properties.tagValues));
  return errors.wrap("supplied properties not correct for \"LFTagPairProperty\"");
}

// @ts-ignore TS6133
function convertCfnTagAssociationLFTagPairPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTagAssociationLFTagPairPropertyValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "TagKey": cdk.stringToCloudFormation(properties.tagKey),
    "TagValues": cdk.listMapper(cdk.stringToCloudFormation)(properties.tagValues)
  };
}

// @ts-ignore TS6133
function CfnTagAssociationLFTagPairPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTagAssociation.LFTagPairProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTagAssociation.LFTagPairProperty>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("tagKey", "TagKey", (properties.TagKey != null ? cfn_parse.FromCloudFormation.getString(properties.TagKey) : undefined));
  ret.addPropertyResult("tagValues", "TagValues", (properties.TagValues != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TagValues) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TableResourceProperty`
 *
 * @param properties - the TypeScript properties of a `TableResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTagAssociationTableResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.requiredValidator)(properties.catalogId));
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("databaseName", cdk.requiredValidator)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tableWildcard", cdk.validateObject)(properties.tableWildcard));
  return errors.wrap("supplied properties not correct for \"TableResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnTagAssociationTableResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTagAssociationTableResourcePropertyValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "Name": cdk.stringToCloudFormation(properties.name),
    "TableWildcard": cdk.objectToCloudFormation(properties.tableWildcard)
  };
}

// @ts-ignore TS6133
function CfnTagAssociationTableResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTagAssociation.TableResourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTagAssociation.TableResourceProperty>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tableWildcard", "TableWildcard", (properties.TableWildcard != null ? cfn_parse.FromCloudFormation.getAny(properties.TableWildcard) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TableWithColumnsResourceProperty`
 *
 * @param properties - the TypeScript properties of a `TableWithColumnsResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTagAssociationTableWithColumnsResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.requiredValidator)(properties.catalogId));
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("columnNames", cdk.requiredValidator)(properties.columnNames));
  errors.collect(cdk.propertyValidator("columnNames", cdk.listValidator(cdk.validateString))(properties.columnNames));
  errors.collect(cdk.propertyValidator("databaseName", cdk.requiredValidator)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"TableWithColumnsResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnTagAssociationTableWithColumnsResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTagAssociationTableWithColumnsResourcePropertyValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "ColumnNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.columnNames),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnTagAssociationTableWithColumnsResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTagAssociation.TableWithColumnsResourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTagAssociation.TableWithColumnsResourceProperty>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("columnNames", "ColumnNames", (properties.ColumnNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ColumnNames) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DatabaseResourceProperty`
 *
 * @param properties - the TypeScript properties of a `DatabaseResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTagAssociationDatabaseResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.requiredValidator)(properties.catalogId));
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"DatabaseResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnTagAssociationDatabaseResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTagAssociationDatabaseResourcePropertyValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnTagAssociationDatabaseResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTagAssociation.DatabaseResourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTagAssociation.DatabaseResourceProperty>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResourceProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTagAssociationResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalog", cdk.validateObject)(properties.catalog));
  errors.collect(cdk.propertyValidator("database", CfnTagAssociationDatabaseResourcePropertyValidator)(properties.database));
  errors.collect(cdk.propertyValidator("table", CfnTagAssociationTableResourcePropertyValidator)(properties.table));
  errors.collect(cdk.propertyValidator("tableWithColumns", CfnTagAssociationTableWithColumnsResourcePropertyValidator)(properties.tableWithColumns));
  return errors.wrap("supplied properties not correct for \"ResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnTagAssociationResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTagAssociationResourcePropertyValidator(properties).assertSuccess();
  return {
    "Catalog": cdk.objectToCloudFormation(properties.catalog),
    "Database": convertCfnTagAssociationDatabaseResourcePropertyToCloudFormation(properties.database),
    "Table": convertCfnTagAssociationTableResourcePropertyToCloudFormation(properties.table),
    "TableWithColumns": convertCfnTagAssociationTableWithColumnsResourcePropertyToCloudFormation(properties.tableWithColumns)
  };
}

// @ts-ignore TS6133
function CfnTagAssociationResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTagAssociation.ResourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTagAssociation.ResourceProperty>();
  ret.addPropertyResult("catalog", "Catalog", (properties.Catalog != null ? cfn_parse.FromCloudFormation.getAny(properties.Catalog) : undefined));
  ret.addPropertyResult("database", "Database", (properties.Database != null ? CfnTagAssociationDatabaseResourcePropertyFromCloudFormation(properties.Database) : undefined));
  ret.addPropertyResult("table", "Table", (properties.Table != null ? CfnTagAssociationTableResourcePropertyFromCloudFormation(properties.Table) : undefined));
  ret.addPropertyResult("tableWithColumns", "TableWithColumns", (properties.TableWithColumns != null ? CfnTagAssociationTableWithColumnsResourcePropertyFromCloudFormation(properties.TableWithColumns) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTagAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnTagAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTagAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("lfTags", cdk.requiredValidator)(properties.lfTags));
  errors.collect(cdk.propertyValidator("lfTags", cdk.listValidator(CfnTagAssociationLFTagPairPropertyValidator))(properties.lfTags));
  errors.collect(cdk.propertyValidator("resource", cdk.requiredValidator)(properties.resource));
  errors.collect(cdk.propertyValidator("resource", CfnTagAssociationResourcePropertyValidator)(properties.resource));
  return errors.wrap("supplied properties not correct for \"CfnTagAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnTagAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTagAssociationPropsValidator(properties).assertSuccess();
  return {
    "LFTags": cdk.listMapper(convertCfnTagAssociationLFTagPairPropertyToCloudFormation)(properties.lfTags),
    "Resource": convertCfnTagAssociationResourcePropertyToCloudFormation(properties.resource)
  };
}

// @ts-ignore TS6133
function CfnTagAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTagAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTagAssociationProps>();
  ret.addPropertyResult("lfTags", "LFTags", (properties.LFTags != null ? cfn_parse.FromCloudFormation.getArray(CfnTagAssociationLFTagPairPropertyFromCloudFormation)(properties.LFTags) : undefined));
  ret.addPropertyResult("resource", "Resource", (properties.Resource != null ? CfnTagAssociationResourcePropertyFromCloudFormation(properties.Resource) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}