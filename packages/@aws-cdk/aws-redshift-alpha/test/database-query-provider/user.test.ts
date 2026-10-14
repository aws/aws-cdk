
import type * as AWSLambda from 'aws-lambda';

const password = 'password';
const username = 'username';
const passwordSecretArn = 'passwordSecretArn';
const clusterName = 'clusterName';
const adminUserArn = 'adminUserArn';
const databaseName = 'databaseName';
const physicalResourceId = 'PhysicalResourceId';
const resourceProperties = {
  username,
  passwordSecretArn,
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

const mockGetSecretValue = jest.fn(async () => ({
  SecretString: JSON.stringify({ password }),
}));
jest.mock('@aws-sdk/client-secrets-manager', () => ({
  SecretsManager: class {
    getSecretValue = mockGetSecretValue;
  },
}));

import { handler as manageUser } from '../../lib/private/database-query-provider/user';

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

    await expect(manageUser(resourceProperties, event)).resolves.toEqual({
      PhysicalResourceId: 'clusterName:databaseName:username:requestId',
      Data: {
        username: username,
      },
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `CREATE USER username PASSWORD '${password}'`,
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

    await manageUser(resourceProperties, event);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: 'DROP USER username',
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

    await expect(manageUser(newResourceProperties, event)).resolves.not.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      ClusterIdentifier: newClusterName,
      Sql: expect.stringMatching(/CREATE USER/),
    }));
  });

  test('does not replace if admin user ARN changes', async () => {
    const newAdminUserArn = 'newAdminUserArn';
    const newResourceProperties = {
      ...resourceProperties,
      adminUserArn: newAdminUserArn,
    };

    await expect(manageUser(newResourceProperties, event)).resolves.toMatchObject({
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

    await expect(manageUser(newResourceProperties, event)).resolves.not.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Database: newDatabaseName,
      Sql: expect.stringMatching(/CREATE USER/),
    }));
  });

  test('replaces if user name changes', async () => {
    const newUsername = 'newUsername';
    const newResourceProperties = {
      ...resourceProperties,
      username: newUsername,
    };

    await expect(manageUser(newResourceProperties, event)).resolves.not.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: expect.stringMatching(new RegExp(`CREATE USER ${newUsername}`)),
    }));
  });

  test('does not replace if password changes', async () => {
    const newPassword = 'newPassword';
    mockGetSecretValue.mockImplementationOnce(async () => ({ SecretString: JSON.stringify({ password: newPassword }) }));

    await expect(manageUser(resourceProperties, event)).resolves.toMatchObject({
      PhysicalResourceId: physicalResourceId,
    });
    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: expect.stringMatching(new RegExp(`ALTER USER ${username} PASSWORD '${password}'`)),
    }));
  });
});

describe('special-character handling', () => {
  test('quotes the user name and doubles embedded double quotes in CREATE USER', async () => {
    const specialUsername = 'ab"c';
    const event: AWSLambda.CloudFormationCustomResourceCreateEvent = {
      RequestType: 'Create',
      ...genericEvent,
    };
    mockGetSecretValue.mockImplementationOnce(async () => ({ SecretString: JSON.stringify({ password: 'pw' }) }));

    await manageUser({ ...resourceProperties, username: specialUsername }, event);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: 'CREATE USER "ab""c" PASSWORD \'pw\'',
    }));
  });

  test('escapes single quotes in the password literal of CREATE USER', async () => {
    const event: AWSLambda.CloudFormationCustomResourceCreateEvent = {
      RequestType: 'Create',
      ...genericEvent,
    };
    mockGetSecretValue.mockImplementationOnce(async () => ({ SecretString: JSON.stringify({ password: "pa'ss" }) }));

    await manageUser({ ...resourceProperties, username: 'u' }, event);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: 'CREATE USER u PASSWORD \'pa\'\'ss\'',
    }));
  });

  test('quotes the user name in DROP USER', async () => {
    const specialUsername = 'u; x';
    const event: AWSLambda.CloudFormationCustomResourceDeleteEvent = {
      RequestType: 'Delete',
      PhysicalResourceId: physicalResourceId,
      ...genericEvent,
    };

    await manageUser({ ...resourceProperties, username: specialUsername }, event);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: 'DROP USER "u; x"',
    }));
  });

  test('escapes single quotes in the password literal of ALTER USER', async () => {
    const newPassword = "p'q";
    const event: AWSLambda.CloudFormationCustomResourceUpdateEvent = {
      RequestType: 'Update',
      OldResourceProperties: { ...resourceProperties, username: 'u' },
      PhysicalResourceId: physicalResourceId,
      ...genericEvent,
    };
    // First lookup resolves the old password, second resolves the new password.
    mockGetSecretValue.mockImplementationOnce(async () => ({ SecretString: JSON.stringify({ password: 'old' }) }));
    mockGetSecretValue.mockImplementationOnce(async () => ({ SecretString: JSON.stringify({ password: newPassword }) }));

    await manageUser({ ...resourceProperties, username: 'u' }, event);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: 'ALTER USER u PASSWORD \'p\'\'q\'',
    }));
  });

  test('quotes the user name and doubles embedded double quotes in ALTER USER', async () => {
    const properties = { ...resourceProperties, username: 'ab"c' };
    const event: AWSLambda.CloudFormationCustomResourceUpdateEvent = {
      ...genericEvent,
      RequestType: 'Update',
      OldResourceProperties: properties,
      ResourceProperties: properties,
      PhysicalResourceId: physicalResourceId,
    };
    mockGetSecretValue.mockImplementationOnce(async () => ({ SecretString: JSON.stringify({ password: 'old' }) }));
    mockGetSecretValue.mockImplementationOnce(async () => ({ SecretString: JSON.stringify({ password: 'new' }) }));

    await manageUser(properties, event);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: 'ALTER USER "ab""c" PASSWORD \'new\'',
    }));
  });
});

