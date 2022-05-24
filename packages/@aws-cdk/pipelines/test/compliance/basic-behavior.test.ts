/* eslint-disable import/no-extraneous-dependencies */
import * as fs from 'fs';
import * as path from 'path';
import { Capture, Match, Template } from '@aws-cdk/assertions';
import { Stack, Stage, StageProps, Tags } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { behavior, LegacyTestGitHubNpmPipeline, OneStackApp, BucketStack, PIPELINE_ENV, TestApp, ModernTestGitHubNpmPipeline, stringLike } from '../testhelpers';

let app: TestApp;
let pipelineStack: Stack;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
});

afterEach(() => {
  app.cleanup();
});

behavior('stack templates in nested assemblies are correctly addressed', (suite) => {
  suite.legacy(() => {
    // WHEN
    const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    pipeline.addApplicationStage(new OneStackApp(app, 'App'));

    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
    // WHEN
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    pipeline.addStage(new OneStackApp(app, 'App'));

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
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
  }
});

behavior('obvious error is thrown when stage contains no stacks', (suite) => {
  suite.legacy(() => {
    const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');

    // WHEN
    expect(() => {
      pipeline.addApplicationStage(new Stage(app, 'EmptyStage'));
    }).toThrow(/should contain at least one Stack/);
  });

  suite.modern(() => {
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');

    // WHEN
    expect(() => {
      pipeline.addStage(new Stage(app, 'EmptyStage'));
    }).toThrow(/should contain at least one Stack/);
  });
});

behavior('overridden stack names are respected', (suite) => {
  suite.legacy(() => {
    // WHEN
    const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    pipeline.addApplicationStage(new OneStackAppWithCustomName(app, 'App1'));
    pipeline.addApplicationStage(new OneStackAppWithCustomName(app, 'App2'));

    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    pipeline.addStage(new OneStackAppWithCustomName(app, 'App1'));
    pipeline.addStage(new OneStackAppWithCustomName(app, 'App2'));

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
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
  }
});

behavior('changing CLI version leads to a different pipeline structure (restarting it)', (suite) => {
  suite.legacy(() => {
    // GIVEN
    const stack2 = new Stack(app, 'Stack2', { env: PIPELINE_ENV });
    const stack3 = new Stack(app, 'Stack3', { env: PIPELINE_ENV });

    // WHEN
    new LegacyTestGitHubNpmPipeline(stack2, 'Cdk', {
      cdkCliVersion: '1.2.3',
    });
    new LegacyTestGitHubNpmPipeline(stack3, 'Cdk', {
      cdkCliVersion: '4.5.6',
    });

    THEN_codePipelineExpectation(stack2, stack3);
  });

  suite.modern(() => {
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

    THEN_codePipelineExpectation(stack2, stack3);
  });

  function THEN_codePipelineExpectation(stack2: Stack, stack3: Stack) {
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
  }
});

behavior('tags get reflected in pipeline', (suite) => {
  suite.legacy(() => {
    // WHEN
    const stage = new OneStackApp(app, 'App');
    const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    Tags.of(stage).add('CostCenter', 'F00B4R');
    pipeline.addApplicationStage(stage);

    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
    // WHEN
    const stage = new OneStackApp(app, 'App');
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    Tags.of(stage).add('CostCenter', 'F00B4R');
    pipeline.addStage(stage);
    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
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
  }
});

class OneStackAppWithCustomName extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    new BucketStack(this, 'Stack', {
      stackName: 'MyFancyStack',
    });
  }
}
