import * as path from 'path';
import { arrayWith, deepObjectLike, encodedJson, notMatching, objectLike, stringLike } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as cp from '@aws-cdk/aws-codepipeline';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr_assets from '@aws-cdk/aws-ecr-assets';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import { Stack, Stage, StageProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as cdkp from '../lib';
import { BucketStack, PIPELINE_ENV, TestApp, TestGitHubAction, TestGitHubNpmPipeline } from './testutil';

const FILE_ASSET_SOURCE_HASH = '8289faf53c7da377bb2b90615999171adef5e1d8f6b88810e5fef75e6ca09ba5';

let app: TestApp;
let pipelineStack: Stack;
let pipeline: cdkp.CdkPipeline;


describe('basic pipeline', () => {
  beforeEach(() => {
    app = new TestApp();
    pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
    pipeline = new TestGitHubNpmPipeline(pipelineStack, 'Cdk');
  });

  afterEach(() => {
    app.cleanup();
  });

  test('no assets stage if the application has no assets', () => {
    // WHEN
    pipeline.addApplicationStage(new PlainStackApp(app, 'App'));

    // THEN
    expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
      Stages: notMatching(arrayWith(objectLike({
        Name: 'Assets',
      }))),
    });
  });

  describe('asset stage placement', () => {
    test('assets stage comes before any user-defined stages', () => {
      // WHEN
      pipeline.addApplicationStage(new FileAssetApp(app, 'App'));

      // THEN
      expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
        Stages: [
          objectLike({ Name: 'Source' }),
          objectLike({ Name: 'Build' }),
          objectLike({ Name: 'UpdatePipeline' }),
          objectLike({ Name: 'Assets' }),
          objectLike({ Name: 'App' }),
        ],
      });
    });

    test('assets stage inserted after existing pipeline actions', () => {
      // WHEN
      const sourceArtifact = new cp.Artifact();
      const cloudAssemblyArtifact = new cp.Artifact();
      const existingCodePipeline = new cp.Pipeline(pipelineStack, 'CodePipeline', {
        stages: [
          {
            stageName: 'CustomSource',
            actions: [new TestGitHubAction(sourceArtifact)],
          },
          {
            stageName: 'CustomBuild',
            actions: [cdkp.SimpleSynthAction.standardNpmSynth({ sourceArtifact, cloudAssemblyArtifact })],
          },
        ],
      });
      pipeline = new cdkp.CdkPipeline(pipelineStack, 'CdkEmptyPipeline', {
        cloudAssemblyArtifact: cloudAssemblyArtifact,
        selfMutating: false,
        codePipeline: existingCodePipeline,
        // No source/build actions
      });
      pipeline.addApplicationStage(new FileAssetApp(app, 'App'));

      // THEN
      expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
        Stages: [
          objectLike({ Name: 'CustomSource' }),
          objectLike({ Name: 'CustomBuild' }),
          objectLike({ Name: 'Assets' }),
          objectLike({ Name: 'App' }),
        ],
      });
    });

    test('up to 50 assets fit in a single stage', () => {
      // WHEN
      pipeline.addApplicationStage(new MegaAssetsApp(app, 'App', { numAssets: 50 }));

      // THEN
      expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
        Stages: [
          objectLike({ Name: 'Source' }),
          objectLike({ Name: 'Build' }),
          objectLike({ Name: 'UpdatePipeline' }),
          objectLike({ Name: 'Assets' }),
          objectLike({ Name: 'App' }),
        ],
      });
    });

    test('51 assets triggers a second stage', () => {
      // WHEN
      pipeline.addApplicationStage(new MegaAssetsApp(app, 'App', { numAssets: 51 }));

      // THEN
      expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
        Stages: [
          objectLike({ Name: 'Source' }),
          objectLike({ Name: 'Build' }),
          objectLike({ Name: 'UpdatePipeline' }),
          objectLike({ Name: 'Assets' }),
          objectLike({ Name: 'Assets2' }),
          objectLike({ Name: 'App' }),
        ],
      });
    });

    test('101 assets triggers a third stage', () => {
      // WHEN
      pipeline.addApplicationStage(new MegaAssetsApp(app, 'App', { numAssets: 101 }));

      // THEN
      expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
        Stages: [
          objectLike({ Name: 'Source' }),
          objectLike({ Name: 'Build' }),
          objectLike({ Name: 'UpdatePipeline' }),
          objectLike({ Name: 'Assets' }),
          objectLike({ Name: 'Assets2' }),
          objectLike({ Name: 'Assets3' }),
          objectLike({ Name: 'App' }),
        ],
      });
    });
  });

  test('command line properly locates assets in subassembly', () => {
    // WHEN
    pipeline.addApplicationStage(new FileAssetApp(app, 'FileAssetApp'));

    // THEN
    expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
      Environment: {
        Image: 'aws/codebuild/standard:4.0',
      },
      Source: {
        BuildSpec: encodedJson(deepObjectLike({
          phases: {
            build: {
              commands: arrayWith(`cdk-assets --path "assembly-FileAssetApp/FileAssetAppStackEADD68C5.assets.json" --verbose publish "${FILE_ASSET_SOURCE_HASH}:current_account-current_region"`),
            },
          },
        })),
      },
    });
  });

  test('multiple assets are published in parallel', () => {
    // WHEN
    pipeline.addApplicationStage(new TwoFileAssetsApp(app, 'FileAssetApp'));

    // THEN
    expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
      Stages: arrayWith({
        Name: 'Assets',
        Actions: [
          objectLike({ RunOrder: 1 }),
          objectLike({ RunOrder: 1 }),
        ],
      }),
    });
  });

  test('assets are also published when using the lower-level addStackArtifactDeployment', () => {
    // GIVEN
    const asm = new FileAssetApp(app, 'FileAssetApp').synth();

    // WHEN
    pipeline.addStage('SomeStage').addStackArtifactDeployment(asm.getStackByName('FileAssetApp-Stack'));

    // THEN
    expect(pipelineStack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
      Stages: arrayWith({
        Name: 'Assets',
        Actions: [
          objectLike({
            Name: 'FileAsset1',
            RunOrder: 1,
          }),
        ],
      }),
    });
  });

  test('file image asset publishers do not use privilegedmode, have right AssumeRole', () => {
    // WHEN
    pipeline.addApplicationStage(new FileAssetApp(app, 'FileAssetApp'));

    // THEN
    expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
      Source: {
        BuildSpec: encodedJson(deepObjectLike({
          phases: {
            build: {
              commands: arrayWith(stringLike('cdk-assets *')),
            },
          },
        })),
      },
      Environment: objectLike({
        PrivilegedMode: false,
        Image: 'aws/codebuild/standard:4.0',
      }),
    });

    expect(pipelineStack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: arrayWith({
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Resource: 'arn:*:iam::*:role/*-file-publishing-role-*',
        }),
      },
    });
  });

  test('docker image asset publishers use privilegedmode, have right AssumeRole', () => {
    // WHEN
    pipeline.addApplicationStage(new DockerAssetApp(app, 'DockerAssetApp'));

    // THEN
    expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
      Source: {
        BuildSpec: encodedJson(deepObjectLike({
          phases: {
            build: {
              commands: arrayWith(stringLike('cdk-assets *')),
            },
          },
        })),
      },
      Environment: objectLike({
        Image: 'aws/codebuild/standard:4.0',
        PrivilegedMode: true,
      }),
    });
    expect(pipelineStack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: arrayWith({
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Resource: 'arn:*:iam::*:role/*-image-publishing-role-*',
        }),
      },
    });
  });

  test('can control fix/CLI version used in pipeline selfupdate', () => {
    // WHEN
    const stack2 = new Stack(app, 'Stack2', { env: PIPELINE_ENV });
    const pipeline2 = new TestGitHubNpmPipeline(stack2, 'Cdk2', {
      cdkCliVersion: '1.2.3',
    });
    pipeline2.addApplicationStage(new FileAssetApp(stack2, 'FileAssetApp'));

    // THEN
    expect(stack2).toHaveResourceLike('AWS::CodeBuild::Project', {
      Environment: {
        Image: 'aws/codebuild/standard:4.0',
      },
      Source: {
        BuildSpec: encodedJson(deepObjectLike({
          phases: {
            install: {
              commands: 'npm install -g cdk-assets@1.2.3',
            },
          },
        })),
      },
    });
  });

  describe('asset roles and policies', () => {
    test('includes file publishing assets role for apps with file assets', () => {
      pipeline.addApplicationStage(new FileAssetApp(app, 'App1'));

      expect(pipelineStack).toHaveResourceLike('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Statement: [{
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'codebuild.amazonaws.com',
              AWS: {
                'Fn::Join': ['', [
                  'arn:', { Ref: 'AWS::Partition' }, `:iam::${PIPELINE_ENV.account}:root`,
                ]],
              },
            },
          }],
        },
      });
      expect(pipelineStack).toHaveResourceLike('AWS::IAM::Policy',
        expectedAssetRolePolicy('arn:*:iam::*:role/*-file-publishing-role-*', 'CdkAssetsFileRole6BE17A07'));
    });

    test('includes image publishing assets role for apps with Docker assets', () => {
      pipeline.addApplicationStage(new DockerAssetApp(app, 'App1'));

      expect(pipelineStack).toHaveResourceLike('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Statement: [{
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'codebuild.amazonaws.com',
              AWS: {
                'Fn::Join': ['', [
                  'arn:', { Ref: 'AWS::Partition' }, `:iam::${PIPELINE_ENV.account}:root`,
                ]],
              },
            },
          }],
        },
      });
      expect(pipelineStack).toHaveResourceLike('AWS::IAM::Policy',
        expectedAssetRolePolicy('arn:*:iam::*:role/*-image-publishing-role-*', 'CdkAssetsDockerRole484B6DD3'));
    });

    test('includes both roles for apps with both file and Docker assets', () => {
      pipeline.addApplicationStage(new FileAssetApp(app, 'App1'));
      pipeline.addApplicationStage(new DockerAssetApp(app, 'App2'));

      expect(pipelineStack).toHaveResourceLike('AWS::IAM::Policy',
        expectedAssetRolePolicy('arn:*:iam::*:role/*-file-publishing-role-*', 'CdkAssetsFileRole6BE17A07'));
      expect(pipelineStack).toHaveResourceLike('AWS::IAM::Policy',
        expectedAssetRolePolicy('arn:*:iam::*:role/*-image-publishing-role-*', 'CdkAssetsDockerRole484B6DD3'));
    });
  });
});

