import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as s3 from '../lib';
import { handler } from '../lib/auto-delete-objects-handler/index';

test('when autoDeleteObjects is enabled, a custom resource is provisioned + a lambda handler for it', () => {
  const stack = new cdk.Stack();

  new s3.Bucket(stack, 'MyBucket', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  });

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
  const app = new cdk.App();
  const stack = new cdk.Stack(app);

  new s3.Bucket(stack, 'MyBucketOne', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  });
  new s3.Bucket(stack, 'MyBucketTwo', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  });

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
  const app = new cdk.App();
  const stack = new cdk.Stack(app);

  new s3.Bucket(stack, 'MyBucketOne', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  });
  new s3.Bucket(stack, 'MyBucketTwo', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: false,
  });

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
  const stack = new cdk.Stack();

  new s3.Bucket(stack, 'MyBucket', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  });

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
  const stack = new cdk.Stack();

  expect(() => new s3.Bucket(stack, 'MyBucket', { autoDeleteObjects: true })).toThrowError(/removal policy/);
});

describe('custom resource handler', () => {

  const mockS3Client = {
    listObjectVersions: jest.fn().mockReturnThis(),
    deleteObjects: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };

  jest.mock('aws-sdk', () => {
    return { S3: jest.fn(() => mockS3Client) };
  });

  beforeEach(() => {
    mockS3Client.deleteObjects.mockClear();
    mockS3Client.listObjectVersions.mockClear();
    mockS3Client.promise.mockClear();
  });

  test('does nothing on create event', async () => {
    const event: Partial<AWSLambda.CloudFormationCustomResourceCreateEvent> = {
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'Foo',
        BucketName: 'MyBucket',
      },
    };
    await invokeHandler(event);

    expect(mockS3Client.listObjectVersions).not.toHaveBeenCalled();
    expect(mockS3Client.deleteObjects).not.toHaveBeenCalled();
  });

  test('does nothing on update event', async () => {
    const event: Partial<AWSLambda.CloudFormationCustomResourceUpdateEvent> = {
      RequestType: 'Update',
      ResourceProperties: {
        ServiceToken: 'Foo',
        BucketName: 'MyBucket',
      },
    };
    await invokeHandler(event);

    expect(mockS3Client.listObjectVersions).not.toHaveBeenCalled();
    expect(mockS3Client.deleteObjects).not.toHaveBeenCalled();
  });

  test('deletes no objects on delete event when bucket has no objects', async () => {
    mockS3Client.listObjectVersions().promise.mockResolvedValue({ Versions: [] }); // this counts as one call

    const event: Partial<AWSLambda.CloudFormationCustomResourceDeleteEvent> = {
      RequestType: 'Delete',
      ResourceProperties: {
        ServiceToken: 'Foo',
        BucketName: 'MyBucket',
      },
    };
    await invokeHandler(event);

    expect(mockS3Client.listObjectVersions.mock.calls.length).toEqual(2);
    expect(mockS3Client.deleteObjects).not.toHaveBeenCalled();
  });

  test('deletes all objects on delete event', async () => {
    mockS3Client.listObjectVersions().promise.mockResolvedValue({ // this counts as one call
      Versions: [
        { Key: 'Key1', VersionId: 'VersionId1' },
        { Key: 'Key2', VersionId: 'VersionId2' },
      ],
    });

    const event: Partial<AWSLambda.CloudFormationCustomResourceDeleteEvent> = {
      RequestType: 'Delete',
      ResourceProperties: {
        ServiceToken: 'Foo',
        BucketName: 'MyBucket',
      },
    };
    await invokeHandler(event);

    expect(mockS3Client.listObjectVersions.mock.calls.length).toEqual(2);
    expect(mockS3Client.deleteObjects.mock.calls.length).toEqual(1);
  });

  test('delete event where bucket has many objects does recurse appropriately', async () => {
    mockS3Client.listObjectVersions().promise.mockResolvedValueOnce({ // this counts as one call
      Versions: [
        { Key: 'Key1', VersionId: 'VersionId1' },
        { Key: 'Key2', VersionId: 'VersionId2' },
      ],
      IsTruncated: 'true',
    }).mockResolvedValueOnce({
      Versions: [
        { Key: 'Key3', VersionId: 'VersionId3' },
        { Key: 'Key4', VersionId: 'VersionId4' },
      ],
    });

    const event: Partial<AWSLambda.CloudFormationCustomResourceDeleteEvent> = {
      RequestType: 'Delete',
      ResourceProperties: {
        ServiceToken: 'Foo',
        BucketName: 'MyBucket',
      },
    };
    await invokeHandler(event);

    expect(mockS3Client.listObjectVersions.mock.calls.length).toEqual(3);
    expect(mockS3Client.deleteObjects.mock.calls.length).toEqual(2);
  });
});

// helper function to get around TypeScript expecting a complete event object,
// even though our tests require some of the fields
async function invokeHandler(event: Partial<AWSLambda.CloudFormationCustomResourceEvent>) {
  return handler(event as AWSLambda.CloudFormationCustomResourceEvent);
}
