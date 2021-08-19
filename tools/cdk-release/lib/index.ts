import * as fs from 'fs';
import * as path from 'path';
import { filterCommits, getConventionalCommitsFromGitHistory } from './conventional-commits';
import { defaults } from './defaults';
import { bump } from './lifecycles/bump';
import { changelog } from './lifecycles/changelog';
import { commit } from './lifecycles/commit';
import { debug, debugObject } from './private/print';
import { ReleaseOptions, Versions } from './types';

module.exports = async function main(opts: ReleaseOptions): Promise<void> {
  // handle the default options
  const args: ReleaseOptions = {
    ...defaults,
    ...opts,
  };
  debugObject(args, 'options are (including defaults)', args);

  const currentVersion = readVersion(args.versionFile);
  debugObject(args, 'Current version info', currentVersion);

  const commits = await getConventionalCommitsFromGitHistory(args, `v${currentVersion.stableVersion}`);
  const filteredCommits = filterCommits(args, commits);
  debugObject(args, 'Found and filtered commits', filteredCommits);

  const newVersion = await bump(args, currentVersion);
  debugObject(args, 'New version is', newVersion);

  debug(args, 'Writing Changelog');
  await changelog(args, currentVersion.stableVersion, newVersion.stableVersion, filteredCommits);

  debug(args, 'Committing result');
  await commit(args, newVersion.stableVersion, [args.versionFile, args.changelogFile]);
};

export function readVersion(versionFile: string): Versions {
  const versionPath = path.resolve(process.cwd(), versionFile);
  const contents = JSON.parse(fs.readFileSync(versionPath, { encoding: 'utf-8' }));
  return {
    stableVersion: contents.version,
    alphaVersion: contents.alphaVersion,
  };
}
