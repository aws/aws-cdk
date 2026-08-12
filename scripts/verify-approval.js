#!/usr/bin/env node
/**
 * Verifies that a PR is in an approved state by a CDK team member.
 *
 * Usage: node verify-approval.js <pr_number>
 *
 * Env: PROJEN_GITHUB_TOKEN - token with read:org scope (for team membership check)
 *      GITHUB_REPOSITORY - owner/repo (e.g. "aws/aws-cdk")
 *
 * Exit code: 0 if approved by a CDK team member (non-stale), 1 otherwise
 */
'use strict';

/**
 * Core verification logic. Returns { exitCode, message }.
 *
 * @param {object} options
 * @param {string} options.prNumber - PR number to verify
 * @param {string} options.token - GitHub token with read:org scope
 * @param {string} options.repository - owner/repo string
 * @param {object} [options.octokit] - Octokit instance (injected for testing)
 */
async function verifyApproval({ prNumber, token, repository, octokit }) {
  if (!prNumber) {
    return { exitCode: 1, message: 'Usage: verify-approval.js <pr_number>' };
  }

  if (!token || !repository) {
    return { exitCode: 1, message: 'PROJEN_GITHUB_TOKEN and GITHUB_REPOSITORY env vars required' };
  }

  const [owner, repo] = repository.split('/');

  // Assertion: this script verifies CDK maintainer approvals which are scoped
  // to the aws/aws-cdk repository and the aws-cdk-team within the aws org.
  if (owner !== 'aws' || repo !== 'aws-cdk') {
    return { exitCode: 1, message: `Unexpected repository: ${repository} (expected aws/aws-cdk)` };
  }

  // Get current PR head SHA
  let pr;
  try {
    const response = await octokit.rest.pulls.get({ owner, repo, pull_number: Number(prNumber) });
    pr = response.data;
  } catch (err) {
    if (err.status === 404) {
      return { exitCode: 1, message: `PR #${prNumber} not found` };
    }
    return { exitCode: 1, message: `Failed to fetch PR #${prNumber}: HTTP ${err.status}` };
  }

  if (pr.state !== 'open') {
    return { exitCode: 1, message: `PR #${prNumber} is ${pr.state}, skipping (only open PRs are eligible)` };
  }

  const currentHead = pr.head.sha;

  // List reviews
  let reviews;
  try {
    const response = await octokit.rest.pulls.listReviews({ owner, repo, pull_number: Number(prNumber) });
    reviews = response.data;
  } catch (err) {
    return { exitCode: 1, message: `Failed to fetch reviews for PR #${prNumber}: HTTP ${err.status}` };
  }

  const approvals = reviews.filter(r => r.state === 'APPROVED');

  if (approvals.length === 0) {
    return { exitCode: 1, message: `PR #${prNumber} has no approvals` };
  }

  // Check each approval: must be non-stale and from a CDK team member
  for (const review of approvals) {
    if (review.commit_id !== currentHead) {
      continue;
    }

    // Check team membership
    // Returns { state: "active"|"pending", role: "member"|"maintainer" } on 200,
    // or throws with status 404 if user is not a member of the team.
    try {
      const { data: membership } = await octokit.rest.teams.getMembershipForUserInOrg({
        org: owner,
        team_slug: 'aws-cdk-team',
        username: review.user.login,
      });
      if (membership.state === 'active') {
        return { exitCode: 0, message: `PR #${prNumber} is approved by CDK team member: ${review.user.login}` };
      }
    } catch (err) {
      // 404 = not a member, 403 = rate limited — treat both as non-member
      continue;
    }
  }

  return { exitCode: 1, message: `PR #${prNumber} has no valid (non-stale) approval from a CDK team member` };
}

// Only execute when run directly from command line (skipped when imported by tests)
if (require.main === module) {
  (async () => {
    const { Octokit } = require('@octokit/rest');

    const token = process.env.PROJEN_GITHUB_TOKEN;
    const octokit = new Octokit({
      auth: token,
      userAgent: 'aws-cdk-integ-test-trigger',
      log: {
        debug: () => {},
        info: () => {},
        warn: () => {},
        error: () => {},
      },
    });

    const result = await verifyApproval({
      prNumber: process.argv[2],
      token,
      repository: process.env.GITHUB_REPOSITORY,
      octokit,
    });

    if (result.exitCode === 0) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
    process.exit(result.exitCode);
  })().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}

module.exports = { verifyApproval };
