'use strict';

const { verifyApproval } = require('../../verify-approval');

// ─── Helpers ────────────────────────────────────────────────────────────────────

const VALID_TOKEN = 'ghp_test_token';
const VALID_REPO = 'aws/aws-cdk';
const HEAD_SHA = 'abc1234567890abcdef1234567890abcdef123456';
const STALE_SHA = 'def0000000000000000000000000000000000000';

function makeMockOctokit({ prResponse, reviewsResponse, membershipResponses = {} } = {}) {
  return {
    rest: {
      pulls: {
        get: jest.fn().mockImplementation(async () => {
          if (!prResponse) throw Object.assign(new Error('Not Found'), { status: 404 });
          if (prResponse.error) throw Object.assign(new Error(prResponse.error.message), { status: prResponse.error.status });
          return { data: prResponse.data };
        }),
        listReviews: jest.fn().mockImplementation(async () => {
          if (!reviewsResponse) throw Object.assign(new Error('Not Found'), { status: 404 });
          if (reviewsResponse.error) throw Object.assign(new Error(reviewsResponse.error.message), { status: reviewsResponse.error.status });
          return { data: reviewsResponse.data };
        }),
      },
      teams: {
        getMembershipForUserInOrg: jest.fn().mockImplementation(async ({ username }) => {
          const resp = membershipResponses[username];
          if (!resp || resp.error) {
            const status = resp?.error?.status ?? 404;
            throw Object.assign(new Error('Not Found'), { status });
          }
          return { data: resp.data };
        }),
      },
    },
  };
}

function openPr(sha = HEAD_SHA) {
  return { state: 'open', head: { sha } };
}

function closedPr() {
  return { state: 'closed', head: { sha: HEAD_SHA } };
}

function mergedPr() {
  return { state: 'merged', head: { sha: HEAD_SHA } };
}

function approval(login, commitId = HEAD_SHA) {
  return { state: 'APPROVED', commit_id: commitId, user: { login } };
}

function commentReview(login) {
  return { state: 'COMMENTED', commit_id: HEAD_SHA, user: { login } };
}

// ─── find-pr logic ──────────────────────────────────────────────────────────────

function findPr(prs, headSha) {
  const matching = prs.filter(p => p.head.sha === headSha);
  if (matching.length === 0) {
    return { success: false, error: `No open PR found with head ${headSha}` };
  }
  if (matching.length > 1) {
    return { success: false, error: `Multiple PRs (${matching.length}) found for SHA ${headSha}, aborting` };
  }
  return {
    success: true,
    outputs: {
      pr_number: String(matching[0].number),
      head_sha: matching[0].head.sha,
      base_sha: matching[0].base.sha,
    },
  };
}

// ─── Tests ──────────────────────────────────────────────────────────────────────

