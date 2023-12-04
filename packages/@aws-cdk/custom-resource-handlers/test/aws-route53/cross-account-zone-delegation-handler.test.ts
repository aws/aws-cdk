import { handler } from '../../lib/aws-route53/cross-account-zone-delegation-handler/index';

const mockAssumeRole = jest.fn();
const mockChangeResourceRecordSets = jest.fn();
const mockListHostedZonesByName = jest.fn();

const mockStsClient = {
  assumeRole: mockAssumeRole,
};

const mockRoute53Client = {
  changeResourceRecordSets: mockChangeResourceRecordSets,
  listHostedZonesByName: mockListHostedZonesByName,
};

jest.mock('@aws-sdk/client-sts', () => {
  return {
    STS: jest.fn().mockImplementation(() => {
      return mockStsClient;
    }),
  };
});

jest.mock('@aws-sdk/client-route-53', () => {
  return {
    Route53: jest.fn().mockImplementation(() => {
      return mockRoute53Client;
    }),
  };
});

beforeEach(() => {
  mockStsClient.assumeRole.mockClear();
  mockRoute53Client.changeResourceRecordSets.mockClear();
  mockRoute53Client.listHostedZonesByName.mockClear();
});

afterAll(() => {
  jest.resetAllMocks();
});

test('throws error if both ParentZoneId and ParentZoneName are not provided', async () => {
  // WHEN
  const event = getCfnEvent({}, {
    ParentZoneId: undefined,
    ParentZoneName: undefined,
  });

  // THEN
  await expect(invokeHandler(event)).rejects.toThrow(/One of ParentZoneId or ParentZoneName must be specified/);
});

test('calls create resource record set with Upsert for Create event', async () => {
  // GIVEN
  mockStsClient.assumeRole.mockResolvedValueOnce({ Credentials: { AccessKeyId: 'K', SecretAccessKey: 'S', SessionToken: 'T' } });
  mockRoute53Client.changeResourceRecordSets.mockResolvedValueOnce({});

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

test('calls create resource record set with DELETE for Delete event', async () => {
  // GIVEN
  mockStsClient.assumeRole.mockResolvedValueOnce({ Credentials: { AccessKeyId: 'K', SecretAccessKey: 'S', SessionToken: 'T' } });
  mockRoute53Client.changeResourceRecordSets.mockResolvedValueOnce({});

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

test('calls listHostedZonesByName to get zoneId if ParentZoneId is not provided', async () => {
  // GIVEN
  const parentZoneName = 'some.zone';
  const parentZoneId = 'zone-id';

  mockStsClient.assumeRole.mockResolvedValueOnce({ Credentials: { AccessKeyId: 'K', SecretAccessKey: 'S', SessionToken: 'T' } });
  mockRoute53Client.listHostedZonesByName.mockResolvedValueOnce({ HostedZones: [{ Name: `${parentZoneName}.`, Id: parentZoneId }] });
  mockRoute53Client.changeResourceRecordSets.mockResolvedValueOnce({});

  // WHEN
  const event = getCfnEvent({}, {
    ParentZoneId: undefined,
    ParentZoneName: parentZoneName,
  });
  await invokeHandler(event);

  // THEN
  expect(mockRoute53Client.listHostedZonesByName).toHaveBeenCalledTimes(1);
  expect(mockRoute53Client.listHostedZonesByName).toHaveBeenCalledWith({ DNSName: parentZoneName });

  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledTimes(1);
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledWith({
    HostedZoneId: parentZoneId,
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

test('throws if more than one HostedZones are returnd for the provided ParentHostedZone', async () => {
  // GIVEN
  const parentZoneName = 'some.zone';
  const parentZoneId = 'zone-id';

  mockStsClient.assumeRole.mockResolvedValueOnce({ Credentials: { AccessKeyId: 'K', SecretAccessKey: 'S', SessionToken: 'T' } });
  mockRoute53Client.listHostedZonesByName.mockResolvedValueOnce({
    HostedZones: [
      { Name: `${parentZoneName}.`, Id: parentZoneId },
      { Name: `${parentZoneName}.`, Id: parentZoneId },
    ],
  });

  // WHEN
  const event = getCfnEvent({}, {
    ParentZoneId: undefined,
    ParentZoneName: parentZoneName,
  });

  // THEN
  await expect(invokeHandler(event)).rejects.toThrow(/Expected one hosted zone to match the given name but found 2/);
  expect(mockRoute53Client.listHostedZonesByName).toHaveBeenCalledTimes(1);
  expect(mockRoute53Client.listHostedZonesByName).toHaveBeenCalledWith({ DNSName: parentZoneName });
});

function getCfnEvent(
  event?: Partial<AWSLambda.CloudFormationCustomResourceEvent>,
  resourceProps?: any,
): Partial<AWSLambda.CloudFormationCustomResourceEvent> {
  return {
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'Foo',
      AssumeRoleArn: 'roleArn',
      ParentZoneId: '1',
      DelegatedZoneName: 'recordName',
      DelegatedZoneNameServers: ['one', 'two'],
      TTL: 172800,
      ...resourceProps,
    },
    ...event,
  };
}

// helper function to get around TypeScript expecting a complete event object,
// even though our tests only need some of the fields
async function invokeHandler(event: Partial<AWSLambda.CloudFormationCustomResourceEvent>) {
  return handler(event as AWSLambda.CloudFormationCustomResourceEvent);
}