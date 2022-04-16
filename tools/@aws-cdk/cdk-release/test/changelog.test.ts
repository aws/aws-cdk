import { ConventionalCommit } from '../lib/conventional-commits';
import { changelog, ChangelogOptions, writeChangelogs } from '../lib/lifecycles/changelog';
import { ExperimentalChangesTreatment, PackageInfo, Versions } from '../lib/types';

const args: ChangelogOptions = {
  changelogFile: 'CHANGELOG.md',
  dryRun: true,
  silent: true,
  includeDateInChangelog: false,
};

describe('writeChangelogs', () => {

  const currentVersion: Versions = { stableVersion: '1.23.0' };
  const newVersion: Versions = { stableVersion: '1.24.0' };

  const commits: ConventionalCommit[] = [
    buildCommit({ type: 'feat', scope: 'aws-stable', subject: 'new stable feat' }),
    buildCommit({ type: 'feat', scope: 'aws-experimental', subject: 'new experimental feat' }),
  ];
  const packages: PackageInfo[] = [
    { name: 'aws-stable', alpha: false, location: 'aws-stable' },
    { name: 'aws-experimental', alpha: true, location: 'aws-experimental' },
  ];

  const defaultWriteChangelogOpts = {
    ...args,
    currentVersion,
    newVersion,
    commits,
    packages,
  };

  test('does nothing if skip.changelog is set', async () => {
    const changelogResult = await writeChangelogs({ ...defaultWriteChangelogOpts, skip: { changelog: true } });

    expect(changelogResult).toEqual([]);
  });

  test('defaults experimentalChangesTreatment to "include"', async () => {
    const changelogResultDefault = await writeChangelogs({
      ...defaultWriteChangelogOpts, experimentalChangesTreatment: undefined,
    });
    const changelogResultInclude = await writeChangelogs({
      ...defaultWriteChangelogOpts, experimentalChangesTreatment: ExperimentalChangesTreatment.INCLUDE,
    });

    expect(changelogResultDefault).toEqual(changelogResultInclude);
  });

  test('if experimentalChangesTreatment is "include", includes experimental changes', async () => {
    const changelogResult = await writeChangelogs({
      ...defaultWriteChangelogOpts, experimentalChangesTreatment: ExperimentalChangesTreatment.INCLUDE,
    });

    expect(changelogResult.length).toEqual(1);
    expect(changelogResult[0].filePath).toEqual('CHANGELOG.md');
    expect(changelogResult[0].fileContents.trim()).toBe(
      `## [1.24.0](https://github.com/aws/aws-cdk/compare/v1.23.0...v1.24.0)

### Features

* **aws-experimental:** new experimental feat
* **aws-stable:** new stable feat`);
  });

  test('if changelogExperimentalChanges is "strip", excludes experimental changes', async () => {
    const changelogResult = await writeChangelogs({
      ...defaultWriteChangelogOpts, experimentalChangesTreatment: ExperimentalChangesTreatment.STRIP,
    });

    expect(changelogResult.length).toEqual(1);
    expect(changelogResult[0].filePath).toEqual('CHANGELOG.md');
    expect(changelogResult[0].fileContents.trim()).toBe(
      `## [1.24.0](https://github.com/aws/aws-cdk/compare/v1.23.0...v1.24.0)

### Features

* **aws-stable:** new stable feat`);
  });

  describe('experimentalChangesTreatment is SEPARATE', () => {

    const defaultSeparateChangelogOpts = {
      ...defaultWriteChangelogOpts,
      experimentalChangesTreatment: ExperimentalChangesTreatment.SEPARATE,
      currentVersion: { stableVersion: '1.23.0', alphaVersion: '1.23.0-alpha.0' },
      newVersion: { stableVersion: '1.24.0', alphaVersion: '1.24.0-alpha.0' },
      alphaChangelogFile: 'CHANGELOG.alpha.md',
    };

    test('throws if alpha versions are not present', async () => {
      await expect(writeChangelogs({
        ...defaultSeparateChangelogOpts,
        currentVersion: { stableVersion: '1.23.0' },
        newVersion: { stableVersion: '1.24.0' },
      }))
        .rejects
        .toThrow(/without alpha package versions/);

      await expect(writeChangelogs({ ...defaultSeparateChangelogOpts, newVersion: { stableVersion: '1.24.0' } }))
        .rejects
        .toThrow(/without alpha package versions/);

      await expect(writeChangelogs({ ...defaultSeparateChangelogOpts, currentVersion: { stableVersion: '1.23.0' } }))
        .rejects
        .toThrow(/without alpha package versions/);
    });

    test('throws if alpha changelog file is not present', async () => {
      await expect(writeChangelogs({ ...defaultSeparateChangelogOpts, alphaChangelogFile: undefined }))
        .rejects
        .toThrow(/alphaChangelogFile must be specified/);
    });

    test('excludes experimental changes and writes to the alpha changelog', async () => {
      const changelogResult = await writeChangelogs(defaultSeparateChangelogOpts);

      const mainResult = changelogResult.find(r => r.filePath === 'CHANGELOG.md');
      const alphaResult = changelogResult.find(r => r.filePath === 'CHANGELOG.alpha.md');
      expect(mainResult?.fileContents.trim()).toBe(
        `## [1.24.0](https://github.com/aws/aws-cdk/compare/v1.23.0...v1.24.0)

### Features

* **aws-stable:** new stable feat`);
      expect(alphaResult?.fileContents.trim()).toBe(
        `## [1.24.0-alpha.0](https://github.com/aws/aws-cdk/compare/v1.23.0-alpha.0...v1.24.0-alpha.0)

### Features

* **aws-experimental:** new experimental feat`);
    });
  });
});

describe('changelog', () => {
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

async function invokeChangelogFrom1_23_0to1_24_0(changelogArgs: ChangelogOptions, commits: ConventionalCommit[]): Promise<string> {
  return changelog(changelogArgs, '1.23.0', '1.24.0', commits);
}
