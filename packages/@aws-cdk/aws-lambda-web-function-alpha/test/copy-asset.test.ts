import { CopyObjectCommand } from '@aws-sdk/client-s3';
import type { CopyAssetEvent } from '../lib/copy-asset';
import { BucketNotVersionedError, handler } from '../lib/copy-asset';

const mockSend = jest.fn();

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn(() => ({ send: mockSend })),
  CopyObjectCommand: jest.fn((input) => ({ input })),
}));

const event = (requestType: CopyAssetEvent['RequestType']): CopyAssetEvent => ({
  RequestType: requestType,
  ResourceProperties: {
    SourceBucket: 'cdk-bootstrap-assets',
    SourceKey: 'abc.zip',
    DestinationBucket: 'owned-code-bucket',
    DestinationKey: 'abc.zip',
  },
});

beforeEach(() => {
  mockSend.mockReset();
  (CopyObjectCommand as unknown as jest.Mock).mockClear();
});

test('copies the asset and returns the version ID of the copy', async () => {
  mockSend.mockResolvedValue({ VersionId: 'v1' });

  const response = await handler(event('Create'));

  expect(CopyObjectCommand).toHaveBeenCalledWith({
    Bucket: 'owned-code-bucket',
    Key: 'abc.zip',
    CopySource: 'cdk-bootstrap-assets/abc.zip',
  });
  expect(response).toEqual({
    PhysicalResourceId: 'owned-code-bucket/abc.zip',
    Data: { VersionId: 'v1' },
  });
});

test('fails when the destination returns no version ID', async () => {
  mockSend.mockResolvedValue({});

  await expect(handler(event('Update'))).rejects.toThrow(BucketNotVersionedError);
  await expect(handler(event('Update'))).rejects.toThrow(/Versioning is not enabled on bucket owned-code-bucket/);
});

test('does not copy on delete', async () => {
  const response = await handler(event('Delete'));

  expect(mockSend).not.toHaveBeenCalled();
  expect(response).toEqual({ PhysicalResourceId: 'owned-code-bucket/abc.zip' });
});
