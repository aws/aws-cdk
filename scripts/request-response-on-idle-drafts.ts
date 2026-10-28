/**
 * Request Response on Idle Drafts
 *
 * Asks for a response on open draft PRs that have had no activity for a number of days.
 *
 * For each idle draft it posts a comment and then adds the `response-requested` label.
 * The "Close Stale Issues" workflow (close-stale-issues.yml) does the rest: 2 days after
 * the comment it adds `closing-soon`, and 5 days after that it closes the PR with
 * `closed-for-staleness`. A comment from a person before then removes the labels.
 *
 * Activity is the most recent of: PR creation, the latest commit, or the latest comment by
 * a person. Comments by bots and automation accounts don't count. GitHub's `updatedAt` is
 * not used because label sweeps by automation bump it on every PR.
 *
 * Drafts with `response-requested`, `closing-soon` or `no-autoclose` are skipped.
 *
 * Called from the request-response-on-idle-drafts.yml workflow via actions/github-script,
 * which provides the authenticated Octokit client.
 *
 * Env: DAYS_THRESHOLD - days without activity before asking (default 90)
 *      MAX_PER_RUN    - most drafts to act on in one run (default 50)
 *      DRY_RUN        - "true" to only log what would happen
 */

import type { GitHub } from '@actions/github/lib/utils';
import type { Context } from '@actions/github/lib/context';
import type * as core from '@actions/core';

type GitHubClient = InstanceType<typeof GitHub>;
type ActionCore = typeof core;

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

interface Author {
  __typename: string;
  login: string;
}

export interface DraftNode {
  number: number;
  title: string;
  createdAt: string;
  labels: { nodes: Array<{ name: string }> };
  commits: { nodes: Array<{ commit: { committedDate: string } }> };
  comments: { nodes: Array<{ createdAt: string; author: Author | null }> };
}

interface SearchResult {
  search: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: Array<DraftNode | null>;
  };
}

export interface IdleDraft {
  number: number;
  title: string;
  lastActivity: Date;
}

export interface RunResult {
  cutoff: Date;
  scanned: number;
  idle: IdleDraft[];
  done: IdleDraft[];
  errors: Array<{ number: number; error: string }>;
}

export interface RequestResponseOptions {
  github: GitHubClient;
  owner: string;
  repo: string;
  days: number;
  maxPerRun: number;
  dryRun: boolean;
  now?: Date;
  log?: (msg: string) => void;
}

export function buildMessage(days: number): string {
  return [
    `This draft PR has had no activity for ${days} days.`,
    '',
    'If you are still working on it, please leave a comment or push a commit, and mark it ready for review when it is done.',
    'If there is no response, this PR will be closed in 7 days.',
    '',
    'To keep a draft open longer, a maintainer can add the `no-autoclose` label.',
  ].join('\n');
}

function isPerson(author: Author | null): boolean {
  return author !== null
    && author.__typename !== 'Bot'
    && !AUTOMATION_LOGINS.includes(author.login.replace(/\[bot\]$/, ''));
}

/**
 * Returns the time of the most recent activity on a PR from the search result.
 */
