import * as SDK from 'aws-sdk';
import * as AWS from 'aws-sdk-mock';
import * as fs from 'fs-extra';
import * as nock from 'nock';
import * as sinon from 'sinon';
import { AwsSdkCall, PhysicalResourceId } from '../../lib';
import { flatten, handler, forceSdkInstallation } from '../../lib/aws-custom-resource/runtime';


// This test performs an 'npm install' which may take longer than the default
// 5s timeout
jest.setTimeout(60_000);

/* eslint-disable no-console */

console.log = jest.fn();

const eventCommon = {
  ServiceToken: 'token',
  ResponseURL: 'https://localhost',
  StackId: 'stackId',
  RequestId: 'requestId',
  LogicalResourceId: 'logicalResourceId',
  ResourceType: 'Custom::AWS',
};

function createRequest(bodyPredicate: (body: AWSLambda.CloudFormationCustomResourceResponse) => boolean) {
  return nock('https://localhost')
    .put('/', bodyPredicate)
    .reply(200);
}

beforeEach(() => {
  AWS.setSDK(require.resolve('aws-sdk'));
});

afterEach(() => {
  AWS.restore();
  nock.cleanAll();
});

test('create event with physical resource id path', async () => {
  const listObjectsFake = sinon.fake.resolves({
    Contents: [
      {
        Key: 'first-key',
        ETag: 'first-key-etag',
      },
      {
        Key: 'second-key',
        ETag: 'second-key-etag',
      },
    ],
  } as SDK.S3.ListObjectsOutput);

  AWS.mock('S3', 'listObjects', listObjectsFake);

  const event: AWSLambda.CloudFormationCustomResourceCreateEvent = {
    ...eventCommon,
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'token',
      Create: JSON.stringify({
        service: 'S3',
        action: 'listObjects',
        parameters: {
          Bucket: 'my-bucket',
        },
        physicalResourceId: PhysicalResourceId.fromResponse('Contents.1.ETag'),
      } as AwsSdkCall),
    },
  };

  const request = createRequest(body =>
    body.Status === 'SUCCESS' &&
    body.PhysicalResourceId === 'second-key-etag' &&
    body.Data!['Contents.0.Key'] === 'first-key',
  );

  await handler(event, {} as AWSLambda.Context);

  sinon.assert.calledWith(listObjectsFake, {
    Bucket: 'my-bucket',
  });

  expect(request.isDone()).toBeTruthy();
});

test('update event with physical resource id', async () => {
  const publish = sinon.fake.resolves({});

  AWS.mock('SNS', 'publish', publish);

  const event: AWSLambda.CloudFormationCustomResourceUpdateEvent = {
    ...eventCommon,
    RequestType: 'Update',
    PhysicalResourceId: 'physicalResourceId',
    OldResourceProperties: {},
    ResourceProperties: {
      ServiceToken: 'token',
      Update: JSON.stringify({
        service: 'SNS',
        action: 'publish',
        parameters: {
          Message: 'hello',
          TopicArn: 'topicarn',
        },
        physicalResourceId: PhysicalResourceId.of('topicarn'),
      } as AwsSdkCall),
    },
  };

  const request = createRequest(body =>
    body.Status === 'SUCCESS' &&
    body.PhysicalResourceId === 'topicarn',
  );

  await handler(event, {} as AWSLambda.Context);

  expect(request.isDone()).toBeTruthy();
});

