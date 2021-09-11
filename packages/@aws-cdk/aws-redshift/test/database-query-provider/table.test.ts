/* eslint-disable-next-line import/no-unresolved */
import type * as AWSLambda from 'aws-lambda';

const tableNamePrefix = 'tableNamePrefix';
const tableColumns = [{ name: 'col1', dataType: 'varchar(1)' }];
const clusterName = 'clusterName';
const adminUserArn = 'adminUserArn';
const databaseName = 'databaseName';
const physicalResourceId = 'PhysicalResourceId';
const resourceProperties = {
  tableName: {
    prefix: tableNamePrefix,
    generateSuffix: true,
  },
  tableColumns,
  clusterName,
  adminUserArn,
  databaseName,
  ServiceToken: '',
};
const requestId = 'requestId';
const requestIdTruncated = 'requestI';
const genericEvent: AWSLambda.CloudFormationCustomResourceEventCommon = {
  ResourceProperties: resourceProperties,
  ServiceToken: '',
  ResponseURL: '',
  StackId: '',
  RequestId: requestId,
  LogicalResourceId: '',
  ResourceType: '',
};

const mockExecuteStatement = jest.fn(() => ({ promise: jest.fn(() => ({ Id: 'statementId' })) }));
jest.mock('aws-sdk/clients/redshiftdata', () => class {
  executeStatement = mockExecuteStatement;
  describeStatement = () => ({ promise: jest.fn(() => ({ Status: 'FINISHED' })) });
});
import { handler as manageTable } from '../../lib/private/database-query-provider/table';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('create', () => {
  const baseEvent: AWSLambda.CloudFormationCustomResourceCreateEvent = {
    RequestType: 'Create',
    ...genericEvent,
  };

  test('serializes properties in statement and creates physical resource ID', async () => {
    const event = baseEvent;

    await expect(manageTable(resourceProperties, event)).resolves.toEqual({
      PhysicalResourceId: `${tableNamePrefix}${requestIdTruncated}`,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `CREATE TABLE ${tableNamePrefix}${requestIdTruncated} (col1 varchar(1))`,
    }));
  });

  test('does not modify table name if no suffix generation requested', async () => {
    const event = baseEvent;
    const newResourceProperties = {
      ...resourceProperties,
      tableName: {
        ...resourceProperties.tableName,
        generateSuffix: false,
      },
    };

    await expect(manageTable(newResourceProperties, event)).resolves.toEqual({
      PhysicalResourceId: tableNamePrefix,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `CREATE TABLE ${tableNamePrefix} (col1 varchar(1))`,
    }));
  });
});

describe('delete', () => {
  const baseEvent: AWSLambda.CloudFormationCustomResourceDeleteEvent = {
    RequestType: 'Delete',
    PhysicalResourceId: physicalResourceId,
    ...genericEvent,
  };

  test('executes statement', async () => {
    const event = baseEvent;

    await manageTable(resourceProperties, event);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `DROP TABLE ${physicalResourceId}`,
    }));
  });
});

describe('update', () => {
  const event: AWSLambda.CloudFormationCustomResourceUpdateEvent = {
    RequestType: 'Update',
    OldResourceProperties: resourceProperties,
    PhysicalResourceId: physicalResourceId,
    ...genericEvent,
  };

  test('replaces if cluster name changes', async () => {
    const newClusterName = 'newClusterName';
    const newResourceProperties = {
      ...resourceProperties,
      clusterName: newClusterName,
    };

    await expect(manageTable(newResourceProperties, event)).resolves.not.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      ClusterIdentifier: newClusterName,
      Sql: expect.stringMatching(new RegExp(`CREATE TABLE ${tableNamePrefix}${requestIdTruncated}`)),
    }));
  });

  test('does not replace if admin user ARN changes', async () => {
    const newAdminUserArn = 'newAdminUserArn';
    const newResourceProperties = {
      ...resourceProperties,
      adminUserArn: newAdminUserArn,
    };

    await expect(manageTable(newResourceProperties, event)).resolves.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).not.toHaveBeenCalled();
  });

  test('replaces if database name changes', async () => {
    const newDatabaseName = 'newDatabaseName';
    const newResourceProperties = {
      ...resourceProperties,
      databaseName: newDatabaseName,
    };

    await expect(manageTable(newResourceProperties, event)).resolves.not.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Database: newDatabaseName,
      Sql: expect.stringMatching(new RegExp(`CREATE TABLE ${tableNamePrefix}${requestIdTruncated}`)),
    }));
  });

  test('replaces if table name changes', async () => {
    const newTableNamePrefix = 'newTableNamePrefix';
    const newResourceProperties = {
      ...resourceProperties,
      tableName: {
        ...resourceProperties.tableName,
        prefix: newTableNamePrefix,
      },
    };

    await expect(manageTable(newResourceProperties, event)).resolves.not.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: expect.stringMatching(new RegExp(`CREATE TABLE ${newTableNamePrefix}${requestIdTruncated}`)),
    }));
  });

  test('replaces if table columns change', async () => {
    const newTableColumnName = 'col2';
    const newTableColumnDataType = 'varchar(1)';
    const newTableColumns = [{ name: newTableColumnName, dataType: newTableColumnDataType }];
    const newResourceProperties = {
      ...resourceProperties,
      tableColumns: newTableColumns,
    };

    await expect(manageTable(newResourceProperties, event)).resolves.not.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `CREATE TABLE ${tableNamePrefix}${requestIdTruncated} (${newTableColumnName} ${newTableColumnDataType})`,
    }));
  });

  test('does not replace if table columns added', async () => {
    const newTableColumnName = 'col2';
    const newTableColumnDataType = 'varchar(1)';
    const newTableColumns = [{ name: 'col1', dataType: 'varchar(1)' }, { name: newTableColumnName, dataType: newTableColumnDataType }];
    const newResourceProperties = {
      ...resourceProperties,
      tableColumns: newTableColumns,
    };

    await expect(manageTable(newResourceProperties, event)).resolves.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `ALTER TABLE ${physicalResourceId} ADD ${newTableColumnName} ${newTableColumnDataType}`,
    }));
  });
});
