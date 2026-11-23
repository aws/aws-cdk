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
 * Python's `mimetypes` defaults (3.13, which the previous handler ran on through the AWS
 * CLI), plus web font, YAML, XHTML and source-map types that table lacks. Anything
 * unlisted is left unset, which S3 renders as `binary/octet-stream`.
 */
const CONTENT_TYPES: Record<string, string> = {
  '3g2': 'audio/3gpp2',
  '3gp': 'audio/3gpp',
  '3gpp': 'audio/3gpp',
  '3gpp2': 'audio/3gpp2',
  'a': 'application/octet-stream',
  'aac': 'audio/aac',
  'adts': 'audio/aac',
  'ai': 'application/postscript',
  'aif': 'audio/x-aiff',
  'aifc': 'audio/x-aiff',
  'aiff': 'audio/x-aiff',
  'ass': 'audio/aac',
  'au': 'audio/basic',
  'avi': 'video/x-msvideo',
  'avif': 'image/avif',
  'bat': 'text/plain',
  'bcpio': 'application/x-bcpio',
  'bin': 'application/octet-stream',
  'bmp': 'image/bmp',
  'c': 'text/plain',
  'cdf': 'application/x-netcdf',
  'cpio': 'application/x-cpio',
  'csh': 'application/x-csh',
  'css': 'text/css',
  'csv': 'text/csv',
  'dll': 'application/octet-stream',
  'doc': 'application/msword',
  'dot': 'application/msword',
  'dvi': 'application/x-dvi',
  'eml': 'message/rfc822',
  'eot': 'application/vnd.ms-fontobject',
  'eps': 'application/postscript',
  'etx': 'text/x-setext',
  'exe': 'application/octet-stream',
  'gif': 'image/gif',
  'gtar': 'application/x-gtar',
  'h': 'text/plain',
  'h5': 'application/x-hdf5',
  'hdf': 'application/x-hdf',
  'heic': 'image/heic',
  'heif': 'image/heif',
  'htm': 'text/html',
  'html': 'text/html',
  'ico': 'image/vnd.microsoft.icon',
  'ief': 'image/ief',
  'jpe': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'js': 'text/javascript',
  'json': 'application/json',
  'ksh': 'text/plain',
  'latex': 'application/x-latex',
  'loas': 'audio/aac',
  'm1v': 'video/mpeg',
  'm3u': 'application/vnd.apple.mpegurl',
  'm3u8': 'application/vnd.apple.mpegurl',
  'man': 'application/x-troff-man',
  'map': 'application/json',
  'markdown': 'text/markdown',
  'md': 'text/markdown',
  'me': 'application/x-troff-me',
  'mht': 'message/rfc822',
  'mhtml': 'message/rfc822',
  'mif': 'application/x-mif',
  'mjs': 'text/javascript',
  'mov': 'video/quicktime',
  'movie': 'video/x-sgi-movie',
  'mp2': 'audio/mpeg',
  'mp3': 'audio/mpeg',
  'mp4': 'video/mp4',
  'mpa': 'video/mpeg',
  'mpe': 'video/mpeg',
  'mpeg': 'video/mpeg',
  'mpg': 'video/mpeg',
  'ms': 'application/x-troff-ms',
  'n3': 'text/n3',
  'nc': 'application/x-netcdf',
  'nq': 'application/n-quads',
  'nt': 'application/n-triples',
  'nws': 'message/rfc822',
  'o': 'application/octet-stream',
  'obj': 'application/octet-stream',
  'oda': 'application/oda',
  'opus': 'audio/opus',
  'otf': 'font/otf',
  'p12': 'application/x-pkcs12',
  'p7c': 'application/pkcs7-mime',
  'pbm': 'image/x-portable-bitmap',
  'pdf': 'application/pdf',
  'pfx': 'application/x-pkcs12',
  'pgm': 'image/x-portable-graymap',
  'pl': 'text/plain',
  'png': 'image/png',
  'pnm': 'image/x-portable-anymap',
  'pot': 'application/vnd.ms-powerpoint',
  'ppa': 'application/vnd.ms-powerpoint',
  'ppm': 'image/x-portable-pixmap',
  'pps': 'application/vnd.ms-powerpoint',
  'ppt': 'application/vnd.ms-powerpoint',
  'ps': 'application/postscript',
  'pwz': 'application/vnd.ms-powerpoint',
  'py': 'text/x-python',
  'pyc': 'application/x-python-code',
  'pyo': 'application/x-python-code',
  'qt': 'video/quicktime',
  'ra': 'audio/x-pn-realaudio',
  'ram': 'application/x-pn-realaudio',
  'ras': 'image/x-cmu-raster',
  'rdf': 'application/xml',
  'rgb': 'image/x-rgb',
  'roff': 'application/x-troff',
  'rst': 'text/x-rst',
  'rtf': 'text/rtf',
  'rtx': 'text/richtext',
  'sgm': 'text/x-sgml',
  'sgml': 'text/x-sgml',
  'sh': 'application/x-sh',
  'shar': 'application/x-shar',
  'snd': 'audio/basic',
  'so': 'application/octet-stream',
  'src': 'application/x-wais-source',
  'srt': 'text/plain',
  'sv4cpio': 'application/x-sv4cpio',
  'sv4crc': 'application/x-sv4crc',
  'svg': 'image/svg+xml',
  'swf': 'application/x-shockwave-flash',
  't': 'application/x-troff',
  'tar': 'application/x-tar',
  'tcl': 'application/x-tcl',
  'tex': 'application/x-tex',
  'texi': 'application/x-texinfo',
  'texinfo': 'application/x-texinfo',
  'tif': 'image/tiff',
  'tiff': 'image/tiff',
  'tr': 'application/x-troff',
  'trig': 'application/trig',
  'tsv': 'text/tab-separated-values',
  'ttf': 'font/ttf',
  'txt': 'text/plain',
  'ustar': 'application/x-ustar',
  'vcf': 'text/x-vcard',
  'vtt': 'text/vtt',
  'wasm': 'application/wasm',
  'wav': 'audio/x-wav',
  'webm': 'video/webm',
  'webmanifest': 'application/manifest+json',
  'webp': 'image/webp',
  'wiz': 'application/msword',
  'woff': 'font/woff',
  'woff2': 'font/woff2',
  'wsdl': 'application/xml',
  'xbm': 'image/x-xbitmap',
  'xhtml': 'application/xhtml+xml',
  'xlb': 'application/vnd.ms-excel',
  'xls': 'application/vnd.ms-excel',
  'xml': 'text/xml',
  'xpdl': 'application/xml',
  'xpm': 'image/x-xpixmap',
  'xsl': 'application/xml',
  'xwd': 'image/x-xwindowdump',
  'yaml': 'application/yaml',
  'yml': 'application/yaml',
  'zip': 'application/zip',
};

