import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';
import { StatusEvent, PullRequestEvent, CheckSuiteEvent } from '@octokit/webhooks-definitions/schema';
import { PullRequestLinter } from './lint';
import { DEFAULT_LINTER_LOGIN } from './constants';

/**
 * Entry point for PR linter
 *
 * This gets run as a GitHub action.
 *
 * To test locally, do the following:
 *
 * ```
 * env GITHUB_TOKEN=$(cat ~/.my-github-token) LINTER_LOGIN=my-gh-alias GITHUB_REPOSITORY=aws/aws-cdk PR_NUMBER=1234 npx ts-node ./index
 * ```
 */
async function run() {
  const token: string = process.env.GITHUB_TOKEN!;
  const client = new Octokit({ auth: token });

  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;

  const number = await determinePrNumber(client);
  if (!number) {
    if (['check_suite', 'status'].includes(github.context.eventName)) {
      console.error(`Could not find PR belonging to event, but that's not unusual. Skipping.`);
      process.exit(0);
    }

    throw new Error(`Could not determine a PR number from either \$PR_NUMBER or \$PR_SHA or ${github.context.eventName}: ${JSON.stringify(github.context.payload)}`);
  }

  const prLinter = new PullRequestLinter({
    client,
    owner,
    repo,
    number,
    // On purpose || instead of ??, also collapse empty string
    linterLogin: process.env.LINTER_LOGIN || DEFAULT_LINTER_LOGIN,
  });

  const actions = await prLinter.validatePullRequestTarget();

  if (actions) {
    console.log(actions);

    if (github.context.eventName || process.env.FOR_REAL) {
      console.log('Carrying out actions');

      // Actually running in GitHub actions, do it (otherwise we're just testing)
      await prLinter.executeActions(actions);
    }
  }
}

async function determinePrNumber(client: Octokit): Promise<number | undefined> {
  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;

  if (process.env.PR_NUMBER) {
    return Number(process.env.PR_NUMBER);
  }
  if (github.context.eventName.startsWith('pull_request')) {
    return (github.context.payload as PullRequestEvent).pull_request.number;
  }

  // If we don't have PR_NUMBER, try to find a SHA and convert that into a PR number
  let sha = process.env.PR_SHA;
  if (!sha && github.context.eventName === 'status') {
    sha = (github.context.payload as StatusEvent)?.sha;
  }
  if (!sha && github.context.eventName === 'check_suite') {
    // For a check_suite event, take the SHA and try to find a PR for it.
    sha = (github.context.payload as CheckSuiteEvent)?.check_suite.head_sha;
  }
  if (!sha) {
    return undefined;
    throw new Error(`Could not determine a SHA from either \$PR_SHA or ${JSON.stringify(github.context.payload)}`);
  }

  const pr = await PullRequestLinter.getPRFromCommit(client, owner, repo, sha);
  return pr?.number;
}

run().catch(e => {
  console.error(e);
  process.exitCode = 1;
});