describe('verify-approval', () => {
  test('Missing prNumber arg → exit 1', async () => {
    const mockOctokit = makeMockOctokit();
    const result = await verifyApproval({
      prNumber: undefined,
      token: VALID_TOKEN,
      repository: VALID_REPO,
      octokit: mockOctokit,
    });
    expect(result.exitCode).toBe(1);
    expect(result.message).toContain('Usage');
  });

  test('Missing PROJEN_GITHUB_TOKEN → exit 1', async () => {
    const mockOctokit = makeMockOctokit();
    const result = await verifyApproval({
      prNumber: '123',
      token: undefined,
      repository: VALID_REPO,
      octokit: mockOctokit,
    });
    expect(result.exitCode).toBe(1);
    expect(result.message).toContain('PROJEN_GITHUB_TOKEN');
  });

  test('Missing GITHUB_REPOSITORY → exit 1', async () => {
    const mockOctokit = makeMockOctokit();
    const result = await verifyApproval({
      prNumber: '123',
      token: VALID_TOKEN,
      repository: undefined,
      octokit: mockOctokit,
    });
    expect(result.exitCode).toBe(1);
    expect(result.message).toContain('PROJEN_GITHUB_TOKEN');
  });

  test('Wrong repository (not aws/aws-cdk) → exit 1', async () => {
    const mockOctokit = makeMockOctokit();
    const result = await verifyApproval({
      prNumber: '123',
      token: VALID_TOKEN,
      repository: 'other-org/other-repo',
      octokit: mockOctokit,
    });
    expect(result.exitCode).toBe(1);
    expect(result.message).toContain('Unexpected repository');
    expect(result.message).toContain('other-org/other-repo');
  });

  test('PR returns 404 → exit 1', async () => {
    const mockOctokit = makeMockOctokit({
      prResponse: { error: { status: 404, message: 'Not Found' } },
    });
    const result = await verifyApproval({
      prNumber: '999',
      token: VALID_TOKEN,
      repository: VALID_REPO,
      octokit: mockOctokit,
    });
    expect(result.exitCode).toBe(1);
    expect(result.message).toContain('not found');
  });

  test('PR returns 500 → exit 1', async () => {
    const mockOctokit = makeMockOctokit({
      prResponse: { error: { status: 500, message: 'Internal Server Error' } },
    });
    const result = await verifyApproval({
      prNumber: '123',
      token: VALID_TOKEN,
      repository: VALID_REPO,
      octokit: mockOctokit,
    });
    expect(result.exitCode).toBe(1);
    expect(result.message).toContain('HTTP 500');
  });

  test('PR is closed → exit 1', async () => {
    const mockOctokit = makeMockOctokit({
      prResponse: { data: closedPr() },
    });
    const result = await verifyApproval({
      prNumber: '123',
      token: VALID_TOKEN,
      repository: VALID_REPO,
      octokit: mockOctokit,
    });
    expect(result.exitCode).toBe(1);
    expect(result.message).toContain('closed');
    expect(result.message).toContain('only open PRs');
  });

  test('PR is merged → exit 1', async () => {
    const mockOctokit = makeMockOctokit({
      prResponse: { data: mergedPr() },
    });
    const result = await verifyApproval({
      prNumber: '123',
      token: VALID_TOKEN,
      repository: VALID_REPO,
      octokit: mockOctokit,
    });
    expect(result.exitCode).toBe(1);
    expect(result.message).toContain('merged');
  });

  test('Reviews returns 500 → exit 1', async () => {
    const mockOctokit = makeMockOctokit({
      prResponse: { data: openPr() },
      reviewsResponse: { error: { status: 500, message: 'error' } },
    });
    const result = await verifyApproval({
      prNumber: '123',
      token: VALID_TOKEN,
      repository: VALID_REPO,
      octokit: mockOctokit,
    });
    expect(result.exitCode).toBe(1);
    expect(result.message).toContain('Failed to fetch reviews');
  });

  test('No approvals → exit 1', async () => {
    const mockOctokit = makeMockOctokit({
      prResponse: { data: openPr() },
      reviewsResponse: { data: [commentReview('someone')] },
    });
    const result = await verifyApproval({
      prNumber: '123',
      token: VALID_TOKEN,
      repository: VALID_REPO,
      octokit: mockOctokit,
    });
    expect(result.exitCode).toBe(1);
    expect(result.message).toContain('no approvals');
  });

  test('All approvals stale → exit 1', async () => {
    const mockOctokit = makeMockOctokit({
      prResponse: { data: openPr() },
      reviewsResponse: { data: [approval('reviewer1', STALE_SHA), approval('reviewer2', STALE_SHA)] },
    });
    const result = await verifyApproval({
      prNumber: '123',
      token: VALID_TOKEN,
      repository: VALID_REPO,
      octokit: mockOctokit,
    });
    expect(result.exitCode).toBe(1);
    expect(result.message).toContain('no valid');
  });

  test('Approval from non-team member (membership returns 404) → exit 1', async () => {
    const mockOctokit = makeMockOctokit({
      prResponse: { data: openPr() },
      reviewsResponse: { data: [approval('outsider')] },
      membershipResponses: {
        outsider: { error: { status: 404, message: 'Not Found' } },
      },
    });
    const result = await verifyApproval({
      prNumber: '123',
      token: VALID_TOKEN,
      repository: VALID_REPO,
      octokit: mockOctokit,
    });
    expect(result.exitCode).toBe(1);
    expect(result.message).toContain('no valid');
  });

  test('Valid approval from team member → exit 0', async () => {
    const mockOctokit = makeMockOctokit({
      prResponse: { data: openPr() },
      reviewsResponse: { data: [approval('team-member')] },
      membershipResponses: {
        'team-member': { data: { state: 'active', role: 'member' } },
      },
    });
    const result = await verifyApproval({
      prNumber: '123',
      token: VALID_TOKEN,
      repository: VALID_REPO,
      octokit: mockOctokit,
    });
    expect(result.exitCode).toBe(0);
    expect(result.message).toContain('approved by CDK team member');
    expect(result.message).toContain('team-member');
  });

  test('Multiple approvals: one stale, one valid → exit 0', async () => {
    const mockOctokit = makeMockOctokit({
      prResponse: { data: openPr() },
      reviewsResponse: { data: [
        approval('stale-reviewer', STALE_SHA),
        approval('fresh-reviewer', HEAD_SHA),
      ]},
      membershipResponses: {
        'fresh-reviewer': { data: { state: 'active', role: 'member' } },
      },
    });
    const result = await verifyApproval({
      prNumber: '123',
      token: VALID_TOKEN,
      repository: VALID_REPO,
      octokit: mockOctokit,
    });
    expect(result.exitCode).toBe(0);
    expect(result.message).toContain('fresh-reviewer');
  });

  test('Multiple approvals: one non-team, one team → exit 0', async () => {
    const mockOctokit = makeMockOctokit({
      prResponse: { data: openPr() },
      reviewsResponse: { data: [approval('outsider'), approval('insider')] },
      membershipResponses: {
        outsider: { error: { status: 404, message: 'Not Found' } },
        insider: { data: { state: 'active', role: 'member' } },
      },
    });
    const result = await verifyApproval({
      prNumber: '123',
      token: VALID_TOKEN,
      repository: VALID_REPO,
      octokit: mockOctokit,
    });
    expect(result.exitCode).toBe(0);
    expect(result.message).toContain('insider');
  });

  test('Membership API returns 403 (rate limited) → treated as non-member', async () => {
    const mockOctokit = makeMockOctokit({
      prResponse: { data: openPr() },
      reviewsResponse: { data: [approval('rate-limited-user')] },
      membershipResponses: {
        'rate-limited-user': { error: { status: 403, message: 'API rate limit exceeded' } },
      },
    });
    const result = await verifyApproval({
      prNumber: '123',
      token: VALID_TOKEN,
      repository: VALID_REPO,
      octokit: mockOctokit,
    });
    expect(result.exitCode).toBe(1);
    expect(result.message).toContain('no valid');
  });

  test('Membership state is pending (invited but not accepted) → treated as non-member', async () => {
    const mockOctokit = makeMockOctokit({
      prResponse: { data: openPr() },
      reviewsResponse: { data: [approval('pending-user')] },
      membershipResponses: {
        'pending-user': { data: { state: 'pending', role: 'member' } },
      },
    });
    const result = await verifyApproval({
      prNumber: '123',
      token: VALID_TOKEN,
      repository: VALID_REPO,
      octokit: mockOctokit,
    });
    expect(result.exitCode).toBe(1);
    expect(result.message).toContain('no valid');
  });
});

