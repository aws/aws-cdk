#!/usr/bin/env node
/**
 * Verifies that a PR is in an approved state by a CDK team member.
 *
 * Usage: node verify-approval.js <pr_number>
 *
 * Env: GITHUB_TOKEN - token with read:org scope (for team membership check)
 *      GITHUB_REPOSITORY - owner/repo (e.g. "aws/aws-cdk")
 *
 * Exit code: 0 if approved by a CDK team member (non-stale), 1 otherwise
 */
'use strict';

const https = require('https');

function githubApi(path, token) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.github.com',
      path,
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'aws-cdk-integ-test-trigger',
      },
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, body: JSON.parse(data) });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  const prNumber = process.argv[2];
  if (!prNumber) {
    console.error('Usage: verify-approval.js <pr_number>');
    process.exit(1);
  }

  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  if (!token || !repository) {
    console.error('GITHUB_TOKEN and GITHUB_REPOSITORY env vars required');
    process.exit(1);
  }

  const [owner, repo] = repository.split('/');

  // Get current PR head SHA
  const { body: pr } = await githubApi(`/repos/${owner}/${repo}/pulls/${prNumber}`, token);
  const currentHead = pr.head.sha;

  // List reviews
  const { body: reviews } = await githubApi(`/repos/${owner}/${repo}/pulls/${prNumber}/reviews`, token);
  const approvals = reviews.filter(r => r.state === 'APPROVED');

  if (approvals.length === 0) {
    console.error(`PR #${prNumber} has no approvals`);
    process.exit(1);
  }

  // Check each approval: must be non-stale and from a CDK team member
  for (const review of approvals) {
    if (review.commit_id !== currentHead) {
      console.error(`Approval from ${review.user.login} is stale (approved ${review.commit_id.slice(0, 7)}, head is now ${currentHead.slice(0, 7)})`);
      continue;
    }

    // Check team membership
    const { status } = await githubApi(`/orgs/${owner}/teams/aws-cdk-team/memberships/${review.user.login}`, token);
    if (status === 200) {
      console.log(`PR #${prNumber} is approved by CDK team member: ${review.user.login}`);
      process.exit(0);
    }
  }

  console.error(`PR #${prNumber} has no valid (non-stale) approval from a CDK team member`);
  process.exit(1);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
