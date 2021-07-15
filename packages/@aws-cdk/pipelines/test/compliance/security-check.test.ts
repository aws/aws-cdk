import '@aws-cdk/assert-internal/jest';
import { Topic } from '@aws-cdk/aws-sns';
import { Stack, Stage, StageProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as cdkp from '../../lib';
import { BucketStack, LegacyTestGitHubNpmPipeline, PIPELINE_ENV, TestApp } from '../testhelpers';
import { behavior } from '../testhelpers/compliance';

let app: TestApp;
let pipelineStack: Stack;
let pipeline: LegacyTestGitHubNpmPipeline;

class OneStackApp extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    new BucketStack(this, 'Stack');
  }
}

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineSecurityStack', { env: PIPELINE_ENV });
  pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
});

afterEach(() => {
  app.cleanup();
});

behavior('security check option generates lambda/codebuild at pipeline scope', (suite) => {
  suite.legacy(() => {
    // WHEN
    pipeline.addApplicationStage(new OneStackApp(app, 'App'), { confirmBroadeningPermissions: true });

    // THEN
    expect(pipelineStack).toCountResources('AWS::Lambda::Function', 1);
    expect(pipelineStack).toHaveResourceLike('AWS::Lambda::Function', {
      Role: {
        'Fn::GetAtt': [
          'CdkPipelineApplicationSecurityCheckCDKPipelinesAutoApproveServiceRoleF6545652',
          'Arn',
        ],
      },
    });
    // 1 for github build, 1 for synth stage, and 1 for the application security check
    expect(pipelineStack).toCountResources('AWS::CodeBuild::Project', 3);
  });
});

behavior('pipeline created with auto approve tags and lambda/codebuild w/ valid permissions', (suite) => {
  suite.legacy(() => {
    // WHEN
    pipeline.addApplicationStage(new OneStackApp(app, 'App'), { confirmBroadeningPermissions: true });

    // THEN
    // CodePipeline must be tagged as SECURITY_CHECK=ALLOW_APPROVE
    expect(pipelineStack).toHaveResource('AWS::CodePipeline::Pipeline', {
      Tags: [
        {
          Key: 'SECURITY_CHECK',
          Value: 'ALLOW_APPROVE',
        },
      ],
    });
    // Lambda Function only has access to pipelines tagged SECURITY_CHECK=ALLOW_APPROVE
    expect(pipelineStack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: ['codepipeline:GetPipelineState', 'codepipeline:PutApprovalResult'],
            Condition: {
              StringEquals: { 'aws:ResourceTag/SECURITY_CHECK': 'ALLOW_APPROVE' },
            },
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
      PolicyName: 'CdkPipelineApplicationSecurityCheckCDKPipelinesAutoApproveServiceRoleDefaultPolicyDC837235',
    });
    // CodeBuild must have access to the stacks and invoking the lambda function
    expect(pipelineStack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
            Effect: 'Allow',
          },
          {
            Action: [
              'codebuild:CreateReportGroup',
              'codebuild:CreateReport',
              'codebuild:UpdateReport',
              'codebuild:BatchPutTestCases',
              'codebuild:BatchPutCodeCoverages',
            ],
            Effect: 'Allow',
          },
          {
            Action: 'sts:AssumeRole',
            Condition: {
              'ForAnyValue:StringEquals': {
                'iam:ResourceTag/aws-cdk:bootstrap-role': [
                  'image-publishing',
                  'file-publishing',
                  'deploy',
                ],
              },
            },
            Effect: 'Allow',
            Resource: '*',
          },
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'CdkPipelineApplicationSecurityCheckCDKPipelinesAutoApproveEAC6D2CE',
                'Arn',
              ],
            },
          },
          {
            Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
            Effect: 'Allow',
          },
          {
            Action: ['kms:Decrypt', 'kms:DescribeKey'],
            Effect: 'Allow',
          },
          {
            Action: ['kms:Decrypt', 'kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*'],
            Effect: 'Allow',
          },
        ],
      },
    });
  });
});

behavior('confirmBroadeningPermissions option at addApplicationStage runs security check on all apps unless overriden', (suite) => {
  suite.legacy(() => {
    // WHEN
    const securityStage = pipeline.addApplicationStage(new OneStackApp(app, 'StageSecurityCheckStack'), { confirmBroadeningPermissions: true });
    securityStage.addApplication(new OneStackApp(app, 'AnotherStack'));
    securityStage.addApplication(new OneStackApp(app, 'SkipCheckStack'), { confirmBroadeningPermissions: false });

    // THEN
    expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
      Stages: [
        {
          Actions: [{ Name: 'GitHub', RunOrder: 1 }],
          Name: 'Source',
        },
        {
          Actions: [{ Name: 'Synth', RunOrder: 1 }],
          Name: 'Build',
        },
        {
          Actions: [{ Name: 'SelfMutate', RunOrder: 1 }],
          Name: 'UpdatePipeline',
        },
        {
          Actions: [
            { Name: 'StageSecurityCheckStackSecurityCheck', RunOrder: 1 },
            { Name: 'StageSecurityCheckStackManualApproval', RunOrder: 2 },
            { Name: 'AnotherStackSecurityCheck', RunOrder: 5 },
            { Name: 'AnotherStackManualApproval', RunOrder: 6 },
            { Name: 'Stack.Prepare', RunOrder: 3 },
            { Name: 'Stack.Deploy', RunOrder: 4 },
            { Name: 'AnotherStack-Stack.Prepare', RunOrder: 7 },
            { Name: 'AnotherStack-Stack.Deploy', RunOrder: 8 },
            { Name: 'SkipCheckStack-Stack.Prepare', RunOrder: 9 },
            { Name: 'SkipCheckStack-Stack.Deploy', RunOrder: 10 },
          ],
          Name: 'StageSecurityCheckStack',
        },
      ],
    });
  });
});

