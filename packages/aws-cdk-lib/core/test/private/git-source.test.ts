import * as child_process from 'child_process';
import { getGitSource, clearGitSourceCache } from '../../lib/private/git-source';

jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

const mockExecSync = child_process.execSync as jest.Mock;

beforeEach(() => {
  clearGitSourceCache();
  mockExecSync.mockReset();
  delete process.env.CDK_DISABLE_GIT_SOURCE;
});

test('caches result across multiple calls', () => {
  mockExecSync
    .mockReturnValueOnce('https://github.com/example/repo.git')
    .mockReturnValueOnce('abc123');

  const first = getGitSource();
  const second = getGitSource();

  expect(first).toEqual({ repository: 'https://github.com/example/repo.git', commit: 'abc123' });
  expect(second).toBe(first);
  expect(mockExecSync).toHaveBeenCalledTimes(2); // once per git command, not repeated
});

test('caches undefined result', () => {
  mockExecSync.mockImplementation(() => { throw new Error('not a git repo'); });

  expect(getGitSource()).toBeUndefined();
  expect(getGitSource()).toBeUndefined();

  expect(mockExecSync).toHaveBeenCalledTimes(1); // only tried once
});

test('clearGitSourceCache resets the cache', () => {
  mockExecSync
    .mockReturnValueOnce('https://github.com/example/repo.git')
    .mockReturnValueOnce('abc123')
    .mockReturnValueOnce('https://github.com/example/repo2.git')
    .mockReturnValueOnce('def456');

  const first = getGitSource();
  clearGitSourceCache();
  const second = getGitSource();

  expect(first).toEqual({ repository: 'https://github.com/example/repo.git', commit: 'abc123' });
  expect(second).toEqual({ repository: 'https://github.com/example/repo2.git', commit: 'def456' });
  expect(mockExecSync).toHaveBeenCalledTimes(4);
});
