/*

These interfaces were created based on aws-sdk/clients/quicksight.d.ts.
If this needs to be updated:
- Copy quicksight.d.ts.
- Append ContextResponse to the DataSource, DataSet, Template, Analysis,
    Dashboard, and Theme interface names.
- Remove "export" from all but those six interfaces.
- Use the linter to repeatedly remove all unused types and interfaces until
    there are no unused types or interfaces left.
- Replace the following code with the result.

*/

interface AmazonElasticsearchParameters {
/**
 * The OpenSearch domain.
 */
  Domain: Domain;
}
interface AmazonOpenSearchParameters {
/**
 * The OpenSearch domain.
 */
  Domain: Domain;
}
export interface AnalysisContextResponse {
/**
 * The ID of the analysis.
 */
  AnalysisId?: ShortRestrictiveResourceId;
  /**
 * The Amazon Resource Name (ARN) of the analysis.
 */
  Arn?: Arn;
  /**
 * The descriptive name of the analysis.
 */
  Name?: AnalysisName;
  /**
 * Status associated with the analysis.
 */
  Status?: ResourceStatus;
  /**
 * Errors associated with the analysis.
 */
  Errors?: AnalysisErrorList;
  /**
 * The ARNs of the datasets of the analysis.
 */
  DataSetArns?: DataSetArnsList;
  /**
 * The ARN of the theme of the analysis.
 */
  ThemeArn?: Arn;
  /**
 * The time that the analysis was created.
 */
  CreatedTime?: Timestamp;
  /**
 * The time that the analysis was last updated.
 */
  LastUpdatedTime?: Timestamp;
  /**
 * A list of the associated sheets with the unique identifier and name of each sheet.
 */
  Sheets?: SheetList;
}
interface AnalysisError {
/**
 * The type of the analysis error.
 */
  Type?: AnalysisErrorType;
  /**
 * The message associated with the analysis error.
 */
  Message?: NonEmptyString;
  /**
 *
 */
  ViolatedEntities?: EntityList;
}
type AnalysisErrorList = AnalysisError[];
type AnalysisErrorType = 'ACCESS_DENIED'|'SOURCE_NOT_FOUND'|'DATA_SET_NOT_FOUND'|'INTERNAL_FAILURE'|'PARAMETER_VALUE_INCOMPATIBLE'|'PARAMETER_TYPE_INVALID'|'PARAMETER_NOT_FOUND'|'COLUMN_TYPE_MISMATCH'|'COLUMN_GEOGRAPHIC_ROLE_MISMATCH'|'COLUMN_REPLACEMENT_MISSING'|string;
type AnalysisName = string;
type Arn = string;
interface AthenaParameters {
/**
 * The workgroup that Amazon Athena uses.
 */
  WorkGroup?: WorkGroup;
  /**
 * Use the RoleArn structure to override an account-wide role for a specific Athena data source. For example, say an account administrator has turned off all Athena access with an account-wide role. The administrator can then use RoleArn to bypass the account-wide role and allow Athena access for the single Athena data source that is specified in the structure, even if the account-wide role forbidding Athena access is still active.
 */
  RoleArn?: RoleArn;
}
interface AuroraParameters {
/**
 * Host.
 */
  Host: Host;
  /**
 * Port.
 */
  Port: Port;
  /**
 * Database.
 */
  Database: Database;
}
interface AuroraPostgreSqlParameters {
/**
 * The Amazon Aurora PostgreSQL-Compatible host to connect to.
 */
  Host: Host;
  /**
 * The port that Amazon Aurora PostgreSQL is listening on.
 */
  Port: Port;
  /**
 * The Amazon Aurora PostgreSQL database to connect to.
 */
  Database: Database;
}
interface AwsIotAnalyticsParameters {
/**
 * Dataset name.
 */
  DataSetName: DataSetName;
}
type Boolean = boolean;
interface BorderStyle {
/**
 * The option to enable display of borders for visuals.
 */
  Show?: Boolean;
}
interface CalculatedColumn {
/**
 * Column name.
 */
  ColumnName: ColumnName;
  /**
 * A unique ID to identify a calculated column. During a dataset update, if the column ID of a calculated column matches that of an existing calculated column, Amazon QuickSight preserves the existing calculated column.
 */
  ColumnId: ColumnId;
  /**
 * An expression that defines the calculated column.
 */
  Expression: Expression;
}
type CalculatedColumnList = CalculatedColumn[];
interface CastColumnTypeOperation {
/**
 * Column name.
 */
  ColumnName: ColumnName;
  /**
 * New column data type.
 */
  NewColumnType: ColumnDataType;
  /**
 * When casting a column from string to datetime type, you can supply a string in a format supported by Amazon QuickSight to denote the source data format.
 */
  Format?: TypeCastFormat;
}
type Catalog = string;
type ClusterId = string;
type ColorList = HexColor[];
type ColumnDataType = 'STRING'|'INTEGER'|'DECIMAL'|'DATETIME'|string;
interface ColumnDescription {
/**
 * The text of a description for a column.
 */
  Text?: ColumnDescriptiveText;
}
type ColumnDescriptiveText = string;
interface ColumnGroup {
/**
 * Geospatial column group that denotes a hierarchy.
 */
  GeoSpatialColumnGroup?: GeoSpatialColumnGroup;
}
interface ColumnGroupColumnSchema {
/**
 * The name of the column group's column schema.
 */
  Name?: String;
}
type ColumnGroupColumnSchemaList = ColumnGroupColumnSchema[];
type ColumnGroupList = ColumnGroup[];
type ColumnGroupName = string;
interface ColumnGroupSchema {
/**
 * The name of the column group schema.
 */
  Name?: String;
  /**
 * A structure containing the list of schemas for column group columns.
 */
  ColumnGroupColumnSchemaList?: ColumnGroupColumnSchemaList;
}
type ColumnGroupSchemaList = ColumnGroupSchema[];
type ColumnId = string;
interface ColumnLevelPermissionRule {
/**
 * An array of Amazon Resource Names (ARNs) for Amazon QuickSight users or groups.
 */
  Principals?: PrincipalList;
  /**
 * An array of column names.
 */
  ColumnNames?: ColumnNameList;
}
type ColumnLevelPermissionRuleList = ColumnLevelPermissionRule[];
type ColumnList = ColumnName[];
type ColumnName = string;
type ColumnNameList = String[];
interface ColumnSchema {
/**
 * The name of the column schema.
 */
  Name?: String;
  /**
 * The data type of the column schema.
 */
  DataType?: String;
  /**
 * The geographic role of the column schema.
 */
  GeographicRole?: String;
}
type ColumnSchemaList = ColumnSchema[];
interface ColumnTag {
/**
 * A geospatial role for a column.
 */
  ColumnGeographicRole?: GeoSpatialDataRole;
  /**
 * A description for a column.
 */
  ColumnDescription?: ColumnDescription;
}
type ColumnTagList = ColumnTag[];
type ColumnTagName = 'COLUMN_GEOGRAPHIC_ROLE'|'COLUMN_DESCRIPTION'|string;
type ColumnTagNames = ColumnTagName[];
interface CreateColumnsOperation {
/**
 * Calculated columns to create.
 */
  Columns: CalculatedColumnList;
}
interface CustomSql {
/**
 * The Amazon Resource Name (ARN) of the data source.
 */
  DataSourceArn: Arn;
  /**
 * A display name for the SQL query result.
 */
  Name: CustomSqlName;
  /**
 * The SQL query.
 */
  SqlQuery: SqlQuery;
  /**
 * The column schema from the SQL query result set.
 */
  Columns?: InputColumnList;
}
type CustomSqlName = string;
export interface DashboardContextResponse {
/**
 * Dashboard ID.
 */
  DashboardId?: ShortRestrictiveResourceId;
  /**
 * The Amazon Resource Name (ARN) of the resource.
 */
  Arn?: Arn;
  /**
 * A display name for the dashboard.
 */
  Name?: DashboardName;
  /**
 * Version.
 */
  Version?: DashboardVersion;
  /**
 * The time that this dashboard was created.
 */
  CreatedTime?: Timestamp;
  /**
 * The last time that this dashboard was published.
 */
  LastPublishedTime?: Timestamp;
  /**
 * The last time that this dashboard was updated.
 */
  LastUpdatedTime?: Timestamp;
}
interface DashboardError {
/**
 * Type.
 */
  Type?: DashboardErrorType;
  /**
 * Message.
 */
  Message?: NonEmptyString;
  /**
 *
 */
  ViolatedEntities?: EntityList;
}
type DashboardErrorList = DashboardError[];
type DashboardErrorType = 'ACCESS_DENIED'|'SOURCE_NOT_FOUND'|'DATA_SET_NOT_FOUND'|'INTERNAL_FAILURE'|'PARAMETER_VALUE_INCOMPATIBLE'|'PARAMETER_TYPE_INVALID'|'PARAMETER_NOT_FOUND'|'COLUMN_TYPE_MISMATCH'|'COLUMN_GEOGRAPHIC_ROLE_MISMATCH'|'COLUMN_REPLACEMENT_MISSING'|string;
type DashboardName = string;
interface DashboardVersion {
/**
 * The time that this dashboard version was created.
 */
  CreatedTime?: Timestamp;
  /**
 * Errors associated with this dashboard version.
 */
  Errors?: DashboardErrorList;
  /**
 * Version number for this version of the dashboard.
 */
  VersionNumber?: VersionNumber;
  /**
 * The HTTP status of the request.
 */
  Status?: ResourceStatus;
  /**
 * The Amazon Resource Name (ARN) of the resource.
 */
  Arn?: Arn;
  /**
 * Source entity ARN.
 */
  SourceEntityArn?: Arn;
  /**
 * The Amazon Resource Numbers (ARNs) for the datasets that are associated with this version of the dashboard.
 */
  DataSetArns?: DataSetArnsList;
  /**
 * Description.
 */
  Description?: VersionDescription;
  /**
 * The ARN of the theme associated with a version of the dashboard.
 */
  ThemeArn?: Arn;
  /**
 * A list of the associated sheets with the unique identifier and name of each sheet.
 */
  Sheets?: SheetList;
}
interface DataColorPalette {
/**
 * The hexadecimal codes for the colors.
 */
  Colors?: ColorList;
  /**
 * The minimum and maximum hexadecimal codes that describe a color gradient.
 */
  MinMaxGradient?: ColorList;
  /**
 * The hexadecimal code of a color that applies to charts where a lack of data is highlighted.
 */
  EmptyFillColor?: HexColor;
}
export interface DataSetContextResponse {
/**
 * The Amazon Resource Name (ARN) of the resource.
 */
  Arn?: Arn;
  /**
 * The ID of the dataset.
 */
  DataSetId?: ResourceId;
  /**
 * A display name for the dataset.
 */
  Name?: ResourceName;
  /**
 * The time that this dataset was created.
 */
  CreatedTime?: Timestamp;
  /**
 * The last time that this dataset was updated.
 */
  LastUpdatedTime?: Timestamp;
  /**
 * Declares the physical tables that are available in the underlying data sources.
 */
  PhysicalTableMap?: PhysicalTableMap;
  /**
 * Configures the combination and transformation of the data from the physical tables.
 */
  LogicalTableMap?: LogicalTableMap;
  /**
 * The list of columns after all transforms. These columns are available in templates, analyses, and dashboards.
 */
  OutputColumns?: OutputColumnList;
  /**
 * A value that indicates whether you want to import the data into SPICE.
 */
  ImportMode?: DataSetImportMode;
  /**
 * The amount of SPICE capacity used by this dataset. This is 0 if the dataset isn't imported into SPICE.
 */
  ConsumedSpiceCapacityInBytes?: Long;
  /**
 * Groupings of columns that work together in certain Amazon QuickSight features. Currently, only geospatial hierarchy is supported.
 */
  ColumnGroups?: ColumnGroupList;
  /**
 * The folder that contains fields and nested subfolders for your dataset.
 */
  FieldFolders?: FieldFolderMap;
  /**
 * The row-level security configuration for the dataset.
 */
  RowLevelPermissionDataSet?: RowLevelPermissionDataSet;
  /**
 * The element you can use to define tags for row-level security.
 */
  RowLevelPermissionTagConfiguration?: RowLevelPermissionTagConfiguration;
  /**
 * A set of one or more definitions of a  ColumnLevelPermissionRule .
 */
  ColumnLevelPermissionRules?: ColumnLevelPermissionRuleList;
  /**
 * The usage configuration to apply to child datasets that reference this dataset as a source.
 */
  DataSetUsageConfiguration?: DataSetUsageConfiguration;
}
type DataSetArnsList = Arn[];
interface DataSetConfiguration {
/**
 * Placeholder.
 */
  Placeholder?: String;
  /**
 * Dataset schema.
 */
  DataSetSchema?: DataSetSchema;
  /**
 * A structure containing the list of column group schemas.
 */
  ColumnGroupSchemaList?: ColumnGroupSchemaList;
}
type DataSetConfigurationList = DataSetConfiguration[];
type DataSetImportMode = 'SPICE'|'DIRECT_QUERY'|string;
type DataSetName = string;
interface DataSetSchema {
/**
 * A structure containing the list of column schemas.
 */
  ColumnSchemaList?: ColumnSchemaList;
}
interface DataSetUsageConfiguration {
/**
 * An option that controls whether a child dataset of a direct query can use this dataset as a source.
 */
  DisableUseAsDirectQuerySource?: Boolean;
  /**
 * An option that controls whether a child dataset that's stored in QuickSight can use this dataset as a source.
 */
  DisableUseAsImportedSource?: Boolean;
}
export interface DataSourceContextResponse {
/**
 * The Amazon Resource Name (ARN) of the data source.
 */
  Arn?: Arn;
  /**
 * The ID of the data source. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
 */
  DataSourceId?: ResourceId;
  /**
 * A display name for the data source.
 */
  Name?: ResourceName;
  /**
 * The type of the data source. This type indicates which database engine the data source connects to.
 */
  Type?: DataSourceType;
  /**
 * The HTTP status of the request.
 */
  Status?: ResourceStatus;
  /**
 * The time that this data source was created.
 */
  CreatedTime?: Timestamp;
  /**
 * The last time that this data source was updated.
 */
  LastUpdatedTime?: Timestamp;
  /**
 * The parameters that Amazon QuickSight uses to connect to your underlying source. This is a variant type structure. For this structure to be valid, only one of the attributes can be non-null.
 */
  DataSourceParameters?: DataSourceParameters;
  /**
 * A set of alternate data source parameters that you want to share for the credentials stored with this data source. The credentials are applied in tandem with the data source parameters when you copy a data source by using a create or update request. The API operation compares the DataSourceParameters structure that's in the request with the structures in the AlternateDataSourceParameters allow list. If the structures are an exact match, the request is allowed to use the credentials from this existing data source. If the AlternateDataSourceParameters list is null, the Credentials originally used with this DataSourceParameters are automatically allowed.
 */
  AlternateDataSourceParameters?: DataSourceParametersList;
  /**
 * The VPC connection information. You need to use this parameter only when you want Amazon QuickSight to use a VPC connection when connecting to your underlying source.
 */
  VpcConnectionProperties?: VpcConnectionProperties;
  /**
 * Secure Socket Layer (SSL) properties that apply when Amazon QuickSight connects to your underlying source.
 */
  SslProperties?: SslProperties;
  /**
 * Error information from the last update or the creation of the data source.
 */
  ErrorInfo?: DataSourceErrorInfo;
  /**
 * The Amazon Resource Name (ARN) of the secret associated with the data source in Amazon Secrets Manager.
 */
  SecretArn?: SecretArn;
}
interface DataSourceErrorInfo {
/**
 * Error type.
 */
  Type?: DataSourceErrorInfoType;
  /**
 * Error message.
 */
  Message?: String;
}
type DataSourceErrorInfoType = 'ACCESS_DENIED'|'COPY_SOURCE_NOT_FOUND'|'TIMEOUT'|'ENGINE_VERSION_NOT_SUPPORTED'|'UNKNOWN_HOST'|'GENERIC_SQL_FAILURE'|'CONFLICT'|'UNKNOWN'|string;
interface DataSourceParameters {
/**
 * The parameters for OpenSearch.
 */
  AmazonElasticsearchParameters?: AmazonElasticsearchParameters;
  /**
 * The parameters for Amazon Athena.
 */
  AthenaParameters?: AthenaParameters;
  /**
 * The parameters for Amazon Aurora MySQL.
 */
  AuroraParameters?: AuroraParameters;
  /**
 * The parameters for Amazon Aurora.
 */
  AuroraPostgreSqlParameters?: AuroraPostgreSqlParameters;
  /**
 * The parameters for IoT Analytics.
 */
  AwsIotAnalyticsParameters?: AwsIotAnalyticsParameters;
  /**
 * The parameters for Jira.
 */
  JiraParameters?: JiraParameters;
  /**
 * The parameters for MariaDB.
 */
  MariaDbParameters?: MariaDbParameters;
  /**
 * The parameters for MySQL.
 */
  MySqlParameters?: MySqlParameters;
  /**
 * The parameters for Oracle.
 */
  OracleParameters?: OracleParameters;
  /**
 * The parameters for PostgreSQL.
 */
  PostgreSqlParameters?: PostgreSqlParameters;
  /**
 * The parameters for Presto.
 */
  PrestoParameters?: PrestoParameters;
  /**
 * The parameters for Amazon RDS.
 */
  RdsParameters?: RdsParameters;
  /**
 * The parameters for Amazon Redshift.
 */
  RedshiftParameters?: RedshiftParameters;
  /**
 * The parameters for S3.
 */
  S3Parameters?: S3Parameters;
  /**
 * The parameters for ServiceNow.
 */
  ServiceNowParameters?: ServiceNowParameters;
  /**
 * The parameters for Snowflake.
 */
  SnowflakeParameters?: SnowflakeParameters;
  /**
 * The parameters for Spark.
 */
  SparkParameters?: SparkParameters;
  /**
 * The parameters for SQL Server.
 */
  SqlServerParameters?: SqlServerParameters;
  /**
 * The parameters for Teradata.
 */
  TeradataParameters?: TeradataParameters;
  /**
 * The parameters for Twitter.
 */
  TwitterParameters?: TwitterParameters;
  /**
 * The parameters for OpenSearch.
 */
  AmazonOpenSearchParameters?: AmazonOpenSearchParameters;
  /**
 * The parameters for Exasol.
 */
  ExasolParameters?: ExasolParameters;
  /**
 * The required parameters that are needed to connect to a Databricks data source.
 */
  DatabricksParameters?: DatabricksParameters;
}
type DataSourceParametersList = DataSourceParameters[];
type DataSourceType = 'ADOBE_ANALYTICS'|'AMAZON_ELASTICSEARCH'|'ATHENA'|'AURORA'|'AURORA_POSTGRESQL'|'AWS_IOT_ANALYTICS'|'GITHUB'|'JIRA'|'MARIADB'|'MYSQL'|'ORACLE'|'POSTGRESQL'|'PRESTO'|'REDSHIFT'|'S3'|'SALESFORCE'|'SERVICENOW'|'SNOWFLAKE'|'SPARK'|'SQLSERVER'|'TERADATA'|'TWITTER'|'TIMESTREAM'|'AMAZON_OPENSEARCH'|'EXASOL'|'DATABRICKS'|string;
type Database = string;
interface DatabricksParameters {
/**
 * The host name of the Databricks data source.
 */
  Host: Host;
  /**
 * The port for the Databricks data source.
 */
  Port: Port;
  /**
 * The HTTP path of the Databricks data source.
 */
  SqlEndpointPath: SqlEndpointPath;
}
type Delimiter = string;
type Domain = string;
interface Entity {
/**
 * The hierarchical path of the entity within the analysis, template, or dashboard definition tree.
 */
  Path?: NonEmptyString;
}
type EntityList = Entity[];
interface ExasolParameters {
/**
 * The hostname or IP address of the Exasol data source.
 */
  Host: Host;
  /**
 * The port for the Exasol data source.
 */
  Port: Port;
}
type Expression = string;
interface FieldFolder {
/**
 * The description for a field folder.
 */
  description?: FieldFolderDescription;
  /**
 * A folder has a list of columns. A column can only be in one folder.
 */
  columns?: FolderColumnList;
}
type FieldFolderDescription = string;
type FieldFolderMap = {[key: string]: FieldFolder};
type FileFormat = 'CSV'|'TSV'|'CLF'|'ELF'|'XLSX'|'JSON'|string;
interface FilterOperation {
/**
 * An expression that must evaluate to a Boolean value. Rows for which the expression evaluates to true are kept in the dataset.
 */
  ConditionExpression: Expression;
}
type FolderColumnList = String[];
interface Font {
/**
 * Determines the font family settings.
 */
  FontFamily?: String;
}
type FontList = Font[];
interface GeoSpatialColumnGroup {
/**
 * A display name for the hierarchy.
 */
  Name: ColumnGroupName;
  /**
 * Country code.
 */
  CountryCode?: GeoSpatialCountryCode;
  /**
 * Columns in this hierarchy.
 */
  Columns: ColumnList;
}
type GeoSpatialCountryCode = 'US'|string;
type GeoSpatialDataRole = 'COUNTRY'|'STATE'|'COUNTY'|'CITY'|'POSTCODE'|'LONGITUDE'|'LATITUDE'|string;
interface GutterStyle {
/**
 * This Boolean value controls whether to display a gutter space between sheet tiles.
 */
  Show?: Boolean;
}
type HexColor = string;
type Host = string;
interface InputColumn {
/**
 * The name of this column in the underlying data source.
 */
  Name: ColumnName;
  /**
 * The data type of the column.
 */
  Type: InputColumnDataType;
}
type InputColumnDataType = 'STRING'|'INTEGER'|'DECIMAL'|'DATETIME'|'BIT'|'BOOLEAN'|'JSON'|string;
type InputColumnList = InputColumn[];
type InstanceId = string;
interface JiraParameters {
/**
 * The base URL of the Jira site.
 */
  SiteBaseUrl: SiteBaseUrl;
}
interface JoinInstruction {
/**
 * The operand on the left side of a join.
 */
  LeftOperand: LogicalTableId;
  /**
 * The operand on the right side of a join.
 */
  RightOperand: LogicalTableId;
  /**
 * Join key properties of the left operand.
 */
  LeftJoinKeyProperties?: JoinKeyProperties;
  /**
 * Join key properties of the right operand.
 */
  RightJoinKeyProperties?: JoinKeyProperties;
  /**
 * The type of join that it is.
 */
  Type: JoinType;
  /**
 * The join instructions provided in the ON clause of a join.
 */
  OnClause: OnClause;
}
interface JoinKeyProperties {
/**
 * A value that indicates that a row in a table is uniquely identified by the columns in a join key. This is used by Amazon QuickSight to optimize query performance.
 */
  UniqueKey?: Boolean;
}
type JoinType = 'INNER'|'OUTER'|'LEFT'|'RIGHT'|string;
interface LogicalTable {
/**
 * A display name for the logical table.
 */
  Alias: LogicalTableAlias;
  /**
 * Transform operations that act on this logical table. For this structure to be valid, only one of the attributes can be non-null.
 */
  DataTransforms?: TransformOperationList;
  /**
 * Source of this logical table.
 */
  Source: LogicalTableSource;
}
type LogicalTableAlias = string;
type LogicalTableId = string;
type LogicalTableMap = {[key: string]: LogicalTable};
interface LogicalTableSource {
/**
 * Specifies the result of a join of two logical tables.
 */
  JoinInstruction?: JoinInstruction;
  /**
 * Physical table ID.
 */
  PhysicalTableId?: PhysicalTableId;
  /**
 * The Amazon Resource Number (ARN) of the parent dataset.
 */
  DataSetArn?: Arn;
}
type Long = number;
interface ManifestFileLocation {
/**
 * Amazon S3 bucket.
 */
  Bucket: S3Bucket;
  /**
 * Amazon S3 key that identifies an object.
 */
  Key: S3Key;
}
interface MarginStyle {
/**
 * This Boolean value controls whether to display sheet margins.
 */
  Show?: Boolean;
}
interface MariaDbParameters {
/**
 * Host.
 */
  Host: Host;
  /**
 * Port.
 */
  Port: Port;
  /**
 * Database.
 */
  Database: Database;
}
interface MySqlParameters {
/**
 * Host.
 */
  Host: Host;
  /**
 * Port.
 */
  Port: Port;
  /**
 * Database.
 */
  Database: Database;
}
type Namespace = string;
type NonEmptyString = string;
type OnClause = string;
type OptionalPort = number;
interface OracleParameters {
/**
 * An Oracle host.
 */
  Host: Host;
  /**
 * Port.
 */
  Port: Port;
  /**
 * Database.
 */
  Database: Database;
}
interface OutputColumn {
/**
 * A display name for the dataset.
 */
  Name?: ColumnName;
  /**
 * A description for a column.
 */
  Description?: ColumnDescriptiveText;
  /**
 * Type.
 */
  Type?: ColumnDataType;
}
type OutputColumnList = OutputColumn[];
interface PhysicalTable {
/**
 * A physical table type for relational data sources.
 */
  RelationalTable?: RelationalTable;
  /**
 * A physical table type built from the results of the custom SQL query.
 */
  CustomSql?: CustomSql;
  /**
 * A physical table type for as S3 data source.
 */
  S3Source?: S3Source;
}
type PhysicalTableId = string;
type PhysicalTableMap = {[key: string]: PhysicalTable};
type Port = number;
type PositiveInteger = number;
interface PostgreSqlParameters {
/**
 * Host.
 */
  Host: Host;
  /**
 * Port.
 */
  Port: Port;
  /**
 * Database.
 */
  Database: Database;
}
interface PrestoParameters {
/**
 * Host.
 */
  Host: Host;
  /**
 * Port.
 */
  Port: Port;
  /**
 * Catalog.
 */
  Catalog: Catalog;
}
type PrincipalList = String[];
interface ProjectOperation {
/**
 * Projected columns.
 */
  ProjectedColumns: ProjectedColumnList;
}
type ProjectedColumnList = String[];
type Query = string;
interface RdsParameters {
/**
 * Instance ID.
 */
  InstanceId: InstanceId;
  /**
 * Database.
 */
  Database: Database;
}
interface RedshiftParameters {
/**
 * Host. This field can be blank if ClusterId is provided.
 */
  Host?: Host;
  /**
 * Port. This field can be blank if the ClusterId is provided.
 */
  Port?: OptionalPort;
  /**
 * Database.
 */
  Database: Database;
  /**
 * Cluster ID. This field can be blank if the Host and Port are provided.
 */
  ClusterId?: ClusterId;
}
interface RelationalTable {
/**
 * The Amazon Resource Name (ARN) for the data source.
 */
  DataSourceArn: Arn;
  /**
 * The catalog associated with a table.
 */
  Catalog?: RelationalTableCatalog;
  /**
 * The schema name. This name applies to certain relational database engines.
 */
  Schema?: RelationalTableSchema;
  /**
 * The name of the relational table.
 */
  Name: RelationalTableName;
  /**
 * The column schema of the table.
 */
  InputColumns: InputColumnList;
}
type RelationalTableCatalog = string;
type RelationalTableName = string;
type RelationalTableSchema = string;
interface RenameColumnOperation {
/**
 * The name of the column to be renamed.
 */
  ColumnName: ColumnName;
  /**
 * The new name for the column.
 */
  NewColumnName: ColumnName;
}
type ResourceId = string;
type ResourceName = string;
type ResourceStatus = 'CREATION_IN_PROGRESS'|'CREATION_SUCCESSFUL'|'CREATION_FAILED'|'UPDATE_IN_PROGRESS'|'UPDATE_SUCCESSFUL'|'UPDATE_FAILED'|'DELETED'|string;
type RoleArn = string;
interface RowLevelPermissionDataSet {
/**
 * The namespace associated with the dataset that contains permissions for RLS.
 */
  Namespace?: Namespace;
  /**
 * The Amazon Resource Name (ARN) of the dataset that contains permissions for RLS.
 */
  Arn: Arn;
  /**
 * The type of permissions to use when interpreting the permissions for RLS. DENY_ACCESS is included for backward compatibility only.
 */
  PermissionPolicy: RowLevelPermissionPolicy;
  /**
 * The user or group rules associated with the dataset that contains permissions for RLS. By default, FormatVersion is VERSION_1. When FormatVersion is VERSION_1, UserName and GroupName are required. When FormatVersion is VERSION_2, UserARN and GroupARN are required, and Namespace must not exist.
 */
  FormatVersion?: RowLevelPermissionFormatVersion;
  /**
 * The status of the row-level security permission dataset. If enabled, the status is ENABLED. If disabled, the status is DISABLED.
 */
  Status?: Status;
}
type RowLevelPermissionFormatVersion = 'VERSION_1'|'VERSION_2'|string;
type RowLevelPermissionPolicy = 'GRANT_ACCESS'|'DENY_ACCESS'|string;
interface RowLevelPermissionTagConfiguration {
/**
 * The status of row-level security tags. If enabled, the status is ENABLED. If disabled, the status is DISABLED.
 */
  Status?: Status;
  /**
 * A set of rules associated with row-level security, such as the tag names and columns that they are assigned to.
 */
  TagRules: RowLevelPermissionTagRuleList;
}
type RowLevelPermissionTagDelimiter = string;
interface RowLevelPermissionTagRule {
/**
 * The unique key for a tag.
 */
  TagKey: SessionTagKey;
  /**
 * The column name that a tag key is assigned to.
 */
  ColumnName: String;
  /**
 * A string that you want to use to delimit the values when you pass the values at run time. For example, you can delimit the values with a comma.
 */
  TagMultiValueDelimiter?: RowLevelPermissionTagDelimiter;
  /**
 * A string that you want to use to filter by all the values in a column in the dataset and don’t want to list the values one by one. For example, you can use an asterisk as your match all value.
 */
  MatchAllValue?: SessionTagValue;
}
type RowLevelPermissionTagRuleList = RowLevelPermissionTagRule[];
type S3Bucket = string;
type S3Key = string;
interface S3Parameters {
/**
 * Location of the Amazon S3 manifest file. This is NULL if the manifest file was uploaded into Amazon QuickSight.
 */
  ManifestFileLocation: ManifestFileLocation;
}
interface S3Source {
/**
 * The Amazon Resource Name (ARN) for the data source.
 */
  DataSourceArn: Arn;
  /**
 * Information about the format for the S3 source file or files.
 */
  UploadSettings?: UploadSettings;
  /**
 * A physical table type for an S3 data source.  For files that aren't JSON, only STRING data types are supported in input columns.
 */
  InputColumns: InputColumnList;
}
type SecretArn = string;
interface ServiceNowParameters {
/**
 * URL of the base site.
 */
  SiteBaseUrl: SiteBaseUrl;
}
type SessionTagKey = string;
type SessionTagValue = string;
interface Sheet {
/**
 * The unique identifier associated with a sheet.
 */
  SheetId?: ShortRestrictiveResourceId;
  /**
 * The name of a sheet. This name is displayed on the sheet's tab in the Amazon QuickSight console.
 */
  Name?: SheetName;
}
type SheetList = Sheet[];
type SheetName = string;
interface SheetStyle {
/**
 * The display options for tiles.
 */
  Tile?: TileStyle;
  /**
 * The layout options for tiles.
 */
  TileLayout?: TileLayoutStyle;
}
type ShortRestrictiveResourceId = string;
type SiteBaseUrl = string;
interface SnowflakeParameters {
/**
 * Host.
 */
  Host: Host;
  /**
 * Database.
 */
  Database: Database;
  /**
 * Warehouse.
 */
  Warehouse: Warehouse;
}
interface SparkParameters {
/**
 * Host.
 */
  Host: Host;
  /**
 * Port.
 */
  Port: Port;
}
type SqlEndpointPath = string;
type SqlQuery = string;
interface SqlServerParameters {
/**
 * Host.
 */
  Host: Host;
  /**
 * Port.
 */
  Port: Port;
  /**
 * Database.
 */
  Database: Database;
}
interface SslProperties {
/**
 * A Boolean option to control whether SSL should be disabled.
 */
  DisableSsl?: Boolean;
}
type Status = 'ENABLED'|'DISABLED'|string;
type String = string;
interface TagColumnOperation {
/**
 * The column that this operation acts on.
 */
  ColumnName: ColumnName;
  /**
 * The dataset column tag, currently only used for geospatial type tagging.  This is not tags for the Amazon Web Services tagging feature.
 */
  Tags: ColumnTagList;
}
export interface TemplateContextResponse {
/**
 * The Amazon Resource Name (ARN) of the template.
 */
  Arn?: Arn;
  /**
 * The display name of the template.
 */
  Name?: TemplateName;
  /**
 * A structure describing the versions of the template.
 */
  Version?: TemplateVersion;
  /**
 * The ID for the template. This is unique per Amazon Web Services Region for each Amazon Web Services account.
 */
  TemplateId?: ShortRestrictiveResourceId;
  /**
 * Time when this was last updated.
 */
  LastUpdatedTime?: Timestamp;
  /**
 * Time when this was created.
 */
  CreatedTime?: Timestamp;
}
interface TemplateError {
/**
 * Type of error.
 */
  Type?: TemplateErrorType;
  /**
 * Description of the error type.
 */
  Message?: NonEmptyString;
  /**
 * An error path that shows which entities caused the template error.
 */
  ViolatedEntities?: EntityList;
}
type TemplateErrorList = TemplateError[];
type TemplateErrorType = 'SOURCE_NOT_FOUND'|'DATA_SET_NOT_FOUND'|'INTERNAL_FAILURE'|'ACCESS_DENIED'|string;
type TemplateName = string;
interface TemplateVersion {
/**
 * The time that this template version was created.
 */
  CreatedTime?: Timestamp;
  /**
 * Errors associated with this template version.
 */
  Errors?: TemplateErrorList;
  /**
 * The version number of the template version.
 */
  VersionNumber?: VersionNumber;
  /**
 * The status that is associated with the template.    CREATION_IN_PROGRESS     CREATION_SUCCESSFUL     CREATION_FAILED     UPDATE_IN_PROGRESS     UPDATE_SUCCESSFUL     UPDATE_FAILED     DELETED
 */
  Status?: ResourceStatus;
  /**
 * Schema of the dataset identified by the placeholder. Any dashboard created from this template should be bound to new datasets matching the same schema described through this API operation.
 */
  DataSetConfigurations?: DataSetConfigurationList;
  /**
 * The description of the template.
 */
  Description?: VersionDescription;
  /**
 * The Amazon Resource Name (ARN) of an analysis or template that was used to create this template.
 */
  SourceEntityArn?: Arn;
  /**
 * The ARN of the theme associated with this version of the template.
 */
  ThemeArn?: Arn;
  /**
 * A list of the associated sheets with the unique identifier and name of each sheet.
 */
  Sheets?: SheetList;
}
interface TeradataParameters {
/**
 * Host.
 */
  Host: Host;
  /**
 * Port.
 */
  Port: Port;
  /**
 * Database.
 */
  Database: Database;
}
type TextQualifier = 'DOUBLE_QUOTE'|'SINGLE_QUOTE'|string;
export interface ThemeContextResponse {
/**
 * The Amazon Resource Name (ARN) of the theme.
 */
  Arn?: Arn;
  /**
 * The name that the user gives to the theme.
 */
  Name?: ThemeName;
  /**
 * The identifier that the user gives to the theme.
 */
  ThemeId?: ShortRestrictiveResourceId;
  Version?: ThemeVersion;
  /**
 * The date and time that the theme was created.
 */
  CreatedTime?: Timestamp;
  /**
 * The date and time that the theme was last updated.
 */
  LastUpdatedTime?: Timestamp;
  /**
 * The type of theme, based on how it was created. Valid values include: QUICKSIGHT and CUSTOM.
 */
  Type?: ThemeType;
}
interface ThemeConfiguration {
/**
 * Color properties that apply to chart data colors.
 */
  DataColorPalette?: DataColorPalette;
  /**
 * Color properties that apply to the UI and to charts, excluding the colors that apply to data.
 */
  UIColorPalette?: UIColorPalette;
  /**
 * Display options related to sheets.
 */
  Sheet?: SheetStyle;
  Typography?: Typography;
}
interface ThemeError {
/**
 * The type of error.
 */
  Type?: ThemeErrorType;
  /**
 * The error message.
 */
  Message?: NonEmptyString;
}
type ThemeErrorList = ThemeError[];
type ThemeErrorType = 'INTERNAL_FAILURE'|string;
type ThemeName = string;
type ThemeType = 'QUICKSIGHT'|'CUSTOM'|'ALL'|string;
interface ThemeVersion {
/**
 * The version number of the theme.
 */
  VersionNumber?: VersionNumber;
  /**
 * The Amazon Resource Name (ARN) of the resource.
 */
  Arn?: Arn;
  /**
 * The description of the theme.
 */
  Description?: VersionDescription;
  /**
 * The Amazon QuickSight-defined ID of the theme that a custom theme inherits from. All themes initially inherit from a default Amazon QuickSight theme.
 */
  BaseThemeId?: ShortRestrictiveResourceId;
  /**
 * The date and time that this theme version was created.
 */
  CreatedTime?: Timestamp;
  /**
 * The theme configuration, which contains all the theme display properties.
 */
  Configuration?: ThemeConfiguration;
  /**
 * Errors associated with the theme.
 */
  Errors?: ThemeErrorList;
  /**
 * The status of the theme version.
 */
  Status?: ResourceStatus;
}
interface TileLayoutStyle {
/**
 * The gutter settings that apply between tiles.
 */
  Gutter?: GutterStyle;
  /**
 * The margin settings that apply around the outside edge of sheets.
 */
  Margin?: MarginStyle;
}
interface TileStyle {
/**
 * The border around a tile.
 */
  Border?: BorderStyle;
}
type Timestamp = Date;
interface TransformOperation {
/**
 * An operation that projects columns. Operations that come after a projection can only refer to projected columns.
 */
  ProjectOperation?: ProjectOperation;
  /**
 * An operation that filters rows based on some condition.
 */
  FilterOperation?: FilterOperation;
  /**
 * An operation that creates calculated columns. Columns created in one such operation form a lexical closure.
 */
  CreateColumnsOperation?: CreateColumnsOperation;
  /**
 * An operation that renames a column.
 */
  RenameColumnOperation?: RenameColumnOperation;
  /**
 * A transform operation that casts a column to a different type.
 */
  CastColumnTypeOperation?: CastColumnTypeOperation;
  /**
 * An operation that tags a column with additional information.
 */
  TagColumnOperation?: TagColumnOperation;
  UntagColumnOperation?: UntagColumnOperation;
}
type TransformOperationList = TransformOperation[];
interface TwitterParameters {
/**
 * Twitter query string.
 */
  Query: Query;
  /**
 * Maximum number of rows to query Twitter.
 */
  MaxRows: PositiveInteger;
}
type TypeCastFormat = string;
interface Typography {
/**
 * Determines the list of font families.
 */
  FontFamilies?: FontList;
}
interface UIColorPalette {
/**
 * The color of text and other foreground elements that appear over the primary background regions, such as grid lines, borders, table banding, icons, and so on.
 */
  PrimaryForeground?: HexColor;
  /**
 * The background color that applies to visuals and other high emphasis UI.
 */
  PrimaryBackground?: HexColor;
  /**
 * The foreground color that applies to any sheet title, sheet control text, or UI that appears over the secondary background.
 */
  SecondaryForeground?: HexColor;
  /**
 * The background color that applies to the sheet background and sheet controls.
 */
  SecondaryBackground?: HexColor;
  /**
 * This color is that applies to selected states and buttons.
 */
  Accent?: HexColor;
  /**
 * The foreground color that applies to any text or other elements that appear over the accent color.
 */
  AccentForeground?: HexColor;
  /**
 * The color that applies to error messages.
 */
  Danger?: HexColor;
  /**
 * The foreground color that applies to any text or other elements that appear over the error color.
 */
  DangerForeground?: HexColor;
  /**
 * This color that applies to warning and informational messages.
 */
  Warning?: HexColor;
  /**
 * The foreground color that applies to any text or other elements that appear over the warning color.
 */
  WarningForeground?: HexColor;
  /**
 * The color that applies to success messages, for example the check mark for a successful download.
 */
  Success?: HexColor;
  /**
 * The foreground color that applies to any text or other elements that appear over the success color.
 */
  SuccessForeground?: HexColor;
  /**
 * The color that applies to the names of fields that are identified as dimensions.
 */
  Dimension?: HexColor;
  /**
 * The foreground color that applies to any text or other elements that appear over the dimension color.
 */
  DimensionForeground?: HexColor;
  /**
 * The color that applies to the names of fields that are identified as measures.
 */
  Measure?: HexColor;
  /**
 * The foreground color that applies to any text or other elements that appear over the measure color.
 */
  MeasureForeground?: HexColor;
}
interface UntagColumnOperation {
/**
 * The column that this operation acts on.
 */
  ColumnName: ColumnName;
  /**
 * The column tags to remove from this column.
 */
  TagNames: ColumnTagNames;
}
interface UploadSettings {
/**
 * File format.
 */
  Format?: FileFormat;
  /**
 * A row number to start reading data from.
 */
  StartFromRow?: PositiveInteger;
  /**
 * Whether the file has a header row, or the files each have a header row.
 */
  ContainsHeader?: Boolean;
  /**
 * Text qualifier.
 */
  TextQualifier?: TextQualifier;
  /**
 * The delimiter between values in the file.
 */
  Delimiter?: Delimiter;
}
type VersionDescription = string;
type VersionNumber = number;
interface VpcConnectionProperties {
/**
 * The Amazon Resource Name (ARN) for the VPC connection.
 */
  VpcConnectionArn: Arn;
}
type Warehouse = string;
type WorkGroup = string;

