/**
 * PR Issue Reference Check
 *
 * Validates that a pull request description contains a valid issue reference
 * in the expected location (first two non-empty lines), following the PR template.
 *
 * Called from the pr-issue-check.yml workflow via actions/github-script.
 */

const BOT_MARKER = '<!-- pr-issue-check-bot -->';

async function findBotComment(github, owner, repo, prNumber) {
  const { data: comments } = await github.rest.issues.listComments({
    owner, repo, issue_number: prNumber,
  });
  return comments.find(c => c.user.type === 'Bot' && c.body.includes(BOT_MARKER));
}

async function upsertComment(github, core, owner, repo, prNumber, message) {
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
  } catch (commentError) {
    core.warning(`Failed to post comment: ${commentError.message}`);
  }
}

async function deleteBotComment(github, core, owner, repo, prNumber) {
  try {
    const existing = await findBotComment(github, owner, repo, prNumber);
    if (existing) {
      await github.rest.issues.deleteComment({
        owner, repo, comment_id: existing.id,
      });
    }
  } catch (e) {
    core.warning(`Failed to delete comment: ${e.message}`);
  }
}

function buildMissingReferenceMessage(lines) {
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
      '',
      'GitHub keywords like `Closes`, `Fixes`, or `Resolves` are all supported.',
    ].join('\n');
  }

  const hasIssueHeading = /^#{1,4}\s*issue/i.test(lines[0] || '');
  if (hasIssueHeading) {
    return [
      '👋 It looks like your PR description follows the template but is missing a valid issue number in the first section.',
      '',
      'Please update the description to include a reference like `Closes #123`.',
      '',
      'GitHub keywords like `Closes`, `Fixes`, or `Resolves` are all supported.',
    ].join('\n');
  }

  return [
    '⚠️ This pull request description does not follow the correct template structure.',
    '',
    'Please update the description to follow the [PR template](https://github.com/aws/aws-cdk/blob/main/.github/PULL_REQUEST_TEMPLATE.md) and include a line like `Closes #123` in the Issue section.',
    '',
    'GitHub keywords like `Closes`, `Fixes`, or `Resolves` are all supported.',
  ].join('\n');
}

async function validateIssueReferences(github, owner, repo, issueNumbers) {
  const invalid = [];
  for (const num of issueNumbers) {
    try {
      const { data: issue } = await github.rest.issues.get({
        owner, repo, issue_number: num,
      });
      if (issue.pull_request) {
        invalid.push(`#${num} (is a pull request, not an issue)`);
      }
    } catch (e) {
      if (e.status === 404 || e.status === 410) {
        invalid.push(`#${num} (does not exist)`);
      } else {
        throw e;
      }
    }
  }
  return invalid;
}

module.exports = async ({ github, context, core }) => {
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
      '',
      'GitHub keywords like `Closes`, `Fixes`, or `Resolves` are all supported.',
    ].join('\n');

    await upsertComment(github, core, owner, repo, prNumber, message);
    core.setFailed('PR references invalid issues.');
    return;
  }

  await deleteBotComment(github, core, owner, repo, prNumber);
  console.log(`Valid issue(s) found: ${issueNumbers.map(n => '#' + n).join(', ')}`);
};
