import crypto = require('crypto');
import fs = require('fs-extra');
import path = require('path');
import { atomicRead, atomicWrite  } from './file-ops';

/**
 * Calculate a hash of the given file or directory
 */
export async function calculateHash(fileOrDirectory: string, options: MerkleOptions = {}): Promise<string> {
  const cache = new HashCache();

  const ignore = options.ignore || [];

  async function calculate(fileName: string): Promise<string> {
    fileName = await absolutePath(fileName);

    const stat = await fs.stat(fileName);
    if (stat.isFile()) {
      // Hash of a file is the hash of the contents.
      //
      // We don't use the cache since we never hit the same file twice.
      const hash = crypto.createHash('sha1');
      hash.update(await fs.readFile(fileName));
      return hash.digest('hex');
    } else {
      // Hash of a directory is the hash of an entry table.
      //
      // We do use the cache since we could encounter the same directory
      // multiple times through symlinks.
      const cachedHash = await cache.get(fileName);
      if (cachedHash !== undefined) { return cachedHash; }
      cache.markCalculating(fileName);

      const hash = crypto.createHash('sha1');
      for (const entry of await fs.readdir(fileName)) {
        if (entry.startsWith('.') && !options.includeHidden) { continue; }
        if (ignore.indexOf(entry) !== -1) { continue; }
        hash.update(entry);
        hash.update("|");
        hash.update(await calculate(path.join(fileName, entry)));
        hash.update("|");
      }

      const hashString = hash.digest('hex');
      await cache.store(fileName, hashString);
      return hashString;
    }
  }

  return calculate(fileOrDirectory);
}

/**
 * Return the absolute path of a file, resolving symlinks if it's a symlink
 *
 * NOTE: This does not resolve symlinks in the middle of the absolute path.
 */
async function absolutePath(fileName: string): Promise<string> {
  const stat = await fs.lstat(fileName);
  if (!stat.isSymbolicLink()) { return path.resolve(fileName); }
  const link = await fs.readlink(fileName);
  return path.resolve(path.dirname(fileName), link);
}

export interface MerkleOptions {
  /**
   * Files/directories to not include in hash
   */
  ignore?: string[];

  /**
   * Whether include hidden files in the hash
   *
   * @default false
   */
  includeHidden?: boolean;
}

/**
 * This value is put into the cache if we are currently calculating a directory hash
 *
 * This is used to detect symlink cycles.
 */
const CALCULATING_MARKER = '*calculating*';

/**
 * Hash cache
 *
 * Because of monorepo symlinks, it's expected that we'll encounter the
 * same directory more than once. We store the hash of already-visited
 * directories in the cache to save time.
 *
 * At the same time, we use the cache for cycle detection.
 *
 * In principle this cache is in memory, but it can be persisted to
 * disk if an environment variable point to a directory is set.
 */
class HashCache {
  private readonly cache: {[fileName: string]: string} = {};
  private readonly persistentCacheDir?: string;

  public constructor() {
    this.persistentCacheDir = process.env.MERKLE_BUILD_CACHE;
  }

  public async get(fullPath: string): Promise<string | undefined> {
    if (this.cache[fullPath] === CALCULATING_MARKER) {
      throw new Error(`${fullPath}: symlink loop detected, cannot calculate directory hash`);
    }

    if (fullPath in this.cache) {
      return this.cache[fullPath];
    }

    if (this.persistentCacheDir) {
      return await atomicRead(path.join(this.persistentCacheDir, safeFileName(fullPath)));
    }

    return undefined;
  }

  public async store(fullPath: string, hash: string): Promise<void> {
    this.cache[fullPath] = hash;

    if (this.persistentCacheDir) {
      await atomicWrite(path.join(this.persistentCacheDir, safeFileName(fullPath)), hash);
    }
  }

  public markCalculating(fullPath: string) {
    this.cache[fullPath] = CALCULATING_MARKER;
  }
}

/**
 * Make a filename that's safe to store on disk
 *
 * Typically the full path name is too long so we take the end
 * and append a hash for the whole name.
 */
function safeFileName(fileName: string) {
  const h = crypto.createHash('sha1');
  h.update(fileName);

  const encodedName = encodeURIComponent(fileName);

  const maxLength = 150;
  return encodedName.substr(Math.max(0, encodedName.length - maxLength)) + h.digest('hex');
}
