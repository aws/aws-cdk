// must be at the top of the file for successful jest mocking
const mockS3Client = {
  listObjectVersions: jest.fn().mockReturnThis(),
  deleteObjects: jest.fn().mockReturnThis(),
  promise: jest.fn(),
};

import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as s3 from '../lib';
import { handler } from '../lib/auto-delete-objects-handler';

jest.mock('aws-sdk', () => {
  return { S3: jest.fn(() => mockS3Client) };
});

test('when autoDeleteObjects is enabled, a custom resource is provisioned + a lambda handler for it', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new s3.Bucket(stack, 'MyBucket', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  });

  // THEN
  expect(stack).toHaveResource('AWS::S3::Bucket');
  expect(stack).toHaveResource('AWS::Lambda::Function');
  expect(stack).toHaveResource('Custom::AutoDeleteObjects',
    {
      BucketName: { Ref: 'MyBucketF68F3FF0' },
      ServiceToken: {
        'Fn::GetAtt': [
          'CustomAutoDeleteObjectsCustomResourceProviderHandlerE060A45A',
          'Arn',
        ],
      },
    });
});

test('two buckets with autoDeleteObjects enabled share the same cr provider', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app);

  // WHEN
  new s3.Bucket(stack, 'MyBucketOne', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  });
  new s3.Bucket(stack, 'MyBucketTwo', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  });

  // THEN
  const template = app.synth().getStackArtifact(stack.artifactId).template;
  const resourceTypes = Object.values(template.Resources).map((r: any) => r.Type).sort();

  expect(resourceTypes).toStrictEqual([
    // custom resource provider resources (shared)
    'AWS::IAM::Role',
    'AWS::Lambda::Function',

    // buckets
    'AWS::S3::Bucket',
    'AWS::S3::Bucket',

    // auto delete object resources
    'Custom::AutoDeleteObjects',
    'Custom::AutoDeleteObjects',
  ]);
});

test('when only one bucket has autoDeleteObjects enabled, only that bucket gets assigned a custom resource', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app);

  // WHEN
  new s3.Bucket(stack, 'MyBucketOne', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  });
  new s3.Bucket(stack, 'MyBucketTwo', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: false,
  });

  // THEN
  const template = app.synth().getStackArtifact(stack.artifactId).template;
  const resourceTypes = Object.values(template.Resources).map((r: any) => r.Type).sort();

  expect(resourceTypes).toStrictEqual([
    // custom resource provider resources
    'AWS::IAM::Role',
    'AWS::Lambda::Function',

    // buckets
    'AWS::S3::Bucket',
    'AWS::S3::Bucket',

    // auto delete object resource
    'Custom::AutoDeleteObjects',
  ]);

  // custom resource for MyBucket1 is present
  expect(stack).toHaveResource('Custom::AutoDeleteObjects',
    { BucketName: { Ref: 'MyBucketOneA6BE54C9' } });

  // custom resource for MyBucket2 is not present
  expect(stack).not.toHaveResource('Custom::AutoDeleteObjects',
    { BucketName: { Ref: 'MyBucketTwoC7437026' } });
});

test('iam policy is created', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new s3.Bucket(stack, 'MyBucket', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  });

  // THEN
  expect(stack).toHaveResource('AWS::IAM::Role', {
    Policies: [
      {
        PolicyName: 'Inline',
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Resource: '*',
              Action: [
                's3:GetObject*',
                's3:GetBucket*',
                's3:List*',
                's3:DeleteObject*',
              ],
            },
          ],
        },
      },
    ],
  });
});

test('throws if autoDeleteObjects is enabled but if removalPolicy is not specified', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  // THEN
  expect(() => new s3.Bucket(stack, 'MyBucket', { autoDeleteObjects: true })).toThrowError(/removal policy/);
});

