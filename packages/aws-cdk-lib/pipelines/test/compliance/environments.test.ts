/* eslint-disable import/no-extraneous-dependencies */
import { Match, Template } from '../../../assertions';
import { Stack } from '../../../core';
import { OneStackApp, PIPELINE_ENV, TestApp, ModernTestGitHubNpmPipeline, stringLike } from '../testhelpers';

let app: TestApp;
let pipelineStack: Stack;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
});

afterEach(() => {
  app.cleanup();
});

test('action has right settings for same-env deployment', () => {
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
  pipeline.addStage(new OneStackApp(app, 'Same'));

  // THEN: pipeline structure is correct
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'Same',
      Actions: [
        Match.objectLike({
          Name: stringLike('*Prepare'),
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
          Configuration: Match.objectLike({
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
        Match.objectLike({
          Name: stringLike('*Deploy'),
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
          Configuration: Match.objectLike({
            StackName: 'Same-Stack',
          }),
        }),
      ],
    }]),
  });

  // THEN: artifact bucket can be read by deploy role
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::S3::BucketPolicy', {
    PolicyDocument: {
      Statement: Match.arrayWith([Match.objectLike({
        Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
        Principal: {
          AWS: {
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
        },
      })]),
    },
  });
});

test('even if env is specified but the same as the pipeline', () => {
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
  pipeline.addStage(new OneStackApp(app, 'Same', {
    env: PIPELINE_ENV,
  }));

  // THEN: pipeline structure is correct
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'Same',
      Actions: [
        Match.objectLike({
          Name: stringLike('*Prepare'),
          RoleArn: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              `:iam::${PIPELINE_ENV.account}:role/cdk-hnb659fds-deploy-role-${PIPELINE_ENV.account}-${PIPELINE_ENV.region}`,
            ]],
          },
          Configuration: Match.objectLike({
            StackName: 'Same-Stack',
            RoleArn: {
              'Fn::Join': ['', [
                'arn:',
                { Ref: 'AWS::Partition' },
                `:iam::${PIPELINE_ENV.account}:role/cdk-hnb659fds-cfn-exec-role-${PIPELINE_ENV.account}-${PIPELINE_ENV.region}`,
              ]],
            },
          }),
        }),
        Match.objectLike({
          Name: stringLike('*Deploy'),
          RoleArn: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              `:iam::${PIPELINE_ENV.account}:role/cdk-hnb659fds-deploy-role-${PIPELINE_ENV.account}-${PIPELINE_ENV.region}`,
            ]],
          },
          Configuration: Match.objectLike({
            StackName: 'Same-Stack',
          }),
        }),
      ],
    }]),
  });

  // THEN: artifact bucket can be read by deploy role
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::S3::BucketPolicy', {
    PolicyDocument: {
      Statement: Match.arrayWith([Match.objectLike({
        Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
        Principal: {
          AWS: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              `:iam::${PIPELINE_ENV.account}:role/cdk-hnb659fds-deploy-role-${PIPELINE_ENV.account}-${PIPELINE_ENV.region}`,
            ]],
          },
        },
      })]),
    },
  });
});

test('action has right settings for cross-account deployment', () => {
  // WHEN
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    crossAccountKeys: true,
  });
  pipeline.addStage(new OneStackApp(app, 'CrossAccount', { env: { account: 'you' } }));

  // THEN: Pipelien structure is correct
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'CrossAccount',
      Actions: [
        Match.objectLike({
          Name: stringLike('*Prepare'),
          RoleArn: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::you:role/cdk-hnb659fds-deploy-role-you-',
              { Ref: 'AWS::Region' },
            ]],
          },
          Configuration: Match.objectLike({
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
        Match.objectLike({
          Name: stringLike('*Deploy'),
          RoleArn: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::you:role/cdk-hnb659fds-deploy-role-you-',
              { Ref: 'AWS::Region' },
            ]],
          },
          Configuration: Match.objectLike({
            StackName: 'CrossAccount-Stack',
          }),
        }),
      ],
    }]),
  });

  // THEN: Artifact bucket can be read by deploy role
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::S3::BucketPolicy', {
    PolicyDocument: {
      Statement: Match.arrayWith([Match.objectLike({
        Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
        Principal: {
          AWS: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              stringLike('*-deploy-role-*'),
              { Ref: 'AWS::Region' },
            ]],
          },
        },
      })]),
    },
  });
});

test('action has right settings for cross-region deployment', () => {

  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    crossAccountKeys: true,
  });
  pipeline.addStage(new OneStackApp(app, 'CrossRegion', { env: { region: 'elsewhere' } }));

  // THEN
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'CrossRegion',
      Actions: [
        Match.objectLike({
          Name: stringLike('*Prepare'),
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
          Configuration: Match.objectLike({
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
        Match.objectLike({
          Name: stringLike('*Deploy'),
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
          Configuration: Match.objectLike({
            StackName: 'CrossRegion-Stack',
          }),
        }),
      ],
    }]),
  });
});

test('action has right settings for cross-account/cross-region deployment', () => {
  // WHEN
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    crossAccountKeys: true,
  });
  pipeline.addStage(new OneStackApp(app, 'CrossBoth', {
    env: {
      account: 'you',
      region: 'elsewhere',
    },
  }));

  // THEN: pipeline structure must be correct
  const stack = app.stackArtifact(pipelineStack);
  expect(stack).toBeDefined();
  Template.fromStack(stack!).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'CrossBoth',
      Actions: [
        Match.objectLike({
          Name: stringLike('*Prepare'),
          RoleArn: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::you:role/cdk-hnb659fds-deploy-role-you-elsewhere',
            ]],
          },
          Region: 'elsewhere',
          Configuration: Match.objectLike({
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
        Match.objectLike({
          Name: stringLike('*Deploy'),
          RoleArn: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::you:role/cdk-hnb659fds-deploy-role-you-elsewhere',
            ]],
          },
          Region: 'elsewhere',
          Configuration: Match.objectLike({
            StackName: 'CrossBoth-Stack',
          }),
        }),
      ],
    }]),
  });

  // THEN: artifact bucket can be read by deploy role
  const supportStack = app.stackArtifact('PipelineStack-support-elsewhere');
  expect(supportStack).toBeDefined();
  Template.fromStack(supportStack!).hasResourceProperties('AWS::S3::BucketPolicy', {
    PolicyDocument: {
      Statement: Match.arrayWith([Match.objectLike({
        Action: Match.arrayWith(['s3:GetObject*', 's3:GetBucket*', 's3:List*']),
        Principal: {
          AWS: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              stringLike('*-deploy-role-*'),
            ]],
          },
        },
      })]),
    },
  });

  // And the key to go along with it
  Template.fromStack(supportStack!).hasResourceProperties('AWS::KMS::Key', {
    KeyPolicy: {
      Statement: Match.arrayWith([Match.objectLike({
        Action: Match.arrayWith(['kms:Decrypt', 'kms:DescribeKey']),
        Principal: {
          AWS: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              stringLike('*-deploy-role-*'),
            ]],
          },
        },
      })]),
    },
  });
});