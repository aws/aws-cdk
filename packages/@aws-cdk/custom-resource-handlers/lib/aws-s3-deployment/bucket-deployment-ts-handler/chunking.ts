/**
 * Making a stream's chunk sizes acceptable to S3.
 *
 * When the SDK attaches a trailing checksum to a streaming upload it wraps the body in
 * `aws-chunked` framing, and it emits **one frame per chunk the source stream produces**.
 * S3 rejects any frame below 8192 bytes other than the last one, with
 * `InvalidChunkSizeError`.
 *
 * That makes chunk sizes part of the upload's correctness, even though nothing about the
 * content depends on them. A stream read from an S3 response is the problem case: its
 * chunks follow network framing, so a 1 MiB object arrives as a long alternation of 16 KiB
 * and ~1 KiB pieces, and half of them are too small. Streams read from a local file happen
 * to be safe today, because zlib and the archive reader both use buffers well above 8 KiB,
 * but that is their implementation detail rather than a promise to us.
 *
 * So every streaming body is re-chunked on the way out. Content and total length are
 * untouched; only the boundaries move.
 */
import { Readable } from 'stream';

/**
 * Bytes to accumulate before emitting a chunk.
 *
 * Only 8192 is required. 64 KiB is used instead to keep the number of frames — and the
 * per-frame overhead in the signed body — low, and to match the block size the underlying
 * file reads already produce, so that the common case passes chunks straight through
 * instead of copying them.
 */
const BLOCK_SIZE = 64 * 1024;

/**
 * The same bytes, in chunks S3 will accept.
 *
 * Every chunk but the last is at least `blockSize` bytes. The last carries whatever is
 * left, which is what the final frame is allowed to do.
 */
export function rechunk(source: Readable, blockSize: number = BLOCK_SIZE): Readable {
  return Readable.from(inBlocks(source, blockSize), { objectMode: false });
}

async function* inBlocks(source: Readable, blockSize: number): AsyncGenerator<Buffer> {
  let pending: Buffer[] = [];
  let pendingBytes = 0;

  for await (const chunk of source) {
    const buffer = typeof chunk === 'string' ? Buffer.from(chunk, 'utf-8') : chunk as Buffer;
    if (buffer.length === 0) { continue; }

    // A chunk that is already big enough goes out on its own, so a well-behaved source is
    // forwarded without copying. It can only do that once nothing is being held back,
    // otherwise the bytes would be reordered.
    if (pendingBytes === 0 && buffer.length >= blockSize) {
      yield buffer;
      continue;
    }

    pending.push(buffer);
    pendingBytes += buffer.length;

    if (pendingBytes >= blockSize) {
      yield Buffer.concat(pending);
      pending = [];
      pendingBytes = 0;
    }
  }

  if (pendingBytes > 0) {
    yield Buffer.concat(pending);
  }
}
