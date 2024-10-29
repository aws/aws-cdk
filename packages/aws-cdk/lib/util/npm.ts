import { exec as _exec } from 'child_process';
import { promisify } from 'util';
import * as semver from 'semver';
import { debug } from '../../lib/logging';

const exec = promisify(_exec);

export async function getLatestVersionFromNpm(): Promise<string> {
  const { stdout, stderr } = await exec('npm view aws-cdk version');
  if (stderr && stderr.trim().length > 0) {
    debug(`The 'npm view' command generated an error stream with content [${stderr.trim()}]`);
  }
  const latestVersion = stdout.trim();
  if (!semver.valid(latestVersion)) {
    throw new Error(`npm returned an invalid semver ${latestVersion}`);
  }

  return latestVersion;
}
