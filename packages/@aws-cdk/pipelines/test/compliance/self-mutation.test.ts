/* eslint-disable import/no-extraneous-dependencies */
import { Match, Template } from '@aws-cdk/assertions';
import * as cb from '@aws-cdk/aws-codebuild';
import * as cp from '@aws-cdk/aws-codepipeline';
import { Stack, Stage } from '@aws-cdk/core';
import { CDKP_DEFAULT_CODEBUILD_IMAGE } from '../../lib/private/default-codebuild-image';
import { behavior, LegacyTestGitHubNpmPipeline, PIPELINE_ENV, TestApp, ModernTestGitHubNpmPipeline } from '../testhelpers';

let app: TestApp;
let pipelineStack: Stack;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
});

afterEach(() => {
  app.cleanup();
});

behavior('CodePipeline has self-mutation stage', (suite) => {
  suite.legacy(() => {
    new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
    new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
    // THEN
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([{
        Name: 'UpdatePipeline',
        Actions: [
          Match.objectLike({
            Name: 'SelfMutate',
            Configuration: Match.objectLike({
              ProjectName: { Ref: Match.anyValue() },
            }),
          }),
        ],
      }]),
    });

    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
      Environment: {
        Image: CDKP_DEFAULT_CODEBUILD_IMAGE.imageId,
      },
      Source: {
        BuildSpec: Match.serializedJson(Match.objectLike({
          phases: {
            install: {
              commands: ['npm install -g aws-cdk@1'],
            },
            build: {
              commands: Match.arrayWith(['cdk -a . deploy PipelineStack --require-approval=never --verbose']),
            },
          },
        })),
        Type: 'CODEPIPELINE',
      },
    });
  }
});

behavior('selfmutation stage correctly identifies nested assembly of pipeline stack', (suite) => {
  suite.legacy(() => {
    const pipelineStage = new Stage(app, 'PipelineStage');
    const nestedPipelineStack = new Stack(pipelineStage, 'PipelineStack', { env: PIPELINE_ENV });
    new LegacyTestGitHubNpmPipeline(nestedPipelineStack, 'Cdk');

    THEN_codePipelineExpectation(nestedPipelineStack);
  });

  suite.modern(() => {
    const pipelineStage = new Stage(app, 'PipelineStage');
    const nestedPipelineStack = new Stack(pipelineStage, 'PipelineStack', { env: PIPELINE_ENV });
    new ModernTestGitHubNpmPipeline(nestedPipelineStack, 'Cdk');

    THEN_codePipelineExpectation(nestedPipelineStack);
  });

  function THEN_codePipelineExpectation(nestedPipelineStack: Stack) {
    Template.fromStack(nestedPipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
      Environment: {
        Image: CDKP_DEFAULT_CODEBUILD_IMAGE.imageId,
      },
      Source: {
        BuildSpec: Match.serializedJson(Match.objectLike({
          phases: {
            build: {
              commands: Match.arrayWith(['cdk -a assembly-PipelineStage deploy PipelineStage/PipelineStack --require-approval=never --verbose']),
            },
          },
        })),
      },
    });
  }
});

behavior('selfmutation feature can be turned off', (suite) => {
  suite.legacy(() => {
    const cloudAssemblyArtifact = new cp.Artifact();
    // WHEN
    new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
      cloudAssemblyArtifact,
      selfMutating: false,
    });

    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
    // WHEN
    new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
      selfMutation: false,
    });

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.not(Match.arrayWith([{
        Name: 'UpdatePipeline',
        Actions: Match.anyValue(),
      }])),
    });
  }
});

behavior('can control fix/CLI version used in pipeline selfupdate', (suite) => {
  suite.legacy(() => {
    // WHEN
    new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
      pipelineName: 'vpipe',
      cdkCliVersion: '1.2.3',
    });

    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
    new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
      pipelineName: 'vpipe',
      cliVersion: '1.2.3',
    });

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
    // THEN
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
      Name: 'vpipe-selfupdate',
      Source: {
        BuildSpec: Match.serializedJson(Match.objectLike({
          phases: {
            install: {
              commands: ['npm install -g aws-cdk@1.2.3'],
            },
          },
        })),
      },
    });
  }
});

behavior('Pipeline stack itself can use assets (has implications for selfupdate)', (suite) => {
  suite.legacy(() => {
    // WHEN
    new LegacyTestGitHubNpmPipeline(pipelineStack, 'PrivilegedPipeline', {
      supportDockerAssets: true,
    });

    // THEN
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
      Environment: {
        PrivilegedMode: true,
      },
    });
  });

  suite.modern(() => {
    // WHEN
    new ModernTestGitHubNpmPipeline(pipelineStack, 'PrivilegedPipeline', {
      dockerEnabledForSelfMutation: true,
    });

    // THEN
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
      Environment: {
        PrivilegedMode: true,
      },
    });
  });
});

behavior('self-update project role uses tagged bootstrap-role permissions', (suite) => {
  suite.legacy(() => {
    new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');

    THEN_codePipelineExpectations();
  });

  suite.modern(() => {
    new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
    THEN_codePipelineExpectations();
  });

  function THEN_codePipelineExpectations() {
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Resource: 'arn:*:iam::123pipeline:role/*',
            Condition: {
              'ForAnyValue:StringEquals': {
                'iam:ResourceTag/aws-cdk:bootstrap-role': ['image-publishing', 'file-publishing', 'deploy'],
              },
            },
          },
          {
            Action: 'cloudformation:DescribeStacks',
            Effect: 'Allow',
            Resource: '*',
          },
          {
            Action: 's3:ListBucket',
            Effect: 'Allow',
            Resource: '*',
          },
        ]),
      },
    });
  }
});


behavior('self-mutation stage can be customized with BuildSpec', (suite) => {
  suite.legacy(() => {
    new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
      selfMutationBuildSpec: cb.BuildSpec.fromObject({
        phases: {
          install: {
            commands: 'npm config set registry example.com',
          },
        },
        cache: {
          paths: 'node_modules',
        },
      }),
    });

    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
    new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
      selfMutationCodeBuildDefaults: {
        partialBuildSpec: cb.BuildSpec.fromObject({
          phases: {
            install: {
              commands: ['npm config set registry example.com'],
            },
          },
          cache: {
            paths: ['node_modules'],
          },
        }),
      },
    });

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
      Environment: {
        Image: CDKP_DEFAULT_CODEBUILD_IMAGE.imageId,
        PrivilegedMode: false,
      },
      Source: {
        BuildSpec: Match.serializedJson(Match.objectLike({
          phases: {
            install: {
              commands: ['npm config set registry example.com', 'npm install -g aws-cdk@1'],
            },
            build: {
              commands: Match.arrayWith(['cdk -a . deploy PipelineStack --require-approval=never --verbose']),
            },
          },
          cache: {
            paths: ['node_modules'],
          },
        })),
        Type: 'CODEPIPELINE',
      },
    });
  }
});
