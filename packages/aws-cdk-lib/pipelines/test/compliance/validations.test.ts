/* eslint-disable import/no-extraneous-dependencies */
import { Capture, Match, Template } from '../../../assertions';
import * as codebuild from '../../../aws-codebuild';
import * as codepipeline from '../../../aws-codepipeline';
import * as ec2 from '../../../aws-ec2';
import * as iam from '../../../aws-iam';
import * as s3 from '../../../aws-s3';
import { Stack } from '../../../core';
import * as cdkp from '../../lib';
import { CodePipelineSource, ShellStep } from '../../lib';
import { CDKP_DEFAULT_CODEBUILD_IMAGE } from '../../lib/private/default-codebuild-image';
import { AppWithOutput, ModernTestGitHubNpmPipeline, OneStackApp, PIPELINE_ENV, sortByRunOrder, StageWithStackOutput, stringNoLongerThan, TestApp, TwoStackApp } from '../testhelpers';

let app: TestApp;
let pipelineStack: Stack;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
});

afterEach(() => {
  app.cleanup();
});

test('can add manual approval after app', () => {

  // WHEN
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
  pipeline.addStage(new TwoStackApp(app, 'MyApp'), {
    post: [
      new cdkp.ManualApprovalStep('Approve'),
    ],
  });

  // THEN
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'MyApp',
      Actions: sortByRunOrder([
        Match.objectLike({ Name: 'Stack1.Prepare' }),
        Match.objectLike({ Name: 'Stack1.Deploy' }),
        Match.objectLike({ Name: 'Stack2.Prepare' }),
        Match.objectLike({ Name: 'Stack2.Deploy' }),
        Match.objectLike({ Name: 'Approve' }),
      ]),
    }]),
  });
});

test('can add steps to wave', () => {

  // WHEN
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
  const wave = pipeline.addWave('MyWave', {
    post: [
      new cdkp.ManualApprovalStep('Approve'),
    ],
  });
  wave.addStage(new OneStackApp(pipelineStack, 'Stage1'));
  wave.addStage(new OneStackApp(pipelineStack, 'Stage2'));
  wave.addStage(new OneStackApp(pipelineStack, 'Stage3'));

  // THEN
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'MyWave',
      Actions: sortByRunOrder([
        Match.objectLike({ Name: 'Stage1.Stack.Prepare' }),
        Match.objectLike({ Name: 'Stage2.Stack.Prepare' }),
        Match.objectLike({ Name: 'Stage3.Stack.Prepare' }),
        Match.objectLike({ Name: 'Stage1.Stack.Deploy' }),
        Match.objectLike({ Name: 'Stage2.Stack.Deploy' }),
        Match.objectLike({ Name: 'Stage3.Stack.Deploy' }),
        Match.objectLike({ Name: 'Approve' }),
      ]),
    }]),
  });
});

test('script validation steps can use stack outputs as environment variables', () => {

  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
  const myApp = new AppWithOutput(app, 'Alpha');
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

  // THEN
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'Alpha',
      Actions: Match.arrayWith([
        Match.objectLike({
          Name: 'Stack.Deploy',
          Namespace: 'AlphaStack6B3389FA',
        }),
        Match.objectLike({
          Name: 'Approve',
          Configuration: Match.objectLike({
            EnvironmentVariables: Match.serializedJson([
              { name: 'THE_OUTPUT', value: '#{AlphaStack6B3389FA.MyOutput}', type: 'PLAINTEXT' },
            ]),
          }),
        }),
      ]),
    }]),
  });
});

test('stackOutput generates names limited to 100 characters', () => {

  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
  const stage = new StageWithStackOutput(app, 'APreposterouslyLongAndComplicatedNameMadeUpJustToMakeItExceedTheLimitDefinedByCodeBuild');
  pipeline.addStage(stage, {
    post: [
      new cdkp.ShellStep('TestOutput', {
        commands: ['echo $BUCKET_NAME'],
        envFromCfnOutputs: {
          BUCKET_NAME: stage.output,
        },
      }),
    ],
  });

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'APreposterouslyLongAndComplicatedNameMadeUpJustToMakeItExceedTheLimitDefinedByCodeBuild',
      Actions: Match.arrayWith([
        Match.objectLike({
          Name: 'Stack.Deploy',
          Namespace: stringNoLongerThan(100),
        }),
      ]),
    }]),
  });
});

