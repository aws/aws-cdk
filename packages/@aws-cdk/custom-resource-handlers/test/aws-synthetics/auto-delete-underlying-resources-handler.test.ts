const mockSyntheticsClient = {
  send: jest.fn(),
};
const mockLambdaClient = {
  send: jest.fn(),
};
const mockGetCanaryCommand = jest.fn().mockImplementation(() => { return {}; });
const mockDeleteFunctionCommand = jest.fn().mockImplementation(() => { return {}; });

import { autoDeleteHandler } from '../../lib/aws-synthetics/auto-delete-underlying-resources-handler';

jest.mock('@aws-sdk/client-lambda', () => {
  return {
    LambdaClient: jest.fn().mockImplementation(() => {
      return mockLambdaClient;
    }),
    DeleteFunctionCommand: mockDeleteFunctionCommand,
  };
});

jest.mock('@aws-sdk/client-synthetics', () => {
  return {
    SyntheticsClient: jest.fn().mockImplementation(() => {
      return mockSyntheticsClient;
    }),
    GetCanaryCommand: mockGetCanaryCommand,
  };
});

beforeEach(() => {
  mockSyntheticsClient.send.mockReturnThis();
  mockLambdaClient.send.mockReturnThis();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('does nothing on create event', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceCreateEvent> = {
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'Foo',
      CanaryName: 'MyCanary',
    },
  };

  // WHEN
  await invokeHandler(event);

  // THEN
  expect(mockSyntheticsClient.send).toHaveBeenCalledTimes(0);
  expect(mockLambdaClient.send).toHaveBeenCalledTimes(0);
});

test('does nothing on update event when everything remains the same', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceUpdateEvent> = {
    RequestType: 'Update',
    ResourceProperties: {
      ServiceToken: 'Foo',
      CanaryName: 'MyCanary',
    },
    OldResourceProperties: {
      ServiceToken: 'Foo',
      CanaryName: 'MyCanary',
    },
  };

  // WHEN
  await invokeHandler(event);

  // THEN
  expect(mockSyntheticsClient.send).toHaveBeenCalledTimes(0);
  expect(mockLambdaClient.send).toHaveBeenCalledTimes(0);
});

test('does nothing on update event when the bucket name remains the same but the service token changes', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceUpdateEvent> = {
    RequestType: 'Update',
    ResourceProperties: {
      ServiceToken: 'Foo',
      CanaryName: 'MyCanary',
    },
    OldResourceProperties: {
      ServiceToken: 'Bar',
      CanaryName: 'MyCanary',
    },
  };

  // WHEN
  await invokeHandler(event);

  // THEN
  expect(mockSyntheticsClient.send).toHaveBeenCalledTimes(0);
  expect(mockLambdaClient.send).toHaveBeenCalledTimes(0);
});

test('does nothing on update event when the old resource properties are absent', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceUpdateEvent> = {
    RequestType: 'Update',
    ResourceProperties: {
      ServiceToken: 'Foo',
      CanaryName: 'MyCanary',
    },
  };

  // WHEN
  await invokeHandler(event);

  // THEN
  expect(mockSyntheticsClient.send).toHaveBeenCalledTimes(0);
  expect(mockLambdaClient.send).toHaveBeenCalledTimes(0);
});

test('does nothing on update event when the new resource properties are absent', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceUpdateEvent> = {
    RequestType: 'Update',
    OldResourceProperties: {
      ServiceToken: 'Foo',
      CanaryName: 'MyCanary',
    },
  };

  // WHEN
  await invokeHandler(event);

  // THEN
  expect(mockSyntheticsClient.send).toHaveBeenCalledTimes(0);
  expect(mockLambdaClient.send).toHaveBeenCalledTimes(0);
});

test('deletes lambda when the name changes on update event', async () => {
  // GIVEN
  const id = '0000-0000-00000000';
  mockSyntheticsClient.send.mockReturnValue({
    Canary: {
      Tags: {
        'aws-cdk:auto-delete-underlying-resources': 'true',
      },
      Id: id,
    },
  });

  const event: Partial<AWSLambda.CloudFormationCustomResourceUpdateEvent> = {
    RequestType: 'Update',
    OldResourceProperties: {
      ServiceToken: 'Foo',
      CanaryName: 'MyCanary',
    },
    ResourceProperties: {
      ServiceToken: 'Foo',
      CanaryName: 'MyCanary-renamed',
    },
  };

  // WHEN
  const result = await invokeHandler(event);

  // THEN
  expect((result as any).PhysicalResourceId).toEqual('MyCanary-renamed');
});

test('deletes lambda on delete', async () => {
  // GIVEN
  const id = '0000-0000-00000000';
  mockSyntheticsClient.send.mockReturnValue({
    Canary: {
      Tags: {
        'aws-cdk:auto-delete-underlying-resources': 'true',
      },
      Id: id,
      EngineArn: `arn:aws:lambda:region:account:function:cwsyn-name-${id}:1`,
    },
  });

  // WHEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceDeleteEvent> = {
    RequestType: 'Delete',
    ResourceProperties: {
      ServiceToken: 'Foo',
      CanaryName: 'MyCanary',
    },
  };
  await invokeHandler(event);

  // THEN
  expect(mockSyntheticsClient.send).toHaveBeenCalledTimes(1);
  expect(mockGetCanaryCommand).toHaveBeenCalledWith({ Name: 'MyCanary' });
  expect(mockLambdaClient.send).toHaveBeenCalledTimes(1);
  expect(mockDeleteFunctionCommand).toHaveBeenCalledWith({
    FunctionName: `arn:aws:lambda:region:account:function:cwsyn-name-${id}`,
  });
});

test('does not delete lambda if canary is not tagged', async () => {
  // GIVEN
  const id = '0000-0000-00000000';
  mockSyntheticsClient.send.mockReturnValue({
    Canary: {
      Id: id,
      EngineArn: `arn:aws:lambda:region:account:function:cwsyn-name-${id}:1`,
    },
  });

  // WHEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceDeleteEvent> = {
    RequestType: 'Delete',
    ResourceProperties: {
      ServiceToken: 'Foo',
      CanaryName: 'MyCanary',
    },
  };
  await invokeHandler(event);

  // THEN
  expect(mockSyntheticsClient.send).toHaveBeenCalledTimes(1);
  expect(mockLambdaClient.send).not.toHaveBeenCalled();
});

test('does nothing when the canary does not exist', async () => {
  // GIVEN
  mockSyntheticsClient.send.mockRejectedValue({ name: 'ResourceNotFoundException' });

  // WHEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceDeleteEvent> = {
    RequestType: 'Delete',
    ResourceProperties: {
      ServiceToken: 'Foo',
      CanaryName: 'MyCanary',
    },
  };
  await invokeHandler(event);

  expect(mockLambdaClient.send).not.toHaveBeenCalled();
});

test('does nothing when the lambda does not exist', async () => {
  // GIVEN
  mockLambdaClient.send.mockRejectedValue({ name: 'ResourceNotFoundException' });

  // WHEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceDeleteEvent> = {
    RequestType: 'Delete',
    ResourceProperties: {
      ServiceToken: 'Foo',
      CanaryName: 'MyCanary',
    },
  };

  await invokeHandler(event);

  // expect no error
});

// helper function to get around TypeScript expecting a complete event object,
// even though our tests only need some of the fields
async function invokeHandler(event: Partial<AWSLambda.CloudFormationCustomResourceEvent>) {
  return autoDeleteHandler(event as AWSLambda.CloudFormationCustomResourceEvent);
}