describe('pipeline with VPC', () => {
  let vpc: ec2.Vpc;
  beforeEach(() => {
    app = new TestApp();
    pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
    vpc = new ec2.Vpc(pipelineStack, 'Vpc');
    pipeline = new TestGitHubNpmPipeline(pipelineStack, 'Cdk', {
      vpc,
    });
  });

  afterEach(() => {
    app.cleanup();
  });

  test('asset CodeBuild Project uses VPC subnets', () => {
    // WHEN
    pipeline.addApplicationStage(new DockerAssetApp(app, 'DockerAssetApp'));

    // THEN
    expect(pipelineStack).toHaveResourceLike('AWS::CodeBuild::Project', {
      VpcConfig: objectLike({
        SecurityGroupIds: [
          { 'Fn::GetAtt': ['CdkAssetsDockerAsset1SecurityGroup078F5C66', 'GroupId'] },
        ],
        Subnets: [
          { Ref: 'VpcPrivateSubnet1Subnet536B997A' },
          { Ref: 'VpcPrivateSubnet2Subnet3788AAA1' },
          { Ref: 'VpcPrivateSubnet3SubnetF258B56E' },
        ],
        VpcId: { Ref: 'Vpc8378EB38' },
      }),
    });
  });

  test('Pipeline-generated CodeBuild Projects have appropriate execution role permissions', () => {
    // WHEN
    pipeline.addApplicationStage(new DockerAssetApp(app, 'DockerAssetApp'));

    // THEN

    // Assets Project
    expect(pipelineStack).toHaveResourceLike('AWS::IAM::Policy', {
      Roles: [
        { Ref: 'CdkAssetsDockerRole484B6DD3' },
      ],
      PolicyDocument: {
        Statement: arrayWith({
          Action: arrayWith('ec2:DescribeSecurityGroups'),
          Effect: 'Allow',
          Resource: '*',
        }),
      },
    });
  });
});

