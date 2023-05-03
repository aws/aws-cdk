/* eslint-disable-next-line import/no-unresolved */
import type * as AWSLambda from 'aws-lambda';
import { AccessorType } from '../../lib/private/handler-props';

const accessor = { accessorType: AccessorType.USER, name: 'username' };
const tableName = 'tableName';
const tablePrivileges = [{ tableName, actions: ['INSERT', 'SELECT'] }];
const clusterName = 'clusterName';
const adminUserArn = 'adminUserArn';
const databaseName = 'databaseName';
const physicalResourceId = 'PhysicalResourceId';
const resourceProperties = {
  accessor,
  tablePrivileges,
  clusterName,
  adminUserArn,
  databaseName,
  ServiceToken: '',
};
const requestId = 'requestId';
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
import { handler as managePrivileges } from '../../lib/private/database-query-provider/privileges';

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

    await expect(managePrivileges(resourceProperties, event)).resolves.toEqual({
      PhysicalResourceId: 'clusterName:databaseName:username:requestId',
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `GRANT INSERT, SELECT ON ${tableName} TO ${accessor.name}`,
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

    await managePrivileges(resourceProperties, event);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `REVOKE INSERT, SELECT ON ${tableName} FROM ${accessor.name}`,
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

    await expect(managePrivileges(newResourceProperties, event)).resolves.not.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      ClusterIdentifier: newClusterName,
      Sql: expect.stringMatching(/GRANT/),
    }));
  });

  test('does not replace if admin user ARN changes', async () => {
    const newAdminUserArn = 'newAdminUserArn';
    const newResourceProperties = {
      ...resourceProperties,
      adminUserArn: newAdminUserArn,
    };

    await expect(managePrivileges(newResourceProperties, event)).resolves.toMatchObject({
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

    await expect(managePrivileges(newResourceProperties, event)).resolves.not.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Database: newDatabaseName,
      Sql: expect.stringMatching(/GRANT/),
    }));
  });

  test('replaces if accessor changes', async () => {
    const newAccessor = { accessorType: AccessorType.USER, name: 'newUsername' };
    const newResourceProperties = {
      ...resourceProperties,
      accessor: newAccessor,
    };

    await expect(managePrivileges(newResourceProperties, event)).resolves.not.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: expect.stringMatching(new RegExp(`GRANT .* TO ${newAccessor.name}`)),
    }));
  });

  test('replaces if accessor type changes', async () => {
    const newAccessor = { accessorType: AccessorType.USER_GROUP, name: 'newGroupName' };
    const newResourceProperties = {
      ...resourceProperties,
      accessor: newAccessor,
    };

    await expect(managePrivileges(newResourceProperties, event)).resolves.not.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: expect.stringMatching(new RegExp(`GRANT .* TO GROUP ${newAccessor.name}`)),
    }));
  });

  test('does not replace when privileges change', async () => {
    const newTableName = 'newTableName';
    const newTablePrivileges = [{ tableName: newTableName, actions: ['DROP'] }];
    const newResourceProperties = {
      ...resourceProperties,
      tablePrivileges: newTablePrivileges,
    };

    await expect(managePrivileges(newResourceProperties, event)).resolves.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `REVOKE INSERT, SELECT ON ${tableName} FROM ${accessor.name}`,
    }));
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `GRANT DROP ON ${newTableName} TO ${accessor.name}`,
    }));
  });

  test('replaces when upgrading from username to accessor', async () => {
    const oldUsername = 'oldUsername';
    const newEvent = {
      ...event,
      OldResourceProperties: {
        ...resourceProperties,
        accessor: undefined,
        username: oldUsername,
      },
    };

    await expect(managePrivileges(resourceProperties, newEvent)).resolves.not.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: expect.stringMatching(new RegExp(`GRANT .* TO ${accessor.name}`)),
    }));
  });
});
