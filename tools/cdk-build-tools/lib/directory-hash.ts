import crypto = require('crypto');
import fs = require('fs');
import path = require('path');

/**
 * Calculate a hash of the given directory
 */
export function calculateDirectoryHash(directory: string, options: FolderHashOptions = {}): string {
    const hash = crypto.createHash('sha1');

    function walk(dir: string) {
        const entries = fs.readdirSync(dir);
        entries.sort();

        for (const fileName of entries) {
            if (fileName.startsWith('.') && !options.includeHidden) { continue; }
            const fullPath = path.join(dir, fileName);

            const stat = fs.statSync(fullPath);
            if (stat.isFile()) {
                hash.update(fullPath + '|');
                hash.update(fs.readFileSync(fullPath) + '|');
            } else if (stat.isDirectory()) {
                const recurse = !options.dontRecurse || options.dontRecurse.indexOf(fileName) === -1;
                if (recurse) {
                    walk(fullPath);
                }
            }
        }
    }

    walk(directory);

    return hash.digest('hex');
}

export interface FolderHashOptions {
    /**
     * Directories to not recurse into
     */
    dontRecurse?: string[];

    /**
     * Whether include hidden files in the hash
     *
     * @default false
     */
    includeHidden?: boolean;
}

/**
 * Calculate the folder hash and see if it changed since the last build
 */
export class DirectoryChangeDetector {
    private readonly markerFileName: string;

    constructor(private directory: string, private options: FolderHashOptions = {}) {
        this.markerFileName = path.join(directory, '.LAST_BUILD');
    }

    /**
     * Return whether the folder hash changed since last time
     */
    public isChanged() {
        const marker = fileContents(this.markerFileName);
        if (marker === undefined) { return true; }
        return marker !== calculateDirectoryHash(this.directory, this.options);
    }

    public markClean() {
        const hash = calculateDirectoryHash(this.directory, this.options);
        fs.writeFileSync(this.markerFileName, hash, { encoding: 'utf-8' });
    }
}

/**
 * Return actual file contents or undefined if not exists
 */
function fileContents(fileName: string): string | undefined {
    if (!fs.existsSync(fileName)) { return undefined; }
    return fs.readFileSync(fileName, { encoding: 'utf-8' });
}
