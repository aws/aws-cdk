/* eslint-disable import/no-extraneous-dependencies */
import * as fs from 'fs';
import * as path from 'path';
import { Construct } from 'constructs';
import { Capture, Match, Template } from '../../../assertions';
import { Stack, Stage, StageProps, Tags } from '../../../core';
import { OneStackApp, BucketStack, PIPELINE_ENV, TestApp, ModernTestGitHubNpmPipeline, stringLike } from '../testhelpers';

let app: TestApp;
let pipelineStack: Stack;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
});

afterEach(() => {
  app.cleanup();
});

test('stack templates in nested assemblies are correctly addressed', () => {

  // WHEN
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
  pipeline.addStage(new OneStackApp(app, 'App'));

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'App',
      Actions: Match.arrayWith([
        Match.objectLike({
          Name: stringLike('*Prepare'),
          InputArtifacts: [Match.objectLike({})],
          Configuration: Match.objectLike({
            StackName: 'App-Stack',
            TemplatePath: stringLike('*::assembly-App/*.template.json'),
          }),
        }),
      ]),
    }]),
  });
});

test('obvious error is thrown when stage contains no stacks', () => {

  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');

  // WHEN
  expect(() => {
    pipeline.addStage(new Stage(app, 'EmptyStage'));
  }).toThrow(/should contain at least one Stack/);
});

test('overridden stack names are respected', () => {

  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
  pipeline.addStage(new OneStackAppWithCustomName(app, 'App1'));
  pipeline.addStage(new OneStackAppWithCustomName(app, 'App2'));

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([
      {
        Name: 'App1',
        Actions: Match.arrayWith([Match.objectLike({
          Name: stringLike('*Prepare'),
          Configuration: Match.objectLike({
            StackName: 'MyFancyStack',
          }),
        })]),
      },
      {
        Name: 'App2',
        Actions: Match.arrayWith([Match.objectLike({
          Name: stringLike('*Prepare'),
          Configuration: Match.objectLike({
            StackName: 'MyFancyStack',
          }),
        })]),
      },
    ]),
  });
});

test('changing CLI version leads to a different pipeline structure (restarting it)', () => {

  // GIVEN
  const stack2 = new Stack(app, 'Stack2', { env: PIPELINE_ENV });
  const stack3 = new Stack(app, 'Stack3', { env: PIPELINE_ENV });

  // WHEN
  new ModernTestGitHubNpmPipeline(stack2, 'Cdk', {
    cliVersion: '1.2.3',
  });
  new ModernTestGitHubNpmPipeline(stack3, 'Cdk', {
    cliVersion: '4.5.6',
  });

  // THEN
  const structure2 = new Capture();
  const structure3 = new Capture();

  Template.fromStack(stack2).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: structure2,
  });
  Template.fromStack(stack3).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: structure3,
  });

  expect(JSON.stringify(structure2.asArray())).not.toEqual(JSON.stringify(structure3.asArray()));
});

test('tags get reflected in pipeline', () => {

  // WHEN
  const stage = new OneStackApp(app, 'App');
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
  Tags.of(stage).add('CostCenter', 'F00B4R');
  pipeline.addStage(stage);

  // THEN
  const templateConfig = new Capture();
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'App',
      Actions: Match.arrayWith([
        Match.objectLike({
          Name: stringLike('*Prepare'),
          InputArtifacts: [Match.objectLike({})],
          Configuration: Match.objectLike({
            StackName: 'App-Stack',
            TemplateConfiguration: templateConfig,
          }),
        }),
      ]),
    }]),
  });

  expect(templateConfig.asString()).toMatch(/::assembly-App\/.*\.template\..*json/);
  const [, relConfigFile] = templateConfig.asString().split('::');
  const absConfigFile = path.join(app.outdir, relConfigFile);
  const configFile = JSON.parse(fs.readFileSync(absConfigFile, { encoding: 'utf-8' }));
  expect(configFile).toEqual(expect.objectContaining({
    Tags: {
      CostCenter: 'F00B4R',
    },
  }));
});

class OneStackAppWithCustomName extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    new BucketStack(this, 'Stack', {
      stackName: 'MyFancyStack',
    });
  }
}
