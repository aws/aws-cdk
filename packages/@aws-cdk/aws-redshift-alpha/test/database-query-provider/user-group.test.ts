/* eslint-disable-next-line import/no-unresolved */
import type * as AWSLambda from 'aws-lambda';

const groupName = 'groupName';
const users = ['username'];
const clusterName = 'clusterName';
const adminUserArn = 'adminUserArn';
const databaseName = 'databaseName';
const physicalResourceId = 'PhysicalResourceId';
const resourceProperties = {
  groupName,
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
import { handler as manageUserGroup } from '../../lib/private/database-query-provider/user-group';

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
    const newResourceProperties = {
      ...resourceProperties,
    };

    await expect(manageUserGroup(newResourceProperties, event)).resolves.toEqual({
      PhysicalResourceId: 'clusterName:databaseName:groupName:requestId',
      Data: { groupName },
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `CREATE GROUP ${groupName}`,
    }));
  });

  test('serializes properties in statement and creates physical resource ID with user', async () => {
    const event = baseEvent;
    const newResourceProperties = {
      ...resourceProperties,
      users,
    };

    await expect(manageUserGroup(newResourceProperties, event)).resolves.toEqual({
      PhysicalResourceId: 'clusterName:databaseName:groupName:requestId',
      Data: { groupName },
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `CREATE GROUP ${groupName} WITH USER username`,
    }));
  });

  test('serializes properties in statement and creates physical resource ID with multiple users', async () => {
    const event = baseEvent;
    const newResourceProperties = {
      ...resourceProperties,
      users: [...users, 'username2'],
    };

    await expect(manageUserGroup(newResourceProperties, event)).resolves.toEqual({
      PhysicalResourceId: 'clusterName:databaseName:groupName:requestId',
      Data: { groupName },
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `CREATE GROUP ${groupName} WITH USER username, username2`,
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

    await manageUserGroup(resourceProperties, event);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `DROP GROUP ${groupName}`,
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

    await expect(manageUserGroup(newResourceProperties, event)).resolves.toMatchObject({
      PhysicalResourceId: `${newClusterName}:${databaseName}:${groupName}:${requestId}`,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      ClusterIdentifier: newClusterName,
      Sql: expect.stringMatching(/CREATE GROUP/),
    }));
  });

  test('does not replace if admin user ARN changes', async () => {
    const newAdminUserArn = 'newAdminUserArn';
    const newResourceProperties = {
      ...resourceProperties,
      adminUserArn: newAdminUserArn,
    };

    await expect(manageUserGroup(newResourceProperties, event)).resolves.toMatchObject({
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

    await expect(manageUserGroup(newResourceProperties, event)).resolves.toMatchObject({
      PhysicalResourceId: `${clusterName}:${newDatabaseName}:${groupName}:${requestId}`,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Database: newDatabaseName,
      Sql: expect.stringMatching(/CREATE GROUP/),
    }));
  });

  test('replaces if group name changes', async () => {
    const newGroupName = 'newGroupName';
    const newResourceProperties = {
      ...resourceProperties,
      groupName: newGroupName,
    };

    await expect(manageUserGroup(newResourceProperties, event)).resolves.toMatchObject({
      PhysicalResourceId: `${clusterName}:${databaseName}:${newGroupName}:${requestId}`,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `CREATE GROUP ${newGroupName}`,
    }));
  });

  test('replaces if users changes', async () => {
    const newUsers = ['newUsername'];
    const newResourceProperties = {
      ...resourceProperties,
      users: newUsers,
    };

    await expect(manageUserGroup(newResourceProperties, event)).resolves.not.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `CREATE GROUP ${groupName} WITH USER newUsername`,
    }));
  });
});