import { describe, expect, jest, test, beforeEach } from '@jest/globals';
import { getChangedSnapshots } from '../lib/main';
import { gitDiffMock } from './git-mock';
import { gitDiff } from '../lib/git';
import { expectedChangedSnapshots } from './git-diff-expected-changed-snapshots';

jest.mock('../lib/git.ts');

describe('main', () => {
  beforeEach(() => {
    (gitDiff as jest.Mock).mockImplementation(gitDiffMock);
  });

  test('git diff provides correct snapshot changes', async () => {
    const changedSnapshots = await getChangedSnapshots();

    expect(changedSnapshots.length).toBe(expectedChangedSnapshots.length);
    expect(changedSnapshots).toEqual(expect.arrayContaining(expectedChangedSnapshots));
  });
});