describe('PUBLIC user name', () => {
  const publicSpellings = ['PUBLIC', 'public', 'Public'];

  test.each(publicSpellings)('fails for user name %j on create, before any statement runs', async (username_) => {
    const event: AWSLambda.CloudFormationCustomResourceCreateEvent = {
      RequestType: 'Create',
      ...genericEvent,
    };

    await expect(manageUser({ ...resourceProperties, username: username_ }, event)).rejects.toThrow(/pseudo-role/);
    expect(mockExecuteStatement).not.toHaveBeenCalled();
  });

  test.each([
    ['publıc', 'CREATE USER publıc PASSWORD \'password\''],
    ['PuBlıC', 'CREATE USER PuBlıC PASSWORD \'password\''],
    ['PUBLİC', 'CREATE USER PUBLİC PASSWORD \'password\''],
    ['ＰＵＢＬＩＣ', 'CREATE USER ＰＵＢＬＩＣ PASSWORD \'password\''],
    ['pubℓic', 'CREATE USER pubℓic PASSWORD \'password\''],
  ])('preserves distinct non-ASCII name %s during CREATE', async (username_, expected) => {
    const properties = { ...resourceProperties, username: username_ };
    const event: AWSLambda.CloudFormationCustomResourceCreateEvent = {
      ...genericEvent,
      RequestType: 'Create',
      ResourceProperties: properties,
    };

    await manageUser(properties, event);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({ Sql: expected }));
  });

  test.each([
    ['publıc', 'ALTER USER publıc PASSWORD \'new\''],
    ['PuBlıC', 'ALTER USER PuBlıC PASSWORD \'new\''],
  ])('preserves distinct non-ASCII name %s during password ALTER', async (username_, expected) => {
    const properties = { ...resourceProperties, username: username_ };
    const event: AWSLambda.CloudFormationCustomResourceUpdateEvent = {
      ...genericEvent,
      RequestType: 'Update',
      OldResourceProperties: properties,
      ResourceProperties: properties,
      PhysicalResourceId: physicalResourceId,
    };
    mockGetSecretValue.mockImplementationOnce(async () => ({ SecretString: JSON.stringify({ password: 'old' }) }));
    mockGetSecretValue.mockImplementationOnce(async () => ({ SecretString: JSON.stringify({ password: 'new' }) }));

    await manageUser(properties, event);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({ Sql: expected }));
  });

  test('drops the user on delete rather than refusing', async () => {
    const event: AWSLambda.CloudFormationCustomResourceDeleteEvent = {
      RequestType: 'Delete',
      PhysicalResourceId: physicalResourceId,
      ...genericEvent,
    };

    await manageUser({ ...resourceProperties, username: 'PUBLIC' }, event);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: 'DROP USER PUBLIC',
    }));
  });

  test('emits a padded spelling as a quoted identifier', async () => {
    const event: AWSLambda.CloudFormationCustomResourceCreateEvent = {
      RequestType: 'Create',
      ...genericEvent,
    };

    await manageUser({ ...resourceProperties, username: ' PUBLIC ' }, event);

    expect(mockExecuteStatement).toHaveBeenCalledWith(expect.objectContaining({
      Sql: `CREATE USER " PUBLIC " PASSWORD '${password}'`,
    }));
  });

  test('fails for user name PUBLIC on update, before any statement runs', async () => {
    const event: AWSLambda.CloudFormationCustomResourceUpdateEvent = {
      RequestType: 'Update',
      OldResourceProperties: { ...resourceProperties, username: 'oldUsername' },
      PhysicalResourceId: physicalResourceId,
      ...genericEvent,
    };

    await expect(manageUser({ ...resourceProperties, username: 'PUBLIC' }, event)).rejects.toThrow(/pseudo-role/);
    expect(mockExecuteStatement).not.toHaveBeenCalled();
  });

  test('fails for user name PUBLIC when only the password changes, before any statement runs', async () => {
    const event: AWSLambda.CloudFormationCustomResourceUpdateEvent = {
      RequestType: 'Update',
      OldResourceProperties: { ...resourceProperties, username: 'PUBLIC' },
      PhysicalResourceId: physicalResourceId,
      ...genericEvent,
    };
    mockGetSecretValue.mockImplementationOnce(async () => ({ SecretString: JSON.stringify({ password: 'old' }) }));
    mockGetSecretValue.mockImplementationOnce(async () => ({ SecretString: JSON.stringify({ password: 'new' }) }));

    await expect(manageUser({ ...resourceProperties, username: 'PUBLIC' }, event)).rejects.toThrow(/pseudo-role/);
    expect(mockExecuteStatement).not.toHaveBeenCalled();
  });
});
