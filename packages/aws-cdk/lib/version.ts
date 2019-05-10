import { exec as _exec } from 'child_process';
import colors = require('colors/safe');
import { close as _close, open as _open, stat as _stat } from 'fs';
import semver = require('semver');
import { promisify } from 'util';
import { debug, print, warning } from '../lib/logging';
import { formatAsBanner } from '../lib/util/console-formatters';

const ONE_DAY_IN_SECONDS = 1 * 24 * 60 * 60;

const close = promisify(_close);
const exec = promisify(_exec);
const open = promisify(_open);
const stat = promisify(_stat);

export const DISPLAY_VERSION = `${versionNumber()} (build ${commit()})`;

function versionNumber(): string {
  return require('../package.json').version.replace(/\+[0-9a-f]+$/, '');
}

function commit(): string {
  return require('../build-info.json').commit;
}

export class TimestampFile {
  private readonly file: string;

  // File modify times are accurate only till the second, hence using seconds as precision
  private readonly ttlSecs: number;

  constructor(file: string, ttlSecs: number) {
    this.file = file;
    this.ttlSecs = ttlSecs;
  }

  public async hasExpired(): Promise<boolean> {
    try {
      const lastCheckTime = (await stat(this.file)).mtimeMs;
      const today = new Date().getTime();

      if ((today - lastCheckTime) / 1000 > this.ttlSecs) { // convert ms to secs
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

  public async update(): Promise<void> {
    const fd = await open(this.file, 'w');
    await close(fd);
  }
}

// Export for unit testing only.
// Don't use directly, use displayVersionMessage() instead.
export async function latestVersionIfHigher(currentVersion: string, cacheFile: TimestampFile): Promise<string | null> {
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
  await cacheFile.update();

  if (isNewer) {
    return latestVersion;
  } else {
    return null;
  }
}

const versionCheckCache = new TimestampFile(`${__dirname}/../.LAST_VERSION_CHECK`, ONE_DAY_IN_SECONDS);

export async function displayVersionMessage(): Promise<void> {
  if (!process.stdout.isTTY) {
    return;
  }

  try {
    const laterVersion = await latestVersionIfHigher(versionNumber(), versionCheckCache);
    if (laterVersion) {
      const bannerMsg = formatAsBanner([
        `Newer version of CDK is available [${colors.green(laterVersion as string)}]`,
        `Upgrade recommended`,
      ]);
      bannerMsg.forEach((e) => print(e));
    }
  } catch (err) {
    warning(`Could not run version check due to error ${err.message}`);
  }
}