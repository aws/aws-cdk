import { AccessDeniedException } from '@aws-sdk/client-account';
import * as lambda from '../lib/lambda';

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation();
});

afterAll(() => {
  jest.restoreAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('aws-sdk');

const mockInvoke = jest.fn().mockResolvedValue({
  StatusCode: 200,
});

jest.mock('@aws-sdk/client-lambda', () => {
  return {
    Lambda: jest.fn().mockImplementation(() => {
      return {
        invoke: mockInvoke,
      };
    }),
  };
});

jest.useFakeTimers();

const handlerArn = 'arn:aws:lambda:us-east-1:123456789012:function:MyTrigger';
const mockRequest = {
  LogicalResourceId: 'MyTrigger',
  StackId: 'arn:aws:cloudformation:us-east-1:123456789012:stack/MyStack/12345678-1234-1234-1234-123456789012',
  ResponseURL: 'https://cloudformation-custom-resource-response-MyTrigger/',
  ResourceProperties: {
    ServiceToken: 'arn:aws:lambda:us-east-1:123456789012:function:MyFunction',
    HandlerArn: handlerArn,
    Timeout: '600',
    InvocationType: 'Event',
  },
  RequestId: 'MyRequestId',
  ResourceType: 'Custom::Trigger',
  ServiceToken: 'arn:aws:lambda:us-east-1:123456789012:function:MyFunction',
};

test('Create', async () => {
  await lambda.handler({ RequestType: 'Create', ...mockRequest });

  expect(mockInvoke).toBeCalledTimes(1);
  expect(mockInvoke).toBeCalledWith({ FunctionName: handlerArn, InvocationType: 'Event' });
});

test('Update', async () => {
  await lambda.handler({ RequestType: 'Update', PhysicalResourceId: 'PRID', OldResourceProperties: {}, ...mockRequest });

  expect(mockInvoke).toBeCalledTimes(1);
  expect(mockInvoke).toBeCalledWith({ FunctionName: handlerArn, InvocationType: 'Event' });
});

test('Delete - handler not called', async () => {
  await lambda.handler({ RequestType: 'Delete', PhysicalResourceId: 'PRID', ...mockRequest });
  expect(mockInvoke).not.toBeCalled();
});

test('non-200 status code throws an error', async () => {
  mockInvoke.mockResolvedValueOnce({
    StatusCode: 500,
  });

  await expect(lambda.handler({ RequestType: 'Create', ...mockRequest }))
    .rejects
    .toMatchObject({ message: 'Trigger handler failed with status code 500' });

  expect(mockInvoke).toBeCalledTimes(1);
  expect(mockInvoke).toBeCalledWith({ FunctionName: handlerArn, InvocationType: 'Event' });
});

test('202 status code success', async () => {
  mockInvoke.mockResolvedValueOnce({
    StatusCode: 202,
  });

  await lambda.handler(({ RequestType: 'Create', ...mockRequest }));

  expect(mockInvoke).toBeCalledTimes(1);
  expect(mockInvoke).toBeCalledWith({ FunctionName: handlerArn, InvocationType: 'Event' });
});

test('retry with access denied exception', async () => {
  mockInvoke.mockImplementationOnce(() => {
    const error = new AccessDeniedException({
      message: 'AccessDeniedException',
    } as AccessDeniedException);
    return Promise.reject(error);
  });

  const response = lambda.handler({ RequestType: 'Create', ...mockRequest });

  await Promise.resolve().then(() => jest.runAllTimers());

  await response;

  expect(mockInvoke).toBeCalledTimes(2);
  expect(mockInvoke).toBeCalledWith({ FunctionName: handlerArn, InvocationType: 'Event' });
});

test('throws an error for other exceptions', async () => {
  mockInvoke.mockImplementationOnce(() => {
    throw new Error();
  });

  await expect(lambda.handler({ RequestType: 'Create', ...mockRequest }))
    .rejects
    .toThrow();

  expect(mockInvoke).toBeCalledTimes(1);
  expect(mockInvoke).toBeCalledWith({ FunctionName: handlerArn, InvocationType: 'Event' });
});

describe('function error', () => {
  const makeTest = (payload: string | undefined, expectedError: string) => {
    return async () => {
      mockInvoke.mockResolvedValueOnce({
        StatusCode: 200,
        FunctionError: 'Unhandled',
        Payload: payload,
      });

      await expect(lambda.handler({ RequestType: 'Create', ...mockRequest }))
        .rejects
        .toMatchObject({ message: expectedError });

      expect(mockInvoke).toBeCalledTimes(1);
      expect(mockInvoke).toBeCalledWith({ FunctionName: handlerArn, InvocationType: 'Event' });
    };
  };

  test('undefined payload', makeTest(undefined, 'unknown handler error'));
  test('empty payload', makeTest('', 'unknown handler error'));
  test('invalid JSON payload', makeTest('{', '{'));
  test('valid JSON payload', makeTest('{"errorMessage": "my error"}', 'my error'));
  test('with stack trace', makeTest('{"errorMessage": "my error", "trace": "my stack trace"}', 'my error\nmy stack trace'));
});
