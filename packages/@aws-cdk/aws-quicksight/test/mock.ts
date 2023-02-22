// CONSTANTS

// All
export const NOT_FOUND = 'NOT_FOUND';
export const NO_PERMISSIONS = 'NO_PERMISSIONS';

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
function buildDataSourceParameter(dataSourceId: string): cxapi.QuickSightContextResponse.DataSourceParameters {

  let dataSourceParameters: cxapi.QuickSightContextResponse.DataSourceParameters;

  switch (dataSourceId) {

    case DATA_SOURCE_ID_AMAZON_ELASTICSEARCH:
      dataSourceParameters = {
        amazonElasticsearchParameters: {
          domain: 'AmazonElasticsearchParametersDomain',
        },
      };
      break;

    case DATA_SOURCE_ID_AMAZON_OPENSEARCH:
      dataSourceParameters = {
        amazonOpenSearchParameters: {
          domain: 'AmazonOpenSearchParametersDomain',
        },
      };
      break;

    case DATA_SOURCE_ID_ATHENA:
      dataSourceParameters = {
        athenaParameters: {
          workGroup: 'primary',
        },
      };
      break;

    case DATA_SOURCE_ID_AURORA:
      dataSourceParameters = {
        auroraParameters: {
          database: 'AuroraParametersDatabase',
          host: 'AuroraParametersHost',
          port: 12345,
        },
      };
      break;

    case DATA_SOURCE_ID_AURORA_POSTGRESQL:
      dataSourceParameters = {
        auroraPostgreSqlParameters: {
          database: 'AuroraPostgreSqlParametersDatabase',
          host: 'AuroraPostgreSqlParametersHost',
          port: 12345,
        },
      };
      break;

    case DATA_SOURCE_ID_MARIADB:
      dataSourceParameters = {
        mariaDbParameters: {
          database: 'MariaDbParametersDatabase',
          host: 'MariaDbParametersHost',
          port: 12345,
        },
      };
      break;

    case DATA_SOURCE_ID_MYSQL:
      dataSourceParameters = {
        mySqlParameters: {
          database: 'MySqlParametersDatabase',
          host: 'MySqlParametersHost',
          port: 12345,
        },
      };
      break;

    case DATA_SOURCE_ID_ORACLE:
      dataSourceParameters = {
        oracleParameters: {
          database: 'OracleParametersDatabase',
          host: 'OracleParametersHost',
          port: 12345,
        },
      };
      break;

    case DATA_SOURCE_ID_POSTGRESQL:
      dataSourceParameters = {
        postgreSqlParameters: {
          database: 'PostgreSqlParametersDatabase',
          host: 'PostgreSqlParametersHost',
          port: 12345,
        },
      };
      break;

    case DATA_SOURCE_ID_PRESTO:
      dataSourceParameters = {
        prestoParameters: {
          catalog: 'PrestoParametersCatalog',
          host: 'PrestoParametersHost',
          port: 12345,
        },
      };
      break;

    case DATA_SOURCE_ID_RDS:
      dataSourceParameters = {
        rdsParameters: {
          database: 'RdsParametersDatabase',
          instanceId: 'RdsParametersInstanceId',
        },
      };
      break;

    case DATA_SOURCE_ID_REDSHIFT:
      dataSourceParameters = {
        redshiftParameters: {
          database: 'RedshiftParametersDatabase',
          clusterId: 'RedshiftParametersClusterId',
          host: 'RedshiftParametersHost',
          port: 12345,
        },
      };
      break;

    case DATA_SOURCE_ID_S3:
      dataSourceParameters = {
        s3Parameters: {
          manifestFileLocation: {
            bucket: 'TestBucket',
            key: 'TestKey',
          },
        },
      };
      break;

    case DATA_SOURCE_ID_SNOWFLAKE:
      dataSourceParameters = {
        snowflakeParameters: {
          database: 'SnowflakeParametersDatabase',
          host: 'SnowflakeParametersHost',
          warehouse: 'SnowflakeParametersWarehouse',
        },
      };
      break;

    case DATA_SOURCE_ID_SPARK:
      dataSourceParameters = {
        sparkParameters: {
          host: 'SparkParametersHost',
          port: 12345,
        },
      };
      break;

    case DATA_SOURCE_ID_SQLSERVER:
      dataSourceParameters = {
        sqlServerParameters: {
          database: 'SqlServerParametersDatabase',
          host: 'host',
          port: 12345,
        },
      };
      break;

    case DATA_SOURCE_ID_TERADATA:
      dataSourceParameters = {
        teradataParameters: {
          database: 'TeradataParametersDatabase',
          host: 'TeradataParametersHost',
          port: 12345,
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
function buildPhysicalTableMap(dataSetId: string): cxapi.QuickSightContextResponse.PhysicalTableMap {
  let physicalTableMap: cxapi.QuickSightContextResponse.PhysicalTableMap = {};

  dataSetId.split('$').forEach(function (value, index) {
    switch (value) {
      case RELATIONAL_TABLE:
        physicalTableMap[`${value}$${index}`] = {
          relationalTable: {
            dataSourceArn: `arn:aws:quicksight:region:1234567:datasource/${DATA_SOURCE_ID_AURORA}`,
            catalog: 'RelationalTableCatalog',
            schema: 'RelationalTableSchema',
            name: 'RelationalTableName',
            inputColumns: [
              {
                name: 'RelationalTableInputColumnName',
                type: 'RelationalTableInputColumnType',
              },
            ],
          },
        };
        break;

      case CUSTOM_SQL:
        physicalTableMap[`${value}$${index}`] = {
          customSql: {
            dataSourceArn: `arn:aws:quicksight:region:1234567:datasource/${DATA_SOURCE_ID_MYSQL}`,
            name: 'CustomSqlName',
            sqlQuery: 'CustomSqlSqlQuery',
            columns: [
              {
                name: 'CustomSqlName',
                type: 'CustomSqlType',
              },
            ],
          },
        };
        break;

      case S3_SOURCE:
        physicalTableMap[`${value}$${index}`] = {
          s3Source: {
            dataSourceArn: `arn:aws:quicksight:region:1234567:datasource/${DATA_SOURCE_ID_S3}`,
            uploadSettings: {
              format: 'UploadSettingsFormat',
              startFromRow: 123,
              containsHeader: true,
              textQualifier: 'UploadSettingsTextQualifier',
              delimiter: 'UploadSettingsDelimiter',
            },
            inputColumns: [
              {
                name: 'S3SourceInputColumnsName',
                type: 'S3SourceInputColumnsType',
              },
            ],
          },
        };
    };
  });

  return physicalTableMap;
}

function buildLogicalTableMap(dataSetId: string): cxapi.QuickSightContextResponse.LogicalTableMap {
  let logicalTableMap: cxapi.QuickSightContextResponse.LogicalTableMap = {};

  dataSetId.split('$').forEach(function (value, index) {
    if (LOGICAL_TABLE_MAP_ATTRS.includes(value)) {
      logicalTableMap[`${value}$${index}`] = {
        alias: 'logicalTableMapAlias',
        dataTransforms: [],
        source: {
          joinInstruction: {
            leftOperand: '',
            rightOperand: '',
            leftJoinKeyProperties: {
              uniqueKey: true,
            },
            rightJoinKeyProperties: {
              uniqueKey: true,
            },
            type: '',
            onClause: '',
          },
        },
      };
    }

    switch (value) {
      case PROJECT_OPERATION:
        logicalTableMap[`${value}$${index}`].dataTransforms?.push({
          projectOperation: {
            projectedColumns: [
              'ProjectedColumns',
            ],
          },
        });
        break;

      case FILTER_OPERATION:
        logicalTableMap[`${value}$${index}`].dataTransforms?.push({
          filterOperation: {
            conditionExpression: 'ConditionExpression',
          },
        });
        break;

      case CREATE_COLUMNS_OPERATION:
        logicalTableMap[`${value}$${index}`].dataTransforms?.push({
          createColumnsOperation: {
            columns: [
              {
                columnName: 'CreateColumnsOperationColumnName',
                columnId: '',
                expression: '',
              },
            ],
          },
        });
        break;

      case RENAME_COLUMN_OPERATION:
        logicalTableMap[`${value}$${index}`].dataTransforms?.push({
          renameColumnOperation: {
            columnName: 'RenameColumnOperationColumnName',
            newColumnName: '',
          },
        });
        break;

      case CAST_COLUMN_TYPE_OPERATION:
        logicalTableMap[`${value}$${index}`].dataTransforms?.push({
          castColumnTypeOperation: {
            columnName: 'CastColumnTypeOperationColumnName',
            newColumnType: '',
            format: '',
          },
        });
        break;

      case TAG_COLUMN_OPERATION:
        logicalTableMap[`${value}$${index}`].dataTransforms?.push({
          tagColumnOperation: {
            columnName: '',
            tags: [
              {
                columnGeographicRole: '',
                columnDescription: {
                  text: 'Text',
                },
              },
            ],
          },
        });
        break;

      case UNTAG_COLUMN_OPERATION:
        logicalTableMap[`${value}$${index}`].dataTransforms?.push({
          untagColumnOperation: {
            columnName: '',
            tagNames: [
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
  params: cxschema.QuickSightTagsContextQuery,
  callback?: ((err?: AWSError, data?: cxapi.QuickSightContextResponse.TagList) =>
  cxapi.QuickSightContextResponse.TagList) | undefined) => {

  let response = [
    {
      key: 'ResourceArn',
      value: params.resourceArn,
    },
  ];

  if (callback) {
    callback(undefined, response);
  }

  return response;
});

// DataSource
const mockDescribeDataSource = jest.fn((
  params: cxschema.QuickSightDataSourceContextQuery,
  callback?: ((err?: AWSError, data?: cxapi.QuickSightContextResponse.DataSource) =>
  cxapi.QuickSightContextResponse.DataSource)) => {

  let response: cxapi.QuickSightContextResponse.DataSource = {
    dataSourceId: params.dataSourceId,
    name: 'DataSourceName',
    arn: `arn:aws:quicksight:region:${params.account}:datasource/${params.dataSourceId}`,
    type: getDataSourceType(params.dataSourceId),
    dataSourceParameters: buildDataSourceParameter(params.dataSourceId),
    alternateDataSourceParameters: [
      buildDataSourceParameter(params.dataSourceId),
    ],
    errorInfo: {
      message: 'Error message',
      type: 'ErrorType',
    },
    vpcConnectionProperties: {
      vpcConnectionArn: `arn:aws:ec2:region:${params.account}:vpc-peering-connection/*`,
    },
    secretArn: `arn:aws:secretsmanager:region:${params.account}:secret:secretId`,
  };

  if (callback) {
    callback(undefined, response);
  }

  return response;
});

const mockDescribeDataSourcePermissions = jest.fn((
  params: cxschema.QuickSightDataSourceContextQuery,
  callback?: ((err?: AWSError, data?: cxapi.QuickSightContextResponse.ResourcePermissionList) =>
  cxapi.QuickSightContextResponse.ResourcePermissionList) | undefined) => {

  let response = [
    {
      principal: 'DataSourcePermissionsPrincipal',
      actions: [
        'DataSourcePermissionsAction',
      ],
    },
  ];

  if (params.region == NO_PERMISSIONS) {
    response = [];
  }

  if (callback) {
    callback(undefined, response);
  }

  return response;
});

// DataSet
const mockDescribeDataSet = jest.fn((
  params: cxschema.QuickSightDataSetContextQuery,
  callback?: ((err?: AWSError, data?: cxapi.QuickSightContextResponse.DataSet) =>
  cxapi.QuickSightContextResponse.DataSet)) => {

  let response: cxapi.QuickSightContextResponse.DataSet = {
    dataSetId: params.dataSetId,
    name: 'DataSetName',
    arn: `arn:aws:quicksight:region:${params.account}:dataset/${params.dataSetId}`,
    physicalTableMap: buildPhysicalTableMap(params.dataSetId),
    logicalTableMap: buildLogicalTableMap(params.dataSetId),
    outputColumns: [
      {
        name: 'OutputColumnName',
        description: 'OutputColumnDescription',
        type: 'OutputColumnDescriptionType',
      },
    ],
    importMode: 'ImportMode',
    columnGroups: [
      {
        geoSpatialColumnGroup: {
          name: 'GeoSpatialColumnGroupName',
          countryCode: 'GeoSpatialColumnGroupCountryCode',
          columns: [
            'GeoSpatialColumnGroupColumn',
          ],
        },
      },
    ],
    fieldFolders: {
      fieldFolderName: {
        description: 'FieldFolderDescription',
        columns: [
          'FieldFolderColumn',
        ],
      },
    },
    rowLevelPermissionDataSet: {
      namespace: 'RowLevelPermissionDataSetNamespace',
      arn: 'RowLevelPermissionDataSetArn',
      permissionPolicy: 'RowLevelPermissionDataSetPermissionPolicy',
      formatVersion: 'RowLevelPermissionDataSetFormatVersion',
      status: 'RowLevelPermissionDataSetStatus',
    },
    rowLevelPermissionTagConfiguration: {
      status: 'RowLevelPermissionTagConfigurationStatus',
      tagRules: [
        {
          tagKey: 'RowLevelPermissionTagConfigurationTagRulesTagKey',
          columnName: 'RowLevelPermissionTagConfigurationTagRulesColumnName',
          tagMultiValueDelimiter: 'RowLevelPermissionTagConfigurationTagRulesTagMultiValueDelimiter',
          matchAllValue: 'RowLevelPermissionTagConfigurationTagRulesMatchAllValue',
        },
      ],
    },
    columnLevelPermissionRules: [
      {
        principals: [
          'ColumnLevelPermissionRulesPrincipals',
        ],
        columnNames: [
          'ColumnLevelPermissionRulesColumnNames',
        ],
      },
    ],
    dataSetUsageConfiguration: {
      disableUseAsDirectQuerySource: true,
      disableUseAsImportedSource: true,
    },
  };

  if (callback) {
    callback(undefined, response);
  }

  return response;
});

const mockDescribeDataSetPermissions = jest.fn((
  params: cxschema.QuickSightDataSetContextQuery,
  callback?: ((err?: AWSError, data?: cxapi.QuickSightContextResponse.ResourcePermissionList) =>
  cxapi.QuickSightContextResponse.ResourcePermissionList) | undefined) => {

  let response = [
    {
      principal: 'DataSetPermissionsPrincipal',
      actions: [
        'DataSetPermissionsAction',
      ],
    },
  ];

  if (params.region == NO_PERMISSIONS) {
    response = [];
  }

  if (callback) {
    callback(undefined, response);
  }

  return response;
});

// Template
const mockDescribeTemplate = jest.fn((
  params: cxschema.QuickSightTemplateContextQuery,
  callback?: ((err?: AWSError, data?: cxapi.QuickSightContextResponse.Template) =>
  cxapi.QuickSightContextResponse.Template)) => {

  let sourceEntityArn: string;

  switch (params.templateId) {
    case SOURCE_TEMPLATE:
      sourceEntityArn = `arn:aws:quicksight:region:${params.account}:template/${SOURCE_ANALYSIS}`;
      break;
    case SOURCE_ANALYSIS:
      sourceEntityArn = `arn:aws:quicksight:region:${params.account}:analysis/${ANALYSIS_ID}`;
      break;
    default:
      sourceEntityArn = `invalid: ${params.templateId}`;
      break;
  }

  let response: cxapi.QuickSightContextResponse.Template = {
    arn: `arn:aws:quicksight:region:${params.account}:template/${params.templateId}`,
    name: 'TemplateName',
    templateId: params.templateId,
    version: {
      dataSetConfigurations: [
        {
          columnGroupSchemaList: [
            {
              columnGroupColumnSchemaList: [
                {
                  name: 'Name',
                },
              ],
              name: 'Name',
            },
          ],
          dataSetSchema: {
            columnSchemaList: [
              {
                dataType: 'DataType',
                geographicRole: 'GeographicRole',
                name: 'Name',
              },
            ],
          },
          placeholder: `arn:aws:quicksight:region:${params.account}:dataset/${DATA_SET_ID}$${S3_SOURCE}$${UNTAG_COLUMN_OPERATION}`,
        },
      ],
      description: 'Description',
      errors: [
        {
          message: 'Message',
          type: 'Type',
          violatedEntities: [
            {
              path: 'Path',
            },
          ],
        },
      ],
      sheets: [
        {
          name: 'Name',
          sheetId: 'SheetId',
        },
      ],
      sourceEntityArn: sourceEntityArn,
      status: 'Status',
      themeArn: `arn:aws:quicksight:region:${params.account}:theme/${MANAGED_THEME}`,
    },
  };

  if (callback) {
    callback(undefined, response);
  }

  return response;
});

const mockDescribeTemplatePermissions = jest.fn((
  params: cxschema.QuickSightTemplateContextQuery,
  callback?: ((err?: AWSError, data?: cxapi.QuickSightContextResponse.ResourcePermissionList) =>
  cxapi.QuickSightContextResponse.ResourcePermissionList) | undefined) => {

  let response = [
    {
      principal: 'TemplatePermissionsPrincipal',
      actions: [
        'TemplatePermissionsAction',
      ],
    },
  ];

  if (params.region == NO_PERMISSIONS) {
    response = [];
  }

  if (callback) {
    callback(undefined, response);
  }

  return response;
});

//Theme
const mockDescribeTheme = jest.fn((
  params: cxschema.QuickSightThemeContextQuery,
  callback?: ((err?: AWSError, data?: cxapi.QuickSightContextResponse.Theme) =>
  cxapi.QuickSightContextResponse.Theme)) => {

  let description: string | undefined;
  if (params.themeId != NO_VERSION_DESCRIPTION) {
    description = 'Description';
  }

  let basethemeId: string | undefined;
  if (params.themeId == CUSTOM_THEME) {
    basethemeId = MANAGED_THEME;
  }

  let response: cxapi.QuickSightContextResponse.Theme = {
    arn: `arn:aws:quicksight:region:${params.account}:theme/${params.themeId}`,
    name: 'ThemeName',
    themeId: params.themeId,
    version: {
      description: description,
      baseThemeId: basethemeId,
      versionNumber: 123,
      arn: `arn:aws:quicksight:region:${params.account}:theme/${params.themeId}/version/`,
      configuration: {
        dataColorPalette: {
          colors: [
            'Colors',
          ],
          minMaxGradient: [
            'MinMaxGradient',
          ],
          emptyFillColor: 'EmptyFillColor',
        },
        uIColorPalette: {
          primaryForeground: 'PrimaryForeground',
          primaryBackground: 'PrimaryBackground',
          secondaryForeground: 'SecondaryForeground',
          secondaryBackground: 'SecondaryBackground',
          accent: 'Accent',
          accentForeground: 'AccentForeground',
          danger: 'Danger',
          dangerForeground: 'DangerForeground',
          warning: 'Warning',
          warningForeground: 'WarningForeground',
          success: 'Success',
          successForeground: 'SuccessForeground',
          dimension: 'Dimension',
          dimensionForeground: 'DimensionForeground',
          measure: 'Measure',
          measureForeground: 'MeasureForeground',
        },
        sheet: {
          tile: {
            border: {
              show: true,
            },
          },
          tileLayout: {
            gutter: {
              show: true,
            },
            margin: {
              show: true,
            },
          },
        },
        typography: {
          fontFamilies: [
            {
              fontFamily: 'FontFamily',
            },
          ],
        },
      },
      errors: [
        {
          type: 'INTERNAL_FAILURE',
          message: 'Message',
        },
      ],
      status: 'CREATION_SUCCESSFUL',
    },
    type: 'CUSTOM',
  };

  if (callback) {
    callback(undefined, response);
  }

  return response;
});

const mockDescribeThemePermissions = jest.fn((
  params: cxschema.QuickSightThemeContextQuery,
  callback?: ((err?: AWSError, data?: cxapi.QuickSightContextResponse.ResourcePermissionList) =>
  cxapi.QuickSightContextResponse.ResourcePermissionList) | undefined) => {

  let response = [
    {
      principal: 'ThemePermissionsPrincipal',
      actions: [
        'ThemePermissionsAction',
      ],
    },
  ];

  if (params.region == NO_PERMISSIONS) {
    response = [];
  }

  if (callback) {
    callback(undefined, response);
  }

  return response;
});

// Analysis
const mockDescribeAnalysis = jest.fn((
  params: cxschema.QuickSightAnalysisContextQuery,
  callback?: ((err?: AWSError, data?: cxapi.QuickSightContextResponse.Analysis) =>
  cxapi.QuickSightContextResponse.Analysis)) => {

  let response: cxapi.QuickSightContextResponse.Analysis = {
    analysisId: params.analysisId,
    arn: `arn:aws:quicksight:region:${params.account}:analysis/${params.analysisId}`,
    dataSetArns: [`arn:aws:quicksight:region:${params.account}:dataset/${DATA_SET_ID}$${S3_SOURCE}$${UNTAG_COLUMN_OPERATION}`],
    errors: [
      {
        message: 'Message',
        type: 'Type',
        violatedEntities: [
          {
            path: 'Path',
          },
        ],
      },
    ],
    name: 'AnalysisName',
    sheets: [
      {
        name: 'Name',
        sheetId: 'SheetId',
      },
    ],
    status: 'Status',
    themeArn: `arn:aws:quicksight:region:${params.account}:theme/${MANAGED_THEME}`,
  };

  if (callback) {
    callback(undefined, response);
  }

  return response;
});

const mockDescribeAnalysisPermissions = jest.fn((
  params: cxschema.QuickSightAnalysisContextQuery,
  callback?: ((err?: AWSError, data?: cxapi.QuickSightContextResponse.ResourcePermissionList) =>
  cxapi.QuickSightContextResponse.ResourcePermissionList) | undefined) => {

  let response = [
    {
      principal: 'AnalysisPermissionsPrincipal',
      actions: [
        'AnalysisPermissionsAction',
      ],
    },
  ];

  if (params.region == NO_PERMISSIONS) {
    response = [];
  }

  if (callback) {
    callback(undefined, response);
  }

  return response;
});

// Dashboard
const mockDescribeDashboard = jest.fn((
  params: cxschema.QuickSightDashboardContextQuery,
  callback?: ((err?: AWSError, data?: cxapi.QuickSightContextResponse.Dashboard) =>
  cxapi.QuickSightContextResponse.Dashboard)) => {


  let description: string | undefined;
  if (params.dashboardId != NO_VERSION_DESCRIPTION) {
    description = 'Description';
  }

  let response: cxapi.QuickSightContextResponse.Dashboard = {
    arn: `arn:aws:quicksight:region:${params.account}:dashboard/${params.dashboardId}`,
    dashboardId: params.dashboardId,
    name: 'DashboardName',
    version: {
      description: description,
      arn: `arn:aws:quicksight:region:${params.account}:dashboard/${params.dashboardId}/version`,
      dataSetArns: [`arn:aws:quicksight:region:${params.account}:dataset/${DATA_SET_ID}$${S3_SOURCE}$${UNTAG_COLUMN_OPERATION}`],
      errors: [
        {
          message: 'Message',
          type: 'Type',
          violatedEntities: [
            {
              path: 'Path',
            },
          ],
        },
      ],
      sheets: [
        {
          name: 'Name',
          sheetId: 'SheetId',
        },
      ],
      sourceEntityArn: `arn:aws:quicksight:region:${params.account}:template/${SOURCE_ANALYSIS}`,
      status: 'Status',
      themeArn: `arn:aws:quicksight:region:${params.account}:theme/${MANAGED_THEME}`,
    },
  };

  if (callback) {
    callback(undefined, response);
  }

  return response;
});

const mockDescribeDashboardPermissions = jest.fn((
  params: cxschema.QuickSightDashboardContextQuery,
  callback?: ((err?: AWSError, data?: cxapi.QuickSightContextResponse.ResourcePermissionList) =>
  cxapi.QuickSightContextResponse.ResourcePermissionList) | undefined) => {

  let response = [
    {
      principal: 'DashboardPermissionsPrincipal',
      actions: [
        'DashboardPermissionsAction',
      ],
    },
  ];

  if (params.region == NO_PERMISSIONS) {
    response = [];
  }

  if (callback) {
    callback(undefined, response);
  }

  return response;
});

import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { GetContextValueOptions, GetContextValueResult } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { AWSError } from 'aws-sdk';
import { Construct } from 'constructs';

export function mockGetValue (_scope: Construct, options: GetContextValueOptions) {
  let result: GetContextValueResult;

  if (options.props?.region == NOT_FOUND) {
    return { value: options.dummyValue };
  }

  switch (options.provider) {
    case cxschema.ContextProvider.QUICKSIGHT_TAGS_PROVIDER:
      result = { value: mockListTagsForResource(options.props as cxschema.QuickSightTagsContextQuery) };
      break;

    case cxschema.ContextProvider.QUICKSIGHT_DATA_SOURCE_PROVIDER:
      result = { value: mockDescribeDataSource(options.props as cxschema.QuickSightDataSourceContextQuery) };
      break;

    case cxschema.ContextProvider.QUICKSIGHT_DATA_SOURCE_PERMISSIONS_PROVIDER:
      result = { value: mockDescribeDataSourcePermissions(options.props as cxschema.QuickSightDataSourceContextQuery) };
      break;

    case cxschema.ContextProvider.QUICKSIGHT_DATA_SET_PROVIDER:
      result = { value: mockDescribeDataSet(options.props as cxschema.QuickSightDataSetContextQuery) };
      break;

    case cxschema.ContextProvider.QUICKSIGHT_DATA_SET_PERMISSIONS_PROVIDER:
      result = { value: mockDescribeDataSetPermissions(options.props as cxschema.QuickSightDataSetContextQuery) };
      break;

    case cxschema.ContextProvider.QUICKSIGHT_TEMPLATE_PROVIDER:
      result = { value: mockDescribeTemplate(options.props as cxschema.QuickSightTemplateContextQuery) };
      break;

    case cxschema.ContextProvider.QUICKSIGHT_TEMPLATE_PERMISSIONS_PROVIDER:
      result = { value: mockDescribeTemplatePermissions(options.props as cxschema.QuickSightTemplateContextQuery) };
      break;

    case cxschema.ContextProvider.QUICKSIGHT_THEME_PROVIDER:
      result = { value: mockDescribeTheme(options.props as cxschema.QuickSightThemeContextQuery) };
      break;

    case cxschema.ContextProvider.QUICKSIGHT_THEME_PERMISSIONS_PROVIDER:
      result = { value: mockDescribeThemePermissions(options.props as cxschema.QuickSightThemeContextQuery) };
      break;

    case cxschema.ContextProvider.QUICKSIGHT_ANALYSIS_PROVIDER:
      result = { value: mockDescribeAnalysis(options.props as cxschema.QuickSightAnalysisContextQuery) };
      break;

    case cxschema.ContextProvider.QUICKSIGHT_ANALYSIS_PERMISSIONS_PROVIDER:
      result = { value: mockDescribeAnalysisPermissions(options.props as cxschema.QuickSightAnalysisContextQuery) };
      break;

    case cxschema.ContextProvider.QUICKSIGHT_DASHBOARD_PROVIDER:
      result = { value: mockDescribeDashboard(options.props as cxschema.QuickSightDashboardContextQuery) };
      break;

    case cxschema.ContextProvider.QUICKSIGHT_DASHBOARD_PERMISSIONS_PROVIDER:
      result = { value: mockDescribeDashboardPermissions(options.props as cxschema.QuickSightDashboardContextQuery) };
      break;

    default:
      throw Error;
  }

  return result;
};
