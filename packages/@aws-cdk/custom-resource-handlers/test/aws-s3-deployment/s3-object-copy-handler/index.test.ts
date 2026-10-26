import { CopyObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { destinationKey, s3ObjectCopyHandler } from '../../../lib/aws-s3-deployment/s3-object-copy-handler/index';

const s3Mock = mockClient(S3Client);

afterEach(() => {
  s3Mock.reset();
});

const properties = {
  ServiceToken: 'token',
  SourceBucketName: 'source-bucket',
  SourceObjectKey: 'assets/handler code.zip',
  DestinationBucketName: 'destination-bucket',
  DestinationKeyPrefix: 'web-function/Fn/',
  ContentHash: 'abc123',
  Configuration: { Runtime: 'nodejs24.x', ServiceConfig: { TimeoutSeconds: '30', ExecutionRoleArn: 'arn:role' } },
};
const KEY = destinationKey(properties as any);

const baseEvent = {
  ServiceToken: 'token',
  ResponseURL: 'url',
  StackId: 'stack-id',
  RequestId: 'request-id',
  LogicalResourceId: 'logical-id',
  ResourceType: 'Custom::S3ObjectCopy',
  ResourceProperties: properties,
};

function physicalId(key: string, version: string, bucket = 'destination-bucket') {
  return `${bucket}/${key}?versionId=${version}`;
}

describe('destination key', () => {
  test('is the prefix followed by a hash and .zip', () => {
    expect(KEY).toMatch(/^web-function\/Fn\/[0-9a-f]{32}\.zip$/);
  });

  test('changes with the content', () => {
    expect(destinationKey({ ...properties, ContentHash: 'def456' } as any)).not.toEqual(KEY);
  });

  test('changes with the configuration', () => {
    expect(destinationKey({ ...properties, Configuration: { Runtime: 'nodejs22.x' } } as any)).not.toEqual(KEY);
  });

  test('does not depend on the order of the configuration\'s keys', () => {
    const reordered = { ServiceConfig: { ExecutionRoleArn: 'arn:role', TimeoutSeconds: '30' }, Runtime: 'nodejs24.x' };
    expect(destinationKey({ ...properties, Configuration: reordered } as any)).toEqual(KEY);
  });

  test('does not depend on where the source object is stored', () => {
    expect(destinationKey({ ...properties, SourceBucketName: 'other', SourceObjectKey: 'x.zip' } as any)).toEqual(KEY);
  });
});

test('create copies the object and names the version written in the physical ID', async () => {
  s3Mock.on(CopyObjectCommand).resolves({ VersionId: 'v1' });

  const response = await s3ObjectCopyHandler({ ...baseEvent, RequestType: 'Create' } as any);

  expect(s3Mock.commandCalls(CopyObjectCommand)[0].args[0].input).toEqual({
    Bucket: 'destination-bucket',
    Key: KEY,
    // Reserved characters in the source key are encoded so the key survives the CopySource
    // header format, but the path separators stay literal: S3 does not decode `%2F` back to
    // `/` and would look for an object whose name contains `%2F`.
    CopySource: 'source-bucket/assets/handler%20code.zip',
  });
  expect(response).toEqual({
    PhysicalResourceId: physicalId(KEY, 'v1'),
    Data: { Bucket: 'destination-bucket', Key: KEY, VersionId: 'v1' },
  });
});

test('update with an unchanged key copies nothing and keeps the physical ID', async () => {
  const response = await s3ObjectCopyHandler({
    ...baseEvent,
    RequestType: 'Update',
    PhysicalResourceId: physicalId(KEY, 'v1'),
    // Only the source location changed, as with a new bootstrap qualifier.
    ResourceProperties: { ...properties, SourceBucketName: 'new-source-bucket' },
    OldResourceProperties: properties,
  } as any);

  expect(s3Mock.commandCalls(CopyObjectCommand)).toHaveLength(0);
  expect(response).toEqual({
    PhysicalResourceId: physicalId(KEY, 'v1'),
    Data: { Bucket: 'destination-bucket', Key: KEY, VersionId: 'v1' },
  });
});

test('update with a changed configuration copies to a new key and returns a new physical ID', async () => {
  s3Mock.on(CopyObjectCommand).resolves({ VersionId: 'v2' });
  const changed = { ...properties, Configuration: { Runtime: 'nodejs22.x' } };
  const newKey = destinationKey(changed as any);

  const response = await s3ObjectCopyHandler({
    ...baseEvent,
    RequestType: 'Update',
    PhysicalResourceId: physicalId(KEY, 'v1'),
    ResourceProperties: changed,
    OldResourceProperties: properties,
  } as any);

  expect(s3Mock.commandCalls(CopyObjectCommand)[0].args[0].input.Key).toEqual(newKey);
  expect(s3Mock.commandCalls(DeleteObjectCommand)).toHaveLength(0);
  expect(response.PhysicalResourceId).toEqual(physicalId(newKey, 'v2'));
});

test('update with a changed bucket copies even when the key is the same', async () => {
  s3Mock.on(CopyObjectCommand).resolves({ VersionId: 'v2' });

  const response = await s3ObjectCopyHandler({
    ...baseEvent,
    RequestType: 'Update',
    PhysicalResourceId: physicalId(KEY, 'v1', 'old-bucket'),
    OldResourceProperties: { ...properties, DestinationBucketName: 'old-bucket' },
  } as any);

  expect(s3Mock.commandCalls(CopyObjectCommand)).toHaveLength(1);
  expect(response.PhysicalResourceId).toEqual(physicalId(KEY, 'v2'));
});

test('update of a physical ID without a version copies', async () => {
  s3Mock.on(CopyObjectCommand).resolves({ VersionId: 'v2' });

  const response = await s3ObjectCopyHandler({
    ...baseEvent,
    RequestType: 'Update',
    PhysicalResourceId: `destination-bucket/${KEY}`,
    OldResourceProperties: properties,
  } as any);

  expect(s3Mock.commandCalls(CopyObjectCommand)).toHaveLength(1);
  expect(response.PhysicalResourceId).toEqual(physicalId(KEY, 'v2'));
});

test('delete removes exactly the version in the physical ID', async () => {
  s3Mock.on(DeleteObjectCommand).resolves({});

  const response = await s3ObjectCopyHandler({
    ...baseEvent,
    RequestType: 'Delete',
    // The properties may describe the replacement; the physical ID decides what goes.
    PhysicalResourceId: physicalId('web-function/Fn/old.zip', 'v1'),
  } as any);

  expect(s3Mock.commandCalls(DeleteObjectCommand)).toHaveLength(1);
  expect(s3Mock.commandCalls(DeleteObjectCommand)[0].args[0].input).toEqual({
    Bucket: 'destination-bucket',
    Key: 'web-function/Fn/old.zip',
    VersionId: 'v1',
  });
  expect(response).toEqual({ PhysicalResourceId: physicalId('web-function/Fn/old.zip', 'v1') });
});

test.each(['request-id', `destination-bucket/${KEY}`, 'destination-bucket/key?versionId='])(
  'delete of a physical ID that names no version deletes nothing: %s', async (id) => {
    const response = await s3ObjectCopyHandler({ ...baseEvent, RequestType: 'Delete', PhysicalResourceId: id } as any);

    expect(s3Mock.commandCalls(DeleteObjectCommand)).toHaveLength(0);
    expect(response).toEqual({ PhysicalResourceId: id });
  });

test.each(['NoSuchBucket', 'AccessDenied'])('delete succeeds without removing anything on %s', async (name) => {
  const error = new Error(name);
  error.name = name;
  s3Mock.on(DeleteObjectCommand).rejects(error);

  await expect(s3ObjectCopyHandler({
    ...baseEvent,
    RequestType: 'Delete',
    PhysicalResourceId: physicalId(KEY, 'v1'),
  } as any)).resolves.toEqual({ PhysicalResourceId: physicalId(KEY, 'v1') });
});

test('delete fails on any other error', async () => {
  const error = new Error('throttled');
  error.name = 'SlowDown';
  s3Mock.on(DeleteObjectCommand).rejects(error);

  await expect(s3ObjectCopyHandler({
    ...baseEvent,
    RequestType: 'Delete',
    PhysicalResourceId: physicalId(KEY, 'v1'),
  } as any)).rejects.toThrow('throttled');
});

test('fails when S3 returns no version', async () => {
  s3Mock.on(CopyObjectCommand).resolves({});

  await expect(s3ObjectCopyHandler({ ...baseEvent, RequestType: 'Create' } as any))
    .rejects.toThrow(/returned no VersionId/);
});
