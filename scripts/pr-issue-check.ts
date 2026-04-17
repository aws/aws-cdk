/**
 * PR Issue Reference Check
 *
 * Validates that a pull request description contains a valid issue reference
 * in the expected location (first two non-empty lines), following the PR template.
 *
 * Called from the pr-issue-check.yml workflow via actions/github-script.
 */

interface GitHubIssueComment {
  id: number;
  user: { type: string } | null;
  body?: string;
}

interface GitHubClient {
  rest: {
    issues: {
      listComments: (params: { owner: string; repo: string; issue_number: number }) => Promise<{ data: GitHubIssueComment[] }>;
      createComment: (params: { owner: string; repo: string; issue_number: number; body: string }) => Promise<unknown>;
      updateComment: (params: { owner: string; repo: string; comment_id: number; body: string }) => Promise<unknown>;
      deleteComment: (params: { owner: string; repo: string; comment_id: number }) => Promise<unknown>;
      get: (params: { owner: string; repo: string; issue_number: number }) => Promise<{ data: { pull_request?: unknown; state: string } }>;
    };
  };
}

interface ActionCore {
  setFailed: (message: string) => void;
  warning: (message: string) => void;
}

interface ActionContext {
  payload: {
    pull_request: {
      body: string | null;
      number: number;
    };
  };
  repo: { owner: string; repo: string };
}

interface ScriptArgs {
  github: GitHubClient;
  context: ActionContext;
  core: ActionCore;
}

const BOT_MARKER = '<!-- pr-issue-check-bot -->';

async function findBotComment(github: GitHubClient, owner: string, repo: string, prNumber: number): Promise<GitHubIssueComment | undefined> {
  const { data: comments } = await github.rest.issues.listComments({
    owner, repo, issue_number: prNumber,
  });
  return comments.find(c => c.user?.type === 'Bot' && c.body?.includes(BOT_MARKER));
}

async function upsertComment(github: GitHubClient, core: ActionCore, owner: string, repo: string, prNumber: number, message: string): Promise<void> {
  const markedMessage = `${BOT_MARKER}\n${message}`;
  try {
    const existing = await findBotComment(github, owner, repo, prNumber);
    if (existing) {
      await github.rest.issues.updateComment({
        owner, repo, comment_id: existing.id, body: markedMessage,
      });
    } else {
      await github.rest.issues.createComment({
        owner, repo, issue_number: prNumber, body: markedMessage,
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    core.warning(`Failed to post comment: ${message}`);
  }
}

async function deleteBotComment(github: GitHubClient, core: ActionCore, owner: string, repo: string, prNumber: number): Promise<void> {
  try {
    const existing = await findBotComment(github, owner, repo, prNumber);
    if (existing) {
      await github.rest.issues.deleteComment({
        owner, repo, comment_id: existing.id,
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    core.warning(`Failed to delete comment: ${message}`);
  }
}

export function buildMissingReferenceMessage(lines: string[]): string {
  const restOfBody = lines.slice(2).join('\n');
  const issueElsewhere = /#(\d+)/.test(restOfBody);

  if (issueElsewhere) {
    return [
      '👋 It looks like your PR description references an issue, but not in the expected location.',
      '',
      'The issue number must appear in the first section of the description (the first two lines), following the template format:',
      '```',
      '### Issue # (if applicable)',
      '',
      'Closes #123.',
      '```',
      'Please move your issue reference to the top of the description.',
    ].join('\n');
  }

  const hasIssueHeading = /^#{1,4}\s*issue/i.test(lines[0] || '');
  if (hasIssueHeading) {
    return [
      '👋 It looks like your PR description follows the template but is missing a valid issue number in the first section.',
      '',
      'PRs without a linked issue will receive lower priority for review and merging. Please update the description to include a reference like `Closes #123`. If no existing issue matches your change, [create one](https://github.com/aws/aws-cdk/issues/new/choose) first.',
    ].join('\n');
  }

  return [
    '⚠️ This pull request description does not follow the correct template structure.',
    '',
    'PRs without a linked issue will receive lower priority for review and merging. Please update the description to follow the [PR template](https://github.com/aws/aws-cdk/blob/main/.github/PULL_REQUEST_TEMPLATE.md) and include a line like `Closes #123` in the Issue section. If no existing issue matches your change, [create one](https://github.com/aws/aws-cdk/issues/new/choose) first.',
  ].join('\n');
}

interface GitHubApiError extends Error {
  status?: number;
}

export async function validateIssueReferences(github: GitHubClient, owner: string, repo: string, issueNumbers: number[]): Promise<string[]> {
  const invalid: string[] = [];
  for (const num of issueNumbers) {
    try {
      const { data: issue } = await github.rest.issues.get({
        owner, repo, issue_number: num,
      });
      if (issue.pull_request) {
        invalid.push(`#${num} (is a pull request, not an issue)`);
      }
    } catch (e: unknown) {
      const err = e as GitHubApiError;
      if (err.status === 404 || err.status === 410) {
        invalid.push(`#${num} (does not exist)`);
      } else {
        throw e;
      }
    }
  }
  return invalid;
}

export default async function prIssueCheck({ github, context, core }: ScriptArgs): Promise<void> {
  const body = context.payload.pull_request.body || '';
  const prNumber = context.payload.pull_request.number;
  const owner = context.repo.owner;
  const repo = context.repo.repo;

  const lines = body.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const firstTwo = lines.slice(0, 2).join('\n');
  const issuePattern = /#(\d+)/g;
  const matches = [...firstTwo.matchAll(issuePattern)];

  if (matches.length === 0) {
    const message = buildMissingReferenceMessage(lines);
    await upsertComment(github, core, owner, repo, prNumber, message);
    core.setFailed('PR description is missing a valid issue reference.');
    return;
  }

  const issueNumbers = matches.map(m => parseInt(m[1], 10));
  const invalid = await validateIssueReferences(github, owner, repo, issueNumbers);

  if (invalid.length > 0) {
    const list = invalid.join('\n- ');
    const message = [
      '⚠️ The following issue reference(s) in your PR description are not valid issues:',
      '',
      `- ${list}`,
      '',
      'Please make sure your PR references an existing issue using the format `Closes #123`.',
    ].join('\n');

    await upsertComment(github, core, owner, repo, prNumber, message);
    core.setFailed('PR references invalid issues.');
    return;
  }

  await deleteBotComment(github, core, owner, repo, prNumber);
  console.log(`Valid issue(s) found: ${issueNumbers.map(n => '#' + n).join(', ')}`);
}
