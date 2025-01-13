import { GetResourceCommand, ListResourcesCommand } from '@aws-sdk/client-cloudcontrol';
import { CcApiContextProviderPlugin, findJsonValue, toResultObj } from '../../lib/context-providers/cc-api-provider';
import { mockCloudControlClient, MockSdkProvider, restoreSdkMocksToDefault } from '../util/mock-sdk';

let provider: CcApiContextProviderPlugin;

beforeEach(() => {
  provider = new CcApiContextProviderPlugin(new MockSdkProvider());
  restoreSdkMocksToDefault();
});

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
  const result = await provider.getValue({
    account: '123456789012',
    region: 'us-east-1',
    typeName: 'AWS::RDS::DBInstance',
    exactIdentifier: 'my-db-instance-1',
    propertiesToReturn: ['DBInstanceArn', 'StorageEncrypted'],
  });

  // THEN
  const propsObj = result['my-db-instance-1'];
  expect(propsObj.DBInstanceArn).toEqual('arn:aws:rds:us-east-1:123456789012:db:test-instance-1');
  expect(propsObj.StorageEncrypted).toEqual('true');
});

test('looks up RDS instance using CC API getResource - not found', async () => {
  // GIVEN
  mockCloudControlClient.on(GetResourceCommand).resolves({
  });

  // WHEN
  const result = await provider.getValue({
    account: '123456789012',
    region: 'us-east-1',
    typeName: 'AWS::RDS::DBInstance',
    exactIdentifier: 'bad-identifier',
    propertiesToReturn: ['DBInstanceArn', 'StorageEncrypted'],
  });

  // THEN
  expect(result).toEqual({});
});

test('looks up RDS instance using CC API getResource - error in CC API', async () => {
  // GIVEN
  mockCloudControlClient.on(GetResourceCommand).rejects('No data found');

  // WHEN
  const result = await provider.getValue({
    account: '123456789012',
    region: 'us-east-1',
    typeName: 'AWS::RDS::DBInstance',
    exactIdentifier: 'bad-identifier',
    propertiesToReturn: ['DBInstanceArn', 'StorageEncrypted'],
  });

  // THEN
  expect(result).toEqual({});
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
  const result = await provider.getValue({
    account: '123456789012',
    region: 'us-east-1',
    typeName: 'AWS::RDS::DBInstance',
    propertyMatch: {
      StorageEncrypted: 'true',
    },
    propertiesToReturn: ['DBInstanceArn', 'StorageEncrypted', 'Endpoint.Port'],
  });

  // THEN
  let propsObj = result['my-db-instance-1'];
  expect(propsObj.DBInstanceArn).toEqual('arn:aws:rds:us-east-1:123456789012:db:test-instance-1');
  expect(propsObj.StorageEncrypted).toEqual('true');
  expect(propsObj['Endpoint.Port']).toEqual('5432');

  propsObj = result['my-db-instance-3'];
  expect(propsObj.DBInstanceArn).toEqual('arn:aws:rds:us-east-1:123456789012:db:test-instance-3');
  expect(propsObj.StorageEncrypted).toEqual('true');
  expect(propsObj['Endpoint.Port']).toEqual('6000');

  propsObj = result['my-db-instance-2'];
  expect(propsObj).toEqual(undefined);
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
  const result = await provider.getValue({
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
  let propsObj = result['my-db-instance-1'];
  expect(propsObj.DBInstanceArn).toEqual('arn:aws:rds:us-east-1:123456789012:db:test-instance-1');
  expect(propsObj.StorageEncrypted).toEqual('true');
  expect(propsObj['Endpoint.Port']).toEqual('5432');

  propsObj = result['my-db-instance-3'];
  expect(propsObj).toEqual(undefined);

  propsObj = result['my-db-instance-2'];
  expect(propsObj).toEqual(undefined);
});

test('findJsonValue for paths', async () => {
  const jsonString = '{"DBInstanceArn":"arn:aws:rds:us-east-1:123456789012:db:test-instance-1","StorageEncrypted":"true","Endpoint":{"Address":"address1.amazonaws.com","Port":"5432"}}';
  const jsonObj = JSON.parse(jsonString);

  expect(findJsonValue(jsonObj, 'DBInstanceArn')).toEqual('arn:aws:rds:us-east-1:123456789012:db:test-instance-1');
  expect(findJsonValue(jsonObj, 'Endpoint.Address')).toEqual('address1.amazonaws.com');

  const answer = {
    Address: 'address1.amazonaws.com',
    Port: '5432',
  };
  expect(findJsonValue(jsonObj, 'Endpoint')).toEqual(answer);
});

test('toResultObj returns correct objects', async () => {
  const jsonString = '{"DBInstanceArn":"arn:aws:rds:us-east-1:123456789012:db:test-instance-1","StorageEncrypted":"true","Endpoint":{"Address":"address1.amazonaws.com","Port":"5432"}}';
  const jsonObj = JSON.parse(jsonString);
  const propertiesToReturn = ['DBInstanceArn', 'Endpoint.Port', 'Endpoint'];

  const result = toResultObj(jsonObj, propertiesToReturn);
  expect(result.DBInstanceArn).toEqual('arn:aws:rds:us-east-1:123456789012:db:test-instance-1');
  expect(result['Endpoint.Port']).toEqual('5432');

  const answer = {
    Address: 'address1.amazonaws.com',
    Port: '5432',
  };
  expect(result.Endpoint).toEqual(answer);
});