describe('custom resource handler', () => {

  beforeEach(() => {
    mockS3Client.listObjectVersions.mockReturnThis();
    mockS3Client.deleteObjects.mockReturnThis();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('does nothing on create event', async () => {
    // GIVEN
    const event: Partial<AWSLambda.CloudFormationCustomResourceCreateEvent> = {
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'Foo',
        BucketName: 'MyBucket',
      },
    };

    // WHEN
    await invokeHandler(event);

    // THEN
    expect(mockS3Client.listObjectVersions).toHaveBeenCalledTimes(0);
    expect(mockS3Client.deleteObjects).toHaveBeenCalledTimes(0);
  });

  test('does nothing on update event', async () => {
    // GIVEN
    const event: Partial<AWSLambda.CloudFormationCustomResourceUpdateEvent> = {
      RequestType: 'Update',
      ResourceProperties: {
        ServiceToken: 'Foo',
        BucketName: 'MyBucket',
      },
    };

    // WHEN
    await invokeHandler(event);

    // THEN
    expect(mockS3Client.listObjectVersions).toHaveBeenCalledTimes(0);
    expect(mockS3Client.deleteObjects).toHaveBeenCalledTimes(0);
  });

  test('deletes no objects on delete event when bucket has no objects', async () => {
    // GIVEN
    mockS3Client.promise.mockResolvedValue({ Versions: [] }); // listObjectVersions() call

    // WHEN
    const event: Partial<AWSLambda.CloudFormationCustomResourceDeleteEvent> = {
      RequestType: 'Delete',
      ResourceProperties: {
        ServiceToken: 'Foo',
        BucketName: 'MyBucket',
      },
    };
    await invokeHandler(event);

    // THEN
    expect(mockS3Client.listObjectVersions).toHaveBeenCalledTimes(1);
    expect(mockS3Client.listObjectVersions).toHaveBeenCalledWith({ Bucket: 'MyBucket' });
    expect(mockS3Client.deleteObjects).toHaveBeenCalledTimes(0);
  });

  test('deletes all objects on delete event', async () => {
    // GIVEN
    mockS3Client.promise.mockResolvedValue({ // listObjectVersions() call
      Versions: [
        { Key: 'Key1', VersionId: 'VersionId1' },
        { Key: 'Key2', VersionId: 'VersionId2' },
      ],
    });

    // WHEN
    const event: Partial<AWSLambda.CloudFormationCustomResourceDeleteEvent> = {
      RequestType: 'Delete',
      ResourceProperties: {
        ServiceToken: 'Foo',
        BucketName: 'MyBucket',
      },
    };
    await invokeHandler(event);

    // THEN
    expect(mockS3Client.listObjectVersions).toHaveBeenCalledTimes(1);
    expect(mockS3Client.listObjectVersions).toHaveBeenCalledWith({ Bucket: 'MyBucket' });
    expect(mockS3Client.deleteObjects).toHaveBeenCalledTimes(1);
    expect(mockS3Client.deleteObjects).toHaveBeenCalledWith({
      Bucket: 'MyBucket',
      Delete: {
        Objects: [
          { Key: 'Key1', VersionId: 'VersionId1' },
          { Key: 'Key2', VersionId: 'VersionId2' },
        ],
      },
    });
  });

  test('delete event where bucket has many objects does recurse appropriately', async () => {
    // GIVEN
    mockS3Client.promise // listObjectVersions() call
      .mockResolvedValueOnce({
        Versions: [
          { Key: 'Key1', VersionId: 'VersionId1' },
          { Key: 'Key2', VersionId: 'VersionId2' },
        ],
        IsTruncated: true,
      })
      .mockResolvedValueOnce(undefined) // deleteObjects() call
      .mockResolvedValueOnce({ // listObjectVersions() call
        Versions: [
          { Key: 'Key3', VersionId: 'VersionId3' },
          { Key: 'Key4', VersionId: 'VersionId4' },
        ],
      });

    // WHEN
    const event: Partial<AWSLambda.CloudFormationCustomResourceDeleteEvent> = {
      RequestType: 'Delete',
      ResourceProperties: {
        ServiceToken: 'Foo',
        BucketName: 'MyBucket',
      },
    };
    await invokeHandler(event);

    // THEN
    expect(mockS3Client.listObjectVersions).toHaveBeenCalledTimes(2);
    expect(mockS3Client.listObjectVersions).toHaveBeenCalledWith({ Bucket: 'MyBucket' });
    expect(mockS3Client.deleteObjects).toHaveBeenCalledTimes(2);
    expect(mockS3Client.deleteObjects).toHaveBeenNthCalledWith(1, {
      Bucket: 'MyBucket',
      Delete: {
        Objects: [
          { Key: 'Key1', VersionId: 'VersionId1' },
          { Key: 'Key2', VersionId: 'VersionId2' },
        ],
      },
    });
    expect(mockS3Client.deleteObjects).toHaveBeenNthCalledWith(2, {
      Bucket: 'MyBucket',
      Delete: {
        Objects: [
          { Key: 'Key3', VersionId: 'VersionId3' },
          { Key: 'Key4', VersionId: 'VersionId4' },
        ],
      },
    });
  });
});

// helper function to get around TypeScript expecting a complete event object,
// even though our tests only need some of the fields
async function invokeHandler(event: Partial<AWSLambda.CloudFormationCustomResourceEvent>) {
  return handler(event as AWSLambda.CloudFormationCustomResourceEvent);
}
