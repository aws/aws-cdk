// CONSTANTS

// DataSource
export const DATA_SOURCE_ID_AMAZON_ELASTICSEARCH = 'DATA_SOURCE_ID_AMAZONELASTICSEARCH';
export const DATA_SOURCE_ID_AMAZON_OPENSEARCH = 'DATA_SOURCE_ID_AMAZONOPENSEARCH';
export const DATA_SOURCE_ID_ATHENA = 'DATA_SOURCE_ID_ATHENA';
export const DATA_SOURCE_ID_AURORA = 'DATA_SOURCE_ID_AURORA';
export const DATA_SOURCE_ID_AURORA_POSTGRESQL = 'DATA_SOURCE_ID_AURORAPOSTGRESQL';
export const DATA_SOURCE_ID_MARIADB = 'DATA_SOURCE_ID_MARIADB';
export const DATA_SOURCE_ID_MYSQL = 'DATA_SOURCE_ID_MYSQL';
export const DATA_SOURCE_ID_ORACLE = 'DATA_SOURCE_ID_ORACLE';
export const DATA_SOURCE_ID_POSTGRESQL = 'DATA_SOURCE_ID_POSTGRESQL';
export const DATA_SOURCE_ID_PRESTO = 'DATA_SOURCE_ID_PRESTO';
export const DATA_SOURCE_ID_RDS = 'DATA_SOURCE_ID_RDS';
export const DATA_SOURCE_ID_REDSHIFT = 'DATA_SOURCE_ID_REDSHIFT';
export const DATA_SOURCE_ID_S3 = 'DATA_SOURCE_ID_S3';
export const DATA_SOURCE_ID_SNOWFLAKE = 'DATA_SOURCE_ID_SNOWFLAKE';
export const DATA_SOURCE_ID_SPARK = 'DATA_SOURCE_ID_SPARK';
export const DATA_SOURCE_ID_SQLSERVER = 'DATA_SOURCE_ID_SQLSERVER';
export const DATA_SOURCE_ID_TERADATA = 'DATA_SOURCE_ID_TERADATA';

// DataSet
export const DATA_SET_ID = 'DATA_SET_ID';

// Physical Table Map attributes
export const RELATIONAL_TABLE = 'RELATIONAL_TABLE';
export const CUSTOM_SQL = 'CUSTOM_SQL';
export const S3_SOURCE = 'S3_SOURCE';
//export const PHYSICAL_TABLE_MAP_ATTRS = [
//  RELATIONAL_TABLE,
//  CUSTOM_SQL,
//  S3_SOURCE,
//];

// Logical Table map attributes
export const PROJECT_OPERATION = 'PROJECT_OPERATION';
export const FILTER_OPERATION = 'FILTER_OPERATION';
export const CREATE_COLUMNS_OPERATION = 'CREATE_COLUMNS_OPERATION';
export const RENAME_COLUMN_OPERATION = 'RENAME_COLUMN_OPERATION';
export const CAST_COLUMN_TYPE_OPERATION = 'CAST_COLUMN_TYPE_OPERATION';
export const TAG_COLUMN_OPERATION = 'TAG_COLUMN_OPERATION';
export const UNTAG_COLUMN_OPERATION = 'UNTAG_COLUMN_OPERATION';
export const LOGICAL_TABLE_MAP_ATTRS = [
  PROJECT_OPERATION,
  FILTER_OPERATION,
  CREATE_COLUMNS_OPERATION,
  RENAME_COLUMN_OPERATION,
  CAST_COLUMN_TYPE_OPERATION,
  TAG_COLUMN_OPERATION,
  UNTAG_COLUMN_OPERATION,
];

// Template
// Source Entity attributes
export const SOURCE_TEMPLATE = 'SOURCE_TEMPLATE';
export const SOURCE_ANALYSIS = 'SOURCE_ANALYSIS';

// Theme
export const CUSTOM_THEME = 'CUSTOM_THEME';
export const MANAGED_THEME = 'MANAGED_THEME';

// Analysis
export const ANALYSIS_ID = 'ANALYSIS_ID';

// Dashboard
export const DASHBOARD_ID = 'DASHBOARD_ID';
export const NO_VERSION_DESCRIPTION = 'NO_VERSION_DESCRIPTION';

