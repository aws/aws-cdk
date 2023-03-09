import * as fs from 'fs';
import * as path from 'path';
import { Capture, Match, Template } from '@aws-cdk/assertions';
import * as cb from '@aws-cdk/aws-codebuild';
import * as ec2 from '@aws-cdk/aws-ec2';
import { Stack, Stage } from '@aws-cdk/core';
import { CDKP_DEFAULT_CODEBUILD_IMAGE } from '../../lib/private/default-codebuild-image';
import { behavior, PIPELINE_ENV, TestApp, LegacyTestGitHubNpmPipeline, ModernTestGitHubNpmPipeline, FileAssetApp, MegaAssetsApp, TwoFileAssetsApp, DockerAssetApp, PlainStackApp, stringLike } from '../testhelpers';

const FILE_ASSET_SOURCE_HASH = '8289faf53c7da377bb2b90615999171adef5e1d8f6b88810e5fef75e6ca09ba5';
const FILE_ASSET_SOURCE_HASH2 = 'ac76997971c3f6ddf37120660003f1ced72b4fc58c498dfd99c78fa77e721e0e';

const FILE_PUBLISHING_ROLE = 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-hnb659fds-file-publishing-role-${AWS::AccountId}-${AWS::Region}';
const IMAGE_PUBLISHING_ROLE = 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-hnb659fds-image-publishing-role-${AWS::AccountId}-${AWS::Region}';

let app: TestApp;
let pipelineStack: Stack;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
});

afterEach(() => {
  app.cleanup();
});

