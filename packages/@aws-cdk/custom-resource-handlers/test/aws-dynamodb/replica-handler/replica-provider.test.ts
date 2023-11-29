/* eslint-disable import/no-extraneous-dependencies */
import { DescribeTableCommand, DynamoDBClient, UpdateTableCommand } from '@aws-sdk/client-dynamodb';
import { OnEventRequest } from 'aws-cdk-lib/custom-resources/lib/provider-framework/types';
import { mockClient } from 'aws-sdk-client-mock';
import * as sinon from 'sinon';
import { isCompleteHandler, onEventHandler } from '../../../lib/aws-dynamodb/replica-handler/index';

let oldConsoleLog: any;

beforeAll(() => {
  oldConsoleLog = global.console.log;
  global.console.log = jest.fn();
});

afterAll(() => {
  global.console.log = oldConsoleLog;
});

const REGION = 'eu-west-2';

const createEvent: OnEventRequest = {
  RequestType: 'Create',
  ResourceProperties: {
    TableName: 'my-table',
    Region: REGION,
    ServiceToken: 'token',
  },
  ServiceToken: 'token',
  ResponseURL: 'url',
  LogicalResourceId: 'logical-id',
  RequestId: 'request-id',
  StackId: 'stack-id',
  ResourceType: 'resource-type',
};

const ddbMock = mockClient(DynamoDBClient);

afterEach(() => {
  ddbMock.reset();
});

test('on event', async () => {
  const updateTableMock = sinon.fake.resolves({});

  ddbMock.on(UpdateTableCommand).callsFake(updateTableMock);

  const data = await onEventHandler(createEvent);

  sinon.assert.calledWith(updateTableMock, {
    TableName: 'my-table',
    ReplicaUpdates: [
      {
        Create: {
          RegionName: REGION,
        },
      },
    ],
  });

  expect(data).toEqual({
    PhysicalResourceId: 'my-table-eu-west-2',
  });
});

test("on Update event from CFN calls updateTable with Create if a replica in the region doesn't exist", async () => {
  ddbMock.on(DescribeTableCommand).resolves({
    Table: {
      Replicas: [
        // no replicas exist yet
      ],
    },
  });

  const updateTableMock = sinon.fake.resolves({});
  ddbMock.on(UpdateTableCommand).callsFake(updateTableMock);

  const data = await onEventHandler({
    ...createEvent,
    OldResourceProperties: {
      TableName: 'my-old-table',
    },
    RequestType: 'Update',
  });

  sinon.assert.calledWith(updateTableMock, {
    TableName: 'my-table',
    ReplicaUpdates: [
      {
        Create: {
          RegionName: REGION,
        },
      },
    ],
  });

  expect(data).toEqual({
    PhysicalResourceId: 'my-table-eu-west-2',
  });
});

test("on Update event from CFN calls doesn't call updateTable if a replica in the region does exist", async () => {
  ddbMock.on(DescribeTableCommand).resolves({
    Table: {
      Replicas: [
        { RegionName: REGION },
      ],
    },
  });

  const updateTableMock = sinon.fake.resolves({});
  ddbMock.on(UpdateTableCommand).callsFake(updateTableMock);

  await onEventHandler({
    ...createEvent,
    OldResourceProperties: {
      TableName: 'my-old-table',
    },
    RequestType: 'Update',
  });

  sinon.assert.notCalled(updateTableMock);
});

test('on event calls updateTable with Delete', async () => {
  const updateTableMock = sinon.fake.resolves({});

  ddbMock.on(UpdateTableCommand).callsFake(updateTableMock);

  const data = await onEventHandler({
    ...createEvent,
    RequestType: 'Delete',
  });

  sinon.assert.calledWith(updateTableMock, {
    TableName: 'my-table',
    ReplicaUpdates: [
      {
        Delete: {
          RegionName: REGION,
        },
      },
    ],
  });

  // Physical resource id never changed on Delete
  expect(data).toEqual({});
});

test('is complete for create returns false without replicas', async () => {
  const describeTableMock = sinon.fake.resolves({
    Table: {},
  });

  ddbMock.on(DescribeTableCommand).callsFake(describeTableMock);

  const data = await isCompleteHandler(createEvent);

  expect(data).toEqual({ IsComplete: false });
});

test('is complete for create returns false when replica is not active', async () => {
  const describeTableMock = sinon.fake.resolves({
    Table: {
      Replicas: [
        {
          RegionName: REGION,
          ReplicaStatus: 'CREATING',
        },
      ],
    },
  });

  ddbMock.on(DescribeTableCommand).callsFake(describeTableMock);

  const data = await isCompleteHandler(createEvent);

  expect(data).toEqual({ IsComplete: false });
});

test('is complete for create returns false when table is not active', async () => {
  const describeTableMock = sinon.fake.resolves({
    Table: {
      Replicas: [
        {
          RegionName: REGION,
          ReplicaStatus: 'ACTIVE',
        },
      ],
      TableStatus: 'UPDATING',
    },
  });

  ddbMock.on(DescribeTableCommand).callsFake(describeTableMock);

  const data = await isCompleteHandler(createEvent);

  expect(data).toEqual({ IsComplete: false });
});

test('is complete for create returns true when replica is active', async () => {
  const describeTableMock = sinon.fake.resolves({
    Table: {
      Replicas: [
        {
          RegionName: REGION,
          ReplicaStatus: 'ACTIVE',
        },
      ],
      TableStatus: 'ACTIVE',
    },
  });

  ddbMock.on(DescribeTableCommand).callsFake(describeTableMock);

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

  ddbMock.on(DescribeTableCommand).callsFake(describeTableMock);

  const data = await isCompleteHandler({
    ...createEvent,
    RequestType: 'Delete',
  });

  expect(data).toEqual({ IsComplete: true });
});
