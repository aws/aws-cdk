import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';
import { StatusEvent, PullRequestEvent } from '@octokit/webhooks-definitions/schema';
import { PullRequestLinter } from './lint';
import { LinterActions } from './linter-base';

async function run() {
  const token: string = process.env.GITHUB_TOKEN!;
  const client = new Octokit({ auth: token });

  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;

  // Try to get a SHA from various places
  let sha = process.env.PR_SHA;
  if (!sha && github.context.eventName.startsWith('pull_request')) {
    sha = (github.context.payload as PullRequestEvent)?.pull_request?.head?.sha;
  }
  if (!sha && github.context.eventName === 'status') {
    sha = (github.context.payload as StatusEvent)?.sha;
  }
  if (!sha) {
    throw new Error(`Could not determine a SHA from either \$PR_SHA or ${JSON.stringify(github.context.payload)}`);
  }

  let number = process.env.PR_NUMBER ? Number(process.env.PR_NUMBER) : undefined;
  if (number === undefined) {
    const pr = await PullRequestLinter.getPRFromCommit(client, owner, repo, sha);
    if (!pr && github.context.eventName === 'status') {
      // For a "status" event, apparently it's fine to not be able to find the PR
      console.error('Could not find appropriate PR for status event; exiting');
      process.exit(0);
    }

    if (pr) {
      number = pr.number;
    }
  }

  if (number === undefined) {
    throw new Error(`Could not determine PR number from either \$PR_NUMBER or the SHA: ${sha}`);
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
        const statusPayload = github.context.payload as StatusEvent;
        console.log('validating status event');
        actions = await prLinter.validateStatusEvent(statusPayload);
        break;

      default:
        actions = await prLinter.validatePullRequestTarget(sha);
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

void run();