describe('basic pipeline', () => {
  behavior('no assets stage if the application has no assets', (suite) => {
    suite.legacy(() => {
      const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
      pipeline.addApplicationStage(new PlainStackApp(app, 'App'));
      THEN_codePipelineExpectation();
    });

    suite.modern(() => {
      const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
      pipeline.addStage(new PlainStackApp(app, 'App'));

      THEN_codePipelineExpectation();
    });

    function THEN_codePipelineExpectation() {
      // THEN
      Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        Stages: Match.not(Match.arrayWith([Match.objectLike({
          Name: 'Assets',
        })])),
      });
    }
  });

  describe('asset stage placement', () => {
    behavior('assets stage comes before any user-defined stages', (suite) => {
      suite.legacy(() => {
        const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
        pipeline.addApplicationStage(new FileAssetApp(app, 'App'));

        THEN_codePipelineExpectation();
      });

      suite.modern(() => {
        const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
        pipeline.addStage(new FileAssetApp(app, 'App'));

        THEN_codePipelineExpectation();
      });

      function THEN_codePipelineExpectation() {
        Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
          Stages: [
            Match.objectLike({ Name: 'Source' }),
            Match.objectLike({ Name: 'Build' }),
            Match.objectLike({ Name: 'UpdatePipeline' }),
            Match.objectLike({ Name: 'Assets' }),
            Match.objectLike({ Name: 'App' }),
          ],
        });
      }
    });

    behavior('up to 50 assets fit in a single stage', (suite) => {
      suite.legacy(() => {
        // WHEN
        const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
        pipeline.addApplicationStage(new MegaAssetsApp(app, 'App', { numAssets: 50 }));

        THEN_codePipelineExpectation();
      });

      suite.modern(() => {
        const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
        pipeline.addStage(new MegaAssetsApp(app, 'App', { numAssets: 50 }));

        THEN_codePipelineExpectation();
      });

      function THEN_codePipelineExpectation() {
        Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
          Stages: [
            Match.objectLike({ Name: 'Source' }),
            Match.objectLike({ Name: 'Build' }),
            Match.objectLike({ Name: 'UpdatePipeline' }),
            Match.objectLike({ Name: 'Assets' }),
            Match.objectLike({ Name: 'App' }),
          ],
        });
      }
    });

    behavior('51 assets triggers a second stage', (suite) => {
      suite.legacy(() => {
        // WHEN
        const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
        pipeline.addApplicationStage(new MegaAssetsApp(app, 'App', { numAssets: 51 }));

        THEN_codePipelineExpectation();
      });

      suite.modern(() => {
        // WHEN
        const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
        pipeline.addStage(new MegaAssetsApp(app, 'App', { numAssets: 51 }));

        THEN_codePipelineExpectation();
      });

      function THEN_codePipelineExpectation() {
        Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
          Stages: [
            Match.objectLike({ Name: 'Source' }),
            Match.objectLike({ Name: 'Build' }),
            Match.objectLike({ Name: 'UpdatePipeline' }),
            Match.objectLike({ Name: stringLike('Assets*') }),
            Match.objectLike({ Name: stringLike('Assets*2') }),
            Match.objectLike({ Name: 'App' }),
          ],
        });
      }
    });

    behavior('101 assets triggers a third stage', (suite) => {
      suite.legacy(() => {
        const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
        pipeline.addApplicationStage(new MegaAssetsApp(app, 'App', { numAssets: 101 }));

        THEN_codePipelineExpectation();
      });

      suite.modern(() => {
        const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
        pipeline.addStage(new MegaAssetsApp(app, 'App', { numAssets: 101 }));

        THEN_codePipelineExpectation();
      });

      function THEN_codePipelineExpectation() {
        Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
          Stages: [
            Match.objectLike({ Name: 'Source' }),
            Match.objectLike({ Name: 'Build' }),
            Match.objectLike({ Name: 'UpdatePipeline' }),
            Match.objectLike({ Name: stringLike('Assets*') }), // 'Assets' vs 'Assets.1'
            Match.objectLike({ Name: stringLike('Assets*2') }),
            Match.objectLike({ Name: stringLike('Assets*3') }),
            Match.objectLike({ Name: 'App' }),
          ],
        });
      }
    });
  });

  behavior('command line properly locates assets in subassembly', (suite) => {
    suite.legacy(() => {
      const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
      pipeline.addApplicationStage(new FileAssetApp(app, 'FileAssetApp'));

      THEN_codePipelineExpectation();
    });

    suite.modern(() => {
      const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
      pipeline.addStage(new FileAssetApp(app, 'FileAssetApp'));

      THEN_codePipelineExpectation();
    });

    function THEN_codePipelineExpectation() {
      Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
        Environment: {
          Image: CDKP_DEFAULT_CODEBUILD_IMAGE.imageId,
        },
        Source: {
          BuildSpec: Match.serializedJson(Match.objectLike({
            phases: {
              build: {
                commands: Match.arrayWith([`cdk-assets --path "assembly-FileAssetApp/FileAssetAppStackEADD68C5.assets.json" --verbose publish "${FILE_ASSET_SOURCE_HASH}:current_account-current_region"`]),
              },
            },
          })),
        },
      });
    }
  });

  behavior('multiple assets are published in parallel', (suite) => {
    suite.legacy(() => {
      // WHEN
      const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
      pipeline.addApplicationStage(new TwoFileAssetsApp(app, 'FileAssetApp'));

      THEN_codePipelineExpectation();
    });

    suite.modern(() => {
      const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
      pipeline.addStage(new TwoFileAssetsApp(app, 'FileAssetApp'));

      THEN_codePipelineExpectation();
    });

    function THEN_codePipelineExpectation() {
      Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        Stages: Match.arrayWith([{
          Name: 'Assets',
          Actions: [
            Match.objectLike({ RunOrder: 1 }),
            Match.objectLike({ RunOrder: 1 }),
          ],
        }]),
      });
    }
  });

  behavior('assets are also published when using the lower-level addStackArtifactDeployment', (suite) => {
    suite.legacy(() => {
      // GIVEN
      const asm = new FileAssetApp(app, 'FileAssetApp').synth();

      // WHEN
      const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
      pipeline.addStage('SomeStage').addStackArtifactDeployment(asm.getStackByName('FileAssetApp-Stack'));

      // THEN
      Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        Stages: Match.arrayWith([{
          Name: 'Assets',
          Actions: [
            Match.objectLike({
              Name: 'FileAsset1',
              RunOrder: 1,
            }),
          ],
        }]),
      });
    });

    // This function does not exist in the modern API
    suite.doesNotApply.modern();
  });

  behavior('file image asset publishers do not use privilegedmode', (suite) => {
    suite.legacy(() => {
      // WHEN
      const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
      pipeline.addApplicationStage(new FileAssetApp(app, 'FileAssetApp'));

      THEN_codePipelineExpectation();
    });

    suite.modern(() => {
      // WHEN
      const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
      pipeline.addStage(new FileAssetApp(app, 'FileAssetApp'));

      THEN_codePipelineExpectation();
    });

    function THEN_codePipelineExpectation() {
      Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
        Source: {
          BuildSpec: Match.serializedJson(Match.objectLike({
            phases: {
              build: {
                commands: Match.arrayWith([stringLike('cdk-assets *')]),
              },
            },
          })),
        },
        Environment: Match.objectLike({
          PrivilegedMode: false,
          Image: CDKP_DEFAULT_CODEBUILD_IMAGE.imageId,
        }),
      });
    }
  });

  behavior('docker image asset publishers use privilegedmode', (suite) => {
    suite.legacy(() => {
      const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
      pipeline.addApplicationStage(new DockerAssetApp(app, 'DockerAssetApp'));

      THEN_codePipelineExpectation();
    });

    suite.modern(() => {
      const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
      pipeline.addStage(new DockerAssetApp(app, 'DockerAssetApp'));

      THEN_codePipelineExpectation();
    });

    function THEN_codePipelineExpectation() {
      Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
        Source: {
          BuildSpec: Match.serializedJson(Match.objectLike({
            phases: {
              build: {
                commands: Match.arrayWith([stringLike('cdk-assets *')]),
              },
            },
          })),
        },
        Environment: Match.objectLike({
          Image: CDKP_DEFAULT_CODEBUILD_IMAGE.imageId,
          PrivilegedMode: true,
        }),
      });
    }
  });

  behavior('can control fix/CLI version used in asset publishing', (suite) => {
    suite.legacy(() => {
      const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
        cdkCliVersion: '1.2.3',
      });
      pipeline.addApplicationStage(new FileAssetApp(pipelineStack, 'FileAssetApp'));

      THEN_codePipelineExpectation();
    });

    suite.modern(() => {
      const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
        cliVersion: '1.2.3',
      });
      pipeline.addStage(new FileAssetApp(pipelineStack, 'FileAssetApp'));

      THEN_codePipelineExpectation();
    });

    function THEN_codePipelineExpectation() {
      Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
        Environment: {
          Image: CDKP_DEFAULT_CODEBUILD_IMAGE.imageId,
        },
        Source: {
          BuildSpec: Match.serializedJson(Match.objectLike({
            phases: {
              install: {
                commands: ['npm install -g cdk-assets@1.2.3'],
              },
            },
          })),
        },
      });
    }
  });

  describe('asset roles and policies', () => {
    behavior('includes file publishing assets role for apps with file assets', (suite) => {
      suite.legacy(() => {
        const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
        pipeline.addApplicationStage(new FileAssetApp(app, 'App1'));

        THEN_codePipelineExpectation();
      });

      suite.modern(() => {
        const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
          // Expectation expects to see KMS key policy permissions
          crossAccountKeys: true,
        });
        pipeline.addStage(new FileAssetApp(app, 'App1'));

        THEN_codePipelineExpectation();
      });

      function THEN_codePipelineExpectation() {
        Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Role', {
          AssumeRolePolicyDocument: {
            Statement: [
              {
                Action: 'sts:AssumeRole',
                Effect: 'Allow',
                Principal: {
                  Service: 'codebuild.amazonaws.com',
                },
              },
              {
                Action: 'sts:AssumeRole',
                Effect: 'Allow',
                Principal: {
                  AWS: {
                    'Fn::Join': ['', [
                      'arn:', { Ref: 'AWS::Partition' }, `:iam::${PIPELINE_ENV.account}:root`,
                    ]],
                  },
                },
              },
            ],
          },
        });
        Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Policy',
          expectedAssetRolePolicy(FILE_PUBLISHING_ROLE, 'CdkAssetsFileRole6BE17A07'));
      }
    });

    behavior('publishing assets role may assume roles from multiple environments', (suite) => {
      suite.legacy(() => {
        const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
        pipeline.addApplicationStage(new FileAssetApp(app, 'App1'));
        pipeline.addApplicationStage(new FileAssetApp(app, 'App2', {
          env: {
            account: '0123456789012',
            region: 'eu-west-1',
          },
        }));

        THEN_codePipelineExpectation();
      });

      suite.modern(() => {
        const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
          // Expectation expects to see KMS key policy permissions
          crossAccountKeys: true,
        });

        pipeline.addStage(new FileAssetApp(app, 'App1'));
        pipeline.addStage(new FileAssetApp(app, 'App2', {
          env: {
            account: '0123456789012',
            region: 'eu-west-1',
          },
        }));

        THEN_codePipelineExpectation();
      });

      function THEN_codePipelineExpectation() {
        Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Policy',
          expectedAssetRolePolicy([FILE_PUBLISHING_ROLE, 'arn:${AWS::Partition}:iam::0123456789012:role/cdk-hnb659fds-file-publishing-role-0123456789012-eu-west-1'],
            'CdkAssetsFileRole6BE17A07'));
      }
    });

    behavior('publishing assets role de-dupes assumed roles', (suite) => {
      suite.legacy(() => {
        const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
        pipeline.addApplicationStage(new FileAssetApp(app, 'App1'));
        pipeline.addApplicationStage(new FileAssetApp(app, 'App2'));
        pipeline.addApplicationStage(new FileAssetApp(app, 'App3'));

        THEN_codePipelineExpectation();
      });

      suite.modern(() => {
        const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
          // Expectation expects to see KMS key policy permissions
          crossAccountKeys: true,
        });
        pipeline.addStage(new FileAssetApp(app, 'App1'));
        pipeline.addStage(new FileAssetApp(app, 'App2'));
        pipeline.addStage(new FileAssetApp(app, 'App3'));

        THEN_codePipelineExpectation();
      });

      function THEN_codePipelineExpectation() {
        Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Policy',
          expectedAssetRolePolicy(FILE_PUBLISHING_ROLE, 'CdkAssetsFileRole6BE17A07'));
      }
    });

    behavior('includes image publishing assets role for apps with Docker assets', (suite) => {
      suite.legacy(() => {
        const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
        pipeline.addApplicationStage(new DockerAssetApp(app, 'App1'));

        THEN_codePipelineExpectation();
      });

      suite.modern(() => {
        const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
          // Expectation expects to see KMS key policy permissions
          crossAccountKeys: true,
        });
        pipeline.addStage(new DockerAssetApp(app, 'App1'));

        THEN_codePipelineExpectation();
      });

      function THEN_codePipelineExpectation() {
        Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Role', {
          AssumeRolePolicyDocument: {
            Statement: [
              {
                Action: 'sts:AssumeRole',
                Effect: 'Allow',
                Principal: {
                  Service: 'codebuild.amazonaws.com',
                },
              },
              {
                Action: 'sts:AssumeRole',
                Effect: 'Allow',
                Principal: {
                  AWS: {
                    'Fn::Join': ['', [
                      'arn:', { Ref: 'AWS::Partition' }, `:iam::${PIPELINE_ENV.account}:root`,
                    ]],
                  },
                },
              },
            ],
          },
        });
        Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Policy',
          expectedAssetRolePolicy(IMAGE_PUBLISHING_ROLE, 'CdkAssetsDockerRole484B6DD3'));
      }
    });

    behavior('includes both roles for apps with both file and Docker assets', (suite) => {
      suite.legacy(() => {
        const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk');
        pipeline.addApplicationStage(new FileAssetApp(app, 'App1'));
        pipeline.addApplicationStage(new DockerAssetApp(app, 'App2'));

        THEN_codePipelineExpectation();
      });

      suite.modern(() => {
        const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
          // Expectation expects to see KMS key policy permissions
          crossAccountKeys: true,
        });
        pipeline.addStage(new FileAssetApp(app, 'App1'));
        pipeline.addStage(new DockerAssetApp(app, 'App2'));

        THEN_codePipelineExpectation();
      });

      function THEN_codePipelineExpectation() {
        Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Policy',
          expectedAssetRolePolicy(FILE_PUBLISHING_ROLE, 'CdkAssetsFileRole6BE17A07'));
        Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Policy',
          expectedAssetRolePolicy(IMAGE_PUBLISHING_ROLE, 'CdkAssetsDockerRole484B6DD3'));
      }
    });
  });
});