test('validation step can run from scripts in source', () => {

  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
  pipeline.addStage(new TwoStackApp(app, 'Test'), {
    post: [
      new cdkp.ShellStep('UseSources', {
        input: pipeline.gitHubSource,
        commands: ['set -eu', 'true'],
      }),
    ],
  });

  const sourceArtifact = new Capture();

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'Source',
      Actions: [
        Match.objectLike({
          OutputArtifacts: [{ Name: sourceArtifact }],
        }),
      ],
    }]),
  });
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'Test',
      Actions: Match.arrayWith([
        Match.objectLike({
          Name: 'UseSources',
          InputArtifacts: [{ Name: sourceArtifact.asString() }],
        }),
      ]),
    }]),
  });
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
    Environment: {
      Image: CDKP_DEFAULT_CODEBUILD_IMAGE.imageId,
    },
    Source: {
      BuildSpec: Match.serializedJson(Match.objectLike({
        phases: {
          build: {
            commands: [
              'set -eu',
              'true',
            ],
          },
        },
      })),
    },
  });
});

test('can use additional output artifacts from build', () => {
  const synth = new ShellStep('Synth', {
    input: CodePipelineSource.gitHub('test/test', 'main'),
    commands: ['synth'],
  });

  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    synth,
  });
  pipeline.addStage(new TwoStackApp(app, 'Test'), {
    post: [
      new cdkp.ShellStep('UseBuildArtifact', {
        input: synth.addOutputDirectory('test'),
        commands: ['set -eu', 'true'],
      }),
    ],
  });

  const integArtifact = new Capture();

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'Build',
      Actions: [
        Match.objectLike({
          Name: 'Synth',
          OutputArtifacts: [
            { Name: Match.anyValue() }, // It's not the first output
            { Name: integArtifact },
          ],
        }),
      ],
    }]),
  });

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'Test',
      Actions: Match.arrayWith([
        Match.objectLike({
          Name: 'UseBuildArtifact',
          InputArtifacts: [{ Name: integArtifact.asString() }],
        }),
      ]),
    }]),
  });
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
    Environment: {
      Image: CDKP_DEFAULT_CODEBUILD_IMAGE.imageId,
    },
    Source: {
      BuildSpec: Match.serializedJson(Match.objectLike({
        phases: {
          build: {
            commands: [
              'set -eu',
              'true',
            ],
          },
        },
      })),
    },
  });
});

test('can add policy statements to shell script action', () => {

  // WHEN
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
  pipeline.addStage(new TwoStackApp(app, 'Test'), {
    post: [
      new cdkp.CodeBuildStep('Boop', {
        commands: ['true'],
        rolePolicyStatements: [
          new iam.PolicyStatement({
            actions: ['s3:Banana'],
            resources: ['*'],
          }),
        ],
      }),
    ],
  });

  // THEN
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: Match.arrayWith([Match.objectLike({
        Action: 's3:Banana',
        Resource: '*',
      })]),
    },
  });
});

test('can grant permissions to shell script action', () => {
  const bucket: s3.IBucket = s3.Bucket.fromBucketArn(pipelineStack, 'Bucket', 'arn:aws:s3:::this-particular-bucket');

  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');

  const codeBuildStep = new cdkp.CodeBuildStep('Boop', {
    commands: ['true'],
  });

  pipeline.addStage(new TwoStackApp(app, 'Test'), {
    post: [codeBuildStep],
  });

  pipeline.buildPipeline();

  // WHEN
  bucket.grantRead(codeBuildStep.project);

  // THEN
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: Match.arrayWith([Match.objectLike({
        Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
        Resource: ['arn:aws:s3:::this-particular-bucket', 'arn:aws:s3:::this-particular-bucket/*'],
      })]),
    },
  });
});

