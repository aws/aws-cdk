import * as SDK from 'aws-sdk';
import * as AWS from 'aws-sdk-mock';
import * as fs from 'fs-extra';
import * as nock from 'nock';
import * as sinon from 'sinon';
import { AwsSdkCall, PhysicalResourceId } from '../../lib';
import { flatten, handler, forceSdkInstallation } from '../../lib/aws-custom-resource/runtime';

/* eslint-disable no-console */

AWS.setSDK(require.resolve('aws-sdk'));

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
  process.env.USE_NORMAL_SDK = 'true';
});

afterEach(() => {
  AWS.restore();
  nock.cleanAll();
  delete process.env.USE_NORMAL_SDK;
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
      Create: {
        service: 'S3',
        action: 'listObjects',
        parameters: {
          Bucket: 'my-bucket',
        },
        physicalResourceId: PhysicalResourceId.fromResponse('Contents.1.ETag'),
      } as AwsSdkCall,
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
      Update: {
        service: 'SNS',
        action: 'publish',
        parameters: {
          Message: 'hello',
          TopicArn: 'topicarn',
        },
        physicalResourceId: PhysicalResourceId.of('topicarn'),
      } as AwsSdkCall,
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
      Create: {
        service: 'S3',
        action: 'listObjects',
        parameters: {
          Bucket: 'my-bucket',
        },
        physicalResourceId: PhysicalResourceId.fromResponse('Contents.1.ETag'),
      } as AwsSdkCall,
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
      Delete: {
        service: 'SSM',
        action: 'deleteParameter',
        parameters: {
          Name: 'my-param',
        },
      } as AwsSdkCall,
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
      Delete: {
        service: 'SSM',
        action: 'deleteParameter',
        parameters: {
          Name: 'my-param',
        },
      } as AwsSdkCall,
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
      Create: {
        service: 'S3',
        action: 'listObjects',
        parameters: {
          Bucket: 'my-bucket',
        },
        physicalResourceId: PhysicalResourceId.of('physicalResourceId'),
        ignoreErrorCodesMatching: 'NoSuchBucket',
      } as AwsSdkCall,
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

test('decodes booleans', async () => {
  const putItemFake = sinon.fake.resolves({});

  AWS.mock('DynamoDB', 'putItem', putItemFake);

  const event: AWSLambda.CloudFormationCustomResourceCreateEvent = {
    ...eventCommon,
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'token',
      Create: {
        service: 'DynamoDB',
        action: 'putItem',
        parameters: {
          TableName: 'table',
          Item: {
            True: {
              BOOL: 'TRUE:BOOLEAN',
            },
            TrueString: {
              S: 'true',
            },
            False: {
              BOOL: 'FALSE:BOOLEAN',
            },
            FalseString: {
              S: 'false',
            },
          },
        },
        physicalResourceId: PhysicalResourceId.of('put-item'),
      } as AwsSdkCall,
    },
  };

  const request = createRequest(body =>
    body.Status === 'SUCCESS',
  );

  await handler(event, {} as AWSLambda.Context);

  sinon.assert.calledWith(putItemFake, {
    TableName: 'table',
    Item: {
      True: {
        BOOL: true,
      },
      TrueString: {
        S: 'true',
      },
      False: {
        BOOL: false,
      },
      FalseString: {
        S: 'false',
      },
    },
  });

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
      Create: {
        service: 'S3',
        action: 'listObjects',
        parameters: {
          Bucket: 'my-bucket',
        },
        physicalResourceId: PhysicalResourceId.of('id'),
        outputPath: 'Contents.0',
      } as AwsSdkCall,
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
      Create: {
        service: 'SNS',
        action: 'publish',
        parameters: {
          Message: 'message',
          TopicArn: 'topic',
        },
        apiVersion: '2010-03-31',
        region: 'eu-west-1',
        physicalResourceId: PhysicalResourceId.of('id'),
      } as AwsSdkCall,
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

test('installs the latest SDK', async () => {
  const tmpPath = '/tmp/node_modules/aws-sdk';

  await fs.remove(tmpPath);

  const publishFake = sinon.fake.resolves({});

  AWS.mock('SNS', 'publish', publishFake);

  const event: AWSLambda.CloudFormationCustomResourceCreateEvent = {
    ...eventCommon,
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'token',
      Create: {
        service: 'SNS',
        action: 'publish',
        parameters: {
          Message: 'message',
          TopicArn: 'topic',
        },
        physicalResourceId: PhysicalResourceId.of('id'),
      } as AwsSdkCall,
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
});
