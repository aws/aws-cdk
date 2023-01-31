// eslint-disable-next-line import/order
import * as Mock from './mock';

jest.mock('aws-sdk', () => {
  return {
    QuickSight: jest.fn(() => Mock.mockQuickSight),
    config: { logger: '' },
  };
});

import { Stack } from '@aws-cdk/core';
import { DataSource } from '../lib';

describe('datasource', () => {

  let oldConsoleLog: any;

  beforeAll(() => {
    oldConsoleLog = global.console.log;
    global.console.log = jest.fn();
  });

  afterAll(() => {
    global.console.log = oldConsoleLog;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test(`import a ${Mock.getDataSourceType(Mock.DATA_SOURCE_ID_AMAZON_ELASTICSEARCH)} data source`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSource = DataSource.fromId(stack,
      'ImportedDataSource',
      Mock.DATA_SOURCE_ID_AMAZON_ELASTICSEARCH,
    );

    // THEN
    let parameter: any = dataSource.dataSourceParameters?.amazonElasticsearchParameters;
    expect(parameter.domain).toBe('AmazonElasticsearchParametersDomain');

    let alternateParameter: any = dataSource.alternateDataSourceParameters?.[0].amazonElasticsearchParameters;
    expect(alternateParameter.domain).toBe('AmazonElasticsearchParametersDomain');
  });

  test(`import a ${Mock.getDataSourceType(Mock.DATA_SOURCE_ID_AMAZON_OPENSEARCH)} data source`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSource = DataSource.fromId(stack, 'ImportedDataSource', Mock.DATA_SOURCE_ID_AMAZON_OPENSEARCH);

    // THEN
    let parameter: any = dataSource.dataSourceParameters?.amazonOpenSearchParameters;
    expect(parameter.domain).toBe('AmazonOpenSearchParametersDomain');

    let alternateParameter: any = dataSource.alternateDataSourceParameters?.[0].amazonOpenSearchParameters;
    expect(alternateParameter.domain).toBe('AmazonOpenSearchParametersDomain');
  });

  test(`import a ${Mock.getDataSourceType(Mock.DATA_SOURCE_ID_ATHENA)} data source`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSource = DataSource.fromId(stack, 'ImportedDataSource', Mock.DATA_SOURCE_ID_ATHENA);

    // THEN
    let parameter: any = dataSource.dataSourceParameters?.athenaParameters;
    expect(parameter.workGroup).toBe('primary');

    let alternateParameter: any = dataSource.alternateDataSourceParameters?.[0].athenaParameters;
    expect(alternateParameter.workGroup).toBe('primary');
  });

  test(`import a ${Mock.getDataSourceType(Mock.DATA_SOURCE_ID_AURORA)} data source`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSource = DataSource.fromId(stack, 'ImportedDataSource', Mock.DATA_SOURCE_ID_AURORA);

    // THEN
    let parameter: any = dataSource.dataSourceParameters?.auroraParameters;
    expect(parameter.database).toBe('AuroraParametersDatabase');

    let alternateParameter: any = dataSource.alternateDataSourceParameters?.[0].auroraParameters;
    expect(alternateParameter.database).toBe('AuroraParametersDatabase');
  });

  test(`import a ${Mock.getDataSourceType(Mock.DATA_SOURCE_ID_AURORA_POSTGRESQL)} data source`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSource = DataSource.fromId(stack, 'ImportedDataSource', Mock.DATA_SOURCE_ID_AURORA_POSTGRESQL);

    // THEN
    let parameter: any = dataSource.dataSourceParameters?.auroraPostgreSqlParameters;
    expect(parameter.database).toBe('AuroraPostgreSqlParametersDatabase');

    let alternateParameter: any = dataSource.alternateDataSourceParameters?.[0].auroraPostgreSqlParameters;
    expect(alternateParameter.database).toBe('AuroraPostgreSqlParametersDatabase');
  });

  test(`import a ${Mock.getDataSourceType(Mock.DATA_SOURCE_ID_MARIADB)} data source`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSource = DataSource.fromId(stack, 'ImportedDataSource', Mock.DATA_SOURCE_ID_MARIADB);

    // THEN
    let parameter: any = dataSource.dataSourceParameters?.mariaDbParameters;
    expect(parameter.database).toBe('MariaDbParametersDatabase');

    let alternateParameter: any = dataSource.alternateDataSourceParameters?.[0].mariaDbParameters;
    expect(alternateParameter.database).toBe('MariaDbParametersDatabase');
  });

  test(`import a ${Mock.getDataSourceType(Mock.DATA_SOURCE_ID_MYSQL)} data source`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSource = DataSource.fromId(stack, 'ImportedDataSource', Mock.DATA_SOURCE_ID_MYSQL);

    // THEN
    let parameter: any = dataSource.dataSourceParameters?.mySqlParameters;
    expect(parameter.database).toBe('MySqlParametersDatabase');

    let alternateParameter: any = dataSource.alternateDataSourceParameters?.[0].mySqlParameters;
    expect(alternateParameter.database).toBe('MySqlParametersDatabase');
  });

  test(`import a ${Mock.getDataSourceType(Mock.DATA_SOURCE_ID_ORACLE)} data source`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSource = DataSource.fromId(stack, 'ImportedDataSource', Mock.DATA_SOURCE_ID_ORACLE);

    // THEN
    let parameter: any = dataSource.dataSourceParameters?.oracleParameters;
    expect(parameter.database).toBe('OracleParametersDatabase');

    let alternateParameter: any = dataSource.alternateDataSourceParameters?.[0].oracleParameters;
    expect(alternateParameter.database).toBe('OracleParametersDatabase');
  });

  test(`import a ${Mock.getDataSourceType(Mock.DATA_SOURCE_ID_POSTGRESQL)} data source`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSource = DataSource.fromId(stack, 'ImportedDataSource', Mock.DATA_SOURCE_ID_POSTGRESQL);

    // THEN
    let parameter: any = dataSource.dataSourceParameters?.postgreSqlParameters;
    expect(parameter.database).toBe('PostgreSqlParametersDatabase');

    let alternateParameter: any = dataSource.alternateDataSourceParameters?.[0].postgreSqlParameters;
    expect(alternateParameter.database).toBe('PostgreSqlParametersDatabase');
  });

  test(`import a ${Mock.getDataSourceType(Mock.DATA_SOURCE_ID_PRESTO)} data source`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSource = DataSource.fromId(stack, 'ImportedDataSource', Mock.DATA_SOURCE_ID_PRESTO);

    // THEN
    let parameter: any = dataSource.dataSourceParameters?.prestoParameters;
    expect(parameter.catalog).toBe('PrestoParametersCatalog');

    let alternateParameter: any = dataSource.alternateDataSourceParameters?.[0].prestoParameters;
    expect(alternateParameter.catalog).toBe('PrestoParametersCatalog');
  });

  test(`import a ${Mock.getDataSourceType(Mock.DATA_SOURCE_ID_RDS)} data source`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSource = DataSource.fromId(stack, 'ImportedDataSource', Mock.DATA_SOURCE_ID_RDS);

    // THEN
    let parameter: any = dataSource.dataSourceParameters?.rdsParameters;
    expect(parameter.database).toBe('RdsParametersDatabase');

    let alternateParameter: any = dataSource.alternateDataSourceParameters?.[0].rdsParameters;
    expect(alternateParameter.database).toBe('RdsParametersDatabase');
  });

  test(`import a ${Mock.getDataSourceType(Mock.DATA_SOURCE_ID_REDSHIFT)} data source`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSource = DataSource.fromId(stack, 'ImportedDataSource', Mock.DATA_SOURCE_ID_REDSHIFT);

    // THEN
    let parameter: any = dataSource.dataSourceParameters?.redshiftParameters;
    expect(parameter.database).toBe('RedshiftParametersDatabase');

    let alternateParameter: any = dataSource.alternateDataSourceParameters?.[0].redshiftParameters;
    expect(alternateParameter.database).toBe('RedshiftParametersDatabase');
  });

  test(`import a ${Mock.getDataSourceType(Mock.DATA_SOURCE_ID_S3)} data source`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSource = DataSource.fromId(stack, 'ImportedDataSource', Mock.DATA_SOURCE_ID_S3);

    // THEN
    let parameter: any = dataSource.dataSourceParameters?.s3Parameters;
    expect(parameter.manifestFileLocation.bucket).toBe('TestBucket');

    let alternateParameter: any = dataSource.alternateDataSourceParameters?.[0].s3Parameters;
    expect(alternateParameter.manifestFileLocation.bucket).toBe('TestBucket');
  });

  test(`import a ${Mock.getDataSourceType(Mock.DATA_SOURCE_ID_SNOWFLAKE)} data source`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSource = DataSource.fromId(stack, 'ImportedDataSource', Mock.DATA_SOURCE_ID_SNOWFLAKE);

    // THEN
    let parameter: any = dataSource.dataSourceParameters?.snowflakeParameters;
    expect(parameter.database).toBe('SnowflakeParametersDatabase');

    let alternateParameter: any = dataSource.alternateDataSourceParameters?.[0].snowflakeParameters;
    expect(alternateParameter.database).toBe('SnowflakeParametersDatabase');
  });

  test(`import a ${Mock.getDataSourceType(Mock.DATA_SOURCE_ID_SPARK)} data source`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSource = DataSource.fromId(stack, 'ImportedDataSource', Mock.DATA_SOURCE_ID_SPARK);

    // THEN
    let parameter: any = dataSource.dataSourceParameters?.sparkParameters;
    expect(parameter.host).toBe('SparkParametersHost');

    let alternateParameter: any = dataSource.alternateDataSourceParameters?.[0].sparkParameters;
    expect(alternateParameter.host).toBe('SparkParametersHost');
  });

  test(`import a ${Mock.getDataSourceType(Mock.DATA_SOURCE_ID_SQLSERVER)} data source`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSource = DataSource.fromId(stack, 'ImportedDataSource', Mock.DATA_SOURCE_ID_SQLSERVER);

    // THEN
    let parameter: any = dataSource.dataSourceParameters?.sqlServerParameters;
    expect(parameter.database).toBe('SqlServerParametersDatabase');

    let alternateParameter: any = dataSource.alternateDataSourceParameters?.[0].sqlServerParameters;
    expect(alternateParameter.database).toBe('SqlServerParametersDatabase');
  });

  test(`import a ${Mock.getDataSourceType(Mock.DATA_SOURCE_ID_TERADATA)} data source`, () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSource = DataSource.fromId(stack, 'ImportedDataSource', Mock.DATA_SOURCE_ID_TERADATA);

    // THEN
    let parameter: any = dataSource.dataSourceParameters?.teradataParameters;
    expect(parameter.database).toBe('TeradataParametersDatabase');

    let alternateParameter: any = dataSource.alternateDataSourceParameters?.[0].teradataParameters;
    expect(alternateParameter.database).toBe('TeradataParametersDatabase');
  });

  // General tests
  test('fromId', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSource = DataSource.fromId(stack, 'ImportedDataSource', Mock.DATA_SOURCE_ID_AURORA);

    // THEN
    expect(dataSource.resourceId).toBe(Mock.DATA_SOURCE_ID_AURORA);
    expect(dataSource.dataSourceArn).toContain('arn');
    expect(dataSource.dataSourceName).toBe('DataSourceName');
    expect(dataSource.tags?.[0].key).toBe('ResourceArn');
    expect(dataSource.permissions?.[0].principal).toBe('DataSourcePermissionsPrincipal');
    expect(dataSource.errorInfo?.message).toBe('Error message');
    expect(dataSource.vpcConnectionProperties?.vpcConnectionArn).toContain('arn');
    expect(dataSource.sslProperties).toBeUndefined();
    expect(dataSource.type).toBe(Mock.getDataSourceType(Mock.DATA_SOURCE_ID_AURORA));
    expect(dataSource.credentialsSecret).toContain('arn');
  });

  test('newDataSource', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let dataSource = new DataSource(stack, 'TestDashboard', {
      resourceId: 'TestId',
      dataSourceName: 'TestName',
      type: 'ATHENA',
      dataSourceParameters: {
        athenaParameters: {
          workGroup: 'WorkGroup',
        },
      },
    });

    // THEN
    expect(dataSource.resourceId).toBe('TestId');
    expect(dataSource.dataSourceArn).toContain('arn');
  });

});