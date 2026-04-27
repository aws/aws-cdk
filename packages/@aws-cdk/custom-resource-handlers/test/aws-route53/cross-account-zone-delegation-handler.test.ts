import type { CrossAccountZoneDelegationEvent } from '../../lib/aws-route53/cross-account-zone-delegation-handler/index';
import { handler } from '../../lib/aws-route53/cross-account-zone-delegation-handler/index';

const mockChangeResourceRecordSets = jest.fn();
const mockListHostedZonesByName = jest.fn();
const mockFromTemporaryCredentials = jest.fn();

const mockRoute53Client = {
  changeResourceRecordSets: mockChangeResourceRecordSets,
  listHostedZonesByName: mockListHostedZonesByName,
};

jest.mock('@aws-sdk/client-route-53', () => {
  return {
    Route53: jest.fn().mockImplementation(() => {
      return mockRoute53Client;
    }),
  };
});

jest.mock('@aws-sdk/credential-providers', () => {
  return {
    fromTemporaryCredentials: (...args: any[]) => mockFromTemporaryCredentials(...args),
  };
});

beforeEach(() => {
  mockRoute53Client.changeResourceRecordSets.mockClear();
  mockRoute53Client.listHostedZonesByName.mockClear();
  mockFromTemporaryCredentials.mockClear();

  mockFromTemporaryCredentials.mockReturnValue({
    accessKeyId: 'MOCK_ACCESS_KEY',
    secretAccessKey: 'MOCK_SECRET_KEY',
    sessionToken: 'MOCK_SESSION_TOKEN',
  });
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

test('calls listHostedZonesByName to get public zoneId if ParentZoneId is not provided', async () => {
  // GIVEN
  const parentZoneName = 'some.zone';
  const parentZoneId = 'zone-id';

  mockRoute53Client.listHostedZonesByName.mockResolvedValueOnce({
    HostedZones: [
      { Name: `${parentZoneName}.`, Id: parentZoneId },
      { Name: `${parentZoneName}.`, Id: parentZoneId, Config: { PrivateZone: true } },
    ],
  });
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

test('throws if more than one HostedZones are returned for the provided ParentHostedZone', async () => {
  // GIVEN
  const parentZoneName = 'some.zone';
  const parentZoneId = 'zone-id';

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

describe('credential chain logic', () => {
  test('uses intermediate role in credential chain when IntermediateRoleArn is provided', async () => {
    // GIVEN
    const intermediateRoleArn = 'arn:aws:iam::123456789012:role/IntermediateRole';
    const delegationRoleArn = 'arn:aws:iam::987654321098:role/DelegationRole';

    mockRoute53Client.changeResourceRecordSets.mockResolvedValueOnce({});

    // WHEN
    const event = getCfnEvent({}, {
      AssumeRoleArn: delegationRoleArn,
      IntermediateRoleArn: intermediateRoleArn,
    });
    await invokeHandler(event);

    // THEN
    expect(mockFromTemporaryCredentials).toHaveBeenCalledTimes(2);

    // First call should be for the intermediate role (without masterCredentials)
    const firstCall = mockFromTemporaryCredentials.mock.calls[0][0];
    expect(firstCall.params.RoleArn).toBe(intermediateRoleArn);
    expect(firstCall.params.RoleSessionName).toMatch(/^intermediate-role-assumption-/);
    expect(firstCall.masterCredentials).toBeUndefined();

    // Second call should be for the delegation role (with masterCredentials)
    const secondCall = mockFromTemporaryCredentials.mock.calls[1][0];
    expect(secondCall.params.RoleArn).toBe(delegationRoleArn);
    expect(secondCall.params.RoleSessionName).toMatch(/^cross-account-zone-delegation-/);
    expect(secondCall.masterCredentials).toBeDefined();
  });

  test('does not use intermediate role when IntermediateRoleArn is not provided', async () => {
    // GIVEN
    const delegationRoleArn = 'arn:aws:iam::987654321098:role/DelegationRole';

    mockRoute53Client.changeResourceRecordSets.mockResolvedValueOnce({});

    // WHEN
    const event = getCfnEvent({}, {
      AssumeRoleArn: delegationRoleArn,
      IntermediateRoleArn: undefined,
    });
    await invokeHandler(event);

    // THEN
    expect(mockFromTemporaryCredentials).toHaveBeenCalledTimes(1);

    // Should only call for the delegation role (without masterCredentials)
    const call = mockFromTemporaryCredentials.mock.calls[0][0];
    expect(call.params.RoleArn).toBe(delegationRoleArn);
    expect(call.params.RoleSessionName).toMatch(/^cross-account-zone-delegation-/);
    expect(call.masterCredentials).toBeUndefined();
  });

  test('maintains backward compatibility when IntermediateRoleArn is absent from resource properties', async () => {
    // GIVEN
    const delegationRoleArn = 'arn:aws:iam::987654321098:role/DelegationRole';

    mockRoute53Client.changeResourceRecordSets.mockResolvedValueOnce({});

    // WHEN
    const event = getCfnEvent({}, {
      AssumeRoleArn: delegationRoleArn,
      // IntermediateRoleArn is not included at all
    });
    await invokeHandler(event);

    // THEN
    expect(mockFromTemporaryCredentials).toHaveBeenCalledTimes(1);

    // Should behave exactly like the case without intermediate role
    const call = mockFromTemporaryCredentials.mock.calls[0][0];
    expect(call.params.RoleArn).toBe(delegationRoleArn);
    expect(call.params.RoleSessionName).toMatch(/^cross-account-zone-delegation-/);
    expect(call.masterCredentials).toBeUndefined();

    // Should successfully complete the Route53 operation
    expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledTimes(1);
  });
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
  return handler(event as CrossAccountZoneDelegationEvent);
}
