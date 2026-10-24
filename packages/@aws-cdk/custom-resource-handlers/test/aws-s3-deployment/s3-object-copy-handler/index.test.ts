import { CopyObjectCommand, DeleteObjectCommand, DeleteObjectsCommand, ListObjectVersionsCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { s3ObjectCopyHandler } from '../../../lib/aws-s3-deployment/s3-object-copy-handler/index';

const s3Mock = mockClient(S3Client);

afterEach(() => {
  s3Mock.reset();
});

const baseEvent = {
  ServiceToken: 'token',
  ResponseURL: 'url',
  StackId: 'stack-id',
  RequestId: 'request-id',
  LogicalResourceId: 'logical-id',
  ResourceType: 'Custom::S3ObjectCopy',
  ResourceProperties: {
    ServiceToken: 'token',
    SourceBucketName: 'source-bucket',
    SourceObjectKey: 'assets/handler code.zip',
    DestinationBucketName: 'destination-bucket',
    DestinationObjectKey: 'function.zip',
  },
};

test('create copies the object and returns the full address it wrote', async () => {
  s3Mock.on(CopyObjectCommand).resolves({ VersionId: 'v1' });

  const response = await s3ObjectCopyHandler({
    ...baseEvent,
    RequestType: 'Create',
  } as any);

  expect(s3Mock.commandCalls(CopyObjectCommand)).toHaveLength(1);
  expect(s3Mock.commandCalls(CopyObjectCommand)[0].args[0].input).toEqual({
    Bucket: 'destination-bucket',
    Key: 'function.zip',
    // Reserved characters in the source key are encoded so the key survives the CopySource
    // header format, but the path separators stay literal: S3 does not decode `%2F` back to
    // `/` and would look for an object whose name contains `%2F`.
    CopySource: 'source-bucket/assets/handler%20code.zip',
  });
  expect(response).toEqual({
    PhysicalResourceId: 'destination-bucket/function.zip',
    Data: {
      Bucket: 'destination-bucket',
      Key: 'function.zip',
      VersionId: 'v1',
    },
  });
});

test('update copies the new object and never deletes prior versions', async () => {
  s3Mock.on(CopyObjectCommand).resolves({ VersionId: 'v2' });

  const response = await s3ObjectCopyHandler({
    ...baseEvent,
    RequestType: 'Update',
    PhysicalResourceId: 'destination-bucket/function.zip',
    OldResourceProperties: baseEvent.ResourceProperties,
  } as any);

  expect(s3Mock.commandCalls(CopyObjectCommand)).toHaveLength(1);
  expect(s3Mock.commandCalls(DeleteObjectCommand)).toHaveLength(0);
  expect(response).toEqual({
    // The physical ID is stable across updates: a changed ID would make CloudFormation
    // treat the update as a replacement and send a Delete for the old ID.
    PhysicalResourceId: 'destination-bucket/function.zip',
    Data: {
      Bucket: 'destination-bucket',
      Key: 'function.zip',
      VersionId: 'v2',
    },
  });
});

test('delete removes every version and delete marker of the key', async () => {
  s3Mock.on(ListObjectVersionsCommand).resolves({
    Versions: [
      { Key: 'function.zip', VersionId: 'v1' },
      { Key: 'function.zip', VersionId: 'v2' },
      // Prefix matching also returns longer keys; they must be left alone.
      { Key: 'function.zip.bak', VersionId: 'other' },
    ],
    DeleteMarkers: [{ Key: 'function.zip', VersionId: 'dm1' }],
    IsTruncated: false,
  });
  s3Mock.on(DeleteObjectsCommand).resolves({});

  const response = await s3ObjectCopyHandler({
    ...baseEvent,
    RequestType: 'Delete',
    PhysicalResourceId: 'destination-bucket/function.zip',
  } as any);

  expect(s3Mock.commandCalls(ListObjectVersionsCommand)[0].args[0].input).toMatchObject({
    Bucket: 'destination-bucket',
    Prefix: 'function.zip',
  });
  expect(s3Mock.commandCalls(DeleteObjectsCommand)).toHaveLength(1);
  expect(s3Mock.commandCalls(DeleteObjectsCommand)[0].args[0].input).toEqual({
    Bucket: 'destination-bucket',
    Delete: {
      Objects: [
        { Key: 'function.zip', VersionId: 'v1' },
        { Key: 'function.zip', VersionId: 'v2' },
        { Key: 'function.zip', VersionId: 'dm1' },
      ],
      Quiet: true,
    },
  });
  expect(response).toEqual({ PhysicalResourceId: 'destination-bucket/function.zip' });
});

test('delete logs the per-version failures DeleteObjects reports instead of throwing', async () => {
  // DeleteObjects returns per-version failures in Errors rather than throwing, so without
  // reading it a partial delete looks exactly like a complete one.
  s3Mock.on(ListObjectVersionsCommand).resolves({
    Versions: [{ Key: 'function.zip', VersionId: 'v1' }],
    IsTruncated: false,
  });
  s3Mock.on(DeleteObjectsCommand).resolves({
    Errors: [{ Key: 'function.zip', VersionId: 'v1', Code: 'AccessDenied', Message: 'Access Denied' }],
  });
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});

  const response = await s3ObjectCopyHandler({
    ...baseEvent,
    RequestType: 'Delete',
    PhysicalResourceId: 'destination-bucket/function.zip',
  } as any);

  expect(log).toHaveBeenCalledWith(
    expect.stringContaining("Could not delete 'destination-bucket/function.zip' version v1: AccessDenied Access Denied"),
  );
  expect(response).toEqual({ PhysicalResourceId: 'destination-bucket/function.zip' });
  log.mockRestore();
});

