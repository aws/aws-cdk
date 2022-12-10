import { spawnSync } from 'child_process';

const minSupportedVersion = process.argv.slice(2, 3);

const { stdout } = spawnSync('npm', ['--silent', 'view', `typescript@>=${minSupportedVersion}`, 'version', '--json']);

const versions: string[] = JSON.parse(stdout);
const minorVersions = Array.from(new Set(versions.map(v => v.split('.').slice(0, 2).join('.'))));

process.stdout.write(minorVersions.join(' '));
