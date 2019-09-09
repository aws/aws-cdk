import SDK = require('aws-sdk');
import AWS = require('aws-sdk-mock');
import nock = require('nock');
import { Test } from 'nodeunit';
import sinon = require('sinon');
import { AwsSdkCall } from '../lib';
import { handler } from '../lib/aws-custom-resource-provider';

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

export = {
  'tearDown'(callback: any) {
    AWS.restore();
    nock.cleanAll();
    callback();
  },

  async 'create event with physical resource id path'(test: Test) {
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

    test.equal(request.isDone(), true);

    test.done();
  },

  async 'update event with physical resource id'(test: Test) {
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

    test.equal(request.isDone(), true);

    test.done();
  },

  async 'delete event'(test: Test) {
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

    test.equal(request.isDone(), true);

    test.done();
  },

  async 'catch errors'(test: Test) {
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

    test.equal(request.isDone(), true);

    test.done();
  },

  async 'decodes booleans'(test: Test) {
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

    test.equal(request.isDone(), true);

    test.done();
  },

  async 'restrict output path'(test: Test) {
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

    test.equal(request.isDone(), true);

    test.done();
  },
};
