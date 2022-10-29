// eslint-disable-next-line import/no-extraneous-dependencies
import { S3 } from 'aws-sdk';

const AUTO_DELETE_OBJECTS_TAG = 'aws-cdk:auto-delete-objects:cr-id';

const s3 = new S3();

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  switch (event.RequestType) {
    case 'Create':
      return;
    case 'Update':
      return onUpdate(event);
    case 'Delete':
      return onDelete(event.LogicalResourceId, event.ResourceProperties?.BucketName);
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
    return onDelete(event.LogicalResourceId, oldBucketName);
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

async function onDelete(logicalResourceId: string, bucketName?: string) {
  if (!bucketName) {
    throw new Error('No BucketName was provided.');
  }
  if (!await isBucketTaggedForDeletion(logicalResourceId, bucketName)) {
    process.stdout.write(`Bucket does not have '${AUTO_DELETE_OBJECTS_TAG}' tag or the tag value does not match the logical ID of this custom resource, skipping cleaning.\n`);
    return;
  }
  try {
    await emptyBucket(bucketName);
  } catch (e) {
    if (e.code !== 'NoSuchBucket') {
      throw e;
    }
    // Bucket doesn't exist. Ignoring
  }
}

/**
 * The bucket will only be tagged for deletion if it's being deleted in the same
 * deployment as this Custom Resource.
 *
 * If the Custom Resource is every deleted before the bucket, it must be because
 * `autoDeleteObjects` has been switched to false, in which case the tag would have
 * been removed before we get to this Delete event.
 *
 * The bucket tag value is set to the logical ID of the custom resource. This
 * covers the case where we may want to drop and re-create the custom resource without
 * emptying the bucket, e.g. to update the service token property. The bucket can
 * then safely designate a new custom resource to empty the bucket by updating the tag value.
 */
async function isBucketTaggedForDeletion(logicalResourceId: string, bucketName: string) {
  const response = await s3.getBucketTagging({ Bucket: bucketName }).promise();
  return response.TagSet.some(tag => tag.Key === AUTO_DELETE_OBJECTS_TAG && tag.Value === logicalResourceId);
}