import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';
import * as linter from './lint';
import { StatusEvent, PullRequestEvent } from '@octokit/webhooks-definitions/schema';

async function run() {
  const token: string = process.env.GITHUB_TOKEN!;
  const client = new Octokit({ auth: token });

  try {
    switch (github.context.eventName) {
      case 'status':
        const statusPayload = github.context.payload as StatusEvent;
        const pr = await linter.PullRequestLinter.getPRFromCommit(client, 'aws', 'aws-cdk', statusPayload.sha);
        if (pr) {
          const prLinter = new linter.PullRequestLinter({
            client,
            owner: 'aws',
            repo: 'aws-cdk',
            number: pr.number,
          });
          console.log('validating status event');
          await prLinter.validateStatusEvent(pr, github.context.payload as StatusEvent);
        }
        break;
      default:
        const payload = github.context.payload as PullRequestEvent;
        const prLinter = new linter.PullRequestLinter({
          client,
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          number: github.context.issue.number,
        });
        await prLinter.validatePullRequestTarget(payload.pull_request.head.sha);
    }
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run()