test('can run shell script actions in a VPC', () => {
  const vpc: ec2.Vpc = new ec2.Vpc(pipelineStack, 'VPC');

  // All CodeBuild jobs automatically go into the VPC
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk-1', {
    codeBuildDefaults: { vpc },
  });

  pipeline.addStage(new TwoStackApp(app, 'MyApp-1'), {
    post: [new cdkp.ShellStep('VpcAction', {
      commands: ['set -eu', 'true'],
    })],
  });

  // Can also explicitly specify a VPC when going to the "full config" class
  const pipeline2 = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk-2');

  pipeline2.addStage(new TwoStackApp(app, 'MyApp-2'), {
    post: [new cdkp.CodeBuildStep('VpcAction', {
      commands: ['set -eu', 'true'],
      vpc,
    })],
  });

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
    Environment: {
      Image: CDKP_DEFAULT_CODEBUILD_IMAGE.imageId,
    },
    VpcConfig: {
      Subnets: [
        {
          Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
        },
        {
          Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
        },
        {
          Ref: 'VPCPrivateSubnet3Subnet3EDCD457',
        },
      ],
      VpcId: {
        Ref: 'VPCB9E5F0B4',
      },
    },
    Source: {
      BuildSpec: Match.serializedJson(Match.objectLike({
        phases: {
          build: {
            commands: [
              'set -eu',
              'true',
            ],
          },
        },
      })),
    },
  });
});

test('can run shell script actions with a specific SecurityGroup', () => {
  const vpc: ec2.Vpc = new ec2.Vpc(pipelineStack, 'VPC');
  const sg: ec2.SecurityGroup = new ec2.SecurityGroup(pipelineStack, 'SG', { vpc });

  // All CodeBuild jobs automatically go into the VPC
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');

  pipeline.addStage(new TwoStackApp(app, 'Test'), {
    post: [new cdkp.CodeBuildStep('sgAction', {
      commands: ['set -eu', 'true'],
      vpc,
      securityGroups: [sg],
    })],
  });

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'Test',
      Actions: Match.arrayWith([
        Match.objectLike({
          Name: 'sgAction',
        }),
      ]),
    }]),
  });
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
    VpcConfig: {
      SecurityGroupIds: [
        {
          'Fn::GetAtt': [
            'SGADB53937',
            'GroupId',
          ],
        },
      ],
      VpcId: {
        Ref: 'VPCB9E5F0B4',
      },
    },
  });
});

test('can run scripts with specified BuildEnvironment', () => {

  // Run all Build jobs with the given image
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk-1', {
    codeBuildDefaults: {
      buildEnvironment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_2_0,
      },
    },
  });

  pipeline.addStage(new TwoStackApp(app, 'Test-1'), {
    post: [new cdkp.ShellStep('imageAction', {
      commands: ['true'],
    })],
  });

  const pipeline2 = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk-2');

  pipeline2.addStage(new TwoStackApp(app, 'Test-2'), {
    post: [new cdkp.CodeBuildStep('imageAction', {
      commands: ['true'],
      buildEnvironment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_2_0,
      },
    })],
  });

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
    Environment: {
      Image: 'aws/codebuild/standard:2.0',
    },
  });
});

test('can run scripts with magic environment variables', () => {

  // Run all Build jobs with the given image
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');

  pipeline.addStage(new TwoStackApp(app, 'Test'), {
    post: [new cdkp.ShellStep('imageAction', {
      commands: ['true'],
      env: {
        VERSION: codepipeline.GlobalVariables.executionId,
      },
    })],
  });

  // THEN
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'Test',
      Actions: Match.arrayWith([
        Match.objectLike({
          Name: 'imageAction',
          Configuration: Match.objectLike({
            EnvironmentVariables: Match.serializedJson([
              {
                name: 'VERSION',
                type: 'PLAINTEXT',
                value: '#{codepipeline.PipelineExecutionId}',
              },
            ]),
          }),
        }),
      ]),
    }]),
  });
});