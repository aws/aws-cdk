const mockS3Client = {
  listObjectVersions: jest.fn(),
  deleteObjects: jest.fn(),
  promise: jest.fn(),
};

const mockCfnClient = {
  describeStacks: jest.fn(),
  getTemplate: jest.fn(),
  promise: jest.fn(),
};

import { handler } from '../lib/auto-delete-objects-handler';

jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn(() => mockS3Client),
    CloudFormation: jest.fn(() => mockCfnClient),
  };
});

beforeEach(() => {
  mockS3Client.listObjectVersions.mockReturnThis();
  mockS3Client.deleteObjects.mockReturnThis();
  mockCfnClient.describeStacks.mockReturnThis();
  mockCfnClient.getTemplate.mockReturnThis();
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
      BucketLogicalId: 'LogicalId',
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
      BucketLogicalId: 'LogicalId',
    },
    OldResourceProperties: {
      ServiceToken: 'Foo',
      BucketName: 'MyBucket',
      BucketLogicalId: 'LogicalId',
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
      BucketLogicalId: 'LogicalId',
    },
    OldResourceProperties: {
      ServiceToken: 'Bar',
      BucketName: 'MyBucket',
      BucketLogicalId: 'LogicalId',
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
      BucketLogicalId: 'LogicalId',
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
      BucketLogicalId: 'LogicalId',
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
  mockS3Client.promise.mockResolvedValue({ // listObjectVersions() call
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
      BucketLogicalId: 'LogicalId',
    },
    ResourceProperties: {
      ServiceToken: 'Foo',
      BucketName: 'MyBucket-renamed',
      BucketLogicalId: 'LogicalId',
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
  mockS3Client.promise.mockResolvedValue({ Versions: [] }); // listObjectVersions() call
  mockStackBeingDeleted();

  // WHEN
  await standardDeleteInvocation();

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
  mockStackBeingDeleted();

  // WHEN
  await standardDeleteInvocation();

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
  mockStackBeingDeleted();
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
  await standardDeleteInvocation();

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

function mockCloudFormation(stackStatus: string, template: any) {
  mockCfnClient.describeStacks.mockReturnValue({
    promise: () => Promise.resolve({
      Stacks: [
        { StackStatus: stackStatus },
      ],
    }),
  });
  mockCfnClient.getTemplate.mockReturnValue({
    promise: () => Promise.resolve({
      TemplateBody: JSON.stringify(template),
    }),
  });
}

test('empty on stack creation rollback', async () => {
  // GIVEN
  mockS3Client.promise.mockResolvedValue({ Version: [] });
  mockStackCreationBeingRolledBack();

  // WHEN
  await standardDeleteInvocation();

  // THEN
  expect(mockS3Client.listObjectVersions).toHaveBeenCalled();
});

test('empty on stack deletion', async () => {
  // GIVEN
  mockS3Client.promise.mockResolvedValue({ Version: [] });
  mockStackBeingDeleted();

  // WHEN
  await standardDeleteInvocation();

  // THEN
  expect(mockS3Client.listObjectVersions).toHaveBeenCalled();
});


test.each([false, true])('resource deleted when bucket remains: %p', async (resourceRemains) => {
  // GIVEN
  mockS3Client.promise.mockResolvedValue({ Version: [] });
  mockStackUpdateRollforward(resourceRemains);

  // WHEN
  await standardDeleteInvocation();

  // THEN
  if (resourceRemains) {
    expect(mockS3Client.listObjectVersions).not.toHaveBeenCalled();
  } else {
    expect(mockS3Client.listObjectVersions).toHaveBeenCalled();
  }
});

test.each([false, true])('update rolled back when bucket existed beforehand: %p', async (bucketExistedBeforehand) => {
  // GIVEN
  mockS3Client.promise.mockResolvedValue({ Version: [] });
  mockStackUpdateRollback(bucketExistedBeforehand);

  // WHEN
  await standardDeleteInvocation();

  // THEN
  if (bucketExistedBeforehand) {
    expect(mockS3Client.listObjectVersions).not.toHaveBeenCalled();
  } else {
    expect(mockS3Client.listObjectVersions).toHaveBeenCalled();
  }
});

function mockStackBeingDeleted() {
  mockCloudFormation('DELETE_IN_PROGRESS', {});
}

function mockStackCreationBeingRolledBack() {
  mockCloudFormation('ROLLBACK_IN_PROGRESS', {});
}

function mockStackUpdateRollforward(resourceRemains: boolean) {
  mockCloudFormation('UPDATE_COMPLETE_CLEANUP_IN_PROGRESS',
    resourceRemains ? { Resources: { LogicalId: { } } } : {});
}

function mockStackUpdateRollback(resourceExistedBeforehand: boolean) {
  mockCloudFormation('UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS',
    resourceExistedBeforehand ? { Resources: { LogicalId: { } } } : {});
}

async function standardDeleteInvocation() {
  const event: Partial<AWSLambda.CloudFormationCustomResourceDeleteEvent> = {
    RequestType: 'Delete',
    ResourceProperties: {
      ServiceToken: 'Foo',
      BucketName: 'MyBucket',
      BucketLogicalId: 'LogicalId',
    },
  };
  await invokeHandler(event);
}