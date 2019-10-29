import AWSSDK = require('aws-sdk');
import AWS = require('aws-sdk-mock');
import nock = require('nock');
import { Test } from 'nodeunit';
import sinon = require('sinon');
import provider = require('../lib/log-retention-provider');

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
  functionName: 'provider'
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
          LogGroupName: 'group'
      }
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event as AWSLambda.CloudFormationCustomResourceCreateEvent, context);

    sinon.assert.calledWith(createLogGroupFake, {
      logGroupName: 'group'
    });

    sinon.assert.calledWith(putRetentionPolicyFake, {
      logGroupName: 'group',
      retentionInDays: 30
    });

    sinon.assert.calledWith(createLogGroupFake, {
      logGroupName: '/aws/lambda/provider'
    });

    sinon.assert.calledWith(putRetentionPolicyFake, {
      logGroupName: '/aws/lambda/provider',
      retentionInDays: 1
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
          LogGroupName: 'group'
      },
      OldResourceProperties: {
        ServiceToken: 'token',
        LogGroupName: 'group',
        RetentionInDays: '30'
      }
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event as AWSLambda.CloudFormationCustomResourceUpdateEvent, context);

    sinon.assert.calledWith(createLogGroupFake, {
      logGroupName: 'group'
    });

    sinon.assert.calledWith(putRetentionPolicyFake, {
      logGroupName: 'group',
      retentionInDays: 365
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
          LogGroupName: 'group'
      },
      OldResourceProperties: {
        ServiceToken: 'token',
        LogGroupName: 'group',
        RetentionInDays: '365'
      }
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event as AWSLambda.CloudFormationCustomResourceUpdateEvent, context);

    sinon.assert.calledWith(createLogGroupFake, {
      logGroupName: 'group'
    });

    sinon.assert.calledWith(deleteRetentionPolicyFake, {
      logGroupName: 'group'
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
          LogGroupName: 'group'
      }
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
    const createLogGroupFake = sinon.fake.rejects(new Error('UnkownError'));

    AWS.mock('CloudWatchLogs', 'createLogGroup', createLogGroupFake);

    const event = {
      ...eventCommon,
      RequestType: 'Create',
      ResourceProperties: {
          ServiceToken: 'token',
          RetentionInDays: '30',
          LogGroupName: 'group'
      }
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
          LogGroupName: 'group'
      }
    };

    const request = createRequest('SUCCESS');

    await provider.handler(event as AWSLambda.CloudFormationCustomResourceCreateEvent, context);

    test.equal(request.isDone(), true);

    test.done();
  }
};
