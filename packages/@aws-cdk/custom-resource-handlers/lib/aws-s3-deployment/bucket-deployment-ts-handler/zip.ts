/**
 * Minimal ZIP reader.
 *
 * Deliberately dependency-free: the handler is bundled with esbuild and marks `@aws-sdk/*`
 * external, so every other import is inlined into the Lambda artifact. A ~150-line reader
 * is cheaper than taking on a zip library.
 *
 * Supports the two compression methods anything in the CDK asset pipeline produces:
 * stored (0) and deflate (8). ZIP64 is handled for the common case of a >64K-entry or
 * >4 GiB archive only insofar as the central directory locator is read; archives that
 * large do not fit in a Lambda's memory anyway, so an explicit error is better than a
 * silent truncation.
 */
import * as zlib from 'zlib';

const EOCD_SIGNATURE = 0x06054b50;
const EOCD64_LOCATOR_SIGNATURE = 0x07064b50;
const CENTRAL_FILE_HEADER_SIGNATURE = 0x02014b50;

/** One file from an archive. Directory entries are not returned. */
export interface ZipEntry {
  /** Path as recorded in the archive, before any sanitization. */
  readonly rawPath: string;

  /** Uncompressed contents. */
  readonly contents: Buffer;
}

/**
 * Read every file entry from a zip archive held in memory.
 *
 * Directory entries are skipped, so callers never have to distinguish them.
 */
export function readZip(archive: Buffer): ZipEntry[] {
  const centralDirectoryOffset = findCentralDirectory(archive);

  const entries: ZipEntry[] = [];
  let offset = centralDirectoryOffset;

  while (offset + 46 <= archive.length && archive.readUInt32LE(offset) === CENTRAL_FILE_HEADER_SIGNATURE) {
    const compressionMethod = archive.readUInt16LE(offset + 10);
    const compressedSize = archive.readUInt32LE(offset + 20);
    const uncompressedSize = archive.readUInt32LE(offset + 24);
    const nameLength = archive.readUInt16LE(offset + 28);
    const extraLength = archive.readUInt16LE(offset + 30);
    const commentLength = archive.readUInt16LE(offset + 32);
    const localHeaderOffset = archive.readUInt32LE(offset + 42);

    const rawPath = archive.subarray(offset + 46, offset + 46 + nameLength).toString('utf-8');

    if (compressedSize === 0xffffffff || uncompressedSize === 0xffffffff || localHeaderOffset === 0xffffffff) {
      throw new Error(`zip entry '${rawPath}' uses ZIP64 extensions, which are not supported`);
    }

    // A trailing separator is the canonical directory marker; a zero-length entry whose
    // name ends in `/` is a directory however the producer flagged it.
    const isDirectory = rawPath.endsWith('/');

    if (!isDirectory) {
      entries.push({
        rawPath,
        contents: readLocalFile(archive, localHeaderOffset, compressionMethod, compressedSize, uncompressedSize, rawPath),
      });
    }

    offset += 46 + nameLength + extraLength + commentLength;
  }

  return entries;
}

/**
 * Locate the start of the central directory.
 *
 * The end-of-central-directory record is at the tail of the file but is variable-length
 * (it carries an optional comment), so it has to be found by scanning backwards for its
 * signature.
 */
function findCentralDirectory(archive: Buffer): number {
  const minEocdSize = 22;
  if (archive.length < minEocdSize) {
    throw new Error('not a zip archive: too short to contain an end-of-central-directory record');
  }

  // The comment is at most 64 KiB, so the signature cannot be further back than that.
  const searchStart = Math.max(0, archive.length - minEocdSize - 0xffff);
  for (let i = archive.length - minEocdSize; i >= searchStart; i--) {
    if (archive.readUInt32LE(i) !== EOCD_SIGNATURE) { continue; }

    const offset = archive.readUInt32LE(i + 16);
    if (offset === 0xffffffff) {
      // ZIP64: the real offset lives in the ZIP64 end-of-central-directory record.
      throw new Error('ZIP64 archives are not supported');
    }
    return offset;
  }

  // A ZIP64 locator without a classic EOCD means we cannot proceed; say so explicitly
  // rather than reporting "not a zip archive".
  for (let i = archive.length - 20; i >= searchStart; i--) {
    if (i >= 0 && archive.readUInt32LE(i) === EOCD64_LOCATOR_SIGNATURE) {
      throw new Error('ZIP64 archives are not supported');
    }
  }

  throw new Error('not a zip archive: no end-of-central-directory record found');
}

/** Read and decompress one entry's payload, starting from its local file header. */
function readLocalFile(
  archive: Buffer,
  localHeaderOffset: number,
  compressionMethod: number,
  compressedSize: number,
  uncompressedSize: number,
  rawPath: string,
): Buffer {
  if (localHeaderOffset + 30 > archive.length) {
    throw new Error(`zip entry '${rawPath}' has a local header beyond the end of the archive`);
  }

  // The local header repeats the name and extra fields, and its extra-field length can
  // differ from the central directory's, so it must be read from the local header itself.
  const nameLength = archive.readUInt16LE(localHeaderOffset + 26);
  const extraLength = archive.readUInt16LE(localHeaderOffset + 28);
  const dataStart = localHeaderOffset + 30 + nameLength + extraLength;
  const data = archive.subarray(dataStart, dataStart + compressedSize);

  switch (compressionMethod) {
    case 0:
      return Buffer.from(data);
    case 8: {
      const inflated = zlib.inflateRawSync(data);
      if (inflated.length !== uncompressedSize) {
        throw new Error(
          `zip entry '${rawPath}' decompressed to ${inflated.length} bytes, expected ${uncompressedSize}`,
        );
      }
      return inflated;
    }
    default:
      throw new Error(`zip entry '${rawPath}' uses unsupported compression method ${compressionMethod}`);
  }
}

/**
 * Normalize an archive entry path so it cannot escape the destination prefix.
 *
 * Mirrors what Python's `ZipFile.extractall` does, which is the behavior the contract
 * describes (§5): leading separators and `..` components are discarded. Returns
 * `undefined` for a path that normalizes away to nothing.
 */
export function sanitizeEntryPath(rawPath: string): string | undefined {
  const parts = rawPath
    // Windows-style separators appear in archives produced on Windows.
    .replace(/\\/g, '/')
    .split('/')
    .filter((part) => part !== '' && part !== '.' && part !== '..');

  return parts.length > 0 ? parts.join('/') : undefined;
}
