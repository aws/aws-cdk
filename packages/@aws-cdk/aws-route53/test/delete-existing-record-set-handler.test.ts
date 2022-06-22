const mockListResourceRecordSetsResponse = jest.fn();
const mockChangeResourceRecordSetsResponse = jest.fn();

const mockRoute53 = {
  listResourceRecordSets: jest.fn().mockReturnValue({
    promise: mockListResourceRecordSetsResponse,
  }),
  changeResourceRecordSets: jest.fn().mockReturnValue({
    promise: mockChangeResourceRecordSetsResponse,
  }),
  waitFor: jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({}),
  }),
};

jest.mock('aws-sdk', () => {
  return {
    Route53: jest.fn(() => mockRoute53),
  };
});

import { handler } from '../lib/delete-existing-record-set-handler';

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

  expect(mockRoute53.waitFor).toHaveBeenCalledWith('resourceRecordSetsChanged', {
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
