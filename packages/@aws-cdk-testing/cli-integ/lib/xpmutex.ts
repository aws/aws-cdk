import { watch, promises as fs, mkdirSync } from 'fs';
import * as os from 'os';
import * as path from 'path';

export class XpMutexPool {
  public static fromDirectory(directory: string) {
    mkdirSync(directory, { recursive: true });
    return new XpMutexPool(directory);
  }

  public static fromName(name: string) {
    return XpMutexPool.fromDirectory(path.join(os.tmpdir(), name));
  }

  private readonly waitingResolvers = new Set<() => void>();
  private watcher: ReturnType<typeof watch> | undefined;

  private constructor(public readonly directory: string) {
    this.startWatch();
  }

  public mutex(name: string) {
    return new XpMutex(this, name);
  }

  /**
   * Await an unlock event
   *
   * (An unlock event is when a file in the directory gets deleted, with a tiny
   * random sleep attached to it).
   */
  public awaitUnlock(maxWaitMs?: number): Promise<void> {
    const wait = new Promise<void>(ok => {
      this.waitingResolvers.add(async () => {
        await randomSleep(10);
        ok();
      });
    });

    if (maxWaitMs) {
      return Promise.race([wait, sleep(maxWaitMs)]);
    } else {
      return wait;
    }
  }

  private startWatch() {
    this.watcher = watch(this.directory);
    (this.watcher as any).unref(); // @types doesn't know about this but it exists
    this.watcher.on('change', async (eventType, fname) => {
      // Only trigger on 'deletes'.
      // After receiving the event, we check if the file exists.
      // - If no: the file was deleted! Huzzah, this counts as a wakeup.
      // - If yes: either the file was just created (in which case we don't need to wakeup)
      //   or the event was due to a delete but someone raced us to it and claimed the
      //   file already (in which case we also don't need to wake up).
      if (eventType === 'rename' && !await fileExists(path.join(this.directory, fname.toString()))) {
        this.notifyWaiters();
      }
    });
    this.watcher.on('error', async (e) => {
      // eslint-disable-next-line no-console
      console.error(e);
      await randomSleep(100);
      this.startWatch();
    });
  }

  private notifyWaiters() {
    for (const promise of this.waitingResolvers) {
      promise();
    }
    this.waitingResolvers.clear();
  }
}

/**
 * Cross-process mutex
 *
 * Uses the presence of a file on disk and `fs.watch` to represent the mutex
 * and discover unlocks.
 */
export class XpMutex {
  private readonly fileName: string;

  constructor(private readonly pool: XpMutexPool, public readonly mutexName: string) {
    this.fileName = path.join(pool.directory, `${mutexName}.mutex`);
  }

  /**
   * Try to acquire the lock (may fail)
   */
  public async tryAcquire(): Promise<ILock | undefined> {
    while (true) {
      // Acquire lock by being the one to create the file
      try {
        return await this.writePidFile('wx'); // Fails if the file already exists
      } catch (e: any) {
        if (e.code !== 'EEXIST') { throw e; }
      }

      // File already exists. Read the contents, see if it's an existent PID (if so, the lock is taken)
      const ownerPid = await this.readPidFile();
      if (ownerPid === undefined) {
        // File got deleted just now, maybe we can acquire it again
        continue;
      }
      if (processExists(ownerPid)) {
        return undefined;
      }

      // If not, the lock is stale and will never be released anymore. We may
      // delete it and acquire it anyway, but we may be racing someone else trying
      // to do the same. Solve this as follows:
      // - Try to acquire a lock that gives us permissions to declare the existing lock stale.
      // - Sleep a small random period to reduce contention on this operation
      await randomSleep(10);
      const innerMux = new XpMutex(this.pool, `${this.mutexName}.${ownerPid}`);
      const innerLock = await innerMux.tryAcquire();
      if (!innerLock) {
        return undefined;
      }

      // We may not release the 'inner lock' we used to acquire the rights to declare the other
      // lock stale until we release the actual lock itself. If we did, other contenders might
      // see it released while they're still in this fallback block and accidentally steal
      // from a new legitimate owner.
      return this.writePidFile('w', innerLock); // Force write lock file, attach inner lock as well
    }
  }

  /**
   * Acquire the lock, waiting until we can
   */
  public async acquire(): Promise<ILock> {
    while (true) {
      // Start the wait here, so we don't miss the signal if it comes after
      // we try but before we sleep.
      //
      // We also periodically retry anyway since we may have missed the delete
      // signal due to unfortunate timing.
      const wait = this.pool.awaitUnlock(5000);

      const lock = await this.tryAcquire();
      if (lock) {
        // Ignore the wait (count as handled)
        wait.then(() => {}, () => {});
        return lock;
      }

      await wait;
      await randomSleep(100);
    }
  }

  private async readPidFile(): Promise<number | undefined> {
    const deadLine = Date.now() + 1000;
    while (Date.now() < deadLine) {
      let contents;
      try {
        contents = await fs.readFile(this.fileName, { encoding: 'utf-8' });
      } catch (e: any) {
        if (e.code === 'ENOENT') { return undefined; }
        throw e;
      }

      // Retry until we've seen the full contents
      if (contents.endsWith('.')) { return parseInt(contents.substring(0, contents.length - 1), 10); }
      await sleep(10);
    }

    throw new Error(`${this.fileName} was never completely written`);
  }

  private async writePidFile(mode: string, additionalLock?: ILock): Promise<ILock> {
    const fd = await fs.open(this.fileName, mode); // May fail if the file already exists
    await fd.write(`${process.pid}.`); // Period guards against partial reads
    await fd.close();

    return {
      release: async () => {
        await fs.unlink(this.fileName);
        await additionalLock?.release();
      },
    };
  }
}

export interface ILock {
  release(): Promise<void>;
}

async function fileExists(fileName: string) {
  try {
    await fs.stat(fileName);
    return true;
  } catch (e: any) {
    if (e.code === 'ENOENT') { return false; }
    throw e;
  }
}

function processExists(pid: number) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(ok => (setTimeout(ok, ms) as any).unref());
}

function randomSleep(ms: number) {
  return sleep(Math.floor(Math.random() * ms));
}
