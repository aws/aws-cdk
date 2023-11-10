/* eslint-disable import/no-extraneous-dependencies */
import { AccessDeniedException } from '@aws-sdk/client-account';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { Uint8ArrayBlobAdapter } from '@smithy/util-stream';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest' ;
import * as lambda from '../../lib/triggers/lambda/index';

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation();
});

afterAll(() => {
  jest.restoreAllMocks();
});

const lambdaMock = mockClient(LambdaClient);
afterEach(() => {
  lambdaMock.reset();
});

jest.useFakeTimers();

const handlerArn = 'arn:aws:lambda:us-east-1:123456789012:function:MyTrigger';
const mockRequest = {
  LogicalResourceId: 'MyTrigger',
  StackId: 'arn:aws:cloudformation:us-east-1:123456789012:stack/MyStack/12345678-1234-1234-1234-123456789012',
  ResponseURL: 'https://cloudformation-custom-resource-response-MyTrigger/',
  RequestId: 'MyRequestId',
  ResourceType: 'Custom::Trigger',
  ServiceToken: 'arn:aws:lambda:us-east-1:123456789012:function:MyFunction',
};
const mockResourceProperties = {
  ServiceToken: 'arn:aws:lambda:us-east-1:123456789012:function:MyFunction',
  HandlerArn: handlerArn,
  Timeout: '600',
  InvocationType: 'Event',
  ExecuteOnHandlerChange: 'true',
};

test('Create', async () => {
  lambdaMock.on(InvokeCommand).resolves({ StatusCode: 200 });

  await lambda.handler({ RequestType: 'Create', ResourceProperties: mockResourceProperties, ...mockRequest });

  expect(lambdaMock).toHaveReceivedCommandTimes(InvokeCommand, 1);
  expect(lambdaMock).toHaveReceivedCommandWith(InvokeCommand, { FunctionName: handlerArn, InvocationType: 'Event' });
});

test('Update', async () => {
  lambdaMock.on(InvokeCommand).resolves({ StatusCode: 200 });

  await lambda.handler({ RequestType: 'Update', PhysicalResourceId: 'PRID', OldResourceProperties: {}, ResourceProperties: mockResourceProperties, ...mockRequest });

  expect(lambdaMock).toHaveReceivedCommandTimes(InvokeCommand, 1);
  expect(lambdaMock).toHaveReceivedCommandWith(InvokeCommand, { FunctionName: handlerArn, InvocationType: 'Event' });
});

test('Update with ExecuteOnHandlerChange = false', async () => {
  const resourceProperties = {
    ServiceToken: 'arn:aws:lambda:us-east-1:123456789012:function:MyFunction',
    HandlerArn: handlerArn,
    Timeout: '600',
    InvocationType: 'Event',
    ExecuteOnHandlerChange: 'false',
  };

  lambdaMock.on(InvokeCommand).resolves({ StatusCode: 200 });

  await lambda.handler({ RequestType: 'Update', PhysicalResourceId: 'PRID', OldResourceProperties: {}, ResourceProperties: resourceProperties, ...mockRequest });

  expect(lambdaMock).not.toHaveReceivedCommand(InvokeCommand);
});

test('Response Payload is logged', async () => {
  const mockPayload = JSON.stringify({ foo: 'bar' });
  lambdaMock.on(InvokeCommand).resolves({
    StatusCode: 200,
    Payload: Uint8ArrayBlobAdapter.fromString(mockPayload),
  });

  await lambda.handler({ RequestType: 'Create', ResourceProperties: mockResourceProperties, ...mockRequest });

  // eslint-disable-next-line no-console
  expect(console.log).toHaveBeenCalledWith(expect.objectContaining({
    invokeResponse: {
      StatusCode: 200,
      Payload: mockPayload,
    },
  }));
});

test('Delete - handler not called', async () => {
  lambdaMock.on(InvokeCommand).resolves({ StatusCode: 200 });
  await lambda.handler({ RequestType: 'Delete', PhysicalResourceId: 'PRID', ResourceProperties: mockResourceProperties, ...mockRequest });
  expect(lambdaMock).not.toHaveReceivedCommand(InvokeCommand);
});