// FUNCTIONS

// DataSource
function buildDataSourceParameter(dataSourceId: string): QuickSight.DataSourceParameters {

  let dataSourceParameters: QuickSight.DataSourceParameters;

  switch (dataSourceId) {

    case DATA_SOURCE_ID_AMAZON_ELASTICSEARCH:
      dataSourceParameters = {
        AmazonElasticsearchParameters: {
          Domain: 'AmazonElasticsearchParametersDomain',
        },
      };
      break;

    case DATA_SOURCE_ID_AMAZON_OPENSEARCH:
      dataSourceParameters = {
        AmazonOpenSearchParameters: {
          Domain: 'AmazonOpenSearchParametersDomain',
        },
      };
      break;

    case DATA_SOURCE_ID_ATHENA:
      dataSourceParameters = {
        AthenaParameters: {
          WorkGroup: 'primary',
        },
      };
      break;

    case DATA_SOURCE_ID_AURORA:
      dataSourceParameters = {
        AuroraParameters: {
          Database: 'AuroraParametersDatabase',
          Host: 'AuroraParametersHost',
          Port: 12345,
        },
      };
      break;

    case DATA_SOURCE_ID_AURORA_POSTGRESQL:
      dataSourceParameters = {
        AuroraPostgreSqlParameters: {
          Database: 'AuroraPostgreSqlParametersDatabase',
          Host: 'AuroraPostgreSqlParametersHost',
          Port: 12345,
        },
      };
      break;

    case DATA_SOURCE_ID_MARIADB:
      dataSourceParameters = {
        MariaDbParameters: {
          Database: 'MariaDbParametersDatabase',
          Host: 'MariaDbParametersHost',
          Port: 12345,
        },
      };
      break;

    case DATA_SOURCE_ID_MYSQL:
      dataSourceParameters = {
        MySqlParameters: {
          Database: 'MySqlParametersDatabase',
          Host: 'MySqlParametersHost',
          Port: 12345,
        },
      };
      break;

    case DATA_SOURCE_ID_ORACLE:
      dataSourceParameters = {
        OracleParameters: {
          Database: 'OracleParametersDatabase',
          Host: 'OracleParametersHost',
          Port: 12345,
        },
      };
      break;

    case DATA_SOURCE_ID_POSTGRESQL:
      dataSourceParameters = {
        PostgreSqlParameters: {
          Database: 'PostgreSqlParametersDatabase',
          Host: 'PostgreSqlParametersHost',
          Port: 12345,
        },
      };
      break;

    case DATA_SOURCE_ID_PRESTO:
      dataSourceParameters = {
        PrestoParameters: {
          Catalog: 'PrestoParametersCatalog',
          Host: 'PrestoParametersHost',
          Port: 12345,
        },
      };
      break;

    case DATA_SOURCE_ID_RDS:
      dataSourceParameters = {
        RdsParameters: {
          Database: 'RdsParametersDatabase',
          InstanceId: 'RdsParametersInstanceId',
        },
      };
      break;

    case DATA_SOURCE_ID_REDSHIFT:
      dataSourceParameters = {
        RedshiftParameters: {
          Database: 'RedshiftParametersDatabase',
          ClusterId: 'RedshiftParametersClusterId',
          Host: 'RedshiftParametersHost',
          Port: 12345,
        },
      };
      break;

    case DATA_SOURCE_ID_S3:
      dataSourceParameters = {
        S3Parameters: {
          ManifestFileLocation: {
            Bucket: 'TestBucket',
            Key: 'TestKey',
          },
        },
      };
      break;

    case DATA_SOURCE_ID_SNOWFLAKE:
      dataSourceParameters = {
        SnowflakeParameters: {
          Database: 'SnowflakeParametersDatabase',
          Host: 'SnowflakeParametersHost',
          Warehouse: 'SnowflakeParametersWarehouse',
        },
      };
      break;

    case DATA_SOURCE_ID_SPARK:
      dataSourceParameters = {
        SparkParameters: {
          Host: 'SparkParametersHost',
          Port: 12345,
        },
      };
      break;

    case DATA_SOURCE_ID_SQLSERVER:
      dataSourceParameters = {
        SqlServerParameters: {
          Database: 'SqlServerParametersDatabase',
          Host: 'host',
          Port: 12345,
        },
      };
      break;

    case DATA_SOURCE_ID_TERADATA:
      dataSourceParameters = {
        TeradataParameters: {
          Database: 'TeradataParametersDatabase',
          Host: 'TeradataParametersHost',
          Port: 12345,
        },
      };
      break;
    default:
      dataSourceParameters = {};
      break;
  }

  return dataSourceParameters;
}

