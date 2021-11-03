// eslint-disable-next-line @typescript-eslint/no-require-imports
import parseChangelog = require('changelog-parser');
import { WriteFileOpts, writeFile } from './private/files';
import { debugObject, LoggingOptions } from './private/print';
import { Versions } from './types';
import { readVersion } from './versions';

export interface ReleaseNotesOpts {
  /** path to the version file for the current branch (e.g., version.v2.json) */
  versionFile: string;
  /** path to the primary changelog file (e.g., 'CHANGELOG.v2.md') */
  changelogFile: string;
  /** (optional) path to the independent alpha changelog file (e.g., 'CHANGELOG.v2.alpha.md') */
  alphaChangelogFile?: string;
  /** path to write out the final release notes (e.g., 'RELEASE_NOTES.md'). */
  releaseNotesFile: string;
}

/**
 * Creates a release notes file from one (or more) changelog files for the current version.
 * If an alpha version and alpha changelog file aren't present, this is identical to the contents
 * of the (main) changelog for the current version. Otherwise, a combined release is put together
 * from the contents of the stable and alpha changelogs.
 */
export async function createReleaseNotes(opts: ReleaseNotesOpts & LoggingOptions & WriteFileOpts) {
  const currentVersion = readVersion(opts.versionFile);
  debugObject(opts, 'Current version info', currentVersion);

  writeFile(opts, opts.releaseNotesFile, await releaseNoteContents(currentVersion, opts));
}

async function releaseNoteContents(currentVersion: Versions, opts: ReleaseNotesOpts) {
  const stableChangelogContents = await readChangelogSection(opts.changelogFile, currentVersion.stableVersion);
  // If we don't have an alpha version and distinct alpha changelog, the release notes are just the main changelog section.
  if (!opts.alphaChangelogFile || !currentVersion.alphaVersion) { return stableChangelogContents; }

  const alphaChangelogContents = await readChangelogSection(opts.alphaChangelogFile, currentVersion.alphaVersion);

  // See https://github.com/aws/aws-cdk-rfcs/blob/master/text/0249-v2-experiments.md#changelog--release-notes for format
  return [
    stableChangelogContents,
    '---',
    // DO NOT CHANGE THE FORMAT OF THE FOLLOWING LINE. This will cause the v2 publishing verification canary to skip verification of Alpha modules.
    // See https://github.com/cdklabs/cdk-ops/pull/1769.
    `## Alpha modules (${currentVersion.alphaVersion})`,
    alphaChangelogContents,
  ].join('\n');
}

async function readChangelogSection(changelogFile: string, version: string) {
  const changelog = await parseChangelog(changelogFile) as Changelog;
  const entry = (changelog.versions || []).find(section => section.version === version);
  if (!entry) {
    throw new Error(`No changelog entry found for version ${version} in ${changelogFile}`);
  }
  return entry.body;
}

/** @types/changelog-parser only returns `object`; this is slightly more helpful */
interface Changelog {
  title: string;
  description: string;
  versions?: ChangelogVersion[];
}
interface ChangelogVersion {
  version: string;
  title: string;
  body: string;
}
