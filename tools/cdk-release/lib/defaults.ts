import { ReleaseOptions } from './types';

export const defaults: Partial<ReleaseOptions> = {
  changelogFile: 'CHANGELOG.md',
  sign: false,
  silent: false,
  scripts: {},
  skip: {
    tag: true,
  },
  dryRun: false,
  releaseCommitMessageFormat: 'chore(release): {{currentTag}}',
  changeLogHeader: '# Changelog\n\nAll notable changes to this project will be documented in this file. ' +
    'See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.\n',
};
