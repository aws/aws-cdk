import { arrayWith, deepObjectLike, encodedJson } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as s3 from '@aws-cdk/aws-s3';
import { Stack } from '@aws-cdk/core';
import * as cdkp from '../lib';
import { PIPELINE_ENV, TestApp, TestGitHubNpmPipeline } from './testutil';

let app: TestApp;
let pipelineStack: Stack;
let sourceArtifact: codepipeline.Artifact;
let cloudAssemblyArtifact: codepipeline.Artifact;

beforeEach(() => {
  app = new TestApp({ outdir: 'testcdk.out' });
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
  sourceArtifact = new codepipeline.Artifact();
  cloudAssemblyArtifact = new codepipeline.Artifact('CloudAsm');
});

afterEach(() => {
  app.cleanup();
});

test('SimpleSynthAction takes arrays of commands', () => {
  // WHEN
  new TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    sourceArtifact,
    cloudAssemblyArtifact,
    synthAction: new cdkp.SimpleSynthAction({
      sourceArtifact,
      cloudAssemblyArtifact,
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
    sourceArtifact,
    cloudAssemblyArtifact,
    synthAction: npmYarnBuild(npmYarn)({ sourceArtifact, cloudAssemblyArtifact }),
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
    sourceArtifact,
    cloudAssemblyArtifact,
    synthAction: npmYarnBuild(npmYarn)({
      sourceArtifact,
      cloudAssemblyArtifact,
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
    sourceArtifact,
    cloudAssemblyArtifact,
    synthAction: npmYarnBuild(npmYarn)({ sourceArtifact, cloudAssemblyArtifact }),
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
    sourceArtifact,
    cloudAssemblyArtifact,
    synthAction: npmYarnBuild(npmYarn)({
      sourceArtifact,
      cloudAssemblyArtifact,
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
    sourceArtifact,
    cloudAssemblyArtifact,
    synthAction: cdkp.SimpleSynthAction.standardNpmSynth({
      sourceArtifact,
      cloudAssemblyArtifact,
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
            CloudAsm: {
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

test('SimpleSynthAction is IGrantable', () => {
  // GIVEN
  const synthAction = cdkp.SimpleSynthAction.standardNpmSynth({
    sourceArtifact,
    cloudAssemblyArtifact,
  });
  new TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    sourceArtifact,
    cloudAssemblyArtifact,
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

function npmYarnBuild(npmYarn: string) {
  if (npmYarn === 'npm') { return cdkp.SimpleSynthAction.standardNpmSynth; }
  if (npmYarn === 'yarn') { return cdkp.SimpleSynthAction.standardYarnSynth; }
  throw new Error(`Expecting npm|yarn: ${npmYarn}`);
}