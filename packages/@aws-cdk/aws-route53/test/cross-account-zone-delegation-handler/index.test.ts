import { handler } from '../../lib/cross-account-zone-delegation-handler';

const mockStsClient = {
  assumeRole: jest.fn().mockReturnThis(),
  promise: jest.fn(),
};
const mockRoute53Client = {
  changeResourceRecordSets: jest.fn().mockReturnThis(),
  promise: jest.fn(),
};

jest.mock('aws-sdk', () => {
  return {
    ...(jest.requireActual('aws-sdk') as any),
    STS: jest.fn(() => mockStsClient),
    Route53: jest.fn(() => mockRoute53Client),
  };
});

beforeEach(() => {
  mockStsClient.assumeRole.mockReturnThis();
  mockRoute53Client.changeResourceRecordSets.mockReturnThis();
});

afterEach(() => {
  jest.clearAllMocks();
});

test('throws error if getting credentials fails', async () => {
  // GIVEN
  mockStsClient.promise.mockResolvedValueOnce({ Credentials: undefined });

  // WHEN
  const event= getCfnEvent();

  // THEN
  await expect(invokeHandler(event)).rejects.toThrow(/Error getting assume role credentials/);

  expect(mockStsClient.assumeRole).toHaveBeenCalledTimes(1);
  expect(mockStsClient.assumeRole).toHaveBeenCalledWith({
    RoleArn: 'roleArn',
    RoleSessionName: expect.any(String),
  });
});

test('calls create resouce record set with Upsert for Create event', async () => {
  // GIVEN
  mockStsClient.promise.mockResolvedValueOnce({ Credentials: { AccessKeyId: 'K', SecretAccessKey: 'S', SessionToken: 'T' } });
  mockRoute53Client.promise.mockResolvedValueOnce({});

  // WHEN
  const event= getCfnEvent();
  await invokeHandler(event);

  // THEN
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledTimes(1);
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledWith({
    HostedZoneId: '1',
    ChangeBatch: {
      Changes: [{
        Action: 'UPSERT',
        ResourceRecordSet: {
          Name: 'recordName',
          Type: 'NS',
          TTL: 172800,
          ResourceRecords: [{ Value: 'one' }, { Value: 'two' }],
        },
      }],
    },
  });
});

test('calls create resouce record set with DELETE for Delete event', async () => {
  // GIVEN
  mockStsClient.promise.mockResolvedValueOnce({ Credentials: { AccessKeyId: 'K', SecretAccessKey: 'S', SessionToken: 'T' } });
  mockRoute53Client.promise.mockResolvedValueOnce({});

  // WHEN
  const event= getCfnEvent({ RequestType: 'Delete' });
  await invokeHandler(event);

  // THEN
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledTimes(1);
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledWith({
    HostedZoneId: '1',
    ChangeBatch: {
      Changes: [{
        Action: 'DELETE',
        ResourceRecordSet: {
          Name: 'recordName',
          Type: 'NS',
          TTL: 172800,
          ResourceRecords: [{ Value: 'one' }, { Value: 'two' }],
        },
      }],
    },
  });
});

function getCfnEvent(event?: Partial<AWSLambda.CloudFormationCustomResourceEvent>): Partial<AWSLambda.CloudFormationCustomResourceEvent> {
  return {
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'Foo',
      AssumeRoleArn: 'roleArn',
      ParentZoneId: '1',
      DelegatedZoneName: 'recordName',
      DelegatedZoneNameServers: ['one', 'two'],
      TTL: 172800,
    },
    ...event,
  };
}

// helper function to get around TypeScript expecting a complete event object,
// even though our tests only need some of the fields
async function invokeHandler(event: Partial<AWSLambda.CloudFormationCustomResourceEvent>) {
  return handler(event as AWSLambda.CloudFormationCustomResourceEvent);
}
