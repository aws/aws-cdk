import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';
import { StatusEvent, PullRequestEvent } from '@octokit/webhooks-definitions/schema';
import { PullRequestLinter } from './lint';

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

    switch (github.context.eventName) {
      case 'status':
        const statusPayload = github.context.payload as StatusEvent;
        const pr = await PullRequestLinter.getPRFromCommit(client, owner, repo, statusPayload.sha);
        if (pr) {
          console.log('validating status event');
          await prLinter.validateStatusEvent(pr, statusPayload);
        }
        break;

      default:
        await prLinter.validatePullRequestTarget(sha);
        break;
    }
  } catch (error: any) {
    // Fail the action
    core.setFailed(error.message);
  }
}

void run();
