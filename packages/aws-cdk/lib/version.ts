import * as path from 'path';
import * as chalk from 'chalk';
import * as fs from 'fs-extra';
import * as semver from 'semver';
import { cdkCacheDir, rootDir } from './util/directories';
import { getLatestVersionFromNpm } from './util/npm';
import { debug, print } from '../lib/logging';
import { formatAsBanner } from '../lib/util/console-formatters';

const ONE_DAY_IN_SECONDS = 1 * 24 * 60 * 60;

const UPGRADE_DOCUMENTATION_LINKS: Record<number, string> = {
  1: 'https://docs.aws.amazon.com/cdk/v2/guide/migrating-v2.html',
};

export const DISPLAY_VERSION = `${versionNumber()} (build ${commit()})`;

export function versionNumber(): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(path.join(rootDir(), 'package.json')).version.replace(/\+[0-9a-f]+$/, '');
}

function commit(): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(path.join(rootDir(), 'build-info.json')).commit;
}

export class VersionCheckTTL {
  public static timestampFilePath(): string {
    // Using the same path from account-cache.ts
    return path.join(cdkCacheDir(), 'repo-version-ttl');
  }

  private readonly file: string;

  // File modify times are accurate only to the second
  private readonly ttlSecs: number;

  constructor(file?: string, ttlSecs?: number) {
    this.file = file || VersionCheckTTL.timestampFilePath();
    try {
      fs.mkdirsSync(path.dirname(this.file));
      fs.accessSync(path.dirname(this.file), fs.constants.W_OK);
    } catch {
      throw new Error(`Directory (${path.dirname(this.file)}) is not writable.`);
    }
    this.ttlSecs = ttlSecs || ONE_DAY_IN_SECONDS;
  }

  public async hasExpired(): Promise<boolean> {
    try {
      const lastCheckTime = (await fs.stat(this.file)).mtimeMs;
      const today = new Date().getTime();

      if ((today - lastCheckTime) / 1000 > this.ttlSecs) { // convert ms to sec
        return true;
      }
      return false;
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        return true;
      } else {
        throw err;
      }
    }
  }

  public async update(latestVersion?: string): Promise<void> {
    if (!latestVersion) {
      latestVersion = '';
    }
    await fs.writeFile(this.file, latestVersion);
  }
}

// Export for unit testing only.
// Don't use directly, use displayVersionMessage() instead.
export async function latestVersionIfHigher(currentVersion: string, cacheFile: VersionCheckTTL): Promise<string|null> {
  if (!(await cacheFile.hasExpired())) {
    return null;
  }

  const latestVersion = await getLatestVersionFromNpm();
  const isNewer = semver.gt(latestVersion, currentVersion);
  await cacheFile.update(latestVersion);

  if (isNewer) {
    return latestVersion;
  } else {
    return null;
  }
}

function getMajorVersionUpgradeMessage(currentVersion: string): string | void {
  const currentMajorVersion = semver.major(currentVersion);
  if (UPGRADE_DOCUMENTATION_LINKS[currentMajorVersion]) {
    return `Information about upgrading from version ${currentMajorVersion}.x to version ${currentMajorVersion + 1}.x is available here: ${UPGRADE_DOCUMENTATION_LINKS[currentMajorVersion]}`;
  }
}

function getVersionMessage(currentVersion: string, laterVersion: string): string[] {
  return [
    `Newer version of CDK is available [${chalk.green(laterVersion as string)}]`,
    getMajorVersionUpgradeMessage(currentVersion),
    'Upgrade recommended (npm install -g aws-cdk)',
  ].filter(Boolean) as string[];
}

export async function displayVersionMessage(currentVersion = versionNumber(), versionCheckCache?: VersionCheckTTL): Promise<void> {
  if (!process.stdout.isTTY || process.env.CDK_DISABLE_VERSION_CHECK) {
    return;
  }

  try {
    const laterVersion = await latestVersionIfHigher(currentVersion, versionCheckCache ?? new VersionCheckTTL());
    if (laterVersion) {
      const bannerMsg = formatAsBanner(getVersionMessage(currentVersion, laterVersion));
      bannerMsg.forEach((e) => print(e));
    }
  } catch (err: any) {
    debug(`Could not run version check - ${err.message}`);
  }
}
