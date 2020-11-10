import { arrayWith, deepObjectLike, encodedJson, objectLike, Capture } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as cbuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as s3 from '@aws-cdk/aws-s3';
import { Stack } from '@aws-cdk/core';
import * as cdkp from '../lib';
import { PIPELINE_ENV, TestApp, TestGitHubNpmPipeline } from './testutil';

let app: TestApp;
let pipelineStack: Stack;

beforeEach(() => {
  app = new TestApp({ outdir: 'testcdk.out' });
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
});

afterEach(() => {
  app.cleanup();
});

test('SimpleSynthAction takes arrays of commands', () => {
  // WHEN
  new TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    synthAction: new cdkp.SimpleSynthAction({
      installCommands: ['install1', 'install2'],
      buildCommands: ['build1', 'build2'],
      testCommands: ['test1', 'test2'],
      synthCommand: 'cdk synth',
    }),
  });

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
    Environment: {
      Image: 'aws/codebuild/standard:4.0',
    },
    Source: {
      BuildSpec: encodedJson(deepObjectLike({
        phases: {
          pre_build: {
            commands: [
              'install1',
              'install2',
            ],
          },
          build: {
            commands: [
              'build1',
              'build2',
              'test1',
              'test2',
              'cdk synth',
            ],
          },
        },
      })),
    },
  });
});

test.each([['npm'], ['yarn']])('%s build automatically determines artifact base-directory', (npmYarn) => {
  // WHEN
  new TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    synthAction: npmYarnBuild(npmYarn)(),
  });

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
    Environment: {
      Image: 'aws/codebuild/standard:4.0',
    },
    Source: {
      BuildSpec: encodedJson(deepObjectLike({
        artifacts: {
          'base-directory': 'testcdk.out',
        },
      })),
    },
  });
});

test.each([['npm'], ['yarn']])('%s build respects subdirectory', (npmYarn) => {
  // WHEN
  new TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    synthAction: npmYarnBuild(npmYarn)({
      subdirectory: 'subdir',
    }),
  });

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
    Environment: {
      Image: 'aws/codebuild/standard:4.0',
    },
    Source: {
      BuildSpec: encodedJson(deepObjectLike({
        phases: {
          pre_build: {
            commands: arrayWith('cd subdir'),
          },
        },
        artifacts: {
          'base-directory': 'subdir/testcdk.out',
        },
      })),
    },
  });
});

test.each([['npm'], ['yarn']])('%s assumes no build step by default', (npmYarn) => {
  // WHEN
  new TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    synthAction: npmYarnBuild(npmYarn)(),
  });

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
    Environment: {
      Image: 'aws/codebuild/standard:4.0',
    },
    Source: {
      BuildSpec: encodedJson(deepObjectLike({
        phases: {
          build: {
            commands: ['npx cdk synth'],
          },
        },
      })),
    },
  });
});

test.each([['npm'], ['yarn']])('%s can have its install command overridden', (npmYarn) => {
  // WHEN
  new TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    synthAction: npmYarnBuild(npmYarn)({
      installCommand: '/bin/true',
    }),
  });

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
    Environment: {
      Image: 'aws/codebuild/standard:4.0',
    },
    Source: {
      BuildSpec: encodedJson(deepObjectLike({
        phases: {
          pre_build: {
            commands: ['/bin/true'],
          },
        },
      })),
    },
  });
});

test('Standard (NPM) synth can output additional artifacts', () => {
  // WHEN
  const addlArtifact = new codepipeline.Artifact('IntegTest');
  new TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    synthAction: cdkp.SimpleSynthAction.standardNpmSynth({
      additionalArtifacts: [
        {
          artifact: addlArtifact,
          directory: 'test',
        },
      ],
    }),
  });

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
    Environment: {
      Image: 'aws/codebuild/standard:4.0',
    },
    Source: {
      BuildSpec: encodedJson(deepObjectLike({
        artifacts: {
          'secondary-artifacts': {
            CDKCloudAssembly: {
              'base-directory': 'testcdk.out',
              'files': '**/*',
            },
            IntegTest: {
              'base-directory': 'test',
              'files': '**/*',
            },
          },
        },
      })),
    },
  });
});

test('Standard (NPM) synth can run in a VPC', () => {
  // WHEN
  new TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    synthAction: cdkp.SimpleSynthAction.standardNpmSynth({
      vpc: new ec2.Vpc(pipelineStack, 'NpmSynthTestVpc'),
    }),
  });

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
    VpcConfig: {
      SecurityGroupIds: [
        {
          'Fn::GetAtt': [
            'CdkPipelineBuildSynthCdkBuildProjectSecurityGroupEA44D7C2',
            'GroupId',
          ],
        },
      ],
      Subnets: [
        {
          Ref: 'NpmSynthTestVpcPrivateSubnet1Subnet81E3AA56',
        },
        {
          Ref: 'NpmSynthTestVpcPrivateSubnet2SubnetC1CA3EF0',
        },
        {
          Ref: 'NpmSynthTestVpcPrivateSubnet3SubnetA04163EE',
        },
      ],
      VpcId: {
        Ref: 'NpmSynthTestVpc5E703F25',
      },
    },
  });
});

