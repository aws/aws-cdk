import SDK = require('aws-sdk');
import AWS = require('aws-sdk-mock');
import nock = require('nock');
import sinon = require('sinon');
import { AwsSdkCall } from '../../lib';
import { handler } from '../../lib/aws-custom-resource/runtime';

AWS.setSDK(require.resolve('aws-sdk'));

console.log = jest.fn(); // tslint:disable-line no-console

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

afterEach(() => {
  AWS.restore();
  nock.cleanAll();
});

test('create event with physical resource id path', async () => {
  const listObjectsFake = sinon.fake.resolves({
    Contents: [
      {
        Key: 'first-key',
        ETag: 'first-key-etag'
      },
      {
        Key: 'second-key',
        ETag: 'second-key-etag',
      }
    ]
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
          Bucket: 'my-bucket'
        },
        physicalResourceIdPath: 'Contents.1.ETag'
      } as AwsSdkCall
    }
  };

  const request = createRequest(body =>
    body.Status === 'SUCCESS' &&
    body.PhysicalResourceId === 'second-key-etag' &&
    body.Data!['Contents.0.Key'] === 'first-key'
  );

  await handler(event, {} as AWSLambda.Context);

  sinon.assert.calledWith(listObjectsFake, {
    Bucket: 'my-bucket'
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
          TopicArn: 'topicarn'
        },
        physicalResourceId: 'topicarn'
      } as AwsSdkCall
    }
  };

  const request = createRequest(body =>
    body.Status === 'SUCCESS' &&
    body.PhysicalResourceId === 'topicarn'
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
          Bucket: 'my-bucket'
        },
        physicalResourceIdPath: 'Contents.1.ETag'
      } as AwsSdkCall
    }
  };

  const request = createRequest(body =>
    body.Status === 'SUCCESS' &&
    body.PhysicalResourceId === 'physicalResourceId' &&
    Object.keys(body.Data!).length === 0
  );

  await handler(event, {} as AWSLambda.Context);

  sinon.assert.notCalled(listObjectsFake);

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
          Bucket: 'my-bucket'
        },
        physicalResourceId: 'physicalResourceId',
        catchErrorPattern: 'NoSuchBucket'
      } as AwsSdkCall
    }
  };

  const request = createRequest(body =>
    body.Status === 'SUCCESS' &&
    body.PhysicalResourceId === 'physicalResourceId' &&
    Object.keys(body.Data!).length === 0
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
              BOOL: 'TRUE:BOOLEAN'
            },
            TrueString: {
              S: 'true'
            },
            False: {
              BOOL: 'FALSE:BOOLEAN'
            },
            FalseString: {
              S: 'false'
            },
          }
        },
        physicalResourceId: 'put-item'
      } as AwsSdkCall
    }
  };

  const request = createRequest(body =>
    body.Status === 'SUCCESS'
  );

  await handler(event, {} as AWSLambda.Context);

  sinon.assert.calledWith(putItemFake, {
    TableName: 'table',
    Item: {
      True: {
        BOOL: true
      },
      TrueString: {
        S: 'true'
      },
      False: {
        BOOL: false
      },
      FalseString: {
        S: 'false'
      },
    }
  });

  expect(request.isDone()).toBeTruthy();
});

test('restrict output path', async () => {
  const listObjectsFake = sinon.fake.resolves({
    Contents: [
      {
        Key: 'first-key',
        ETag: 'first-key-etag'
      },
      {
        Key: 'second-key',
        ETag: 'second-key-etag',
      }
    ]
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
          Bucket: 'my-bucket'
        },
        physicalResourceId: 'id',
        outputPath: 'Contents.0'
      } as AwsSdkCall
    }
  };

  const request = createRequest(body =>
    body.Status === 'SUCCESS' &&
    body.PhysicalResourceId === 'id' &&
    body.Data!['Contents.0.Key'] === 'first-key' &&
    body.Data!['Contents.1.Key'] === undefined
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
          TopicArn: 'topic'
        },
        apiVersion: '2010-03-31',
        region: 'eu-west-1',
        physicalResourceId: 'id',
      } as AwsSdkCall
    }
  };

  const request = createRequest(body =>
    body.Status === 'SUCCESS' &&
    body.Data!.apiVersion === '2010-03-31' &&
    body.Data!.region === 'eu-west-1'
  );

  await handler(event, {} as AWSLambda.Context);

  expect(request.isDone()).toBeTruthy();
});
