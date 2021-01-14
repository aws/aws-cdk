const mockS3Client = {
  listObjectVersions: jest.fn().mockReturnThis(),
  deleteObjects: jest.fn().mockReturnThis(),
  promise: jest.fn(),
};

import { handler } from '../lib/auto-delete-objects-handler';

jest.mock('aws-sdk', () => {
  return { S3: jest.fn(() => mockS3Client) };
});

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

// helper function to get around TypeScript expecting a complete event object,
// even though our tests only need some of the fields
async function invokeHandler(event: Partial<AWSLambda.CloudFormationCustomResourceEvent>) {
  return handler(event as AWSLambda.CloudFormationCustomResourceEvent);
}
