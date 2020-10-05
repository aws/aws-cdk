import * as fs from 'fs';
import * as path from 'path';
import { anything, arrayWith, Capture, deepObjectLike, encodedJson, objectLike, stringLike } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as cp from '@aws-cdk/aws-codepipeline';
import * as cpa from '@aws-cdk/aws-codepipeline-actions';
import { Stack, Stage, StageProps, SecretValue, Tags } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as cdkp from '../lib';
import { BucketStack, PIPELINE_ENV, stackTemplate, TestApp, TestGitHubNpmPipeline } from './testutil';

let app: TestApp;
let pipelineStack: Stack;
let pipeline: cdkp.CdkPipeline;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
  pipeline = new TestGitHubNpmPipeline(pipelineStack, 'Cdk');
});

afterEach(() => {
  app.cleanup();
});

test('references stack template in subassembly', () => {
  // WHEN
  pipeline.addApplicationStage(new OneStackApp(app, 'App'));

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'App',
      Actions: arrayWith(
        objectLike({
          Name: 'Stack.Prepare',
          InputArtifacts: [objectLike({})],
          Configuration: objectLike({
            StackName: 'App-Stack',
            TemplatePath: stringLike('*::assembly-App/*.template.json'),
          }),
        }),
      ),
    }),
  });
});

test('obvious error is thrown when stage contains no stacks', () => {
  // WHEN
  expect(() => {
    pipeline.addApplicationStage(new Stage(app, 'EmptyStage'));
  }).toThrow(/should contain at least one Stack/);
});

test('action has right settings for same-env deployment', () => {
  // WHEN
  pipeline.addApplicationStage(new OneStackApp(app, 'Same'));

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'Same',
      Actions: [
        objectLike({
          Name: 'Stack.Prepare',
          RoleArn: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::',
              { Ref: 'AWS::AccountId' },
              ':role/cdk-hnb659fds-deploy-role-',
              { Ref: 'AWS::AccountId' },
              '-',
              { Ref: 'AWS::Region' },
            ]],
          },
          Configuration: objectLike({
            StackName: 'Same-Stack',
            RoleArn: {
              'Fn::Join': ['', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':iam::',
                { Ref: 'AWS::AccountId' },
                ':role/cdk-hnb659fds-cfn-exec-role-',
                { Ref: 'AWS::AccountId' },
                '-',
                { Ref: 'AWS::Region' },
              ]],
            },
          }),
        }),
        objectLike({
          Name: 'Stack.Deploy',
          RoleArn: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::',
              { Ref: 'AWS::AccountId' },
              ':role/cdk-hnb659fds-deploy-role-',
              { Ref: 'AWS::AccountId' },
              '-',
              { Ref: 'AWS::Region' },
            ]],
          },
          Configuration: objectLike({
            StackName: 'Same-Stack',
          }),
        }),
      ],
    }),
  });
});

test('action has right settings for cross-account deployment', () => {
  // WHEN
  pipeline.addApplicationStage(new OneStackApp(app, 'CrossAccount', { env: { account: 'you' } }));

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'CrossAccount',
      Actions: [
        objectLike({
          Name: 'Stack.Prepare',
          RoleArn: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::you:role/cdk-hnb659fds-deploy-role-you-',
              { Ref: 'AWS::Region' },
            ]],
          },
          Configuration: objectLike({
            StackName: 'CrossAccount-Stack',
            RoleArn: {
              'Fn::Join': ['', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':iam::you:role/cdk-hnb659fds-cfn-exec-role-you-',
                { Ref: 'AWS::Region' },
              ]],
            },
          }),
        }),
        objectLike({
          Name: 'Stack.Deploy',
          RoleArn: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::you:role/cdk-hnb659fds-deploy-role-you-',
              { Ref: 'AWS::Region' },
            ]],
          },
          Configuration: objectLike({
            StackName: 'CrossAccount-Stack',
          }),
        }),
      ],
    }),
  });
});

test('action has right settings for cross-region deployment', () => {
  // WHEN
  pipeline.addApplicationStage(new OneStackApp(app, 'CrossRegion', { env: { region: 'elsewhere' } }));

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'CrossRegion',
      Actions: [
        objectLike({
          Name: 'Stack.Prepare',
          RoleArn: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::',
              { Ref: 'AWS::AccountId' },
              ':role/cdk-hnb659fds-deploy-role-',
              { Ref: 'AWS::AccountId' },
              '-elsewhere',
            ]],
          },
          Region: 'elsewhere',
          Configuration: objectLike({
            StackName: 'CrossRegion-Stack',
            RoleArn: {
              'Fn::Join': ['', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':iam::',
                { Ref: 'AWS::AccountId' },
                ':role/cdk-hnb659fds-cfn-exec-role-',
                { Ref: 'AWS::AccountId' },
                '-elsewhere',
              ]],
            },
          }),
        }),
        objectLike({
          Name: 'Stack.Deploy',
          RoleArn: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::',
              { Ref: 'AWS::AccountId' },
              ':role/cdk-hnb659fds-deploy-role-',
              { Ref: 'AWS::AccountId' },
              '-elsewhere',
            ]],
          },
          Region: 'elsewhere',
          Configuration: objectLike({
            StackName: 'CrossRegion-Stack',
          }),
        }),
      ],
    }),
  });
});