test('Standard (Yarn) synth can run in a VPC', () => {
  // WHEN
  new TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    synthAction: cdkp.SimpleSynthAction.standardYarnSynth({
      vpc: new ec2.Vpc(pipelineStack, 'YarnSynthTestVpc'),
    }),
  });

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
    VpcConfig: {
      SecurityGroupIds: [
        {
          'Fn::GetAtt': [
            'CdkPipelineBuildSynthCdkBuildProjectSecurityGroupEA44D7C2',
            'GroupId',
          ],
        },
      ],
      Subnets: [
        {
          Ref: 'YarnSynthTestVpcPrivateSubnet1Subnet2805334B',
        },
        {
          Ref: 'YarnSynthTestVpcPrivateSubnet2SubnetDCFBF596',
        },
        {
          Ref: 'YarnSynthTestVpcPrivateSubnet3SubnetE11E0C86',
        },
      ],
      VpcId: {
        Ref: 'YarnSynthTestVpc5F654735',
      },
    },
  });
});

test('Pipeline action contains a hash that changes as the buildspec changes', () => {
  const hash1 = synthWithAction(() => cdkp.SimpleSynthAction.standardNpmSynth());

  // To make sure the hash is not just random :)
  const hash1prime = synthWithAction(() => cdkp.SimpleSynthAction.standardNpmSynth());

  const hash2 = synthWithAction(() => cdkp.SimpleSynthAction.standardNpmSynth({
    installCommand: 'do install',
  }));
  const hash3 = synthWithAction(() => cdkp.SimpleSynthAction.standardNpmSynth({
    environment: {
      computeType: cbuild.ComputeType.LARGE,
    },
  }));
  const hash4 = synthWithAction(() => cdkp.SimpleSynthAction.standardNpmSynth({
    environmentVariables: {
      xyz: { value: 'SOME-VALUE' },
    },
  }));

  expect(hash1).toEqual(hash1prime);

  expect(hash1).not.toEqual(hash2);
  expect(hash1).not.toEqual(hash3);
  expect(hash1).not.toEqual(hash4);
  expect(hash2).not.toEqual(hash3);
  expect(hash2).not.toEqual(hash4);
  expect(hash3).not.toEqual(hash4);

  function synthWithAction(cb: () => cdkp.ISynthAction) {
    const _app = new TestApp({ outdir: 'testcdk.out' });
    const _pipelineStack = new Stack(_app, 'PipelineStack', { env: PIPELINE_ENV });

    new TestGitHubNpmPipeline(_pipelineStack, 'Cdk', {
      synthAction: cb(),
    });

    const theHash = Capture.aString();
    expect(_pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
      Stages: arrayWith({
        Name: 'Build',
        Actions: [
          objectLike({
            Name: 'Synth',
            Configuration: objectLike({
              EnvironmentVariables: encodedJson([
                {
                  name: '_PROJECT_CONFIG_HASH',
                  type: 'PLAINTEXT',
                  value: theHash.capture(),
                },
              ]),
            }),
          }),
        ],
      }),
    });

    return theHash.capturedValue;
  }
});

test('SimpleSynthAction is IGrantable', () => {
  // GIVEN
  const synthAction = cdkp.SimpleSynthAction.standardNpmSynth();
  new TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    synthAction,
  });
  const bucket = new s3.Bucket(pipelineStack, 'Bucket');

  // WHEN
  bucket.grantRead(synthAction);

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: arrayWith(deepObjectLike({
        Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
      })),
    },
  });
});

test('SimpleSynthAction can reference an imported ECR repo', () => {
  // Repro from https://github.com/aws/aws-cdk/issues/10535

  // WHEN
  new TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    synthAction: cdkp.SimpleSynthAction.standardNpmSynth({
      environment: {
        buildImage: cbuild.LinuxBuildImage.fromEcrRepository(
          ecr.Repository.fromRepositoryName(pipelineStack, 'ECRImage', 'my-repo-name'),
        ),
      },
    }),
  });
});

function npmYarnBuild(npmYarn: string) {
  if (npmYarn === 'npm') { return cdkp.SimpleSynthAction.standardNpmSynth; }
  if (npmYarn === 'yarn') { return cdkp.SimpleSynthAction.standardYarnSynth; }
  throw new Error(`Expecting npm|yarn: ${npmYarn}`);
}