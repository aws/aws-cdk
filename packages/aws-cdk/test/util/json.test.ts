import { findJsonValue, getResultObj } from '../../lib/util/json';

const jsonObj = {
  DBInstanceArn: 'arn:aws:rds:us-east-1:123456789012:db:test-instance-1',
  StorageEncrypted: 'true',
  Endpoint: {
    Address: 'address1.amazonaws.com',
    Port: '5432',
  },
};

test('findJsonValue for paths', async () => {
  expect(findJsonValue(jsonObj, 'DBInstanceArn')).toEqual('arn:aws:rds:us-east-1:123456789012:db:test-instance-1');
  expect(findJsonValue(jsonObj, 'Endpoint.Address')).toEqual('address1.amazonaws.com');

  const answer = {
    Address: 'address1.amazonaws.com',
    Port: '5432',
  };
  expect(findJsonValue(jsonObj, 'Endpoint')).toEqual(answer);
});

test('findJsonValue for nonexisting paths', async () => {
  expect(() => findJsonValue(jsonObj, 'Blah')).toThrow('Cannot read field Blah. Blah is not found.');

  expect(() => findJsonValue(jsonObj, 'Endpoint.Blah')).toThrow('Cannot read field Endpoint.Blah. Blah is not found.');

  expect(() => findJsonValue(jsonObj, 'Endpoint.Address.Blah')).toThrow('Cannot read field Endpoint.Address.Blah. Blah is not found.');
});

test('getResultObj returns correct objects', async () => {
  const propertiesToReturn = ['DBInstanceArn', 'Endpoint.Port', 'Endpoint'];

  const result = getResultObj(jsonObj, '12345', propertiesToReturn);
  expect(result.DBInstanceArn).toEqual('arn:aws:rds:us-east-1:123456789012:db:test-instance-1');
  expect(result['Endpoint.Port']).toEqual('5432');
  expect(result.Identifier).toEqual('12345');

  const answer = {
    Address: 'address1.amazonaws.com',
    Port: '5432',
  };
  expect(result.Endpoint).toEqual(answer);
});

test('getResultObj throws error for missing property', async () => {
  const propertiesToReturn = ['DBInstanceArn', 'NoSuchProp'];

  expect(() => getResultObj(jsonObj, '12345', propertiesToReturn)).toThrow('Cannot read field NoSuchProp. NoSuchProp is not found.');
});
