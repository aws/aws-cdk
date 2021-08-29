/* eslint-disable-next-line import/no-unresolved */
import type * as AWSLambda from 'aws-lambda';

const mockExecuteStatement = jest.fn(() => ({ promise: jest.fn(() => ({ Id: 'statementId' })) }));
jest.mock('aws-sdk/clients/redshiftdata', () => class {
  executeStatement = mockExecuteStatement;
  describeStatement = () => ({ promise: jest.fn(() => ({ Status: 'FINISHED' })) });
});
import { handler as createTable } from '../../lib/database-query-provider/create-table';

const tableName = 'tableName';
const tableColumns = JSON.stringify([{ name: 'col1', dataType: 'varchar(1)' }]);
const clusterName = 'clusterName';
const adminUserArn = 'adminUserArn';
const databaseName = 'databaseName';
const physicalResourceId = 'PhysicalResourceId';
const resourceProperties = {
  tableName,
  tableColumns,
  clusterName,
  adminUserArn,
  databaseName,
  ServiceToken: '',
};
const genericEvent: AWSLambda.CloudFormationCustomResourceEventCommon = {
  ResourceProperties: resourceProperties,
  ServiceToken: '',
  ResponseURL: '',
  StackId: '',
  RequestId: '',
  LogicalResourceId: '',
  ResourceType: '',
};

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

    await expect(createTable(event)).resolves.toEqual({
      PhysicalResourceId: expect.stringMatching(/clusterName:databaseName:tableName:/),
      Data: {
        tableName,
      },
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: 'CREATE TABLE tableName (col1 varchar(1))',
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

    await createTable(event);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: 'DROP TABLE tableName',
    }));
  });
});

describe('update', () => {
  const baseEvent: AWSLambda.CloudFormationCustomResourceUpdateEvent = {
    RequestType: 'Update',
    OldResourceProperties: resourceProperties,
    PhysicalResourceId: physicalResourceId,
    ...genericEvent,
  };

  test('replaces if cluster name changes', async () => {
    const newClusterName = 'newClusterName';
    const event = {
      ...baseEvent,
      ResourceProperties: {
        ...baseEvent.ResourceProperties,
        clusterName: newClusterName,
      },
    };

    await expect(createTable(event)).resolves.not.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      ClusterIdentifier: newClusterName,
      Sql: expect.stringMatching(/CREATE TABLE/),
    }));
  });

  test('does not replace if admin user ARN changes', async () => {
    const newAdminUserArn = 'newAdminUserArn';
    const event = {
      ...baseEvent,
      ResourceProperties: {
        ...baseEvent.ResourceProperties,
        adminUserArn: newAdminUserArn,
      },
    };

    await expect(createTable(event)).resolves.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).not.toHaveBeenCalled();
  });

  test('replaces if database name changes', async () => {
    const newDatabaseName = 'newDatabaseName';
    const event = {
      ...baseEvent,
      ResourceProperties: {
        ...baseEvent.ResourceProperties,
        databaseName: newDatabaseName,
      },
    };

    await expect(createTable(event)).resolves.not.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Database: newDatabaseName,
      Sql: expect.stringMatching(/CREATE TABLE/),
    }));
  });

  test('replaces if table name changes', async () => {
    const newTableName = 'newTableName';
    const event = {
      ...baseEvent,
      ResourceProperties: {
        ...baseEvent.ResourceProperties,
        tableName: newTableName,
      },
    };

    await expect(createTable(event)).resolves.not.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: expect.stringMatching(new RegExp(`CREATE TABLE ${newTableName}`)),
    }));
  });

  test('replaces if table columns change', async () => {
    const newTableColumnName = 'col2';
    const newTableColumnDataType = 'varchar(1)';
    const newTableColumns = JSON.stringify([{ name: newTableColumnName, dataType: newTableColumnDataType }]);
    const event = {
      ...baseEvent,
      ResourceProperties: {
        ...baseEvent.ResourceProperties,
        tableColumns: newTableColumns,
      },
    };

    await expect(createTable(event)).resolves.not.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `CREATE TABLE ${tableName} (${newTableColumnName} ${newTableColumnDataType})`,
    }));
  });

  test('does not replace if table columns added', async () => {
    const newTableColumnName = 'col2';
    const newTableColumnDataType = 'varchar(1)';
    const newTableColumns = JSON.stringify([{ name: 'col1', dataType: 'varchar(1)' }, { name: newTableColumnName, dataType: newTableColumnDataType }]);
    const event = {
      ...baseEvent,
      ResourceProperties: {
        ...baseEvent.ResourceProperties,
        tableColumns: newTableColumns,
      },
    };

    await expect(createTable(event)).resolves.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `ALTER TABLE ${tableName} ADD ${newTableColumnName} ${newTableColumnDataType}`,
    }));
  });
});
