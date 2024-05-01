import * as os from 'os';
import * as fs from 'fs-extra';
import * as logging from './logging';

export async function checkForPlatformWarnings() {
  if (await hasDockerCopyBug()) {
    logging.warning('`cdk synth` may hang in Docker on Linux 5.6-5.10. See https://github.com/aws/aws-cdk/issues/21379 for workarounds.');
  }
}

async function hasDockerCopyBug() {
  return await runningInDocker() && os.platform() === 'linux' && isVersionBetween(os.release(), '5.6', '5.10');
}

async function runningInDocker() {
  return fs.pathExists('/.dockerenv');
}

export function isVersionBetween(version: string, lower: string, upper: string) {
  const ver = splitVersion(version);
  const lo = splitVersion(lower);
  const up = splitVersion(upper);

  while (lo.length < ver.length) { lo.push(0); }
  while (up.length < ver.length) { up.push(9999999); }

  let n = ver.length;
  for (let i = 0; i < n; i++) {
    if (lo[i] < ver[i] && ver[i] < up[i]) { return true; }
    if (lo[i] > ver[i] || ver[i] > up[i]) { return false; }
  }

  return false;

}

function splitVersion(version: string): number[] {
  return `${version}`.split('.')
    .map(x => parseInt(x, 10))
    .map(x => isNaN(x) ? 0 : x);
}
