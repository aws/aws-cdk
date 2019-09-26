import { exec as _exec } from 'child_process';
import colors = require('colors/safe');
import fs = require('fs-extra');
import path = require('path');
import semver = require('semver');
import { promisify } from 'util';
import { debug, print } from '../lib/logging';
import { formatAsBanner } from '../lib/util/console-formatters';
import { getCdkCache } from "./os";

const ONE_DAY_IN_SECONDS = 1 * 24 * 60 * 60;

const exec = promisify(_exec);

export const DISPLAY_VERSION = `${versionNumber()} (build ${commit()})`;

function versionNumber(): string {
  return require('../package.json').version.replace(/\+[0-9a-f]+$/, '');
}

function commit(): string {
  return require('../build-info.json').commit;
}

export class VersionCheckTTL {
  public static timestampFilePath(): string {
    // Using the same path from account-cache.ts
    return path.join(getCdkCache(), 'cache', 'repo-version-ttl');
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
    } catch (err) {
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

  const { stdout, stderr } = await exec(`npm view aws-cdk version`);
  if (stderr && stderr.trim().length > 0) {
    debug(`The 'npm view' command generated an error stream with content [${stderr.trim()}]`);
  }
  const latestVersion = stdout.trim();
  if (!semver.valid(latestVersion)) {
    throw new Error(`npm returned an invalid semver ${latestVersion}`);
  }
  const isNewer = semver.gt(latestVersion, currentVersion);
  await cacheFile.update(latestVersion);

  if (isNewer) {
    return latestVersion;
  } else {
    return null;
  }
}

export async function displayVersionMessage(): Promise<void> {
  if (!process.stdout.isTTY) {
    return;
  }

  try {
    const versionCheckCache = new VersionCheckTTL();
    const laterVersion = await latestVersionIfHigher(versionNumber(), versionCheckCache);
    if (laterVersion) {
      const bannerMsg = formatAsBanner([
        `Newer version of CDK is available [${colors.green(laterVersion as string)}]`,
        `Upgrade recommended`,
      ]);
      bannerMsg.forEach((e) => print(e));
    }
  } catch (err) {
    debug(`Could not run version check - ${err.message}`);
  }
}