behavior('can supply pre-install scripts to asset upload', (suite) => {
  suite.legacy(() => {
    const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
      assetPreInstallCommands: [
        'npm config set registry https://registry.com',
      ],
    });
    pipeline.addApplicationStage(new FileAssetApp(app, 'FileAssetApp'));

    THEN_codePipelineExpectation();
  });

  suite.modern(() => {
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
      assetPublishingCodeBuildDefaults: {
        partialBuildSpec: cb.BuildSpec.fromObject({
          version: '0.2',
          phases: {
            install: {
              commands: [
                'npm config set registry https://registry.com',
              ],
            },
          },
        }),
      },
    });
    pipeline.addStage(new FileAssetApp(app, 'FileAssetApp'));

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
      Environment: {
        Image: CDKP_DEFAULT_CODEBUILD_IMAGE.imageId,
      },
      Source: {
        BuildSpec: Match.serializedJson(Match.objectLike({
          phases: {
            install: {
              commands: ['npm config set registry https://registry.com', 'npm install -g cdk-assets@1'],
            },
          },
        })),
      },
    });
  }
});

describe('pipeline with VPC', () => {
  let vpc: ec2.Vpc;
  beforeEach(() => {
    vpc = new ec2.Vpc(pipelineStack, 'Vpc');
  });

  behavior('asset CodeBuild Project uses VPC subnets', (suite) => {
    suite.legacy(() => {
      const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
        vpc,
      });
      pipeline.addApplicationStage(new DockerAssetApp(app, 'DockerAssetApp'));

      THEN_codePipelineExpectation();
    });

    suite.modern(() => {
      const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
        codeBuildDefaults: { vpc },
      });
      pipeline.addStage(new DockerAssetApp(app, 'DockerAssetApp'));

      THEN_codePipelineExpectation();
    });

    function THEN_codePipelineExpectation() {
      // THEN
      Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
        VpcConfig: Match.objectLike({
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
    }
  });

  behavior('Pipeline-generated CodeBuild Projects have appropriate execution role permissions', (suite) => {
    suite.legacy(() => {
      const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
        vpc,
      });
      pipeline.addApplicationStage(new DockerAssetApp(app, 'DockerAssetApp'));
      THEN_codePipelineExpectation();
    });

    suite.modern(() => {
      const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
        codeBuildDefaults: { vpc },
      });
      pipeline.addStage(new DockerAssetApp(app, 'DockerAssetApp'));
      THEN_codePipelineExpectation();
    });

    function THEN_codePipelineExpectation() {
      // Assets Project
      Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Policy', {
        Roles: [
          { Ref: 'CdkAssetsDockerRole484B6DD3' },
        ],
        PolicyDocument: {
          Statement: Match.arrayWith([{
            Action: Match.arrayWith(['ec2:DescribeSecurityGroups']),
            Effect: 'Allow',
            Resource: '*',
          }]),
        },
      });
    }
  });

  behavior('Asset publishing CodeBuild Projects have correct VPC permissions', (suite) => {
    suite.legacy(() => {
      const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
        vpc,
      });
      pipeline.addApplicationStage(new DockerAssetApp(app, 'DockerAssetApp'));

      THEN_codePipelineExpectation();
    });

    suite.modern(() => {
      const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
        codeBuildDefaults: { vpc },
      });
      pipeline.addStage(new DockerAssetApp(app, 'DockerAssetApp'));
      THEN_codePipelineExpectation();
    });

    function THEN_codePipelineExpectation() {
      // Assets Project
      Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            Match.objectLike({
              Resource: '*',
              Action: [
                'ec2:CreateNetworkInterface',
                'ec2:DescribeNetworkInterfaces',
                'ec2:DeleteNetworkInterface',
                'ec2:DescribeSubnets',
                'ec2:DescribeSecurityGroups',
                'ec2:DescribeDhcpOptions',
                'ec2:DescribeVpcs',
              ],
            }),
          ],
        },
        Roles: [{ Ref: 'CdkAssetsDockerRole484B6DD3' }],
      });
      Template.fromStack(pipelineStack).hasResource('AWS::CodeBuild::Project', {
        Properties: {
          ServiceRole: { 'Fn::GetAtt': ['CdkAssetsDockerRole484B6DD3', 'Arn'] },
        },
        DependsOn: [
          'CdkAssetsDockerAsset1PolicyDocument8DA96A22',
        ],
      });
    }
  });
});

