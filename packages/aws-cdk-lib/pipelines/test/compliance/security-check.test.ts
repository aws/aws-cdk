import { Match, Template } from '../../../assertions';
import { Topic } from '../../../aws-sns';
import { Stack } from '../../../core';
import * as cdkp from '../../lib';
import { CDKP_DEFAULT_CODEBUILD_IMAGE } from '../../lib/private/default-codebuild-image';
import { ModernTestGitHubNpmPipeline, OneStackApp, PIPELINE_ENV, TestApp, stringLike } from '../testhelpers';

let app: TestApp;
let pipelineStack: Stack;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineSecurityStack', { env: PIPELINE_ENV });
});

afterEach(() => {
  app.cleanup();
});

test('security check option generates lambda/codebuild at pipeline scope', () => {

  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
  const stage = new OneStackApp(app, 'App');
  pipeline.addStage(stage, {
    pre: [
      new cdkp.ConfirmPermissionsBroadening('Check', {
        stage,
      }),
    ],
  });

  const template = Template.fromStack(pipelineStack);
  template.resourceCountIs('AWS::Lambda::Function', 1);
  template.hasResourceProperties('AWS::Lambda::Function', {
    Role: {
      'Fn::GetAtt': [
        stringLike('CdkPipeline*SecurityCheckCDKPipelinesAutoApproveServiceRole*'),
        'Arn',
      ],
    },
  });
  // 1 for github build, 1 for synth stage, and 1 for the application security check
  template.resourceCountIs('AWS::CodeBuild::Project', 3);

  // No CodeBuild project has a build image that is not the standard iamge
  const projects = template.findResources('AWS::CodeBuild::Project', {
    Properties: {
      Environment: {
        Image: CDKP_DEFAULT_CODEBUILD_IMAGE.imageId,
      },
    },
  });
  expect(Object.keys(projects).length).toEqual(3);
});

test('security check option passes correct environment variables to check project', () => {

  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
  const stage = new OneStackApp(pipelineStack, 'App');
  pipeline.addStage(stage, {
    pre: [
      new cdkp.ConfirmPermissionsBroadening('Check', {
        stage,
      }),
    ],
  });

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([
      {
        Name: 'App',
        Actions: Match.arrayWith([
          Match.objectLike({
            Name: stringLike('*Check'),
            Configuration: Match.objectLike({
              EnvironmentVariables: Match.serializedJson([
                { name: 'STAGE_PATH', type: 'PLAINTEXT', value: 'PipelineSecurityStack/App' },
                { name: 'STAGE_NAME', type: 'PLAINTEXT', value: 'App' },
                { name: 'ACTION_NAME', type: 'PLAINTEXT', value: Match.anyValue() },
              ]),
            }),
          }),
        ]),
      },
    ]),
  });
});

test('pipeline created with auto approve tags and lambda/codebuild w/ valid permissions', () => {

  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
  const stage = new OneStackApp(app, 'App');
  pipeline.addStage(stage, {
    pre: [
      new cdkp.ConfirmPermissionsBroadening('Check', {
        stage,
      }),
    ],
  });

  // CodePipeline must be tagged as SECURITY_CHECK=ALLOW_APPROVE
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Tags: [
      {
        Key: 'SECURITY_CHECK',
        Value: 'ALLOW_APPROVE',
      },
    ],
  });
  // Lambda Function only has access to pipelines tagged SECURITY_CHECK=ALLOW_APPROVE
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Policy', {
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
  });
  // CodeBuild must have access to the stacks and invoking the lambda function
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: Match.arrayWith([
        {
          Action: 'sts:AssumeRole',
          Condition: {
            'ForAnyValue:StringEquals': {
              'iam:ResourceTag/aws-cdk:bootstrap-role': [
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
          Resource: [
            {
              'Fn::GetAtt': [
                stringLike('*AutoApprove*'),
                'Arn',
              ],
            },
            {
              'Fn::Join': [
                '',
                [
                  {
                    'Fn::GetAtt': [
                      stringLike('*AutoApprove*'),
                      'Arn',
                    ],
                  },
                  ':*',
                ],
              ],
            },
          ],
        },
      ]),
    },
  });
});

test('confirmBroadeningPermissions and notification topic options generates the right resources', () => {

  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
  const topic = new Topic(pipelineStack, 'NotificationTopic');
  const stage = new OneStackApp(app, 'MyStack');
  pipeline.addStage(stage, {
    pre: [
      new cdkp.ConfirmPermissionsBroadening('Approve', {
        stage,
        notificationTopic: topic,
      }),
    ],
  });

  Template.fromStack(pipelineStack).resourceCountIs('AWS::SNS::Topic', 1);
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([
      {
        Name: 'MyStack',
        Actions: [
          Match.objectLike({
            Configuration: {
              ProjectName: { Ref: stringLike('*SecurityCheck*') },
              EnvironmentVariables: {
                'Fn::Join': ['', [
                  stringLike('*'),
                  { Ref: 'NotificationTopicEB7A0DF1' },
                  stringLike('*'),
                ]],
              },
            },
            Name: stringLike('*Check'),
            Namespace: stringLike('*'),
            RunOrder: 1,
          }),
          Match.objectLike({
            Configuration: {
              CustomData: stringLike('#{*.MESSAGE}'),
              ExternalEntityLink: stringLike('#{*.LINK}'),
            },
            Name: stringLike('*Approv*'),
            RunOrder: 2,
          }),
          Match.objectLike({ Name: 'Stack.Prepare', RunOrder: 3 }),
          Match.objectLike({ Name: 'Stack.Deploy', RunOrder: 4 }),
        ],
      },
    ]),
  });
});