export function getDataSourceType(dataSourceId: string): string {
  let type: string;

  switch (dataSourceId) {
    case DATA_SOURCE_ID_AMAZON_ELASTICSEARCH:
      type = 'AMAZON_ELASTICSEARCH';
      break;
    case DATA_SOURCE_ID_AMAZON_OPENSEARCH:
      type = 'AMAZON_OPENSEARCH';
      break;
    case DATA_SOURCE_ID_ATHENA:
      type = 'ATHENA';
      break;
    case DATA_SOURCE_ID_AURORA:
      type = 'AURORA';
      break;
    case DATA_SOURCE_ID_AURORA_POSTGRESQL:
      type = 'AURORA_POSTGRESQL';
      break;
    case DATA_SOURCE_ID_MARIADB:
      type = 'MARIADB';
      break;
    case DATA_SOURCE_ID_MYSQL:
      type = 'MYSQL';
      break;
    case DATA_SOURCE_ID_ORACLE:
      type = 'ORACLE';
      break;
    case DATA_SOURCE_ID_POSTGRESQL:
      type = 'POSTGRESQL';
      break;
    case DATA_SOURCE_ID_PRESTO:
      type = 'PRESTO';
      break;
    case DATA_SOURCE_ID_RDS:
      type = 'RDS';
      break;
    case DATA_SOURCE_ID_REDSHIFT:
      type = 'REDSHIFT';
      break;
    case DATA_SOURCE_ID_S3:
      type = 'S3';
      break;
    case DATA_SOURCE_ID_SNOWFLAKE:
      type = 'SNOWFLAKE';
      break;
    case DATA_SOURCE_ID_SPARK:
      type = 'SPARK';
      break;
    case DATA_SOURCE_ID_SQLSERVER:
      type = 'SQLSERVER';
      break;
    case DATA_SOURCE_ID_TERADATA:
      type = 'TERADATA';
      break;

    default:
      type = 'NONE';
      break;
  }

  return type;
}

// DataSet
function buildPhysicalTableMap(dataSetId: string): QuickSight.PhysicalTableMap {
  let physicalTableMap: QuickSight.PhysicalTableMap = {};

  dataSetId.split('$').forEach(function (value, index) {
    switch (value) {
      case RELATIONAL_TABLE:
        physicalTableMap[`${value}$${index}`] = {
          RelationalTable: {
            DataSourceArn: `arn:aws:quicksight:region:1234567:datasource/${DATA_SOURCE_ID_AURORA}`,
            Catalog: 'RelationalTableCatalog',
            Schema: 'RelationalTableSchema',
            Name: 'RelationalTableName',
            InputColumns: [
              {
                Name: 'RelationalTableInputColumnName',
                Type: 'RelationalTableInputColumnType',
              },
            ],
          },
        };
        break;

      case CUSTOM_SQL:
        physicalTableMap[`${value}$${index}`] = {
          CustomSql: {
            DataSourceArn: `arn:aws:quicksight:region:1234567:datasource/${DATA_SOURCE_ID_MYSQL}`,
            Name: 'CustomSqlName',
            SqlQuery: 'CustomSqlSqlQuery',
            Columns: [
              {
                Name: 'CustomSqlName',
                Type: 'CustomSqlType',
              },
            ],
          },
        };
        break;

      case S3_SOURCE:
        physicalTableMap[`${value}$${index}`] = {
          S3Source: {
            DataSourceArn: `arn:aws:quicksight:region:1234567:datasource/${DATA_SOURCE_ID_S3}`,
            UploadSettings: {
              Format: 'UploadSettingsFormat',
              StartFromRow: 123,
              ContainsHeader: true,
              TextQualifier: 'UploadSettingsTextQualifier',
              Delimiter: 'UploadSettingsDelimiter',
            },
            InputColumns: [
              {
                Name: 'S3SourceInputColumnsName',
                Type: 'S3SourceInputColumnsType',
              },
            ],
          },
        };
    };
  });

  return physicalTableMap;
}

