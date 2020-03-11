import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import { debug } from '../../logging';
import { Account } from './sdk-provider';

/**
 * Disk cache which maps access key IDs to account IDs.
 * Usage:
 *   cache.get(accessKey) => accountId | undefined
 *   cache.put(accessKey, accountId)
 */
export class AccountAccessKeyCache {
  /**
   * Max number of entries in the cache, after which the cache will be reset.
   */
  public static readonly MAX_ENTRIES = 1000;

  private readonly cacheFile: string;

  /**
   * @param filePath Path to the cache file
   */
  constructor(filePath?: string) {
    this.cacheFile = filePath || path.join(os.homedir(), '.cdk', 'cache', 'accounts_partitions.json');
  }

  /**
   * Tries to fetch the account ID from cache. If it's not in the cache, invokes
   * the resolver function which should retrieve the account ID and return it.
   * Then, it will be stored into disk cache returned.
   *
   * Example:
   *
   *    const accountId = cache.fetch(accessKey, async () => {
   *      return await fetchAccountIdFromSomewhere(accessKey);
   *    });
   *
   * @param accessKeyId
   * @param resolver
   */
  public async fetch(accessKeyId: string, resolver: () => Promise<Account | undefined>) {
    // try to get account ID based on this access key ID from disk.
    const cached = await this.get(accessKeyId);
    if (cached) {

      debug(`Retrieved account ID ${cached.accountId} from disk cache`);
      return cached;
    }

    // if it's not in the cache, resolve and put in cache.
    const account = await resolver();
    if (account) {
      await this.put(accessKeyId, account);
    }

    return account;
  }

  /** Get the account ID from an access key or undefined if not in cache */
  public async get(accessKeyId: string): Promise<Account | undefined> {
    const map = await this.loadMap();
    return map[accessKeyId];
  }

  /** Put a mapping betweenn access key and account ID */
  public async put(accessKeyId: string, account: Account) {
    let map = await this.loadMap();

    // nuke cache if it's too big.
    if (Object.keys(map).length >= AccountAccessKeyCache.MAX_ENTRIES) {
      map = { };
    }

    map[accessKeyId] = account;
    await this.saveMap(map);
  }

  private async loadMap(): Promise<{ [accessKeyId: string]: Account }> {
    if (!(await fs.pathExists(this.cacheFile))) {
      return { };
    }

    return await fs.readJson(this.cacheFile);
  }

  private async saveMap(map: { [accessKeyId: string]: Account }) {
    if (!(await fs.pathExists(this.cacheFile))) {
      await fs.mkdirs(path.dirname(this.cacheFile));
    }

    await fs.writeJson(this.cacheFile, map, { spaces: 2 });
  }
}
