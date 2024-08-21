import { ListResourceRecordSetsCommandOutput } from '@aws-sdk/client-route-53';
import {
  CrossAccountRecordSetEvent,
  PhysicalResourceId,
  ResourceProperties,
  handler,
} from '../../lib/aws-route53/cross-account-record-set-handler/index';
import { submitResponse } from '../../lib/core/nodejs-entrypoint-handler/index';

const mockAssumeRole = jest.fn();
const mockChangeResourceRecordSets = jest.fn();
const mockListResourceRecordSets = jest.fn();

const mockStsClient = {
  assumeRole: mockAssumeRole,
};

const mockRoute53Client = {
  changeResourceRecordSets: mockChangeResourceRecordSets,
  listResourceRecordSets: mockListResourceRecordSets,
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

jest.mock('../../lib/core/nodejs-entrypoint-handler/index');

beforeEach(() => {
  mockStsClient.assumeRole.mockClear();
  mockRoute53Client.changeResourceRecordSets.mockClear();
  mockRoute53Client.listResourceRecordSets.mockClear();
});

afterAll(() => {
  jest.resetAllMocks();
});

describe('Creating Physicasl Resource Id', () => {
  test('With simple unique ID and no SetIdentifier', () => {
    const physicalResourceId = new PhysicalResourceId({
      Name: 'test',
      Type: 'A',
    });
    expect(physicalResourceId.simpleUniqueRecordId()).toEqual('test-A');
  });
  test('With simple unique ID and SetIdentifier', () => {
    const physicalResourceId = new PhysicalResourceId({
      Name: 'test',
      Type: 'A',
      SetIdentifier: 'identifier',
    });

    expect(physicalResourceId.simpleUniqueRecordId()).toEqual('test-A-identifier');
  });
  test('with full physical resource ID', () => {
    const physicalResourceId = new PhysicalResourceId({
      Name: 'test',
      Type: 'A',
      TTL: 60, // Notice the non identifier properties of the RecordSet contribute to the hash.
    });
    expect(physicalResourceId.physicalResourceId()).toEqual('test-A_7d3bf9870a06');
  });
});

test('Invalid boolean value results in failed response', async () => {
  // Given
  const event = cfnCreateEvent({
    Name: 'test',
    Type: 'A',
    TTL: '60',
    DeleteExisting: 'what-is-this', // UOT
    ResourceRecords: [{ Value: '1.2.3.4' }],
    HostedZoneId: 'testId',
  });

  // When
  await handler(event);

  // Then
  expect(submitResponse).toHaveBeenCalledTimes(1);
  expect(submitResponse).toHaveBeenCalledWith('FAILED', expect.objectContaining({}));
});

test('Create event for simple RecordSet', async () => {
  // Given
  const event = cfnCreateEvent({
    Name: 'test',
    Type: 'A',
    TTL: '60',
    DeleteExisting: 'false',
    ResourceRecords: [{ Value: '1.2.3.4' }],
    HostedZoneId: 'testId',
  });

  // When
  await handler(event);

  // Then
  expect(mockRoute53Client.listResourceRecordSets).toHaveBeenCalledTimes(0);
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledTimes(1);
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledWith({
    HostedZoneId: 'testId',
    ChangeBatch: {
      Changes: [
        {
          Action: 'CREATE',
          ResourceRecordSet: {
            Name: 'test.',
            Type: 'A',
            TTL: 60,
            ResourceRecords: [{ Value: '1.2.3.4' }],
          },
        },
      ],
    },
  });
});

test('Create event for weighted RecordSet', async () => {
  // Given
  const event = cfnCreateEvent({
    Name: 'test',
    Type: 'A',
    TTL: '60',
    DeleteExisting: 'false',
    ResourceRecords: [{ Value: '1.2.3.4' }],
    HostedZoneId: 'testId',
    Weight: 50, // UOT
    SetIdentifier: '50',
  });

  // When
  await handler(event);

  // Then
  expect(mockRoute53Client.listResourceRecordSets).toHaveBeenCalledTimes(0);
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledTimes(1);
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledWith({
    HostedZoneId: 'testId',
    ChangeBatch: {
      Changes: [
        {
          Action: 'CREATE',
          ResourceRecordSet: {
            Name: 'test.',
            Type: 'A',
            TTL: 60,
            ResourceRecords: [{ Value: '1.2.3.4' }],
            Weight: 50,
            SetIdentifier: '50',
          },
        },
      ],
    },
  });
});

test('Create event for simple RecordSet with DeleteExisting set to true, existing record found, but SetIdentifier is different.', async () => {
  // Given
  const event = cfnCreateEvent({
    Name: 'Happy',
    Type: 'A',
    TTL: '60',
    DeleteExisting: 'true',
    ResourceRecords: [{ Value: '1.2.3.4' }],
    HostedZoneId: 'testId',
    SetIdentifier: 'New', // UOT
  });

  const listResourceRecordSetsResponse: ListResourceRecordSetsCommandOutput = {
    MaxItems: 1,
    IsTruncated: false,
    ResourceRecordSets: [
      {
        Name: 'happy',
        Type: 'A',
        TTL: 60,
        ResourceRecords: [{ Value: '4.3.2.1' }],
        SetIdentifier: 'Old', // UOT
      },
    ],
    $metadata: {},
  };
  mockRoute53Client.listResourceRecordSets.mockReturnValueOnce(listResourceRecordSetsResponse);

  // When
  await handler(event);

  // Then
  expect(mockRoute53Client.listResourceRecordSets).toHaveBeenCalledTimes(1);
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledTimes(1);
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledWith({
    HostedZoneId: 'testId',
    ChangeBatch: {
      Changes: [
        {
          Action: 'CREATE',
          ResourceRecordSet: {
            Name: 'happy.',
            Type: 'A',
            TTL: 60,
            ResourceRecords: [{ Value: '1.2.3.4' }],
            SetIdentifier: 'New',
          },
        },
      ],
    },
  });
});

test('Create event for simple RecordSet with DeleteExisting set to true, and existing record found', async () => {
  // Given
  const event = cfnCreateEvent({
    Name: 'Happy',
    Type: 'A',
    TTL: '60',
    DeleteExisting: '1', // UOT
    ResourceRecords: [{ Value: '1.2.3.4' }],
    HostedZoneId: 'testId',
  });

  const listResourceRecordSetsResponse: ListResourceRecordSetsCommandOutput = { // UOT
    MaxItems: 1,
    IsTruncated: false,
    ResourceRecordSets: [ // UOT
      {
        Name: 'happy',
        Type: 'A',
        TTL: 60,
        ResourceRecords: [{ Value: '4.3.2.1' }],
      },
    ],
    $metadata: {},
  };
  mockRoute53Client.listResourceRecordSets.mockReturnValueOnce(listResourceRecordSetsResponse);

  // When
  await handler(event);

  // Then
  expect(mockRoute53Client.listResourceRecordSets).toHaveBeenCalledTimes(1);
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledTimes(1);
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledWith({
    HostedZoneId: 'testId',
    ChangeBatch: {
      Changes: [
        {
          Action: 'DELETE',
          ResourceRecordSet: {
            Name: 'happy.',
            Type: 'A',
            TTL: 60,
            ResourceRecords: [{ Value: '4.3.2.1' }],
          },
        },
        {
          Action: 'CREATE',
          ResourceRecordSet: {
            Name: 'happy.',
            Type: 'A',
            TTL: 60,
            ResourceRecords: [{ Value: '1.2.3.4' }],
          },
        },
      ],
    },
  });
});

test('Create event for simple RecordSet with DeleteExisting set to true, and **no** existing record found', async () => {
  // Given
  const event = cfnCreateEvent({
    Name: 'test',
    Type: 'A',
    TTL: '60',
    DeleteExisting: 'true', // UOT
    ResourceRecords: [{ Value: '1.2.3.4' }],
    HostedZoneId: 'testId',
    SetIdentifier: 'test',
  });

  const listResourceRecordSetsResponse: ListResourceRecordSetsCommandOutput = {
    MaxItems: 1,
    IsTruncated: false,
    ResourceRecordSets: [], // UOT
    $metadata: {},
  };
  mockRoute53Client.listResourceRecordSets.mockReturnValueOnce(listResourceRecordSetsResponse);

  // When
  await handler(event);

  // Then
  expect(mockRoute53Client.listResourceRecordSets).toHaveBeenCalledTimes(1);
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledTimes(1);
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledWith({
    HostedZoneId: 'testId',
    ChangeBatch: {
      Changes: [
        {
          Action: 'CREATE',
          ResourceRecordSet: {
            Name: 'test.',
            Type: 'A',
            TTL: 60,
            ResourceRecords: [{ Value: '1.2.3.4' }],
            SetIdentifier: 'test',
          },
        },
      ],
    },
  });
});

test('Create event for RecordSet with AliasTarget', async () => {
  // Given
  const event = cfnCreateEvent({
    Name: 'test',
    Type: 'A',
    TTL: '60',
    DeleteExisting: 'false',
    AliasTarget: { // UOT
      DNSName: 'testdns',
      HostedZoneId: 'testHostedZoneId',
    },
    HostedZoneId: 'testId',
  });

  // When
  await handler(event);

  // Then
  expect(mockRoute53Client.listResourceRecordSets).toHaveBeenCalledTimes(0);
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledTimes(1);
  // # TTL is **ONLY** allowed with `ResourceRecords`, and NOT AliasTarget.
  expect(mockRoute53Client.changeResourceRecordSets.mock.calls[0]).not.toHaveProperty('[0].ChangeBatch.Changes[0].ResourceRecordSet.TTL');
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledWith({
    HostedZoneId: 'testId',
    ChangeBatch: {
      Changes: [
        {
          Action: 'CREATE',
          ResourceRecordSet: {
            Name: 'test.',
            Type: 'A',
            AliasTarget: {
              DNSName: 'testdns.',
              HostedZoneId: 'testHostedZoneId',
              EvaluateTargetHealth: false,
            },
          },
        },
      ],
    },
  });
});

test('Empty optional Resource Properties are removed from ChangeResourceRecordSet payload', async () => {
  // Given
  const event = cfnCreateEvent({
    Name: 'test',
    Type: 'A',
    TTL: '60',
    DeleteExisting: 'false',
    ResourceRecords: [{ Value: '1.2.3.4' }],
    HostedZoneId: 'testId',
    // Empty values should NOT be passed to ChangeResourceRecordSet
    SetIdentifier: '', // UOT
    GeoLocation: {}, // UOT
  });

  // When
  await handler(event);

  // Then
  expect(mockRoute53Client.changeResourceRecordSets.mock.calls[0]).not.toHaveProperty('[0].ChangeBatch.Changes[0].ResourceRecordSet.SetIdentifier');
  expect(mockRoute53Client.changeResourceRecordSets.mock.calls[0]).not.toHaveProperty('[0].ChangeBatch.Changes[0].ResourceRecordSet.GeoLocation');
});

test('Update event for changed RecordSet', async () => {
  // Given
  const event = cfnUpdateEvent(
    {
      HostedZoneId: 'testId',
      Name: 'new.',
      Type: 'A',
      TTL: '60',
      AliasTarget: {
        DNSName: 'testdns.',
        HostedZoneId: 'testHostedZoneId',
      },
    },
    {
      HostedZoneId: 'testId',
      Name: 'old.',
      Type: 'A',
      TTL: '60',
      AliasTarget: {
        DNSName: 'testdns.',
        HostedZoneId: 'testHostedZoneId',
      },
    },
  );

  // When
  await handler(event);

  // Then
  expect(mockRoute53Client.listResourceRecordSets).toHaveBeenCalledTimes(0);
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledTimes(1);
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledWith({
    HostedZoneId: 'testId',
    ChangeBatch: {
      Changes: [
        {
          Action: 'DELETE',
          ResourceRecordSet: {
            Name: 'old.',
            Type: 'A',
            AliasTarget: {
              DNSName: 'testdns.',
              HostedZoneId: 'testHostedZoneId',
              EvaluateTargetHealth: false,
            },
          },
        },
        {
          Action: 'UPSERT',
          ResourceRecordSet: {
            Name: 'new.',
            Type: 'A',
            AliasTarget: {
              DNSName: 'testdns.',
              HostedZoneId: 'testHostedZoneId',
              EvaluateTargetHealth: false,
            },
          },
        },
      ],
    },
  });
});

test('Delete event for simple existing RecordSet', async () => {
  // Given
  const resourceProps = {
    AssumeRoleArn: 'test',
    Name: 'test.',
    Type: 'A',
    TTL: '60',
    DeleteExisting: 'false',
    ResourceRecords: [{ Value: '1.2.3.4' }],
    HostedZoneId: 'testId',
  };
  const physicalResourceId = PhysicalResourceId.create(resourceProps);
  const event = cfnDeleteEvent(physicalResourceId.physicalResourceId(), resourceProps);

  const listResourceRecordSetsResponse: ListResourceRecordSetsCommandOutput = {
    MaxItems: 1,
    IsTruncated: false,
    ResourceRecordSets: [
      {
        Name: 'test.',
        Type: 'A',
        TTL: 60,
        ResourceRecords: [{ Value: '1.2.3.4' }],
      },
    ],
    $metadata: {},
  };
  mockRoute53Client.listResourceRecordSets.mockReturnValueOnce(listResourceRecordSetsResponse);

  // When
  await handler(event);

  // Then
  expect(mockRoute53Client.listResourceRecordSets).toHaveBeenCalledTimes(1);
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledTimes(1);
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledWith({
    HostedZoneId: 'testId',
    ChangeBatch: {
      Changes: [
        {
          Action: 'DELETE',
          ResourceRecordSet: {
            Name: 'test.',
            Type: 'A',
            TTL: 60,
            ResourceRecords: [{ Value: '1.2.3.4' }],
          },
        },
      ],
    },
  });
});

test("Delete event for RecordSet that doesn't exist", async () => {
  // Given
  const resourceProps = {
    AssumeRoleArn: 'test',
    Name: 'test',
    Type: 'A',
    TTL: '60',
    DeleteExisting: 'false',
    ResourceRecords: [{ Value: '1.2.3.4' }],
    HostedZoneId: 'testId',
  };
  const physicalResourceId = PhysicalResourceId.create(resourceProps);
  const event = cfnDeleteEvent(physicalResourceId.physicalResourceId(), resourceProps);

  const listResourceRecordSetsResponse: ListResourceRecordSetsCommandOutput = {
    MaxItems: 1,
    IsTruncated: false,
    ResourceRecordSets: [], // UOT
    $metadata: {},
  };
  mockRoute53Client.listResourceRecordSets.mockReturnValueOnce(listResourceRecordSetsResponse);

  // When
  await handler(event);

  // Then
  expect(mockRoute53Client.listResourceRecordSets).toHaveBeenCalledTimes(1);
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledTimes(0);
});

test('Delete event for RecordSet with same SimpleUniqueRecordId, but different properties', async () => {
  // Given
  const resourceProps = {
    AssumeRoleArn: 'test',
    Name: 'test',
    Type: 'A',
    TTL: '60',
    DeleteExisting: 'false',
    ResourceRecords: [{ Value: '1.2.3.4' }],
    HostedZoneId: 'testId',
  };
  const physicalResourceId = PhysicalResourceId.create(resourceProps);
  const event = cfnDeleteEvent(physicalResourceId.physicalResourceId(), resourceProps);

  const listResourceRecordSetsResponse: ListResourceRecordSetsCommandOutput = {
    MaxItems: 1,
    IsTruncated: false,
    ResourceRecordSets: [
      {
        Name: 'test',
        Type: 'A',
        TTL: 59, // UOT. Existing record has different property, don't delete!
        ResourceRecords: [{ Value: '1.2.3.4' }],
      },
    ],
    $metadata: {},
  };
  mockRoute53Client.listResourceRecordSets.mockReturnValueOnce(listResourceRecordSetsResponse);

  // When
  await handler(event);

  // Then
  expect(mockRoute53Client.listResourceRecordSets).toHaveBeenCalledTimes(1);
  expect(mockRoute53Client.changeResourceRecordSets).toHaveBeenCalledTimes(0);
});

function cfnCreateEvent(resourceProps?: Partial<ResourceProperties>): CrossAccountRecordSetEvent {
  return {
    RequestType: 'Create',
    ServiceToken: 'test',
    ResponseURL: 'test',
    StackId: 'test',
    RequestId: 'test',
    ResourceType: 'test',
    LogicalResourceId: 'test',
    ResourceProperties: {
      ServiceToken: 'Foo',
      AssumeRoleArn: 'test',
      Name: 'test',
      Type: 'A',
      HostedZoneId: 'test',
      DeleteExisting: 'false',
      TTL: '60',
      ...resourceProps,
    },
  };
}

function cfnUpdateEvent(
  resourceProps?: Partial<ResourceProperties>,
  oldresourceProps?: Partial<ResourceProperties>,
): CrossAccountRecordSetEvent {
  return {
    RequestType: 'Update',
    ServiceToken: 'test',
    ResponseURL: 'test',
    StackId: 'test',
    RequestId: 'test',
    ResourceType: 'test',
    LogicalResourceId: 'test',
    PhysicalResourceId: 'test',
    ResourceProperties: {
      ServiceToken: 'Foo',
      AssumeRoleArn: 'test',
      Name: 'test2',
      Type: 'A',
      HostedZoneId: 'test',
      DeleteExisting: 'false',
      TTL: '60',
      ...resourceProps,
    },
    OldResourceProperties: {
      AssumeRoleArn: 'test',
      Name: 'test',
      Type: 'A',
      HostedZoneId: 'test',
      DeleteExisting: 'false',
      TTL: '60',
      ...oldresourceProps,
    },
  };
}

function cfnDeleteEvent(
  physicalResourceId: string,
  resourceProps?: Partial<ResourceProperties>,
): CrossAccountRecordSetEvent {
  return {
    RequestType: 'Delete',
    ServiceToken: 'test',
    ResponseURL: 'test',
    StackId: 'test',
    RequestId: 'test',
    ResourceType: 'test',
    LogicalResourceId: 'test',
    PhysicalResourceId: physicalResourceId,
    ResourceProperties: {
      ServiceToken: 'Foo',
      AssumeRoleArn: 'test',
      Name: 'test',
      Type: 'A',
      HostedZoneId: 'test',
      DeleteExisting: 'false',
      TTL: '60',
      ...resourceProps,
    },
  };
}
