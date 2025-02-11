import { GetResourceCommand, ListResourcesCommand } from '@aws-sdk/client-cloudcontrol';
import { CcApiContextProviderPlugin } from '../../lib/context-providers/cc-api-provider';
import { mockCloudControlClient, MockSdkProvider, restoreSdkMocksToDefault } from '../util/mock-sdk';

let provider: CcApiContextProviderPlugin;

beforeEach(() => {
  provider = new CcApiContextProviderPlugin(new MockSdkProvider());
  restoreSdkMocksToDefault();
});

/* eslint-disable */
test('looks up RDS instance using CC API getResource', async () => {
  // GIVEN
  mockCloudControlClient.on(GetResourceCommand).resolves({
    TypeName: 'AWS::RDS::DBInstance',
    ResourceDescription: {
      Identifier: 'my-db-instance-1',
      Properties: '{"DBInstanceArn":"arn:aws:rds:us-east-1:123456789012:db:test-instance-1","StorageEncrypted":"true"}',
    },
  });

  // WHEN
  const results = await provider.getValue({
    account: '123456789012',
    region: 'us-east-1',
    typeName: 'AWS::RDS::DBInstance',
    exactIdentifier: 'my-db-instance-1',
    propertiesToReturn: ['DBInstanceArn', 'StorageEncrypted'],
  });

  // THEN
  const propsObj = results[0];
  expect(propsObj).toEqual(expect.objectContaining({
    DBInstanceArn: 'arn:aws:rds:us-east-1:123456789012:db:test-instance-1',
    StorageEncrypted: 'true',
    Identifier: 'my-db-instance-1',
  }));
});

// In theory, this should never happen.  We ask for my-db-instance-1 but CC API returns ''.
// Included this to test the code path.
test('looks up RDS instance using CC API getResource - wrong match', async () => {
  // GIVEN
  mockCloudControlClient.on(GetResourceCommand).resolves({
    TypeName: 'AWS::RDS::DBInstance',
    ResourceDescription: {
      Identifier: '',
      Properties: '{"DBInstanceArn":"arn:aws:rds:us-east-1:123456789012:db:test-instance-1","StorageEncrypted":"true"}',
    },
  });

  await expect(
    // WHEN
    provider.getValue({
      account: '123456789012',
      region: 'us-east-1',
      typeName: 'AWS::RDS::DBInstance',
      exactIdentifier: 'my-db-instance-1',
      propertiesToReturn: ['DBInstanceArn', 'StorageEncrypted'],
    }),
  ).rejects.toThrow('Encountered CC API error while getting resource my-db-instance-1.'); // THEN
});

test('looks up RDS instance using CC API getResource - empty response', async () => {
  // GIVEN
  mockCloudControlClient.on(GetResourceCommand).resolves({
  });

  await expect(
    // WHEN
    provider.getValue({
      account: '123456789012',
      region: 'us-east-1',
      typeName: 'AWS::RDS::DBInstance',
      exactIdentifier: 'bad-identifier',
      propertiesToReturn: ['DBInstanceArn', 'StorageEncrypted'],
    }),
  ).rejects.toThrow('Encountered CC API error while getting resource bad-identifier.'); // THEN
});

test('looks up RDS instance using CC API getResource - error in CC API', async () => {
  // GIVEN
  mockCloudControlClient.on(GetResourceCommand).rejects('No data found');

  await expect(
    // WHEN
    provider.getValue({
      account: '123456789012',
      region: 'us-east-1',
      typeName: 'AWS::RDS::DBInstance',
      exactIdentifier: 'bad-identifier',
      propertiesToReturn: ['DBInstanceArn', 'StorageEncrypted'],
    }),
  ).rejects.toThrow('Encountered CC API error while getting resource bad-identifier.'); // THEN
});

