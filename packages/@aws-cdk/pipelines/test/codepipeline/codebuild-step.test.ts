import { Template, Match } from '@aws-cdk/assertions';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codePipeline from '@aws-cdk/aws-codepipeline';
import * as actions from '@aws-cdk/aws-codepipeline-actions';
import * as lambda from '@aws-cdk/aws-lambda';
import { Duration, Stack } from '@aws-cdk/core';
import { PIPELINE_ENV, TestApp, ModernTestGitHubNpmPipeline, AppWithOutput } from '../testhelpers';
import { Construct } from 'constructs';
import * as cdkp from '../../lib';

let app: TestApp;
let pipelineStack: Stack;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
});

afterEach(() => {
  app.cleanup();
});

test('additionalinputs creates the right commands', () => {
  // WHEN
  new cdkp.CodePipeline(pipelineStack, 'Pipeline', {
    synth: new cdkp.CodeBuildStep('Synth', {
      commands: ['/bin/true'],
      input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
      additionalInputs: {
        'some/deep/directory': cdkp.CodePipelineSource.gitHub('test2/test2', 'main'),
      },
    }),
  });

  // THEN
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
    Source: {
      BuildSpec: Match.serializedJson(Match.objectLike({
        phases: {
          install: {
            commands: [
              '[ ! -d "some/deep/directory" ] || { echo \'additionalInputs: "some/deep/directory" must not exist yet. If you want to merge multiple artifacts, use a "cp" command.\'; exit 1; } && mkdir -p -- "some/deep" && ln -s -- "$CODEBUILD_SRC_DIR_test2_test2_Source" "some/deep/directory"',
            ],
          },
        },
      })),
    },
  });
});

test('CodeBuild projects have a description', () => {
  new cdkp.CodePipeline(pipelineStack, 'Pipeline', {
    synth: new cdkp.CodeBuildStep('Synth', {
      commands: ['/bin/true'],
      input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
    }),
  });

  // THEN
  Template.fromStack(pipelineStack).hasResourceProperties(
    'AWS::CodeBuild::Project',
    {
      Description: 'Pipeline step PipelineStack/Pipeline/Build/Synth',
    },
  );
});

test('long duration steps are supported', () => {
  // WHEN
  new cdkp.CodePipeline(pipelineStack, 'Pipeline', {
    synth: new cdkp.CodeBuildStep('Synth', {
      commands: ['/bin/true'],
      input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
      additionalInputs: {
        'some/deep/directory': cdkp.CodePipelineSource.gitHub('test2/test2', 'main'),
      },
      timeout: Duration.minutes(180),
    }),
  });

  // THEN
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
    TimeoutInMinutes: 180,
  });
});

test('timeout can be configured as part of defaults', () => {
  // WHEN
  new cdkp.CodePipeline(pipelineStack, 'Pipeline', {
    synth: new cdkp.CodeBuildStep('Synth', {
      commands: ['/bin/true'],
      input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
      additionalInputs: {
        'some/deep/directory': cdkp.CodePipelineSource.gitHub('test2/test2', 'main'),
      },
    }),
    codeBuildDefaults: {
      timeout: Duration.minutes(180),
    },
  });

  // THEN
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
    TimeoutInMinutes: 180,
  });
});

test('timeout from defaults can be overridden', () => {
  // WHEN
  new cdkp.CodePipeline(pipelineStack, 'Pipeline', {
    synth: new cdkp.CodeBuildStep('Synth', {
      commands: ['/bin/true'],
      input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
      additionalInputs: {
        'some/deep/directory': cdkp.CodePipelineSource.gitHub('test2/test2', 'main'),
      },
      timeout: Duration.minutes(888),
    }),
    codeBuildDefaults: {
      timeout: Duration.minutes(180),
    },
  });

  // THEN
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
    TimeoutInMinutes: 888,
  });
});

