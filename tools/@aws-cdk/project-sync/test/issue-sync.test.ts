import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import * as issueSync from '../lib/issue-sync.js';
import { GithubMock } from './github-mock.js';
import { Github } from '../lib/github.js';

jest.mock('../lib/github.js');

describe('Issue Sync', () => {
  let mockGithub: GithubMock;

  beforeEach(() => {
    // Create a new instance of our mock GitHub client
    mockGithub = new GithubMock('fake-token');
    (Github.default as jest.Mock).mockReturnValue(mockGithub);

    // Spy on the setProjectItem method to verify calls
    jest.spyOn(mockGithub, 'setProjectItem');
    jest.spyOn(mockGithub, 'getProjectInfo');
  });

  test('syncIssue fetches issue details and sets project item fields', async () => {
    // The test will use the existing snapshot file for issue 15891
    await issueSync.syncIssue('15891');

    expect(mockGithub.getProjectInfo).toHaveBeenCalledWith('302');

    // Verify that setProjectItem was called with the project item ID from the snapshot
    // and the expected creation and update dates
    expect(mockGithub.setProjectItem).toHaveBeenCalledWith('PVT_kwDOACIPmc4A7TlP', 'PVTI_lADOACIPmc4A7TlPzgbanR8', {
      PVTF_lADOACIPmc4A7TlPzgvqxXA: { date: new Date('2021-08-04T15:40:27Z') },
      PVTF_lADOACIPmc4A7TlPzgv350s: { date: new Date('2025-06-30T15:47:05Z') },
      PVTF_lADOACIPmc4A7TlPzgyBz60: { text: 'naseemkullah' },
      PVTSSF_lADOACIPmc4A7TlPzgvpNe8: { singleSelectOptionId: '0a877460' },
    });
  });

  test('syncIssue fetches issue details and sets project item fields #2', async () => {
    // The test will use the existing snapshot file for issue 15891
    await issueSync.syncIssue('30793');

    expect(mockGithub.getProjectInfo).toHaveBeenCalledWith('302');

    // Verify that setProjectItem was called with the project item ID from the snapshot
    // and the expected creation and update dates
    expect(mockGithub.setProjectItem).toHaveBeenCalledWith('PVT_kwDOACIPmc4A7TlP', 'PVTI_lADOACIPmc4A7TlPzgbamKo', {
      PVTF_lADOACIPmc4A7TlPzgvqxXA: { date: new Date('2024-07-09T08:10:25Z') },
      PVTF_lADOACIPmc4A7TlPzgv350s: { date: new Date('2025-07-25T16:56:19Z') },
      PVTF_lADOACIPmc4A7TlPzgyBz60: { text: 'greg5123334' },
      PVTSSF_lADOACIPmc4A7TlPzgvpNe8: { singleSelectOptionId: '0a877460' },
    });
  });

  test('syncIssue skips event from github-actions', async () => {
    // The test will use the existing snapshot file for issue 15891
    await issueSync.syncIssue('33208');

    expect(mockGithub.getProjectInfo).toHaveBeenCalledWith('302');

    // Verify that setProjectItem was called with the project item ID from the snapshot
    // and the expected creation and update dates
    expect(mockGithub.setProjectItem).toHaveBeenCalledWith('PVT_kwDOACIPmc4A7TlP', 'PVTI_lADOACIPmc4A7TlPzgbamBo', {
      PVTF_lADOACIPmc4A7TlPzgvqxXA: { date: new Date('2025-01-28T09:56:52Z') },
      PVTF_lADOACIPmc4A7TlPzgv350s: { date: new Date('2025-06-12T16:00:02Z') },
      PVTF_lADOACIPmc4A7TlPzgyBz60: { text: 'aubsamai' },
      PVTSSF_lADOACIPmc4A7TlPzgvpNe8: { singleSelectOptionId: '0a877460' },
    });
  });

  test('syncIssue does nothing for issues not included in project', async () => {
    await issueSync.syncIssue('41');
    expect(mockGithub.setProjectItem).not.toHaveBeenCalled();
  });
});