test('delete targets the object named by the physical ID, not the current properties', async () => {
  // On a replacement CloudFormation deletes the old resource with the old physical ID while
  // the properties describe the new object; the old key is the one to remove.
  s3Mock.on(ListObjectVersionsCommand).resolves({
    Versions: [{ Key: 'old/function.zip', VersionId: 'v1' }],
    IsTruncated: false,
  });
  s3Mock.on(DeleteObjectsCommand).resolves({});

  await s3ObjectCopyHandler({
    ...baseEvent,
    RequestType: 'Delete',
    PhysicalResourceId: 'old-bucket/old/function.zip',
  } as any);

  expect(s3Mock.commandCalls(ListObjectVersionsCommand)[0].args[0].input).toMatchObject({
    Bucket: 'old-bucket',
    Prefix: 'old/function.zip',
  });
  expect(s3Mock.commandCalls(DeleteObjectsCommand)[0].args[0].input).toMatchObject({
    Bucket: 'old-bucket',
    Delete: { Objects: [{ Key: 'old/function.zip', VersionId: 'v1' }] },
  });
});

test('delete follows version pagination', async () => {
  s3Mock.on(ListObjectVersionsCommand)
    .resolvesOnce({
      Versions: [{ Key: 'function.zip', VersionId: 'v1' }],
      IsTruncated: true,
      NextKeyMarker: 'function.zip',
      NextVersionIdMarker: 'v1',
    })
    .resolvesOnce({
      Versions: [{ Key: 'function.zip', VersionId: 'v2' }],
      IsTruncated: false,
    });
  s3Mock.on(DeleteObjectsCommand).resolves({});

  await s3ObjectCopyHandler({
    ...baseEvent,
    RequestType: 'Delete',
    PhysicalResourceId: 'destination-bucket/function.zip',
  } as any);

  const lists = s3Mock.commandCalls(ListObjectVersionsCommand);
  expect(lists).toHaveLength(2);
  expect(lists[1].args[0].input).toMatchObject({ KeyMarker: 'function.zip', VersionIdMarker: 'v1' });
  expect(s3Mock.commandCalls(DeleteObjectsCommand)).toHaveLength(2);
});

test('delete succeeds when the bucket is already gone', async () => {
  const error = new Error('gone');
  error.name = 'NoSuchBucket';
  s3Mock.on(ListObjectVersionsCommand).rejects(error);

  const response = await s3ObjectCopyHandler({
    ...baseEvent,
    RequestType: 'Delete',
    PhysicalResourceId: 'destination-bucket/function.zip',
  } as any);

  expect(s3Mock.commandCalls(DeleteObjectsCommand)).toHaveLength(0);
  expect(response).toEqual({ PhysicalResourceId: 'destination-bucket/function.zip' });
});

test('delete leaves the object in place when access is denied', async () => {
  // Changing keyPrefix or the destination bucket replaces this resource, so the cleanup phase
  // deletes the old object — but the handler's policy has already narrowed to the new
  // destination. Failing would only buy retries; the object is unreachable either way.
  const error = new Error('denied');
  error.name = 'AccessDenied';
  s3Mock.on(ListObjectVersionsCommand).rejects(error);

  const response = await s3ObjectCopyHandler({
    ...baseEvent,
    RequestType: 'Delete',
    PhysicalResourceId: 'destination-bucket/old-prefix/function.zip',
  } as any);

  expect(s3Mock.commandCalls(DeleteObjectsCommand)).toHaveLength(0);
  expect(response).toEqual({ PhysicalResourceId: 'destination-bucket/old-prefix/function.zip' });
});

test('delete propagates other S3 errors', async () => {
  const error = new Error('broken');
  error.name = 'InternalError';
  s3Mock.on(ListObjectVersionsCommand).rejects(error);

  await expect(s3ObjectCopyHandler({
    ...baseEvent,
    RequestType: 'Delete',
    PhysicalResourceId: 'destination-bucket/function.zip',
  } as any)).rejects.toThrow('broken');
});

test('delete does nothing when the physical ID names no object', async () => {
  // CloudFormation generates a physical ID of its own when a Create is cancelled before this
  // handler responds, then rolls that Create back with a Delete carrying it. Throwing on it
  // would fail the rollback and bury the error that caused it.
  const response = await s3ObjectCopyHandler({
    ...baseEvent,
    RequestType: 'Delete',
    PhysicalResourceId: 'MyStack-ApiCodeCopy37C067CF-abc123',
  } as any);

  expect(s3Mock.commandCalls(ListObjectVersionsCommand)).toHaveLength(0);
  expect(s3Mock.commandCalls(DeleteObjectsCommand)).toHaveLength(0);
  expect(response).toEqual({ PhysicalResourceId: 'MyStack-ApiCodeCopy37C067CF-abc123' });
});

test('throws when S3 reports no VersionId', async () => {
  // S3 only returns a VersionId when the destination bucket has versioning enabled.
  // Succeeding silently would leave the consumer pointing at a mutable object.
  s3Mock.on(CopyObjectCommand).resolves({});

  await expect(s3ObjectCopyHandler({
    ...baseEvent,
    RequestType: 'Create',
  } as any)).rejects.toThrow(
    'Copied s3://destination-bucket/function.zip but S3 returned no VersionId. ' +
    'Enable versioning on the destination bucket.',
  );
});