test('action has right settings for cross-account/cross-region deployment', () => {
  // WHEN
  pipeline.addApplicationStage(new OneStackApp(app, 'CrossBoth', { env: { account: 'you', region: 'elsewhere' } }));

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'CrossBoth',
      Actions: [
        objectLike({
          Name: 'Stack.Prepare',
          RoleArn: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::you:role/cdk-hnb659fds-deploy-role-you-elsewhere',
            ]],
          },
          Region: 'elsewhere',
          Configuration: objectLike({
            StackName: 'CrossBoth-Stack',
            RoleArn: {
              'Fn::Join': ['', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':iam::you:role/cdk-hnb659fds-cfn-exec-role-you-elsewhere',
              ]],
            },
          }),
        }),
        objectLike({
          Name: 'Stack.Deploy',
          RoleArn: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::you:role/cdk-hnb659fds-deploy-role-you-elsewhere',
            ]],
          },
          Region: 'elsewhere',
          Configuration: objectLike({
            StackName: 'CrossBoth-Stack',
          }),
        }),
      ],
    }),
  });
});

test('pipeline has self-mutation stage', () => {
  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'UpdatePipeline',
      Actions: [
        objectLike({
          Name: 'SelfMutate',
          Configuration: objectLike({
            ProjectName: { Ref: anything() },
          }),
        }),
      ],
    }),
  });

  expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
    Environment: {
      Image: 'aws/codebuild/standard:4.0',
    },
    Source: {
      BuildSpec: encodedJson(deepObjectLike({
        phases: {
          install: {
            commands: 'npm install -g aws-cdk',
          },
          build: {
            commands: arrayWith('cdk -a . deploy PipelineStack --require-approval=never --verbose'),
          },
        },
      })),
      Type: 'CODEPIPELINE',
    },
  });
});

test('selfmutation stage correctly identifies nested assembly of pipeline stack', () => {
  const pipelineStage = new Stage(app, 'PipelineStage');
  const nestedPipelineStack = new Stack(pipelineStage, 'PipelineStack', { env: PIPELINE_ENV });
  new TestGitHubNpmPipeline(nestedPipelineStack, 'Cdk');

  // THEN
  expect(stackTemplate(nestedPipelineStack)).toHaveResourceLike('AWS::CodeBuild::Project', {
    Environment: {
      Image: 'aws/codebuild/standard:4.0',
    },
    Source: {
      BuildSpec: encodedJson(deepObjectLike({
        phases: {
          build: {
            commands: arrayWith('cdk -a assembly-PipelineStage deploy PipelineStage-PipelineStack --require-approval=never --verbose'),
          },
        },
      })),
    },
  });
});

test('overridden stack names are respected', () => {
  // WHEN
  pipeline.addApplicationStage(new OneStackAppWithCustomName(app, 'App1'));
  pipeline.addApplicationStage(new OneStackAppWithCustomName(app, 'App2'));

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith(
      {
        Name: 'App1',
        Actions: arrayWith(objectLike({
          Name: 'MyFancyStack.Prepare',
          Configuration: objectLike({
            StackName: 'MyFancyStack',
          }),
        })),
      },
      {
        Name: 'App2',
        Actions: arrayWith(objectLike({
          Name: 'MyFancyStack.Prepare',
          Configuration: objectLike({
            StackName: 'MyFancyStack',
          }),
        })),
      },
    ),
  });
});

test('can control fix/CLI version used in pipeline selfupdate', () => {
  // WHEN
  const stack2 = new Stack(app, 'Stack2', { env: PIPELINE_ENV });
  new TestGitHubNpmPipeline(stack2, 'Cdk2', {
    pipelineName: 'vpipe',
    cdkCliVersion: '1.2.3',
  });

  // THEN
  expect(stack2).toHaveResourceLike('AWS::CodeBuild::Project', {
    Name: 'vpipe-selfupdate',
    Source: {
      BuildSpec: encodedJson(deepObjectLike({
        phases: {
          install: {
            commands: 'npm install -g aws-cdk@1.2.3',
          },
        },
      })),
    },
  });
});

test('add another action to an existing stage', () => {
  // WHEN
  pipeline.stage('Source').addAction(new cpa.GitHubSourceAction({
    actionName: 'GitHub2',
    oauthToken: SecretValue.plainText('oops'),
    output: new cp.Artifact(),
    owner: 'OWNER',
    repo: 'REPO',
  }));

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'Source',
      Actions: [
        objectLike({ Name: 'GitHub' }),
        objectLike({ Name: 'GitHub2' }),
      ],
    }),
  });
});

test('tags get reflected in pipeline', () => {
  // WHEN
  const stage = new OneStackApp(app, 'App');
  Tags.of(stage).add('CostCenter', 'F00B4R');
  pipeline.addApplicationStage(stage);

  // THEN
  const templateConfig = Capture.aString();
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'App',
      Actions: arrayWith(
        objectLike({
          Name: 'Stack.Prepare',
          InputArtifacts: [objectLike({})],
          Configuration: objectLike({
            StackName: 'App-Stack',
            TemplateConfiguration: templateConfig.capture(stringLike('*::assembly-App/*.template.*json')),
          }),
        }),
      ),
    }),
  });

  const [, relConfigFile] = templateConfig.capturedValue.split('::');
  const absConfigFile = path.join(app.outdir, relConfigFile);
  const configFile = JSON.parse(fs.readFileSync(absConfigFile, { encoding: 'utf-8' }));
  expect(configFile).toEqual(expect.objectContaining({
    Tags: {
      CostCenter: 'F00B4R',
    },
  }));
});

class OneStackApp extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    new BucketStack(this, 'Stack');
  }
}

class OneStackAppWithCustomName extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    new BucketStack(this, 'Stack', {
      stackName: 'MyFancyStack',
    });
  }
}
