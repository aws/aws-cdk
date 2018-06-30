import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';

/**
 * Disk cache which maps access key IDs to account IDs.
 * Usage:
 *   cache.get(accessKey) => accountId | undefined
 *   cache.put(accessKey, accountId)
 */
export class AccountAccessKeyCache {
    private readonly cacheFile: string;

    /**
     * @param filePath Path to the cache file
     */
    constructor(filePath?: string) {
        this.cacheFile = filePath || path.join(os.homedir(), '.cdk/cache/accounts.json');
    }

    /** Get the account ID from an access key or undefined if not in cache */
    public async get(accessKeyId: string) {
        const map = await this.loadMap();
        return map[accessKeyId];
    }

    /** Put a mapping betweenn access key and account ID */
    public async put(accessKeyId: string, accountId: string) {
        const map = await this.loadMap();
        map[accessKeyId] = accountId;
        await this.saveMap(map);
    }

    private async loadMap() {
        if (!(await fs.pathExists(this.cacheFile))) {
            return { };
        }

        return await fs.readJson(this.cacheFile);
    }

    private async saveMap(map: { [accessKeyId: string]: string }) {
        if (!(await fs.pathExists(this.cacheFile))) {
            await fs.mkdirs(path.dirname(this.cacheFile));
        }

        await fs.writeJson(this.cacheFile, map, { spaces: 2 });
    }
}