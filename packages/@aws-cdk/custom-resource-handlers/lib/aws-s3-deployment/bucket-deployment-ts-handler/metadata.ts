/**
 * Object metadata (contract §2.1).
 *
 * `UserMetadata` becomes S3 user metadata; `SystemMetadata` sets S3 system headers. Both
 * apply uniformly to every object a request deploys.
 *
 * Unlike the original implementation, `SystemMetadata` keys are validated against the
 * supported set instead of being passed through to a command line verbatim (B10): an
 * unknown key now fails with a message that names it, and a value can never be
 * reinterpreted as an option.
 */
import type { ObjectCannedACL, PutObjectCommandInput, ServerSideEncryption, StorageClass } from '@aws-sdk/client-s3';

/** The `SystemMetadata` keys this provider understands, with their S3 request fields. */
const SYSTEM_METADATA_KEYS = [
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
  'acl',
] as const;

/** S3 request fields derived from the metadata properties. */
export type MetadataFields = Pick<PutObjectCommandInput,
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

/**
 * Translate the two metadata property bags into S3 request fields.
 *
 * `Expires` is parsed from the HTTP-date string callers send; an unparseable value is
 * rejected rather than silently dropped, because silently losing a cache directive is
 * worse than failing the deployment.
 */
export function toMetadataFields(
  userMetadata: Record<string, string>,
  systemMetadata: Record<string, string>,
): MetadataFields {
  // `sse-c-copy-source` names the SSE-C algorithm of a *copy source*, which has no meaning
  // on an upload, and the protocol has no property for the matching customer key. The AWS
  // CLI accepted the flag and then failed the transfer; saying so up front is strictly more
  // useful. See https://github.com/aws/aws-cdk/issues/6080.
  if (Object.keys(systemMetadata).some((key) => key.toLowerCase() === 'sse-c-copy-source')) {
    throw new Error(
      "SystemMetadata key 'sse-c-copy-source' cannot be applied to an upload: it describes a copy "
      + 'source, and no customer key can be supplied through this provider (aws/aws-cdk#6080)',
    );
  }

  const unknown = Object.keys(systemMetadata).filter(
    (key) => !(SYSTEM_METADATA_KEYS as readonly string[]).includes(key.toLowerCase()),
  );
  if (unknown.length > 0) {
    throw new Error(
      `unsupported SystemMetadata key(s) ${JSON.stringify(unknown)}; supported keys are ${JSON.stringify([...SYSTEM_METADATA_KEYS])}`,
    );
  }

  const system: Record<string, string> = {};
  for (const [key, value] of Object.entries(systemMetadata)) {
    system[key.toLowerCase()] = value;
  }

  const fields: MetadataFields = {
    CacheControl: system['cache-control'],
    ContentDisposition: system['content-disposition'],
    ContentEncoding: system['content-encoding'],
    ContentLanguage: system['content-language'],
    ContentType: system['content-type'],
    Expires: system.expires !== undefined ? parseHttpDate(system.expires) : undefined,
    ServerSideEncryption: system.sse as ServerSideEncryption | undefined,
    SSEKMSKeyId: system['sse-kms-key-id'],
    StorageClass: system['storage-class'] as StorageClass | undefined,
    WebsiteRedirectLocation: system['website-redirect'],
    ACL: system.acl as ObjectCannedACL | undefined,
    // S3 lowercases user-metadata keys on the wire; doing it here makes the behavior
    // explicit and independent of the SDK.
    Metadata: lowercaseKeys(userMetadata),
  };

  // Drop absent fields so the request carries only what the caller asked for.
  return Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined),
  ) as MetadataFields;
}

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
 * which S3 renders as `binary/octet-stream` — the same outcome the AWS CLI produces when
 * Python's `mimetypes` cannot guess.
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
