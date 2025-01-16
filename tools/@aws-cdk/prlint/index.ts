import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';
import { StatusEvent, PullRequestEvent } from '@octokit/webhooks-definitions/schema';
import { PullRequestLinter } from './lint';
import { LinterActions } from './linter-base';

/**
 * Entry point for PR linter
 *
 * This gets run as a GitHub action.
 *
 * To test locally, do the following:
 *
 * ```
 * env GITHUB_TOKEN=$(cat ~/.my-github-token) GITHUB_REPOSITORY=aws/aws-cdk PR_NUMBER=1234 npx ts-node ./index
 * ```
 */
async function run() {
  const token: string = process.env.GITHUB_TOKEN!;
  const client = new Octokit({ auth: token });

  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;

  const number = await determinePrNumber(client);
  if (!number) {
    if (github.context.eventName === 'status') {
      console.error(`Could not find PR belonging to status event, but that's not unusual. Skipping.`);
      process.exit(0);
    }
    throw new Error(`Could not find PR number from context.`);
  }

  try {
    const prLinter = new PullRequestLinter({
      client,
      owner,
      repo,
      number,
    });

    let actions: LinterActions | undefined;

    switch (github.context.eventName) {
      case 'status':
        // Triggering on a 'status' event is solely used to see if the CodeBuild
        // job just turned green, and adding certain 'ready for review' labels
        // if it does.
        const statusPayload = github.context.payload as StatusEvent;
        console.log('validating status event');
        actions = await prLinter.validateStatusEvent(statusPayload);
        break;

      default:
        // This is the main PR validator action.
        actions = await prLinter.validatePullRequestTarget();
        break;
    }

    if (actions) {
      console.log(actions);

      if (github.context.eventName || process.env.FOR_REAL) {
        console.log('Carrying out actions');

        // Actually running in GitHub actions, do it (otherwise we're just testing)
        await prLinter.executeActions(actions);
      }

      await prLinter.actionsToException(actions);
    }

  } catch (error: any) {
    // Fail the action
    core.setFailed(error.message);
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
  if (!sha) {
    throw new Error(`Could not determine a SHA from either \$PR_SHA or ${JSON.stringify(github.context.payload)}`);
  }

  const pr = await PullRequestLinter.getPRFromCommit(client, owner, repo, sha);
  return pr?.number;
}

run().catch(e => {
  console.error(e);
  process.exitCode = 1;
});
