import * as crypto from 'crypto';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const CACHE_DIR = path.join(os.homedir(), '.cdk', 'cache', 'fingerprints');
const MAX_ENTRIES = 100_000;
const MAX_CACHE_FILES = 50;

/**
 * A per-directory fingerprint cache backed by a JSON file on disk.
 *
 * Each fingerprinted directory gets its own cache file in ~/.cdk/cache/fingerprints/.
 * Entries map file metadata (inode+mtime+size) to content fingerprints.
 */
export class FingerprintDiskCache {
  private cache: Map<string, string> | undefined;
  private dirty = false;
  private cacheFile: string;

  constructor(directoryPath: string) {
    // Derive a stable cache filename from the directory being fingerprinted
    const dirHash = crypto.createHash('sha256').update(directoryPath).digest('hex').slice(0, 16);
    this.cacheFile = path.join(CACHE_DIR, `${dirHash}.json`);
  }

  /**
   * Look up a cached fingerprint or compute it.
   */
  public obtain(cacheKey: string, calcFn: () => string): string {
    const map = this._load();
    const existing = map.get(cacheKey);
    if (existing !== undefined) {
      return existing;
    }

    const value = calcFn();
    map.set(cacheKey, value);
    this.dirty = true;
    return value;
  }

  /**
   * Persist the cache to disk.
   */
  public save() {
    if (!this.dirty || !this.cache) {
      return;
    }

    this._evict();

    try {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
      const entries = Array.from(this.cache.entries());
      fs.writeFileSync(this.cacheFile, JSON.stringify(entries));
      this.dirty = false;
      this._evictCacheDir();
    } catch {
      // Best-effort — don't fail the build if cache can't be written
    }
  }

  private _load(): Map<string, string> {
    if (this.cache) {
      return this.cache;
    }

    this.cache = new Map();
    try {
      const data = fs.readFileSync(this.cacheFile, 'utf-8');
      const entries: Array<[string, string]> = JSON.parse(data);
      if (Array.isArray(entries)) {
        for (const [k, v] of entries) {
          this.cache.set(k, v);
        }
      }
    } catch {
      // Cache file doesn't exist or is corrupt — start fresh
    }

    return this.cache;
  }

  private _evict() {
    if (!this.cache || this.cache.size <= MAX_ENTRIES) {
      return;
    }
    // Keep the most recent half
    const entries = Array.from(this.cache.entries());
    this.cache = new Map(entries.slice(entries.length - MAX_ENTRIES / 2));
  }

  /** Remove oldest cache files if the directory exceeds MAX_CACHE_FILES */
  private _evictCacheDir() {
    try {
      const files = fs.readdirSync(CACHE_DIR)
        .filter(f => f.endsWith('.json'))
        .map(f => ({ name: f, mtime: fs.statSync(path.join(CACHE_DIR, f)).mtimeMs }));

      if (files.length <= MAX_CACHE_FILES) return;

      files.sort((a, b) => a.mtime - b.mtime);
      const toDelete = files.slice(0, files.length - MAX_CACHE_FILES);
      for (const f of toDelete) {
        fs.unlinkSync(path.join(CACHE_DIR, f.name));
      }
    } catch {
      // Best-effort
    }
  }
}