describe('find-pr logic', () => {
  const testSha = 'aaa1111222233334444555566667777888899990000';

  test('0 PRs match SHA → fail', () => {
    const prs = [
      { number: 1, head: { sha: 'other-sha-1' }, base: { sha: 'base1' } },
      { number: 2, head: { sha: 'other-sha-2' }, base: { sha: 'base2' } },
    ];
    const result = findPr(prs, testSha);
    expect(result.success).toBe(false);
    expect(result.error).toContain('No open PR found');
    expect(result.error).toContain(testSha);
  });

  test('1 PR matches SHA → success, outputs correct', () => {
    const prs = [
      { number: 42, head: { sha: testSha }, base: { sha: 'base-sha-42' } },
      { number: 99, head: { sha: 'different' }, base: { sha: 'base-sha-99' } },
    ];
    const result = findPr(prs, testSha);
    expect(result.success).toBe(true);
    expect(result.outputs.pr_number).toBe('42');
    expect(result.outputs.head_sha).toBe(testSha);
    expect(result.outputs.base_sha).toBe('base-sha-42');
  });

  test('2+ PRs match SHA → fail', () => {
    const prs = [
      { number: 10, head: { sha: testSha }, base: { sha: 'base10' } },
      { number: 20, head: { sha: testSha }, base: { sha: 'base20' } },
      { number: 30, head: { sha: testSha }, base: { sha: 'base30' } },
    ];
    const result = findPr(prs, testSha);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Multiple PRs');
    expect(result.error).toContain('3');
  });

  test('Empty PR list → fail', () => {
    const result = findPr([], testSha);
    expect(result.success).toBe(false);
    expect(result.error).toContain('No open PR found');
  });
});
