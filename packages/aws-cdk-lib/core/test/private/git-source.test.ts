import * as child_process from 'child_process';
import { App, Stack } from '../../lib';
import { GitSource } from '../../lib/git-source';

jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

const mockExecSync = child_process.execSync as jest.Mock;

let app: InstanceType<typeof App>;
let stack: InstanceType<typeof Stack>;

beforeEach(() => {
  GitSource._clearCache();
  mockExecSync.mockReset();
  // Stack constructor calls GitSource.of() when the feature is enabled,
  // so we need a default mock that won't throw during stack construction.
  mockExecSync.mockImplementation(() => { throw new Error('git not configured'); });
  app = new App({ context: { '@aws-cdk/core:enableGitSource': true } });
  stack = new Stack(app, 'Stack');
  // Clear cache and reset mocks so each test starts fresh
  GitSource._clearCache();
  mockExecSync.mockReset();
});

describe('isEnabledFor', () => {
  test('returns true when context flag is boolean true', () => {
    expect(GitSource.isEnabledFor(stack)).toBe(true);
  });

  test('returns true when context flag is string "true"', () => {
    const cliApp = new App({ context: { '@aws-cdk/core:enableGitSource': 'true' } });
    const cliStack = new Stack(cliApp, 'Stack');
    expect(GitSource.isEnabledFor(cliStack)).toBe(true);
  });

  test('returns false when context flag is not set', () => {
    const defaultApp = new App();
    const defaultStack = new Stack(defaultApp, 'Stack');
    expect(GitSource.isEnabledFor(defaultStack)).toBe(false);
  });

  test('returns false for other truthy values', () => {
    const otherApp = new App({ context: { '@aws-cdk/core:enableGitSource': 1 } });
    const otherStack = new Stack(otherApp, 'Stack');
    expect(GitSource.isEnabledFor(otherStack)).toBe(false);
  });
});

describe('of', () => {
  test('returns git source when git is available', () => {
    mockExecSync
      .mockReturnValueOnce('https://github.com/example/repo.git')
      .mockReturnValueOnce('a'.repeat(40));

    const source = GitSource.of(stack);
    expect(source).toEqual({
      repository: 'https://github.com/example/repo.git',
      commit: 'a'.repeat(40),
    });
  });

  test('returns undefined and emits warning when git is not available', () => {
    mockExecSync.mockImplementation(() => { throw new Error('not a git repo'); });

    const source = GitSource.of(stack);
    expect(source).toBeUndefined();

    const warnings = getWarnings(stack);
    expect(warnings.some(w => w.data.includes('Failed to detect git source information: not a git repo'))).toBe(true);
  });

  test('caches result across multiple calls', () => {
    mockExecSync
      .mockReturnValueOnce('https://github.com/example/repo.git')
      .mockReturnValueOnce('a'.repeat(40));

    const first = GitSource.of(stack);
    const second = GitSource.of(stack);

    expect(first).toEqual(second);
    expect(mockExecSync).toHaveBeenCalledTimes(2); // once per git command, not repeated
  });

  test('caches undefined result across multiple calls', () => {
    mockExecSync.mockImplementation(() => { throw new Error('not a git repo'); });

    expect(GitSource.of(stack)).toBeUndefined();
    expect(GitSource.of(stack)).toBeUndefined();

    expect(mockExecSync).toHaveBeenCalledTimes(1); // only tried once
  });

  test('_clearCache resets the cache', () => {
    mockExecSync
      .mockReturnValueOnce('https://github.com/example/repo.git')
      .mockReturnValueOnce('a'.repeat(40))
      .mockReturnValueOnce('https://github.com/example/repo2.git')
      .mockReturnValueOnce('b'.repeat(40));

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

    const source = GitSource.of(stack);
    expect(source?.repository).toBe('https://github.com/example/repo.git');
  });

  test('does not corrupt URLs with @ in path segment', () => {
    mockExecSync
      .mockReturnValueOnce('https://git.example.com/team@org/repo.git')
      .mockReturnValueOnce('a'.repeat(40));

    const source = GitSource.of(stack);
    expect(source?.repository).toBe('https://git.example.com/team@org/repo.git');
  });

  test('accepts SHA-256 commit hashes', () => {
    mockExecSync
      .mockReturnValueOnce('https://github.com/example/repo.git')
      .mockReturnValueOnce('a'.repeat(64));

    const source = GitSource.of(stack);
    expect(source?.commit).toBe('a'.repeat(64));
  });
});

describe('validation failures', () => {
  test('returns undefined and warns for invalid commit hash', () => {
    mockExecSync
      .mockReturnValueOnce('https://github.com/example/repo.git')
      .mockReturnValueOnce('not-a-valid-hash');

    expect(GitSource.of(stack)).toBeUndefined();

    const warnings = getWarnings(stack);
    expect(warnings.some(w => w.data.includes('unexpected value'))).toBe(true);
  });

  test('returns undefined and warns for URL with control characters', () => {
    mockExecSync
      .mockReturnValueOnce('https://github.com/example/repo.git\x00')
      .mockReturnValueOnce('a'.repeat(40));

    expect(GitSource.of(stack)).toBeUndefined();

    const warnings = getWarnings(stack);
    expect(warnings.some(w => w.data.includes('unexpected content'))).toBe(true);
  });

  test('returns undefined and warns for URL with unexpected format', () => {
    mockExecSync
      .mockReturnValueOnce('not a valid url')
      .mockReturnValueOnce('a'.repeat(40));

    expect(GitSource.of(stack)).toBeUndefined();

    const warnings = getWarnings(stack);
    expect(warnings.some(w => w.data.includes('unexpected content'))).toBe(true);
  });

  test('validation failures are cached', () => {
    mockExecSync
      .mockReturnValueOnce('https://github.com/example/repo.git')
      .mockReturnValueOnce('injected-content');

    expect(GitSource.of(stack)).toBeUndefined();
    expect(GitSource.of(stack)).toBeUndefined();
    expect(mockExecSync).toHaveBeenCalledTimes(2); // only the initial detection calls
  });

  test('validation failures are resolved after clearing cache', () => {
    mockExecSync
      .mockReturnValueOnce('https://github.com/example/repo.git')
      .mockReturnValueOnce('injected-content');

    expect(GitSource.of(stack)).toBeUndefined();

    GitSource._clearCache();
    mockExecSync
      .mockReturnValueOnce('https://github.com/example/repo.git')
      .mockReturnValueOnce('a'.repeat(40));

    const source = GitSource.of(stack);
    expect(source?.commit).toBe('a'.repeat(40));
  });
});

function getWarnings(construct: any): Array<{ type: string; data: string }> {
  return construct.node.metadata.filter((m: any) => m.type === 'aws:cdk:warning');
}
