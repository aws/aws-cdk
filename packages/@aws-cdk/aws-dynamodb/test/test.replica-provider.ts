import { OnEventRequest } from '@aws-cdk/custom-resources/lib/provider-framework/types';
import * as AWS from 'aws-sdk-mock';
import { Test } from 'nodeunit';
import * as sinon from 'sinon';
import { isCompleteHandler, onEventHandler } from '../lib/replica-handler';

AWS.setSDK(require.resolve('aws-sdk'));

const createEvent: OnEventRequest = {
  RequestType: 'Create',
  ResourceProperties: {
    TableName: 'my-table',
    Region: 'eu-west-2',
    ServiceToken: 'token'
  },
  ServiceToken: 'token',
  ResponseURL: 'url',
  LogicalResourceId: 'logical-id',
  RequestId: 'request-id',
  StackId: 'stack-id',
  ResourceType: 'resource-type'
};

export = {
  'setUp'(callback: any) {
    process.env.USE_NORMAL_SDK = 'true';
    callback();
  },

  'tearDown'(callback: any) {
    delete process.env.USE_NORMAL_SDK;
    AWS.restore();
    callback();
  },

  async 'on event'(test: Test) {
    const updateTableMock = sinon.fake.resolves({});

    AWS.mock('DynamoDB', 'updateTable', updateTableMock);

    const data = await onEventHandler(createEvent);

    sinon.assert.calledWith(updateTableMock, {
      TableName: 'my-table',
      ReplicaUpdates: [
        {
          Create: {
            RegionName: 'eu-west-2'
          }
        },
      ]
    });

    test.deepEqual(data, {
      PhysicalResourceId: 'eu-west-2'
    });

    test.done();
  },

  async 'is complete for create returns false without replicas'(test: Test) {
    const describeTableMock = sinon.fake.resolves({
      Table: {}
    });

    AWS.mock('DynamoDB', 'describeTable', describeTableMock);

    const data = await isCompleteHandler(createEvent);

    test.deepEqual(data, { IsComplete: false });

    test.done();
  },

  async 'is complete for create returns false when replica is not active'(test: Test) {
    const describeTableMock = sinon.fake.resolves({
      Table: {
        Replicas: [
          {
            RegionName: 'eu-west-2',
            ReplicaStatus: 'CREATING'
          }
        ]
      }
    });

    AWS.mock('DynamoDB', 'describeTable', describeTableMock);

    const data = await isCompleteHandler(createEvent);

    test.deepEqual(data, { IsComplete: false });

    test.done();
  },

  async 'is complete for create returns true when replica is active'(test: Test) {
    const describeTableMock = sinon.fake.resolves({
      Table: {
        Replicas: [
          {
            RegionName: 'eu-west-2',
            ReplicaStatus: 'ACTIVE'
          }
        ]
      }
    });

    AWS.mock('DynamoDB', 'describeTable', describeTableMock);

    const data = await isCompleteHandler(createEvent);

    test.deepEqual(data, { IsComplete: true });

    test.done();
  },

  async 'is complete for delete returns true when replica is gone'(test: Test) {
    const describeTableMock = sinon.fake.resolves({
      Table: {
        Replicas: [
          {
            RegionName: 'eu-west-1',
            ReplicaStatus: 'ACTIVE'
          }
        ]
      }
    });

    AWS.mock('DynamoDB', 'describeTable', describeTableMock);

    const data = await isCompleteHandler({
      ...createEvent,
      RequestType: 'Delete'
    });

    test.deepEqual(data, { IsComplete: true });

    test.done();
  },
};
