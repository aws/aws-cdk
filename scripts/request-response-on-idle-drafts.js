#!/usr/bin/env node
/**
 * Asks for a response on open draft PRs that have had no activity for a number of days.
 *
 * For each idle draft it posts a comment and then adds the `response-requested` label.
 * The "Close Stale Issues" workflow (close-stale-issues.yml) does the rest: about 2 days
 * after the comment it adds `closing-soon`, and about 5 days after that it closes the PR
 * with `closed-for-staleness`. A comment from a person before then removes the labels.
 *
 * Activity is the most recent of: PR creation, the latest commit, or the latest comment by
 * a person. Comments by bots and automation accounts don't count. GitHub's `updatedAt` is
 * not used because label sweeps by automation bump it on every PR.
 *
 * Drafts with `response-requested`, `closing-soon` or `no-autoclose` are skipped.
 *
 * Usage: node request-response-on-idle-drafts.js
 *
 * Env: GITHUB_TOKEN      - token with pull-requests: write
 *      GITHUB_REPOSITORY - owner/repo (e.g. "aws/aws-cdk")
 *      DAYS_THRESHOLD    - days without activity before asking (default 90)
 *      MAX_PER_RUN       - most drafts to act on in one run (default 50)
 *      DRY_RUN           - "true" to only log what would happen
 *      GITHUB_STEP_SUMMARY - set by GitHub Actions; a summary table is appended to it
 */
'use strict';

const RESPONSE_LABEL = 'response-requested';
const SKIP_LABELS = ['response-requested', 'closing-soon', 'no-autoclose'];
// Accounts whose comments are automation, not a person responding.
const AUTOMATION_LOGINS = ['aws-cdk-automation', 'github-actions', 'mergify', 'dependabot'];
const DAY_MS = 24 * 60 * 60 * 1000;

const SEARCH_QUERY = `query($q: String!, $cursor: String) {
  search(query: $q, type: ISSUE, first: 50, after: $cursor) {
    pageInfo { hasNextPage endCursor }
    nodes {
      ... on PullRequest {
        number
        title
        createdAt
        labels(first: 50) { nodes { name } }
        commits(last: 1) { nodes { commit { committedDate } } }
        comments(last: 50) { nodes { createdAt author { __typename login } } }
      }
    }
  }
}`;

function buildMessage(days) {
  return [
    `This draft PR has had no activity for ${days} days.`,
    '',
    'If you are still working on it, please leave a comment or push a commit, and mark it ready for review when it is done.',
    'If there is no response, this PR will be closed in about a week. You can reopen it at any time.',
    '',
    'To keep a draft open longer, a maintainer can add the `no-autoclose` label.',
  ].join('\n');
}

function isPerson(author) {
  return Boolean(author)
    && author.__typename !== 'Bot'
    && !AUTOMATION_LOGINS.includes(author.login.replace(/\[bot\]$/, ''));
}

/**
 * Returns the time of the most recent activity on a PR from the search result.
 */
function lastActivity(pr) {
  const times = [Date.parse(pr.createdAt)];
  const commit = pr.commits.nodes[0];
  if (commit) {
    times.push(Date.parse(commit.commit.committedDate));
  }
  for (const comment of pr.comments.nodes) {
    if (isPerson(comment.author)) {
      times.push(Date.parse(comment.createdAt));
    }
  }
  return new Date(Math.max(...times));
}

/**
 * Returns the drafts with no activity since `cutoff`, oldest first.
 */
function findIdleDrafts(drafts, cutoff) {
  return drafts
    .filter((pr) => !pr.labels.nodes.some((l) => SKIP_LABELS.includes(l.name)))
    .map((pr) => ({ number: pr.number, title: pr.title, lastActivity: lastActivity(pr) }))
    .filter((pr) => pr.lastActivity < cutoff)
    .sort((a, b) => a.lastActivity - b.lastActivity);
}

/**
 * Makes a GitHub API request. Returns the parsed JSON body, or throws on a non-2xx status.
 */
async function githubFetch(path, token, { method = 'GET', body } = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'aws-cdk-request-response-on-idle-drafts',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(`${method} ${path} failed with ${response.status}: ${data.message ?? text}`);
  }
  if (data.errors) {
    throw new Error(`${method} ${path} returned errors: ${JSON.stringify(data.errors)}`);
  }
  return data;
}

/**
 * Lists all open drafts in the repository, skipping drafts that carry a skip label.
 */
