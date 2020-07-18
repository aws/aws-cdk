import { anything, arrayWith, deepObjectLike, encodedJson, objectLike, stringLike } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import { Construct, Stack, Stage, StageProps } from '@aws-cdk/core';
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
          RoleArn: { 'Fn::Sub': 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-hnb659fds-deploy-role-${AWS::AccountId}-${AWS::Region}' },
          Configuration: objectLike({
            StackName: 'Same-Stack',
            RoleArn: { 'Fn::Sub': 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-hnb659fds-cfn-exec-role-${AWS::AccountId}-${AWS::Region}' },
          }),
        }),
        objectLike({
          Name: 'Stack.Deploy',
          RoleArn: { 'Fn::Sub': 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-hnb659fds-deploy-role-${AWS::AccountId}-${AWS::Region}' },
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
  pipeline.addApplicationStage(new OneStackApp(app, 'CrossAccount', { env: { account: 'you' }}));

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'CrossAccount',
      Actions: [
        objectLike({
          Name: 'Stack.Prepare',
          RoleArn: { 'Fn::Sub': 'arn:${AWS::Partition}:iam::you:role/cdk-hnb659fds-deploy-role-you-${AWS::Region}' },
          Configuration: objectLike({
            StackName: 'CrossAccount-Stack',
            RoleArn: { 'Fn::Sub': 'arn:${AWS::Partition}:iam::you:role/cdk-hnb659fds-cfn-exec-role-you-${AWS::Region}' },
          }),
        }),
        objectLike({
          Name: 'Stack.Deploy',
          RoleArn: { 'Fn::Sub': 'arn:${AWS::Partition}:iam::you:role/cdk-hnb659fds-deploy-role-you-${AWS::Region}' },
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
  pipeline.addApplicationStage(new OneStackApp(app, 'CrossRegion', { env: { region: 'elsewhere' }}));

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'CrossRegion',
      Actions: [
        objectLike({
          Name: 'Stack.Prepare',
          RoleArn: { 'Fn::Sub': 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-hnb659fds-deploy-role-${AWS::AccountId}-elsewhere' },
          Region: 'elsewhere',
          Configuration: objectLike({
            StackName: 'CrossRegion-Stack',
            RoleArn: { 'Fn::Sub': 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-hnb659fds-cfn-exec-role-${AWS::AccountId}-elsewhere' },
          }),
        }),
        objectLike({
          Name: 'Stack.Deploy',
          RoleArn: { 'Fn::Sub': 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-hnb659fds-deploy-role-${AWS::AccountId}-elsewhere' },
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
  pipeline.addApplicationStage(new OneStackApp(app, 'CrossBoth', { env: { account: 'you', region: 'elsewhere' }}));

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'CrossBoth',
      Actions: [
        objectLike({
          Name: 'Stack.Prepare',
          RoleArn: { 'Fn::Sub': 'arn:${AWS::Partition}:iam::you:role/cdk-hnb659fds-deploy-role-you-elsewhere' },
          Region: 'elsewhere',
          Configuration: objectLike({
            StackName: 'CrossBoth-Stack',
            RoleArn: { 'Fn::Sub': 'arn:${AWS::Partition}:iam::you:role/cdk-hnb659fds-cfn-exec-role-you-elsewhere' },
          }),
        }),
        objectLike({
          Name: 'Stack.Deploy',
          RoleArn: { 'Fn::Sub': 'arn:${AWS::Partition}:iam::you:role/cdk-hnb659fds-deploy-role-you-elsewhere' },
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
