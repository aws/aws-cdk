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
  repoRoot: '',
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

describe('filterCommits', () => {
  const commits: ConventionalCommit[] = [
    commitWithScope('aws-stable'),
    commitWithScope('aws-experimental'),
    commitWithScope(),
  ];

  test('if no options are provided, returns all commits', () => {
    const filteredCommits = filterCommits(commits);

    expect(filteredCommits).toEqual(commits);
  });

  test('excludePackages removes commits matching scope', () => {
    const filteredCommits = filterCommits(commits, { excludePackages: ['@aws-cdk/aws-experimental'] });

    expect(filteredCommits.length).toEqual(2);
    expect(filteredCommits.map(c => c.scope)).not.toContain('aws-experimental');
  });

  test('excludePackages removes commits matching specific variants of the scope', () => {
    const experimentalCommits = [
      commitWithScope('aws-experimental'),
      commitWithScope('awsexperimental'),
      commitWithScope('experimental'),
      commitWithScope('aws.experimental'),
    ];

    const filteredCommits = filterCommits(experimentalCommits, { excludePackages: ['@aws-cdk/aws-experimental'] });

    expect(filteredCommits.length).toEqual(1);
    expect(filteredCommits[0].scope).toEqual('aws.experimental');
  });

  test('includePackages only includes commits matching scope', () => {
    const filteredCommits = filterCommits(commits, { includePackages: ['@aws-cdk/aws-stable'] });

    expect(filteredCommits.length).toEqual(1);
    expect(filteredCommits[0].scope).toEqual('aws-stable');
  });

  test('includePackages includes commits matching variants of the scope', () => {
    const stableCommits = [
      commitWithScope('aws-stable'),
      commitWithScope('awsstable'),
      commitWithScope('stable'),
      commitWithScope('notstable'),
    ];

    const filteredCommits = filterCommits(stableCommits, { includePackages: ['@aws-cdk/aws-stable'] });

    expect(filteredCommits.length).toEqual(3);
    expect(filteredCommits.map(c => c.scope)).not.toContain('notstable');
  });

  test('excludes criteria are run after includes', () => {
    const filteredCommits = filterCommits(commits, {
      includePackages: ['@aws-cdk/aws-stable', '@aws-cdk/aws-experimental'],
      excludePackages: ['@aws-cdk/aws-experimental'],
    });

    expect(filteredCommits.length).toEqual(1);
    expect(filteredCommits[0].scope).toEqual('aws-stable');
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

function commitWithScope(scope?: string): ConventionalCommit {
  return {
    notes: [],
    references: [],
    header: `feat${scope ? '(' + scope + ')' : ''}: some commit message`,
    type: 'feat',
    subject: 'some commit message',
    scope,
  };
}
