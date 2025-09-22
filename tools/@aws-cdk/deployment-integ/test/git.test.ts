import { describe, expect, jest, test } from '@jest/globals';
import { gitDiffMock } from './git-mock';
import { expectedChangedSnapshots } from './git-diff-expected-changed-snapshots';
import * as utils from '../lib/utils';

jest.spyOn(utils, 'gitDiff').mockImplementation(gitDiffMock);

describe('Ingreation Test Snapshot', () => {

  test('git diff provides correct snapshot changes', async () => {
    const changedSnapshots = await utils.getChangedSnapshots();

    expect(changedSnapshots.length).toBe(expectedChangedSnapshots.length);
    expect(changedSnapshots).toEqual(expect.arrayContaining(expectedChangedSnapshots));
  });
});