test('envFromOutputs works even with very long stage and stack names', () => {
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');

  const myApp = new AppWithOutput(app, 'Alpha'.repeat(20), {
    stackId: 'Stack'.repeat(20),
  });

  pipeline.addStage(myApp, {
    post: [
      new cdkp.ShellStep('Approve', {
        commands: ['/bin/true'],
        envFromCfnOutputs: {
          THE_OUTPUT: myApp.theOutput,
        },
      }),
    ],
  });

  // THEN - did not throw an error about identifier lengths
});

test('exportedVariables', () => {
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');

  // GIVEN
  const producer = new cdkp.CodeBuildStep('Produce', {
    commands: ['export MY_VAR=hello'],
  });

  const consumer1 = new cdkp.CodeBuildStep('Consume1', {
    env: {
      THE_VAR: producer.exportedVariable('MY_VAR'),
    },
    commands: [
      'echo "The variable was: $THE_VAR"',
    ],
  });

  const consumer2 = new cdkp.CodeBuildStep('Consume2', {
    buildEnvironment: {
      environmentVariables: {
        THE_VAR: {
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
          value: producer.exportedVariable('MY_VAR'),
        },
      },
    },
    commands: [
      'echo "The variable was: $THE_VAR"',
    ],
  });

  // WHEN
  pipeline.addWave('MyWave', {
    post: [consumer1, consumer2, producer],
  });

  // THEN
  const template = Template.fromStack(pipelineStack);
  template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: [
      { Name: 'Source' },
      { Name: 'Build' },
      { Name: 'UpdatePipeline' },
      {
        Name: 'MyWave',
        Actions: [
          Match.objectLike({
            Name: 'Produce',
            Namespace: 'MyWave@Produce',
            RunOrder: 1,
          }),
          Match.objectLike({
            Name: 'Consume',
            RunOrder: 2,
            Configuration: Match.objectLike({
              EnvironmentVariables: Match.serializedJson(Match.arrayWith([
                {
                  name: 'THE_VAR',
                  type: 'PLAINTEXT',
                  value: '#{MyWave@Produce.MY_VAR}',
                },
              ])),
            }),
          }),
        ],
      },
    ],
  });

  template.hasResourceProperties('AWS::CodeBuild::Project', {
    Source: {
      BuildSpec: Match.serializedJson(Match.objectLike({
        env: {
          'exported-variables': ['MY_VAR'],
        },
      })),
    },
  });
});

class TestLambdaAction extends cdkp.Step implements cdkp.ICodePipelineActionFactory {
  constructor (
    private readonly scope: Construct,
    id: string,
    private readonly userParameters?: { [key: string]: any }) {
    super(id);
    this.discoverReferencedOutputs(this.userParameters);
  }

  public produceAction (stage: codePipeline.IStage, _options: cdkp.ProduceActionOptions): cdkp.CodePipelineActionFactoryResult {
    const lambdaPrefix = `arn:aws:lambda:${Stack.of(this.scope).region}:${Stack.of(this.scope).account}`;
    const lambdaf = lambda.Function.fromFunctionArn(this.scope, 'Lambda', `${lambdaPrefix}:function:TestLambda`);
    stage.addAction(new actions.LambdaInvokeAction({
      actionName: 'TestAction',
      lambda: lambdaf,
      userParameters: this.userParameters,
    }));
    return { runOrdersConsumed: 1 };
  }
}

test('exportedVariables with Lambda action', () => {
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');

  // GIVEN
  const producer = new cdkp.CodeBuildStep('Produce', {
    commands: ['export MY_VAR=hello'],
  });

  const consumer = new TestLambdaAction(pipelineStack, 'TestLambda', {
    THE_VAR: producer.exportedVariable('MY_VAR'),
  });

  // WHEN
  pipeline.addWave('MyWave', {
    post: [consumer, producer],
  });

  // THEN
  Template.fromStack(pipelineStack).resourceCountIs('AWS::Lambda::Function', 1);
});
