// eslint-disable-next-line import/no-extraneous-dependencies
import { S3 } from 'aws-sdk';

const s3 = new S3();

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  switch (event.RequestType) {
    case 'Create':
    case 'Update':
      return;
    case 'Delete':
      return onDelete(event);
  }
}

/**
 * Recursively delete all items in the bucket
 *
 * @param bucketName the bucket name
 */
async function emptyBucket(bucketName: string) {
  const listedObjects = await s3.listObjectVersions({ Bucket: bucketName }).promise();
  const contents = [...listedObjects.Versions ?? [], ...listedObjects.DeleteMarkers ?? []];
  if (contents.length === 0) {
    return;
  };

  const records = contents.map((record: any) => ({ Key: record.Key, VersionId: record.VersionId }));
  await s3.deleteObjects({ Bucket: bucketName, Delete: { Objects: records } }).promise();

  if (listedObjects?.IsTruncated) {
    await emptyBucket(bucketName);
  }
}

async function onDelete(deleteEvent: AWSLambda.CloudFormationCustomResourceDeleteEvent) {
  const bucketName = deleteEvent.ResourceProperties?.BucketName;
  if (!bucketName) {
    throw new Error('No BucketName was provided.');
  }
  await emptyBucket(bucketName);
}
