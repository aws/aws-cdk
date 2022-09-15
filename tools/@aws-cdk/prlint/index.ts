import * as core from '@actions/core';
import * as github from '@actions/github';
import * as linter from './lint';

async function run() {
  const token: string = process.env.GITHUB_TOKEN!;
  const client = github.getOctokit(token).rest.pulls;

  const prLinter = new linter.PRLinter({
    client,
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    number: github.context.issue.number,
  });

  try {
    await prLinter.validate()
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()