test('non-200 status code throws an error', async () => {
  lambdaMock.on(InvokeCommand).resolves({ StatusCode: 500 });

  await expect(lambda.handler({ RequestType: 'Create', ResourceProperties: mockResourceProperties, ...mockRequest }))
    .rejects
    .toMatchObject({ message: 'Trigger handler failed with status code 500' });

  expect(lambdaMock).toHaveReceivedCommandTimes(InvokeCommand, 1);
  expect(lambdaMock).toHaveReceivedCommandWith(InvokeCommand, { FunctionName: handlerArn, InvocationType: 'Event' });
});

test('202 status code success', async () => {
  lambdaMock.on(InvokeCommand).resolves({ StatusCode: 202 });

  await lambda.handler(({ RequestType: 'Create', ResourceProperties: mockResourceProperties, ...mockRequest }));

  expect(lambdaMock).toHaveReceivedCommandTimes(InvokeCommand, 1);
  expect(lambdaMock).toHaveReceivedCommandWith(InvokeCommand, { FunctionName: handlerArn, InvocationType: 'Event' });
});

test('retry with access denied exception', async () => {
  lambdaMock.on(InvokeCommand)
    .rejectsOnce(new AccessDeniedException({
      $metadata: {},
      message: 'AccessDeniedException',
    }))
    .resolvesOnce({ StatusCode: 200 });

  const response = lambda.handler({ RequestType: 'Create', ResourceProperties: mockResourceProperties, ...mockRequest });

  // Handler uses timers to schedule a retry
  // Advance time enough to clear them, before awaiting the response
  await jest.advanceTimersByTimeAsync(10000);

  await response;

  expect(lambdaMock).toHaveReceivedCommandTimes(InvokeCommand, 2);
  expect(lambdaMock).toHaveReceivedNthCommandWith(1, InvokeCommand, { FunctionName: handlerArn, InvocationType: 'Event' });
  expect(lambdaMock).toHaveReceivedNthCommandWith(2, InvokeCommand, { FunctionName: handlerArn, InvocationType: 'Event' });
});

test('throws an error for other exceptions', async () => {
  lambdaMock.on(InvokeCommand).rejectsOnce(new Error());

  await expect(lambda.handler({ RequestType: 'Create', ResourceProperties: mockResourceProperties, ...mockRequest }))
    .rejects
    .toThrow();

  expect(lambdaMock).toHaveReceivedCommandTimes(InvokeCommand, 1);
  expect(lambdaMock).toHaveReceivedCommandWith(InvokeCommand, { FunctionName: handlerArn, InvocationType: 'Event' });
});

describe('function error', () => {
  const makeTest = (payload: string | undefined, expectedError: string) => {
    return async () => {

      lambdaMock.on(InvokeCommand).resolvesOnce({
        StatusCode: 200,
        FunctionError: 'Unhandled',
        Payload: payload ? Uint8ArrayBlobAdapter.fromString(payload) : undefined,
      });

      await expect(lambda.handler({ RequestType: 'Create', ResourceProperties: mockResourceProperties, ...mockRequest }))
        .rejects
        .toMatchObject({ message: expectedError });

      expect(lambdaMock).toHaveReceivedCommandTimes(InvokeCommand, 1);
      expect(lambdaMock).toHaveReceivedCommandWith(InvokeCommand, { FunctionName: handlerArn, InvocationType: 'Event' });
    };
  };

  test('undefined payload', makeTest(undefined, 'unknown handler error'));
  test('empty payload', makeTest('', 'unknown handler error'));
  test('invalid JSON payload', makeTest('{', '{'));
  test('valid JSON payload', makeTest('{"errorMessage": "my error"}', 'my error'));
  test('with stack trace', makeTest('{"errorMessage": "my error", "trace": "my stack trace"}', 'my error\nmy stack trace'));
});
