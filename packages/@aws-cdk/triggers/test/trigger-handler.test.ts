import * as AWS from 'aws-sdk';
import * as lambda from '../lib/lambda';

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('aws-sdk');

const promiseMock = jest.fn().mockResolvedValue({
  StatusCode: 200,
});

const invokeMock = jest.fn().mockReturnValue({
  promise: promiseMock,
});

(AWS.Lambda as jest.MockedClass<any>).mockImplementation(() => ({
  invoke: invokeMock,
}));

jest.useFakeTimers();

const handlerArn = 'arn:aws:lambda:us-east-1:123456789012:function:MyTrigger';
const mockRequest = {
  LogicalResourceId: 'MyTrigger',
  StackId: 'arn:aws:cloudformation:us-east-1:123456789012:stack/MyStack/12345678-1234-1234-1234-123456789012',
  ResponseURL: 'https://cloudformation-custom-resource-response-MyTrigger/',
  ResourceProperties: {
    ServiceToken: 'arn:aws:lambda:us-east-1:123456789012:function:MyFunction',
    HandlerArn: handlerArn,
  },
  RequestId: 'MyRequestId',
  ResourceType: 'Custom::Trigger',
  ServiceToken: 'arn:aws:lambda:us-east-1:123456789012:function:MyFunction',
};

test('Create', async () => {
  await lambda.handler({ RequestType: 'Create', ...mockRequest });

  expect(invokeMock).toBeCalledTimes(1);
  expect(invokeMock).toBeCalledWith({ FunctionName: handlerArn });
});

test('Update', async () => {
  await lambda.handler({ RequestType: 'Update', PhysicalResourceId: 'PRID', OldResourceProperties: {}, ...mockRequest });

  expect(invokeMock).toBeCalledTimes(1);
  expect(invokeMock).toBeCalledWith({ FunctionName: handlerArn });
});

test('Delete - handler not called', async () => {
  await lambda.handler({ RequestType: 'Delete', PhysicalResourceId: 'PRID', ...mockRequest });
  expect(invokeMock).not.toBeCalled();
});

test('non-200 status code throws an error', async () => {
  promiseMock.mockResolvedValueOnce({
    StatusCode: 500,
  });

  await expect(lambda.handler({ RequestType: 'Create', ...mockRequest }))
    .rejects
    .toMatchObject({ message: 'Trigger handler failed with status code 500' });

  expect(invokeMock).toBeCalledTimes(1);
  expect(invokeMock).toBeCalledWith({ FunctionName: handlerArn });
});

test('retry with access denied exception', async () => {
  promiseMock.mockImplementationOnce(() => {
    const error = new Error();
    (error as AWS.AWSError).code = 'AccessDeniedException';
    throw error;
  });

  const response = lambda.handler({ RequestType: 'Create', ...mockRequest });

  await Promise.resolve().then(() => jest.runAllTimers());

  await response;

  expect(invokeMock).toBeCalledTimes(2);
  expect(invokeMock).toBeCalledWith({ FunctionName: handlerArn });
});

test('throws an error for other exceptions', async () => {
  promiseMock.mockImplementationOnce(() => {
    throw new Error();
  });

  await expect(lambda.handler({ RequestType: 'Create', ...mockRequest }))
    .rejects
    .toThrow();

  expect(invokeMock).toBeCalledTimes(1);
  expect(invokeMock).toBeCalledWith({ FunctionName: handlerArn });
});

describe('function error', () => {
  const makeTest = (payload: string | undefined, expectedError: string) => {
    return async () => {
      promiseMock.mockResolvedValueOnce({
        StatusCode: 200,
        FunctionError: 'Unhandled',
        Payload: payload,
      });

      await expect(lambda.handler({ RequestType: 'Create', ...mockRequest }))
        .rejects
        .toMatchObject({ message: expectedError });

      expect(invokeMock).toBeCalledTimes(1);
      expect(invokeMock).toBeCalledWith({ FunctionName: handlerArn });
    };
  };

  test('undefined payload', makeTest(undefined, 'unknown handler error'));
  test('empty payload', makeTest('', 'unknown handler error'));
  test('invalid JSON payload', makeTest('{', '{'));
  test('valid JSON payload', makeTest('{"errorMessage": "my error"}', 'my error'));
  test('with stack trace', makeTest('{"errorMessage": "my error", "trace": "my stack trace"}', 'my error\nmy stack trace'));
});
