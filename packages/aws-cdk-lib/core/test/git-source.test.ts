import * as child_process from 'child_process';
import { GitSource } from '../lib/git-source';
import { App, Stack } from '../lib/index';

jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

const mockExecSync = child_process.execSync as jest.Mock;

beforeEach(() => {
  GitSource._clearCache();
  mockExecSync.mockReset();
});

test('returns git source when context is enabled and git is available', () => {
  mockExecSync
    .mockReturnValueOnce('https://github.com/example/repo.git')
    .mockReturnValueOnce('a'.repeat(40));

  const app = new App({ context: { '@aws-cdk/core:enableGitSource': true } });
  const stack = new Stack(app, 'Stack');

  const source = GitSource.of(stack);
  expect(source).toEqual({
    repository: 'https://github.com/example/repo.git',
    commit: 'a'.repeat(40),
  });
});

test('returns undefined when git is not available', () => {
  mockExecSync.mockImplementation(() => { throw new Error('not a git repo'); });

  const app = new App({ context: { '@aws-cdk/core:enableGitSource': true } });
  const stack = new Stack(app, 'Stack');

  expect(GitSource.of(stack)).toBeUndefined();
});

test('caches result across multiple calls', () => {
  mockExecSync
    .mockReturnValueOnce('https://github.com/example/repo.git')
    .mockReturnValueOnce('a'.repeat(40));

  const app = new App({ context: { '@aws-cdk/core:enableGitSource': true } });
  const stack = new Stack(app, 'Stack');

  const first = GitSource.of(stack);
  const second = GitSource.of(stack);

  expect(first).toEqual(second);
  expect(mockExecSync).toHaveBeenCalledTimes(2); // once per git command, not repeated
});

test('caches undefined result', () => {
  mockExecSync.mockImplementation(() => { throw new Error('not a git repo'); });

  const app = new App({ context: { '@aws-cdk/core:enableGitSource': true } });
  const stack = new Stack(app, 'Stack');

  expect(GitSource.of(stack)).toBeUndefined();
  expect(GitSource.of(stack)).toBeUndefined();

  expect(mockExecSync).toHaveBeenCalledTimes(1); // only tried once
});

test('clearCache resets the cache', () => {
  mockExecSync
    .mockReturnValueOnce('https://github.com/example/repo.git')
    .mockReturnValueOnce('a'.repeat(40))
    .mockReturnValueOnce('https://github.com/example/repo2.git')
    .mockReturnValueOnce('b'.repeat(40));

  const app = new App({ context: { '@aws-cdk/core:enableGitSource': true } });
  const stack = new Stack(app, 'Stack');

  const first = GitSource.of(stack);
  GitSource._clearCache();
  const second = GitSource.of(stack);

  expect(first).toEqual({ repository: 'https://github.com/example/repo.git', commit: 'a'.repeat(40) });
  expect(second).toEqual({ repository: 'https://github.com/example/repo2.git', commit: 'b'.repeat(40) });
  expect(mockExecSync).toHaveBeenCalledTimes(4);
});

test('sanitizes credentials from repository URL', () => {
  mockExecSync
    .mockReturnValueOnce('https://user:token@github.com/example/repo.git')
    .mockReturnValueOnce('a'.repeat(40));

  const app = new App({ context: { '@aws-cdk/core:enableGitSource': true } });
  const stack = new Stack(app, 'Stack');

  const source = GitSource.of(stack);
  expect(source?.repository).toBe('https://github.com/example/repo.git');
});

test('sanitizes credentials from repository URL (ssh)', () => {
  mockExecSync
    .mockReturnValueOnce('ssh://user:token@github.com/example/repo.git')
    .mockReturnValueOnce('a'.repeat(40));

  const app = new App({ context: { '@aws-cdk/core:enableGitSource': true } });
  const stack = new Stack(app, 'Stack');

  const source = GitSource.of(stack);
  expect(source?.repository).toBe('ssh://github.com/example/repo.git');
});

test('sanitizes credentials from repository URL (git)', () => {
  mockExecSync
    .mockReturnValueOnce('git://user:token@github.com/example/repo.git')
    .mockReturnValueOnce('a'.repeat(40));

  const app = new App({ context: { '@aws-cdk/core:enableGitSource': true } });
  const stack = new Stack(app, 'Stack');

  const source = GitSource.of(stack);
  expect(source?.repository).toBe('git://github.com/example/repo.git');
});

test('returns undefined for invalid commit hash', () => {
  mockExecSync
    .mockReturnValueOnce('https://github.com/example/repo.git')
    .mockReturnValueOnce('not-a-valid-hash');

  const app = new App({ context: { '@aws-cdk/core:enableGitSource': true } });
  const stack = new Stack(app, 'Stack');

  expect(GitSource.of(stack)).toBeUndefined();
});

test('returns undefined for invalid repository URL', () => {
  mockExecSync
    .mockReturnValueOnce('not a valid url')
    .mockReturnValueOnce('a'.repeat(40));

  const app = new App({ context: { '@aws-cdk/core:enableGitSource': true } });
  const stack = new Stack(app, 'Stack');

  expect(GitSource.of(stack)).toBeUndefined();
});

test('accepts SHA-256 commit hashes (64 hex chars)', () => {
  mockExecSync
    .mockReturnValueOnce('https://github.com/example/repo.git')
    .mockReturnValueOnce('a'.repeat(64));

  const app = new App({ context: { '@aws-cdk/core:enableGitSource': true } });
  const stack = new Stack(app, 'Stack');

  const source = GitSource.of(stack);
  expect(source?.commit).toBe('a'.repeat(64));
});

test('isEnabledFor accepts string "true" from CLI context', () => {
  const app = new App({ context: { '@aws-cdk/core:enableGitSource': 'true' } });
  const stack = new Stack(app, 'Stack');

  expect(GitSource.isEnabledFor(stack)).toBe(true);
});

test('does not corrupt URLs with @ in path segment', () => {
  mockExecSync
    .mockReturnValueOnce('https://git.example.com/team@org/repo.git')
    .mockReturnValueOnce('a'.repeat(40));

  const app = new App({ context: { '@aws-cdk/core:enableGitSource': true } });
  const stack = new Stack(app, 'Stack');

  const source = GitSource.of(stack);
  expect(source?.repository).toBe('https://git.example.com/team@org/repo.git');
});