export function lastActivity(pr: DraftNode): Date {
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
export function findIdleDrafts(drafts: DraftNode[], cutoff: Date): IdleDraft[] {
  return drafts
    .filter((pr) => !pr.labels.nodes.some((l) => SKIP_LABELS.includes(l.name)))
    .map((pr) => ({ number: pr.number, title: pr.title, lastActivity: lastActivity(pr) }))
    .filter((pr) => pr.lastActivity < cutoff)
    .sort((a, b) => a.lastActivity.getTime() - b.lastActivity.getTime());
}

/**
 * Lists all open drafts in the repository, skipping drafts that carry a skip label.
 */
async function listDrafts(github: GitHubClient, owner: string, repo: string): Promise<DraftNode[]> {
  const q = `repo:${owner}/${repo} is:pr is:open draft:true ${SKIP_LABELS.map((l) => `-label:${l}`).join(' ')}`;
  const drafts: DraftNode[] = [];
  let cursor: string | null = null;
  do {
    const { search }: SearchResult = await github.graphql<SearchResult>(SEARCH_QUERY, { q, cursor });
    drafts.push(...search.nodes.filter((n): n is DraftNode => Boolean(n && n.number)));
    cursor = search.pageInfo.hasNextPage ? search.pageInfo.endCursor : null;
  } while (cursor);
  return drafts;
}

/**
 * Finds idle drafts and asks for a response on each. Returns what it did.
 */
export async function requestResponseOnIdleDrafts({
  github, owner, repo, days, maxPerRun, dryRun, now = new Date(), log = console.log,
}: RequestResponseOptions): Promise<RunResult> {
  const cutoff = new Date(now.getTime() - days * DAY_MS);
  const drafts = await listDrafts(github, owner, repo);
  const idle = findIdleDrafts(drafts, cutoff);
  log(`Found ${drafts.length} open drafts, ${idle.length} with no activity since ${cutoff.toISOString()}`);

  const body = buildMessage(days);
  const done: IdleDraft[] = [];
  const errors: RunResult['errors'] = [];
  for (const pr of idle.slice(0, maxPerRun)) {
    if (dryRun) {
      log(`dry run: would ask for a response on #${pr.number} (last activity ${pr.lastActivity.toISOString()})`);
      done.push(pr);
      continue;
    }
    try {
      // Order matters: comment first, then label. close-stale-issues.yml removes the
      // label when the newest comment is later than the label.
      await github.rest.issues.createComment({ owner, repo, issue_number: pr.number, body });
      await github.rest.issues.addLabels({ owner, repo, issue_number: pr.number, labels: [RESPONSE_LABEL] });
      log(`asked for a response on #${pr.number} (last activity ${pr.lastActivity.toISOString()})`);
      done.push(pr);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : String(err);
      log(`failed on #${pr.number}: ${error}`);
      errors.push({ number: pr.number, error });
    }
  }
  return { cutoff, scanned: drafts.length, idle, done, errors };
}

/**
 * Entry point for actions/github-script.
 */
export async function run({ github, context, core }: { github: GitHubClient; context: Context; core: ActionCore }): Promise<void> {
  const settings = {
    days: parseInt(process.env.DAYS_THRESHOLD ?? '', 10) || 90,
    maxPerRun: parseInt(process.env.MAX_PER_RUN ?? '', 10) || 50,
    dryRun: process.env.DRY_RUN === 'true',
  };
  const result = await requestResponseOnIdleDrafts({
    github,
    owner: context.repo.owner,
    repo: context.repo.repo,
    log: (msg) => core.info(msg),
    ...settings,
  });

  core.summary.addHeading('Request Response on Idle Drafts', 2);
  core.summary.addRaw(`Threshold: ${settings.days} days | Cutoff: ${result.cutoff.toISOString()} | Drafts scanned: ${result.scanned} | Idle: ${result.idle.length} | Max per run: ${settings.maxPerRun}${settings.dryRun ? ' | DRY RUN' : ''}`, true);
  if (result.done.length > 0) {
    core.summary.addTable([
      [{ data: 'PR', header: true }, { data: 'Title', header: true }, { data: 'Last activity', header: true }],
      ...result.done.map((pr) => [`#${pr.number}`, pr.title, pr.lastActivity.toISOString()]),
    ]);
  } else {
    core.summary.addRaw('No idle drafts.', true);
  }
  if (result.errors.length > 0) {
    core.summary.addHeading('Errors', 3);
    core.summary.addTable([
      [{ data: 'PR', header: true }, { data: 'Error', header: true }],
      ...result.errors.map((e) => [`#${e.number}`, e.error]),
    ]);
    core.setFailed(`Failed on ${result.errors.length} draft(s)`);
  }
  await core.summary.write();
}
