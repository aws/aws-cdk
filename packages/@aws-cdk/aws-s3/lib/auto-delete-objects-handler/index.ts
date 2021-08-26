// eslint-disable-next-line import/no-extraneous-dependencies
import { S3 } from 'aws-sdk';

const s3 = new S3();

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  switch (event.RequestType) {
    case 'Create':
      return;
    case 'Update':
      return onUpdate(event);
    case 'Delete':
      return onDelete(event.ResourceProperties?.BucketName);
  }
}

async function onUpdate(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const updateEvent = event as AWSLambda.CloudFormationCustomResourceUpdateEvent;
  const oldBucketName = updateEvent.OldResourceProperties?.BucketName;
  const newBucketName = updateEvent.ResourceProperties?.BucketName;
  const bucketNameHasChanged = newBucketName != null && oldBucketName != null && newBucketName !== oldBucketName;

  /* If the name of the bucket has changed, CloudFormation will try to delete the bucket
     and create a new one with the new name. So we have to delete the contents of the
     bucket so that this operation does not fail. */
  if (bucketNameHasChanged) {
    return onDelete(oldBucketName);
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
  }

  const records = contents.map((record: any) => ({ Key: record.Key, VersionId: record.VersionId }));
  await s3.deleteObjects({ Bucket: bucketName, Delete: { Objects: records } }).promise();

  if (listedObjects?.IsTruncated) {
    await emptyBucket(bucketName);
  }
}

async function onDelete(bucketName?: string) {
  if (!bucketName) {
    throw new Error('No BucketName was provided.');
  }
  await emptyBucket(bucketName);
}
