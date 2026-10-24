import { CopyObjectCommand, S3Client } from '@aws-sdk/client-s3';

/**
 * Properties of the copy custom resource
 */
export interface CopyAssetProperties {
  readonly SourceBucket: string;
  readonly SourceKey: string;
  readonly DestinationBucket: string;
  readonly DestinationKey: string;
}

/**
 * The custom resource event sent by CloudFormation
 */
export interface CopyAssetEvent {
  readonly RequestType: 'Create' | 'Update' | 'Delete';
  readonly ResourceProperties: CopyAssetProperties;
}

/**
 * The response returned to CloudFormation
 */
export interface CopyAssetResponse {
  readonly PhysicalResourceId: string;
  readonly Data?: { readonly VersionId: string };
}

/**
 * Raised when the destination bucket does not return a version ID, which means versioning is off
 */
export class BucketNotVersionedError extends Error {
  constructor(bucket: string) {
    super(`Versioning is not enabled on bucket ${bucket}`);
    this.name = 'BucketNotVersionedError';
  }
}

/**
 * Copies a code asset into a versioned bucket that the Web Functions service can read.
 *
 * Returns the version ID of the copy, which the web function revision needs.
 */
export async function handler(event: CopyAssetEvent): Promise<CopyAssetResponse> {
  const props = event.ResourceProperties;
  const physicalId = `${props.DestinationBucket}/${props.DestinationKey}`;

  if (event.RequestType === 'Delete') {
    // The destination bucket is emptied when it is removed
    return { PhysicalResourceId: physicalId };
  }

  const s3 = new S3Client({});
  const result = await s3.send(new CopyObjectCommand({
    Bucket: props.DestinationBucket,
    Key: props.DestinationKey,
    CopySource: encodeURI(`${props.SourceBucket}/${props.SourceKey}`),
  }));
  if (!result.VersionId) {
    throw new BucketNotVersionedError(props.DestinationBucket);
  }

  return { PhysicalResourceId: physicalId, Data: { VersionId: result.VersionId } };
}
