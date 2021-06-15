import { mkdtempSync, readFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { App, Stack, Stage } from '@aws-cdk/core';
import { Pipeline, SynthStep } from '../../../lib';
import { GitHubEngine } from './engine';


test('pipeline with only a synth step', () => {
  const app = new App();

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
  const app = new App();

  const github = new GitHubEngine({
    workflowPath: `${mkoutdir()}/deploy.yml`,
  });

  const stage = new Stage(app, 'MyStack');
  new Stack(stage, 'MyStack');

  const pipeline = new Pipeline(app, 'MyPipeline', {
    engine: github,
    synthStep: new SynthStep('Build', {
      installCommands: ['yarn'],
      commands: ['yarn build'],
    }),
  });

  pipeline.addStage(stage);

  app.synth();

  expect(readFileSync(github.workflowPath, 'utf-8')).toMatchSnapshot();
});

function mkoutdir() {
  return mkdtempSync(join(tmpdir(), 'cdk-pipelines-github-'));
}