function buildLogicalTableMap(dataSetId: string): QuickSight.LogicalTableMap {
  let logicalTableMap: QuickSight.LogicalTableMap = {};

  dataSetId.split('$').forEach(function (value, index) {
    if (LOGICAL_TABLE_MAP_ATTRS.includes(value)) {
      logicalTableMap[`${value}$${index}`] = {
        Alias: 'logicalTableMapAlias',
        DataTransforms: [],
        Source: {
          JoinInstruction: {
            LeftOperand: '',
            RightOperand: '',
            LeftJoinKeyProperties: {
              UniqueKey: true,
            },
            RightJoinKeyProperties: {
              UniqueKey: true,
            },
            Type: '',
            OnClause: '',
          },
        },
      };
    }

    switch (value) {
      case PROJECT_OPERATION:
        logicalTableMap[`${value}$${index}`].DataTransforms?.push({
          ProjectOperation: {
            ProjectedColumns: [
              'ProjectedColumns',
            ],
          },
        });
        break;

      case FILTER_OPERATION:
        logicalTableMap[`${value}$${index}`].DataTransforms?.push({
          FilterOperation: {
            ConditionExpression: 'ConditionExpression',
          },
        });
        break;

      case CREATE_COLUMNS_OPERATION:
        logicalTableMap[`${value}$${index}`].DataTransforms?.push({
          CreateColumnsOperation: {
            Columns: [
              {
                ColumnName: 'CreateColumnsOperationColumnName',
                ColumnId: '',
                Expression: '',
              },
            ],
          },
        });
        break;

      case RENAME_COLUMN_OPERATION:
        logicalTableMap[`${value}$${index}`].DataTransforms?.push({
          RenameColumnOperation: {
            ColumnName: 'RenameColumnOperationColumnName',
            NewColumnName: '',
          },
        });
        break;

      case CAST_COLUMN_TYPE_OPERATION:
        logicalTableMap[`${value}$${index}`].DataTransforms?.push({
          CastColumnTypeOperation: {
            ColumnName: 'CastColumnTypeOperationColumnName',
            NewColumnType: '',
            Format: '',
          },
        });
        break;

      case TAG_COLUMN_OPERATION:
        logicalTableMap[`${value}$${index}`].DataTransforms?.push({
          TagColumnOperation: {
            ColumnName: '',
            Tags: [
              {
                ColumnGeographicRole: '',
                ColumnDescription: {
                  Text: 'Text',
                },
              },
            ],
          },
        });
        break;

      case UNTAG_COLUMN_OPERATION:
        logicalTableMap[`${value}$${index}`].DataTransforms?.push({
          UntagColumnOperation: {
            ColumnName: '',
            TagNames: [
              'TagNames',
            ],
          },
        });
        break;
    };
  });

  return logicalTableMap;
}

// MOCKED FUNCTIONS

// General
const mockListTagsForResource = jest.fn((
  params: QuickSight.ListTagsForResourceRequest,
  callback?: ((err?: AWSError, data?: QuickSight.ListTagsForResourceResponse) => void) | undefined) => {

  if (callback) {
    callback(undefined, {
      Tags: [
        {
          Key: 'ResourceArn',
          Value: params.ResourceArn,
        },
      ],
    });
  }

  return {
    promise: () => { },
  };
});

// DataSource
const mockDescribeDataSource = jest.fn((
  params: QuickSight.DescribeDataSourceRequest,
  callback?: ((err?: AWSError, data?: QuickSight.DescribeDataSourceResponse) => void)) => {

  let response: QuickSight.DescribeDataSourceResponse = {
    DataSource: {
      DataSourceId: params.DataSourceId,
      Name: 'DataSourceName',
      Arn: `arn:aws:quicksight:region:${params.AwsAccountId}:datasource/${params.DataSourceId}`,
      AlternateDataSourceParameters: [],
      ErrorInfo: {
        Message: 'Error message',
        Type: 'ErrorType',
      },
      VpcConnectionProperties: {
        VpcConnectionArn: `arn:aws:ec2:region:${params.AwsAccountId}:vpc-peering-connection/*`,
      },
      SecretArn: `arn:aws:secretsmanager:region:${params.AwsAccountId}:secret:secretId`,
    },
  };

  if (response.DataSource?.AlternateDataSourceParameters) {
    response.DataSource.Type = getDataSourceType(params.DataSourceId);
    response.DataSource.DataSourceParameters = buildDataSourceParameter(params.DataSourceId);
    response.DataSource.AlternateDataSourceParameters.push(buildDataSourceParameter(params.DataSourceId));
  }

  if (callback) {
    callback(undefined, response);
  }

  return {
    promise: () => { },
  };
});

