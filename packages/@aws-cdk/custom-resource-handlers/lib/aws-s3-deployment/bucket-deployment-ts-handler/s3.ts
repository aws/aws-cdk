/**
 * S3 operations: staging sources, mirroring them to the destination, pruning, recursive
 * deletion, and the ownership guard.
 */
import type { S3Client } from '@aws-sdk/client-s3';
import {
  DeleteObjectsCommand,
  GetBucketTaggingCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import type { Filters } from './filters';
import { replaceMarkers } from './markers';
import type { MetadataFields } from './metadata';
import { guessContentType } from './metadata';
import type { DeploymentRequest, Source } from './request';
import { readZip, sanitizeEntryPath } from './zip';

/** Tag-key prefix that marks a bucket+prefix as owned by a live deployment. */
const OWNERSHIP_TAG = 'aws-cdk:cr-owned';

/** One file ready to be written to the destination, keyed relative to the prefix. */
export interface StagedFile {
  readonly relativeKey: string;
  readonly contents: Buffer;
  /** Index into the request's source list, for positional version-id reporting. */
  readonly sourceIndex: number;
}

/** What a deployment did, as far as callers can observe it. */
export interface DeploymentResult {
  /** Version ids of uploaded objects, by source index. Absent when unversioned. */
  readonly versionIdsBySource: Map<number, string>;
  readonly uploaded: string[];
  readonly pruned: string[];
}

export class S3Deployment {
  constructor(private readonly s3: S3Client) {}

  /**
   * Download every source and expand it into one flat map of destination-relative paths.
   *
   * Sources are processed in request order into a single map, so a later source overwrites
   * an earlier one on a path collision — that is how multi-source overlays are expressed
   * (contract §5).
   */
  public async stage(request: DeploymentRequest): Promise<StagedFile[]> {
    const staged = new Map<string, StagedFile>();

    for (const [sourceIndex, source] of request.sources.entries()) {
      const archive = await this.getObject(source.bucketName, source.objectKey);

      for (const file of this.expand(source, archive, request.extract, sourceIndex)) {
        staged.set(file.relativeKey, file);
      }
    }

    return [...staged.values()];
  }

  /** Expand one source into the files it contributes. */
  private expand(source: Source, body: Buffer, extract: boolean, sourceIndex: number): StagedFile[] {
    if (!extract) {
      // The object is deployed opaquely, keyed by its basename. Markers do not apply —
      // the archive is never opened (contract §4).
      return [{
        relativeKey: basename(source.objectKey),
        contents: body,
        sourceIndex,
      }];
    }

    const files: StagedFile[] = [];
    for (const entry of readZip(body)) {
      const relativeKey = sanitizeEntryPath(entry.rawPath);
      if (!relativeKey) { continue; }

      files.push({
        relativeKey,
        contents: replaceMarkers(entry.contents, source.markers, source.markersConfig),
        sourceIndex,
      });
    }
    return files;
  }

  /**
   * Make the destination mirror the staged files.
   *
   * Every accepted file is uploaded unconditionally. The original implementation delegated
   * to `aws s3 sync`, whose comparator skips an object whose size matches and whose
   * timestamp is not newer — which silently dropped same-size content changes (B1). The
   * contract promises a mirror and says nothing about re-upload, so uploading is both
   * correct and simpler.
   */
  public async deploy(
    request: DeploymentRequest,
    staged: StagedFile[],
    filters: Filters,
    metadata: MetadataFields,
  ): Promise<DeploymentResult> {
    const prefix = request.destinationBucketKeyPrefix;
    const accepted = staged.filter((file) => filters.accepts(file.relativeKey));

    const versionIdsBySource = new Map<number, string>();
    const uploaded: string[] = [];

    for (const file of accepted) {
      const response = await this.s3.send(new PutObjectCommand({
        Bucket: request.destinationBucketName,
        Key: `${prefix}${file.relativeKey}`,
        Body: file.contents,
        // An explicit content type always wins; otherwise guess from the extension, which
        // is what makes a deployed static site serve correctly without configuration.
        ContentType: metadata.ContentType ?? guessContentType(file.relativeKey),
        ...metadata,
      }));

      uploaded.push(file.relativeKey);
      if (response.VersionId) {
        versionIdsBySource.set(file.sourceIndex, response.VersionId);
      }
    }

    const pruned = request.prune
      ? await this.prune(request, new Set(accepted.map((f) => f.relativeKey)), filters)
      : [];

    return { versionIdsBySource, uploaded, pruned };
  }

  /**
   * Delete destination objects under the prefix that the sources do not account for.
   *
   * Filtered-out objects are left alone, which is what makes `Exclude` the supported way
   * to protect destination-only content (contract §2.1).
   */
  private async prune(
    request: DeploymentRequest,
    keep: Set<string>,
    filters: Filters,
  ): Promise<string[]> {
    const prefix = request.destinationBucketKeyPrefix;
    const existing = await this.listPrefix(request.destinationBucketName, prefix);

    const condemned = existing
      .map((key) => key.slice(prefix.length))
      .filter((relative) => !keep.has(relative) && filters.accepts(relative));

    await this.deleteKeys(request.destinationBucketName, condemned.map((r) => `${prefix}${r}`));
    return condemned;
  }

  /**
   * Recursively delete everything under a prefix.
   *
   * The prefix is already normalized to end in `/` (or be empty), so this cannot reach
   * sibling keys that merely share a string prefix (B2).
   */
  public async deletePrefix(bucketName: string, prefix: string): Promise<string[]> {
    const keys = await this.listPrefix(bucketName, prefix);
    await this.deleteKeys(bucketName, keys);
    return keys;
  }

  /**
   * Whether some other live deployment claims this bucket and prefix (contract §6).
   *
   * Fails **closed**: if the tag set cannot be read, ownership is unknown, and unknown
   * ownership must not authorize a recursive delete. The original swallowed every error
   * and treated it as "not owned", so an `AccessDenied` on `GetBucketTagging` escalated
   * into data loss (B3). `NoSuchTagSet` is the one error that genuinely means "no owner".
   */
  public async isOwnedElsewhere(bucketName: string, normalizedPrefix: string, rawPrefix: string): Promise<boolean> {
    let tagKeys: string[];
    try {
      const response = await this.s3.send(new GetBucketTaggingCommand({ Bucket: bucketName }));
      tagKeys = (response.TagSet ?? []).map((tag) => tag.Key ?? '');
    } catch (e: any) {
      if (e.name === 'NoSuchTagSet') { return false; }
      throw new Error(
        `cannot determine whether s3://${bucketName}/${normalizedPrefix} is owned by another deployment ` +
        `(${e.name}: ${e.message}); refusing to delete its contents`,
      );
    }

    // Match both the normalized prefix and the caller's spelling: the construct embeds the
    // caller's spelling in the tag, so an unslashed prefix would otherwise go unseen.
    const candidates = new Set(
      [normalizedPrefix, rawPrefix]
        .map((prefix) => (prefix === '' || prefix === '/' ? OWNERSHIP_TAG : `${OWNERSHIP_TAG}:${prefix}`)),
    );

    return tagKeys.some((key) => [...candidates].some((candidate) => key.startsWith(candidate)));
  }

  /** Every key under a prefix. */
  public async listPrefix(bucketName: string, prefix: string): Promise<string[]> {
    const keys: string[] = [];
    let continuationToken: string | undefined;

    do {
      const page = await this.s3.send(new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }));
      for (const object of page.Contents ?? []) {
        if (object.Key !== undefined) { keys.push(object.Key); }
      }
      continuationToken = page.NextContinuationToken;
    } while (continuationToken);

    return keys;
  }

  private async deleteKeys(bucketName: string, keys: string[]): Promise<void> {
    for (let i = 0; i < keys.length; i += 1000) {
      const batch = keys.slice(i, i + 1000);
      const response = await this.s3.send(new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: { Objects: batch.map((Key) => ({ Key })), Quiet: true },
      }));

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

  private async getObject(bucketName: string, key: string): Promise<Buffer> {
    const response = await this.s3.send(new GetObjectCommand({ Bucket: bucketName, Key: key }));
    if (!response.Body) {
      throw new Error(`s3://${bucketName}/${key} returned an empty body`);
    }
    return Buffer.from(await response.Body.transformToByteArray());
  }
}

/** The part of a key after the last separator. */
export function basename(key: string): string {
  return key.slice(key.lastIndexOf('/') + 1);
}