class PlainStackApp extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    new BucketStack(this, 'Stack');
  }
}

class FileAssetApp extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    const stack = new Stack(this, 'Stack');
    new s3_assets.Asset(stack, 'Asset', {
      path: path.join(__dirname, 'test-file-asset.txt'),
    });
  }
}

class TwoFileAssetsApp extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    const stack = new Stack(this, 'Stack');
    new s3_assets.Asset(stack, 'Asset1', {
      path: path.join(__dirname, 'test-file-asset.txt'),
    });
    new s3_assets.Asset(stack, 'Asset2', {
      path: path.join(__dirname, 'test-file-asset-two.txt'),
    });
  }
}

class DockerAssetApp extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    const stack = new Stack(this, 'Stack');
    new ecr_assets.DockerImageAsset(stack, 'Asset', {
      directory: path.join(__dirname, 'test-docker-asset'),
    });
  }
}

interface MegaAssetsAppProps extends StageProps {
  readonly numAssets: number;
}

// Creates a mix of file and image assets, up to a specified count
class MegaAssetsApp extends Stage {
  constructor(scope: Construct, id: string, props: MegaAssetsAppProps) {
    super(scope, id, props);
    const stack = new Stack(this, 'Stack');

    let assetCount = 0;
    for (; assetCount < props.numAssets / 2; assetCount++) {
      new s3_assets.Asset(stack, `Asset${assetCount}`, {
        path: path.join(__dirname, 'test-file-asset.txt'),
        assetHash: `FileAsset${assetCount}`,
      });
    }
    for (; assetCount < props.numAssets; assetCount++) {
      new ecr_assets.DockerImageAsset(stack, `Asset${assetCount}`, {
        directory: path.join(__dirname, 'test-docker-asset'),
        extraHash: `FileAsset${assetCount}`,
      });
    }
  }
}