test('delete event', async () => {
  const listObjectsFake = sinon.fake.resolves({});

  AWS.mock('S3', 'listObjects', listObjectsFake);

  const event: AWSLambda.CloudFormationCustomResourceDeleteEvent = {
    ...eventCommon,
    RequestType: 'Delete',
    PhysicalResourceId: 'physicalResourceId',
    ResourceProperties: {
      ServiceToken: 'token',
      Create: JSON.stringify({
        service: 'S3',
        action: 'listObjects',
        parameters: {
          Bucket: 'my-bucket',
        },
        physicalResourceId: PhysicalResourceId.fromResponse('Contents.1.ETag'),
      } as AwsSdkCall),
    },
  };

  const request = createRequest(body =>
    body.Status === 'SUCCESS' &&
    body.PhysicalResourceId === 'physicalResourceId' &&
    Object.keys(body.Data!).length === 0,
  );

  await handler(event, {} as AWSLambda.Context);

  sinon.assert.notCalled(listObjectsFake);

  expect(request.isDone()).toBeTruthy();
});

test('delete event with Delete call and no physical resource id in call', async () => {
  const deleteParameterFake = sinon.fake.resolves({});

  AWS.mock('SSM', 'deleteParameter', deleteParameterFake);

  const event: AWSLambda.CloudFormationCustomResourceDeleteEvent = {
    ...eventCommon,
    RequestType: 'Delete',
    PhysicalResourceId: 'physicalResourceId',
    ResourceProperties: {
      ServiceToken: 'token',
      Delete: JSON.stringify({
        service: 'SSM',
        action: 'deleteParameter',
        parameters: {
          Name: 'my-param',
        },
      } as AwsSdkCall),
    },
  };

  const request = createRequest(body =>
    body.Status === 'SUCCESS' &&
    body.PhysicalResourceId === 'physicalResourceId',
  );

  await handler(event, {} as AWSLambda.Context);

  sinon.assert.calledWith(deleteParameterFake, {
    Name: 'my-param',
  });

  expect(request.isDone()).toBeTruthy();
});

test('create event with Delete call only', async () => {
  const deleteParameterFake = sinon.fake.resolves({});

  AWS.mock('SSM', 'deleteParameter', deleteParameterFake);

  const event: AWSLambda.CloudFormationCustomResourceCreateEvent = {
    ...eventCommon,
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'token',
      Delete: JSON.stringify({
        service: 'SSM',
        action: 'deleteParameter',
        parameters: {
          Name: 'my-param',
        },
      } as AwsSdkCall),
    },
  };

  const request = createRequest(body =>
    body.Status === 'SUCCESS' &&
    body.PhysicalResourceId === 'logicalResourceId',
  );

  await handler(event, {} as AWSLambda.Context);

  sinon.assert.notCalled(deleteParameterFake);

  expect(request.isDone()).toBeTruthy();
});

test('catch errors', async () => {
  const error: NodeJS.ErrnoException = new Error();
  error.code = 'NoSuchBucket';
  const listObjectsFake = sinon.fake.rejects(error);

  AWS.mock('S3', 'listObjects', listObjectsFake);

  const event: AWSLambda.CloudFormationCustomResourceCreateEvent = {
    ...eventCommon,
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'token',
      Create: JSON.stringify({
        service: 'S3',
        action: 'listObjects',
        parameters: {
          Bucket: 'my-bucket',
        },
        physicalResourceId: PhysicalResourceId.of('physicalResourceId'),
        ignoreErrorCodesMatching: 'NoSuchBucket',
      } as AwsSdkCall),
    },
  };

  const request = createRequest(body =>
    body.Status === 'SUCCESS' &&
    body.PhysicalResourceId === 'physicalResourceId' &&
    Object.keys(body.Data!).length === 0,
  );

  await handler(event, {} as AWSLambda.Context);

  expect(request.isDone()).toBeTruthy();
});

