
export namespace QuickSightContextResponse {
  export type ActionList = String[];
  export interface AmazonElasticsearchParameters {
  /**
     * The OpenSearch domain.
     */
    readonly Domain: Domain;
  }
  export interface AmazonOpenSearchParameters {
  /**
     * The OpenSearch domain.
     */
    readonly Domain: Domain;
  }
  export interface Analysis {
  /**
     * The ID of the analysis.
     */
    readonly AnalysisId?: ShortRestrictiveResourceId;
    /**
     * The Amazon Resource Name (ARN) of the analysis.
     */
    readonly Arn?: Arn;
    /**
     * The descriptive name of the analysis.
     */
    readonly Name?: AnalysisName;
    /**
     * Status associated with the analysis.
     */
    readonly Status?: ResourceStatus;
    /**
     * Errors associated with the analysis.
     */
    readonly Errors?: AnalysisErrorList;
    /**
     * The ARNs of the datasets of the analysis.
     */
    readonly DataSetArns?: DataSetArnsList;
    /**
     * The ARN of the theme of the analysis.
     */
    readonly ThemeArn?: Arn;
    /**
     * The time that the analysis was created.
     */
    readonly CreatedTime?: Timestamp;
    /**
     * The time that the analysis was last updated.
     */
    readonly LastUpdatedTime?: Timestamp;
    /**
     * A list of the associated sheets with the unique identifier and name of each sheet.
     */
    readonly Sheets?: SheetList;
  }
  export interface AnalysisError {
  /**
     * The type of the analysis error.
     */
    readonly Type?: AnalysisErrorType;
    /**
     * The message associated with the analysis error.
     */
    readonly Message?: NonEmptyString;
    /**
     *
     */
    readonly ViolatedEntities?: EntityList;
  }
  export type AnalysisErrorList = AnalysisError[];
  export type AnalysisErrorType = 'ACCESS_DENIED'|'SOURCE_NOT_FOUND'|'DATA_SET_NOT_FOUND'|'INTERNAL_FAILURE'|'PARAMETER_VALUE_INCOMPATIBLE'|'PARAMETER_TYPE_INVALID'|'PARAMETER_NOT_FOUND'|'COLUMN_TYPE_MISMATCH'|'COLUMN_GEOGRAPHIC_ROLE_MISMATCH'|'COLUMN_REPLACEMENT_MISSING'|string;
  export type AnalysisName = string;
  export type Arn = string;
  export interface AthenaParameters {
  /**
     * The workgroup that Amazon Athena uses.
     */
    readonly WorkGroup?: WorkGroup;
    /**
     * Use the RoleArn structure to override an account-wide role for a specific Athena data source. For example, say an account administrator has turned off all Athena access with an account-wide role. The administrator can then use RoleArn to bypass the account-wide role and allow Athena access for the single Athena data source that is specified in the structure, even if the account-wide role forbidding Athena access is still active.
     */
    readonly RoleArn?: RoleArn;
  }
  export interface AuroraParameters {
  /**
     * Host.
     */
    readonly Host: Host;
    /**
     * Port.
     */
    readonly Port: Port;
    /**
     * Database.
     */
    readonly Database: Database;
  }
  export interface AuroraPostgreSqlParameters {
  /**
     * The Amazon Aurora PostgreSQL-Compatible host to connect to.
     */
    readonly Host: Host;
    /**
     * The port that Amazon Aurora PostgreSQL is listening on.
     */
    readonly Port: Port;
    /**
     * The Amazon Aurora PostgreSQL database to connect to.
     */
    readonly Database: Database;
  }
  export interface AwsIotAnalyticsParameters {
  /**
     * Dataset name.
     */
    readonly DataSetName: DataSetName;
  }
  export type Boolean = boolean;
  export interface BorderStyle {
  /**
     * The option to enable display of borders for visuals.
     */
    readonly Show?: Boolean;
  }
  export interface CalculatedColumn {
  /**
     * Column name.
     */
    readonly ColumnName: ColumnName;
    /**
     * A unique ID to identify a calculated column. During a dataset update, if the column ID of a calculated column matches that of an existing calculated column, Amazon QuickSight preserves the existing calculated column.
     */
    readonly ColumnId: ColumnId;
    /**
     * An expression that defines the calculated column.
     */
    readonly Expression: Expression;
  }
  export type CalculatedColumnList = CalculatedColumn[];
  export interface CastColumnTypeOperation {
  /**
     * Column name.
     */
    readonly ColumnName: ColumnName;
    /**
     * New column data type.
     */
    readonly NewColumnType: ColumnDataType;
    /**
     * When casting a column from string to datetime type, you can supply a string in a format supported by Amazon QuickSight to denote the source data format.
     */
    readonly Format?: TypeCastFormat;
  }
  export type Catalog = string;
  export type ClusterId = string;
  export type ColorList = HexColor[];
  export type ColumnDataType = 'STRING'|'INTEGER'|'DECIMAL'|'DATETIME'|string;
  export interface ColumnDescription {
  /**
     * The text of a description for a column.
     */
    readonly Text?: ColumnDescriptiveText;
  }
  export type ColumnDescriptiveText = string;
  export interface ColumnGroup {
  /**
     * Geospatial column group that denotes a hierarchy.
     */
    readonly GeoSpatialColumnGroup?: GeoSpatialColumnGroup;
  }
  export interface ColumnGroupColumnSchema {
  /**
     * The name of the column group's column schema.
     */
    readonly Name?: String;
  }
  export type ColumnGroupColumnSchemaList = ColumnGroupColumnSchema[];
  export type ColumnGroupList = ColumnGroup[];
  export type ColumnGroupName = string;
  export interface ColumnGroupSchema {
  /**
     * The name of the column group schema.
     */
    readonly Name?: String;
    /**
     * A structure containing the list of schemas for column group columns.
     */
    readonly ColumnGroupColumnSchemaList?: ColumnGroupColumnSchemaList;
  }
  export type ColumnGroupSchemaList = ColumnGroupSchema[];
  export type ColumnId = string;
  export interface ColumnLevelPermissionRule {
  /**
     * An array of Amazon Resource Names (ARNs) for Amazon QuickSight users or groups.
     */
    readonly Principals?: PrincipalList;
    /**
     * An array of column names.
     */
    readonly ColumnNames?: ColumnNameList;
  }
  export type ColumnLevelPermissionRuleList = ColumnLevelPermissionRule[];
  export type ColumnList = ColumnName[];
  export type ColumnName = string;
  export type ColumnNameList = String[];
  export interface ColumnSchema {
  /**
     * The name of the column schema.
     */
    readonly Name?: String;
    /**
     * The data type of the column schema.
     */
    readonly DataType?: String;
    /**
     * The geographic role of the column schema.
     */
    readonly GeographicRole?: String;
  }
  export type ColumnSchemaList = ColumnSchema[];
  export interface ColumnTag {
  /**
     * A geospatial role for a column.
     */
    readonly ColumnGeographicRole?: GeoSpatialDataRole;
    /**
     * A description for a column.
     */
    readonly ColumnDescription?: ColumnDescription;
  }
  export type ColumnTagList = ColumnTag[];
  export type ColumnTagName = 'COLUMN_GEOGRAPHIC_ROLE'|'COLUMN_DESCRIPTION'|string;
  export type ColumnTagNames = ColumnTagName[];
  export interface CreateColumnsOperation {
  /**
     * Calculated columns to create.
     */
    readonly Columns: CalculatedColumnList;
  }
  export interface CustomSql {
  /**
     * The Amazon Resource Name (ARN) of the data source.
     */
    readonly DataSourceArn: Arn;
    /**
     * A display name for the SQL query result.
     */
    readonly Name: CustomSqlName;
    /**
     * The SQL query.
     */
    readonly SqlQuery: SqlQuery;
    /**
     * The column schema from the SQL query result set.
     */
    readonly Columns?: InputColumnList;
  }
  export type CustomSqlName = string;
  export interface Dashboard {
  /**
     * Dashboard ID.
     */
    readonly DashboardId?: ShortRestrictiveResourceId;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    readonly Arn?: Arn;
    /**
     * A display name for the dashboard.
     */
    readonly Name?: DashboardName;
    /**
     * Version.
     */
    readonly Version?: DashboardVersion;
    /**
     * The time that this dashboard was created.
     */
    readonly CreatedTime?: Timestamp;
    /**
     * The last time that this dashboard was published.
     */
    readonly LastPublishedTime?: Timestamp;
    /**
     * The last time that this dashboard was updated.
     */
    readonly LastUpdatedTime?: Timestamp;
  }
  export interface DashboardError {
  /**
     * Type.
     */
    readonly Type?: DashboardErrorType;
    /**
     * Message.
     */
    readonly Message?: NonEmptyString;
    /**
     *
     */
    readonly ViolatedEntities?: EntityList;
  }
  export type DashboardErrorList = DashboardError[];
  export type DashboardErrorType = 'ACCESS_DENIED'|'SOURCE_NOT_FOUND'|'DATA_SET_NOT_FOUND'|'INTERNAL_FAILURE'|'PARAMETER_VALUE_INCOMPATIBLE'|'PARAMETER_TYPE_INVALID'|'PARAMETER_NOT_FOUND'|'COLUMN_TYPE_MISMATCH'|'COLUMN_GEOGRAPHIC_ROLE_MISMATCH'|'COLUMN_REPLACEMENT_MISSING'|string;
  export type DashboardName = string;
  export interface DashboardVersion {
  /**
     * The time that this dashboard version was created.
     */
    readonly CreatedTime?: Timestamp;
    /**
     * Errors associated with this dashboard version.
     */
    readonly Errors?: DashboardErrorList;
    /**
     * Version number for this version of the dashboard.
     */
    readonly VersionNumber?: VersionNumber;
    /**
     * The HTTP status of the request.
     */
    readonly Status?: ResourceStatus;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    readonly Arn?: Arn;
    /**
     * Source entity ARN.
     */
    readonly SourceEntityArn?: Arn;
    /**
     * The Amazon Resource Numbers (ARNs) for the datasets that are associated with this version of the dashboard.
     */
    readonly DataSetArns?: DataSetArnsList;
    /**
     * Description.
     */
    readonly Description?: VersionDescription;
    /**
     * The ARN of the theme associated with a version of the dashboard.
     */
    readonly ThemeArn?: Arn;
    /**
     * A list of the associated sheets with the unique identifier and name of each sheet.
     */
    readonly Sheets?: SheetList;
  }
  export interface DataColorPalette {
  /**
     * The hexadecimal codes for the colors.
     */
    readonly Colors?: ColorList;
    /**
     * The minimum and maximum hexadecimal codes that describe a color gradient.
     */
    readonly MinMaxGradient?: ColorList;
    /**
     * The hexadecimal code of a color that applies to charts where a lack of data is highlighted.
     */
    readonly EmptyFillColor?: HexColor;
  }
  export interface DataSet {
  /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    readonly Arn?: Arn;
    /**
     * The ID of the dataset.
     */
    readonly DataSetId?: ResourceId;
    /**
     * A display name for the dataset.
     */
    readonly Name?: ResourceName;
    /**
     * The time that this dataset was created.
     */
    readonly CreatedTime?: Timestamp;
    /**
     * The last time that this dataset was updated.
     */
    readonly LastUpdatedTime?: Timestamp;
    /**
     * Declares the physical tables that are available in the underlying data sources.
     */
    readonly PhysicalTableMap?: PhysicalTableMap;
    /**
     * Configures the combination and transformation of the data from the physical tables.
     */
    readonly LogicalTableMap?: LogicalTableMap;
    /**
     * The list of columns after all transforms. These columns are available in templates, analyses, and dashboards.
     */
    readonly OutputColumns?: OutputColumnList;
    /**
     * A value that indicates whether you want to import the data into SPICE.
     */
    readonly ImportMode?: DataSetImportMode;
    /**
     * The amount of SPICE capacity used by this dataset. This is 0 if the dataset isn't imported into SPICE.
     */
    readonly ConsumedSpiceCapacityInBytes?: Long;
    /**
     * Groupings of columns that work together in certain Amazon QuickSight features. Currently, only geospatial hierarchy is supported.
     */
    readonly ColumnGroups?: ColumnGroupList;
    /**
     * The folder that contains fields and nested subfolders for your dataset.
     */
    readonly FieldFolders?: FieldFolderMap;
    /**
     * The row-level security configuration for the dataset.
     */
    readonly RowLevelPermissionDataSet?: RowLevelPermissionDataSet;
    /**
     * The element you can use to define tags for row-level security.
     */
    readonly RowLevelPermissionTagConfiguration?: RowLevelPermissionTagConfiguration;
    /**
     * A set of one or more definitions of a  ColumnLevelPermissionRule .
     */
    readonly ColumnLevelPermissionRules?: ColumnLevelPermissionRuleList;
    /**
     * The usage configuration to apply to child datasets that reference this dataset as a source.
     */
    readonly DataSetUsageConfiguration?: DataSetUsageConfiguration;
  }
  export type DataSetArnsList = Arn[];
  export interface DataSetConfiguration {
  /**
     * Placeholder.
     */
    readonly Placeholder?: String;
    /**
     * Dataset schema.
     */
    readonly DataSetSchema?: DataSetSchema;
    /**
     * A structure containing the list of column group schemas.
     */
    readonly ColumnGroupSchemaList?: ColumnGroupSchemaList;
  }
  export type DataSetConfigurationList = DataSetConfiguration[];
  export type DataSetImportMode = 'SPICE'|'DIRECT_QUERY'|string;
  export type DataSetName = string;
  export interface DataSetSchema {
  /**
     * A structure containing the list of column schemas.
     */
    readonly ColumnSchemaList?: ColumnSchemaList;
  }
  export interface DataSetUsageConfiguration {
  /**
     * An option that controls whether a child dataset of a direct query can use this dataset as a source.
     */
    readonly DisableUseAsDirectQuerySource?: Boolean;
    /**
     * An option that controls whether a child dataset that's stored in QuickSight can use this dataset as a source.
     */
    readonly DisableUseAsImportedSource?: Boolean;
  }
  export interface DataSource {
  /**
     * The Amazon Resource Name (ARN) of the data source.
     */
    readonly Arn?: Arn;
    /**
     * The ID of the data source. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    readonly DataSourceId?: ResourceId;
    /**
     * A display name for the data source.
     */
    readonly Name?: ResourceName;
    /**
     * The type of the data source. This type indicates which database engine the data source connects to.
     */
    readonly Type?: DataSourceType;
    /**
     * The HTTP status of the request.
     */
    readonly Status?: ResourceStatus;
    /**
     * The time that this data source was created.
     */
    readonly CreatedTime?: Timestamp;
    /**
     * The last time that this data source was updated.
     */
    readonly LastUpdatedTime?: Timestamp;
    /**
     * The parameters that Amazon QuickSight uses to connect to your underlying source. This is a variant type structure. For this structure to be valid, only one of the attributes can be non-null.
     */
    readonly DataSourceParameters?: DataSourceParameters;
    /**
     * A set of alternate data source parameters that you want to share for the credentials stored with this data source. The credentials are applied in tandem with the data source parameters when you copy a data source by using a create or update request. The API operation compares the DataSourceParameters structure that's in the request with the structures in the AlternateDataSourceParameters allow list. If the structures are an exact match, the request is allowed to use the credentials from this existing data source. If the AlternateDataSourceParameters list is null, the Credentials originally used with this DataSourceParameters are automatically allowed.
     */
    readonly AlternateDataSourceParameters?: DataSourceParametersList;
    /**
     * The VPC connection information. You need to use this parameter only when you want Amazon QuickSight to use a VPC connection when connecting to your underlying source.
     */
    readonly VpcConnectionProperties?: VpcConnectionProperties;
    /**
     * Secure Socket Layer (SSL) properties that apply when Amazon QuickSight connects to your underlying source.
     */
    readonly SslProperties?: SslProperties;
    /**
     * Error information from the last update or the creation of the data source.
     */
    readonly ErrorInfo?: DataSourceErrorInfo;
    /**
     * The Amazon Resource Name (ARN) of the secret associated with the data source in Amazon Secrets Manager.
     */
    readonly SecretArn?: SecretArn;
  }
  export interface DataSourceErrorInfo {
  /**
     * Error type.
     */
    readonly Type?: DataSourceErrorInfoType;
    /**
     * Error message.
     */
    readonly Message?: String;
  }
  export type DataSourceErrorInfoType = 'ACCESS_DENIED'|'COPY_SOURCE_NOT_FOUND'|'TIMEOUT'|'ENGINE_VERSION_NOT_SUPPORTED'|'UNKNOWN_HOST'|'GENERIC_SQL_FAILURE'|'CONFLICT'|'UNKNOWN'|string;
  export interface DataSourceParameters {
  /**
     * The parameters for OpenSearch.
     */
    readonly AmazonElasticsearchParameters?: AmazonElasticsearchParameters;
    /**
     * The parameters for Amazon Athena.
     */
    readonly AthenaParameters?: AthenaParameters;
    /**
     * The parameters for Amazon Aurora MySQL.
     */
    readonly AuroraParameters?: AuroraParameters;
    /**
     * The parameters for Amazon Aurora.
     */
    readonly AuroraPostgreSqlParameters?: AuroraPostgreSqlParameters;
    /**
     * The parameters for IoT Analytics.
     */
    readonly AwsIotAnalyticsParameters?: AwsIotAnalyticsParameters;
    /**
     * The parameters for Jira.
     */
    readonly JiraParameters?: JiraParameters;
    /**
     * The parameters for MariaDB.
     */
    readonly MariaDbParameters?: MariaDbParameters;
    /**
     * The parameters for MySQL.
     */
    readonly MySqlParameters?: MySqlParameters;
    /**
     * The parameters for Oracle.
     */
    readonly OracleParameters?: OracleParameters;
    /**
     * The parameters for PostgreSQL.
     */
    readonly PostgreSqlParameters?: PostgreSqlParameters;
    /**
     * The parameters for Presto.
     */
    readonly PrestoParameters?: PrestoParameters;
    /**
     * The parameters for Amazon RDS.
     */
    readonly RdsParameters?: RdsParameters;
    /**
     * The parameters for Amazon Redshift.
     */
    readonly RedshiftParameters?: RedshiftParameters;
    /**
     * The parameters for S3.
     */
    readonly S3Parameters?: S3Parameters;
    /**
     * The parameters for ServiceNow.
     */
    readonly ServiceNowParameters?: ServiceNowParameters;
    /**
     * The parameters for Snowflake.
     */
    readonly SnowflakeParameters?: SnowflakeParameters;
    /**
     * The parameters for Spark.
     */
    readonly SparkParameters?: SparkParameters;
    /**
     * The parameters for SQL Server.
     */
    readonly SqlServerParameters?: SqlServerParameters;
    /**
     * The parameters for Teradata.
     */
    readonly TeradataParameters?: TeradataParameters;
    /**
     * The parameters for Twitter.
     */
    readonly TwitterParameters?: TwitterParameters;
    /**
     * The parameters for OpenSearch.
     */
    readonly AmazonOpenSearchParameters?: AmazonOpenSearchParameters;
    /**
     * The parameters for Exasol.
     */
    readonly ExasolParameters?: ExasolParameters;
    /**
     * The required parameters that are needed to connect to a Databricks data source.
     */
    readonly DatabricksParameters?: DatabricksParameters;
  }
  export type DataSourceParametersList = DataSourceParameters[];
  export type DataSourceType = 'ADOBE_ANALYTICS'|'AMAZON_ELASTICSEARCH'|'ATHENA'|'AURORA'|'AURORA_POSTGRESQL'|'AWS_IOT_ANALYTICS'|'GITHUB'|'JIRA'|'MARIADB'|'MYSQL'|'ORACLE'|'POSTGRESQL'|'PRESTO'|'REDSHIFT'|'S3'|'SALESFORCE'|'SERVICENOW'|'SNOWFLAKE'|'SPARK'|'SQLSERVER'|'TERADATA'|'TWITTER'|'TIMESTREAM'|'AMAZON_OPENSEARCH'|'EXASOL'|'DATABRICKS'|string;
  export type Database = string;
  export interface DatabricksParameters {
  /**
     * The host name of the Databricks data source.
     */
    readonly Host: Host;
    /**
     * The port for the Databricks data source.
     */
    readonly Port: Port;
    /**
     * The HTTP path of the Databricks data source.
     */
    readonly SqlEndpointPath: SqlEndpointPath;
  }
  export type Delimiter = string;
  export type Domain = string;
  export interface Entity {
  /**
     * The hierarchical path of the entity within the analysis, template, or dashboard definition tree.
     */
    readonly Path?: NonEmptyString;
  }
  export type EntityList = Entity[];
  export interface ExasolParameters {
  /**
     * The hostname or IP address of the Exasol data source.
     */
    readonly Host: Host;
    /**
     * The port for the Exasol data source.
     */
    readonly Port: Port;
  }
  export type Expression = string;
  export interface FieldFolder {
  /**
     * The description for a field folder.
     */
    readonly description?: FieldFolderDescription;
    /**
     * A folder has a list of columns. A column can only be in one folder.
     */
    readonly columns?: FolderColumnList;
  }
  export type FieldFolderDescription = string;
  export type FieldFolderMap = {[key: string]: FieldFolder};
  export type FileFormat = 'CSV'|'TSV'|'CLF'|'ELF'|'XLSX'|'JSON'|string;
  export interface FilterOperation {
  /**
     * An expression that must evaluate to a Boolean value. Rows for which the expression evaluates to true are kept in the dataset.
     */
    readonly ConditionExpression: Expression;
  }
  export type FolderColumnList = String[];
  export interface Font {
  /**
     * Determines the font family settings.
     */
    readonly FontFamily?: String;
  }
  export type FontList = Font[];
  export interface GeoSpatialColumnGroup {
  /**
     * A display name for the hierarchy.
     */
    readonly Name: ColumnGroupName;
    /**
     * Country code.
     */
    readonly CountryCode?: GeoSpatialCountryCode;
    /**
     * Columns in this hierarchy.
     */
    readonly Columns: ColumnList;
  }
  export type GeoSpatialCountryCode = 'US'|string;
  export type GeoSpatialDataRole = 'COUNTRY'|'STATE'|'COUNTY'|'CITY'|'POSTCODE'|'LONGITUDE'|'LATITUDE'|string;
  export interface GutterStyle {
  /**
     * This Boolean value controls whether to display a gutter space between sheet tiles.
     */
    readonly Show?: Boolean;
  }
  export type HexColor = string;
  export type Host = string;
  export interface InputColumn {
  /**
     * The name of this column in the underlying data source.
     */
    readonly Name: ColumnName;
    /**
     * The data type of the column.
     */
    readonly Type: InputColumnDataType;
  }
  export type InputColumnDataType = 'STRING'|'INTEGER'|'DECIMAL'|'DATETIME'|'BIT'|'BOOLEAN'|'JSON'|string;
  export type InputColumnList = InputColumn[];
  export type InstanceId = string;
  export interface JiraParameters {
  /**
     * The base URL of the Jira site.
     */
    readonly SiteBaseUrl: SiteBaseUrl;
  }
  export interface JoinInstruction {
  /**
     * The operand on the left side of a join.
     */
    readonly LeftOperand: LogicalTableId;
    /**
     * The operand on the right side of a join.
     */
    readonly RightOperand: LogicalTableId;
    /**
     * Join key properties of the left operand.
     */
    readonly LeftJoinKeyProperties?: JoinKeyProperties;
    /**
     * Join key properties of the right operand.
     */
    readonly RightJoinKeyProperties?: JoinKeyProperties;
    /**
     * The type of join that it is.
     */
    readonly Type: JoinType;
    /**
     * The join instructions provided in the ON clause of a join.
     */
    readonly OnClause: OnClause;
  }
  export interface JoinKeyProperties {
  /**
     * A value that indicates that a row in a table is uniquely identified by the columns in a join key. This is used by Amazon QuickSight to optimize query performance.
     */
    readonly UniqueKey?: Boolean;
  }
  export type JoinType = 'INNER'|'OUTER'|'LEFT'|'RIGHT'|string;
  export interface LogicalTable {
  /**
     * A display name for the logical table.
     */
    readonly Alias: LogicalTableAlias;
    /**
     * Transform operations that act on this logical table. For this structure to be valid, only one of the attributes can be non-null.
     */
    readonly DataTransforms?: TransformOperationList;
    /**
     * Source of this logical table.
     */
    readonly Source: LogicalTableSource;
  }
  export type LogicalTableAlias = string;
  export type LogicalTableId = string;
  export type LogicalTableMap = {[key: string]: LogicalTable};
  export interface LogicalTableSource {
  /**
     * Specifies the result of a join of two logical tables.
     */
    readonly JoinInstruction?: JoinInstruction;
    /**
     * Physical table ID.
     */
    readonly PhysicalTableId?: PhysicalTableId;
    /**
     * The Amazon Resource Number (ARN) of the parent dataset.
     */
    readonly DataSetArn?: Arn;
  }
  export type Long = number;
  export interface ManifestFileLocation {
  /**
     * Amazon S3 bucket.
     */
    readonly Bucket: S3Bucket;
    /**
     * Amazon S3 key that identifies an object.
     */
    readonly Key: S3Key;
  }
  export interface MarginStyle {
  /**
     * This Boolean value controls whether to display sheet margins.
     */
    readonly Show?: Boolean;
  }
  export interface MariaDbParameters {
  /**
     * Host.
     */
    readonly Host: Host;
    /**
     * Port.
     */
    readonly Port: Port;
    /**
     * Database.
     */
    readonly Database: Database;
  }
  export interface MySqlParameters {
  /**
     * Host.
     */
    readonly Host: Host;
    /**
     * Port.
     */
    readonly Port: Port;
    /**
     * Database.
     */
    readonly Database: Database;
  }
  export type Namespace = string;
  export type NonEmptyString = string;
  export type OnClause = string;
  export type OptionalPort = number;
  export interface OracleParameters {
  /**
     * An Oracle host.
     */
    readonly Host: Host;
    /**
     * Port.
     */
    readonly Port: Port;
    /**
     * Database.
     */
    readonly Database: Database;
  }
  export interface OutputColumn {
  /**
     * A display name for the dataset.
     */
    readonly Name?: ColumnName;
    /**
     * A description for a column.
     */
    readonly Description?: ColumnDescriptiveText;
    /**
     * Type.
     */
    readonly Type?: ColumnDataType;
  }
  export type OutputColumnList = OutputColumn[];
  export interface PhysicalTable {
  /**
     * A physical table type for relational data sources.
     */
    readonly RelationalTable?: RelationalTable;
    /**
     * A physical table type built from the results of the custom SQL query.
     */
    readonly CustomSql?: CustomSql;
    /**
     * A physical table type for as S3 data source.
     */
    readonly S3Source?: S3Source;
  }
  export type PhysicalTableId = string;
  export type PhysicalTableMap = {[key: string]: PhysicalTable};
  export type Port = number;
  export type PositiveInteger = number;
  export interface PostgreSqlParameters {
  /**
     * Host.
     */
    readonly Host: Host;
    /**
     * Port.
     */
    readonly Port: Port;
    /**
     * Database.
     */
    readonly Database: Database;
  }
  export interface PrestoParameters {
  /**
     * Host.
     */
    readonly Host: Host;
    /**
     * Port.
     */
    readonly Port: Port;
    /**
     * Catalog.
     */
    readonly Catalog: Catalog;
  }
  export type Principal = string;
  export type PrincipalList = String[];
  export interface ProjectOperation {
  /**
     * Projected columns.
     */
    readonly ProjectedColumns: ProjectedColumnList;
  }
  export type ProjectedColumnList = String[];
  export type Query = string;
  export interface RdsParameters {
  /**
     * Instance ID.
     */
    readonly InstanceId: InstanceId;
    /**
     * Database.
     */
    readonly Database: Database;
  }
  export interface RedshiftParameters {
  /**
     * Host. This field can be blank if ClusterId is provided.
     */
    readonly Host?: Host;
    /**
     * Port. This field can be blank if the ClusterId is provided.
     */
    readonly Port?: OptionalPort;
    /**
     * Database.
     */
    readonly Database: Database;
    /**
     * Cluster ID. This field can be blank if the Host and Port are provided.
     */
    readonly ClusterId?: ClusterId;
  }
  export interface RelationalTable {
  /**
     * The Amazon Resource Name (ARN) for the data source.
     */
    readonly DataSourceArn: Arn;
    /**
     * The catalog associated with a table.
     */
    readonly Catalog?: RelationalTableCatalog;
    /**
     * The schema name. This name applies to certain relational database engines.
     */
    readonly Schema?: RelationalTableSchema;
    /**
     * The name of the relational table.
     */
    readonly Name: RelationalTableName;
    /**
     * The column schema of the table.
     */
    readonly InputColumns: InputColumnList;
  }
  export type RelationalTableCatalog = string;
  export type RelationalTableName = string;
  export type RelationalTableSchema = string;
  export interface RenameColumnOperation {
  /**
     * The name of the column to be renamed.
     */
    readonly ColumnName: ColumnName;
    /**
     * The new name for the column.
     */
    readonly NewColumnName: ColumnName;
  }
  export type ResourceId = string;
  export type ResourceName = string;
  export interface ResourcePermission {
  /**
     * The Amazon Resource Name (ARN) of the principal. This can be one of the readonly following:   The ARN of an Amazon QuickSight user or group associated with a data source or dataset. (This is common.)   The ARN of an Amazon QuickSight user, group, or namespace associated with an analysis, dashboard, template, or theme. (This is common.)   The ARN of an Amazon Web Services account readonly root: This is an IAM ARN rather than a QuickSight ARN. Use this option only to share resources (templates) across Amazon Web Services accounts. (This is less common.)
     */
    readonly Principal: Principal;
    /**
     * The IAM action to grant or revoke permissions on.
     */
    readonly Actions: ActionList;
  }
  export type ResourcePermissionList = ResourcePermission[];
  export type ResourceStatus = 'CREATION_IN_PROGRESS'|'CREATION_SUCCESSFUL'|'CREATION_FAILED'|'UPDATE_IN_PROGRESS'|'UPDATE_SUCCESSFUL'|'UPDATE_FAILED'|'DELETED'|string;
  export type RoleArn = string;
  export interface RowLevelPermissionDataSet {
  /**
     * The namespace associated with the dataset that contains permissions for RLS.
     */
    readonly Namespace?: Namespace;
    /**
     * The Amazon Resource Name (ARN) of the dataset that contains permissions for RLS.
     */
    readonly Arn: Arn;
    /**
     * The type of permissions to use when interpreting the permissions for RLS. DENY_ACCESS is included for backward compatibility only.
     */
    readonly PermissionPolicy: RowLevelPermissionPolicy;
    /**
     * The user or group rules associated with the dataset that contains permissions for RLS. By default, FormatVersion is VERSION_1. When FormatVersion is VERSION_1, UserName and GroupName are required. When FormatVersion is VERSION_2, UserARN and GroupARN are required, and Namespace must not exist.
     */
    readonly FormatVersion?: RowLevelPermissionFormatVersion;
    /**
     * The status of the row-level security permission dataset. If enabled, the status is ENABLED. If disabled, the status is DISABLED.
     */
    readonly Status?: Status;
  }
  export type RowLevelPermissionFormatVersion = 'VERSION_1'|'VERSION_2'|string;
  export type RowLevelPermissionPolicy = 'GRANT_ACCESS'|'DENY_ACCESS'|string;
  export interface RowLevelPermissionTagConfiguration {
  /**
     * The status of row-level security tags. If enabled, the status is ENABLED. If disabled, the status is DISABLED.
     */
    readonly Status?: Status;
    /**
     * A set of rules associated with row-level security, such as the tag names and columns that they are assigned to.
     */
    readonly TagRules: RowLevelPermissionTagRuleList;
  }
  export type RowLevelPermissionTagDelimiter = string;
  export interface RowLevelPermissionTagRule {
  /**
     * The unique key for a tag.
     */
    readonly TagKey: SessionTagKey;
    /**
     * The column name that a tag key is assigned to.
     */
    readonly ColumnName: String;
    /**
     * A string that you want to use to delimit the values when you pass the values at run time. For example, you can delimit the values with a comma.
     */
    readonly TagMultiValueDelimiter?: RowLevelPermissionTagDelimiter;
    /**
     * A string that you want to use to filter by all the values in a column in the dataset and don’t want to list the values one by one. For example, you can use an asterisk as your match all value.
     */
    readonly MatchAllValue?: SessionTagValue;
  }
  export type RowLevelPermissionTagRuleList = RowLevelPermissionTagRule[];
  export type S3Bucket = string;
  export type S3Key = string;
  export interface S3Parameters {
  /**
     * Location of the Amazon S3 manifest file. This is NULL if the manifest file was uploaded into Amazon QuickSight.
     */
    readonly ManifestFileLocation: ManifestFileLocation;
  }
  export interface S3Source {
  /**
     * The Amazon Resource Name (ARN) for the data source.
     */
    readonly DataSourceArn: Arn;
    /**
     * Information about the format for the S3 source file or files.
     */
    readonly UploadSettings?: UploadSettings;
    /**
     * A physical table type for an S3 data source.  For files that aren't JSON, only STRING data types are supported in input columns.
     */
    readonly InputColumns: InputColumnList;
  }
  export type SecretArn = string;
  export interface ServiceNowParameters {
  /**
     * URL of the base site.
     */
    readonly SiteBaseUrl: SiteBaseUrl;
  }
  export type SessionTagKey = string;
  export type SessionTagValue = string;
  export interface Sheet {
  /**
     * The unique identifier associated with a sheet.
     */
    readonly SheetId?: ShortRestrictiveResourceId;
    /**
     * The name of a sheet. This name is displayed on the sheet's tab in the Amazon QuickSight console.
     */
    readonly Name?: SheetName;
  }
  export type SheetList = Sheet[];
  export type SheetName = string;
  export interface SheetStyle {
  /**
     * The display options for tiles.
     */
    readonly Tile?: TileStyle;
    /**
     * The layout options for tiles.
     */
    readonly TileLayout?: TileLayoutStyle;
  }
  export type ShortRestrictiveResourceId = string;
  export type SiteBaseUrl = string;
  export interface SnowflakeParameters {
  /**
     * Host.
     */
    readonly Host: Host;
    /**
     * Database.
     */
    readonly Database: Database;
    /**
     * Warehouse.
     */
    readonly Warehouse: Warehouse;
  }
  export interface SparkParameters {
  /**
     * Host.
     */
    readonly Host: Host;
    /**
     * Port.
     */
    readonly Port: Port;
  }
  export type SqlEndpointPath = string;
  export type SqlQuery = string;
  export interface SqlServerParameters {
  /**
     * Host.
     */
    readonly Host: Host;
    /**
     * Port.
     */
    readonly Port: Port;
    /**
     * Database.
     */
    readonly Database: Database;
  }
  export interface SslProperties {
  /**
     * A Boolean option to control whether SSL should be disabled.
     */
    readonly DisableSsl?: Boolean;
  }
  export type Status = 'ENABLED'|'DISABLED'|string;
  export type String = string;
  export interface Tag {
  /**
     * Tag key.
     */
    readonly Key: TagKey;
    /**
     * Tag value.
     */
    readonly Value: TagValue;
  }
  export interface TagColumnOperation {
  /**
     * The column that this operation acts on.
     */
    readonly ColumnName: ColumnName;
    /**
     * The dataset column tag, currently only used for geospatial type tagging.  This is not tags for the Amazon Web Services tagging feature.
     */
    readonly Tags: ColumnTagList;
  }
  export type TagKey = string;
  export type TagList = Tag[];
  export type TagValue = string;
  export interface Template {
  /**
     * The Amazon Resource Name (ARN) of the template.
     */
    readonly Arn?: Arn;
    /**
     * The display name of the template.
     */
    readonly Name?: TemplateName;
    /**
     * A structure describing the versions of the template.
     */
    readonly Version?: TemplateVersion;
    /**
     * The ID for the template. This is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    readonly TemplateId?: ShortRestrictiveResourceId;
    /**
     * Time when this was last updated.
     */
    readonly LastUpdatedTime?: Timestamp;
    /**
     * Time when this was created.
     */
    readonly CreatedTime?: Timestamp;
  }
  export interface TemplateError {
  /**
     * Type of error.
     */
    readonly Type?: TemplateErrorType;
    /**
     * Description of the error type.
     */
    readonly Message?: NonEmptyString;
    /**
     * An error path that shows which entities caused the template error.
     */
    readonly ViolatedEntities?: EntityList;
  }
  export type TemplateErrorList = TemplateError[];
  export type TemplateErrorType = 'SOURCE_NOT_FOUND'|'DATA_SET_NOT_FOUND'|'INTERNAL_FAILURE'|'ACCESS_DENIED'|string;
  export type TemplateName = string;
  export interface TemplateVersion {
  /**
     * The time that this template version was created.
     */
    readonly CreatedTime?: Timestamp;
    /**
     * Errors associated with this template version.
     */
    readonly Errors?: TemplateErrorList;
    /**
     * The version number of the template version.
     */
    readonly VersionNumber?: VersionNumber;
    /**
     * The status that is associated with the template.    CREATION_IN_PROGRESS     CREATION_SUCCESSFUL     CREATION_FAILED     UPDATE_IN_PROGRESS     UPDATE_SUCCESSFUL     UPDATE_FAILED     DELETED
     */
    readonly Status?: ResourceStatus;
    /**
     * Schema of the dataset identified by the placeholder. Any dashboard created from this template should be bound to new datasets matching the same schema described through this API operation.
     */
    readonly DataSetConfigurations?: DataSetConfigurationList;
    /**
     * The description of the template.
     */
    readonly Description?: VersionDescription;
    /**
     * The Amazon Resource Name (ARN) of an analysis or template that was used to create this template.
     */
    readonly SourceEntityArn?: Arn;
    /**
     * The ARN of the theme associated with this version of the template.
     */
    readonly ThemeArn?: Arn;
    /**
     * A list of the associated sheets with the unique identifier and name of each sheet.
     */
    readonly Sheets?: SheetList;
  }
  export interface TeradataParameters {
  /**
     * Host.
     */
    readonly Host: Host;
    /**
     * Port.
     */
    readonly Port: Port;
    /**
     * Database.
     */
    readonly Database: Database;
  }
  export type TextQualifier = 'DOUBLE_QUOTE'|'SINGLE_QUOTE'|string;
  export interface Theme {
  /**
     * The Amazon Resource Name (ARN) of the theme.
     */
    readonly Arn?: Arn;
    /**
     * The name that the user gives to the theme.
     */
    readonly Name?: ThemeName;
    /**
     * The identifier that the user gives to the theme.
     */
    readonly ThemeId?: ShortRestrictiveResourceId;
    readonly Version?: ThemeVersion;
    /**
     * The date and time that the theme was created.
     */
    readonly CreatedTime?: Timestamp;
    /**
     * The date and time that the theme was last updated.
     */
    readonly LastUpdatedTime?: Timestamp;
    /**
     * The type of theme, based on how it was created. Valid values readonly include: QUICKSIGHT and CUSTOM.
     */
    readonly Type?: ThemeType;
  }
  export interface ThemeConfiguration {
  /**
     * Color properties that apply to chart data colors.
     */
    readonly DataColorPalette?: DataColorPalette;
    /**
     * Color properties that apply to the UI and to charts, excluding the colors that apply to data.
     */
    readonly UIColorPalette?: UIColorPalette;
    /**
     * Display options related to sheets.
     */
    readonly Sheet?: SheetStyle;
    readonly Typography?: Typography;
  }
  export interface ThemeError {
  /**
     * The type of error.
     */
    readonly Type?: ThemeErrorType;
    /**
     * The error message.
     */
    readonly Message?: NonEmptyString;
  }
  export type ThemeErrorList = ThemeError[];
  export type ThemeErrorType = 'INTERNAL_FAILURE'|string;
  export type ThemeName = string;
  export type ThemeType = 'QUICKSIGHT'|'CUSTOM'|'ALL'|string;
  export interface ThemeVersion {
  /**
     * The version number of the theme.
     */
    readonly VersionNumber?: VersionNumber;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    readonly Arn?: Arn;
    /**
     * The description of the theme.
     */
    readonly Description?: VersionDescription;
    /**
     * The Amazon QuickSight-defined ID of the theme that a custom theme inherits from. All themes initially inherit from a default Amazon QuickSight theme.
     */
    readonly BaseThemeId?: ShortRestrictiveResourceId;
    /**
     * The date and time that this theme version was created.
     */
    readonly CreatedTime?: Timestamp;
    /**
     * The theme configuration, which contains all the theme display properties.
     */
    readonly Configuration?: ThemeConfiguration;
    /**
     * Errors associated with the theme.
     */
    readonly Errors?: ThemeErrorList;
    /**
     * The status of the theme version.
     */
    readonly Status?: ResourceStatus;
  }
  export interface TileLayoutStyle {
  /**
     * The gutter settings that apply between tiles.
     */
    readonly Gutter?: GutterStyle;
    /**
     * The margin settings that apply around the outside edge of sheets.
     */
    readonly Margin?: MarginStyle;
  }
  export interface TileStyle {
  /**
     * The border around a tile.
     */
    readonly Border?: BorderStyle;
  }
  export type Timestamp = Date;
  export interface TransformOperation {
  /**
     * An operation that projects columns. Operations that come after a projection can only refer to projected columns.
     */
    readonly ProjectOperation?: ProjectOperation;
    /**
     * An operation that filters rows based on some condition.
     */
    readonly FilterOperation?: FilterOperation;
    /**
     * An operation that creates calculated columns. Columns created in one such operation form a lexical closure.
     */
    readonly CreateColumnsOperation?: CreateColumnsOperation;
    /**
     * An operation that renames a column.
     */
    readonly RenameColumnOperation?: RenameColumnOperation;
    /**
     * A transform operation that casts a column to a different type.
     */
    readonly CastColumnTypeOperation?: CastColumnTypeOperation;
    /**
     * An operation that tags a column with additional information.
     */
    readonly TagColumnOperation?: TagColumnOperation;
    readonly UntagColumnOperation?: UntagColumnOperation;
  }
  export type TransformOperationList = TransformOperation[];
  export interface TwitterParameters {
  /**
     * Twitter query string.
     */
    readonly Query: Query;
    /**
     * Maximum number of rows to query Twitter.
     */
    readonly MaxRows: PositiveInteger;
  }
  export type TypeCastFormat = string;
  export interface Typography {
  /**
     * Determines the list of font families.
     */
    readonly FontFamilies?: FontList;
  }
  export interface UIColorPalette {
  /**
     * The color of text and other foreground elements that appear over the primary background regions, such as grid lines, borders, table banding, icons, and so on.
     */
    readonly PrimaryForeground?: HexColor;
    /**
     * The background color that applies to visuals and other high emphasis UI.
     */
    readonly PrimaryBackground?: HexColor;
    /**
     * The foreground color that applies to any sheet title, sheet control text, or UI that appears over the secondary background.
     */
    readonly SecondaryForeground?: HexColor;
    /**
     * The background color that applies to the sheet background and sheet controls.
     */
    readonly SecondaryBackground?: HexColor;
    /**
     * This color is that applies to selected states and buttons.
     */
    readonly Accent?: HexColor;
    /**
     * The foreground color that applies to any text or other elements that appear over the accent color.
     */
    readonly AccentForeground?: HexColor;
    /**
     * The color that applies to error messages.
     */
    readonly Danger?: HexColor;
    /**
     * The foreground color that applies to any text or other elements that appear over the error color.
     */
    readonly DangerForeground?: HexColor;
    /**
     * This color that applies to warning and informational messages.
     */
    readonly Warning?: HexColor;
    /**
     * The foreground color that applies to any text or other elements that appear over the warning color.
     */
    readonly WarningForeground?: HexColor;
    /**
     * The color that applies to success messages, for example the check mark for a successful download.
     */
    readonly Success?: HexColor;
    /**
     * The foreground color that applies to any text or other elements that appear over the success color.
     */
    readonly SuccessForeground?: HexColor;
    /**
     * The color that applies to the names of fields that are identified as dimensions.
     */
    readonly Dimension?: HexColor;
    /**
     * The foreground color that applies to any text or other elements that appear over the dimension color.
     */
    readonly DimensionForeground?: HexColor;
    /**
     * The color that applies to the names of fields that are identified as measures.
     */
    readonly Measure?: HexColor;
    /**
     * The foreground color that applies to any text or other elements that appear over the measure color.
     */
    readonly MeasureForeground?: HexColor;
  }
  export interface UntagColumnOperation {
  /**
     * The column that this operation acts on.
     */
    readonly ColumnName: ColumnName;
    /**
     * The column tags to remove from this column.
     */
    readonly TagNames: ColumnTagNames;
  }
  export interface UploadSettings {
  /**
     * File format.
     */
    readonly Format?: FileFormat;
    /**
     * A row number to start reading data from.
     */
    readonly StartFromRow?: PositiveInteger;
    /**
     * Whether the file has a header row, or the files each have a header row.
     */
    readonly ContainsHeader?: Boolean;
    /**
     * Text qualifier.
     */
    readonly TextQualifier?: TextQualifier;
    /**
     * The delimiter between values in the file.
     */
    readonly Delimiter?: Delimiter;
  }
  export type VersionDescription = string;
  export type VersionNumber = number;
  export interface VpcConnectionProperties {
  /**
     * The Amazon Resource Name (ARN) for the VPC connection.
     */
    readonly VpcConnectionArn: Arn;
  }
  export type Warehouse = string;
  export type WorkGroup = string;
  /**
   * Contains interfaces for use with the QuickSight client.
   */
}