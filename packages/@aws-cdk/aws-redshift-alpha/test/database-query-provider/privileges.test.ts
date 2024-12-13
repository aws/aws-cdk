/* eslint-disable-next-line import/no-unresolved */
import type * as AWSLambda from 'aws-lambda';

const username = 'username';
const tableName = 'tableName';
const tableId = 'tableId';
const actions = ['INSERT', 'SELECT'];
const tablePrivileges = [{ tableId, tableName, actions }];
const clusterName = 'clusterName';
const adminUserArn = 'adminUserArn';
const databaseName = 'databaseName';
const physicalResourceId = 'PhysicalResourceId';
const resourceProperties = {
  username,
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

const mockExecuteStatement = jest.fn(async () => ({ Id: 'statementId' }));
jest.mock('@aws-sdk/client-redshift-data', () => {
  return {
    RedshiftData: class {
      executeStatement = mockExecuteStatement;
      describeStatement = jest.fn(async () => ({ Status: 'FINISHED' }));
    },
  };
});

import { handler as managePrivileges } from '../../lib/private/database-query-provider/privileges';
import { makePhysicalId } from '../../lib/private/database-query-provider/util';

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
      Sql: `GRANT INSERT, SELECT ON ${tableName} TO ${username}`,
    }));
  });

  test('serializes properties in statement when tableName in physical resource ID', async () => {
    const properties = {
      ...resourceProperties,
      tablePrivileges: [{
        tableId,
        tableName: `${makePhysicalId(tableName, resourceProperties, requestId)}`,
        actions,
      }],
    };

    const event = {
      ...baseEvent,
      ResourceProperties: properties,
      StackId: 'xxxxx:' + requestId,
    };

    await expect(managePrivileges(properties, event)).resolves.toEqual({
      PhysicalResourceId: 'clusterName:databaseName:username:requestId',
    });

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `GRANT INSERT, SELECT ON ${tableName} TO ${username}`,
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
      Sql: `REVOKE INSERT, SELECT ON ${tableName} FROM ${username}`,
    }));
  });

  test('serializes properties in statement when tableName in physical resource ID', async () => {
    const properties = {
      ...resourceProperties,
      tablePrivileges: [{
        tableId,
        tableName: `${makePhysicalId(tableName, resourceProperties, requestId)}`,
        actions,
      }],
    };

    const event = {
      ...baseEvent,
      ResourceProperties: properties,
      StackId: 'xxxxx:' + requestId,
    };

    await managePrivileges(properties, event);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `REVOKE INSERT, SELECT ON ${tableName} FROM ${username}`,
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

  test('replaces if user name changes', async () => {
    const newUsername = 'newUsername';
    const newResourceProperties = {
      ...resourceProperties,
      username: newUsername,
    };

    await expect(managePrivileges(newResourceProperties, event)).resolves.not.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: expect.stringMatching(new RegExp(`GRANT .* TO ${newUsername}`)),
    }));
  });

  test('does not replace when table name is changed', async () => {
    const newTableName = 'newTableName';
    const newTablePrivileges = [{ tableId, tableName: newTableName, actions }];
    const newResourceProperties = {
      ...resourceProperties,
      tablePrivileges: newTablePrivileges,
    };

    // Checking if the table resource has not been recreated
    await expect(managePrivileges(newResourceProperties, event)).resolves.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    // Upon a table name change, Redshift maintains the same table priviliges as before.
    // The name of the table has changed, a new table has not been created.
    // Therefore 'REVOKE' statements should not be used.
    expect(mockExecuteStatement).not.toHaveBeenCalledWith(expect.objectContaining({
      Sql: `REVOKE INSERT, SELECT ON ${newTableName} FROM ${username}`,
    }));
    // Likewise, here the table name has changed, so the current priviliges will still be intact.
    expect(mockExecuteStatement).not.toHaveBeenCalledWith(expect.objectContaining({
      Sql: expect.stringMatching(new RegExp(`.+ ON ${tableName} TO ${username}`)),
    }));
  });

  test('does not replace when table actions are changed', async () => {
    const newTablePrivileges = [{ tableId, tableName, actions: ['DROP'] }];
    const newResourceProperties = {
      ...resourceProperties,
      tablePrivileges: newTablePrivileges,
    };

    // Checking if the table resource has not been recreated
    await expect(managePrivileges(newResourceProperties, event)).resolves.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    // Old actions are REVOKED, as they are not included in the list
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `REVOKE INSERT, SELECT ON ${tableName} FROM ${username}`,
    }));
    // New actions are GRANTED, as they are included in the list
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `GRANT DROP ON ${tableName} TO ${username}`,
    }));
  });

  test('does not replace when table id is changed', async () => {
    const newTableId = 'newTableId';
    const newTablePrivileges = [{ tableId: newTableId, tableName, actions }];
    const newResourceProperties = {
      ...resourceProperties,
      tablePrivileges: newTablePrivileges,
    };

    // Checking if the table resource has not been recreated, we are not changing on table id either.
    // Due to the construct only needing to be changed on a new user, not a new table
    await expect(managePrivileges(newResourceProperties, event)).resolves.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    // Upon removal of the old table, the priviliges will also be revoked automatically,
    // as the table no longer exists.
    // Calling REVOKE statments on a non-existing table will throw errors by Redshift
    expect(mockExecuteStatement).not.toHaveBeenCalledWith(expect.objectContaining({
      Sql: expect.stringMatching(new RegExp(`REVOKE .+ ON ${tableName} FROM ${username}`)),
    }));
    // Adds the permissions onto the newly created table
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: expect.stringMatching(new RegExp(`GRANT .+ ON ${tableName} TO ${username}`)),
    }));
  });

  test('does not replace when table id is appended', async () => {
    const newTablePrivileges = [{ tableId: 'newTableId', tableName, actions }];
    const newResourceProperties = {
      ...resourceProperties,
      tablePrivileges: newTablePrivileges,
    };

    const newEvent = {
      ...event,
      OldResourceProperties: {
        ...event.OldResourceProperties,
        tablePrivileges: [{ tableName, actions }],
      },
    };

    // Checking if the table resource has not been recreated
    await expect(managePrivileges(newResourceProperties, newEvent)).resolves.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    // Upon initial deployment from non table id usage to table id usage,
    // permissions would not need to be granted/revoked, as the table should already exist
    expect(mockExecuteStatement).not.toHaveBeenCalledWith(expect.objectContaining({
      Sql: expect.stringMatching(new RegExp(`.+ ON ${tableName} FROM ${username}`)),
    }));
  });

  test('serializes properties in grant statement when tableName in physical resource ID', async () => {
    const properties = {
      ...resourceProperties,
      tablePrivileges: [{
        tableId,
        tableName: `${makePhysicalId(tableName, resourceProperties, requestId)}`,
        actions,
      }],
    };

    const newEvent = {
      ...event,
      ResourceProperties: properties,
      StackId: 'xxxxx:' + requestId,
    };

    await managePrivileges(properties, newEvent);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `GRANT INSERT, SELECT ON ${tableName} TO ${username}`,
    }));
  });

  test('serializes properties in drop statement when tableName in physical resource ID', async () => {
    const properties = {
      ...resourceProperties,
      tablePrivileges: [{
        tableId,
        tableName: `${makePhysicalId(tableName, resourceProperties, requestId)}`,
        actions: ['DROP'],
      }],
    };

    const newEvent = {
      ...event,
      ResourceProperties: properties,
      StackId: 'xxxxx:' + requestId,
    };

    await managePrivileges(properties, newEvent);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `REVOKE INSERT, SELECT ON ${tableName} FROM ${username}`,
    }));
  });
});
