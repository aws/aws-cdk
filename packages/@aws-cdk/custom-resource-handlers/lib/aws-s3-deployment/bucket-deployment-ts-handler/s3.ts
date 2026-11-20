/**
 * S3 operations: mirroring the sources to the destination, pruning, recursive deletion,
 * and the ownership guard.
 */
import { type Readable } from 'stream';
import type { S3 } from '@aws-sdk/client-s3';
import pLimit from 'p-limit';
import { S3ObjectSet } from './file-set';
import type { Filters } from './filters';
import { replaceMarkers } from './markers';
import { guessContentType } from './metadata';
import type { CopySourcesAction, Destination } from './request';
import { withScratchDirectory } from './scratch';
import { withSourceFiles, type CopyableFile } from './staging';

/** Tag-key prefix that marks a bucket+prefix as owned by a live deployment. */
const OWNERSHIP_TAG = 'aws-cdk:cr-owned';

/**
 * How many S3 requests to have in flight at once.
 *
 * A deployment can carry thousands of files, so the per-file work is throttled rather than
 * launched all at once. 32 keeps a large site fast without exhausting sockets or file
 * descriptors in a 1024 MiB Lambda.
 */
const CONCURRENCY = 32;

export class S3Deployment {
  constructor(private readonly s3: S3) {}

  /**
   * Make the destination mirror the sources.
   *
   * Returns the version id of the object deployed from each source, positionally aligned
   * with `action.sources`. A source every filter rejected has no object and therefore no
   * version id, which is reported as the empty string.
   */
  public async copySources(action: CopySourcesAction): Promise<string[]> {
    return withScratchDirectory(async (scratchDirectory) => {
      // One LIST, serving two purposes: deciding what to upload, and deciding what pruning
      // should remove.
      const destination = await this.snapshotDestination(action.destination);

      const versionIds = new Map<number, string>();

      // Entries within a source go in parallel; sources go one at a time, so only one
      // archive occupies scratch space. A path carried by several sources is therefore
      // uploaded several times, with the last source's content surviving.
      const limit = pLimit(CONCURRENCY);

      for (const [sourceIndex, source] of action.sources.entries()) {
        await withSourceFiles(this.s3, source, sourceIndex, action.extract, scratchDirectory, async (files) => {
          const accepted = files.filter((file) => action.filters.accepts(file.relativeKey));

          // Parallelism is bounded by `limit`, not by the number of files in the source.
          // eslint-disable-next-line @cdklabs/promiseall-no-unbounded-parallelism
          await Promise.all(accepted.map((file) => {
            // Claiming and comparing are independent: the claim only protects the key from
            // pruning, and the comparison always reads the original listing. So a path
            // carried by several sources gets the same answer every time, and files racing
            // for the same key cannot interfere with each other.
            destination.markForKeeping(file.relativeKey);

            if (file.isAlreadyInDestination(destination)) { return; }

            return limit(async () => {
              const versionId = await this.upload(file, action);
              if (versionId) { versionIds.set(file.sourceIndex, versionId); }
            });
          }));
        });
      }

      if (action.prune) {
        await this.pruneUntouched(action.destination, destination, action.filters);
      }

      return action.sources.map((_, index) => versionIds.get(index) ?? '');
    });
  }

  /**
   * Recursively delete everything under a prefix, unless another deployment put it there.
   *
   * The prefix is already normalized to end in `/` (or be empty), so this cannot reach
   * sibling keys that merely share a string prefix: deleting `app/` leaves `apple/` and
   * `appendix.txt` alone.
   */
  public async deletePrefixUnlessOwned(destination: Destination): Promise<void> {
    if (await this.isOwnedElsewhere(destination)) { return; }

    for await (const page of this.listPrefix(destination.bucketName, destination.keyPrefix)) {
      await this.deleteKeys(destination.bucketName, page.map((object) => object.key));
    }
  }

  /**
   * What is already at the destination.
   *
   * Size and last modification time are all the skip decision uses, and both come from
   * `ListObjectsV2` — so deciding costs one paginated LIST no matter how many files the
   * request carries, and the same result tells pruning what to remove. The comparison rule
   * lives on `S3ObjectSet`.
   *
   * Two known holes come with it, both inherited from the AWS CLI's strategy:
   *
   * - **A same-size edit whose timestamp is not newer is silently skipped.** For an
   *   extracted archive the timestamp comes from the zip entry, and CDK asset zips use a
   *   fixed one, so a marker substitution that preserves length can leave stale content at
   *   the destination. A content hash would catch this; size and time cannot.
   * - **Metadata changes alone do not trigger a rewrite.** Adding `cache-control` to an
   *   otherwise-unchanged deployment leaves existing objects as they were, because the
   *   LIST response carries no metadata to compare against.
   *
   * Both are accepted deliberately in exchange for the request profile. Closing them means
   * either a `HeadObject` per candidate object, or a provider-written manifest recording a
   * content hash and metadata fingerprint per key — one GET instead of N HEADs.
   */
  private async snapshotDestination(destination: Destination): Promise<S3ObjectSet> {
    const { bucketName, keyPrefix } = destination;
    const existing = new S3ObjectSet();

    for await (const page of this.listPrefix(bucketName, keyPrefix)) {
      for (const object of page) {
        existing.add(object.key.slice(keyPrefix.length), object.size, object.lastModified);
      }
    }

    return existing;
  }

