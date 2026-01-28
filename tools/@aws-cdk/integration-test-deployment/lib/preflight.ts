import { getChangedSnapshots } from './utils';

/**
 * The GitHub team that can approve integration test deployments
 */
const CDK_TEAM = 'aws-cdk-team';
const CDK_ORG = 'aws';

/**
 * Result of the preflight check
 */
export interface PreflightResult {
  /** Whether the integration tests should run */
  shouldRun: boolean;
  /** Reason for the decision */
  reason: string;
}

/**
 * Check if a user is a member of the CDK team
 */
async function isCdkTeamMember(githubToken: string, username: string): Promise<boolean> {
  // Check team membership using GitHub API
  // GET /orgs/{org}/teams/{team_slug}/memberships/{username}
  const response = await fetch(
    `https://api.github.com/orgs/${CDK_ORG}/teams/${CDK_TEAM}/memberships/${username}`,
    {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    },
  );

  if (response.status === 200) {
    const membership = await response.json() as { state: string };
    return membership.state === 'active';
  }

  // 404 means not a member, other errors we'll treat as not a member
  return false;
}

/**
 * Check if integration tests should run based on PR state.
 *
 * Integration tests should run when:
 * 1. PR has snapshot changes AND
 * 2. Either:
 *    a. PR has the 'pr/needs-integration-tests-deployment' label (manual trigger), OR
 *    b. PR is approved by a CDK team member (@aws/aws-cdk-team)
 */
export async function shouldRunIntegTests(props: {
  githubToken: string;
  owner: string;
  repo: string;
  prNumber: number;
}): Promise<PreflightResult> {
  const { githubToken, owner, repo, prNumber } = props;

  // Check if PR has snapshot changes
  const changedSnapshots = await getChangedSnapshots();
  if (changedSnapshots.length === 0) {
    return {
      shouldRun: false,
      reason: 'No snapshot changes detected in this PR',
    };
  }

  // Fetch PR details to check labels
  const prResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`, {
    headers: {
      'Authorization': `token ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!prResponse.ok) {
    throw new Error(`Failed to fetch PR details: ${prResponse.status} ${prResponse.statusText}`);
  }

  const pr = await prResponse.json() as { labels: Array<{ name: string }> };

  // Check if PR has the manual trigger label
  const hasLabel = pr.labels.some((l: { name: string }) => l.name === 'pr/needs-integration-tests-deployment');
  if (hasLabel) {
    return {
      shouldRun: true,
      reason: 'PR has pr/needs-integration-tests-deployment label',
    };
  }

  // Fetch reviews to check for CDK team approval
  const reviewsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/reviews`, {
    headers: {
      'Authorization': `token ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!reviewsResponse.ok) {
    throw new Error(`Failed to fetch PR reviews: ${reviewsResponse.status} ${reviewsResponse.statusText}`);
  }

  const reviews = await reviewsResponse.json() as Array<{
    state: string;
    author_association: string;
    user: { login: string } | null;
  }>;

  // Get all approving reviewers
  const approvingReviewers = reviews
    .filter(review => review.state === 'APPROVED' && review.user?.login)
    .map(review => review.user!.login);

  // Check if any approving reviewer is a CDK team member
  for (const reviewer of approvingReviewers) {
    const isTeamMember = await isCdkTeamMember(githubToken, reviewer);
    if (isTeamMember) {
      return {
        shouldRun: true,
        reason: `PR has snapshot changes and is approved by CDK team member @${reviewer}`,
      };
    }
  }

  return {
    shouldRun: false,
    reason: `PR has snapshot changes but is not yet approved by a CDK team member (@${CDK_ORG}/${CDK_TEAM}). Add the pr/needs-integration-tests-deployment label to run manually.`,
  };
}
