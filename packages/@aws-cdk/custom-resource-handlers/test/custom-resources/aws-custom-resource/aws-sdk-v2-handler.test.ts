import * as AWS from 'aws-sdk';
import { v2handler as handler } from '../../../lib/custom-resources/aws-custom-resource-handler';
import { AwsSdkCall } from '../../../lib/custom-resources/aws-custom-resource-handler/construct-types';

/* eslint-disable no-console */
console.log = jest.fn();

jest.mock('aws-sdk', () => {
  return {
    __esModule: true,
    ...jest.requireActual('aws-sdk'),
    SSM: jest.fn(() => {
      return {
        config: {
          apiVersion: 'apiVersion',
          region: 'eu-west-1',
        },
        getParameter: () => {
          return {
            promise: async () => {},
          };
        },
      };
    }),
  };
});

jest.mock('https', () => {
  return {
    request: (_: any, callback: () => void) => {
      return {
        on: () => undefined,
        write: () => true,
        end: callback,
      };
    },
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

test('SDK global credentials are never set', async () => {
  // WHEN
  await handler({
    LogicalResourceId: 'logicalResourceId',
    RequestId: 'requestId',
    RequestType: 'Create',
    ResponseURL: 'responseUrl',
    ResourceProperties: {
      Create: JSON.stringify({
        action: 'getParameter',
        assumedRoleArn: 'arn:aws:iam::123456789012:role/CoolRole',
        parameters: {
          Name: 'foo',
        },
        physicalResourceId: { id: 'id' },
        service: 'SSM',
      } satisfies AwsSdkCall),
      ServiceToken: 'serviceToken',
    },
    ResourceType: 'resourceType',
    ServiceToken: 'serviceToken',
    StackId: 'stackId',
  }, {} as AWSLambda.Context);

  // THEN
  expect(AWS.config).toBeInstanceOf(AWS.Config);
  expect(AWS.config.credentials).toBeNull();
});

test('SDK credentials are not persisted across subsequent invocations', async () => {
  // GIVEN
  const mockCreds = new AWS.ChainableTemporaryCredentials();
  jest.spyOn(AWS, 'ChainableTemporaryCredentials').mockReturnValue(mockCreds);

  // WHEN
  await handler({
    LogicalResourceId: 'logicalResourceId',
    RequestId: 'requestId',
    RequestType: 'Create',
    ResponseURL: 'responseUrl',
    ResourceProperties: {
      Create: JSON.stringify({
        action: 'getParameter',
        parameters: {
          Name: 'foo',
        },
        physicalResourceId: { id: 'id' },
        service: 'SSM',
      } satisfies AwsSdkCall),
      ServiceToken: 'serviceToken',
    },
    ResourceType: 'resourceType',
    ServiceToken: 'serviceToken',
    StackId: 'stackId',
  }, {} as AWSLambda.Context);

  await handler({
    LogicalResourceId: 'logicalResourceId',
    RequestId: 'requestId',
    RequestType: 'Create',
    ResponseURL: 'responseUrl',
    ResourceProperties: {
      Create: JSON.stringify({
        action: 'getParameter',
        assumedRoleArn: 'arn:aws:iam::123456789012:role/CoolRole',
        parameters: {
          Name: 'foo',
        },
        physicalResourceId: { id: 'id' },
        service: 'SSM',
      } satisfies AwsSdkCall),
      ServiceToken: 'serviceToken',
    },
    ResourceType: 'resourceType',
    ServiceToken: 'serviceToken',
    StackId: 'stackId',
  }, {} as AWSLambda.Context);

  await handler({
    LogicalResourceId: 'logicalResourceId',
    RequestId: 'requestId',
    RequestType: 'Create',
    ResponseURL: 'responseUrl',
    ResourceProperties: {
      Create: JSON.stringify({
        action: 'getParameter',
        parameters: {
          Name: 'foo',
        },
        physicalResourceId: { id: 'id' },
        service: 'SSM',
      } satisfies AwsSdkCall),
      ServiceToken: 'serviceToken',
    },
    ResourceType: 'resourceType',
    ServiceToken: 'serviceToken',
    StackId: 'stackId',
  }, {} as AWSLambda.Context);

  // THEN
  expect(AWS.SSM).toHaveBeenNthCalledWith(1, {
    apiVersion: undefined,
    credentials: undefined,
    region: undefined,
  });
  expect(AWS.SSM).toHaveBeenNthCalledWith(2, {
    apiVersion: undefined,
    credentials: mockCreds,
    region: undefined,
  });
  expect(AWS.SSM).toHaveBeenNthCalledWith(3, {
    apiVersion: undefined,
    credentials: undefined,
    region: undefined,
  });
});