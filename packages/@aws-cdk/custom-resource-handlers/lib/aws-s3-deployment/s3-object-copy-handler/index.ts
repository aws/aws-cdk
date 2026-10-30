import { createHash } from 'crypto';
import { S3 } from '@aws-sdk/client-s3';
import { makeHandler } from '../../nodejs-entrypoint';

// The copy function runs in the stack's Region, and a provided bucket may be in another one.
export const s3 = new S3({ followRegionRedirects: true });

interface ResourceProperties {
  readonly SourceBucketName: string;
  readonly SourceObjectKey: string;
  readonly DestinationBucketName: string;
  /** Prefix of the destination key. The rest of the key is computed from the identity below. */
  readonly DestinationKeyPrefix: string;
  /** Identifies the content to copy, independent of where the source object is stored. */
  readonly ContentHash: string;
  /**
   * Configuration of the consumer of the copy, if any. A change gives a new key, so each
   * configuration has an object of its own.
   */
  readonly Configuration?: unknown;
}

/** The address of one version of the destination object. */
interface ObjectVersion {
  readonly Bucket: string;
  readonly Key: string;
  readonly VersionId: string;
}

export const handler = makeHandler(s3ObjectCopyHandler);

export async function s3ObjectCopyHandler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const props = event.ResourceProperties as unknown as ResourceProperties;

  switch (event.RequestType) {
    case 'Create':
      return written(await copyObject(props));

    case 'Update': {
      // The physical ID names the object version this resource wrote. If the content and the
      // configuration still give the same key, that object is still the right one: only the
      // location of the source changed, so nothing is copied. Otherwise the new object gets a
      // new physical ID, which CloudFormation treats as a replacement: it deletes the old ID in
      // the cleanup phase, or keeps it under an UpdateReplacePolicy of Retain.
      const current = parsePhysicalResourceId(event.PhysicalResourceId);
      if (current && current.Bucket === props.DestinationBucketName && current.Key === destinationKey(props)) {
        return written(current);
      }
      return written(await copyObject(props));
    }

    case 'Delete': {
      // Removes exactly the version this resource wrote. The ID comes from CloudFormation
      // rather than the current properties: on a replacement the two differ, and it is the
      // old object that has to go.
      const target = parsePhysicalResourceId(event.PhysicalResourceId);
      if (!target) {
        // CloudFormation generates an ID of its own when a Create is cancelled before this
        // handler responds, and then rolls that Create back with a Delete carrying that ID.
        console.log(`Physical resource ID '${event.PhysicalResourceId}' names no object version; nothing to delete`);
      } else {
        await deleteVersion(target);
      }
      return { PhysicalResourceId: event.PhysicalResourceId };
    }
  }
}

/**
 * The destination key: the prefix, followed by a hash of the content and the configuration.
 *
 * The configuration is serialized with sorted keys, so that the hash does not depend on the
 * order CloudFormation sends the properties in.
 */
export function destinationKey(props: ResourceProperties): string {
  const identity = canonicalJson([props.ContentHash, props.Configuration ?? null]);
  const hash = createHash('sha256').update(identity).digest('hex').slice(0, 32);
  return `${props.DestinationKeyPrefix}${hash}.zip`;
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(',')}]`;
  }
  if (value !== null && typeof value === 'object') {
    const entries = Object.keys(value as object).sort()
      .map((k) => `${JSON.stringify(k)}:${canonicalJson((value as any)[k])}`);
    return `{${entries.join(',')}}`;
  }
  return JSON.stringify(value);
}

const VERSION_SEPARATOR = '?versionId=';

/**
 * The physical ID: `<bucket>/<key>?versionId=<version>`.
 *
 * CloudFormation has no schema for a custom resource, so the ID is the only thing that decides
 * replacement versus in-place update. It names the exact version written, so that a Delete
 * removes that version and nothing else. The key never contains `?`: the prefix is validated
 * to exclude it and the rest is a hex hash.
 */
function written(object: ObjectVersion) {
  return {
    PhysicalResourceId: `${object.Bucket}/${object.Key}${VERSION_SEPARATOR}${object.VersionId}`,
    Data: object,
  };
}

function parsePhysicalResourceId(physicalResourceId: string): ObjectVersion | undefined {
  const separator = physicalResourceId.lastIndexOf(VERSION_SEPARATOR);
  const slash = physicalResourceId.indexOf('/');
  if (separator < 0 || slash <= 0 || slash + 1 >= separator) {
    return undefined;
  }
  const versionId = physicalResourceId.slice(separator + VERSION_SEPARATOR.length);
  if (!versionId) {
    return undefined;
  }
  return {
    Bucket: physicalResourceId.slice(0, slash),
    Key: physicalResourceId.slice(slash + 1, separator),
    VersionId: versionId,
  };
}

function encodeSourceKey(key: string): string {
  return key.split('/').map(encodeURIComponent).join('/');
}

async function copyObject(props: ResourceProperties): Promise<ObjectVersion> {
  const key = destinationKey(props);
  const response = await s3.copyObject({
    Bucket: props.DestinationBucketName,
    Key: key,
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
      `Copied s3://${props.DestinationBucketName}/${key} but S3 returned no VersionId. ` +
      'Enable versioning on the destination bucket.',
    );
  }

  // Return the full address of the written object, not just the version, so consumers can
  // read the location entirely through this resource's outputs.
  return { Bucket: props.DestinationBucketName, Key: key, VersionId: response.VersionId };
}

/**
 * Delete one object version.
 *
 * A bucket that no longer exists counts as cleaned up: the bucket's own removal already took
 * the object with it.
 */
async function deleteVersion(target: ObjectVersion): Promise<void> {
  try {
    await s3.deleteObject({ Bucket: target.Bucket, Key: target.Key, VersionId: target.VersionId });
  } catch (error: any) {
    if (error.name === 'NoSuchBucket') {
      console.log(`Bucket '${target.Bucket}' does not exist; nothing to delete.`);
      return;
    }
    throw error;
  }
}
