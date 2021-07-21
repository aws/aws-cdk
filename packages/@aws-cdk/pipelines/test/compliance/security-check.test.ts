import { anything, arrayWith, encodedJson, objectLike, stringLike } from '@aws-cdk/assert-internal';
import '@aws-cdk/assert-internal/jest';
import { Topic } from '@aws-cdk/aws-sns';
import { Stack } from '@aws-cdk/core';
import * as cdkp from '../../lib';
import { LegacyTestGitHubNpmPipeline, ModernTestGitHubNpmPipeline, OneStackApp, PIPELINE_ENV, TestApp } from '../testhelpers';
import { behavior } from '../testhelpers/compliance';

let app: TestApp;
let pipelineStack: Stack;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineSecurityStack', { env: PIPELINE_ENV });
});

afterEach(() => {
  app.cleanup();
});

behavior('security check option generates lambda/codebuild at pipeline scope', (suite) => {
  suite.legacy(() => {
    const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    pipeline.addApplicationStage(new OneStackApp(app, 'App'), { confirmBroadeningPermissions: true });

    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    const stage = new OneStackApp(app, 'App');
    pipeline.addStage(stage, {
      pre: [
        new cdkp.ConfirmPermissionsBroadening('Check', {
          stage,
        }),
      ],
    });

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
    expect(pipelineStack).toCountResources('AWS::Lambda::Function', 1);
    expect(pipelineStack).toHaveResourceLike('AWS::Lambda::Function', {
      Role: {
        'Fn::GetAtt': [
          stringLike('CdkPipeline*SecurityCheckCDKPipelinesAutoApproveServiceRole*'),
          'Arn',
        ],
      },
    });
    // 1 for github build, 1 for synth stage, and 1 for the application security check
    expect(pipelineStack).toCountResources('AWS::CodeBuild::Project', 3);
  }
});

behavior('security check option passes correct environment variables to check project', (suite) => {
  suite.legacy(() => {
    const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    pipeline.addApplicationStage(new OneStackApp(pipelineStack, 'App'), { confirmBroadeningPermissions: true });

    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    const stage = new OneStackApp(pipelineStack, 'App');
    pipeline.addStage(stage, {
      pre: [
        new cdkp.ConfirmPermissionsBroadening('Check', {
          stage,
        }),
      ],
    });

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
    expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
      Stages: arrayWith(
        {
          Name: 'App',
          Actions: arrayWith(
            objectLike({
              Name: stringLike('*Check'),
              Configuration: objectLike({
                EnvironmentVariables: encodedJson([
                  { name: 'STAGE_PATH', type: 'PLAINTEXT', value: 'PipelineSecurityStack/App' },
                  { name: 'STAGE_NAME', type: 'PLAINTEXT', value: 'App' },
                  { name: 'ACTION_NAME', type: 'PLAINTEXT', value: anything() },
                ]),
              }),
            }),
          ),
        },
      ),
    });
  }
});

behavior('pipeline created with auto approve tags and lambda/codebuild w/ valid permissions', (suite) => {
  suite.legacy(() => {
    const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    pipeline.addApplicationStage(new OneStackApp(app, 'App'), { confirmBroadeningPermissions: true });

    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    const stage = new OneStackApp(app, 'App');
    pipeline.addStage(stage, {
      pre: [
        new cdkp.ConfirmPermissionsBroadening('Check', {
          stage,
        }),
      ],
    });

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
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
    });
    // CodeBuild must have access to the stacks and invoking the lambda function
    expect(pipelineStack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: arrayWith(
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
            Resource: {
              'Fn::GetAtt': [
                stringLike('*AutoApprove*'),
                'Arn',
              ],
            },
          },
        ),
      },
    });
  }
});

behavior('confirmBroadeningPermissions option at addApplicationStage runs security check on all apps unless overriden', (suite) => {
  suite.legacy(() => {
    const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    const securityStage = pipeline.addApplicationStage(new OneStackApp(app, 'StageSecurityCheckStack'), { confirmBroadeningPermissions: true });
    securityStage.addApplication(new OneStackApp(app, 'AnotherStack'));
    securityStage.addApplication(new OneStackApp(app, 'SkipCheckStack'), { confirmBroadeningPermissions: false });

    THEN_codePipelineExpectation();
  });

  // For the modern API, there is no inheritance
  suite.doesNotApply.modern();

  function THEN_codePipelineExpectation() {
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
  }
});

behavior('confirmBroadeningPermissions option at addApplication runs security check only on selected application', (suite) => {
  suite.legacy(() => {
    const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    const noSecurityStage = pipeline.addApplicationStage(new OneStackApp(app, 'NoSecurityCheckStack'));
    noSecurityStage.addApplication(new OneStackApp(app, 'EnableCheckStack'), { confirmBroadeningPermissions: true });

    THEN_codePipelineExpectation();
  });

  // For the modern API, there is no inheritance
  suite.doesNotApply.modern();

  function THEN_codePipelineExpectation() {
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
  }
});

behavior('confirmBroadeningPermissions and notification topic options generates the right resources', (suite) => {
  suite.legacy(() => {
    const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    const topic = new Topic(pipelineStack, 'NotificationTopic');
    pipeline.addApplicationStage(new OneStackApp(app, 'MyStack'), {
      confirmBroadeningPermissions: true,
      securityNotificationTopic: topic,
    });

    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
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

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
    expect(pipelineStack).toCountResources('AWS::SNS::Topic', 1);
    expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
      Stages: arrayWith(
        {
          Name: 'MyStack',
          Actions: [
            objectLike({
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
            objectLike({
              Configuration: {
                CustomData: stringLike('#{*.MESSAGE}'),
                ExternalEntityLink: stringLike('#{*.LINK}'),
              },
              Name: stringLike('*Approv*'),
              RunOrder: 2,
            }),
            objectLike({ Name: 'Stack.Prepare', RunOrder: 3 }),
            objectLike({ Name: 'Stack.Deploy', RunOrder: 4 }),
          ],
        },
      ),
    });
  }
});

behavior('Stages declared outside the pipeline create their own ApplicationSecurityCheck', (suite) => {
  suite.legacy(() => {
    const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
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

    THEN_codePipelineExpectation();
  });

  // Not a valid use of the modern API
  suite.doesNotApply.modern();

  function THEN_codePipelineExpectation() {
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
                ExternalEntityLink: '#{UnattachedStageSecurityCheck.LINK}',
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
  }
});