const mockDescribeDataSourcePermissions = jest.fn((
  params: QuickSight.DescribeDataSourcePermissionsRequest,
  callback?: ((err?: AWSError, data?: QuickSight.DescribeDataSourcePermissionsResponse) => void) | undefined) => {

  if (callback) {
    callback(undefined, {
      DataSourceId: params.DataSourceId,
      DataSourceArn: `arn:aws:quicksight:region:${params.AwsAccountId}:datasource/${params.DataSourceId}`,
      Permissions: [
        {
          Principal: 'DataSourcePermissionsPrincipal',
          Actions: [
            'DataSourcePermissionsAction',
          ],
        },
      ],
    });
  }

  return {
    promise: () => { },
  };
});

// DataSet
const mockDescribeDataSet = jest.fn((
  params: QuickSight.DescribeDataSetRequest,
  callback?: ((err?: AWSError, data?: QuickSight.DescribeDataSetResponse) => void)) => {

  let response: QuickSight.DescribeDataSetResponse = {
    DataSet: {
      DataSetId: params.DataSetId,
      Name: 'DataSetName',
      Arn: `arn:aws:quicksight:region:${params.AwsAccountId}:dataset/${params.DataSetId}`,
      PhysicalTableMap: {},
      LogicalTableMap: {},
      OutputColumns: [
        {
          Name: 'OutputColumnName',
          Description: 'OutputColumnDescription',
          Type: 'OutputColumnDescriptionType',
        },
      ],
      ImportMode: 'ImportMode',
      ColumnGroups: [
        {
          GeoSpatialColumnGroup: {
            Name: 'GeoSpatialColumnGroupName',
            CountryCode: 'GeoSpatialColumnGroupCountryCode',
            Columns: [
              'GeoSpatialColumnGroupColumn',
            ],
          },
        },
      ],
      FieldFolders: {
        fieldFolderName: {
          description: 'FieldFolderDescription',
          columns: [
            'FieldFolderColumn',
          ],
        },
      },
      RowLevelPermissionDataSet: {
        Namespace: 'RowLevelPermissionDataSetNamespace',
        Arn: 'RowLevelPermissionDataSetArn',
        PermissionPolicy: 'RowLevelPermissionDataSetPermissionPolicy',
        FormatVersion: 'RowLevelPermissionDataSetFormatVersion',
        Status: 'RowLevelPermissionDataSetStatus',
      },
      RowLevelPermissionTagConfiguration: {
        Status: 'RowLevelPermissionTagConfigurationStatus',
        TagRules: [
          {
            TagKey: 'RowLevelPermissionTagConfigurationTagRulesTagKey',
            ColumnName: 'RowLevelPermissionTagConfigurationTagRulesColumnName',
            TagMultiValueDelimiter: 'RowLevelPermissionTagConfigurationTagRulesTagMultiValueDelimiter',
            MatchAllValue: 'RowLevelPermissionTagConfigurationTagRulesMatchAllValue',
          },
        ],
      },
      ColumnLevelPermissionRules: [
        {
          Principals: [
            'ColumnLevelPermissionRulesPrincipals',
          ],
          ColumnNames: [
            'ColumnLevelPermissionRulesColumnNames',
          ],
        },
      ],
      DataSetUsageConfiguration: {
        DisableUseAsDirectQuerySource: true,
        DisableUseAsImportedSource: true,
      },
    },
  };

  if (response.DataSet) {
    response.DataSet.PhysicalTableMap = buildPhysicalTableMap(params.DataSetId);
  }

  if (response.DataSet) {
    response.DataSet.LogicalTableMap = buildLogicalTableMap(params.DataSetId);
  }

  if (callback) {
    callback(undefined, response);
  }

  return {
    promise: () => { },
  };
});

