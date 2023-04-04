import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * A single-writer/multi-reader lock on a directory
 *
 * It uses marker files with PIDs in them as a locking marker; the PIDs will be
 * checked for liveness, so that if the process exits without cleaning up the
 * files the lock is implicitly released.
 *
 * This class is not 100% race safe, but in practice it should be a lot
 * better than the 0 protection we have today.
 */
export class RWLock {
  private readonly pidString: string;
  private readonly writerFile: string;
  private readCounter = 0;

  constructor(public readonly directory: string) {
    this.pidString = `${process.pid}`;

    this.writerFile = path.join(this.directory, 'synth.lock');
  }

  /**
   * Acquire a writer lock.
   *
   * No other readers or writers must exist for the given directory.
   */
  public async acquireWrite(): Promise<IWriterLock> {
    await this.assertNoOtherWriters();

    const readers = await this.currentReaders();
    if (readers.length > 0) {
      throw new Error(`Other CLIs (PID=${readers}) are currently reading from ${this.directory}. Invoke the CLI in sequence, or use '--output' to synth into different directories.`);
    }

    await writeFileAtomic(this.writerFile, this.pidString);

    return {
      release: async () => {
        await deleteFile(this.writerFile);
      },
      convertToReaderLock: async () => {
        // Acquire the read lock before releasing the write lock. Slightly less
        // chance of racing!
        const ret = await this.doAcquireRead();
        await deleteFile(this.writerFile);
        return ret;
      },
    };
  }

  /**
   * Acquire a read lock
   *
   * Will fail if there are any writers.
   */
  public async acquireRead(): Promise<ILock> {
    await this.assertNoOtherWriters();
    return this.doAcquireRead();
  }

  /**
   * Obtains the name fo a (new) `readerFile` to use. This includes a counter so
   * that if multiple threads of the same PID attempt to concurrently acquire
   * the same lock, they're guaranteed to use a different reader file name (only
   * one thread will ever execute JS code at once, guaranteeing the readCounter
   * is incremented "atomically" from the point of view of this PID.).
   */
  private readerFile(): string {
    return path.join(this.directory, `read.${this.pidString}.${++this.readCounter}.lock`);
  }

  /**
   * Do the actual acquiring of a read lock.
   */
  private async doAcquireRead(): Promise<ILock> {
    const readerFile = this.readerFile();
    await writeFileAtomic(readerFile, this.pidString);
    return {
      release: async () => {
        await deleteFile(readerFile);
      },
    };
  }

  private async assertNoOtherWriters() {
    const writer = await this.currentWriter();
    if (writer) {
      throw new Error(`Another CLI (PID=${writer}) is currently synthing to ${this.directory}. Invoke the CLI in sequence, or use '--output' to synth into different directories.`);
    }
  }

  /**
   * Check the current writer (if any)
   */
  private async currentWriter(): Promise<number | undefined> {
    const contents = await readFileIfExists(this.writerFile);
    if (!contents) { return undefined; }

    const pid = parseInt(contents, 10);
    if (!processExists(pid)) {
      // Do cleanup of a stray file now
      await deleteFile(this.writerFile);
      return undefined;
    }

    return pid;
  }

  /**
   * Check the current readers (if any)
   */
  private async currentReaders(): Promise<number[]> {
    const re = /^read\.([^.]+)\.[^.]+\.lock$/;
    const ret = new Array<number>();

    let children;
    try {
      children = await fs.readdir(this.directory, { encoding: 'utf-8' });
    } catch (e: any) {
      // Can't be locked if the directory doesn't exist
      if (e.code === 'ENOENT') { return []; }
      throw e;
    }

    for (const fname of children) {
      const m = fname.match(re);
      if (m) {
        const pid = parseInt(m[1], 10);
        if (processExists(pid)) {
          ret.push(pid);
        } else {
          // Do cleanup of a stray file now
          await deleteFile(path.join(this.directory, fname));
        }
      }
    }
    return ret;
  }
}

/**
 * An acquired lock
 */
export interface ILock {
  release(): Promise<void>;
}

/**
 * An acquired writer lock
 */
export interface IWriterLock extends ILock {
  /**
   * Convert the writer lock to a reader lock
   */
  convertToReaderLock(): Promise<ILock>;
}

async function readFileIfExists(filename: string): Promise<string | undefined> {
  try {
    return await fs.readFile(filename, { encoding: 'utf-8' });
  } catch (e: any) {
    if (e.code === 'ENOENT') { return undefined; }
    throw e;
  }
}

let tmpCounter = 0;
async function writeFileAtomic(filename: string, contents: string): Promise<void> {
  await fs.mkdir(path.dirname(filename), { recursive: true });
  const tmpFile = `${filename}.${process.pid}_${++tmpCounter}`;
  await fs.writeFile(tmpFile, contents, { encoding: 'utf-8' });
  await fs.rename(tmpFile, filename);
}

async function deleteFile(filename: string) {
  try {
    await fs.unlink(filename);
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      return;
    }
    throw e;
  }
}

function processExists(pid: number) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return false;
  }
}
