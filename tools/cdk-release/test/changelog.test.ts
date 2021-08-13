import { ConventionalCommit } from '../lib/conventional-commits';
import { changelog, ChangelogOptions } from '../lib/lifecycles/changelog';

describe('Changelog generation', () => {
  const args: ChangelogOptions = {
    changelogFile: 'CHANGELOG.md',
    dryRun: true,
    silent: true,
    includeDateInChangelog: false,
  };

  test("correctly handles 'BREAKING CHANGES'", async () => {
    const commits: ConventionalCommit[] = [
      buildCommit({
        type: 'feat',
        subject: 'super important feature',
        notes: [
          {
            title: 'BREAKING CHANGE',
            text: 'this is a breaking change',
          },
        ],
      }),
      buildCommit({
        type: 'fix',
        scope: 'scope',
        subject: 'hairy bugfix',
      }),
      buildCommit({
        type: 'chore',
        subject: 'this commit should not be rendered in the Changelog',
      }),
    ];

    const changelogContents = await invokeChangelogFrom1_23_0to1_24_0(args, commits);

    expect(changelogContents).toBe(
      `## [1.24.0](https://github.com/aws/aws-cdk/compare/v1.23.0...v1.24.0)

### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* this is a breaking change

### Features

* super important feature


### Bug Fixes

* **scope:** hairy bugfix

`);
  });
});

interface PartialCommit extends Partial<ConventionalCommit> {
  readonly type: string;
  readonly subject: string;
}

function buildCommit(commit: PartialCommit): ConventionalCommit {
  return {
    notes: [],
    references: [],
    header: `${commit.type}${commit.scope ? '(' + commit.scope + ')' : ''}: ${commit.subject}`,
    ...commit,
  };
}

async function invokeChangelogFrom1_23_0to1_24_0(args: ChangelogOptions, commits: ConventionalCommit[]): Promise<string> {
  return (await changelog(args, '1.23.0', '1.24.0', commits)).contents;
}
