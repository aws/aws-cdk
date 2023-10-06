/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { S3, S3ServiceException } from '@aws-sdk/client-s3';
import { makeHandler } from '../../nodejs-entrypoint';

const AUTO_DELETE_OBJECTS_TAG = 'aws-cdk:auto-delete-objects';

const s3 = new S3({});

export const handler = makeHandler(autoDeleteHandler);

export async function autoDeleteHandler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  switch (event.RequestType) {
    case 'Create':
      return;
    case 'Update':
      return onUpdate(event);
    case 'Delete':
      return onDelete(event.ResourceProperties?.BucketName);
  }
};

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
  const listedObjects = await s3.listObjectVersions({ Bucket: bucketName });
  const contents = [...listedObjects.Versions ?? [], ...listedObjects.DeleteMarkers ?? []];
  if (contents.length === 0) {
    return;
  }

  const records = contents.map((record: any) => ({ Key: record.Key, VersionId: record.VersionId }));
  await s3.deleteObjects({ Bucket: bucketName, Delete: { Objects: records } });

  if (listedObjects?.IsTruncated) {
    await emptyBucket(bucketName);
  }
}

async function onDelete(bucketName?: string) {
  if (!bucketName) {
    throw new Error('No BucketName was provided.');
  }
  try {
    if (!await isBucketTaggedForDeletion(bucketName)) {
      console.log(`Bucket does not have '${AUTO_DELETE_OBJECTS_TAG}' tag, skipping cleaning.`);
      return;
    }
    await emptyBucket(bucketName);
  } catch (error: any) {
    // Bucket doesn't exist, all is well
    if (error instanceof S3ServiceException && error.name === 'NoSuchBucket') {
      console.log(`Bucket '${bucketName}' does not exist.`);
      return;
    }
    throw error;
  }
}

/**
 * The bucket will only be tagged for deletion if it is being deleted in the same
 * deployment as this Custom Resource.
 *
 * If the Custom Resource is ever deleted before the bucket, it must be because
 * `autoDeleteObjects` has been switched to false, in which case the tag would have
 * been removed before we get to this Delete event.
 */
async function isBucketTaggedForDeletion(bucketName: string) {
  const response = await s3.getBucketTagging({ Bucket: bucketName });
  return response.TagSet?.some(tag => tag.Key === AUTO_DELETE_OBJECTS_TAG && tag.Value === 'true');
}
