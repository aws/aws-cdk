import * as S3 from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import * as AWS from 'aws-sdk-mock';
import * as fs from 'fs-extra';
import * as nock from 'nock';
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

const s3MockClient = mockClient(S3.S3Client);

beforeEach(() => {
  s3MockClient.reset();
});

afterEach(() => {
  s3MockClient.reset();
  nock.cleanAll();
});

test('create event with physical resource id path', async () => {
  s3MockClient.on(S3.ListObjectsCommand).resolves({
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
  } as S3.ListObjectsCommandOutput);

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
  const commandCalls = s3MockClient.commandCalls(S3.ListObjectsCommand);
  expect(commandCalls[0].args[0].input).toEqual({
    Bucket: 'my-bucket',
  });

  expect(request.isDone()).toBeTruthy();
});

test('update event with physical resource id', async () => {
  s3MockClient.on(S3.GetObjectCommand).resolves({});

  const event: AWSLambda.CloudFormationCustomResourceUpdateEvent = {
    ...eventCommon,
    RequestType: 'Update',
    PhysicalResourceId: 'physicalResourceId',
    OldResourceProperties: {},
    ResourceProperties: {
      ServiceToken: 'token',
      Update: JSON.stringify({
        service: 'S3',
        action: 'getObject',
        parameters: {
          Bucket: 'hello',
          Key: 'key',
        },
        physicalResourceId: PhysicalResourceId.of('key'),
      } as AwsSdkCall),
    },
  };

  const request = createRequest(body =>
    body.Status === 'SUCCESS' &&
    body.PhysicalResourceId === 'key',
  );

  await handler(event, {} as AWSLambda.Context);

  expect(request.isDone()).toBeTruthy();
});

test('delete event', async () => {
  s3MockClient.on(S3.ListObjectsCommand).resolves({});

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

  const commandCalls = s3MockClient.commandCalls(S3.ListObjectsCommand);
  expect(commandCalls.length).toBe(0);

  expect(request.isDone()).toBeTruthy();
});

test('delete event with Delete call and no physical resource id in call', async () => {
  s3MockClient.on(S3.DeleteObjectCommand).resolves({});

  const event: AWSLambda.CloudFormationCustomResourceDeleteEvent = {
    ...eventCommon,
    RequestType: 'Delete',
    PhysicalResourceId: 'physicalResourceId',
    ResourceProperties: {
      ServiceToken: 'token',
      Delete: JSON.stringify({
        service: 'S3',
        action: 'deleteObject',
        parameters: {
          Bucket: 'my-bucket',
          Key: 'my-object',
        },
      } as AwsSdkCall),
    },
  };

  const request = createRequest(body =>
    body.Status === 'SUCCESS' &&
    body.PhysicalResourceId === 'physicalResourceId',
  );

  await handler(event, {} as AWSLambda.Context);

  const commandCalls = s3MockClient.commandCalls(S3.DeleteObjectCommand);
  expect(commandCalls[0].args[0].input).toMatchObject({
    Bucket: 'my-bucket',
    Key: 'my-object',
  });

  expect(request.isDone()).toBeTruthy();
});

test('create event with Delete call only', async () => {
  s3MockClient.on(S3.DeleteObjectCommand).resolves({});

  const event: AWSLambda.CloudFormationCustomResourceCreateEvent = {
    ...eventCommon,
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'token',
      Delete: JSON.stringify({
        service: 'S3',
        action: 'deleteObject',
        parameters: {
          Bucket: 'my-bucket',
          Key: 'my-object',
        },
      } as AwsSdkCall),
    },
  };

  const request = createRequest(body =>
    body.Status === 'SUCCESS' &&
    body.PhysicalResourceId === 'logicalResourceId',
  );

  await handler(event, {} as AWSLambda.Context);

  const commandCalls = s3MockClient.commandCalls(S3.DeleteObjectCommand);
  expect(commandCalls.length).toBe(0);

  expect(request.isDone()).toBeTruthy();
});

test('catch errors', async () => {
  const error: NodeJS.ErrnoException = new Error();
  error.code = 'NoSuchBucket';
  s3MockClient.on(S3.ListObjectsCommand).rejects(error);

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
  s3MockClient.on(S3.ListObjectsCommand).resolves({
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
  } as S3.ListObjectsCommandOutput);

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

test('restrict output paths', async () => {
  s3MockClient.on(S3.ListObjectsCommand).resolves({
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
  } as S3.ListObjectsCommandOutput);

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
        outputPaths: ['Contents.0.Key', 'Contents.1.Key'],
      } as AwsSdkCall),
    },
  };

  const request = createRequest(body =>
    body.Status === 'SUCCESS' &&
    body.PhysicalResourceId === 'id' &&
    JSON.stringify(body.Data) === JSON.stringify({
      'Contents.0.Key': 'first-key',
      'Contents.1.Key': 'second-key',
    }),
  );

  await handler(event, {} as AWSLambda.Context);

  expect(request.isDone()).toBeTruthy();
});

test('can specify apiVersion and region', async () => {
  s3MockClient.on(S3.GetObjectCommand).resolves({});

  const event: AWSLambda.CloudFormationCustomResourceCreateEvent = {
    ...eventCommon,
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'token',
      Create: JSON.stringify({
        service: 'S3',
        action: 'getObject',
        parameters: {
          Bucket: 'my-bucket',
          Key: 'key',
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
  const tmpPath = '/tmp/node_modules/@aws-sdk/client-s3';

  // Symlink to normal SDK to be able to call AWS.setSDK()
  await fs.ensureDir('/tmp/node_modules');
  await fs.symlink(require.resolve('@aws-sdk/client-s3'), tmpPath);
  AWS.setSDK(tmpPath);

  // Now remove the symlink and let the handler install it
  await fs.unlink(tmpPath);

  s3MockClient.on(S3.GetObjectCommand).resolves({});

  const event: AWSLambda.CloudFormationCustomResourceCreateEvent = {
    ...eventCommon,
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'token',
      Create: JSON.stringify({
        service: 'S3',
        action: 'getObject',
        parameters: {
          Bucket: 'my-bucket',
          Key: 'key',
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

test('invalid service name throws explicit error', async () => {
  s3MockClient.on(S3.GetObjectCommand).resolves({});

  const event: AWSLambda.CloudFormationCustomResourceCreateEvent = {
    ...eventCommon,
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'token',
      Create: JSON.stringify({
        service: 'thisisnotarealservice',
        action: 'getObject',
        parameters: {
          Bucket: 'my-bucket',
          Key: 'key',
        },
        physicalResourceId: PhysicalResourceId.of('id'),
      } as AwsSdkCall),
    },
  };

  const request = createRequest(body =>
    body.Status === 'FAILED' &&
    body.Reason!.startsWith('Service thisisnotarealservice does not exist'),
  );

  await handler(event, {} as AWSLambda.Context);

  expect(request.isDone()).toBeTruthy();
});