function expectedAssetRolePolicy(assumeRolePattern: string, attachedRole: string) {
  return {
    PolicyDocument: {
      Statement: [{
        Action: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
        Effect: 'Allow',
        Resource: {
          'Fn::Join': ['', [
            'arn:',
            { Ref: 'AWS::Partition' },
            `:logs:${PIPELINE_ENV.region}:${PIPELINE_ENV.account}:log-group:/aws/codebuild/*`,
          ]],
        },
      },
      {
        Action: ['codebuild:CreateReportGroup', 'codebuild:CreateReport', 'codebuild:UpdateReport', 'codebuild:BatchPutTestCases', 'codebuild:BatchPutCodeCoverages'],
        Effect: 'Allow',
        Resource: {
          'Fn::Join': ['', [
            'arn:',
            { Ref: 'AWS::Partition' },
            `:codebuild:${PIPELINE_ENV.region}:${PIPELINE_ENV.account}:report-group/*`,
          ]],
        },
      },
      {
        Action: ['codebuild:BatchGetBuilds', 'codebuild:StartBuild', 'codebuild:StopBuild'],
        Effect: 'Allow',
        Resource: '*',
      },
      {
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Resource: assumeRolePattern,
      },
      {
        Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
        Effect: 'Allow',
        Resource: [
          { 'Fn::GetAtt': ['CdkPipelineArtifactsBucket7B46C7BF', 'Arn'] },
          { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['CdkPipelineArtifactsBucket7B46C7BF', 'Arn'] }, '/*']] },
        ],
      },
      {
        Action: ['kms:Decrypt', 'kms:DescribeKey'],
        Effect: 'Allow',
        Resource: { 'Fn::GetAtt': ['CdkPipelineArtifactsBucketEncryptionKeyDDD3258C', 'Arn'] },
      }],
    },
    Roles: [{ Ref: attachedRole }],
  };
}
