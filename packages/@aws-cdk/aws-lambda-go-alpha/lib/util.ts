import { spawnSync, SpawnSyncOptions } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const GO_VERSION_REGEX = /go([0-9]{1,4})+?(\.([0-9]{1,4}))+?(\.([0-9]{1,4}))?/;

export function getGoBuildVersion(): boolean | undefined {
  try {
    const go = spawnSync('go', ['version']);
    if (go.status !== 0 || go.error) {
      return undefined;
    }
    const goVersion = go.stdout.toString().split(' ')[2].match(GO_VERSION_REGEX);
    if (!goVersion || goVersion[3] <= '11') {
      return undefined;
    } else {
      return true;
    }
  } catch (err) {
    return undefined;
  }
}

/**
 * Spawn sync with error handling
 */
export function exec(cmd: string, args: string[], options?: SpawnSyncOptions) {
  const proc = spawnSync(cmd, args, options);

  if (proc.error) {
    throw proc.error;
  }

  if (proc.status !== 0) {
    if (proc.stdout || proc.stderr) {
      throw new Error(`[Status ${proc.status}] stdout: ${proc.stdout?.toString().trim()}\n\n\nstderr: ${proc.stderr?.toString().trim()}`);
    }
    throw new Error(`${cmd} exited with status ${proc.status}`);
  }

  return proc;
}

export function findUp(name: string, directory: string = process.cwd()): string | undefined {
  const absoluteDirectory = path.resolve(directory);

  const file = path.join(directory, name);
  if (fs.existsSync(file)) {
    return file;
  }

  const { root } = path.parse(absoluteDirectory);
  if (absoluteDirectory == root) {
    return undefined;
  }

  return findUp(name, path.dirname(absoluteDirectory));
}
