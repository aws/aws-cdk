// eslint-disable-next-line import/no-extraneous-dependencies
import { CloudWatchLogsClient, CloudWatchLogsClientResolvedConfig, CreateLogGroupCommand, DeleteLogGroupCommand, DeleteRetentionPolicyCommand, OperationAbortedException, PutRetentionPolicyCommand, ResourceAlreadyExistsException, ServiceInputTypes, ServiceOutputTypes } from '@aws-sdk/client-cloudwatch-logs';
import { AwsStub, mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import * as nock from 'nock';
import * as provider from '../../lib/aws-logs/log-retention-handler/index';

const cloudwatchLogsMock = mockClient(CloudWatchLogsClient);
const OPERATION_ABORTED = new OperationAbortedException({ message: '', $metadata: {} });
const RESOURCE_ALREADY_EXISTS = new ResourceAlreadyExistsException({ message: '', $metadata: {} });

type RequestType = 'Create' | 'Update' | 'Delete';

const eventCommon = {
  ServiceToken: 'token',
  ResponseURL: 'https://localhost',
  StackId: 'stackId',
  RequestId: 'requestId',
  LogicalResourceId: 'logicalResourceId',
  PhysicalResourceId: 'group',
  ResourceType: 'Custom::LogRetention',
};

const context = {
  functionName: 'provider',
} as AWSLambda.Context;

function createRequest(type: string) {
  return nock('https://localhost')
    .put('/', (body: AWSLambda.CloudFormationCustomResourceResponse) => (
      body.Status === type
      && body.PhysicalResourceId === 'group'
      && !body.Reason?.includes('Nock')
    ))
    .reply(200);
}

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('log retention provider', () => {
  afterEach(() => {
    cloudwatchLogsMock.reset();
    nock.cleanAll();
  });

  test('create event', async () => {
    cloudwatchLogsMock.on(CreateLogGroupCommand).resolves({});
    cloudwatchLogsMock.on(PutRetentionPolicyCommand).resolves({});
    cloudwatchLogsMock.on(DeleteRetentionPolicyCommand).resolves({});

    const event = {
      ...eventCommon,
      RequestType: 'Create' as RequestType,
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '30',
        LogGroupName: 'group',
      },
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event, context);

    expect(cloudwatchLogsMock).toHaveReceivedCommandWith(CreateLogGroupCommand, {
      logGroupName: 'group',
    });

    expect(cloudwatchLogsMock).toHaveReceivedCommandWith(PutRetentionPolicyCommand, {
      logGroupName: 'group',
      retentionInDays: 30,
    });

    expect(cloudwatchLogsMock).toHaveReceivedCommandWith(CreateLogGroupCommand, {
      logGroupName: '/aws/lambda/provider',
    });

    expect(cloudwatchLogsMock).toHaveReceivedCommandWith(PutRetentionPolicyCommand, {
      logGroupName: '/aws/lambda/provider',
      retentionInDays: 1,
    });

    expect(cloudwatchLogsMock).not.toHaveReceivedCommand(DeleteRetentionPolicyCommand);

    expect(request.isDone()).toEqual(true);
  });

  test('update event with new log retention', async () => {
    cloudwatchLogsMock.on(CreateLogGroupCommand).resolves({});
    cloudwatchLogsMock.on(PutRetentionPolicyCommand).resolves({});
    cloudwatchLogsMock.on(DeleteRetentionPolicyCommand).resolves({});

    const event = {
      ...eventCommon,
      RequestType: 'Update' as RequestType,
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '365',
        LogGroupName: 'group',
      },
      OldResourceProperties: {
        ServiceToken: 'token',
        LogGroupName: 'group',
        RetentionInDays: '30',
      },
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event, context);

    expect(cloudwatchLogsMock).toHaveReceivedCommandWith(CreateLogGroupCommand, {
      logGroupName: 'group',
    });

    expect(cloudwatchLogsMock).toHaveReceivedCommandWith(PutRetentionPolicyCommand, {
      logGroupName: 'group',
      retentionInDays: 365,
    });

    expect(cloudwatchLogsMock).not.toHaveReceivedCommand(DeleteRetentionPolicyCommand);

    expect(request.isDone()).toEqual(true);

  });

  test('update event with log retention undefined', async () => {
    cloudwatchLogsMock.on(CreateLogGroupCommand).rejects(RESOURCE_ALREADY_EXISTS);
    cloudwatchLogsMock.on(PutRetentionPolicyCommand).resolves({});
    cloudwatchLogsMock.on(DeleteRetentionPolicyCommand).resolves({});

    const event = {
      ...eventCommon,
      RequestType: 'Update' as RequestType,
      PhysicalResourceId: 'group',
      ResourceProperties: {
        ServiceToken: 'token',
        LogGroupName: 'group',
      },
      OldResourceProperties: {
        ServiceToken: 'token',
        LogGroupName: 'group',
        RetentionInDays: '365',
      },
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event, context);

    expect(cloudwatchLogsMock).toHaveReceivedCommandWith(CreateLogGroupCommand, {
      logGroupName: 'group',
    });

    expect(cloudwatchLogsMock).toHaveReceivedCommandWith(DeleteRetentionPolicyCommand, {
      logGroupName: 'group',
    });

    expect(request.isDone()).toEqual(true);

  });

  test('delete event', async () => {
    cloudwatchLogsMock.on(CreateLogGroupCommand).resolves({});
    cloudwatchLogsMock.on(PutRetentionPolicyCommand).resolves({});
    cloudwatchLogsMock.on(DeleteRetentionPolicyCommand).resolves({});

    const event = {
      ...eventCommon,
      RequestType: 'Delete' as RequestType,
      PhysicalResourceId: 'group',
      ResourceProperties: {
        ServiceToken: 'token',
        LogGroupName: 'group',
      },
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event, context);

    expect(cloudwatchLogsMock).not.toHaveReceivedCommand(CreateLogGroupCommand);
    expect(cloudwatchLogsMock).not.toHaveReceivedCommand(PutRetentionPolicyCommand);
    expect(cloudwatchLogsMock).not.toHaveReceivedCommand(DeleteRetentionPolicyCommand);

    expect(request.isDone()).toEqual(true);

  });

  test('delete event with RemovalPolicy', async () => {
    cloudwatchLogsMock.on(CreateLogGroupCommand).resolves({});
    cloudwatchLogsMock.on(DeleteLogGroupCommand).resolves({});
    cloudwatchLogsMock.on(PutRetentionPolicyCommand).resolves({});
    cloudwatchLogsMock.on(DeleteRetentionPolicyCommand).resolves({});

    const event = {
      ...eventCommon,
      RequestType: 'Delete' as RequestType,
      PhysicalResourceId: 'group',
      ResourceProperties: {
        ServiceToken: 'token',
        LogGroupName: 'group',
        RemovalPolicy: 'destroy',
      },
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event, context);

    expect(cloudwatchLogsMock).not.toHaveReceivedCommand(CreateLogGroupCommand);
    expect(cloudwatchLogsMock).toHaveReceivedCommandWith(DeleteLogGroupCommand, {
      logGroupName: 'group',
    });
    expect(cloudwatchLogsMock).not.toHaveReceivedCommand(PutRetentionPolicyCommand);
    expect(cloudwatchLogsMock).not.toHaveReceivedCommand(DeleteRetentionPolicyCommand);

    expect(request.isDone()).toEqual(true);

  });

  test('responds with FAILED on error', async () => {
    cloudwatchLogsMock.on(CreateLogGroupCommand).rejects('UnknownError');

    const event = {
      ...eventCommon,
      RequestType: 'Create' as RequestType,
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '30',
        LogGroupName: 'group',
      },
    };

    const request = createRequest('FAILED');

    await provider.handler(event, context);

    expect(request.isDone()).toEqual(true);

  });

  test('succeeds when createLogGroup for provider log group returns OperationAbortedException twice', async () => {
    failTwiceThenResolve(cloudwatchLogsMock, CreateLogGroupCommand, '/aws/lambda/provider');
    cloudwatchLogsMock.on(PutRetentionPolicyCommand).resolves({});
    cloudwatchLogsMock.on(DeleteRetentionPolicyCommand).resolves({});

    const event = {
      ...eventCommon,
      RequestType: 'Create' as RequestType,
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '30',
        LogGroupName: 'group',
      },
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event, context);

    expect(request.isDone()).toEqual(true);

  });

  test('succeeds when createLogGroup for CDK lambda log group returns OperationAbortedException twice', async () => {
    failTwiceThenResolve(cloudwatchLogsMock, CreateLogGroupCommand, 'group');
    cloudwatchLogsMock.on(PutRetentionPolicyCommand).resolves({});
    cloudwatchLogsMock.on(DeleteRetentionPolicyCommand).resolves({});

    const event = {
      ...eventCommon,
      RequestType: 'Create' as RequestType,
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '30',
        LogGroupName: 'group',
      },
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event, context);

    expect(request.isDone()).toEqual(true);

  });

  test('fails when createLogGroup for CDK lambda log group fails with OperationAbortedException indefinitely', async () => {
    cloudwatchLogsMock.on(CreateLogGroupCommand, { logGroupName: 'group' } ).rejects(OPERATION_ABORTED);
    cloudwatchLogsMock.on(PutRetentionPolicyCommand).resolves({});
    cloudwatchLogsMock.on(DeleteRetentionPolicyCommand).resolves({});

    const event = {
      ...eventCommon,
      RequestType: 'Create' as RequestType,
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '30',
        LogGroupName: 'group',
        SdkRetry: { maxRetries: '3' },
      },
    };

    const request = createRequest('FAILED');

    await provider.handler(event, context);

    expect(request.isDone()).toEqual(true);

  });

  test('succeeds when putRetentionPolicy for provider log group returns OperationAbortedException twice', async () => {
    cloudwatchLogsMock.on(CreateLogGroupCommand).resolves({});
    failTwiceThenResolve(cloudwatchLogsMock, PutRetentionPolicyCommand, '/aws/lambda/provider');
    cloudwatchLogsMock.on(DeleteRetentionPolicyCommand).resolves({});

    const event = {
      ...eventCommon,
      RequestType: 'Create' as RequestType,
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '30',
        LogGroupName: 'group',
      },
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event, context);

    expect(request.isDone()).toEqual(true);

  });

  test('succeeds when putRetentionPolicy for CDK lambda log group returns OperationAbortedException twice', async () => {
    cloudwatchLogsMock.on(CreateLogGroupCommand).resolves({});
    failTwiceThenResolve(cloudwatchLogsMock, PutRetentionPolicyCommand, 'group');
    cloudwatchLogsMock.on(DeleteRetentionPolicyCommand).resolves({});

    const event = {
      ...eventCommon,
      RequestType: 'Create' as RequestType,
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '30',
        LogGroupName: 'group',
      },
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event, context);

    expect(request.isDone()).toEqual(true);

  });

  test('fails when putRetentionPolicy for CDK lambda log group fails with OperationAbortedException indefinitely', async () => {
    cloudwatchLogsMock.on(CreateLogGroupCommand).resolves({});
    cloudwatchLogsMock.on(PutRetentionPolicyCommand, { logGroupName: 'group' }).rejects(OPERATION_ABORTED);
    cloudwatchLogsMock.on(DeleteRetentionPolicyCommand).resolves({});

    const event = {
      ...eventCommon,
      RequestType: 'Create' as RequestType,
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '30',
        LogGroupName: 'group',
        SdkRetry: { maxRetries: '3' },
      },
    };

    const request = createRequest('FAILED');

    await provider.handler(event, context);

    expect(request.isDone()).toEqual(true);

  });

  test('succeeds when deleteRetentionPolicy for provider log group returns OperationAbortedException twice', async () => {
    cloudwatchLogsMock.on(CreateLogGroupCommand).resolves({});
    cloudwatchLogsMock.on(PutRetentionPolicyCommand).resolves({});
    failTwiceThenResolve(cloudwatchLogsMock, DeleteRetentionPolicyCommand, '/aws/lambda/provider');

    const event = {
      ...eventCommon,
      RequestType: 'Create' as RequestType,
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '0', // Setting this to 0 triggers the call to deleteRetentionPolicy
        LogGroupName: 'group',
      },
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event, context);

    expect(request.isDone()).toEqual(true);

  });

  test('fails when deleteRetentionPolicy for provider log group fails with OperationAbortedException indefinitely', async () => {
    cloudwatchLogsMock.on(CreateLogGroupCommand).resolves({});
    cloudwatchLogsMock.on(PutRetentionPolicyCommand).resolves({});
    cloudwatchLogsMock.on(DeleteRetentionPolicyCommand, { logGroupName: 'group' }).rejects(OPERATION_ABORTED);

    const event = {
      ...eventCommon,
      RequestType: 'Create' as RequestType,
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '0', // Setting this to 0 triggers the call to deleteRetentionPolicy
        LogGroupName: 'group',
        SdkRetry: { maxRetries: '3' },
      },
    };

    const request = createRequest('FAILED');

    await provider.handler(event, context);

    expect(request.isDone()).toEqual(true);

  });

  test('response data contains the log group name', async () => {
    cloudwatchLogsMock.on(CreateLogGroupCommand).resolves({});
    cloudwatchLogsMock.on(PutRetentionPolicyCommand).resolves({});
    cloudwatchLogsMock.on(DeleteRetentionPolicyCommand).resolves({});

    const event = {
      ...eventCommon,
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '30',
        LogGroupName: 'group',
      },
    };

    async function withOperation(operation: string) {
      const request = nock('https://localhost')
        .put('/', (body: AWSLambda.CloudFormationCustomResourceResponse) => body.Data?.LogGroupName === 'group')
        .reply(200);

      const opEvent = { ...event, RequestType: operation as RequestType };
      await provider.handler(opEvent, context);

      expect(request.isDone()).toEqual(true);
    }

    await withOperation('Create');
    await withOperation('Update');
    await withOperation('Delete');
  });

  test('custom log retention retry options: fails if maxRetries is lower than failures', async () => {
    failTwiceThenResolve(cloudwatchLogsMock, CreateLogGroupCommand, 'group');
    cloudwatchLogsMock.on(PutRetentionPolicyCommand).resolves({});
    cloudwatchLogsMock.on(DeleteRetentionPolicyCommand).resolves({});

    const event = {
      ...eventCommon,
      RequestType: 'Create' as RequestType,
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '30',
        LogGroupName: 'group',
        SdkRetry: {
          maxRetries: '1', // lower than 2
        },
      },
    };

    const request = createRequest('FAILED');

    await provider.handler(event, context);

    expect(request.isDone()).toEqual(true);

  });

  test('custom log retention region', async () => {
    cloudwatchLogsMock.on(CreateLogGroupCommand).resolves({});
    cloudwatchLogsMock.on(PutRetentionPolicyCommand).resolves({});
    cloudwatchLogsMock.on(DeleteRetentionPolicyCommand).resolves({});

    const event = {
      ...eventCommon,
      RequestType: 'Create' as RequestType,
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '30',
        LogGroupName: 'group',
        LogGroupRegion: 'eu-west-2',
      },
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event, context);

    const calls = cloudwatchLogsMock.commandCalls(CreateLogGroupCommand, { logGroupName: 'group' });
    expect(await calls[0].thisValue.config.region()).toBe('eu-west-2');
    expect(request.isDone()).toEqual(true);
  });

});

function failTwiceThenResolve(
  mock: AwsStub<ServiceInputTypes, ServiceOutputTypes, CloudWatchLogsClientResolvedConfig>,
  command: new (input: {
    logGroupName: string;
    retentionInDays: number;
  }) => any,
  logGroupName: string,
  resolveWith = {},
) {
  mock
    .on(command).resolves(resolveWith) // default resolve

    // Handle case for given logGroupName: Reject twice, than accept
    .on(command, { logGroupName } )
    .rejectsOnce(OPERATION_ABORTED)
    .rejectsOnce(OPERATION_ABORTED)
    .resolves({});
}