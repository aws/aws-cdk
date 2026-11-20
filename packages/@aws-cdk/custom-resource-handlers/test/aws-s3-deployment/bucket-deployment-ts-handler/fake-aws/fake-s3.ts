/**
 * In-memory S3.
 *
 * A real reimplementation of the handful of S3 operations the bucket-deployment provider
 * uses, rather than a set of call expectations. Tests assert on the resulting **bucket
 * state** — which objects exist, with what bytes and metadata — so they describe the
 * outcome the provider is supposed to produce and stay valid if the provider changes how
 * it gets there.
 *
 * Modelled on `toolkit-lib`'s `FakeCloudFormation`: construct one, wire it into an
 * `aws-sdk-client-mock` stub with `installUsingAwsMock`, then inspect it afterwards.
 */
import { createHash } from 'crypto';
import { Readable } from 'stream';
import type {
  DeleteObjectsCommandInput,
  DeleteObjectsCommandOutput,
  GetBucketTaggingCommandInput,
  GetBucketTaggingCommandOutput,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  HeadObjectCommandInput,
  HeadObjectCommandOutput,
  ListObjectsV2CommandInput,
  ListObjectsV2CommandOutput,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3ClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from '@aws-sdk/client-s3';
import {
  DeleteObjectsCommand,
  GetBucketTaggingCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { sdkStreamMixin } from '@smithy/util-stream';
import type { AwsStub } from 'aws-sdk-client-mock';

/** One stored object version. */
export interface FakeObject {
  readonly key: string;
  readonly body: Buffer;
  readonly versionId?: string;
  readonly contentType?: string;
  readonly cacheControl?: string;
  readonly contentDisposition?: string;
  readonly contentEncoding?: string;
  readonly contentLanguage?: string;
  readonly expires?: Date;
  readonly serverSideEncryption?: string;
  readonly sseKmsKeyId?: string;
  readonly storageClass?: string;
  readonly websiteRedirectLocation?: string;
  readonly acl?: string;
  readonly metadata: Record<string, string>;
  /**
   * When the object was written.
   *
   * Reported by both `ListObjectsV2` and `HeadObject`, as S3 does. Modelled because the
   * provider's skip decision compares it against the staged file's timestamp — a fake that
   * omitted it would make every object look ancient and defeat skipping entirely.
   */
  readonly lastModified: Date;
  /**
   * Base64 SHA-256 of the body, stored only when the write asked for it.
   *
   * S3 records an additional checksum when `ChecksumAlgorithm` is supplied, and returns it
   * from `HeadObject` only when `ChecksumMode: ENABLED` is requested. Both halves are
   * modelled, because the provider relies on them to decide whether an object has changed.
   */
  readonly checksumSha256?: string;
}

export interface FakeBucketOptions {
  /** When set, every write produces a new version id and deletes leave markers. */
  readonly versioned?: boolean;

  /** Bucket-level tags, as `GetBucketTagging` would report them. */
  readonly tags?: Record<string, string>;

  /**
   * Default server-side encryption, reported by `HeadObject` whatever the write asked for.
   *
   * Real buckets have had SSE-S3 (`AES256`) applied by default since 2023, and the default
   * here matches that. Modelling it matters: a provider that compares a request's `sse`
   * against the effective value will never see a match for a request that asks for none.
   */
  readonly defaultEncryption?: string | false;
}

interface StoredObject extends FakeObject {
  deleted?: boolean;
}

class FakeBucket {
  /** Newest-last version history per key, including delete markers. */
  public readonly history = new Map<string, StoredObject[]>();
  public tags: Record<string, string> | undefined;
  public readonly versioned: boolean;
  public readonly defaultEncryption: string | undefined;

  constructor(public readonly name: string, options: FakeBucketOptions = {}) {
    this.versioned = options.versioned ?? false;
    this.tags = options.tags;
    this.defaultEncryption = options.defaultEncryption === false
      ? undefined
      : options.defaultEncryption ?? 'AES256';
  }

  /** The current (non-deleted) object for a key. */
  public current(key: string): StoredObject | undefined {
    const versions = this.history.get(key);
    const latest = versions?.[versions.length - 1];
    return latest?.deleted ? undefined : latest;
  }

  public liveKeys(): string[] {
    return [...this.history.keys()].filter((key) => this.current(key) !== undefined).sort();
  }
}

function s3Error(name: string, message: string, httpStatusCode = 400): never {
  const e: any = new Error(message);
  e.name = name;
  e.$metadata = { httpStatusCode };
  throw e;
}

let versionCounter = 0;

export class FakeS3 {
  private readonly buckets = new Map<string, FakeBucket>();

  /**
   * Operations that should fail, for exercising error paths.
   *
   * Keyed by operation name; the value decides which calls fail. This is the one place
   * the fake departs from pure emulation, and it exists so that tests can reach the
   * provider's failure handling without reaching for call-level mocks.
   */
  /** Keys whose last write arrived as a stream, for asserting the upload path taken. */
  private readonly streamedKeys = new Set<string>();

  /**
   * How many times each operation has been called.
   *
   * Request *counts* are a property of the service, not of the caller's internals — this
   * is here so that a test can state "a deployment costs one LIST", which is a promise the
   * provider makes rather than an implementation detail.
   */
  private readonly callCounts = new Map<string, number>();

  public failures: {
    getBucketTagging?: { name: string; message: string };
    putObject?: (key: string) => { name: string; message: string } | undefined;
  } = {};

  // -----------------------------------------------------------------------
  // Test setup and inspection
  // -----------------------------------------------------------------------

  public createBucket(name: string, options: FakeBucketOptions = {}): void {
    this.buckets.set(name, new FakeBucket(name, options));
  }

  /** How many times an operation was called, e.g. `ListObjectsV2`. */
  public callCount(operation: string): number {
    return this.callCounts.get(operation) ?? 0;
  }

  public reset(): void {
    this.buckets.clear();
    this.streamedKeys.clear();
    this.callCounts.clear();
    this.failures = {};
  }

  /**
   * Put an object directly, bypassing the provider, to seed pre-existing state.
   *
   * Pass `lastModified` to seed an object that predates what is about to be deployed.
   */
  public seed(bucketName: string, key: string, body: string | Buffer, props: Partial<FakeObject> = {}): void {
    this.write(this.requireBucket(bucketName), key, typeof body === 'string' ? Buffer.from(body) : body, props);
  }

  /** Whether an object's body arrived as a stream rather than a buffer. */
  public wasStreamed(bucketName: string, key: string): boolean {
    return this.streamedKeys.has(`${bucketName}/${key}`);
  }

  /** Set (or clear) the bucket's tag set. */
  public setTags(bucketName: string, tags: Record<string, string> | undefined): void {
    this.requireBucket(bucketName).tags = tags;
  }

  public tagsOf(bucketName: string): Record<string, string> | undefined {
    return this.requireBucket(bucketName).tags;
  }

  /** Live keys in a bucket, optionally under a prefix, sorted. */
  public keys(bucketName: string, prefix = ''): string[] {
    return this.requireBucket(bucketName).liveKeys().filter((key) => key.startsWith(prefix));
  }

  /** Live keys under a prefix with the prefix stripped, sorted. */
  public relativeKeys(bucketName: string, prefix: string): string[] {
    return this.keys(bucketName, prefix).map((key) => key.slice(prefix.length));
  }

  /** The current object at a key, or `undefined`. */
  public object(bucketName: string, key: string): FakeObject | undefined {
    return this.requireBucket(bucketName).current(key);
  }

  /** The current object's body as a UTF-8 string. Throws if absent. */
  public text(bucketName: string, key: string): string {
    const object = this.object(bucketName, key);
    if (!object) { throw new Error(`no object at s3://${bucketName}/${key}`); }
    return object.body.toString('utf-8');
  }

  /** The current object's body. Throws if absent. */
  public bytes(bucketName: string, key: string): Buffer {
    const object = this.object(bucketName, key);
    if (!object) { throw new Error(`no object at s3://${bucketName}/${key}`); }
    return object.body;
  }

  /** Every version ever written at a key, oldest first, including delete markers. */
  public versions(bucketName: string, key: string): Array<{ versionId?: string; deleted?: boolean }> {
    return (this.requireBucket(bucketName).history.get(key) ?? [])
      .map((v) => ({ versionId: v.versionId, deleted: v.deleted }));
  }

  // -----------------------------------------------------------------------
  // Wiring
  // -----------------------------------------------------------------------

  public installUsingAwsMock(
    mock: AwsStub<ServiceInputTypes, ServiceOutputTypes, S3ClientResolvedConfig>,
  ): void {
    mock.on(GetObjectCommand).callsFake(this.getObject.bind(this));
    mock.on(PutObjectCommand).callsFake(this.putObject.bind(this));
    mock.on(HeadObjectCommand).callsFake(this.headObject.bind(this));
    mock.on(ListObjectsV2Command).callsFake(this.listObjectsV2.bind(this));
    mock.on(DeleteObjectsCommand).callsFake(this.deleteObjects.bind(this));
    mock.on(GetBucketTaggingCommand).callsFake(this.getBucketTagging.bind(this));
  }

  // -----------------------------------------------------------------------
  // Operations
  // -----------------------------------------------------------------------

  public async getObject(input: GetObjectCommandInput): Promise<GetObjectCommandOutput> {
    this.count('GetObject');
    const bucket = this.requireBucket(input.Bucket!);
    const object = bucket.current(input.Key!);
    if (!object) {
      s3Error('NoSuchKey', `The specified key does not exist: ${input.Key}`, 404);
    }

    return {
      $metadata: { httpStatusCode: 200 },
      Body: sdkStreamMixin(Readable.from([object.body])),
      ContentLength: object.body.length,
      ContentType: object.contentType,
      VersionId: object.versionId,
      Metadata: object.metadata,
    } as GetObjectCommandOutput;
  }

  public async putObject(input: PutObjectCommandInput): Promise<PutObjectCommandOutput> {
    this.count('PutObject');
    const bucket = this.requireBucket(input.Bucket!);

    const failure = this.failures.putObject?.(input.Key!);
    if (failure) {
      s3Error(failure.name, failure.message, 403);
    }

    const body = await toBuffer(input.Body);

    // S3 rejects a request whose body does not match the length it was signed with, and
    // the provider now supplies that length explicitly for streaming uploads — so getting
    // it wrong should fail here rather than silently truncate.
    if (input.ContentLength !== undefined && input.ContentLength !== body.length) {
      s3Error(
        'IncompleteBody',
        `The request body terminated unexpectedly: declared ${input.ContentLength} bytes, received ${body.length}`,
      );
    }

    if (input.ChecksumAlgorithm !== undefined && input.ChecksumAlgorithm !== 'SHA256') {
      s3Error('InvalidRequest', `FakeS3 only models the SHA256 checksum algorithm, got ${input.ChecksumAlgorithm}`);
    }
    const streamed = input.Body !== undefined
      && !Buffer.isBuffer(input.Body)
      && typeof input.Body !== 'string'
      && !(input.Body instanceof Uint8Array);
    if (streamed) {
      this.streamedKeys.add(`${input.Bucket}/${input.Key}`);
    } else {
      this.streamedKeys.delete(`${input.Bucket}/${input.Key}`);
    }

    const stored = this.write(bucket, input.Key!, body, {
      checksumSha256: input.ChecksumAlgorithm === 'SHA256' ? sha256Base64(body) : undefined,
      contentType: input.ContentType,
      cacheControl: input.CacheControl,
      contentDisposition: input.ContentDisposition,
      contentEncoding: input.ContentEncoding,
      contentLanguage: input.ContentLanguage,
      expires: input.Expires,
      serverSideEncryption: input.ServerSideEncryption,
      sseKmsKeyId: input.SSEKMSKeyId,
      storageClass: input.StorageClass,
      websiteRedirectLocation: input.WebsiteRedirectLocation,
      acl: input.ACL,
      metadata: input.Metadata ?? {},
    });

    return {
      $metadata: { httpStatusCode: 200 },
      VersionId: stored.versionId,
      ETag: `"${etagOf(body)}"`,
      ChecksumSHA256: stored.checksumSha256,
    };
  }

  public async headObject(input: HeadObjectCommandInput): Promise<HeadObjectCommandOutput> {
    this.count('HeadObject');
    const bucket = this.requireBucket(input.Bucket!);
    const object = bucket.current(input.Key!);
    if (!object) {
      s3Error('NotFound', `Not Found: ${input.Key}`, 404);
    }

    return {
      $metadata: { httpStatusCode: 200 },
      LastModified: object.lastModified,
      ContentLength: object.body.length,
      // S3 applies and reports an octet-stream default when the write supplied no type.
      ContentType: object.contentType ?? 'binary/octet-stream',
      CacheControl: object.cacheControl,
      ContentDisposition: object.contentDisposition,
      ContentEncoding: object.contentEncoding,
      ContentLanguage: object.contentLanguage,
      Expires: object.expires,
      // The effective encryption, which is the bucket default unless the write overrode it.
      ServerSideEncryption: object.serverSideEncryption ?? bucket.defaultEncryption,
      SSEKMSKeyId: object.sseKmsKeyId,
      WebsiteRedirectLocation: object.websiteRedirectLocation,
      VersionId: object.versionId,
      Metadata: object.metadata,
      StorageClass: object.storageClass as any,
      // Only disclosed when the caller opts in, exactly as S3 does.
      ChecksumSHA256: input.ChecksumMode === 'ENABLED' ? object.checksumSha256 : undefined,
    } as HeadObjectCommandOutput;
  }

  /**
   * `ListObjectsV2`, paginated at 1000 keys like the real API, so pagination bugs in the
   * caller surface here rather than only against real S3.
   */
  public async listObjectsV2(input: ListObjectsV2CommandInput): Promise<ListObjectsV2CommandOutput> {
    this.count('ListObjectsV2');
    const bucket = this.requireBucket(input.Bucket!);
    const prefix = input.Prefix ?? '';
    const all = bucket.liveKeys().filter((key) => key.startsWith(prefix));

    const pageSize = input.MaxKeys ?? 1000;
    const start = input.ContinuationToken ? Number(input.ContinuationToken) : 0;
    const page = all.slice(start, start + pageSize);
    const next = start + pageSize < all.length ? String(start + pageSize) : undefined;

    return {
      $metadata: { httpStatusCode: 200 },
      Contents: page.map((key) => {
        const object = bucket.current(key)!;
        return {
          Key: key,
          Size: object.body.length,
          ETag: `"${etagOf(object.body)}"`,
          LastModified: object.lastModified,
        };
      }),
      KeyCount: page.length,
      IsTruncated: next !== undefined,
      NextContinuationToken: next,
      Name: bucket.name,
      Prefix: prefix,
    };
  }

  public async deleteObjects(input: DeleteObjectsCommandInput): Promise<DeleteObjectsCommandOutput> {
    this.count('DeleteObjects');
    const bucket = this.requireBucket(input.Bucket!);
    const objects = input.Delete?.Objects ?? [];

    if (objects.length > 1000) {
      s3Error('MalformedXML', 'The XML you provided was not well-formed: at most 1000 keys per request');
    }

    const deleted: Array<{ Key?: string }> = [];
    for (const { Key } of objects) {
      if (Key === undefined) { continue; }

      if (bucket.versioned) {
        // A versioned delete leaves a marker and keeps the prior version readable.
        bucket.history.get(Key)?.push({
          key: Key,
          body: Buffer.alloc(0),
          metadata: {},
          deleted: true,
          versionId: nextVersionId(),
          lastModified: new Date(),
        });
      } else {
        bucket.history.delete(Key);
      }
      deleted.push({ Key });
    }

    return { $metadata: { httpStatusCode: 200 }, Deleted: input.Delete?.Quiet ? undefined : deleted };
  }

  public async getBucketTagging(input: GetBucketTaggingCommandInput): Promise<GetBucketTaggingCommandOutput> {
    this.count('GetBucketTagging');
    const failure = this.failures.getBucketTagging;
    if (failure) {
      s3Error(failure.name, failure.message, 403);
    }

    const bucket = this.requireBucket(input.Bucket!);
    if (!bucket.tags || Object.keys(bucket.tags).length === 0) {
      s3Error('NoSuchTagSet', 'The TagSet does not exist', 404);
    }

    return {
      $metadata: { httpStatusCode: 200 },
      TagSet: Object.entries(bucket.tags).map(([Key, Value]) => ({ Key, Value })),
    };
  }

  // -----------------------------------------------------------------------
  // Internals
  // -----------------------------------------------------------------------

  private write(bucket: FakeBucket, key: string, body: Buffer, props: Partial<FakeObject>): StoredObject {
    const stored: StoredObject = {
      key,
      body,
      lastModified: props.lastModified ?? new Date(),
      versionId: bucket.versioned ? nextVersionId() : undefined,
      metadata: props.metadata ?? {},
      contentType: props.contentType,
      cacheControl: props.cacheControl,
      contentDisposition: props.contentDisposition,
      contentEncoding: props.contentEncoding,
      contentLanguage: props.contentLanguage,
      expires: props.expires,
      serverSideEncryption: props.serverSideEncryption,
      sseKmsKeyId: props.sseKmsKeyId,
      storageClass: props.storageClass,
      websiteRedirectLocation: props.websiteRedirectLocation,
      acl: props.acl,
      checksumSha256: props.checksumSha256,
    };

    const history = bucket.history.get(key);
    if (history && bucket.versioned) {
      history.push(stored);
    } else {
      bucket.history.set(key, [stored]);
    }
    return stored;
  }

  private count(operation: string): void {
    this.callCounts.set(operation, this.callCount(operation) + 1);
  }

  private requireBucket(name: string): FakeBucket {
    const bucket = this.buckets.get(name);
    if (!bucket) {
      s3Error('NoSuchBucket', `The specified bucket does not exist: ${name}`, 404);
    }
    return bucket;
  }
}

function nextVersionId(): string {
  return `v${String(++versionCounter).padStart(6, '0')}`;
}

/**
 * Content-addressed ETag, so identical content compares equal as it does in S3.
 *
 * Real S3 uses MD5 for single-part uploads; the digest only has to be stable and
 * collision-free for tests to compare objects, so this uses SHA-256 truncated to the same
 * width rather than reaching for MD5.
 */
function etagOf(body: Buffer): string {
  return createHash('sha256').update(body).digest('hex').slice(0, 32);
}

function sha256Base64(body: Buffer): string {
  return createHash('sha256').update(body).digest('base64');
}

/**
 * Collect a request body.
 *
 * Streams are supported because the provider pipes a download or an archive entry straight
 * into an upload, which is the whole point of not buffering.
 */
async function toBuffer(body: PutObjectCommandInput['Body']): Promise<Buffer> {
  if (body === undefined) { return Buffer.alloc(0); }
  if (Buffer.isBuffer(body)) { return body; }
  if (typeof body === 'string') { return Buffer.from(body, 'utf-8'); }
  if (body instanceof Uint8Array) { return Buffer.from(body); }

  if (typeof (body as any)[Symbol.asyncIterator] === 'function') {
    const chunks: Buffer[] = [];
    for await (const chunk of body as AsyncIterable<Buffer | string>) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk, 'utf-8') : chunk);
    }
    return Buffer.concat(chunks);
  }

  throw new Error(`FakeS3 does not support a ${typeof body} body; pass a Buffer, string, Uint8Array or stream`);
}