behavior('confirmBroadeningPermissions option at addApplication runs security check only on selected application', (suite) => {
  suite.legacy(() => {
    // WHEN
    const noSecurityStage = pipeline.addApplicationStage(new OneStackApp(app, 'NoSecurityCheckStack'));
    noSecurityStage.addApplication(new OneStackApp(app, 'EnableCheckStack'), { confirmBroadeningPermissions: true });

    // THEN
    expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
      Stages: [
        {
          Actions: [{ Name: 'GitHub', RunOrder: 1 }],
          Name: 'Source',
        },
        {
          Actions: [{ Name: 'Synth', RunOrder: 1 }],
          Name: 'Build',
        },
        {
          Actions: [{ Name: 'SelfMutate', RunOrder: 1 }],
          Name: 'UpdatePipeline',
        },
        {
          Actions: [
            { Name: 'EnableCheckStackSecurityCheck', RunOrder: 3 },
            { Name: 'EnableCheckStackManualApproval', RunOrder: 4 },
            { Name: 'Stack.Prepare', RunOrder: 1 },
            { Name: 'Stack.Deploy', RunOrder: 2 },
            { Name: 'EnableCheckStack-Stack.Prepare', RunOrder: 5 },
            { Name: 'EnableCheckStack-Stack.Deploy', RunOrder: 6 },
          ],
          Name: 'NoSecurityCheckStack',
        },
      ],
    });
  });
});

behavior('confirmBroadeningPermissions and notification topic options generates the right resources', (suite) => {
  suite.legacy(() => {
    // WHEN
    const topic = new Topic(pipelineStack, 'NotificationTopic');
    pipeline.addApplicationStage(new OneStackApp(app, 'MyStack'), {
      confirmBroadeningPermissions: true,
      securityNotificationTopic: topic,
    });

    // THEN
    expect(pipelineStack).toCountResources('AWS::SNS::Topic', 1);
    expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
      Stages: [
        { Name: 'Source' },
        { Name: 'Build' },
        { Name: 'UpdatePipeline' },
        {
          Actions: [
            {
              Configuration: {
                ProjectName: { Ref: 'CdkPipelineApplicationSecurityCheckCDKSecurityCheckE8A1395F' },
                EnvironmentVariables: {
                  'Fn::Join': ['', [
                    '[{"name":"STACK_NAME","type":"PLAINTEXT","value":"PipelineSecurityStack"},{"name":"STAGE_NAME","type":"PLAINTEXT","value":"MyStack"},{"name":"ACTION_NAME","type":"PLAINTEXT","value":"MyStackManualApproval"},{"name":"NOTIFICATION_ARN","type":"PLAINTEXT","value":"',
                    { Ref: 'NotificationTopicEB7A0DF1' },
                    '"},{"name":"NOTIFICATION_SUBJECT","type":"PLAINTEXT","value":"Confirm Broadening IAM Permissions in MyStack"}]',
                  ]],
                },
              },
              Name: 'MyStackSecurityCheck',
              Namespace: 'MyStackSecurityCheck',
              RunOrder: 1,
            },
            {
              Configuration: {
                CustomData: '#{MyStackSecurityCheck.MESSAGE}',
                ExternalEntityLink: 'https://#{MyStackSecurityCheck.LINK}',
              },
              Name: 'MyStackManualApproval',
              RunOrder: 2,
            },
            { Name: 'Stack.Prepare', RunOrder: 3 },
            { Name: 'Stack.Deploy', RunOrder: 4 },
          ],
          Name: 'MyStack',
        },
      ],
    });
  });
});

behavior('Stages declared outside the pipeline create their own ApplicationSecurityCheck', (suite) => {
  suite.legacy(() => {
    // WHEN
    const pipelineStage = pipeline.codePipeline.addStage({
      stageName: 'UnattachedStage',
    });

    const unattachedStage = new cdkp.CdkStage(pipelineStack, 'UnattachedStage', {
      stageName: 'UnattachedStage',
      pipelineStage,
      cloudAssemblyArtifact: pipeline.cloudAssemblyArtifact,
      host: {
        publishAsset: () => undefined,
        stackOutputArtifact: () => undefined,
      },
    });

    unattachedStage.addApplication(new OneStackApp(app, 'UnattachedStage'), {
      confirmBroadeningPermissions: true,
    });

    // THEN
    expect(pipelineStack).toCountResources('AWS::Lambda::Function', 1);
    // 1 for github build, 1 for synth stage, and 1 for the application security check
    expect(pipelineStack).toCountResources('AWS::CodeBuild::Project', 3);
    expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
      Tags: [
        {
          Key: 'SECURITY_CHECK',
          Value: 'ALLOW_APPROVE',
        },
      ],
      Stages: [
        { Name: 'Source' },
        { Name: 'Build' },
        { Name: 'UpdatePipeline' },
        {
          Actions: [
            {
              Configuration: {
                ProjectName: { Ref: 'UnattachedStageStageApplicationSecurityCheckCDKSecurityCheckADCE795B' },
              },
              Name: 'UnattachedStageSecurityCheck',
              RunOrder: 1,
            },
            {
              Configuration: {
                CustomData: '#{UnattachedStageSecurityCheck.MESSAGE}',
                ExternalEntityLink: 'https://#{UnattachedStageSecurityCheck.LINK}',
              },
              Name: 'UnattachedStageManualApproval',
              RunOrder: 2,
            },
            { Name: 'Stack.Prepare', RunOrder: 3 },
            { Name: 'Stack.Deploy', RunOrder: 4 },
          ],
          Name: 'UnattachedStage',
        },
      ],
    });
  });
});