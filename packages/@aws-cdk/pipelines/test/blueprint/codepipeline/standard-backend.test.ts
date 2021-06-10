/* eslint-disable import/no-extraneous-dependencies */
import * as fs from 'fs';
import * as path from 'path';
import {
  anything,
  arrayWith,
  Capture,
  deepObjectLike,
  encodedJson,
  notMatching,
  objectLike,
  stringLike,
} from '@aws-cdk/assert-internal';
import '@aws-cdk/assert-internal/jest';
import { Stack, Stage, StageProps, Tags } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as cdkp from '../../../lib';
import { OneStackApp } from '../test-app';
import { BucketStack, PIPELINE_ENV, stackTemplate, TestApp, TestGitHubNpmPipeline } from '../testutil';

let app: TestApp;
let pipelineStack: Stack;
let pipeline: cdkp.Pipeline;

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
  pipeline.addStage(new OneStackApp(app, 'App'));

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'App',
      Actions: arrayWith(
        objectLike({
          Name: 'Prepare',
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
    pipeline.addStage(new Stage(app, 'EmptyStage'));
  }).toThrow(/should contain at least one Stack/);
});

test('action has right settings for same-env deployment', () => {
  // WHEN
  pipeline.addStage(new OneStackApp(app, 'Same'));

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'Same',
      Actions: [
        objectLike({
          Name: 'Prepare',
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
          Name: 'Deploy',
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

test('action has right settings for cross-region deployment', () => {
  // WHEN
  pipeline.addStage(new OneStackApp(app, 'CrossRegion', { env: { region: 'elsewhere' } }));

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'CrossRegion',
      Actions: [
        objectLike({
          Name: 'Prepare',
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
          Name: 'Deploy',
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
      Image: 'aws/codebuild/standard:5.0',
    },
    Source: {
      BuildSpec: encodedJson(deepObjectLike({
        phases: {
          install: {
            commands: ['npm install -g aws-cdk'],
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
      Image: 'aws/codebuild/standard:5.0',
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

test('selfmutation feature can be turned off', () => {
  const stack = new Stack();
  // WHEN
  new TestGitHubNpmPipeline(stack, 'Cdk', {
    engine: new cdkp.CodePipelineEngine({
      selfMutation: false,
    }),
  });
  // THEN
  expect(stack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: notMatching(arrayWith({
      Name: 'UpdatePipeline',
      Actions: anything(),
    })),
  });
});

test('overridden stack names are respected', () => {
  // WHEN
  pipeline.addStage(new OneStackAppWithCustomName(app, 'App1'));
  pipeline.addStage(new OneStackAppWithCustomName(app, 'App2'));

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith(
      {
        Name: 'App1',
        Actions: arrayWith(objectLike({
          Name: 'Prepare',
          Configuration: objectLike({
            StackName: 'MyFancyStack',
          }),
        })),
      },
      {
        Name: 'App2',
        Actions: arrayWith(objectLike({
          Name: 'Prepare',
          Configuration: objectLike({
            StackName: 'MyFancyStack',
          }),
        })),
      },
    ),
  });
});

test('changing CLI version leads to a different pipeline structure (restarting it)', () => {
  // GIVEN
  const stack2 = new Stack(app, 'Stack2', { env: PIPELINE_ENV });
  const stack3 = new Stack(app, 'Stack3', { env: PIPELINE_ENV });
  const structure2 = Capture.anyType();
  const structure3 = Capture.anyType();

  // WHEN
  new TestGitHubNpmPipeline(stack2, 'Cdk', {
    engine: new cdkp.CodePipelineEngine({
      cdkCliVersion: '1.2.3',
    }),
  });
  new TestGitHubNpmPipeline(stack3, 'Cdk', {
    engine: new cdkp.CodePipelineEngine({
      cdkCliVersion: '4.5.6',
    }),
  });

  // THEN
  expect(stack2).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: structure2.capture(),
  });
  expect(stack3).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: structure3.capture(),
  });

  expect(JSON.stringify(structure2.capturedValue)).not.toEqual(JSON.stringify(structure3.capturedValue));

});

test('tags get reflected in pipeline', () => {
  // WHEN
  const stage = new OneStackApp(app, 'App');
  Tags.of(stage).add('CostCenter', 'F00B4R');
  pipeline.addStage(stage);

  // THEN
  const templateConfig = Capture.aString();
  expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    Stages: arrayWith({
      Name: 'App',
      Actions: arrayWith(
        objectLike({
          Name: 'Prepare',
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

class OneStackAppWithCustomName extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    new BucketStack(this, 'Stack', {
      stackName: 'MyFancyStack',
    });
  }
}
