/**
 * Object metadata.
 *
 * `UserMetadata` becomes S3 user metadata; `SystemMetadata` sets S3 system headers. Both
 * apply uniformly to every object a request deploys.
 *
 * The set of `SystemMetadata` keys is closed, and deliberately matches exactly what the
 * `BucketDeployment` L2 can emit (its `mapSystemMetadata`). Each key is mapped explicitly
 * below, so adding a key to the L2 without teaching this provider about it fails loudly
 * instead of being forwarded somewhere it means nothing.
 */
import type { ObjectCannedACL, PutObjectCommandInput, ServerSideEncryption, StorageClass } from '@aws-sdk/client-s3';

/** S3 request fields derived from the metadata properties. */
export type PartialPutObjectRequest = Pick<PutObjectCommandInput,
| 'CacheControl'
| 'ContentDisposition'
| 'ContentEncoding'
| 'ContentLanguage'
| 'ContentType'
| 'Expires'
| 'ServerSideEncryption'
| 'SSEKMSKeyId'
| 'StorageClass'
| 'WebsiteRedirectLocation'
| 'ACL'
| 'Metadata'
>;

/** Every `SystemMetadata` key this provider accepts, for error messages. */
const SUPPORTED_KEYS = [
  'acl',
  'cache-control',
  'content-disposition',
  'content-encoding',
  'content-language',
  'content-type',
  'expires',
  'sse',
  'sse-kms-key-id',
  'storage-class',
  'website-redirect',
] as const;

/**
 * Translate the two metadata property bags into S3 request fields.
 *
 * The SystemMetadata originally mapped to AWS CLI v1 command-line
 * flags (`--cache-control` etc), and the contract re-exposed them
 * literally. We parse them here under their AWS CLI v1 name and translate
 * them into AWS SDK v3 request fields.
 */
export function parseMetadataFields(
  userMetadata: Record<string, string>,
  systemMetadata: Record<string, string>,
): PartialPutObjectRequest {
  const fields: Writable<PartialPutObjectRequest> = {};

  for (const [rawKey, value] of Object.entries(systemMetadata)) {
    switch (rawKey.toLowerCase()) {
      // A joined list of cache directives, e.g. `max-age=60, public`. The L2 builds the
      // string from its `CacheControl` helpers, so it arrives ready to use.
      case 'cache-control':
        fields.CacheControl = value;
        break;

      case 'content-disposition':
        fields.ContentDisposition = value;
        break;

      case 'content-encoding':
        fields.ContentEncoding = value;
        break;

      case 'content-language':
        fields.ContentLanguage = value;
        break;

      // Overrides the per-extension guess for every object in the request.
      case 'content-type':
        fields.ContentType = value;
        break;

      // An HTTP date. The L2 sends `Expiration.date.toUTCString()`; a direct caller can
      // send anything `Date` understands.
      case 'expires':
        fields.Expires = parseHttpDate(value);
        break;

      // `AES256`, `aws:kms` or `aws:kms:dsse`.
      case 'sse':
        fields.ServerSideEncryption = value as ServerSideEncryption;
        break;

      case 'sse-kms-key-id':
        fields.SSEKMSKeyId = value;
        break;

      case 'storage-class':
        fields.StorageClass = value as StorageClass;
        break;

      case 'website-redirect':
        fields.WebsiteRedirectLocation = value;
        break;

      // A canned ACL name, already kebab-cased by the L2.
      case 'acl':
        fields.ACL = value as ObjectCannedACL;
        break;

      // The L2's `serverSideEncryptionCustomerAlgorithm` lands here. It names the SSE-C
      // algorithm of a *copy source*, which has no meaning for an upload, and the matching
      // customer key cannot be supplied through this provider at all. The AWS CLI
      // implementation did not honour it either. Ignoring it keeps a deployment that sets
      // it working, which is more use than failing over a property that has never done
      // anything.
      case 'sse-c-copy-source':
        console.error(
          "ignoring SystemMetadata key 'sse-c-copy-source': it describes a copy source, which has no "
          + 'meaning for an upload. It comes from the BucketDeployment '
          + "'serverSideEncryptionCustomerAlgorithm' property, which has never had any effect "
          + '(aws/aws-cdk#6080) — remove it.',
        );
        break;

      default:
        throw new Error(
          `unsupported SystemMetadata key ${JSON.stringify(rawKey)}; supported keys are ${JSON.stringify([...SUPPORTED_KEYS])}`,
        );
    }
  }

  // S3 lowercases user-metadata keys on the wire; doing it here makes the behavior
  // explicit and independent of the SDK.
  const metadata = lowercaseKeys(userMetadata);
  if (metadata) { fields.Metadata = metadata; }

  return fields;
}

type Writable<A> = { -readonly [K in keyof A]: A[K] };

function lowercaseKeys(metadata: Record<string, string>): Record<string, string> | undefined {
  const keys = Object.keys(metadata);
  if (keys.length === 0) { return undefined; }
  return Object.fromEntries(keys.map((key) => [key.toLowerCase(), metadata[key]]));
}

function parseHttpDate(value: string): Date {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`SystemMetadata 'expires' is not a valid date: ${JSON.stringify(value)}`);
  }
  return parsed;
}

/**
 * Content types by file extension, for objects whose type the caller did not specify.
 *
 * Covers what a static site or bundled asset is made of. Anything unlisted is left unset,
 * which S3 renders as `binary/octet-stream`.
 */
const CONTENT_TYPES: Record<string, string> = {
  bmp: 'image/bmp',
  css: 'text/css',
  csv: 'text/csv',
  eot: 'application/vnd.ms-fontobject',
  gif: 'image/gif',
  gz: 'application/gzip',
  htm: 'text/html',
  html: 'text/html',
  ico: 'image/vnd.microsoft.icon',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  js: 'text/javascript',
  json: 'application/json',
  map: 'application/json',
  md: 'text/markdown',
  mjs: 'text/javascript',
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  otf: 'font/otf',
  pdf: 'application/pdf',
  png: 'image/png',
  svg: 'image/svg+xml',
  tiff: 'image/tiff',
  ttf: 'font/ttf',
  txt: 'text/plain',
  wasm: 'application/wasm',
  webm: 'video/webm',
  webp: 'image/webp',
  woff: 'font/woff',
  woff2: 'font/woff2',
  xhtml: 'application/xhtml+xml',
  xml: 'text/xml',
  yaml: 'application/yaml',
  yml: 'application/yaml',
  zip: 'application/zip',
};

/** Guess a content type from a key's extension, or `undefined` if unknown. */
export function guessContentType(key: string): string | undefined {
  const name = key.slice(key.lastIndexOf('/') + 1);
  const dot = name.lastIndexOf('.');
  if (dot <= 0) { return undefined; }
  return CONTENT_TYPES[name.slice(dot + 1).toLowerCase()];
}
