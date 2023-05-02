// eslint-disable-next-line import/no-extraneous-dependencies
import * as S3 from '@aws-sdk/client-s3';
import { PhysicalResourceId } from '../../../lib';
import { handler } from '../../../lib/aws-custom-resource/runtime/aws-sdk-v3-handler';

/* eslint-disable no-console */
console.log = jest.fn();

jest.mock('@aws-sdk/client-s3', () => {
  return {
    ...jest.requireActual('@aws-sdk/client-s3'),
    S3Client: jest.fn(() => {
      return {
        config: {
          apiVersion: 'apiVersion',
          region: 'eu-west-1',
        },
        send: () => {
          return {
            promise: async () => {},
          };
        },
      };
    }),
  };
});

jest.mock('@aws-sdk/credential-providers', () => {
  return {
    fromTemporaryCredentials: jest.fn(() => ({})),
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

test('SDK credentials are not persisted across subsequent invocations', async () => {
  // GIVEN
  const credentialProviders = await import('@aws-sdk/credential-providers' as string);
  const mockCreds = credentialProviders.fromTemporaryCredentials({
    params: { RoleArn: 'arn:aws:iam::123456789012:role/CoolRole' },
  });
  jest.spyOn(credentialProviders, 'fromTemporaryCredentials').mockReturnValue(mockCreds);

  // WHEN
  await handler({
    LogicalResourceId: 'logicalResourceId',
    RequestId: 'requestId',
    RequestType: 'Create',
    ResponseURL: 'responseUrl',
    ResourceProperties: {
      Create: JSON.stringify({
        action: 'getObject',
        parameters: {
          Bucket: 'foo',
          Key: 'bar',
        },
        physicalResourceId: PhysicalResourceId.of('id'),
        service: 'S3',
      }),
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
        action: 'getObject',
        assumedRoleArn: 'arn:aws:iam::123456789012:role/CoolRole',
        parameters: {
          Bucket: 'foo',
          Key: 'bar',
        },
        physicalResourceId: PhysicalResourceId.of('id'),
        service: 'S3',
      }),
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
        action: 'getObject',
        parameters: {
          Bucket: 'foo',
          Key: 'bar',
        },
        physicalResourceId: PhysicalResourceId.of('id'),
        service: 'S3',
      }),
      ServiceToken: 'serviceToken',
    },
    ResourceType: 'resourceType',
    ServiceToken: 'serviceToken',
    StackId: 'stackId',
  }, {} as AWSLambda.Context);

  // THEN
  expect(S3.S3Client).toHaveBeenNthCalledWith(1, {
    apiVersion: undefined,
    credentials: undefined,
    region: undefined,
  });
  expect(S3.S3Client).toHaveBeenNthCalledWith(2, {
    apiVersion: undefined,
    credentials: mockCreds,
    region: undefined,
  });
  expect(S3.S3Client).toHaveBeenNthCalledWith(3, {
    apiVersion: undefined,
    credentials: undefined,
    region: undefined,
  });
});