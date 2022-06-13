import * as lambda from '../lib/lambda';

afterEach(() => {
  jest.resetAllMocks();
});

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
  const invokeMock = jest.spyOn(lambda, 'invoke').mockResolvedValue({
    StatusCode: 200,
  });

  await lambda.handler({ RequestType: 'Create', ...mockRequest });

  expect(invokeMock).toBeCalledTimes(1);
  expect(invokeMock).toBeCalledWith(handlerArn);
});

test('Update', async () => {
  const invokeMock = jest.spyOn(lambda, 'invoke').mockResolvedValue({
    StatusCode: 200,
  });

  await lambda.handler({ RequestType: 'Update', PhysicalResourceId: 'PRID', OldResourceProperties: {}, ...mockRequest });

  expect(invokeMock).toBeCalledTimes(1);
  expect(invokeMock).toBeCalledWith(handlerArn);
});

test('Delete - handler not called', async () => {
  const invokeMock = jest.spyOn(lambda, 'invoke');
  await lambda.handler({ RequestType: 'Delete', PhysicalResourceId: 'PRID', ...mockRequest });
  expect(invokeMock).not.toBeCalled();
});

test('non-200 status code throws an error', async () => {
  const invokeMock = jest.spyOn(lambda, 'invoke').mockResolvedValue({
    StatusCode: 500,
  });

  await expect(lambda.handler({ RequestType: 'Create', ...mockRequest }))
    .rejects
    .toMatchObject({ message: 'Trigger handler failed with status code 500' });

  expect(invokeMock).toBeCalledTimes(1);
  expect(invokeMock).toBeCalledWith(handlerArn);
});

describe('function error', () => {

  const makeTest = (payload: string | undefined, expectedError: string) => {
    return async () => {
      const invokeMock = jest.spyOn(lambda, 'invoke').mockResolvedValue({
        StatusCode: 200,
        FunctionError: 'Unhandled',
        Payload: payload,
      });

      await expect(lambda.handler({ RequestType: 'Create', ...mockRequest }))
        .rejects
        .toMatchObject({ message: expectedError });

      expect(invokeMock).toBeCalledTimes(1);
      expect(invokeMock).toBeCalledWith(handlerArn);
    };
  };

  test('undefined payload', makeTest(undefined, 'unknown handler error'));
  test('empty payload', makeTest('', 'unknown handler error'));
  test('invalid JSON payload', makeTest('{', '{'));
  test('valid JSON payload', makeTest('{"errorMessage": "my error"}', 'my error'));
  test('with stack trace', makeTest('{"errorMessage": "my error", "trace": "my stack trace"}', 'my error\nmy stack trace'));
});
