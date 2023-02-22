
export namespace QuickSightContextResponse {
  export type ActionList = String[];
  export interface AmazonElasticsearchParameters {
  /**
     * The OpenSearch domain.
     */
    readonly domain: Domain;
  }
  export interface AmazonOpenSearchParameters {
  /**
     * The OpenSearch domain.
     */
    readonly domain: Domain;
  }
  export interface Analysis {
  /**
     * The ID of the analysis.
     */
    readonly analysisId?: ShortRestrictiveResourceId;
    /**
     * The Amazon Resource Name (ARN) of the analysis.
     */
    readonly arn?: Arn;
    /**
     * The descriptive name of the analysis.
     */
    readonly name?: AnalysisName;
    /**
     * Status associated with the analysis.
     */
    readonly status?: ResourceStatus;
    /**
     * Errors associated with the analysis.
     */
    readonly errors?: AnalysisErrorList;
    /**
     * The ARNs of the datasets of the analysis.
     */
    readonly dataSetArns?: DataSetArnsList;
    /**
     * The ARN of the theme of the analysis.
     */
    readonly themeArn?: Arn;
    /**
     * The time that the analysis was created.
     */
    readonly createdTime?: Timestamp;
    /**
     * The time that the analysis was last updated.
     */
    readonly lastUpdatedTime?: Timestamp;
    /**
     * A list of the associated sheets with the unique identifier and name of each sheet.
     */
    readonly sheets?: SheetList;
  }
  export interface AnalysisError {
  /**
     * The type of the analysis error.
     */
    readonly type?: AnalysisErrorType;
    /**
     * The message associated with the analysis error.
     */
    readonly message?: NonEmptyString;
    /**
     *
     */
    readonly violatedEntities?: EntityList;
  }
  export type AnalysisErrorList = AnalysisError[];
  export type AnalysisErrorType = 'ACCESS_DENIED'|'SOURCE_NOT_FOUND'|'DATA_SET_NOT_FOUND'|'INTERNAL_FAILURE'|'PARAMETER_VALUE_INCOMPATIBLE'|'PARAMETER_TYPE_INVALID'|'PARAMETER_NOT_FOUND'|'COLUMN_TYPE_MISMATCH'|'COLUMN_GEOGRAPHIC_ROLE_MISMATCH'|'COLUMN_REPLACEMENT_MISSING'|string;
  export type AnalysisName = string;
  export type Arn = string;
  export interface AthenaParameters {
  /**
     * The workgroup that Amazon Athena uses.
     */
    readonly workGroup?: WorkGroup;
    /**
     * Use the RoleArn structure to override an account-wide role for a specific Athena data source. For example, say an account administrator has turned off all Athena access with an account-wide role. The administrator can then use RoleArn to bypass the account-wide role and allow Athena access for the single Athena data source that is specified in the structure, even if the account-wide role forbidding Athena access is still active.
     */
    readonly roleArn?: RoleArn;
  }
  export interface AuroraParameters {
  /**
     * Host.
     */
    readonly host: Host;
    /**
     * Port.
     */
    readonly port: Port;
    /**
     * Database.
     */
    readonly database: Database;
  }
  export interface AuroraPostgreSqlParameters {
  /**
     * The Amazon Aurora PostgreSQL-Compatible host to connect to.
     */
    readonly host: Host;
    /**
     * The port that Amazon Aurora PostgreSQL is listening on.
     */
    readonly port: Port;
    /**
     * The Amazon Aurora PostgreSQL database to connect to.
     */
    readonly database: Database;
  }
  export interface AwsIotAnalyticsParameters {
  /**
     * Dataset name.
     */
    readonly dataSetName: DataSetName;
  }
  export type Boolean = boolean;
  export interface BorderStyle {
  /**
     * The option to enable display of borders for visuals.
     */
    readonly show?: Boolean;
  }
  export interface CalculatedColumn {
  /**
     * Column name.
     */
    readonly columnName: ColumnName;
    /**
     * A unique ID to identify a calculated column. During a dataset update, if the column ID of a calculated column matches that of an existing calculated column, Amazon QuickSight preserves the existing calculated column.
     */
    readonly columnId: ColumnId;
    /**
     * An expression that defines the calculated column.
     */
    readonly expression: Expression;
  }
  export type CalculatedColumnList = CalculatedColumn[];
  export interface CastColumnTypeOperation {
  /**
     * Column name.
     */
    readonly columnName: ColumnName;
    /**
     * New column data type.
     */
    readonly newColumnType: ColumnDataType;
    /**
     * When casting a column from string to datetime type, you can supply a string in a format supported by Amazon QuickSight to denote the source data format.
     */
    readonly format?: TypeCastFormat;
  }
  export type Catalog = string;
  export type ClusterId = string;
  export type ColorList = HexColor[];
  export type ColumnDataType = 'STRING'|'INTEGER'|'DECIMAL'|'DATETIME'|string;
  export interface ColumnDescription {
  /**
     * The text of a description for a column.
     */
    readonly text?: ColumnDescriptiveText;
  }
  export type ColumnDescriptiveText = string;
  export interface ColumnGroup {
  /**
     * Geospatial column group that denotes a hierarchy.
     */
    readonly geoSpatialColumnGroup?: GeoSpatialColumnGroup;
  }
  export interface ColumnGroupColumnSchema {
  /**
     * The name of the column group's column schema.
     */
    readonly name?: String;
  }
  export type ColumnGroupColumnSchemaList = ColumnGroupColumnSchema[];
  export type ColumnGroupList = ColumnGroup[];
  export type ColumnGroupName = string;
  export interface ColumnGroupSchema {
  /**
     * The name of the column group schema.
     */
    readonly name?: String;
    /**
     * A structure containing the list of schemas for column group columns.
     */
    readonly columnGroupColumnSchemaList?: ColumnGroupColumnSchemaList;
  }
  export type ColumnGroupSchemaList = ColumnGroupSchema[];
  export type ColumnId = string;
  export interface ColumnLevelPermissionRule {
  /**
     * An array of Amazon Resource Names (ARNs) for Amazon QuickSight users or groups.
     */
    readonly principals?: PrincipalList;
    /**
     * An array of column names.
     */
    readonly columnNames?: ColumnNameList;
  }
  export type ColumnLevelPermissionRuleList = ColumnLevelPermissionRule[];
  export type ColumnList = ColumnName[];
  export type ColumnName = string;
  export type ColumnNameList = String[];
  export interface ColumnSchema {
  /**
     * The name of the column schema.
     */
    readonly name?: String;
    /**
     * The data type of the column schema.
     */
    readonly dataType?: String;
    /**
     * The geographic role of the column schema.
     */
    readonly geographicRole?: String;
  }
  export type ColumnSchemaList = ColumnSchema[];
  export interface ColumnTag {
  /**
     * A geospatial role for a column.
     */
    readonly columnGeographicRole?: GeoSpatialDataRole;
    /**
     * A description for a column.
     */
    readonly columnDescription?: ColumnDescription;
  }
  export type ColumnTagList = ColumnTag[];
  export type ColumnTagName = 'COLUMN_GEOGRAPHIC_ROLE'|'COLUMN_DESCRIPTION'|string;
  export type ColumnTagNames = ColumnTagName[];
  export interface CreateColumnsOperation {
  /**
     * Calculated columns to create.
     */
    readonly columns: CalculatedColumnList;
  }
  export interface CustomSql {
  /**
     * The Amazon Resource Name (ARN) of the data source.
     */
    readonly dataSourceArn: Arn;
    /**
     * A display name for the SQL query result.
     */
    readonly name: CustomSqlName;
    /**
     * The SQL query.
     */
    readonly sqlQuery: SqlQuery;
    /**
     * The column schema from the SQL query result set.
     */
    readonly columns: InputColumnList; // ORIGINALLY readonly columns?: InputColumnList;
  }
  export type CustomSqlName = string;
  export interface Dashboard {
  /**
     * Dashboard ID.
     */
    readonly dashboardId?: ShortRestrictiveResourceId;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    readonly arn?: Arn;
    /**
     * A display name for the dashboard.
     */
    readonly name?: DashboardName;
    /**
     * Version.
     */
    readonly version?: DashboardVersion;
    /**
     * The time that this dashboard was created.
     */
    readonly createdTime?: Timestamp;
    /**
     * The last time that this dashboard was published.
     */
    readonly lastPublishedTime?: Timestamp;
    /**
     * The last time that this dashboard was updated.
     */
    readonly lastUpdatedTime?: Timestamp;
  }
  export interface DashboardError {
  /**
     * Type.
     */
    readonly type?: DashboardErrorType;
    /**
     * Message.
     */
    readonly message?: NonEmptyString;
    /**
     *
     */
    readonly violatedEntities?: EntityList;
  }
  export type DashboardErrorList = DashboardError[];
  export type DashboardErrorType = 'ACCESS_DENIED'|'SOURCE_NOT_FOUND'|'DATA_SET_NOT_FOUND'|'INTERNAL_FAILURE'|'PARAMETER_VALUE_INCOMPATIBLE'|'PARAMETER_TYPE_INVALID'|'PARAMETER_NOT_FOUND'|'COLUMN_TYPE_MISMATCH'|'COLUMN_GEOGRAPHIC_ROLE_MISMATCH'|'COLUMN_REPLACEMENT_MISSING'|string;
  export type DashboardName = string;
  export interface DashboardVersion {
  /**
     * The time that this dashboard version was created.
     */
    readonly createdTime?: Timestamp;
    /**
     * Errors associated with this dashboard version.
     */
    readonly errors?: DashboardErrorList;
    /**
     * Version number for this version of the dashboard.
     */
    readonly versionNumber?: VersionNumber;
    /**
     * The HTTP status of the request.
     */
    readonly status?: ResourceStatus;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    readonly arn?: Arn;
    /**
     * Source entity ARN.
     */
    readonly sourceEntityArn?: Arn;
    /**
     * The Amazon Resource Numbers (ARNs) for the datasets that are associated with this version of the dashboard.
     */
    readonly dataSetArns?: DataSetArnsList;
    /**
     * Description.
     */
    readonly description?: VersionDescription;
    /**
     * The ARN of the theme associated with a version of the dashboard.
     */
    readonly themeArn?: Arn;
    /**
     * A list of the associated sheets with the unique identifier and name of each sheet.
     */
    readonly sheets?: SheetList;
  }
  export interface DataColorPalette {
  /**
     * The hexadecimal codes for the colors.
     */
    readonly colors?: ColorList;
    /**
     * The minimum and maximum hexadecimal codes that describe a color gradient.
     */
    readonly minMaxGradient?: ColorList;
    /**
     * The hexadecimal code of a color that applies to charts where a lack of data is highlighted.
     */
    readonly emptyFillColor?: HexColor;
  }
  export interface DataSet {
  /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    readonly arn?: Arn;
    /**
     * The ID of the dataset.
     */
    readonly dataSetId?: ResourceId;
    /**
     * A display name for the dataset.
     */
    readonly name?: ResourceName;
    /**
     * The time that this dataset was created.
     */
    readonly createdTime?: Timestamp;
    /**
     * The last time that this dataset was updated.
     */
    readonly lastUpdatedTime?: Timestamp;
    /**
     * Declares the physical tables that are available in the underlying data sources.
     */
    readonly physicalTableMap?: PhysicalTableMap;
    /**
     * Configures the combination and transformation of the data from the physical tables.
     */
    readonly logicalTableMap?: LogicalTableMap;
    /**
     * The list of columns after all transforms. These columns are available in templates, analyses, and dashboards.
     */
    readonly outputColumns?: OutputColumnList;
    /**
     * A value that indicates whether you want to import the data into SPICE.
     */
    readonly importMode?: DataSetImportMode;
    /**
     * The amount of SPICE capacity used by this dataset. This is 0 if the dataset isn't imported into SPICE.
     */
    readonly consumedSpiceCapacityInBytes?: Long;
    /**
     * Groupings of columns that work together in certain Amazon QuickSight features. Currently, only geospatial hierarchy is supported.
     */
    readonly columnGroups?: ColumnGroupList;
    /**
     * The folder that contains fields and nested subfolders for your dataset.
     */
    readonly fieldFolders?: FieldFolderMap;
    /**
     * The row-level security configuration for the dataset.
     */
    readonly rowLevelPermissionDataSet?: RowLevelPermissionDataSet;
    /**
     * The element you can use to define tags for row-level security.
     */
    readonly rowLevelPermissionTagConfiguration?: RowLevelPermissionTagConfiguration;
    /**
     * A set of one or more definitions of a  ColumnLevelPermissionRule .
     */
    readonly columnLevelPermissionRules?: ColumnLevelPermissionRuleList;
    /**
     * The usage configuration to apply to child datasets that reference this dataset as a source.
     */
    readonly dataSetUsageConfiguration?: DataSetUsageConfiguration;
  }
  export type DataSetArnsList = Arn[];
  export interface DataSetConfiguration {
  /**
     * Placeholder.
     */
    readonly placeholder?: String;
    /**
     * Dataset schema.
     */
    readonly dataSetSchema?: DataSetSchema;
    /**
     * A structure containing the list of column group schemas.
     */
    readonly columnGroupSchemaList?: ColumnGroupSchemaList;
  }
  export type DataSetConfigurationList = DataSetConfiguration[];
  export type DataSetImportMode = 'SPICE'|'DIRECT_QUERY'|string;
  export type DataSetName = string;
  export interface DataSetSchema {
  /**
     * A structure containing the list of column schemas.
     */
    readonly columnSchemaList?: ColumnSchemaList;
  }
  export interface DataSetUsageConfiguration {
  /**
     * An option that controls whether a child dataset of a direct query can use this dataset as a source.
     */
    readonly disableUseAsDirectQuerySource?: Boolean;
    /**
     * An option that controls whether a child dataset that's stored in QuickSight can use this dataset as a source.
     */
    readonly disableUseAsImportedSource?: Boolean;
  }
  export interface DataSource {
  /**
     * The Amazon Resource Name (ARN) of the data source.
     */
    readonly arn?: Arn;
    /**
     * The ID of the data source. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    readonly dataSourceId?: ResourceId;
    /**
     * A display name for the data source.
     */
    readonly name?: ResourceName;
    /**
     * The type of the data source. This type indicates which database engine the data source connects to.
     */
    readonly type?: DataSourceType;
    /**
     * The HTTP status of the request.
     */
    readonly status?: ResourceStatus;
    /**
     * The time that this data source was created.
     */
    readonly createdTime?: Timestamp;
    /**
     * The last time that this data source was updated.
     */
    readonly lastUpdatedTime?: Timestamp;
    /**
     * The parameters that Amazon QuickSight uses to connect to your underlying source. This is a variant type structure. For this structure to be valid, only one of the attributes can be non-null.
     */
    readonly dataSourceParameters?: DataSourceParameters;
    /**
     * A set of alternate data source parameters that you want to share for the credentials stored with this data source. The credentials are applied in tandem with the data source parameters when you copy a data source by using a create or update request. The API operation compares the DataSourceParameters structure that's in the request with the structures in the AlternateDataSourceParameters allow list. If the structures are an exact match, the request is allowed to use the credentials from this existing data source. If the AlternateDataSourceParameters list is null, the Credentials originally used with this DataSourceParameters are automatically allowed.
     */
    readonly alternateDataSourceParameters?: DataSourceParametersList;
    /**
     * The VPC connection information. You need to use this parameter only when you want Amazon QuickSight to use a VPC connection when connecting to your underlying source.
     */
    readonly vpcConnectionProperties?: VpcConnectionProperties;
    /**
     * Secure Socket Layer (SSL) properties that apply when Amazon QuickSight connects to your underlying source.
     */
    readonly sslProperties?: SslProperties;
    /**
     * Error information from the last update or the creation of the data source.
     */
    readonly errorInfo?: DataSourceErrorInfo;
    /**
     * The Amazon Resource Name (ARN) of the secret associated with the data source in Amazon Secrets Manager.
     */
    readonly secretArn?: SecretArn;
  }
  export interface DataSourceErrorInfo {
  /**
     * Error type.
     */
    readonly type?: DataSourceErrorInfoType;
    /**
     * Error message.
     */
    readonly message?: String;
  }
  export type DataSourceErrorInfoType = 'ACCESS_DENIED'|'COPY_SOURCE_NOT_FOUND'|'TIMEOUT'|'ENGINE_VERSION_NOT_SUPPORTED'|'UNKNOWN_HOST'|'GENERIC_SQL_FAILURE'|'CONFLICT'|'UNKNOWN'|string;
  export interface DataSourceParameters {
  /**
     * The parameters for OpenSearch.
     */
    readonly amazonElasticsearchParameters?: AmazonElasticsearchParameters;
    /**
     * The parameters for Amazon Athena.
     */
    readonly athenaParameters?: AthenaParameters;
    /**
     * The parameters for Amazon Aurora MySQL.
     */
    readonly auroraParameters?: AuroraParameters;
    /**
     * The parameters for Amazon Aurora.
     */
    readonly auroraPostgreSqlParameters?: AuroraPostgreSqlParameters;
    /**
     * The parameters for IoT Analytics.
     */
    readonly awsIotAnalyticsParameters?: AwsIotAnalyticsParameters;
    /**
     * The parameters for Jira.
     */
    readonly jiraParameters?: JiraParameters;
    /**
     * The parameters for MariaDB.
     */
    readonly mariaDbParameters?: MariaDbParameters;
    /**
     * The parameters for MySQL.
     */
    readonly mySqlParameters?: MySqlParameters;
    /**
     * The parameters for Oracle.
     */
    readonly oracleParameters?: OracleParameters;
    /**
     * The parameters for PostgreSQL.
     */
    readonly postgreSqlParameters?: PostgreSqlParameters;
    /**
     * The parameters for Presto.
     */
    readonly prestoParameters?: PrestoParameters;
    /**
     * The parameters for Amazon RDS.
     */
    readonly rdsParameters?: RdsParameters;
    /**
     * The parameters for Amazon Redshift.
     */
    readonly redshiftParameters?: RedshiftParameters;
    /**
     * The parameters for S3.
     */
    readonly s3Parameters?: S3Parameters;
    /**
     * The parameters for ServiceNow.
     */
    readonly serviceNowParameters?: ServiceNowParameters;
    /**
     * The parameters for Snowflake.
     */
    readonly snowflakeParameters?: SnowflakeParameters;
    /**
     * The parameters for Spark.
     */
    readonly sparkParameters?: SparkParameters;
    /**
     * The parameters for SQL Server.
     */
    readonly sqlServerParameters?: SqlServerParameters;
    /**
     * The parameters for Teradata.
     */
    readonly teradataParameters?: TeradataParameters;
    /**
     * The parameters for Twitter.
     */
    readonly twitterParameters?: TwitterParameters;
    /**
     * The parameters for OpenSearch.
     */
    readonly amazonOpenSearchParameters?: AmazonOpenSearchParameters;
    /**
     * The parameters for Exasol.
     */
    readonly exasolParameters?: ExasolParameters;
    /**
     * The required parameters that are needed to connect to a Databricks data source.
     */
    readonly databricksParameters?: DatabricksParameters;
  }
  export type DataSourceParametersList = DataSourceParameters[];
  export type DataSourceType = 'ADOBE_ANALYTICS'|'AMAZON_ELASTICSEARCH'|'ATHENA'|'AURORA'|'AURORA_POSTGRESQL'|'AWS_IOT_ANALYTICS'|'GITHUB'|'JIRA'|'MARIADB'|'MYSQL'|'ORACLE'|'POSTGRESQL'|'PRESTO'|'REDSHIFT'|'S3'|'SALESFORCE'|'SERVICENOW'|'SNOWFLAKE'|'SPARK'|'SQLSERVER'|'TERADATA'|'TWITTER'|'TIMESTREAM'|'AMAZON_OPENSEARCH'|'EXASOL'|'DATABRICKS'|string;
  export type Database = string;
  export interface DatabricksParameters {
  /**
     * The host name of the Databricks data source.
     */
    readonly host: Host;
    /**
     * The port for the Databricks data source.
     */
    readonly port: Port;
    /**
     * The HTTP path of the Databricks data source.
     */
    readonly sqlEndpointPath: SqlEndpointPath;
  }
  export type Delimiter = string;
  export type Domain = string;
  export interface Entity {
  /**
     * The hierarchical path of the entity within the analysis, template, or dashboard definition tree.
     */
    readonly path?: NonEmptyString;
  }
  export type EntityList = Entity[];
  export interface ExasolParameters {
  /**
     * The hostname or IP address of the Exasol data source.
     */
    readonly host: Host;
    /**
     * The port for the Exasol data source.
     */
    readonly port: Port;
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
    readonly conditionExpression: Expression;
  }
  export type FolderColumnList = String[];
  export interface Font {
  /**
     * Determines the font family settings.
     */
    readonly fontFamily?: String;
  }
  export type FontList = Font[];
  export interface GeoSpatialColumnGroup {
  /**
     * A display name for the hierarchy.
     */
    readonly name: ColumnGroupName;
    /**
     * Country code.
     */
    readonly countryCode?: GeoSpatialCountryCode;
    /**
     * Columns in this hierarchy.
     */
    readonly columns: ColumnList;
  }
  export type GeoSpatialCountryCode = 'US'|string;
  export type GeoSpatialDataRole = 'COUNTRY'|'STATE'|'COUNTY'|'CITY'|'POSTCODE'|'LONGITUDE'|'LATITUDE'|string;
  export interface GutterStyle {
  /**
     * This Boolean value controls whether to display a gutter space between sheet tiles.
     */
    readonly show?: Boolean;
  }
  export type HexColor = string;
  export type Host = string;
  export interface InputColumn {
  /**
     * The name of this column in the underlying data source.
     */
    readonly name: ColumnName;
    /**
     * The data type of the column.
     */
    readonly type: InputColumnDataType;
  }
  export type InputColumnDataType = 'STRING'|'INTEGER'|'DECIMAL'|'DATETIME'|'BIT'|'BOOLEAN'|'JSON'|string;
  export type InputColumnList = InputColumn[];
  export type InstanceId = string;
  export interface JiraParameters {
  /**
     * The base URL of the Jira site.
     */
    readonly siteBaseUrl: SiteBaseUrl;
  }
  export interface JoinInstruction {
  /**
     * The operand on the left side of a join.
     */
    readonly leftOperand: LogicalTableId;
    /**
     * The operand on the right side of a join.
     */
    readonly rightOperand: LogicalTableId;
    /**
     * Join key properties of the left operand.
     */
    readonly leftJoinKeyProperties?: JoinKeyProperties;
    /**
     * Join key properties of the right operand.
     */
    readonly rightJoinKeyProperties?: JoinKeyProperties;
    /**
     * The type of join that it is.
     */
    readonly type: JoinType;
    /**
     * The join instructions provided in the ON clause of a join.
     */
    readonly onClause: OnClause;
  }
  export interface JoinKeyProperties {
  /**
     * A value that indicates that a row in a table is uniquely identified by the columns in a join key. This is used by Amazon QuickSight to optimize query performance.
     */
    readonly uniqueKey?: Boolean;
  }
  export type JoinType = 'INNER'|'OUTER'|'LEFT'|'RIGHT'|string;
  export interface LogicalTable {
  /**
     * A display name for the logical table.
     */
    readonly alias: LogicalTableAlias;
    /**
     * Transform operations that act on this logical table. For this structure to be valid, only one of the attributes can be non-null.
     */
    readonly dataTransforms?: TransformOperationList;
    /**
     * Source of this logical table.
     */
    readonly source: LogicalTableSource;
  }
  export type LogicalTableAlias = string;
  export type LogicalTableId = string;
  export type LogicalTableMap = {[key: string]: LogicalTable};
  export interface LogicalTableSource {
  /**
     * Specifies the result of a join of two logical tables.
     */
    readonly joinInstruction?: JoinInstruction;
    /**
     * Physical table ID.
     */
    readonly physicalTableId?: PhysicalTableId;
    /**
     * The Amazon Resource Number (ARN) of the parent dataset.
     */
    readonly dataSetArn?: Arn;
  }
  export type Long = number;
  export interface ManifestFileLocation {
  /**
     * Amazon S3 bucket.
     */
    readonly bucket: S3Bucket;
    /**
     * Amazon S3 key that identifies an object.
     */
    readonly key: S3Key;
  }
  export interface MarginStyle {
  /**
     * This Boolean value controls whether to display sheet margins.
     */
    readonly show?: Boolean;
  }
  export interface MariaDbParameters {
  /**
     * Host.
     */
    readonly host: Host;
    /**
     * Port.
     */
    readonly port: Port;
    /**
     * Database.
     */
    readonly database: Database;
  }
  export interface MySqlParameters {
  /**
     * Host.
     */
    readonly host: Host;
    /**
     * Port.
     */
    readonly port: Port;
    /**
     * Database.
     */
    readonly database: Database;
  }
  export type Namespace = string;
  export type NonEmptyString = string;
  export type OnClause = string;
  export type OptionalPort = number;
  export interface OracleParameters {
  /**
     * An Oracle host.
     */
    readonly host: Host;
    /**
     * Port.
     */
    readonly port: Port;
    /**
     * Database.
     */
    readonly database: Database;
  }
  export interface OutputColumn {
  /**
     * A display name for the dataset.
     */
    readonly name?: ColumnName;
    /**
     * A description for a column.
     */
    readonly description?: ColumnDescriptiveText;
    /**
     * Type.
     */
    readonly type?: ColumnDataType;
  }
  export type OutputColumnList = OutputColumn[];
  export interface PhysicalTable {
  /**
     * A physical table type for relational data sources.
     */
    readonly relationalTable?: RelationalTable;
    /**
     * A physical table type built from the results of the custom SQL query.
     */
    readonly customSql?: CustomSql;
    /**
     * A physical table type for as S3 data source.
     */
    readonly s3Source?: S3Source;
  }
  export type PhysicalTableId = string;
  export type PhysicalTableMap = {[key: string]: PhysicalTable};
  export type Port = number;
  export type PositiveInteger = number;
  export interface PostgreSqlParameters {
  /**
     * Host.
     */
    readonly host: Host;
    /**
     * Port.
     */
    readonly port: Port;
    /**
     * Database.
     */
    readonly database: Database;
  }
  export interface PrestoParameters {
  /**
     * Host.
     */
    readonly host: Host;
    /**
     * Port.
     */
    readonly port: Port;
    /**
     * Catalog.
     */
    readonly catalog: Catalog;
  }
  export type Principal = string;
  export type PrincipalList = String[];
  export interface ProjectOperation {
  /**
     * Projected columns.
     */
    readonly projectedColumns: ProjectedColumnList;
  }
  export type ProjectedColumnList = String[];
  export type Query = string;
  export interface RdsParameters {
  /**
     * Instance ID.
     */
    readonly instanceId: InstanceId;
    /**
     * Database.
     */
    readonly database: Database;
  }
  export interface RedshiftParameters {
  /**
     * Host. This field can be blank if ClusterId is provided.
     */
    readonly host?: Host;
    /**
     * Port. This field can be blank if the ClusterId is provided.
     */
    readonly port?: OptionalPort;
    /**
     * Database.
     */
    readonly database: Database;
    /**
     * Cluster ID. This field can be blank if the Host and Port are provided.
     */
    readonly clusterId?: ClusterId;
  }
  export interface RelationalTable {
  /**
     * The Amazon Resource Name (ARN) for the data source.
     */
    readonly dataSourceArn: Arn;
    /**
     * The catalog associated with a table.
     */
    readonly catalog?: RelationalTableCatalog;
    /**
     * The schema name. This name applies to certain relational database engines.
     */
    readonly schema?: RelationalTableSchema;
    /**
     * The name of the relational table.
     */
    readonly name: RelationalTableName;
    /**
     * The column schema of the table.
     */
    readonly inputColumns: InputColumnList;
  }
  export type RelationalTableCatalog = string;
  export type RelationalTableName = string;
  export type RelationalTableSchema = string;
  export interface RenameColumnOperation {
  /**
     * The name of the column to be renamed.
     */
    readonly columnName: ColumnName;
    /**
     * The new name for the column.
     */
    readonly newColumnName: ColumnName;
  }
  export type ResourceId = string;
  export type ResourceName = string;
  export interface ResourcePermission {
  /**
     * The Amazon Resource Name (ARN) of the principal. This can be one of the readonly following:   The ARN of an Amazon QuickSight user or group associated with a data source or dataset. (This is common.)   The ARN of an Amazon QuickSight user, group, or namespace associated with an analysis, dashboard, template, or theme. (This is common.)   The ARN of an Amazon Web Services account readonly root: This is an IAM ARN rather than a QuickSight ARN. Use this option only to share resources (templates) across Amazon Web Services accounts. (This is less common.)
     */
    readonly principal: Principal;
    /**
     * The IAM action to grant or revoke permissions on.
     */
    readonly actions: ActionList;
  }
  export type ResourcePermissionList = ResourcePermission[];
  export type ResourceStatus = 'CREATION_IN_PROGRESS'|'CREATION_SUCCESSFUL'|'CREATION_FAILED'|'UPDATE_IN_PROGRESS'|'UPDATE_SUCCESSFUL'|'UPDATE_FAILED'|'DELETED'|string;
  export type RoleArn = string;
  export interface RowLevelPermissionDataSet {
  /**
     * The namespace associated with the dataset that contains permissions for RLS.
     */
    readonly namespace?: Namespace;
    /**
     * The Amazon Resource Name (ARN) of the dataset that contains permissions for RLS.
     */
    readonly arn: Arn;
    /**
     * The type of permissions to use when interpreting the permissions for RLS. DENY_ACCESS is included for backward compatibility only.
     */
    readonly permissionPolicy: RowLevelPermissionPolicy;
    /**
     * The user or group rules associated with the dataset that contains permissions for RLS. By default, FormatVersion is VERSION_1. When FormatVersion is VERSION_1, UserName and GroupName are required. When FormatVersion is VERSION_2, UserARN and GroupARN are required, and Namespace must not exist.
     */
    readonly formatVersion?: RowLevelPermissionFormatVersion;
    /**
     * The status of the row-level security permission dataset. If enabled, the status is ENABLED. If disabled, the status is DISABLED.
     */
    readonly status?: Status;
  }
  export type RowLevelPermissionFormatVersion = 'VERSION_1'|'VERSION_2'|string;
  export type RowLevelPermissionPolicy = 'GRANT_ACCESS'|'DENY_ACCESS'|string;
  export interface RowLevelPermissionTagConfiguration {
  /**
     * The status of row-level security tags. If enabled, the status is ENABLED. If disabled, the status is DISABLED.
     */
    readonly status?: Status;
    /**
     * A set of rules associated with row-level security, such as the tag names and columns that they are assigned to.
     */
    readonly tagRules: RowLevelPermissionTagRuleList;
  }
  export type RowLevelPermissionTagDelimiter = string;
  export interface RowLevelPermissionTagRule {
  /**
     * The unique key for a tag.
     */
    readonly tagKey: SessionTagKey;
    /**
     * The column name that a tag key is assigned to.
     */
    readonly columnName: String;
    /**
     * A string that you want to use to delimit the values when you pass the values at run time. For example, you can delimit the values with a comma.
     */
    readonly tagMultiValueDelimiter?: RowLevelPermissionTagDelimiter;
    /**
     * A string that you want to use to filter by all the values in a column in the dataset and don’t want to list the values one by one. For example, you can use an asterisk as your match all value.
     */
    readonly matchAllValue?: SessionTagValue;
  }
  export type RowLevelPermissionTagRuleList = RowLevelPermissionTagRule[];
  export type S3Bucket = string;
  export type S3Key = string;
  export interface S3Parameters {
  /**
     * Location of the Amazon S3 manifest file. This is NULL if the manifest file was uploaded into Amazon QuickSight.
     */
    readonly manifestFileLocation: ManifestFileLocation;
  }
  export interface S3Source {
  /**
     * The Amazon Resource Name (ARN) for the data source.
     */
    readonly dataSourceArn: Arn;
    /**
     * Information about the format for the S3 source file or files.
     */
    readonly uploadSettings?: UploadSettings;
    /**
     * A physical table type for an S3 data source.  For files that aren't JSON, only STRING data types are supported in input columns.
     */
    readonly inputColumns: InputColumnList;
  }
  export type SecretArn = string;
  export interface ServiceNowParameters {
  /**
     * URL of the base site.
     */
    readonly siteBaseUrl: SiteBaseUrl;
  }
  export type SessionTagKey = string;
  export type SessionTagValue = string;
  export interface Sheet {
  /**
     * The unique identifier associated with a sheet.
     */
    readonly sheetId?: ShortRestrictiveResourceId;
    /**
     * The name of a sheet. This name is displayed on the sheet's tab in the Amazon QuickSight console.
     */
    readonly name?: SheetName;
  }
  export type SheetList = Sheet[];
  export type SheetName = string;
  export interface SheetStyle {
  /**
     * The display options for tiles.
     */
    readonly tile?: TileStyle;
    /**
     * The layout options for tiles.
     */
    readonly tileLayout?: TileLayoutStyle;
  }
  export type ShortRestrictiveResourceId = string;
  export type SiteBaseUrl = string;
  export interface SnowflakeParameters {
  /**
     * Host.
     */
    readonly host: Host;
    /**
     * Database.
     */
    readonly database: Database;
    /**
     * Warehouse.
     */
    readonly warehouse: Warehouse;
  }
  export interface SparkParameters {
  /**
     * Host.
     */
    readonly host: Host;
    /**
     * Port.
     */
    readonly port: Port;
  }
  export type SqlEndpointPath = string;
  export type SqlQuery = string;
  export interface SqlServerParameters {
  /**
     * Host.
     */
    readonly host: Host;
    /**
     * Port.
     */
    readonly port: Port;
    /**
     * Database.
     */
    readonly database: Database;
  }
  export interface SslProperties {
  /**
     * A Boolean option to control whether SSL should be disabled.
     */
    readonly disableSsl?: Boolean;
  }
  export type Status = 'ENABLED'|'DISABLED'|string;
  export type String = string;
  export interface Tag {
  /**
     * Tag key.
     */
    readonly key: TagKey;
    /**
     * Tag value.
     */
    readonly value: TagValue;
  }
  export interface TagColumnOperation {
  /**
     * The column that this operation acts on.
     */
    readonly columnName: ColumnName;
    /**
     * The dataset column tag, currently only used for geospatial type tagging.  This is not tags for the Amazon Web Services tagging feature.
     */
    readonly tags: ColumnTagList;
  }
  export type TagKey = string;
  export type TagList = Tag[];
  export type TagValue = string;
  export interface Template {
  /**
     * The Amazon Resource Name (ARN) of the template.
     */
    readonly arn?: Arn;
    /**
     * The display name of the template.
     */
    readonly name?: TemplateName;
    /**
     * A structure describing the versions of the template.
     */
    readonly version?: TemplateVersion;
    /**
     * The ID for the template. This is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    readonly templateId?: ShortRestrictiveResourceId;
    /**
     * Time when this was last updated.
     */
    readonly lastUpdatedTime?: Timestamp;
    /**
     * Time when this was created.
     */
    readonly createdTime?: Timestamp;
  }
  export interface TemplateError {
  /**
     * Type of error.
     */
    readonly type?: TemplateErrorType;
    /**
     * Description of the error type.
     */
    readonly message?: NonEmptyString;
    /**
     * An error path that shows which entities caused the template error.
     */
    readonly violatedEntities?: EntityList;
  }
  export type TemplateErrorList = TemplateError[];
  export type TemplateErrorType = 'SOURCE_NOT_FOUND'|'DATA_SET_NOT_FOUND'|'INTERNAL_FAILURE'|'ACCESS_DENIED'|string;
  export type TemplateName = string;
  export interface TemplateVersion {
  /**
     * The time that this template version was created.
     */
    readonly createdTime?: Timestamp;
    /**
     * Errors associated with this template version.
     */
    readonly errors?: TemplateErrorList;
    /**
     * The version number of the template version.
     */
    readonly versionNumber?: VersionNumber;
    /**
     * The status that is associated with the template.    CREATION_IN_PROGRESS     CREATION_SUCCESSFUL     CREATION_FAILED     UPDATE_IN_PROGRESS     UPDATE_SUCCESSFUL     UPDATE_FAILED     DELETED
     */
    readonly status?: ResourceStatus;
    /**
     * Schema of the dataset identified by the placeholder. Any dashboard created from this template should be bound to new datasets matching the same schema described through this API operation.
     */
    readonly dataSetConfigurations?: DataSetConfigurationList;
    /**
     * The description of the template.
     */
    readonly description?: VersionDescription;
    /**
     * The Amazon Resource Name (ARN) of an analysis or template that was used to create this template.
     */
    readonly sourceEntityArn?: Arn;
    /**
     * The ARN of the theme associated with this version of the template.
     */
    readonly themeArn?: Arn;
    /**
     * A list of the associated sheets with the unique identifier and name of each sheet.
     */
    readonly sheets?: SheetList;
  }
  export interface TeradataParameters {
  /**
     * Host.
     */
    readonly host: Host;
    /**
     * Port.
     */
    readonly port: Port;
    /**
     * Database.
     */
    readonly database: Database;
  }
  export type TextQualifier = 'DOUBLE_QUOTE'|'SINGLE_QUOTE'|string;
  export interface Theme {
  /**
     * The Amazon Resource Name (ARN) of the theme.
     */
    readonly arn?: Arn;
    /**
     * The name that the user gives to the theme.
     */
    readonly name?: ThemeName;
    /**
     * The identifier that the user gives to the theme.
     */
    readonly themeId?: ShortRestrictiveResourceId;
    readonly version?: ThemeVersion;
    /**
     * The date and time that the theme was created.
     */
    readonly createdTime?: Timestamp;
    /**
     * The date and time that the theme was last updated.
     */
    readonly lastUpdatedTime?: Timestamp;
    /**
     * The type of theme, based on how it was created. Valid values readonly include: QUICKSIGHT and CUSTOM.
     */
    readonly type?: ThemeType;
  }
  export interface ThemeConfiguration {
  /**
     * Color properties that apply to chart data colors.
     */
    readonly dataColorPalette?: DataColorPalette;
    /**
     * Color properties that apply to the UI and to charts, excluding the colors that apply to data.
     */
    readonly uIColorPalette?: UIColorPalette;
    /**
     * Display options related to sheets.
     */
    readonly sheet?: SheetStyle;
    readonly typography?: Typography;
  }
  export interface ThemeError {
  /**
     * The type of error.
     */
    readonly type?: ThemeErrorType;
    /**
     * The error message.
     */
    readonly message?: NonEmptyString;
  }
  export type ThemeErrorList = ThemeError[];
  export type ThemeErrorType = 'INTERNAL_FAILURE'|string;
  export type ThemeName = string;
  export type ThemeType = 'QUICKSIGHT'|'CUSTOM'|'ALL'|string;
  export interface ThemeVersion {
  /**
     * The version number of the theme.
     */
    readonly versionNumber?: VersionNumber;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    readonly arn?: Arn;
    /**
     * The description of the theme.
     */
    readonly description?: VersionDescription;
    /**
     * The Amazon QuickSight-defined ID of the theme that a custom theme inherits from. All themes initially inherit from a default Amazon QuickSight theme.
     */
    readonly baseThemeId?: ShortRestrictiveResourceId;
    /**
     * The date and time that this theme version was created.
     */
    readonly createdTime?: Timestamp;
    /**
     * The theme configuration, which contains all the theme display properties.
     */
    readonly configuration?: ThemeConfiguration;
    /**
     * Errors associated with the theme.
     */
    readonly errors?: ThemeErrorList;
    /**
     * The status of the theme version.
     */
    readonly status?: ResourceStatus;
  }
  export interface TileLayoutStyle {
  /**
     * The gutter settings that apply between tiles.
     */
    readonly gutter?: GutterStyle;
    /**
     * The margin settings that apply around the outside edge of sheets.
     */
    readonly margin?: MarginStyle;
  }
  export interface TileStyle {
  /**
     * The border around a tile.
     */
    readonly border?: BorderStyle;
  }
  export type Timestamp = Date;
  export interface TransformOperation {
  /**
     * An operation that projects columns. Operations that come after a projection can only refer to projected columns.
     */
    readonly projectOperation?: ProjectOperation;
    /**
     * An operation that filters rows based on some condition.
     */
    readonly filterOperation?: FilterOperation;
    /**
     * An operation that creates calculated columns. Columns created in one such operation form a lexical closure.
     */
    readonly createColumnsOperation?: CreateColumnsOperation;
    /**
     * An operation that renames a column.
     */
    readonly renameColumnOperation?: RenameColumnOperation;
    /**
     * A transform operation that casts a column to a different type.
     */
    readonly castColumnTypeOperation?: CastColumnTypeOperation;
    /**
     * An operation that tags a column with additional information.
     */
    readonly tagColumnOperation?: TagColumnOperation;
    readonly untagColumnOperation?: UntagColumnOperation;
  }
  export type TransformOperationList = TransformOperation[];
  export interface TwitterParameters {
  /**
     * Twitter query string.
     */
    readonly query: Query;
    /**
     * Maximum number of rows to query Twitter.
     */
    readonly maxRows: PositiveInteger;
  }
  export type TypeCastFormat = string;
  export interface Typography {
  /**
     * Determines the list of font families.
     */
    readonly fontFamilies?: FontList;
  }
  export interface UIColorPalette {
  /**
     * The color of text and other foreground elements that appear over the primary background regions, such as grid lines, borders, table banding, icons, and so on.
     */
    readonly primaryForeground?: HexColor;
    /**
     * The background color that applies to visuals and other high emphasis UI.
     */
    readonly primaryBackground?: HexColor;
    /**
     * The foreground color that applies to any sheet title, sheet control text, or UI that appears over the secondary background.
     */
    readonly secondaryForeground?: HexColor;
    /**
     * The background color that applies to the sheet background and sheet controls.
     */
    readonly secondaryBackground?: HexColor;
    /**
     * This color is that applies to selected states and buttons.
     */
    readonly accent?: HexColor;
    /**
     * The foreground color that applies to any text or other elements that appear over the accent color.
     */
    readonly accentForeground?: HexColor;
    /**
     * The color that applies to error messages.
     */
    readonly danger?: HexColor;
    /**
     * The foreground color that applies to any text or other elements that appear over the error color.
     */
    readonly dangerForeground?: HexColor;
    /**
     * This color that applies to warning and informational messages.
     */
    readonly warning?: HexColor;
    /**
     * The foreground color that applies to any text or other elements that appear over the warning color.
     */
    readonly warningForeground?: HexColor;
    /**
     * The color that applies to success messages, for example the check mark for a successful download.
     */
    readonly success?: HexColor;
    /**
     * The foreground color that applies to any text or other elements that appear over the success color.
     */
    readonly successForeground?: HexColor;
    /**
     * The color that applies to the names of fields that are identified as dimensions.
     */
    readonly dimension?: HexColor;
    /**
     * The foreground color that applies to any text or other elements that appear over the dimension color.
     */
    readonly dimensionForeground?: HexColor;
    /**
     * The color that applies to the names of fields that are identified as measures.
     */
    readonly measure?: HexColor;
    /**
     * The foreground color that applies to any text or other elements that appear over the measure color.
     */
    readonly measureForeground?: HexColor;
  }
  export interface UntagColumnOperation {
  /**
     * The column that this operation acts on.
     */
    readonly columnName: ColumnName;
    /**
     * The column tags to remove from this column.
     */
    readonly tagNames: ColumnTagNames;
  }
  export interface UploadSettings {
  /**
     * File format.
     */
    readonly format?: FileFormat;
    /**
     * A row number to start reading data from.
     */
    readonly startFromRow?: PositiveInteger;
    /**
     * Whether the file has a header row, or the files each have a header row.
     */
    readonly containsHeader?: Boolean;
    /**
     * Text qualifier.
     */
    readonly textQualifier?: TextQualifier;
    /**
     * The delimiter between values in the file.
     */
    readonly delimiter?: Delimiter;
  }
  export type VersionDescription = string;
  export type VersionNumber = number;
  export interface VpcConnectionProperties {
  /**
     * The Amazon Resource Name (ARN) for the VPC connection.
     */
    readonly vpcConnectionArn: Arn;
  }
  export type Warehouse = string;
  export type WorkGroup = string;
  /**
   * Contains interfaces for use with the QuickSight client.
   */
}