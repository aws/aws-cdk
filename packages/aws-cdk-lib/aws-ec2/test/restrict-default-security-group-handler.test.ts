let mockRevokeSecurityGroupEgress: jest.Mock;
let mockAuthorizeSecurityGroupEgress: jest.Mock;
let mockRevokeSecurityGroupIngress: jest.Mock;
let mockAuthorizeSecurityGroupIngress: jest.Mock;

import { handler } from '../lib/restrict-default-security-group-handler';

jest.mock('aws-sdk', () => {
  return {
    EC2: jest.fn(() => {
      return {
        revokeSecurityGroupEgress: jest.fn((params) => {
          return {
            promise: () => mockRevokeSecurityGroupEgress(params),
          };
        }),
        revokeSecurityGroupIngress: jest.fn((params) => {
          return {
            promise: () => mockRevokeSecurityGroupIngress(params),
          };
        }),
        authorizeSecurityGroupIngress: jest.fn((params) => {
          return {
            promise: () => mockAuthorizeSecurityGroupIngress(params),
          };
        }),
        authorizeSecurityGroupEgress: jest.fn((params) => {
          return {
            promise: () => mockAuthorizeSecurityGroupEgress(params),
          };
        }),
      };
    }),
  };
});

beforeEach(() => {
  mockRevokeSecurityGroupEgress = jest.fn().mockReturnThis();
  mockRevokeSecurityGroupIngress = jest.fn().mockReturnThis();
  mockAuthorizeSecurityGroupEgress = jest.fn().mockReturnThis();
  mockAuthorizeSecurityGroupIngress = jest.fn().mockReturnThis();
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

test('revokes rules on create event', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceCreateEvent> = {
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'Foo',
      DefaultSecurityGroupId: 'sg-abc123',
      Account: '12345678912',
    },
  };

  // WHEN
  await invokeHandler(event);

  // THEN
  expect(mockRevokeSecurityGroupEgress).toHaveBeenCalledTimes(1);
  expect(mockRevokeSecurityGroupIngress).toHaveBeenCalledTimes(1);
  expect(mockRevokeSecurityGroupEgress).toHaveBeenCalledWith({
    GroupId: 'sg-abc123',
    IpPermissions: [{
      IpRanges: [{
        CidrIp: '0.0.0.0/0',
      }],
      IpProtocol: '-1',
    }],
  });
  expect(mockRevokeSecurityGroupIngress).toHaveBeenCalledWith({
    GroupId: 'sg-abc123',
    IpPermissions: [{
      UserIdGroupPairs: [{
        UserId: '12345678912',
        GroupId: 'sg-abc123',
      }],
      IpProtocol: '-1',
    }],
  });
});

test('authorizes rules on delete event', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceDeleteEvent> = {
    RequestType: 'Delete',
    ResourceProperties: {
      ServiceToken: 'Foo',
      DefaultSecurityGroupId: 'sg-abc123',
      Account: '12345678912',
    },
  };

  // WHEN
  await invokeHandler(event);

  // THEN
  expect(mockRevokeSecurityGroupEgress).toHaveBeenCalledTimes(0);
  expect(mockRevokeSecurityGroupIngress).toHaveBeenCalledTimes(0);
  expect(mockAuthorizeSecurityGroupEgress).toHaveBeenCalledTimes(1);
  expect(mockAuthorizeSecurityGroupIngress).toHaveBeenCalledTimes(1);
  expect(mockAuthorizeSecurityGroupIngress).toHaveBeenCalledWith({
    GroupId: 'sg-abc123',
    IpPermissions: [{
      UserIdGroupPairs: [{
        UserId: '12345678912',
        GroupId: 'sg-abc123',
      }],
      IpProtocol: '-1',
    }],
  });
  expect(mockAuthorizeSecurityGroupEgress).toHaveBeenCalledWith({
    GroupId: 'sg-abc123',
    IpPermissions: [{
      IpRanges: [{
        CidrIp: '0.0.0.0/0',
      }],
      IpProtocol: '-1',
    }],
  });
});

test('update event with no change', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceUpdateEvent> = {
    RequestType: 'Update',
    ResourceProperties: {
      ServiceToken: 'Foo',
      DefaultSecurityGroupId: 'sg-abc123',
      Account: '12345678912',
    },
    OldResourceProperties: {
      ServiceToken: 'Foo',
      DefaultSecurityGroupId: 'sg-abc123',
      Account: '12345678912',
    },
  };

  // WHEN
  await invokeHandler(event);

  // THEN
  expect(mockRevokeSecurityGroupEgress).toHaveBeenCalledTimes(0);
  expect(mockRevokeSecurityGroupIngress).toHaveBeenCalledTimes(0);
  expect(mockAuthorizeSecurityGroupEgress).toHaveBeenCalledTimes(0);
  expect(mockAuthorizeSecurityGroupIngress).toHaveBeenCalledTimes(0);
});

test('update event with security group change', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceUpdateEvent> = {
    RequestType: 'Update',
    ResourceProperties: {
      ServiceToken: 'Foo',
      DefaultSecurityGroupId: 'sg-abc123',
      Account: '12345678912',
    },
    OldResourceProperties: {
      ServiceToken: 'Foo',
      DefaultSecurityGroupId: 'sg-xyz123',
      Account: '12345678912',
    },
  };

  // WHEN
  await invokeHandler(event);

  // THEN
  expect(mockRevokeSecurityGroupEgress).toHaveBeenCalledTimes(1);
  expect(mockRevokeSecurityGroupIngress).toHaveBeenCalledTimes(1);
  expect(mockAuthorizeSecurityGroupEgress).toHaveBeenCalledTimes(1);
  expect(mockAuthorizeSecurityGroupIngress).toHaveBeenCalledTimes(1);
  expect(mockRevokeSecurityGroupIngress).toHaveBeenCalledWith({
    GroupId: 'sg-abc123',
    IpPermissions: [{
      UserIdGroupPairs: [{
        UserId: '12345678912',
        GroupId: 'sg-abc123',
      }],
      IpProtocol: '-1',
    }],
  });
  expect(mockRevokeSecurityGroupEgress).toHaveBeenCalledWith({
    GroupId: 'sg-abc123',
    IpPermissions: [{
      IpRanges: [{
        CidrIp: '0.0.0.0/0',
      }],
      IpProtocol: '-1',
    }],
  });
  expect(mockAuthorizeSecurityGroupEgress).toHaveBeenCalledWith({
    GroupId: 'sg-xyz123',
    IpPermissions: [{
      IpRanges: [{
        CidrIp: '0.0.0.0/0',
      }],
      IpProtocol: '-1',
    }],
  });
  expect(mockAuthorizeSecurityGroupIngress).toHaveBeenCalledWith({
    GroupId: 'sg-xyz123',
    IpPermissions: [{
      UserIdGroupPairs: [{
        UserId: '12345678912',
        GroupId: 'sg-xyz123',
      }],
      IpProtocol: '-1',
    }],
  });
});

// helper function to get around TypeScript expecting a complete event object,
// even though our tests only need some of the fields
async function invokeHandler(event: Partial<AWSLambda.CloudFormationCustomResourceEvent>) {
  return handler(event as AWSLambda.CloudFormationCustomResourceEvent);
}
