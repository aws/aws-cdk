import * as AWS from 'aws-sdk-mock';
import * as runtime from '../../lib/state-machine-provider/runtime';
import * as http from '../../lib/state-machine-provider/runtime/http';

AWS.setSDK(require.resolve('aws-sdk'));

jest.mock('../../lib/state-machine-provider/runtime/http');

console.log = jest.fn(); // tslint:disable-line:no-console

beforeEach(() => {
  AWS.restore();
  jest.clearAllMocks();
  process.env.STATE_MACHINE_ARN = 'state-machine-arn';
});

const cfEvent: AWSLambda.CloudFormationCustomResourceEvent & { PhysicalResourceId?: string } = {
  RequestType: 'Create',
  ServiceToken: 'service-token',
  ResponseURL: 'response-url',
  StackId: 'stack-id',
  RequestId: 'request-id',
  LogicalResourceId: 'logical-resource-id',
  ResourceType: 'Custom::StateMachine',
  ResourceProperties: {
    ServiceToken: 'service-token',
    PropKey: 'PropValue',
  },
};

test('cfnResponseSuccess with CREATE', async () => {
  await runtime.cfnResponseSuccess({
    ExecutionArn: 'execution-arn',
    Input: cfEvent,
    Name: 'execution-name',
    Output: {
      PhysicalResourceId: 'physical-resource-id',
      Data: {
        DataKey: 'DataValue',
      },
    },
    StartDate: 12345678,
    StateMachineArn: 'state-machine-arn',
    Status: 'SUCCEEDED',
    StopDate: 12345679,
  });

  expect(http.respond).toHaveBeenCalledWith('SUCCESS', expect.objectContaining({
    Data: {
      DataKey: 'DataValue',
    },
    LogicalResourceId: 'logical-resource-id',
    PhysicalResourceId: 'physical-resource-id',
    RequestId: 'request-id',
    RequestType: 'Create',
    ResponseURL: 'response-url',
  }));
});

test('cfnResponseSuccess with Create and no physical resource id', async () => {
  await runtime.cfnResponseSuccess({
    ExecutionArn: 'execution-arn',
    Input: cfEvent,
    Name: 'execution-name',
    Output: {
      Data: {
        DataKey: 'DataValue',
      },
    },
    StartDate: 12345678,
    StateMachineArn: 'state-machine-arn',
    Status: 'SUCCEEDED',
    StopDate: 12345679,
  });

  expect(http.respond).toHaveBeenCalledWith('SUCCESS', expect.objectContaining({
    PhysicalResourceId: 'request-id',
  }));
});

test('cfnResponseFailed with Create', async () => {
  const cause = {
    Input: JSON.stringify(cfEvent),
  };
  await runtime.cfnResponseFailed({
    Cause: JSON.stringify(cause),
    Error: 'CreateError',
  });

  expect(http.respond).toHaveBeenCalledWith('FAILED', expect.objectContaining({
    LogicalResourceId: 'logical-resource-id',
    PhysicalResourceId: runtime.CREATE_FAILED_PHYSICAL_ID_MARKER,
    RequestId: 'request-id',
    RequestType: 'Create',
    ResponseURL: 'response-url',
    Reason: expect.stringMatching(/^CreateError:/),
  }));
});

test('cfnResponseFailed with Update', async () => {
  const cause = {
    Input: JSON.stringify({
      ...cfEvent,
      RequestType: 'Update',
      PhysicalResourceId: 'physical-resource-id',
    }),
  };
  await runtime.cfnResponseFailed({
    Cause: JSON.stringify(cause),
    Error: 'UpdateError',
  });

  expect(http.respond).toHaveBeenCalledWith('FAILED', expect.objectContaining({
    LogicalResourceId: 'logical-resource-id',
    PhysicalResourceId: 'physical-resource-id',
    RequestId: 'request-id',
    RequestType: 'Update',
    ResponseURL: 'response-url',
    Reason: expect.stringMatching(/^UpdateError:/),
  }));
});

test('startExecution with Create', async () => {
  const startExecutionMock = jest.fn();
  AWS.mock('StepFunctions', 'startExecution', (params: any, callback: (p: any) => void) =>
    callback(startExecutionMock(params)),
  );

  await runtime.startExecution(cfEvent);

  expect(startExecutionMock).toHaveBeenCalledWith({
    stateMachineArn: 'state-machine-arn',
    input: JSON.stringify(cfEvent),
  });
});

test('startExecution with Delete after failed Create', async () => {
  const startExecutionMock = jest.fn();
  AWS.mock('StepFunctions', 'startExecution', (params: any, callback: (p: any) => void) =>
    callback(startExecutionMock(params)),
  );

  await runtime.startExecution({
    ...cfEvent,
    RequestType: 'Delete',
    PhysicalResourceId: runtime.CREATE_FAILED_PHYSICAL_ID_MARKER,
  });

  expect(startExecutionMock).not.toHaveBeenCalled();
  expect(http.respond).toHaveBeenCalledWith('SUCCESS', expect.anything());
});

test('startExecution with error', async () => {
  AWS.mock('StepFunctions', 'startExecution', (_params: any, callback: (p: any) => void) =>
    callback(new Error('UnknownError')),
  );

  await runtime.startExecution(cfEvent);

  expect(http.respond).toHaveBeenCalledWith('FAILED', expect.objectContaining({
    Reason: 'UnknownError',
  }));
});