const mockDescribeDataSetPermissions = jest.fn((
  params: QuickSight.DescribeDataSetPermissionsRequest,
  callback?: ((err?: AWSError, data?: QuickSight.DescribeDataSetPermissionsResponse) => void) | undefined) => {

  if (callback) {
    callback(undefined, {
      DataSetId: params.DataSetId,
      DataSetArn: `arn:aws:quicksight:region:${params.AwsAccountId}:dataset/${params.DataSetId}`,
      Permissions: [
        {
          Principal: 'DataSetPermissionsPrincipal',
          Actions: [
            'DataSetPermissionsAction',
          ],
        },
      ],
    });
  }

  return {
    promise: () => { },
  };
});

// Template
const mockDescribeTemplate = jest.fn((
  params: QuickSight.DescribeTemplateRequest,
  callback?: ((err?: AWSError, data?: QuickSight.DescribeTemplateResponse) => void)) => {

  let sourceEntityArn: string;

  switch (params.TemplateId) {
    case SOURCE_TEMPLATE:
      sourceEntityArn = `arn:aws:quicksight:region:${params.AwsAccountId}:template/${SOURCE_ANALYSIS}`;
      break;
    case SOURCE_ANALYSIS:
      sourceEntityArn = `arn:aws:quicksight:region:${params.AwsAccountId}:analysis/${ANALYSIS_ID}`;
      break;
    default:
      sourceEntityArn = `invalid: ${params.TemplateId}`;
      break;
  }

  let response: QuickSight.DescribeTemplateResponse = {
    RequestId: 'RequestId',
    Template: {
      Arn: `arn:aws:quicksight:region:${params.AwsAccountId}:template/${params.TemplateId}`,
      Name: 'TemplateName',
      TemplateId: params.TemplateId,
      Version: {
        DataSetConfigurations: [
          {
            ColumnGroupSchemaList: [
              {
                ColumnGroupColumnSchemaList: [
                  {
                    Name: 'Name',
                  },
                ],
                Name: 'Name',
              },
            ],
            DataSetSchema: {
              ColumnSchemaList: [
                {
                  DataType: 'DataType',
                  GeographicRole: 'GeographicRole',
                  Name: 'Name',
                },
              ],
            },
            Placeholder: `arn:aws:quicksight:region:${params.AwsAccountId}:dataset/${DATA_SET_ID}$${S3_SOURCE}$${UNTAG_COLUMN_OPERATION}`,
          },
        ],
        Description: 'Description',
        Errors: [
          {
            Message: 'Message',
            Type: 'Type',
            ViolatedEntities: [
              {
                Path: 'Path',
              },
            ],
          },
        ],
        Sheets: [
          {
            Name: 'Name',
            SheetId: 'SheetId',
          },
        ],
        SourceEntityArn: sourceEntityArn,
        Status: 'Status',
        ThemeArn: `arn:aws:quicksight:region:${params.AwsAccountId}:theme/${MANAGED_THEME}`,
      },
    },
  };

  if (callback) {
    callback(undefined, response);
  }

  return {
    promise: () => { },
  };
});

const mockDescribeTemplatePermissions = jest.fn((
  params: QuickSight.DescribeTemplatePermissionsRequest,
  callback?: ((err?: AWSError, data?: QuickSight.DescribeTemplatePermissionsResponse) => void) | undefined) => {

  if (callback) {
    callback(undefined, {
      TemplateId: params.TemplateId,
      TemplateArn: `arn:aws:quicksight:region:${params.AwsAccountId}:template/${params.TemplateId}`,
      Permissions: [
        {
          Principal: 'TemplatePermissionsPrincipal',
          Actions: [
            'TemplatePermissionsAction',
          ],
        },
      ],
    });
  }

  return {
    promise: () => { },
  };
});

