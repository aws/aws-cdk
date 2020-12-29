import { OnEventRequest } from '@aws-cdk/custom-resources/lib/provider-framework/types';
import * as AWS from 'aws-sdk-mock';
import * as sinon from 'sinon';
import { isCompleteHandler, onEventHandler } from '../lib/replica-handler';

let oldConsoleLog: any;

beforeAll(() => {
  oldConsoleLog = global.console.log;
  global.console.log = jest.fn();
});

afterAll(() => {
  global.console.log = oldConsoleLog;
});

AWS.setSDK(require.resolve('aws-sdk'));

const createEvent: OnEventRequest = {
  RequestType: 'Create',
  ResourceProperties: {
    TableName: 'my-table',
    Region: 'eu-west-2',
    ServiceToken: 'token',
  },
  ServiceToken: 'token',
  ResponseURL: 'url',
  LogicalResourceId: 'logical-id',
  RequestId: 'request-id',
  StackId: 'stack-id',
  ResourceType: 'resource-type',
};

afterEach(() => {
  AWS.restore();
});

test('on event', async () => {
  const updateTableMock = sinon.fake.resolves({});

  AWS.mock('DynamoDB', 'updateTable', updateTableMock);

  const data = await onEventHandler(createEvent);

  sinon.assert.calledWith(updateTableMock, {
    TableName: 'my-table',
    ReplicaUpdates: [
      {
        Create: {
          RegionName: 'eu-west-2',
        },
      },
    ],
  });

  expect(data).toEqual({
    PhysicalResourceId: 'eu-west-2',
  });
});

test('on event does not call updateTable for Update requests', async () => {
  const updateTableMock = sinon.fake.resolves({});

  AWS.mock('DynamoDB', 'updateTable', updateTableMock);

  const data = await onEventHandler({
    ...createEvent,
    RequestType: 'Update',
  });

  sinon.assert.notCalled(updateTableMock);

  expect(data).toEqual({
    PhysicalResourceId: 'eu-west-2',
  });
});

test('is complete for create returns false without replicas', async () => {
  const describeTableMock = sinon.fake.resolves({
    Table: {},
  });

  AWS.mock('DynamoDB', 'describeTable', describeTableMock);

  const data = await isCompleteHandler(createEvent);

  expect(data).toEqual({ IsComplete: false });
});

test('is complete for create returns false when replica is not active', async () => {
  const describeTableMock = sinon.fake.resolves({
    Table: {
      Replicas: [
        {
          RegionName: 'eu-west-2',
          ReplicaStatus: 'CREATING',
        },
      ],
    },
  });

  AWS.mock('DynamoDB', 'describeTable', describeTableMock);

  const data = await isCompleteHandler(createEvent);

  expect(data).toEqual({ IsComplete: false });
});

test('is complete for create returns false when table is not active', async () => {
  const describeTableMock = sinon.fake.resolves({
    Table: {
      Replicas: [
        {
          RegionName: 'eu-west-2',
          ReplicaStatus: 'ACTIVE',
        },
      ],
      TableStatus: 'UPDATING',
    },
  });

  AWS.mock('DynamoDB', 'describeTable', describeTableMock);

  const data = await isCompleteHandler(createEvent);

  expect(data).toEqual({ IsComplete: false });
});

test('is complete for create returns true when replica is active', async () => {
  const describeTableMock = sinon.fake.resolves({
    Table: {
      Replicas: [
        {
          RegionName: 'eu-west-2',
          ReplicaStatus: 'ACTIVE',
        },
      ],
      TableStatus: 'ACTIVE',
    },
  });

  AWS.mock('DynamoDB', 'describeTable', describeTableMock);

  const data = await isCompleteHandler(createEvent);

  expect(data).toEqual({ IsComplete: true });
});

test('is complete for delete returns true when replica is gone', async () => {
  const describeTableMock = sinon.fake.resolves({
    Table: {
      Replicas: [
        {
          RegionName: 'eu-west-1',
          ReplicaStatus: 'ACTIVE',
        },
      ],
      TableStatus: 'ACTIVE',
    },
  });

  AWS.mock('DynamoDB', 'describeTable', describeTableMock);

  const data = await isCompleteHandler({
    ...createEvent,
    RequestType: 'Delete',
  });

  expect(data).toEqual({ IsComplete: true });
});
