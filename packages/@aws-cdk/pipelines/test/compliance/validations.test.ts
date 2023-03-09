/* eslint-disable import/no-extraneous-dependencies */
import { Capture, Match, Template } from '@aws-cdk/assertions';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { Stack } from '@aws-cdk/core';
import * as cdkp from '../../lib';
import { CodePipelineSource, ShellStep } from '../../lib';
import { CDKP_DEFAULT_CODEBUILD_IMAGE } from '../../lib/private/default-codebuild-image';
import { AppWithOutput, behavior, LegacyTestGitHubNpmPipeline, ModernTestGitHubNpmPipeline, OneStackApp, PIPELINE_ENV, sortByRunOrder, StageWithStackOutput, stringNoLongerThan, TestApp, TwoStackApp } from '../testhelpers';

let app: TestApp;
let pipelineStack: Stack;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
});

afterEach(() => {
  app.cleanup();
});

behavior('can add manual approval after app', (suite) => {
  // No need to be backwards compatible
  suite.doesNotApply.legacy();

  suite.modern(() => {
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
});

behavior('can add steps to wave', (suite) => {
  // No need to be backwards compatible
  suite.doesNotApply.legacy();

  suite.modern(() => {
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
});


behavior('script validation steps can use stack outputs as environment variables', (suite) => {
  suite.legacy(() => {
    // GIVEN
    const { pipeline } = legacySetup();
    const stage = new StageWithStackOutput(app, 'MyApp');

    // WHEN
    const pipeStage = pipeline.addApplicationStage(stage);
    pipeStage.addActions(new cdkp.ShellScriptAction({
      actionName: 'TestOutput',
      useOutputs: {
        BUCKET_NAME: pipeline.stackOutput(stage.output),
      },
      commands: ['echo $BUCKET_NAME'],
    }));

    // THEN
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([{
        Name: 'MyApp',
        Actions: Match.arrayWith([
          Match.objectLike({
            ActionTypeId: {
              Provider: 'CodeBuild',
            },
            Configuration: {
              ProjectName: Match.anyValue(),
            },
            InputArtifacts: [{ Name: Match.anyValue() }],
            Name: 'TestOutput',
          }),
          Match.objectLike({
            Name: 'Stack.Deploy',
            OutputArtifacts: [{ Name: Match.anyValue() }],
            Configuration: {
              OutputFileName: 'outputs.json',
            },
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
                'export BUCKET_NAME="$(node -pe \'require(process.env.CODEBUILD_SRC_DIR + "/outputs.json")["BucketName"]\')"',
                'echo $BUCKET_NAME',
              ],
            },
          },
        })),
        Type: 'CODEPIPELINE',
      },
    });
  });
  suite.modern(() => {
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
});

behavior('stackOutput generates names limited to 100 characters', (suite) => {
  suite.legacy(() => {
    const { pipeline } = legacySetup();
    const stage = new StageWithStackOutput(app, 'APreposterouslyLongAndComplicatedNameMadeUpJustToMakeItExceedTheLimitDefinedByCodeBuild');
    const pipeStage = pipeline.addApplicationStage(stage);
    pipeStage.addActions(new cdkp.ShellScriptAction({
      actionName: 'TestOutput',
      useOutputs: {
        BUCKET_NAME: pipeline.stackOutput(stage.output),
      },
      commands: ['echo $BUCKET_NAME'],
    }));

    // THEN
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([{
        Name: 'APreposterouslyLongAndComplicatedNameMadeUpJustToMakeItExceedTheLimitDefinedByCodeBuild',
        Actions: Match.arrayWith([
          Match.objectLike({
            ActionTypeId: {
              Provider: 'CodeBuild',
            },
            Configuration: {
              ProjectName: Match.anyValue(),
            },
            InputArtifacts: [{ Name: stringNoLongerThan(100) }],
            Name: 'TestOutput',
          }),
          Match.objectLike({
            Name: 'Stack.Deploy',
            OutputArtifacts: [{ Name: stringNoLongerThan(100) }],
            Configuration: {
              OutputFileName: 'outputs.json',
            },
          }),
        ]),
      }]),
    });
  });

  suite.modern(() => {
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
});

behavior('validation step can run from scripts in source', (suite) => {
  suite.legacy(() => {
    const { pipeline, sourceArtifact } = legacySetup();

    // WHEN
    pipeline.addStage('Test').addActions(new cdkp.ShellScriptAction({
      actionName: 'UseSources',
      additionalArtifacts: [sourceArtifact],
      commands: ['true'],
    }));

    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    pipeline.addStage(new TwoStackApp(app, 'Test'), {
      post: [
        new cdkp.ShellStep('UseSources', {
          input: pipeline.gitHubSource,
          commands: ['set -eu', 'true'],
        }),
      ],
    });

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
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
  }
});

behavior('can use additional output artifacts from build', (suite) => {
  suite.legacy(() => {
    // WHEN
    const { pipeline, integTestArtifact } = legacySetup();
    pipeline.addStage('Test').addActions(new cdkp.ShellScriptAction({
      actionName: 'UseBuildArtifact',
      additionalArtifacts: [integTestArtifact],
      commands: ['true'],
    }));

    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
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

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
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
  }
});

behavior('can add policy statements to shell script action', (suite) => {
  suite.legacy(() => {
    // WHEN
    const { pipeline, integTestArtifact } = legacySetup();
    pipeline.addStage('Test').addActions(new cdkp.ShellScriptAction({
      actionName: 'Boop',
      additionalArtifacts: [integTestArtifact],
      commands: ['true'],
      rolePolicyStatements: [
        new iam.PolicyStatement({
          actions: ['s3:Banana'],
          resources: ['*'],
        }),
      ],
    }));

    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
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

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
    // THEN
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([Match.objectLike({
          Action: 's3:Banana',
          Resource: '*',
        })]),
      },
    });
  }
});

behavior('can grant permissions to shell script action', (suite) => {
  let bucket: s3.IBucket;
  beforeEach(() => {
    bucket = s3.Bucket.fromBucketArn(pipelineStack, 'Bucket', 'arn:aws:s3:::this-particular-bucket');
  });

  suite.legacy(() => {
    const { pipeline, integTestArtifact } = legacySetup();
    const action = new cdkp.ShellScriptAction({
      actionName: 'Boop',
      additionalArtifacts: [integTestArtifact],
      commands: ['true'],
    });
    pipeline.addStage('Test').addActions(action);

    // WHEN
    bucket.grantRead(action);
    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
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

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
    // THEN
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([Match.objectLike({
          Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
          Resource: ['arn:aws:s3:::this-particular-bucket', 'arn:aws:s3:::this-particular-bucket/*'],
        })]),
      },
    });
  }
});

behavior('can run shell script actions in a VPC', (suite) => {
  let vpc: ec2.Vpc;
  beforeEach(() => {
    vpc = new ec2.Vpc(pipelineStack, 'VPC');
  });

  suite.legacy(() => {
    const { pipeline, integTestArtifact } = legacySetup();

    pipeline.addStage('Test').addActions(new cdkp.ShellScriptAction({
      vpc,
      actionName: 'VpcAction',
      additionalArtifacts: [integTestArtifact],
      commands: ['true'],
    }));

    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
    // All CodeBuild jobs automatically go into the VPC
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
      codeBuildDefaults: { vpc },
    });

    pipeline.addStage(new TwoStackApp(app, 'MyApp'), {
      post: [new cdkp.ShellStep('VpcAction', {
        commands: ['set -eu', 'true'],
      })],
    });

    THEN_codePipelineExpectation();
  });

  suite.additional('modern, alternate API', () => {
    // Can also explicitly specify a VPC when going to the "full config" class
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');

    pipeline.addStage(new TwoStackApp(app, 'MyApp'), {
      post: [new cdkp.CodeBuildStep('VpcAction', {
        commands: ['set -eu', 'true'],
        vpc,
      })],
    });

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
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
  }
});

behavior('can run shell script actions with a specific SecurityGroup', (suite) => {
  let vpc: ec2.Vpc;
  let sg: ec2.SecurityGroup;
  beforeEach(() => {
    vpc = new ec2.Vpc(pipelineStack, 'VPC');
    sg = new ec2.SecurityGroup(pipelineStack, 'SG', { vpc });
  });

  suite.legacy(() => {
    // WHEN
    const { pipeline, integTestArtifact } = legacySetup();
    pipeline.addStage('Test').addActions(new cdkp.ShellScriptAction({
      vpc,
      securityGroups: [sg],
      actionName: 'sgAction',
      additionalArtifacts: [integTestArtifact],
      commands: ['true'],
    }));

    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
    // All CodeBuild jobs automatically go into the VPC
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');

    pipeline.addStage(new TwoStackApp(app, 'Test'), {
      post: [new cdkp.CodeBuildStep('sgAction', {
        commands: ['set -eu', 'true'],
        vpc,
        securityGroups: [sg],
      })],
    });

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
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
  }
});

behavior('can run scripts with specified BuildEnvironment', (suite) => {
  suite.legacy(() => {
    let { pipeline, integTestArtifact } = legacySetup();

    // WHEN
    pipeline.addStage('Test').addActions(new cdkp.ShellScriptAction({
      actionName: 'imageAction',
      additionalArtifacts: [integTestArtifact],
      commands: ['true'],
      environment: { buildImage: codebuild.LinuxBuildImage.STANDARD_2_0 },
    }));

    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
    // Run all Build jobs with the given image
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
      codeBuildDefaults: {
        buildEnvironment: {
          buildImage: codebuild.LinuxBuildImage.STANDARD_2_0,
        },
      },
    });

    pipeline.addStage(new TwoStackApp(app, 'Test'), {
      post: [new cdkp.ShellStep('imageAction', {
        commands: ['true'],
      })],
    });

    THEN_codePipelineExpectation();
  });

  suite.additional('modern, alternative API', () => {
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');

    pipeline.addStage(new TwoStackApp(app, 'Test'), {
      post: [new cdkp.CodeBuildStep('imageAction', {
        commands: ['true'],
        buildEnvironment: {
          buildImage: codebuild.LinuxBuildImage.STANDARD_2_0,
        },
      })],
    });

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
      Environment: {
        Image: 'aws/codebuild/standard:2.0',
      },
    });
  }
});

behavior('can run scripts with magic environment variables', (suite) => {
  suite.legacy(() => {
    const { pipeline, integTestArtifact } = legacySetup();
    pipeline.addStage('Test').addActions(new cdkp.ShellScriptAction({
      actionName: 'imageAction',
      additionalArtifacts: [integTestArtifact],
      commands: ['true'],
      environmentVariables: {
        VERSION: { value: codepipeline.GlobalVariables.executionId },
      },
    }));

    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
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

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
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
  }
});


/**
 * Some shared setup for legacy API tests
 */
function legacySetup() {
  const sourceArtifact = new codepipeline.Artifact();
  const cloudAssemblyArtifact = new codepipeline.Artifact('CloudAsm');
  const integTestArtifact = new codepipeline.Artifact('IntegTests');
  const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    sourceArtifact,
    cloudAssemblyArtifact,
    synthAction: cdkp.SimpleSynthAction.standardNpmSynth({
      sourceArtifact,
      cloudAssemblyArtifact,
      additionalArtifacts: [{ directory: 'test', artifact: integTestArtifact }],
    }),
  });

  return { sourceArtifact, cloudAssemblyArtifact, integTestArtifact, pipeline };
}