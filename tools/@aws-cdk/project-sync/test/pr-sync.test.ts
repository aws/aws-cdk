import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import * as prSync from '../lib/pr-sync.js';
import { GithubMock } from './github-mock.js';
import { Github } from '../lib/github.js';

jest.mock('../lib/github.js');

describe('PR Sync', () => {
  let mockGithub: GithubMock;

  beforeEach(() => {
    // Create a new instance of our mock GitHub client
    mockGithub = new GithubMock('fake-token');
    (Github.default as jest.Mock).mockReturnValue(mockGithub);

    // Spy on the setProjectItem method to verify calls
    jest.spyOn(mockGithub, 'setProjectItem');
    jest.spyOn(mockGithub, 'getProjectInfo');
  });

  test('syncPr fetches PR details and sets project item fields', async () => {
    // The test will use the existing snapshot file for issue 15891
    await prSync.syncPr('34962');

    expect(mockGithub.getProjectInfo).toHaveBeenCalledWith('302');

    // Verify that setProjectItem was called with the project item ID from the snapshot
    // and the expected creation and update dates
    expect(mockGithub.setProjectItem).toHaveBeenCalledWith('PVT_kwDOACIPmc4A7TlP', 'PVTI_lADOACIPmc4A7TlPzgceg5g', {
      PVTF_lADOACIPmc4A7TlPzgvqxXA: { date: new Date('2025-07-11T04:45:56Z') },
      PVTF_lADOACIPmc4A7TlPzgv350s: { date: new Date('2025-08-07T06:44:13Z') },
      PVTF_lADOACIPmc4A7TlPzgyBz60: { text: 'badmintoncryer' },
      PVTSSF_lADOACIPmc4A7TlPzgvpNe8: {
        singleSelectOptionId: 'da944a9c',
      },
    });
  });
});
