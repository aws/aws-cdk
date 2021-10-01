// eslint-disable-next-line import/no-extraneous-dependencies
import { S3, CloudFormation } from 'aws-sdk';
import * as yaml from 'yaml';

/**
 * The custom resource should clear the bucket in one of the following cases:
 *
 * - The stack is deleted
 * - The target bucket is removed from the template
 * - The target bucket is replaced
 * - The target bucket is created in a deployment that gets rolled back
 *
 * In particular, it should NOT clear the bucket in a case the custom resource is deleted
 * but the target bucket is unaffected. This could happen in the following cases:
 *
 * - The autoDelete feature used to be turned on, and now gets turned off (leads to removal
 *   of the CR from the template, without affecting the bucket)
 * - The autoDelete feature used to be turned off, now gets turned on, but the deployment
 *   gets rolled back (leads to creation and immediate deletion of the CR, without
 *   affecting the bucket).
 *
 * The only cases where we might misclassify is when the CR gets deleted. To
 * determine whether or not we should empty the bucket, during a `Delete` event
 * we will look at the stack state and depending on the state of the stack
 * (rolling forward or rolling backward), compare the OLD and NEW templates to
 * determine whether the bucket should be present in the final state:
 *
 * - ROLL FORWARD: delete contents if the bucket is not in the NEW template
 * - ROLLBACK: delete contents if the bucket is not in the OLD template
 */

const s3 = new S3();
const cfn = new CloudFormation();

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  switch (event.RequestType) {
    case 'Create':
      return;
    case 'Update':
      return onUpdate(event);
    case 'Delete':
      return onDelete(event.StackId, event.ResourceProperties?.BucketLogicalId, event.ResourceProperties?.BucketName);
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
    return emptyBucket(oldBucketName);
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

async function onDelete(stackId: string, logicalId?: string, bucketName?: string) {
  if (!bucketName) {
    throw new Error('No BucketName was provided.');
  }
  if (!logicalId) {
    throw new Error('No Logical ID was provided.');
  }
  if (await isBucketAboutToBeDeleted(stackId, logicalId)) {
    await emptyBucket(bucketName);
  }
}

/**
 * Go and inspect CloudFormation to see if the target bucket is about to be deleted
 */
async function isBucketAboutToBeDeleted(stackId: string, logicalId: string) {
  const stackResponse = await cfn.describeStacks({ StackName: stackId }).promise();
  if (!stackResponse.Stacks?.[0]) {
    throw new Error(`Could not find stack with ID: ${stackId}`);
  }
  const stackStatus = stackResponse.Stacks[0].StackStatus;
  process.stdout.write(`Stack status: ${stackStatus}\n`);

  // Case 1: the stack failed creation.
  // Case 2: the stack is being deleted.
  // In both cases, by definition the bucket will go bye-bye.
  if (stackStatus === 'ROLLBACK_IN_PROGRESS' || stackStatus === 'DELETE_IN_PROGRESS') {
    return true;
  }

  // Case 3: we're cleaning up after a successful rollforward.
  // Case 4: we're rolling back a failed update.
  // In both cases, either the bucket is also being deleted here, or it's just
  // the CR that's being deleted.
  // `GetTemplate` will show us the template we are moving to ('new' in case 3,
  // 'old' in case 4). We will check if the bucket is in the template returned
  // by `GetTemplate` to see if we need to clean it.
  const destinationTemplateResponse = await cfn.getTemplate({ StackName: stackId, TemplateStage: 'Processed' }).promise();
  let template;
  try {
    template = yaml.parse(destinationTemplateResponse.TemplateBody ?? '{}', {
      schema: 'core',
    });
  } catch (e) {
    throw new Error(`Unable to parse CloudFormation template (is it not YAML?): ${destinationTemplateResponse.TemplateBody}`);
  }

  if (logicalId in (template.Resources ?? {})) {
    process.stdout.write(`Bucket ${logicalId} is in target template, so NOT cleaning.\n`);
    return false;
  } else {
    process.stdout.write(`Bucket ${logicalId} is NOT in target template, so cleaning.\n`);
    return true;
  }
}