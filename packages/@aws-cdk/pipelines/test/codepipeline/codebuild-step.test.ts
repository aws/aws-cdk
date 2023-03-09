import { Template, Match } from '@aws-cdk/assertions';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { Duration, Stack } from '@aws-cdk/core';
import * as cdkp from '../../lib';
import { StackOutputReference } from '../../lib';
import { PIPELINE_ENV, TestApp, ModernTestGitHubNpmPipeline, AppWithOutput } from '../testhelpers';

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

  const myApp = new AppWithOutput(app, 'Alpha'.repeat(10), {
    stackId: 'Stack'.repeat(10),
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

test('role passed it used for project and code build action', () => {
  const projectRole = new iam.Role(
    pipelineStack,
    'ProjectRole',
    {
      roleName: 'ProjectRole',
      assumedBy: new iam.ServicePrincipal('codebuild.amazon.com'),
    },
  );
  const buildRole = new iam.Role(
    pipelineStack,
    'BuildRole',
    {
      roleName: 'BuildRole',
      assumedBy: new iam.ServicePrincipal('codebuild.amazon.com'),
    },
  );
  // WHEN
  new cdkp.CodePipeline(pipelineStack, 'Pipeline', {
    synth: new cdkp.CodeBuildStep('Synth', {
      commands: ['/bin/true'],
      input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
      role: projectRole,
      actionRole: buildRole,
    }),
  });

  // THEN
  const tpl = Template.fromStack(pipelineStack);
  tpl.hasResourceProperties('AWS::CodeBuild::Project', {
    ServiceRole: {
      'Fn::GetAtt': [
        'ProjectRole5B707505',
        'Arn',
      ],
    },
  });

  tpl.hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: [
      // source stage
      {},
      // build stage,
      {
        Actions: [
          {
            ActionTypeId: {
              Category: 'Build',
              Owner: 'AWS',
              Provider: 'CodeBuild',
            },
            RoleArn: {
              'Fn::GetAtt': [
                'BuildRole41B77417',
                'Arn',
              ],
            },
          },
        ],
      },
      // Self-update
      {},
    ],
  });
});
test('exportedVariables', () => {
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');

  // GIVEN
  const producer = new cdkp.CodeBuildStep('Produce', {
    commands: ['export MY_VAR=hello'],
  });

  const consumer = new cdkp.CodeBuildStep('Consume', {
    env: {
      THE_VAR: producer.exportedVariable('MY_VAR'),
    },
    commands: [
      'echo "The variable was: $THE_VAR"',
    ],
  });

  // WHEN
  pipeline.addWave('MyWave', {
    post: [consumer, producer],
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

test('step has caching set', () => {
  // WHEN
  const myCachingBucket = new s3.Bucket(pipelineStack, 'MyCachingBucket');
  new cdkp.CodePipeline(pipelineStack, 'Pipeline', {
    synth: new cdkp.CodeBuildStep('Synth', {
      cache: codebuild.Cache.bucket(myCachingBucket),
      commands: ['/bin/true'],
      input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
    }),
  });

  // THEN
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
    Cache: {
      Location: {
        'Fn::Join': ['/', [{ Ref: 'MyCachingBucket8C98C553' }, { Ref: 'AWS::NoValue' }]],
      },
    },
  });
});

test('step exposes consumed stack output reference', () => {
  // WHEN
  const myApp = new AppWithOutput(app, 'AppWithOutput', {
    stackId: 'Stack',
  });
  const step = new cdkp.ShellStep('AStep', {
    commands: ['/bin/true'],
    envFromCfnOutputs: {
      THE_OUTPUT: myApp.theOutput,
    },
  });

  // THEN
  expect(step.consumedStackOutputs).toContainEqual(StackOutputReference.fromCfnOutput(myApp.theOutput));
});