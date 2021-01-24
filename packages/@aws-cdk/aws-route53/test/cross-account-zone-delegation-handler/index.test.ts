const mockStsClient = {
  assumeRole: jest.fn().mockReturnThis(),
  promise: jest.fn(),
};
const mockRoute53Client = {
  listHostedZonesByName: jest.fn().mockReturnThis(),
  changeResourceRecordSets: jest.fn().mockReturnThis(),
  promise: jest.fn(),
};

import { handler } from '../../lib/cross-account-zone-delegation-handler';

jest.mock('aws-sdk', () => {
  return {
    STS: jest.fn(() => mockStsClient),
    Route53: jest.fn(() => mockRoute53Client),
  };
});

beforeEach(() => {
  mockStsClient.assumeRole.mockReturnThis();
  mockRoute53Client.listHostedZonesByName.mockReturnThis();
  mockRoute53Client.changeResourceRecordSets.mockReturnThis();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('throws error if getting credentials fails', async () => {
  // GIVEN
  mockStsClient.promise.mockResolvedValueOnce({ Credentials: undefined });

  // WHEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceEvent> = {
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'Foo',
      AssumeRoleArn: 'roleArn',
      ParentZoneName: 'zoneName',
      RecordName: 'recordName',
      NameServers: ['one', 'two'],
    },
  };

  // THEN
  expect(await invokeHandler(event)).toThrow(/Error getting assume role credentials/);

  expect(mockStsClient.assumeRole).toHaveBeenCalledTimes(1);
  expect(mockStsClient.assumeRole).toHaveBeenCalledWith({
    RoleArn: 'roleArn',
    RoleSessionName: expect.any(String),
  });
});

test('throws error if more than one hosted zone returned by list hosted zone', async () => {
  // GIVEN
  mockStsClient.promise.mockResolvedValueOnce({ Credentials: { AccessKeyId: 'K', SecretAccessKey: 'S', SessionToken: 'T' } });
  mockRoute53Client.promise.mockResolvedValueOnce({ HostedZones: [{ ID: '1' }, { ID: '2' }] });

  // WHEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceEvent> = {
    RequestType: 'Update',
    ResourceProperties: {
      ServiceToken: 'Foo',
      AssumeRoleArn: 'roleArn',
      ParentZoneName: 'zoneName',
      RecordName: 'recordName',
      NameServers: ['one', 'two'],
    },
  };

  // THEN
  expect(await invokeHandler(event)).toThrow(/More than one hosted zones found with the provided name./);

  expect(mockRoute53Client.listHostedZonesByName).toHaveBeenCalledTimes(1);
  expect(mockRoute53Client.listHostedZonesByName).toHaveBeenCalledWith({ DNSName: 'zoneName' });
});

test('calls create resouce record set with Upsert for Create', async () => {
  // GIVEN
  mockStsClient.promise.mockResolvedValueOnce({ Credentials: { AccessKeyId: 'K', SecretAccessKey: 'S', SessionToken: 'T' } });
  mockRoute53Client.promise.mockResolvedValueOnce({ HostedZones: [{ ID: '1' }] });
  mockRoute53Client.promise.mockResolvedValueOnce({});

  // WHEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceEvent> = {
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'Foo',
      AssumeRoleArn: 'roleArn',
      ParentZoneName: 'zoneName',
      RecordName: 'recordName',
      NameServers: ['one', 'two'],
    },
  };

  await invokeHandler(event);

  // THEN
  expect(mockRoute53Client.listHostedZonesByName).toHaveBeenCalledTimes(1);
  expect(mockRoute53Client.listHostedZonesByName).toHaveBeenCalledWith({ DNSName: 'zoneName' });

  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledTimes(1);
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledWith({
    HostedZoneId: '1',
    ChangeBatch: {
      Changes: [{
        Action: 'UPSERT',
        ResourceRecordSet: {
          Name: 'recordName',
          Type: 'NS',
          ResourceRecords: [{ Value: 'one' }, { Value: 'two' }],
        },
      }],
    },
  });
});

// helper function to get around TypeScript expecting a complete event object,
// even though our tests only need some of the fields
async function invokeHandler(event: Partial<AWSLambda.CloudFormationCustomResourceEvent>) {
  return handler(event as AWSLambda.CloudFormationCustomResourceEvent);
}
