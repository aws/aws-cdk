const mockS3Client = {
  listObjectVersions: jest.fn(),
  deleteObjects: jest.fn(),
  getBucketTagging: jest.fn(),
};

import { autoDeleteHandler } from '../../lib/aws-s3/auto-delete-objects-handler';

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3: jest.fn().mockImplementation(() => {
      return mockS3Client;
    })
  }
})

beforeEach(() => {
  mockS3Client.listObjectVersions.mockReturnThis();
  mockS3Client.deleteObjects.mockReturnThis();
  givenTaggedForDeletion();
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

test('does nothing on update event when everything remains the same', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceUpdateEvent> = {
    RequestType: 'Update',
    ResourceProperties: {
      ServiceToken: 'Foo',
      BucketName: 'MyBucket',
    },
    OldResourceProperties: {
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

test('does nothing on update event when the bucket name remains the same but the service token changes', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceUpdateEvent> = {
    RequestType: 'Update',
    ResourceProperties: {
      ServiceToken: 'Foo',
      BucketName: 'MyBucket',
    },
    OldResourceProperties: {
      ServiceToken: 'Bar',
      BucketName: 'MyBucket',
    },
  };

  // WHEN
  await invokeHandler(event);

  // THEN
  expect(mockS3Client.listObjectVersions).toHaveBeenCalledTimes(0);
  expect(mockS3Client.deleteObjects).toHaveBeenCalledTimes(0);
});

test('does nothing on update event when the old resource properties are absent', async () => {
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

test('does nothing on update event when the new resource properties are absent', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceUpdateEvent> = {
    RequestType: 'Update',
    OldResourceProperties: {
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

test('deletes all objects when the name changes on update event', async () => {
  // GIVEN
  mockS3Client.listObjectVersions.mockReturnValue({
    Versions: [
      { Key: 'Key1', VersionId: 'VersionId1' },
      { Key: 'Key2', VersionId: 'VersionId2' },
    ],
  });

  const event: Partial<AWSLambda.CloudFormationCustomResourceUpdateEvent> = {
    RequestType: 'Update',
    OldResourceProperties: {
      ServiceToken: 'Foo',
      BucketName: 'MyBucket',
    },
    ResourceProperties: {
      ServiceToken: 'Foo',
      BucketName: 'MyBucket-renamed',
    },
  };

  // WHEN
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

test('deletes no objects on delete event when bucket has no objects', async () => {
  // GIVEN
  mockS3Client.listObjectVersions.mockReturnValue({ Versions: [] });

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
  mockS3Client.listObjectVersions.mockReturnValue({
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

test('does not empty bucket if it is not tagged', async () => {
  // GIVEN
  givenNotTaggedForDeletion();
  mockS3Client.listObjectVersions.mockReturnValue({
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
  expect(mockS3Client.listObjectVersions).not.toHaveBeenCalled();
});

test('delete event where bucket has many objects does recurse appropriately', async () => {
  // GIVEN
  mockS3Client.listObjectVersions.mockReturnValueOnce({
    Versions: [
      { Key: 'Key1', VersionId: 'VersionId1' },
      { Key: 'Key2', VersionId: 'VersionId2' },
    ],
    IsTruncated: true,
  });
  mockS3Client.listObjectVersions.mockReturnValueOnce({
    Versions: [
      { Key: 'Key3', VersionId: 'VersionId3' },
      { Key: 'Key4', VersionId: 'VersionId4' },
    ],
  });
  mockS3Client.deleteObjects.mockReturnValue({});

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

test('does nothing when the bucket does not exist', async () => {
  // GIVEN
  mockS3Client.listObjectVersions.mockRejectedValue({ code: 'NoSuchBucket' });

  // WHEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceDeleteEvent> = {
    RequestType: 'Delete',
    ResourceProperties: {
      ServiceToken: 'Foo',
      BucketName: 'MyBucket',
    },
  };
  await invokeHandler(event);

  expect(mockS3Client.deleteObjects).not.toHaveBeenCalled();
});

// helper function to get around TypeScript expecting a complete event object,
// even though our tests only need some of the fields
async function invokeHandler(event: Partial<AWSLambda.CloudFormationCustomResourceEvent>) {
  return autoDeleteHandler(event as AWSLambda.CloudFormationCustomResourceEvent);
}

function givenTaggedForDeletion() {
  mockS3Client.getBucketTagging.mockReturnValue({
    TagSet: [
      {
        Key: 'aws-cdk:auto-delete-objects',
        Value: 'true',
      },
    ],
  });
}

function givenNotTaggedForDeletion() {
  mockS3Client.getBucketTagging.mockReturnValue({
    TagSet: [],
  });
}
