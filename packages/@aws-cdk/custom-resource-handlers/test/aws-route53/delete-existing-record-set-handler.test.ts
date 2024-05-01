import { handler } from '../../lib/aws-route53/delete-existing-record-set-handler';

const mockListResourceRecordSetsResponse = jest.fn();
const mockChangeResourceRecordSetsResponse = jest.fn();
const mockWaitUntilResourceRecordSetsChanged = jest.fn().mockResolvedValue({});

const mockRoute53 = {
  listResourceRecordSets: mockListResourceRecordSetsResponse,
  changeResourceRecordSets: mockChangeResourceRecordSetsResponse,
};

jest.mock('@aws-sdk/client-route-53', () => {
  return {
    Route53: jest.fn().mockImplementation(() => mockRoute53),
    waitUntilResourceRecordSetsChanged: (...args: any[]) => mockWaitUntilResourceRecordSetsChanged(...args),
  };
});

const event: AWSLambda.CloudFormationCustomResourceEvent & { PhysicalResourceId?: string } = {
  RequestType: 'Create',
  ServiceToken: 'service-token',
  ResponseURL: 'response-url',
  StackId: 'stack-id',
  RequestId: 'request-id',
  LogicalResourceId: 'logical-resource-id',
  ResourceType: 'Custom::DeleteExistingRecordSet',
  ResourceProperties: {
    ServiceToken: 'service-token',
    HostedZoneId: 'hosted-zone-id',
    RecordName: 'dev.cdk.aws.',
    RecordType: 'A',
  },
};

beforeEach(() => {
  jest.clearAllMocks();
});

test('create request with existing record', async () => {
  mockListResourceRecordSetsResponse.mockResolvedValueOnce({
    ResourceRecordSets: [
      {
        Name: 'dev.cdk.aws.',
        Type: 'A',
        TTL: 900,
      },
      {
        Name: 'dev.cdk.aws.',
        Type: 'AAAA',
        TTL: 900,
      },
    ],
  });

  mockChangeResourceRecordSetsResponse.mockResolvedValueOnce({
    ChangeInfo: {
      Id: 'change-id',
    },
  });

  await handler(event);

  expect(mockRoute53.listResourceRecordSets).toHaveBeenCalledWith({
    HostedZoneId: 'hosted-zone-id',
    StartRecordName: 'dev.cdk.aws.',
    StartRecordType: 'A',
  });

  expect(mockRoute53.changeResourceRecordSets).toHaveBeenCalledWith({
    HostedZoneId: 'hosted-zone-id',
    ChangeBatch: {
      Changes: [
        {
          Action: 'DELETE',
          ResourceRecordSet: {
            Name: 'dev.cdk.aws.',
            TTL: 900,
            Type: 'A',
          },
        },
      ],
    },
  });

  expect(mockWaitUntilResourceRecordSetsChanged).toHaveBeenCalledTimes(1);
  expect(mockWaitUntilResourceRecordSetsChanged.mock.calls[0][1]).toEqual({
    Id: 'change-id',
  });
});

test('create request with non existing record', async () => {
  mockListResourceRecordSetsResponse.mockResolvedValueOnce({
    ResourceRecordSets: [
      {
        Name: 'www.cdk.aws.',
        Type: 'A',
        TTL: 900,
      },
      {
        Name: 'dev.cdk.aws.',
        Type: 'MX',
        TTL: 900,
      },
    ],
  });

  await handler(event);

  expect(mockRoute53.changeResourceRecordSets).not.toHaveBeenCalled();
});

test('update request', async () => {
  await handler({
    ...event,
    RequestType: 'Update',
    PhysicalResourceId: 'id',
    OldResourceProperties: {},
  });

  expect(mockRoute53.changeResourceRecordSets).not.toHaveBeenCalled();
});

test('delete request', async () => {
  await handler({
    ...event,
    RequestType: 'Delete',
    PhysicalResourceId: 'id',
  });

  expect(mockRoute53.changeResourceRecordSets).not.toHaveBeenCalled();
});

test('with alias target', async () => {
  mockListResourceRecordSetsResponse.mockResolvedValueOnce({
    ResourceRecordSets: [
      {
        Name: 'dev.cdk.aws.',
        Type: 'A',
        TTL: undefined,
        ResourceRecords: [],
        AliasTarget: {
          HostedZoneId: 'hosted-zone-id',
          DNSName: 'dns-name',
          EvaluateTargetHealth: false,
        },
      },
    ],
  });

  mockChangeResourceRecordSetsResponse.mockResolvedValueOnce({
    ChangeInfo: {
      Id: 'change-id',
    },
  });

  await handler(event);

  expect(mockRoute53.changeResourceRecordSets).toHaveBeenCalledWith({
    HostedZoneId: 'hosted-zone-id',
    ChangeBatch: {
      Changes: [
        {
          Action: 'DELETE',
          ResourceRecordSet: {
            Name: 'dev.cdk.aws.',
            Type: 'A',
            AliasTarget: {
              HostedZoneId: 'hosted-zone-id',
              DNSName: 'dns-name',
              EvaluateTargetHealth: false,
            },
          },
        },
      ],
    },
  });
});
