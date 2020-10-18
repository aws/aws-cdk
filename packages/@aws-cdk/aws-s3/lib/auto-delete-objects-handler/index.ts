export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent, s3?: any) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-extraneous-dependencies
  if (!s3) { s3 = new (require('aws-sdk').S3)(); }
  if (event.RequestType === 'Create') { return onCreate(s3, event); }
  if (event.RequestType === 'Update') { return onUpdate(s3, event); }
  if (event.RequestType === 'Delete') { return onDelete(s3, event); }
  throw new Error('Invalid request type.');
}

/**
 * Recursively delete all items in the bucket
 *
 * @param {AWS.S3} s3 the S3 client
 * @param {*} bucketName the bucket name
 */
async function emptyBucket(s3: any, bucketName: string) {
  const listedObjects = await s3.listObjectVersions({ Bucket: bucketName }).promise();
  const contents = (listedObjects.Versions || []).concat(listedObjects.DeleteMarkers || []);
  if (contents.length === 0) {
    return;
  };

  let records = contents.map((record: any) => ({ Key: record.Key, VersionId: record.VersionId }));
  await s3.deleteObjects({ Bucket: bucketName, Delete: { Objects: records } }).promise();

  if (listedObjects?.IsTruncated === 'true' ) await emptyBucket(s3, bucketName);
}

async function onCreate(_s3: any, _event: AWSLambda.CloudFormationCustomResourceCreateEvent) {
  return;
}

async function onUpdate(_s3: any, _event: AWSLambda.CloudFormationCustomResourceUpdateEvent) {
  return;
}

async function onDelete(s3: any, deleteEvent: AWSLambda.CloudFormationCustomResourceDeleteEvent) {
  const bucketName = deleteEvent.ResourceProperties?.BucketName;
  if (!bucketName) {
    throw new Error('No BucketName was provided.');
  }
  await emptyBucket(s3, bucketName);
}
