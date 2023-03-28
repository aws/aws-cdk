import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';
import * as linter from './lint';

async function run() {
  const token: string = process.env.GITHUB_TOKEN!;
  const client = new Octokit({ auth: token });

  const prLinter = new linter.PullRequestLinter({
    client,
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    number: github.context.issue.number,
  });

  try {
    await prLinter.validate()
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run()
