/* eslint-disable import/no-extraneous-dependencies */
import { Match, Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { behavior, LegacyTestGitHubNpmPipeline, OneStackApp, PIPELINE_ENV, TestApp, ModernTestGitHubNpmPipeline, stringLike } from '../testhelpers';

let app: TestApp;
let pipelineStack: Stack;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
});

afterEach(() => {
  app.cleanup();
});

behavior('action has right settings for same-env deployment', (suite) => {
  suite.legacy(() => {
    const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    pipeline.addApplicationStage(new OneStackApp(app, 'Same'));

    THEN_codePipelineExpection(agnosticRole);
  });

  suite.additional('legacy: even if env is specified but the same as the pipeline', () => {
    const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    pipeline.addApplicationStage(new OneStackApp(app, 'Same', {
      env: PIPELINE_ENV,
    }));

    THEN_codePipelineExpection(pipelineEnvRole);
  });

  suite.modern(() => {
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    pipeline.addStage(new OneStackApp(app, 'Same'));

    THEN_codePipelineExpection(agnosticRole);
  });

  suite.additional('modern: even if env is specified but the same as the pipeline', () => {
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    pipeline.addStage(new OneStackApp(app, 'Same', {
      env: PIPELINE_ENV,
    }));

    THEN_codePipelineExpection(pipelineEnvRole);
  });

  function THEN_codePipelineExpection(roleArn: (x: string) => any) {
    // THEN: pipeline structure is correct
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([{
        Name: 'Same',
        Actions: [
          Match.objectLike({
            Name: stringLike('*Prepare'),
            RoleArn: roleArn('deploy-role'),
            Configuration: Match.objectLike({
              StackName: 'Same-Stack',
              RoleArn: roleArn('cfn-exec-role'),
            }),
          }),
          Match.objectLike({
            Name: stringLike('*Deploy'),
            RoleArn: roleArn('deploy-role'),
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
            AWS: roleArn('deploy-role'),
          },
        })]),
      },
    });
  }
});

behavior('action has right settings for cross-account deployment', (suite) => {
  suite.legacy(() => {
    // WHEN
    const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    pipeline.addApplicationStage(new OneStackApp(app, 'CrossAccount', { env: { account: 'you' } }));

    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
    // WHEN
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
      crossAccountKeys: true,
    });
    pipeline.addStage(new OneStackApp(app, 'CrossAccount', { env: { account: 'you' } }));

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
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
  }
});

behavior('action has right settings for cross-region deployment', (suite) => {
  suite.legacy(() => {
    // WHEN
    const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    pipeline.addApplicationStage(new OneStackApp(app, 'CrossRegion', { env: { region: 'elsewhere' } }));

    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
      crossAccountKeys: true,
    });
    pipeline.addStage(new OneStackApp(app, 'CrossRegion', { env: { region: 'elsewhere' } }));

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
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
  }
});

behavior('action has right settings for cross-account/cross-region deployment', (suite) => {
  suite.legacy(() => {
    // WHEN
    const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    pipeline.addApplicationStage(new OneStackApp(app, 'CrossBoth', {
      env: {
        account: 'you',
        region: 'elsewhere',
      },
    }));

    THEN_codePipelineExpectations();
  });

  suite.modern(() => {
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

    THEN_codePipelineExpectations();
  });

  function THEN_codePipelineExpectations() {
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
  }
});


function agnosticRole(roleName: string) {
  return {
    'Fn::Join': ['', [
      'arn:',
      { Ref: 'AWS::Partition' },
      ':iam::',
      { Ref: 'AWS::AccountId' },
      `:role/cdk-hnb659fds-${roleName}-`,
      { Ref: 'AWS::AccountId' },
      '-',
      { Ref: 'AWS::Region' },
    ]],
  };
}

function pipelineEnvRole(roleName: string) {
  return {
    'Fn::Join': ['', [
      'arn:',
      { Ref: 'AWS::Partition' },
      `:iam::${PIPELINE_ENV.account}:role/cdk-hnb659fds-${roleName}-${PIPELINE_ENV.account}-${PIPELINE_ENV.region}`,
    ]],
  };
}