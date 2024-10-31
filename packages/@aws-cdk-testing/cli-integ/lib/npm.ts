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

/**
 * Use NPM preinstalled on the machine to query publish times of versions
 */
export function typescriptVersionsYoungerThanDaysSync(days: number, versions: string[]): string[] {
  const { stdout } = spawnSync('npm', ['--silent', 'view', 'typescript', 'time', '--json'], { encoding: 'utf-8' });
  const versionTsMap: Record<string, string> = JSON.parse(stdout);

  const cutoffDate = new Date(Date.now() - (days * 24 * 3600 * 1000));
  const cutoffDateS = cutoffDate.toISOString();

  const recentVersions = Object.entries(versionTsMap)
    .filter(([_, dateS]) => dateS > cutoffDateS)
    .map(([v]) => v);

  // Input versions are of the form 3.9, 5.2, etc.
  // Actual versions are of the form `3.9.15`, `5.3.0-dev.20511311`.
  // Return only 2-digit versions for which there is a non-prerelease version in the set of recentVersions
  // So a 2-digit versions that is followed by `.<digits>` until the end of the string.
  return versions.filter((twoV) => {
    const re = new RegExp(`^${reQuote(twoV)}\\.\\d+$`);
    return recentVersions.some(fullV => fullV.match(re));
  });
}

function reQuote(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