  /**
   * Put one file, buffering it only if its markers have to be substituted.
   *
   * A file with markers has to be read in full: a substitution can change its length, so
   * there is nothing to stream. Non-substituted files are piped from its source straight into the
   * upload.
   */
  private async upload(file: CopyableFile, action: CopySourcesAction): Promise<string | undefined> {
    const key = `${action.destination.keyPrefix}${file.relativeKey}`;
    const metadata = {
      ...action.putObjectSettings,
      ContentType: action.putObjectSettings.ContentType ?? guessContentType(file.relativeKey),
    };

    if (Object.keys(file.markers).length > 0) {
      const entireFile = await readEntireStream((await file.openStream()).body);
      const body = replaceMarkers(entireFile, file.markers, file.markersConfig);
      const response = await this.s3.putObject({
        Bucket: action.destination.bucketName,
        Key: key,
        Body: body,
        ...metadata,
      });
      return response.VersionId;
    }

    const { body, contentLength } = await file.openStream();
    const response = await this.s3.putObject({
      Bucket: action.destination.bucketName,
      Key: key,
      Body: body,
      // S3 has to know the length up front to sign a streaming upload.
      ContentLength: contentLength,
      ...metadata,
    });
    return response.VersionId;
  }

  /**
   * Delete the destination objects nothing claimed.
   *
   * Reads the snapshot rather than listing again, so a deployment costs one LIST whether
   * or not it prunes.
   *
   * Filtered-out objects are left alone, which is what makes `Exclude` the supported way
   * to protect destination-only content. A source file the filter rejected never claimed
   * its key, so its destination object is still unmarked — and is spared by the same
   * filter here.
   */
  private async pruneUntouched(
    destination: Destination,
    existing: S3ObjectSet,
    filters: Filters,
  ): Promise<void> {
    const condemned = existing.allUnmarked()
      .filter((relativeKey) => filters.accepts(relativeKey))
      .map((relativeKey) => `${destination.keyPrefix}${relativeKey}`);

    await this.deleteKeys(destination.bucketName, condemned);
  }

  /**
   * Whether some other live deployment claims this bucket and prefix.
   *
   * A deployment marks what it owns with an `aws-cdk:cr-owned:<prefix>:<hash>` bucket tag,
   * so several deployments can share one destination without destroying each other's
   * content.
   *
   * Fails **closed**: if the tag set cannot be read, ownership is unknown, and unknown
   * ownership must not authorize a recursive delete. `NoSuchTagSet` is the one error that
   * genuinely means "no owner".
   */
  private async isOwnedElsewhere(destination: Destination): Promise<boolean> {
    const { bucketName, keyPrefix, rawKeyPrefix } = destination;

    let tagKeys: string[];
    try {
      const response = await this.s3.getBucketTagging({ Bucket: bucketName });
      tagKeys = (response.TagSet ?? []).map((tag) => tag.Key ?? '');
    } catch (e: any) {
      if (e.name === 'NoSuchTagSet') { return false; }
      console.error(`Cannot determine whether s3://${bucketName}/${keyPrefix} is owned by another deployment ` +
        `(${e.name}: ${e.message}); refusing to delete its contents`);
      return true;
    }

    const candidates = new Set(
      [keyPrefix, rawKeyPrefix]
        .map((prefix) => (prefix === '' || prefix === '/' ? OWNERSHIP_TAG : `${OWNERSHIP_TAG}:${prefix}`)),
    );

    return tagKeys.some((key) => [...candidates].some((candidate) => key.startsWith(candidate)));
  }

  /** Every key under a prefix. */
  private async* listPrefix(bucketName: string, prefix: string) {
    let continuationToken: string | undefined;

    do {
      const page = await this.s3.listObjectsV2({
        Bucket: bucketName,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      });

      yield (page.Contents ?? []).flatMap((object) => object.Key === undefined ? [] : [{
        key: object.Key,
        size: object.Size ?? 0,
        lastModified: object.LastModified ?? new Date(0),
      }]);

      continuationToken = page.NextContinuationToken;
    } while (continuationToken);
  }

  private async deleteKeys(bucketName: string, keys: string[]): Promise<void> {
    for (let i = 0; i < keys.length; i += 1000) {
      const batch = keys.slice(i, i + 1000);
      const response = await this.s3.deleteObjects({
        Bucket: bucketName,
        Delete: { Objects: batch.map((Key) => ({ Key })), Quiet: true },
      });

      // DeleteObjects reports per-key failures in the body rather than throwing, so a
      // partial failure would otherwise pass silently.
      const errors = response.Errors ?? [];
      if (errors.length > 0) {
        throw new Error(
          `failed to delete ${errors.length} object(s) from s3://${bucketName}: ` +
          errors.slice(0, 5).map((e) => `${e.Key} (${e.Code}: ${e.Message})`).join(', '),
        );
      }
    }
  }
}

async function readEntireStream(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks);
}