test('restrict output path', async () => {
  const listObjectsFake = sinon.fake.resolves({
    Contents: [
      {
        Key: 'first-key',
        ETag: 'first-key-etag',
      },
      {
        Key: 'second-key',
        ETag: 'second-key-etag',
      },
    ],
  } as SDK.S3.ListObjectsOutput);

  AWS.mock('S3', 'listObjects', listObjectsFake);

  const event: AWSLambda.CloudFormationCustomResourceCreateEvent = {
    ...eventCommon,
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'token',
      Create: JSON.stringify({
        service: 'S3',
        action: 'listObjects',
        parameters: {
          Bucket: 'my-bucket',
        },
        physicalResourceId: PhysicalResourceId.of('id'),
        outputPath: 'Contents.0',
      } as AwsSdkCall),
    },
  };

  const request = createRequest(body =>
    body.Status === 'SUCCESS' &&
    body.PhysicalResourceId === 'id' &&
    body.Data!['Contents.0.Key'] === 'first-key' &&
    body.Data!['Contents.1.Key'] === undefined,
  );

  await handler(event, {} as AWSLambda.Context);

  expect(request.isDone()).toBeTruthy();
});

test('can specify apiVersion and region', async () => {
  const publishFake = sinon.fake.resolves({});

  AWS.mock('SNS', 'publish', publishFake);

  const event: AWSLambda.CloudFormationCustomResourceCreateEvent = {
    ...eventCommon,
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'token',
      Create: JSON.stringify({
        service: 'SNS',
        action: 'publish',
        parameters: {
          Message: 'message',
          TopicArn: 'topic',
        },
        apiVersion: '2010-03-31',
        region: 'eu-west-1',
        physicalResourceId: PhysicalResourceId.of('id'),
      } as AwsSdkCall),
    },
  };

  const request = createRequest(body =>
    body.Status === 'SUCCESS' &&
    body.Data!.apiVersion === '2010-03-31' &&
    body.Data!.region === 'eu-west-1',
  );

  await handler(event, {} as AWSLambda.Context);

  expect(request.isDone()).toBeTruthy();
});

test('flatten correctly flattens a nested object', () => {
  expect(flatten({
    a: { b: 'c' },
    d: [
      { e: 'f' },
      { g: 'h', i: 1, j: null, k: { l: false } },
    ],
  })).toEqual({
    'a.b': 'c',
    'd.0.e': 'f',
    'd.1.g': 'h',
    'd.1.i': 1,
    'd.1.j': null,
    'd.1.k.l': false,
  });
});

test('flatten correctly flattens an object with buffers', () => {
  expect(flatten({
    body: Buffer.from('body'),
    nested: {
      buffer: Buffer.from('buffer'),
      array: [
        Buffer.from('array.0'),
        Buffer.from('array.1'),
      ],
    },
  })).toEqual({
    'body': 'body',
    'nested.buffer': 'buffer',
    'nested.array.0': 'array.0',
    'nested.array.1': 'array.1',
  });
});

test('installs the latest SDK', async () => {
  const tmpPath = '/tmp/node_modules/aws-sdk';

  // Symlink to normal SDK to be able to call AWS.setSDK()
  await fs.ensureDir('/tmp/node_modules');
  await fs.symlink(require.resolve('aws-sdk'), tmpPath);
  AWS.setSDK(tmpPath);

  // Now remove the symlink and let the handler install it
  await fs.unlink(tmpPath);

  const publishFake = sinon.fake.resolves({});

  AWS.mock('SNS', 'publish', publishFake);

  const event: AWSLambda.CloudFormationCustomResourceCreateEvent = {
    ...eventCommon,
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'token',
      Create: JSON.stringify({
        service: 'SNS',
        action: 'publish',
        parameters: {
          Message: 'message',
          TopicArn: 'topic',
        },
        physicalResourceId: PhysicalResourceId.of('id'),
      } as AwsSdkCall),
      InstallLatestAwsSdk: 'true',
    },
  };

  const request = createRequest(body =>
    body.Status === 'SUCCESS',
  );

  // Reset to 'false' so that the next run will reinstall aws-sdk
  forceSdkInstallation();
  await handler(event, {} as AWSLambda.Context);

  expect(request.isDone()).toBeTruthy();

  expect(() => require.resolve(tmpPath)).not.toThrow();

  // clean up aws-sdk install
  await fs.remove(tmpPath);
});