async function listDrafts(api, owner, repo) {
  const q = `repo:${owner}/${repo} is:pr is:open draft:true ${SKIP_LABELS.map((l) => `-label:${l}`).join(' ')}`;
  const drafts = [];
  let cursor = null;
  do {
    const res = await api('/graphql', { method: 'POST', body: { query: SEARCH_QUERY, variables: { q, cursor } } });
    const search = res.data.search;
    drafts.push(...search.nodes.filter((n) => n && n.number));
    cursor = search.pageInfo.hasNextPage ? search.pageInfo.endCursor : null;
  } while (cursor);
  return drafts;
}

/**
 * Finds idle drafts and asks for a response on each. Returns what it did.
 *
 * @param {object} opts
 * @param {(path: string, init?: object) => Promise<any>} opts.api - GitHub API caller
 * @param {string} opts.owner
 * @param {string} opts.repo
 * @param {number} opts.days
 * @param {number} opts.maxPerRun
 * @param {boolean} opts.dryRun
 * @param {Date} [opts.now]
 * @param {(msg: string) => void} [opts.log]
 */
async function requestResponseOnIdleDrafts({ api, owner, repo, days, maxPerRun, dryRun, now = new Date(), log = console.log }) {
  const cutoff = new Date(now.getTime() - days * DAY_MS);
  const drafts = await listDrafts(api, owner, repo);
  const idle = findIdleDrafts(drafts, cutoff);
  log(`Found ${drafts.length} open drafts, ${idle.length} with no activity since ${cutoff.toISOString()}`);

  const message = buildMessage(days);
  const done = [];
  const errors = [];
  for (const pr of idle.slice(0, maxPerRun)) {
    if (dryRun) {
      log(`dry run: would ask for a response on #${pr.number} (last activity ${pr.lastActivity.toISOString()})`);
      done.push(pr);
      continue;
    }
    try {
      // Order matters: comment first, then label. close-stale-issues.yml removes the
      // label when the newest comment is later than the label.
      await api(`/repos/${owner}/${repo}/issues/${pr.number}/comments`, { method: 'POST', body: { body: message } });
      await api(`/repos/${owner}/${repo}/issues/${pr.number}/labels`, { method: 'POST', body: { labels: [RESPONSE_LABEL] } });
      log(`asked for a response on #${pr.number} (last activity ${pr.lastActivity.toISOString()})`);
      done.push(pr);
    } catch (err) {
      log(`failed on #${pr.number}: ${err.message}`);
      errors.push({ number: pr.number, error: err.message });
    }
  }
  return { cutoff, scanned: drafts.length, idle, done, errors };
}

function renderSummary({ cutoff, scanned, idle, done, errors }, { days, maxPerRun, dryRun }) {
  const lines = [
    '## Request Response on Idle Drafts',
    '',
    `Threshold: ${days} days | Cutoff: ${cutoff.toISOString()} | Drafts scanned: ${scanned} | Idle: ${idle.length} | Max per run: ${maxPerRun}${dryRun ? ' | DRY RUN' : ''}`,
    '',
  ];
  if (done.length > 0) {
    lines.push('| PR | Title | Last activity |', '|---|---|---|');
    for (const pr of done) {
      lines.push(`| #${pr.number} | ${pr.title.replace(/\|/g, '\\|')} | ${pr.lastActivity.toISOString()} |`);
    }
  } else {
    lines.push('No idle drafts.');
  }
  if (errors.length > 0) {
    lines.push('', '### Errors', '', '| PR | Error |', '|---|---|');
    for (const e of errors) {
      lines.push(`| #${e.number} | ${e.error.replace(/\|/g, '\\|')} |`);
    }
  }
  return lines.join('\n') + '\n';
}

if (require.main === module) {
  (async () => {
    const token = process.env.GITHUB_TOKEN;
    const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
    if (!token || !owner || !repo) {
      throw new Error('GITHUB_TOKEN and GITHUB_REPOSITORY must be set');
    }
    const settings = {
      days: parseInt(process.env.DAYS_THRESHOLD, 10) || 90,
      maxPerRun: parseInt(process.env.MAX_PER_RUN, 10) || 50,
      dryRun: process.env.DRY_RUN === 'true',
    };
    const result = await requestResponseOnIdleDrafts({
      api: (path, init) => githubFetch(path, token, init),
      owner,
      repo,
      ...settings,
    });
    if (process.env.GITHUB_STEP_SUMMARY) {
      require('fs').appendFileSync(process.env.GITHUB_STEP_SUMMARY, renderSummary(result, settings));
    }
    if (result.errors.length > 0) {
      process.exitCode = 1;
    }
  })().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}

module.exports = { requestResponseOnIdleDrafts, findIdleDrafts, lastActivity, buildMessage, renderSummary, githubFetch };
