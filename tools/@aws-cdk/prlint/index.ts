import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';
import { StatusEvent, PullRequestEvent } from '@octokit/webhooks-definitions/schema';
import * as linter from './lint';

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
      case 'workflow_run':
        const prNumber = process.env.PR_NUMBER;
        const prSha = process.env.PR_SHA;
        if (!prNumber || !prSha) {
          throw new Error(`Cannot have undefined values in: ${prNumber} pr number and ${prSha} pr sha.`)
        }
        const workflowPrLinter = new linter.PullRequestLinter({
          client,
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          number: Number(prNumber),
        });
        await workflowPrLinter.validatePullRequestTarget(prSha);
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

void run();
