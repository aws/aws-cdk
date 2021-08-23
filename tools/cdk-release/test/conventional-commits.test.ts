import * as crypto from 'crypto';
import * as stream from 'stream';
import { ConventionalCommit, filterCommits, getConventionalCommitsFromGitHistory } from '../lib/conventional-commits';
import { ReleaseOptions } from '../lib/types';

// mock out Git interactions
jest.mock('git-raw-commits', () => { return jest.fn(); });
// eslint-disable-next-line @typescript-eslint/no-require-imports
const gitRawCommits = require('git-raw-commits');

const args: ReleaseOptions = {
  changelogFile: 'CHANGELOG.md',
  dryRun: true,
  silent: true,
  includeDateInChangelog: false,
  releaseAs: 'minor',
  versionFile: 'version.json',
};

describe('getConventionalCommitsFromGitHistory', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('makes it so that no Git commits are queried if Changelog generation is skipped', async () => {
    const commits = await getConventionalCommitsFromGitHistory({ ...args, skip: { changelog: true } }, '3.9.2');

    expect(commits).toHaveLength(0);
    expect(gitRawCommits).not.toHaveBeenCalled();
  });

  test('skips commits without types', async () => {
    const commitMessages = ['some commit without a type', 'chore(cdk-release): do trivial stuff'];
    gitRawCommits.mockImplementation(() => mockGitCommits(commitMessages));

    const commits = await getConventionalCommitsFromGitHistory(args, '3.9.2');

    expect(commits).toHaveLength(1);
  });
});

// NOTE - These test currently use real package.json data to determine package's stability.
describe('filterCommits', () => {
  const commits: ConventionalCommit[] = [
    buildCommit({
      type: 'feat',
      scope: 'scope',
      subject: 'super important feature',
    }),
    buildCommit({
      type: 'fix',
      scope: 'example-construct-library', // really hope we don't stabilize this one
      subject: 'hairy bugfix',
      notes: [
        {
          title: 'BREAKING CHANGE',
          text: 'this is a breaking change',
        },
      ],
    }),
  ];

  test('if stripExperimental is not set, returns original commits', async () => {
    const filteredCommits = filterCommits(args, commits);

    expect(filteredCommits.length).toEqual(2);
  });

  test("skips experimental modules if requested, even with 'BREAKING CHANGES'", async () => {
    const filteredCommits = filterCommits({ ...args, stripExperimentalChanges: true }, commits);

    expect(filteredCommits.length).toEqual(1);
    expect(filteredCommits[0].subject).toEqual('super important feature');
  });
});

function mockGitCommits(messages: string[]) {
  const rStream = new stream.Readable();
  messages.forEach(msg => {
    rStream.push([
      msg, '-hash-', crypto.createHash('sha256').update(msg).digest('hex'),
    ].join('\n'));
  });
  rStream.push(null);
  return rStream;
}

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
