/* eslint-disable import/no-extraneous-dependencies */
import { arrayWith, deepObjectLike, encodedJson, objectLike, Capture } from '@aws-cdk/assert-internal';
import '@aws-cdk/assert-internal/jest';
import * as cbuild from '@aws-cdk/aws-codebuild';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as s3 from '@aws-cdk/aws-s3';
import { Stack } from '@aws-cdk/core';
import * as cdkp from '../../../lib';
import * as testutil from '../testutil';

let app: testutil.TestApp;
let pipelineStack: Stack;

// Must be unique across all test files, but preferably also consistent
const OUTDIR = 'testcdk1.out';

beforeEach(() => {
  app = new testutil.TestApp({ outdir: OUTDIR });
  pipelineStack = new Stack(app, 'PipelineStack', { env: testutil.PIPELINE_ENV });
});

afterEach(() => {
  app.cleanup();
});

test('SimpleSynthAction takes arrays of commands', () => {
  // WHEN
  new testutil.TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    installCommands: ['install1', 'install2'],
    buildCommands: ['build1', 'build2'],
  });

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
    Environment: {
      Image: 'aws/codebuild/standard:5.0',
    },
    Source: {
      BuildSpec: encodedJson(deepObjectLike({
        phases: {
          install: {
            commands: [
              'install1',
              'install2',
            ],
          },
          build: {
            commands: [
              'build1',
              'build2',
            ],
          },
        },
      })),
    },
  });
});

test('synth automatically determines artifact base-directory', () => {
  // WHEN
  new testutil.TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
  });

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
    Environment: {
      Image: 'aws/codebuild/standard:5.0',
    },
    Source: {
      BuildSpec: encodedJson(deepObjectLike({
        artifacts: {
          'base-directory': 'cdk.out',
        },
      })),
    },
  });
});

test('synth build respects subdirectory', () => {
  // WHEN
  new testutil.TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    subdirectory: 'subdir',
  });

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
    Environment: {
      Image: 'aws/codebuild/standard:5.0',
    },
    Source: {
      BuildSpec: encodedJson(deepObjectLike({
        phases: {
          install: {
            commands: arrayWith('cd subdir'),
          },
        },
        artifacts: {
          'base-directory': 'subdir/cdk.out',
        },
      })),
    },
  });
});

test('synth assumes no build step by default', () => {
  // WHEN
  new testutil.TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
  });

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
    Environment: {
      Image: 'aws/codebuild/standard:5.0',
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

test('complex setup with environment variables still renders correct project', () => {
  // WHEN
  new testutil.TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    environmentVariables: {
      SOME_ENV_VAR: 'SomeValue',
    },
    installCommands: [
      'install1',
      'install2',
    ],
    buildCommands: ['synth'],
    backend: new cdkp.CodePipelineBackend({
      buildEnvironment: {
        environmentVariables: {
          INNER_VAR: { value: 'InnerValue' },
        },
        privileged: true,
      },
    }),
  });

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
    Environment: objectLike({
      PrivilegedMode: true,
      EnvironmentVariables: arrayWith(
        {
          Name: 'SOME_ENV_VAR',
          Type: 'PLAINTEXT',
          Value: 'SomeValue',
        },
        {
          Name: 'INNER_VAR',
          Type: 'PLAINTEXT',
          Value: 'InnerValue',
        },
      ),
    }),
    Source: {
      BuildSpec: encodedJson(deepObjectLike({
        phases: {
          install: {
            commands: ['install1', 'install2'],
          },
          build: {
            commands: ['synth'],
          },
        },
      })),
    },
  });
});

test('npm can have its install command overridden', () => {
  // WHEN
  new testutil.TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    installCommands: ['/bin/true'],
  });

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
    Environment: {
      Image: 'aws/codebuild/standard:5.0',
    },
    Source: {
      BuildSpec: encodedJson(deepObjectLike({
        phases: {
          install: {
            commands: ['/bin/true'],
          },
        },
      })),
    },
  });
});

test('Standard (NPM) synth can output additional artifacts', () => {
  // WHEN
  const buildStep = new cdkp.CdkBuild({
    input: cdkp.CodePipelineSource.gitHub('test/test'),
    additionalOutputs: {
      IntegTest: cdkp.AdditionalBuildOutput.fromDirectory('test'),
    },
  });
  new testutil.TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    buildStep,
  });

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
    Environment: {
      Image: 'aws/codebuild/standard:5.0',
    },
    Source: {
      BuildSpec: encodedJson(deepObjectLike({
        artifacts: {
          'secondary-artifacts': {
            Synth_CloudAssemblyArtifact: {
              'base-directory': 'cdk.out',
              'files': '**/*',
            },
            Synth_Build_IntegTest: {
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
  new testutil.TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    backend: new cdkp.CodePipelineBackend({
      vpc: new ec2.Vpc(pipelineStack, 'NpmSynthTestVpc'),
    }),
  });

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
    VpcConfig: {
      SecurityGroupIds: [
        {
          'Fn::GetAtt': [
            'CdkSynthCdkBuildProjectSecurityGroup7BE1BC3E',
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

test('Pipeline action contains a hash that changes as the buildspec changes', () => {
  const hash1 = synthWithAction(() => ({ buildCommands: ['asdf'] }));

  // To make sure the hash is not just random :)
  const hash1prime = synthWithAction(() => ({ buildCommands: ['asdf'] }));

  const hash2 = synthWithAction(() => ({
    installCommands: ['do install'],
  }));
  const hash3 = synthWithAction(() => ({
    buildCommands: ['asdf'],
    backend: new cdkp.CodePipelineBackend({
      buildEnvironment: {
        computeType: cbuild.ComputeType.LARGE,
      },
    }),
  }));

  const hash4 = synthWithAction(() => ({
    environmentVariables: {
      xyz: 'SOME-VALUE',
    },
  }));

  expect(hash1).toEqual(hash1prime);

  expect(hash1).not.toEqual(hash2);
  expect(hash1).not.toEqual(hash3);
  expect(hash1).not.toEqual(hash4);
  expect(hash2).not.toEqual(hash3);
  expect(hash2).not.toEqual(hash4);
  expect(hash3).not.toEqual(hash4);

  function synthWithAction(cb: () => testutil.TestGitHubNpmPipelineProps) {
    const _app = new testutil.TestApp({ outdir: OUTDIR });
    const _pipelineStack = new Stack(_app, 'PipelineStack', { env: testutil.PIPELINE_ENV });

    new testutil.TestGitHubNpmPipeline(_pipelineStack, 'Cdk', cb());

    const theHash = Capture.aString();
    expect(_pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
      Stages: arrayWith({
        Name: 'Synth',
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
  const backend = new cdkp.CodePipelineBackend();
  const pipe = new testutil.TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    backend,
  });
  const bucket = new s3.Bucket(pipelineStack, 'Bucket');
  pipe.renderToBackend();

  // WHEN
  bucket.grantRead(backend.buildProject);
  Array.isArray(bucket);

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
  new testutil.TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    backend: new cdkp.CodePipelineBackend({
      buildEnvironment: {
        buildImage: cbuild.LinuxBuildImage.fromEcrRepository(
          ecr.Repository.fromRepositoryName(pipelineStack, 'ECRImage', 'my-repo-name'),
        ),
      },
    }),
  });

  // THEN
  // FIXME: Assert on properties here
});