//Theme
const mockDescribeTheme = jest.fn((
  params: QuickSight.DescribeThemeRequest,
  callback?: ((err?: AWSError, data?: QuickSight.DescribeThemeResponse) => void)) => {

  let response: QuickSight.DescribeThemeResponse = {
    Theme: {
      Arn: `arn:aws:quicksight:region:${params.AwsAccountId}:theme/${params.ThemeId}`,
      Name: 'ThemeName',
      ThemeId: params.ThemeId,
      Version: {
        VersionNumber: 123,
        Arn: `arn:aws:quicksight:region:${params.AwsAccountId}:theme/${params.ThemeId}/version/`,
        Configuration: {
          DataColorPalette: {
            Colors: [
              'Colors',
            ],
            MinMaxGradient: [
              'MinMaxGradient',
            ],
            EmptyFillColor: 'EmptyFillColor',
          },
          UIColorPalette: {
            PrimaryForeground: 'PrimaryForeground',
            PrimaryBackground: 'PrimaryBackground',
            SecondaryForeground: 'SecondaryForeground',
            SecondaryBackground: 'SecondaryBackground',
            Accent: 'Accent',
            AccentForeground: 'AccentForeground',
            Danger: 'Danger',
            DangerForeground: 'DangerForeground',
            Warning: 'Warning',
            WarningForeground: 'WarningForeground',
            Success: 'Success',
            SuccessForeground: 'SuccessForeground',
            Dimension: 'Dimension',
            DimensionForeground: 'DimensionForeground',
            Measure: 'Measure',
            MeasureForeground: 'MeasureForeground',
          },
          Sheet: {
            Tile: {
              Border: {
                Show: true,
              },
            },
            TileLayout: {
              Gutter: {
                Show: true,
              },
              Margin: {
                Show: true,
              },
            },
          },
          Typography: {
            FontFamilies: [
              {
                FontFamily: 'FontFamily',
              },
            ],
          },
        },
        Errors: [
          {
            Type: 'INTERNAL_FAILURE',
            Message: 'Message',
          },
        ],
        Status: 'CREATION_SUCCESSFUL',
      },
      Type: 'CUSTOM',
    },
    Status: 123,
    RequestId: 'RequestId',
  };

  if (params.ThemeId != NO_VERSION_DESCRIPTION &&
      response.Theme?.Version) {
    response.Theme.Version.Description = 'Description';
  }

  if (params.ThemeId == CUSTOM_THEME && response.Theme?.Version) {
    response.Theme.Version.BaseThemeId = MANAGED_THEME;
  }

  if (callback) {
    callback(undefined, response);
  }

  return {
    promise: () => { },
  };
});

const mockDescribeThemePermissions = jest.fn((
  params: QuickSight.DescribeThemePermissionsRequest,
  callback?: ((err?: AWSError, data?: QuickSight.DescribeThemePermissionsResponse) => void) | undefined) => {

  if (callback) {
    callback(undefined, {
      ThemeId: params.ThemeId,
      ThemeArn: `arn:aws:quicksight:region:${params.AwsAccountId}:template/${params.ThemeId}`,
      Permissions: [
        {
          Principal: 'ThemePermissionsPrincipal',
          Actions: [
            'ThemePermissionsAction',
          ],
        },
      ],
    });
  }

  return {
    promise: () => { },
  };
});

// Analysis
const mockDescribeAnalysis = jest.fn((
  params: QuickSight.DescribeAnalysisRequest,
  callback?: ((err?: AWSError, data?: QuickSight.DescribeAnalysisResponse) => void)) => {

  let response: QuickSight.DescribeAnalysisResponse = {
    Analysis: {
      AnalysisId: params.AnalysisId,
      Arn: `arn:aws:quicksight:region:${params.AwsAccountId}:analysis/${params.AnalysisId}`,
      DataSetArns: [`arn:aws:quicksight:region:${params.AwsAccountId}:dataset/${DATA_SET_ID}$${S3_SOURCE}$${UNTAG_COLUMN_OPERATION}`],
      Errors: [
        {
          Message: 'Message',
          Type: 'Type',
          ViolatedEntities: [
            {
              Path: 'Path',
            },
          ],
        },
      ],
      Name: 'AnalysisName',
      Sheets: [
        {
          Name: 'Name',
          SheetId: 'SheetId',
        },
      ],
      Status: 'Status',
      ThemeArn: `arn:aws:quicksight:region:${params.AwsAccountId}:theme/${MANAGED_THEME}`,
    },
    RequestId: 'RequestId',
  };

  if (callback) {
    callback(undefined, response);
  }

  return {
    promise: () => { },
  };
});

