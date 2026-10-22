/**
 * Test helpers: a minimal ZIP *writer* and a CloudFormation event builder.
 *
 * The writer is deliberately independent of the handler's reader — writing the bytes by
 * hand here means the reader is tested against the format rather than against a shared
 * helper, and it keeps the package free of another dependency. It emits both stored and
 * deflated entries so the reader's decompression path is covered.
 */
import * as zlib from 'zlib';

export interface ZipEntrySpec {
  readonly path: string;
  readonly body: string | Buffer;
  /** `store` writes the bytes as-is, `deflate` compresses them. */
  readonly method?: 'store' | 'deflate';
}

const LOCAL_HEADER_SIGNATURE = 0x04034b50;
const CENTRAL_HEADER_SIGNATURE = 0x02014b50;
const EOCD_SIGNATURE = 0x06054b50;

/**
 * Build a zip archive.
 *
 * `directories` are written as zero-length entries whose names end in `/`, which is how
 * real archivers record them.
 */
export function buildZip(
  entries: ZipEntrySpec[],
  options: { directories?: string[] } = {},
): Buffer {
  const all: ZipEntrySpec[] = [
    ...(options.directories ?? []).map((path) => ({ path, body: Buffer.alloc(0), method: 'store' as const })),
    ...entries,
  ];

  const locals: Buffer[] = [];
  const centrals: Buffer[] = [];
  let offset = 0;

  for (const entry of all) {
    const name = Buffer.from(entry.path, 'utf-8');
    const raw = typeof entry.body === 'string' ? Buffer.from(entry.body, 'utf-8') : entry.body;
    const deflate = (entry.method ?? 'deflate') === 'deflate' && raw.length > 0;
    const payload = deflate ? zlib.deflateRawSync(raw) : raw;
    const method = deflate ? 8 : 0;
    const crc = crc32(raw);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(LOCAL_HEADER_SIGNATURE, 0);
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0, 6); // flags
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(0, 10); // mod time
    local.writeUInt16LE(0x21, 12); // mod date (1980-01-01)
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(payload.length, 18);
    local.writeUInt32LE(raw.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28); // extra length
    locals.push(local, name, payload);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(CENTRAL_HEADER_SIGNATURE, 0);
    central.writeUInt16LE(20, 4); // version made by
    central.writeUInt16LE(20, 6); // version needed
    central.writeUInt16LE(0, 8); // flags
    central.writeUInt16LE(method, 10);
    central.writeUInt16LE(0, 12);
    central.writeUInt16LE(0x21, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(payload.length, 20);
    central.writeUInt32LE(raw.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt16LE(0, 30); // extra
    central.writeUInt16LE(0, 32); // comment
    central.writeUInt16LE(0, 34); // disk start
    central.writeUInt16LE(0, 36); // internal attrs
    central.writeUInt32LE(0, 38); // external attrs
    central.writeUInt32LE(offset, 42);
    centrals.push(central, name);

    offset += local.length + name.length + payload.length;
  }

  const centralDirectory = Buffer.concat(centrals);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(EOCD_SIGNATURE, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(all.length, 8);
  eocd.writeUInt16LE(all.length, 10);
  eocd.writeUInt32LE(centralDirectory.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...locals, centralDirectory, eocd]);
}

/**
 * Rewrite an entry name in a finished archive.
 *
 * The writer refuses nothing, but keeping this helper mirrors how a hostile archive is
 * produced in the integration suite: names appear verbatim in both the local and central
 * headers, and an equal-length rename needs no offset fixups.
 */
export function renameEntry(zip: Buffer, from: string, to: string): Buffer {
  if (Buffer.byteLength(from) !== Buffer.byteLength(to)) {
    throw new Error('renameEntry needs equal byte lengths');
  }
  const result = Buffer.from(zip);
  const search = Buffer.from(from, 'utf-8');
  const replace = Buffer.from(to, 'utf-8');

  for (let i = 0; i <= result.length - search.length; i++) {
    if (result.subarray(i, i + search.length).equals(search)) {
      replace.copy(result, i);
      i += search.length - 1;
    }
  }
  return result;
}

/**
 * CRC-32, as the zip format records it.
 *
 * Node exposes a native implementation from v22.2. The handler's reader does not verify
 * checksums, so a zero on an older runtime is harmless here; it would only matter if these
 * fixtures were fed to a real unzip.
 */
function crc32(buffer: Buffer): number {
  const native = (zlib as any).crc32;
  return typeof native === 'function' ? native(buffer) : 0;
}

/** Build a CloudFormation custom-resource event. */
export function cfnEvent(
  requestType: 'Create' | 'Update' | 'Delete',
  properties: Record<string, any>,
  extra: {
    physicalResourceId?: string;
    omitPhysicalResourceId?: boolean;
    oldProperties?: Record<string, any>;
    requestId?: string;
  } = {},
): any {
  const event: any = {
    RequestType: requestType,
    RequestId: extra.requestId ?? 'req-0000',
    StackId: 'arn:aws:cloudformation:us-east-1:123456789012:stack/test/abc',
    LogicalResourceId: 'Deployment',
    ResponseURL: 'https://cloudformation-custom-resource-response.example.com/abc?X-Amz-Signature=redacted',
    ResourceType: 'Custom::CDKBucketDeployment',
    ServiceToken: 'arn:aws:lambda:us-east-1:123456789012:function:provider',
    ResourceProperties: { ServiceToken: 'arn:aws:lambda:...', ...properties },
  };

  if (requestType !== 'Create' && !extra.omitPhysicalResourceId) {
    event.PhysicalResourceId = extra.physicalResourceId ?? 'aws.cdk.s3deployment.existing';
  }
  if (extra.oldProperties) {
    event.OldResourceProperties = { ServiceToken: 'arn:aws:lambda:...', ...extra.oldProperties };
  }

  return event;
}