describe('pipeline with single asset publisher', () => {
  behavior('multiple assets are using the same job in singlePublisherMode', (suite) => {
    suite.legacy(() => {
      const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
        singlePublisherPerType: true,
      });
      pipeline.addApplicationStage(new TwoFileAssetsApp(app, 'FileAssetApp'));

      THEN_codePipelineExpectation();
    });

    suite.modern(() => {
      const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
        publishAssetsInParallel: false,
      });
      pipeline.addStage(new TwoFileAssetsApp(app, 'FileAssetApp'));

      THEN_codePipelineExpectation();
    });

    function THEN_codePipelineExpectation() {
      // THEN
      const buildSpecName = new Capture(stringLike('buildspec-*.yaml'));
      Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        Stages: Match.arrayWith([{
          Name: 'Assets',
          Actions: [
            // Only one file asset action
            Match.objectLike({ RunOrder: 1, Name: 'FileAsset' }),
          ],
        }]),
      });
      Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
        Environment: {
          Image: CDKP_DEFAULT_CODEBUILD_IMAGE.imageId,
        },
        Source: {
          BuildSpec: buildSpecName,
        },
      });
      const assembly = synthesize(pipelineStack);

      const actualFileName = buildSpecName.asString();

      const buildSpec = JSON.parse(fs.readFileSync(path.join(assembly.directory, actualFileName), { encoding: 'utf-8' }));
      expect(buildSpec.phases.build.commands).toContain(`cdk-assets --path "assembly-FileAssetApp/FileAssetAppStackEADD68C5.assets.json" --verbose publish "${FILE_ASSET_SOURCE_HASH}:current_account-current_region"`);
      expect(buildSpec.phases.build.commands).toContain(`cdk-assets --path "assembly-FileAssetApp/FileAssetAppStackEADD68C5.assets.json" --verbose publish "${FILE_ASSET_SOURCE_HASH2}:current_account-current_region"`);
    }
  });

  behavior('other pipeline writes to separate assets build spec file', (suite) => {
    suite.legacy(() => {
      const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
        singlePublisherPerType: true,
      });
      pipeline.addApplicationStage(new TwoFileAssetsApp(app, 'FileAssetApp'));

      const pipelineStack2 = new Stack(app, 'PipelineStack2', { env: PIPELINE_ENV });
      const otherPipeline = new LegacyTestGitHubNpmPipeline(pipelineStack2, 'Cdk', {
        singlePublisherPerType: true,
      });
      otherPipeline.addApplicationStage(new TwoFileAssetsApp(app, 'OtherFileAssetApp'));

      THEN_codePipelineExpectation(pipelineStack2);
    });

    suite.modern(() => {
      const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
        publishAssetsInParallel: false,
      });
      pipeline.addStage(new TwoFileAssetsApp(app, 'FileAssetApp'));

      const pipelineStack2 = new Stack(app, 'PipelineStack2', { env: PIPELINE_ENV });
      const otherPipeline = new ModernTestGitHubNpmPipeline(pipelineStack2, 'Cdk', {
        publishAssetsInParallel: false,
      });
      otherPipeline.addStage(new TwoFileAssetsApp(app, 'OtherFileAssetApp'));

      THEN_codePipelineExpectation(pipelineStack2);
    });

    function THEN_codePipelineExpectation(pipelineStack2: Stack) {
      // THEN
      const buildSpecName1 = new Capture(stringLike('buildspec-*.yaml'));
      const buildSpecName2 = new Capture(stringLike('buildspec-*.yaml'));
      Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
        Source: {
          BuildSpec: buildSpecName1,
        },
      });
      Template.fromStack(pipelineStack2).hasResourceProperties('AWS::CodeBuild::Project', {
        Source: {
          BuildSpec: buildSpecName2,
        },
      });

      expect(buildSpecName1.asString()).not.toEqual(buildSpecName2.asString());
    }
  });
});