const mockDescribeAnalysisPermissions = jest.fn((
  params: QuickSight.DescribeAnalysisPermissionsRequest,
  callback?: ((err?: AWSError, data?: QuickSight.DescribeAnalysisPermissionsResponse) => void) | undefined) => {

  if (callback) {
    callback(undefined, {
      AnalysisId: params.AnalysisId,
      AnalysisArn: `arn:aws:quicksight:region:${params.AwsAccountId}:analysis/${params.AnalysisId}`,
      Permissions: [
        {
          Principal: 'AnalysisPermissionsPrincipal',
          Actions: [
            'AnalysisPermissionsAction',
          ],
        },
      ],
    });
  }

  return {
    promise: () => { },
  };
});

// Dashboard
const mockDescribeDashboard = jest.fn((
  params: QuickSight.DescribeDashboardRequest,
  callback?: ((err?: AWSError, data?: QuickSight.DescribeDashboardResponse) => void)) => {

  let response: QuickSight.DescribeDashboardResponse = {
    Dashboard: {
      Arn: `arn:aws:quicksight:region:${params.AwsAccountId}:dashboard/${params.DashboardId}`,
      DashboardId: params.DashboardId,
      Name: 'DashboardName',
      Version: {
        Arn: `arn:aws:quicksight:region:${params.AwsAccountId}:dashboard/${params.DashboardId}/version`,
        DataSetArns: [`arn:aws:quicksight:region:${params.AwsAccountId}:dataset/${DATA_SET_ID}$${S3_SOURCE}$${UNTAG_COLUMN_OPERATION}`],
        Errors: [
          {
            Message: 'Message',
            Type: 'Type',
            ViolatedEntities: [
              {
                Path: 'Path',
              },
            ],
          },
        ],
        Sheets: [
          {
            Name: 'Name',
            SheetId: 'SheetId',
          },
        ],
        SourceEntityArn: `arn:aws:quicksight:region:${params.AwsAccountId}:template/${SOURCE_ANALYSIS}`,
        Status: 'Status',
        ThemeArn: `arn:aws:quicksight:region:${params.AwsAccountId}:theme/${MANAGED_THEME}`,
      },
    },
    RequestId: 'RequestId',
  };

  if (params.DashboardId != NO_VERSION_DESCRIPTION &&
      response.Dashboard?.Version) {
    response.Dashboard.Version.Description = 'Description';
  }

  if (callback) {
    callback(undefined, response);
  }

  return {
    promise: () => { },
  };
});

const mockDescribeDashboardPermissions = jest.fn((
  params: QuickSight.DescribeDashboardPermissionsRequest,
  callback?: ((err?: AWSError, data?: QuickSight.DescribeDashboardPermissionsResponse) => void) | undefined) => {

  if (callback) {
    callback(undefined, {
      DashboardId: params.DashboardId,
      DashboardArn: `arn:aws:quicksight:region:${params.AwsAccountId}:dashboard/${params.DashboardId}`,
      Permissions: [
        {
          Principal: 'DashboardPermissionsPrincipal',
          Actions: [
            'DashboardPermissionsAction',
          ],
        },
      ],
    });
  }

  return {
    promise: () => { },
  };
});

export const mockQuickSight = {
  listTagsForResource: mockListTagsForResource,
  describeDataSource: mockDescribeDataSource,
  describeDataSourcePermissions: mockDescribeDataSourcePermissions,
  describeDataSet: mockDescribeDataSet,
  describeDataSetPermissions: mockDescribeDataSetPermissions,
  describeTemplate: mockDescribeTemplate,
  describeTemplatePermissions: mockDescribeTemplatePermissions,
  describeTheme: mockDescribeTheme,
  describeThemePermissions: mockDescribeThemePermissions,
  describeAnalysis: mockDescribeAnalysis,
  describeAnalysisPermissions: mockDescribeAnalysisPermissions,
  describeDashboard: mockDescribeDashboard,
  describeDashboardPermissions: mockDescribeDashboardPermissions,
};

jest.mock('aws-sdk', () => {
  return {
    QuickSight: jest.fn(() => mockQuickSight),
    config: { logger: '' },
  };
});

import { QuickSight, AWSError } from 'aws-sdk';
