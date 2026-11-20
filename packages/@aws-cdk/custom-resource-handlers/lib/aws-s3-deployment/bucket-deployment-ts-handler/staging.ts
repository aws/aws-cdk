/**
 * Turning one source of a request into the files it wants deployed.
 *
 * The point of this module is that nothing here reads an object's or an entry's *contents*.
 * Each candidate file knows enough about itself to be filtered and skip-checked, and hands
 * out its bytes only once something has decided it needs them, via `openStream()`.
 *
 * Sources are handled one at a time so that only one archive occupies scratch space.
 */
import { createWriteStream } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';
import type { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import type { S3 } from '@aws-sdk/client-s3';
import * as yauzl from 'yauzl';
import type { S3ObjectSet } from './file-set';
import type { MarkersConfig } from './markers';
import type { SourceSpec } from './request';

/** A stream plus the length S3 needs in order to sign an upload of it. */
export interface SizedStream {
  readonly body: Readable;
  readonly contentLength: number;
}

/** A file a request wants to move to the destination, not yet read. */
export interface CopyableFile {
  /** Key relative to the destination prefix. */
  readonly relativeKey: string;

  /** Which source it came from, for positional version-id reporting. */
  readonly sourceIndex: number;

  /** Substitutions to apply, empty when there are none. */
  readonly markers: Record<string, unknown>;
  readonly markersConfig?: MarkersConfig;

  /** Whether what is already at the destination makes this file's upload unnecessary. */
  isAlreadyInDestination(destination: S3ObjectSet): boolean;

  /** The file as a stream, for piping into an upload. */
  openStream(): Promise<SizedStream>;
}

/**
 * Describe the files one source wants deployed, and hand them to `block`.
 *
 * Takes care of the source being an expandable archive, or a single file in
 * S3. The `CopyableFile` abstraction hides where the file came from.
 *
 * Non-archives are streamed directly from S3. Archives are streamed from S3 to a
 * scratch directory, then the files are streamed from the on-disk copy.
 * Scoped to a single source so that at most one archive is ever on disk: it is downloaded,
 * used, and deleted before the next source is touched. The files are only valid for the
 * duration of the call — afterwards the archive is closed and its scratch file is gone.
 */
export async function withSourceFiles<A>(
  s3: S3,
  source: SourceSpec,
  sourceIndex: number,
  extract: boolean,
  scratchDirectory: string,
  block: (files: CopyableFile[]) => Promise<A>,
): Promise<A> {
  if (!extract) {
    // Nothing to download or clean up: the object is streamed straight through from
    // an S3 read.
    return block([fileFromS3Object(s3, source, sourceIndex)]);
  }

  const localPath = path.join(scratchDirectory, `source-${sourceIndex}.zip`);
  await downloadToFile(s3, source.bucketName, source.objectKey, localPath);
  try {
    const archive = await yauzl.openPromise(localPath, { autoClose: false });
    try {
      const files = await filesFromArchive(archive, source, sourceIndex);
      return await block(files);
    } finally {
      archive.close();
    }
  } finally {
    await fs.rm(localPath, { force: true }).catch(() => {});
  }
}

async function filesFromArchive(archive: yauzl.ZipFile, source: SourceSpec, sourceIndex: number): Promise<CopyableFile[]> {
  // Walk the central directory, skipping two kinds of entry that do not describe a file to
  // deploy: directory entries, which S3 has no concept of, and earlier entries of a name
  // that occurs more than once. An archive may legally repeat a name, and keeping only the
  // last matches how unzipping overwrites in place — deploying both would instead race
  // them against each other, since the files of one source are uploaded concurrently.
  const entries = new Map<string, yauzl.Entry>();
  for await (const entry of archive.eachEntry()) {
    if (entry.fileName.endsWith('/')) { continue; }
    entries.set(entry.fileName, entry);
  }

  return Array.from(entries.values()).map((entry) => ({
    relativeKey: entry.fileName,
    sourceIndex,
    markers: source.markers,
    markersConfig: source.markersConfig,
    isAlreadyInDestination: (destination) => destination.objectUpToDate(entry.fileName, entry.uncompressedSize, entry.getLastModDate()),
    openStream: async () => ({ body: await archive.openReadStreamPromise(entry), contentLength: entry.uncompressedSize }),
  } satisfies CopyableFile));
}

/**
 * Describe a source object deployed as-is, keyed by its basename.
 *
 * Nothing is fetched here. Such an object is never skipped: the previous implementation
 * downloaded it to a local file whose mtime was therefore "now", which always beat the
 * destination's, so this implementation mimics that behavior.
 *
 * Potentially an optimization we could perform but for now we are mimicking the old
 * behavior.
 */
function fileFromS3Object(s3: S3, source: SourceSpec, sourceIndex: number): CopyableFile {
  return {
    relativeKey: basename(source.objectKey),
    sourceIndex,
    markers: source.markers,
    markersConfig: source.markersConfig,
    isAlreadyInDestination: () => false,
    openStream: () => streamFromS3(s3, source.bucketName, source.objectKey),
  };
}

/** Stream an object to a local file. */
async function downloadToFile(s3: S3, bucketName: string, key: string, localPath: string): Promise<void> {
  const { body } = await streamFromS3(s3, bucketName, key);
  await pipeline(body, createWriteStream(localPath));
}

/** An object's contents as a stream, with its length. */
async function streamFromS3(s3: S3, bucketName: string, key: string): Promise<SizedStream> {
  const response = await s3.getObject({ Bucket: bucketName, Key: key });
  if (!response.Body) {
    throw new Error(`s3://${bucketName}/${key} returned an empty body`);
  }
  // Guessing the length would be worse than failing: a wrong one either truncates the
  // upload or makes S3 reject it. Zero is a real length, so this tests for absence rather
  // than falsiness.
  if (response.ContentLength === undefined) {
    throw new Error(`s3://${bucketName}/${key} returned no content length`);
  }
  return { body: response.Body as Readable, contentLength: response.ContentLength };
}

/** The part of a key after the last separator. */
export function basename(key: string): string {
  return key.slice(key.lastIndexOf('/') + 1);
}