describe('pipeline with custom asset publisher BuildSpec', () => {

  behavior('custom buildspec is merged correctly', (suite) => {
    suite.legacy(() => {
      // WHEN
      const pipeline = new LegacyTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
        singlePublisherPerType: true,
        assetBuildSpec: cb.BuildSpec.fromObject({
          phases: {
            pre_install: {
              commands: 'preinstall',
            },
          },
          cache: {
            paths: 'node_modules',
          },
        }),
      });
      pipeline.addApplicationStage(new TwoFileAssetsApp(app, 'FileAssetApp'));

      THEN_codePipelineExpectation();
    });

    suite.modern(() => {
      // WHEN
      const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
        publishAssetsInParallel: false,
        assetPublishingCodeBuildDefaults: {
          partialBuildSpec: cb.BuildSpec.fromObject({
            phases: {
              pre_install: {
                commands: 'preinstall',
              },
            },
            cache: {
              paths: 'node_modules',
            },
          }),
        },
      });
      pipeline.addStage(new TwoFileAssetsApp(app, 'FileAssetApp'));

      THEN_codePipelineExpectation();
    });


    function THEN_codePipelineExpectation() {
      const buildSpecName = new Capture(stringLike('buildspec-*'));

      Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        Stages: Match.arrayWith([{
          Name: 'Assets',
          Actions: [
            // Only one file asset action
            Match.objectLike({ RunOrder: 1, Name: 'FileAsset' }),
          ],
        }]),
      });
      Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodeBuild::Project', {
        Environment: {
          Image: CDKP_DEFAULT_CODEBUILD_IMAGE.imageId,
        },
        Source: {
          BuildSpec: buildSpecName,
        },
      });
      const assembly = synthesize(pipelineStack);
      const buildSpec = JSON.parse(fs.readFileSync(path.join(assembly.directory, buildSpecName.asString())).toString());
      expect(buildSpec.phases.build.commands).toContain(`cdk-assets --path "assembly-FileAssetApp/FileAssetAppStackEADD68C5.assets.json" --verbose publish "${FILE_ASSET_SOURCE_HASH}:current_account-current_region"`);
      expect(buildSpec.phases.build.commands).toContain(`cdk-assets --path "assembly-FileAssetApp/FileAssetAppStackEADD68C5.assets.json" --verbose publish "${FILE_ASSET_SOURCE_HASH2}:current_account-current_region"`);
      expect(buildSpec.phases.pre_install.commands).toContain('preinstall');
      expect(buildSpec.cache.paths).toContain('node_modules');
    }
  });
});

