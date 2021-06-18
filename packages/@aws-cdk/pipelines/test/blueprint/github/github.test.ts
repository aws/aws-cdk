import { mkdtempSync, readFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { Stack, Stage } from '@aws-cdk/core';
import { Pipeline, SynthStep } from '../../../lib';
import { TestApp } from '../testutil';
import { GitHubExampleApp } from './example-app';
import { GitHubEngine } from './github-engine';

test('pipeline with only a synth step', () => {
  const app = new TestApp();

  const github = new GitHubEngine({
    workflowPath: `${mkoutdir()}/deploy.yml`,
  });

  new Pipeline(app, 'Pipeline', {
    engine: github,
    synthStep: new SynthStep('Build', {
      installCommands: ['yarn'],
      commands: ['yarn build'],
    }),
  });

  app.synth();

  expect(readFileSync(github.workflowPath, 'utf-8')).toMatchSnapshot();
});

test('single wave/stage/stack', () => {
  const app = new TestApp();

  const github = new GitHubEngine({
    workflowPath: `${mkoutdir()}/deploy.yml`,
  });

  const stage = new Stage(app, 'MyStack', {
    env: { account: '111111111111', region: 'us-east-1' },
  });

  const stack = new Stack(stage, 'MyStack');

  new lambda.Function(stack, 'Function', {
    code: lambda.Code.fromAsset(join(__dirname, 'fixtures')),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_14_X,
  });

  const pipeline = new Pipeline(app, 'MyPipeline', {
    engine: github,
    synthStep: new SynthStep('Build', {
      // installCommands: ['yarn'],
      commands: ['echo "nothing to do"'],
    }),
  });

  pipeline.addStage(stage);

  app.synth();

  expect(readFileSync(github.workflowPath, 'utf-8')).toMatchSnapshot();
});

test('example app', () => {
  const repoDir = mkoutdir();
  const app = new GitHubExampleApp({
    repoDir: repoDir,
    envA: 'aws://111111111111/us-east-1',
    envB: 'aws://222222222222/eu-west-2',
  });
  app.synth();
  expect(readFileSync(join(repoDir, '.github/workflows/deploy.yml'), 'utf-8')).toMatchSnapshot();
});

function mkoutdir() {
  return mkdtempSync(join(tmpdir(), 'cdk-pipelines-github-'));
}