test('looks up RDS instance using CC API listResources', async () => {
  // GIVEN
  mockCloudControlClient.on(ListResourcesCommand).resolves({
    ResourceDescriptions: [
      {
        Identifier: 'my-db-instance-1',
        Properties: '{"DBInstanceArn":"arn:aws:rds:us-east-1:123456789012:db:test-instance-1","StorageEncrypted":"true","Endpoint":{"Address":"address1.amazonaws.com","Port":"5432"}}',
      },
      {
        Identifier: 'my-db-instance-2',
        Properties: '{"DBInstanceArn":"arn:aws:rds:us-east-1:123456789012:db:test-instance-2","StorageEncrypted":"false","Endpoint":{"Address":"address2.amazonaws.com","Port":"5432"}}',
      },
      {
        Identifier: 'my-db-instance-3',
        Properties: '{"DBInstanceArn":"arn:aws:rds:us-east-1:123456789012:db:test-instance-3","StorageEncrypted":"true","Endpoint":{"Address":"address3.amazonaws.com","Port":"6000"}}',
      },
    ],
  });

  // WHEN
  const results = await provider.getValue({
    account: '123456789012',
    region: 'us-east-1',
    typeName: 'AWS::RDS::DBInstance',
    propertyMatch: {
      StorageEncrypted: 'true',
    },
    propertiesToReturn: ['DBInstanceArn', 'StorageEncrypted', 'Endpoint.Port'],
  });

  // THEN
  let propsObj = results[0];
  expect(propsObj).toEqual(expect.objectContaining({
    DBInstanceArn: 'arn:aws:rds:us-east-1:123456789012:db:test-instance-1',
    StorageEncrypted: 'true',
    'Endpoint.Port': '5432',
    Identifier: 'my-db-instance-1',
  }));

  propsObj = results[1];
  expect(propsObj).toEqual(expect.objectContaining({
    DBInstanceArn: 'arn:aws:rds:us-east-1:123456789012:db:test-instance-3',
    StorageEncrypted: 'true',
    'Endpoint.Port': '6000',
    Identifier: 'my-db-instance-3',
  }));

  expect(results.length).toEqual(2);
});

test('looks up RDS instance using CC API listResources - nested prop', async () => {
  // GIVEN
  mockCloudControlClient.on(ListResourcesCommand).resolves({
    ResourceDescriptions: [
      {
        Identifier: 'my-db-instance-1',
        Properties: '{"DBInstanceArn":"arn:aws:rds:us-east-1:123456789012:db:test-instance-1","StorageEncrypted":"true","Endpoint":{"Address":"address1.amazonaws.com","Port":"5432"}}',
      },
      {
        Identifier: 'my-db-instance-2',
        Properties: '{"DBInstanceArn":"arn:aws:rds:us-east-1:123456789012:db:test-instance-2","StorageEncrypted":"false","Endpoint":{"Address":"address2.amazonaws.com","Port":"5432"}}',
      },
      {
        Identifier: 'my-db-instance-3',
        Properties: '{"DBInstanceArn":"arn:aws:rds:us-east-1:123456789012:db:test-instance-3","StorageEncrypted":"true","Endpoint":{"Address":"address3.amazonaws.com","Port":"6000"}}',
      },
    ],
  });

  // WHEN
  const results = await provider.getValue({
    account: '123456789012',
    region: 'us-east-1',
    typeName: 'AWS::RDS::DBInstance',
    propertyMatch: {
      'StorageEncrypted': 'true',
      'Endpoint.Port': '5432',
    },
    propertiesToReturn: ['DBInstanceArn', 'StorageEncrypted', 'Endpoint.Port'],
  });

  // THEN
  let propsObj = results[0];
  expect(propsObj).toEqual(expect.objectContaining({
    DBInstanceArn: 'arn:aws:rds:us-east-1:123456789012:db:test-instance-1',
    StorageEncrypted: 'true',
    'Endpoint.Port': '5432',
    Identifier: 'my-db-instance-1',
  }));

  expect(results.length).toEqual(1);
});

test('error by specifying both exactIdentifier and propertyMatch', async () => {
  // GIVEN
  mockCloudControlClient.on(GetResourceCommand).resolves({
  });

  await expect(
    // WHEN
    provider.getValue({
      account: '123456789012',
      region: 'us-east-1',
      typeName: 'AWS::RDS::DBInstance',
      exactIdentifier: 'bad-identifier',
      propertyMatch: {
        'StorageEncrypted': 'true',
        'Endpoint.Port': '5432',
      },
      propertiesToReturn: ['DBInstanceArn', 'StorageEncrypted'],
    }),
  ).rejects.toThrow('Specify either exactIdentifier or propertyMatch, but not both. Failed to find resources using CC API for type AWS::RDS::DBInstance.'); // THEN
});

test('error by specifying neither exactIdentifier or propertyMatch', async () => {
  // GIVEN
  mockCloudControlClient.on(GetResourceCommand).resolves({
  });

  await expect(
    // WHEN
    provider.getValue({
      account: '123456789012',
      region: 'us-east-1',
      typeName: 'AWS::RDS::DBInstance',
      propertiesToReturn: ['DBInstanceArn', 'StorageEncrypted'],
    }),
  ).rejects.toThrow('Neither exactIdentifier nor propertyMatch is specified. Failed to find resources using CC API for type AWS::RDS::DBInstance.'); // THEN
});
/* eslint-enable */
