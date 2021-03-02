import * as AWSSDK from 'aws-sdk';
import * as AWS from 'aws-sdk-mock';
import * as nock from 'nock';
import { Test } from 'nodeunit';
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

export = {
  'tearDown'(callback: any) {
    AWS.restore();
    nock.cleanAll();
    callback();
  },

  async 'create event'(test: Test) {
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

    test.equal(request.isDone(), true);

    test.done();
  },

  async 'update event with new log retention'(test: Test) {
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

    test.equal(request.isDone(), true);

    test.done();
  },

  async 'update event with log retention undefined'(test: Test) {
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

    test.equal(request.isDone(), true);

    test.done();
  },

  async 'delete event'(test: Test) {
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

    test.equal(request.isDone(), true);

    test.done();
  },

  async 'responds with FAILED on error'(test: Test) {
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

    test.equal(request.isDone(), true);

    test.done();
  },

  async 'does not fail when operations on provider log group fail'(test: Test) {
    const createLogGroupFake = (params: AWSSDK.CloudWatchLogs.CreateLogGroupRequest) => {
      if (params.logGroupName === '/aws/lambda/provider') {
        return Promise.reject(new Error('OperationAbortedException'));
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

    test.equal(request.isDone(), true);

    test.done();
  },

  async 'response data contains the log group name'(test: Test) {
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

      test.equal(request.isDone(), true);
    }

    await withOperation('Create');
    await withOperation('Update');
    await withOperation('Delete');

    test.done();
  },

  async 'custom log retention retry options'(test: Test) {
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

    test.equal(request.isDone(), true);

    test.done();
  },

  async 'custom log retention region'(test: Test) {
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

    test.equal(request.isDone(), true);

    test.done();
  },

};
