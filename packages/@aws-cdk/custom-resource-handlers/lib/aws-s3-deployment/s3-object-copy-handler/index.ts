import { S3 } from '@aws-sdk/client-s3';
import { makeHandler } from '../../nodejs-entrypoint';

const s3 = new S3({});

interface ResourceProperties {
  readonly SourceBucketName: string;
  readonly SourceObjectKey: string;
  readonly DestinationBucketName: string;
  readonly DestinationObjectKey: string;
}

export const handler = makeHandler(s3ObjectCopyHandler);

export async function s3ObjectCopyHandler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const props = event.ResourceProperties as unknown as ResourceProperties;
  // CloudFormation has no schema for a custom resource, so the ID returned here is the only
  // thing that decides replacement versus in-place update. Deriving it from the destination
  // keeps a code-only change an update, which is what leaves the previous object version in
  // place for the rollback window; anything that changed per deployment would instead replace
  // the resource and delete that version in the cleanup phase.
  const physicalResourceId = `${props.DestinationBucketName}/${props.DestinationObjectKey}`;

  switch (event.RequestType) {
    case 'Create':
    case 'Update':
      // Update copies the new source object and deliberately leaves prior versions of the
      // destination object in place. A WebFunction revision reads its pinned version on every
      // sandbox start, and the revision being replaced keeps serving until the deployment
      // completes, or again if it rolls back, so historical versions stay readable until the
      // resource itself is deleted.
      return {
        PhysicalResourceId: physicalResourceId,
        Data: await copyObject(props),
      };

    case 'Delete':
      // By the time CloudFormation deletes this resource, everything that read the object
      // through its outputs is already gone, so every version of the key is removed. The key
      // comes from the physical ID CloudFormation hands back rather than from the current
      // properties: on a replacement the two differ, and it is the old object that has to go.
      await deleteAllVersions(event.PhysicalResourceId);
      return { PhysicalResourceId: event.PhysicalResourceId };
  }
}

function encodeSourceKey(key: string): string {
  return key.split('/').map(encodeURIComponent).join('/');
}

interface CopyResult {
  readonly Bucket: string;
  readonly Key: string;
  readonly VersionId: string;
}

async function copyObject(props: ResourceProperties): Promise<CopyResult> {
  const response = await s3.copyObject({
    Bucket: props.DestinationBucketName,
    Key: props.DestinationObjectKey,
    // `CopySource` has to be URL-encoded, but the separators between path segments must stay
    // literal slashes. Encoding the key as a whole turns them into `%2F`, and S3 then looks
    // for an object whose name really does contain `%2F` and fails with NoSuchKey.
    CopySource: `${props.SourceBucketName}/${encodeSourceKey(props.SourceObjectKey)}`,
  });

  if (!response.VersionId) {
    // S3 only returns a VersionId when the destination bucket has versioning enabled. Fail
    // loudly rather than reporting success with an empty version, which would leave whatever
    // consumes this resource pointing at a mutable object.
    throw new Error(
      `Copied s3://${props.DestinationBucketName}/${props.DestinationObjectKey} but S3 returned no VersionId. ` +
      'Enable versioning on the destination bucket.',
    );
  }

  // Return the full address of the written object, not just the version, so consumers can
  // read the location entirely through this resource's outputs.
  return {
    Bucket: props.DestinationBucketName,
    Key: props.DestinationObjectKey,
    VersionId: response.VersionId,
  };
}

/**
 * Delete every version (and delete marker) of the object named by a `bucket/key` physical ID.
 *
 * A bucket that no longer exists counts as cleaned up: the bucket's own removal already took
 * the object with it. So does a physical ID that names no object: CloudFormation generates one
 * of its own when a Create is cancelled before this handler responds, and then rolls that
 * Create back with a Delete carrying that ID.
 */
async function deleteAllVersions(physicalResourceId: string): Promise<void> {
  const slash = physicalResourceId.indexOf('/');
  if (slash <= 0 || slash === physicalResourceId.length - 1) {
    console.log(`Physical resource ID '${physicalResourceId}' names no object; nothing to delete`);
    return;
  }
  const bucket = physicalResourceId.slice(0, slash);
  const key = physicalResourceId.slice(slash + 1);

  try {
    let keyMarker: string | undefined;
    let versionIdMarker: string | undefined;
    do {
      const page = await s3.listObjectVersions({
        Bucket: bucket,
        Prefix: key,
        KeyMarker: keyMarker,
        VersionIdMarker: versionIdMarker,
      });

      // Prefix matching also returns keys that merely start with ours; keep exact matches only.
      const targets = [...(page.Versions ?? []), ...(page.DeleteMarkers ?? [])]
        .filter((v) => v.Key === key && v.VersionId)
        .map((v) => ({ Key: key, VersionId: v.VersionId }));

      for (let i = 0; i < targets.length; i += 1000) {
        const result = await s3.deleteObjects({
          Bucket: bucket,
          Delete: { Objects: targets.slice(i, i + 1000), Quiet: true },
        });

        // DeleteObjects reports per-version failures in Errors rather than throwing, so
        // without reading it a partial delete is indistinguishable from a complete one.
        for (const e of result.Errors ?? []) {
          console.log(`Could not delete '${bucket}/${e.Key}' version ${e.VersionId}: ${e.Code} ${e.Message}`);
        }
      }

      keyMarker = page.IsTruncated ? page.NextKeyMarker : undefined;
      versionIdMarker = page.IsTruncated ? page.NextVersionIdMarker : undefined;
    } while (keyMarker !== undefined || versionIdMarker !== undefined);
  } catch (error: any) {
    if (error.name === 'NoSuchBucket') {
      console.log(`Bucket '${bucket}' does not exist; nothing to delete.`);
      return;
    }
    if (error.name === 'AccessDenied') {
      // This Delete runs in the cleanup phase, by which time the handler's policy has been
      // regenerated for the current destination — so a key or bucket this resource no longer
      // writes to is out of reach. Failing would only buy retries and bury the result; the
      // object cannot be removed either way.
      console.log(`Access denied deleting '${bucket}/${key}'; it is left in place.`);
      return;
    }
    throw error;
  }
}
