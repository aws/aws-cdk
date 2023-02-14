import { spawnSync } from 'child_process';

const MINIMUM_VERSION = '3.9';

/**
 * Use NPM preinstalled on the machine to look up a list of TypeScript versions
 */
export function typescriptVersionsSync(): string[] {
  const { stdout } = spawnSync('npm', ['--silent', 'view', `typescript@>=${MINIMUM_VERSION}`, 'version', '--json'], { encoding: 'utf-8' });

  const versions: string[] = JSON.parse(stdout);
  return Array.from(new Set(versions.map(v => v.split('.').slice(0, 2).join('.'))));
}