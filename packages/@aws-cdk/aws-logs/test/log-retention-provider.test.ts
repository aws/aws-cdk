import * as AWSSDK from 'aws-sdk';
import * as AWS from 'aws-sdk-mock';
import * as nock from 'nock';
import * as sinon from 'sinon';
import * as provider from '../lib/log-retention-provider';

AWS.setSDK(require.resolve('aws-sdk'));

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
    .put('/', (body: AWSLambda.CloudFormationCustomResourceResponse) => body.Status === type && body.PhysicalResourceId === 'group')
    .reply(200);
}

class MyError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

describe('log retention provider', () => {
  afterEach(() => {
    AWS.restore();
    nock.cleanAll();

  });

  test('create event', async () => {
    const createLogGroupFake = sinon.fake.resolves({});
    const putRetentionPolicyFake = sinon.fake.resolves({});
    const deleteRetentionPolicyFake = sinon.fake.resolves({});

    AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
    AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
    AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);

    const event = {
      ...eventCommon,
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '30',
        LogGroupName: 'group',
      },
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event as AWSLambda.CloudFormationCustomResourceCreateEvent, context);

    sinon.assert.calledWith(createLogGroupFake, {
      logGroupName: 'group',
    });

    sinon.assert.calledWith(putRetentionPolicyFake, {
      logGroupName: 'group',
      retentionInDays: 30,
    });

    sinon.assert.calledWith(createLogGroupFake, {
      logGroupName: '/aws/lambda/provider',
    });

    sinon.assert.calledWith(putRetentionPolicyFake, {
      logGroupName: '/aws/lambda/provider',
      retentionInDays: 1,
    });

    sinon.assert.notCalled(deleteRetentionPolicyFake);

    expect(request.isDone()).toEqual(true);


  });

  test('update event with new log retention', async () => {
    const error = new Error() as NodeJS.ErrnoException;
    error.code = 'ResourceAlreadyExistsException';

    const createLogGroupFake = sinon.fake.rejects(error);
    const putRetentionPolicyFake = sinon.fake.resolves({});
    const deleteRetentionPolicyFake = sinon.fake.resolves({});

    AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
    AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
    AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);

    const event = {
      ...eventCommon,
      RequestType: 'Update',
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

    await provider.handler(event as AWSLambda.CloudFormationCustomResourceUpdateEvent, context);

    sinon.assert.calledWith(createLogGroupFake, {
      logGroupName: 'group',
    });

    sinon.assert.calledWith(putRetentionPolicyFake, {
      logGroupName: 'group',
      retentionInDays: 365,
    });

    sinon.assert.notCalled(deleteRetentionPolicyFake);

    expect(request.isDone()).toEqual(true);


  });

  test('update event with log retention undefined', async () => {
    const error = new Error() as NodeJS.ErrnoException;
    error.code = 'ResourceAlreadyExistsException';

    const createLogGroupFake = sinon.fake.rejects(error);
    const putRetentionPolicyFake = sinon.fake.resolves({});
    const deleteRetentionPolicyFake = sinon.fake.resolves({});

    AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
    AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
    AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);

    const event = {
      ...eventCommon,
      RequestType: 'Update',
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

    await provider.handler(event as AWSLambda.CloudFormationCustomResourceUpdateEvent, context);

    sinon.assert.calledWith(createLogGroupFake, {
      logGroupName: 'group',
    });

    sinon.assert.calledWith(deleteRetentionPolicyFake, {
      logGroupName: 'group',
    });

    expect(request.isDone()).toEqual(true);


  });

  test('delete event', async () => {
    const createLogGroupFake = sinon.fake.resolves({});
    const putRetentionPolicyFake = sinon.fake.resolves({});
    const deleteRetentionPolicyFake = sinon.fake.resolves({});

    AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
    AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
    AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);

    const event = {
      ...eventCommon,
      RequestType: 'Delete',
      PhysicalResourceId: 'group',
      ResourceProperties: {
        ServiceToken: 'token',
        LogGroupName: 'group',
      },
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event as AWSLambda.CloudFormationCustomResourceDeleteEvent, context);

    sinon.assert.notCalled(createLogGroupFake);

    sinon.assert.notCalled(putRetentionPolicyFake);

    sinon.assert.notCalled(deleteRetentionPolicyFake);

    expect(request.isDone()).toEqual(true);


  });

  test('delete event with RemovalPolicy', async () => {
    const createLogGroupFake = sinon.fake.resolves({});
    const deleteLogGroupFake = sinon.fake.resolves({});
    const putRetentionPolicyFake = sinon.fake.resolves({});
    const deleteRetentionPolicyFake = sinon.fake.resolves({});

    AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
    AWS.mock('CloudWatchLogs', 'deleteLogGroup', deleteLogGroupFake);
    AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
    AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);

    const event = {
      ...eventCommon,
      RequestType: 'Delete',
      PhysicalResourceId: 'group',
      ResourceProperties: {
        ServiceToken: 'token',
        LogGroupName: 'group',
        RemovalPolicy: 'destroy',
      },
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event as AWSLambda.CloudFormationCustomResourceDeleteEvent, context);

    sinon.assert.notCalled(createLogGroupFake);

    sinon.assert.calledWith(deleteLogGroupFake, {
      logGroupName: 'group',
    });

    sinon.assert.notCalled(putRetentionPolicyFake);

    sinon.assert.notCalled(deleteRetentionPolicyFake);

    expect(request.isDone()).toEqual(true);


  });

  test('responds with FAILED on error', async () => {
    const createLogGroupFake = sinon.fake.rejects(new Error('UnknownError'));

    AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);

    const event = {
      ...eventCommon,
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '30',
        LogGroupName: 'group',
      },
    };

    const request = createRequest('FAILED');

    await provider.handler(event as AWSLambda.CloudFormationCustomResourceCreateEvent, context);

    expect(request.isDone()).toEqual(true);


  });

  test('succeeds when createLogGroup for provider log group returns OperationAbortedException twice', async () => {
    let attempt = 2;
    const createLogGroupFake = (params: AWSSDK.CloudWatchLogs.CreateLogGroupRequest) => {
      if (params.logGroupName === '/aws/lambda/provider') {
        if (attempt > 0) {
          attempt--;
          return Promise.reject(new MyError(
            'A conflicting operation is currently in progress against this resource. Please try again.',
            'OperationAbortedException'));
        } else {
          return Promise.resolve({});
        }
      }
      return Promise.resolve({});
    };

    const putRetentionPolicyFake = sinon.fake.resolves({});
    const deleteRetentionPolicyFake = sinon.fake.resolves({});

    AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
    AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
    AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);

    const event = {
      ...eventCommon,
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '30',
        LogGroupName: 'group',
      },
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event as AWSLambda.CloudFormationCustomResourceCreateEvent, context);

    expect(request.isDone()).toEqual(true);


  });

  test('succeeds when createLogGroup for CDK lambda log group returns OperationAbortedException twice', async () => {
    let attempt = 2;
    const createLogGroupFake = (params: AWSSDK.CloudWatchLogs.CreateLogGroupRequest) => {
      if (params.logGroupName === 'group') {
        if (attempt > 0) {
          attempt--;
          return Promise.reject(new MyError(
            'A conflicting operation is currently in progress against this resource. Please try again.',
            'OperationAbortedException'));
        } else {
          return Promise.resolve({});
        }
      }
      return Promise.resolve({});
    };

    const putRetentionPolicyFake = sinon.fake.resolves({});
    const deleteRetentionPolicyFake = sinon.fake.resolves({});

    AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
    AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
    AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);

    const event = {
      ...eventCommon,
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '30',
        LogGroupName: 'group',
      },
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event as AWSLambda.CloudFormationCustomResourceCreateEvent, context);

    expect(request.isDone()).toEqual(true);


  });

  test('fails when createLogGroup for CDK lambda log group fails with OperationAbortedException indefinitely', async () => {
    const createLogGroupFake = (params: AWSSDK.CloudWatchLogs.CreateLogGroupRequest) => {
      if (params.logGroupName === 'group') {
        return Promise.reject(new MyError(
          'A conflicting operation is currently in progress against this resource. Please try again.',
          'OperationAbortedException'));
      }
      return Promise.resolve({});
    };

    const putRetentionPolicyFake = sinon.fake.resolves({});
    const deleteRetentionPolicyFake = sinon.fake.resolves({});

    AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
    AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
    AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);

    const event = {
      ...eventCommon,
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '30',
        LogGroupName: 'group',
      },
    };

    const request = createRequest('FAILED');

    await provider.handler(event as AWSLambda.CloudFormationCustomResourceCreateEvent, context);

    expect(request.isDone()).toEqual(true);


  });

  test('succeeds when putRetentionPolicy for provider log group returns OperationAbortedException twice', async () => {
    let attempt = 2;
    const putRetentionPolicyFake = (params: AWSSDK.CloudWatchLogs.CreateLogGroupRequest) => {
      if (params.logGroupName === '/aws/lambda/provider') {
        if (attempt > 0) {
          attempt--;
          return Promise.reject(new MyError(
            'A conflicting operation is currently in progress against this resource. Please try again.',
            'OperationAbortedException'));
        } else {
          return Promise.resolve({});
        }
      }
      return Promise.resolve({});
    };

    const createLogGroupFake = sinon.fake.resolves({});
    const deleteRetentionPolicyFake = sinon.fake.resolves({});

    AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
    AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
    AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);

    const event = {
      ...eventCommon,
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '30',
        LogGroupName: 'group',
      },
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event as AWSLambda.CloudFormationCustomResourceCreateEvent, context);

    expect(request.isDone()).toEqual(true);


  });

  test('succeeds when putRetentionPolicy for CDK lambda log group returns OperationAbortedException twice', async () => {
    let attempt = 2;
    const putRetentionPolicyFake = (params: AWSSDK.CloudWatchLogs.CreateLogGroupRequest) => {
      if (params.logGroupName === 'group') {
        if (attempt > 0) {
          attempt--;
          return Promise.reject(new MyError(
            'A conflicting operation is currently in progress against this resource. Please try again.',
            'OperationAbortedException'));
        } else {
          return Promise.resolve({});
        }
      }
      return Promise.resolve({});
    };

    const createLogGroupFake = sinon.fake.resolves({});
    const deleteRetentionPolicyFake = sinon.fake.resolves({});

    AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
    AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
    AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);

    const event = {
      ...eventCommon,
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '30',
        LogGroupName: 'group',
      },
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event as AWSLambda.CloudFormationCustomResourceCreateEvent, context);

    expect(request.isDone()).toEqual(true);


  });

  test('fails when putRetentionPolicy for CDK lambda log group fails with OperationAbortedException indefinitely', async () => {
    const putRetentionPolicyFake = (params: AWSSDK.CloudWatchLogs.CreateLogGroupRequest) => {
      if (params.logGroupName === 'group') {
        return Promise.reject(new MyError(
          'A conflicting operation is currently in progress against this resource. Please try again.',
          'OperationAbortedException'));
      }
      return Promise.resolve({});
    };

    const createLogGroupFake = sinon.fake.resolves({});
    const deleteRetentionPolicyFake = sinon.fake.resolves({});

    AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
    AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
    AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);

    const event = {
      ...eventCommon,
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '30',
        LogGroupName: 'group',
      },
    };

    const request = createRequest('FAILED');

    await provider.handler(event as AWSLambda.CloudFormationCustomResourceCreateEvent, context);

    expect(request.isDone()).toEqual(true);


  });

  test('succeeds when deleteRetentionPolicy for provider log group returns OperationAbortedException twice', async () => {
    let attempt = 2;
    const deleteRetentionPolicyFake = (params: AWSSDK.CloudWatchLogs.CreateLogGroupRequest) => {
      if (params.logGroupName === '/aws/lambda/provider') {
        if (attempt > 0) {
          attempt--;
          return Promise.reject(new MyError(
            'A conflicting operation is currently in progress against this resource. Please try again.',
            'OperationAbortedException'));
        } else {
          return Promise.resolve({});
        }
      }
      return Promise.resolve({});
    };

    const createLogGroupFake = sinon.fake.resolves({});
    const putRetentionPolicyFake = sinon.fake.resolves({});

    AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
    AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
    AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);

    const event = {
      ...eventCommon,
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '0', // Setting this to 0 triggers the call to deleteRetentionPolicy
        LogGroupName: 'group',
      },
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event as AWSLambda.CloudFormationCustomResourceCreateEvent, context);

    expect(request.isDone()).toEqual(true);


  });

  test('fails when deleteRetentionPolicy for provider log group fails with OperationAbortedException indefinitely', async () => {
    const deleteRetentionPolicyFake = (params: AWSSDK.CloudWatchLogs.CreateLogGroupRequest) => {
      if (params.logGroupName === 'group') {
        return Promise.reject(new MyError(
          'A conflicting operation is currently in progress against this resource. Please try again.',
          'OperationAbortedException'));
      }
      return Promise.resolve({});
    };

    const createLogGroupFake = sinon.fake.resolves({});
    const putRetentionPolicyFake = sinon.fake.resolves({});

    AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);
    AWS.mock('CloudWatchLogs', 'putRetentionPolicy', putRetentionPolicyFake);
    AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', deleteRetentionPolicyFake);

    const event = {
      ...eventCommon,
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '0', // Setting this to 0 triggers the call to deleteRetentionPolicy
        LogGroupName: 'group',
      },
    };

    const request = createRequest('FAILED');

    await provider.handler(event as AWSLambda.CloudFormationCustomResourceCreateEvent, context);

    expect(request.isDone()).toEqual(true);


  });

  test('response data contains the log group name', async () => {
    AWS.mock('CloudWatchLogs', 'createLogGroup', sinon.fake.resolves({}));
    AWS.mock('CloudWatchLogs', 'putRetentionPolicy', sinon.fake.resolves({}));
    AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', sinon.fake.resolves({}));

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

      const opEvent = { ...event, RequestType: operation };
      await provider.handler(opEvent as AWSLambda.CloudFormationCustomResourceCreateEvent, context);

      expect(request.isDone()).toEqual(true);
    }

    await withOperation('Create');
    await withOperation('Update');
    await withOperation('Delete');


  });

  test('custom log retention retry options', async () => {
    AWS.mock('CloudWatchLogs', 'createLogGroup', sinon.fake.resolves({}));
    AWS.mock('CloudWatchLogs', 'putRetentionPolicy', sinon.fake.resolves({}));
    AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', sinon.fake.resolves({}));

    const event = {
      ...eventCommon,
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '30',
        LogGroupName: 'group',
        SdkRetry: {
          maxRetries: '5',
          base: '300',
        },
      },
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event as AWSLambda.CloudFormationCustomResourceCreateEvent, context);

    sinon.assert.calledWith(AWSSDK.CloudWatchLogs as any, {
      apiVersion: '2014-03-28',
      maxRetries: 5,
      region: undefined,
      retryOptions: {
        base: 300,
      },
    });

    expect(request.isDone()).toEqual(true);


  });

  test('custom log retention region', async () => {
    AWS.mock('CloudWatchLogs', 'createLogGroup', sinon.fake.resolves({}));
    AWS.mock('CloudWatchLogs', 'putRetentionPolicy', sinon.fake.resolves({}));
    AWS.mock('CloudWatchLogs', 'deleteRetentionPolicy', sinon.fake.resolves({}));

    const event = {
      ...eventCommon,
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'token',
        RetentionInDays: '30',
        LogGroupName: 'group',
        LogGroupRegion: 'us-east-1',
      },
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event as AWSLambda.CloudFormationCustomResourceCreateEvent, context);

    sinon.assert.calledWith(AWSSDK.CloudWatchLogs as any, {
      apiVersion: '2014-03-28',
      region: 'us-east-1',
    });

    expect(request.isDone()).toEqual(true);


  });

});