function expectedAssetRolePolicy(assumeRolePattern: string | string[], attachedRole: string) {
  if (typeof assumeRolePattern === 'string') { assumeRolePattern = [assumeRolePattern]; }

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
        Resource: unsingleton(assumeRolePattern.map(arn => { return { 'Fn::Sub': arn }; })),
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


behavior('necessary secrets manager permissions get added to asset roles', suite => {
  // Not possible to configure this for legacy pipelines
  suite.doesNotApply.legacy();

  suite.modern(() => {
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Pipeline', {
      assetPublishingCodeBuildDefaults: {
        buildEnvironment: {
          environmentVariables: {
            FOOBAR: {
              value: 'FoobarSecret',
              type: cb.BuildEnvironmentVariableType.SECRETS_MANAGER,
            },
          },
        },
      },
    });
    pipeline.addStage(new FileAssetApp(pipelineStack, 'MyApp'));

    THEN_codePipelineExpectation();
  });

  function THEN_codePipelineExpectation() {
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([{
          Action: 'secretsmanager:GetSecretValue',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':secretsmanager:us-pipeline:123pipeline:secret:FoobarSecret-??????',
              ],
            ],
          },
        }]),
      },
      Roles: [
        { Ref: 'PipelineAssetsFileRole59943A77' },
      ],
    });
  }
});

behavior('adding environment variable to assets job adds SecretsManager permissions', suite => {
  // No way to manipulate buildEnvironment in legacy API
  suite.doesNotApply.legacy();

  suite.modern(() => {
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Pipeline', {
      assetPublishingCodeBuildDefaults: {
        buildEnvironment: {
          environmentVariables: {
            FOOBAR: {
              value: 'FoobarSecret',
              type: cb.BuildEnvironmentVariableType.SECRETS_MANAGER,
            },
          },
        },
      },
    });
    pipeline.addStage(new FileAssetApp(pipelineStack, 'MyApp'));

    Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'secretsmanager:GetSecretValue',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': ['', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':secretsmanager:us-pipeline:123pipeline:secret:FoobarSecret-??????',
              ]],
            },
          }),
        ]),
      },
    });
  });
});

function synthesize(stack: Stack) {
  const root = stack.node.root;
  if (!Stage.isStage(root)) {
    throw new Error('unexpected: all stacks must be part of a Stage');
  }

  return root.synth({ skipValidation: true });
}

function unsingleton<A>(xs: A[]): A | A[] {
  if (xs.length === 1) {
    return xs[0];
  }
  return xs;
}