/**
 * Compression suffixes, as in Python's `mimetypes.encodings_map`: the `Content-Encoding` each
 * stands for, and the type of the file when it is served as an archive instead.
 */
const COMPRESSION_SUFFIXES: Record<string, { readonly encoding: string; readonly archiveType?: string }> = {
  gz: { encoding: 'gzip', archiveType: 'application/gzip' },
  Z: { encoding: 'compress', archiveType: 'application/x-compress' },
  bz2: { encoding: 'bzip2', archiveType: 'application/x-bzip2' },
  xz: { encoding: 'xz', archiveType: 'application/x-xz' },
  br: { encoding: 'br' },
};

/** Shorthand suffixes for a compressed file, as in Python's `mimetypes.suffix_map`. */
const SUFFIX_ALIASES: Record<string, string> = {
  svgz: 'svg.gz',
  tgz: 'tar.gz',
  taz: 'tar.gz',
  tz: 'tar.gz',
  tbz2: 'tar.bz2',
  txz: 'tar.xz',
};

/**
 * Guess a content type from a key's extension, or `undefined` if unknown.
 *
 * A compressed file (`app.js.gz`) gets one of two types, depending on what the deployment
 * declares as `Content-Encoding`:
 *
 * - **Declared, and it matches the suffix**: the type of what is inside (`text/javascript`).
 *   A client undoes the encoding transparently and then reads the file by its type.
 * - **Otherwise**: the type of the archive itself (`application/gzip`). Without the
 *   encoding header the client receives the compressed bytes, so that is what they are.
 *
 * The AWS CLI always did the former, which mislabels a `.gz` deployed for download.
 *
 * `Content-Encoding` is set on every object of a deployment alike, and nothing here
 * compresses anything. So the only correct use of it is a deployment in which every file
 * was already compressed with that encoding before it was packaged; on any other file it
 * tells clients to decode bytes that are not encoded.
 */
export function guessContentType(key: string, contentEncoding?: string): string | undefined {
  let [stem, ext] = splitExtension(key.slice(key.lastIndexOf('/') + 1));
  const alias = ext === undefined ? undefined : SUFFIX_ALIASES[ext.toLowerCase()];
  if (alias !== undefined) {
    [stem, ext] = splitExtension(`${stem}.${alias}`);
  }
  if (ext === undefined) { return undefined; }

  // `.Z` and `.z` are different formats, so the exact spelling is tried first.
  const compression = COMPRESSION_SUFFIXES[ext] ?? (ext === 'z' ? undefined : COMPRESSION_SUFFIXES[ext.toLowerCase()]);
  if (compression) {
    if (contentEncoding?.trim().toLowerCase() !== compression.encoding) {
      return compression.archiveType;
    }
    [, ext] = splitExtension(stem);
    if (ext === undefined) { return undefined; }
  }

  return CONTENT_TYPES[ext.toLowerCase()];
}

/** Split off the last extension, ignoring a leading dot (`.bashrc` has none). */
function splitExtension(name: string): [string, string | undefined] {
  const dot = name.lastIndexOf('.');
  if (dot <= 0) { return [name, undefined]; }
  return [name.slice(0, dot), name.slice(dot + 1)];
}
