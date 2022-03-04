import { Match, Template } from '@aws-cdk/assertions';
import * as ecr from '@aws-cdk/aws-ecr';
import * as cdk from '@aws-cdk/core';
import * as codebuild from '../lib';

describe('Linux ARM build image', () => {
  describe('AMAZON_LINUX_2_STANDARD_1_0', () => {
    test('has type ARM_CONTAINER and default ComputeType LARGE', () => {
      const stack = new cdk.Stack();
      new codebuild.PipelineProject(stack, 'Project', {
        environment: {
          buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_1_0,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
        Environment: {
          Type: 'ARM_CONTAINER',
          ComputeType: 'BUILD_GENERAL1_LARGE',
        },
      });
    });

    test('can be used with ComputeType SMALL', () => {
      const stack = new cdk.Stack();
      new codebuild.PipelineProject(stack, 'Project', {
        environment: {
          computeType: codebuild.ComputeType.SMALL,
          buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_1_0,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
        Environment: {
          Type: 'ARM_CONTAINER',
          ComputeType: 'BUILD_GENERAL1_SMALL',
        },
      });
    });

    test('cannot be used in conjunction with ComputeType MEDIUM', () => {
      const stack = new cdk.Stack();

      expect(() => {
        new codebuild.PipelineProject(stack, 'Project', {
          environment: {
            buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_1_0,
            computeType: codebuild.ComputeType.MEDIUM,
          },
        });
      }).toThrow(/ARM images only support ComputeTypes 'BUILD_GENERAL1_SMALL' and 'BUILD_GENERAL1_LARGE' - 'BUILD_GENERAL1_MEDIUM' was given/);
    });

    test('can be used with ComputeType LARGE', () => {
      const stack = new cdk.Stack();
      new codebuild.PipelineProject(stack, 'Project', {
        environment: {
          computeType: codebuild.ComputeType.LARGE,
          buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_1_0,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
        Environment: {
          Type: 'ARM_CONTAINER',
          ComputeType: 'BUILD_GENERAL1_LARGE',
        },
      });
    });

    test('cannot be used in conjunction with ComputeType X2_LARGE', () => {
      const stack = new cdk.Stack();

      expect(() => {
        new codebuild.PipelineProject(stack, 'Project', {
          environment: {
            buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_1_0,
            computeType: codebuild.ComputeType.X2_LARGE,
          },
        });
      }).toThrow(/ARM images only support ComputeTypes 'BUILD_GENERAL1_SMALL' and 'BUILD_GENERAL1_LARGE' - 'BUILD_GENERAL1_2XLARGE' was given/);
    });
  });

  describe('AMAZON_LINUX_2_STANDARD_2_0', () => {
    test('has type ARM_CONTAINER and default ComputeType LARGE', () => {
      const stack = new cdk.Stack();
      new codebuild.PipelineProject(stack, 'Project', {
        environment: {
          buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_2_0,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
        Environment: {
          Type: 'ARM_CONTAINER',
          ComputeType: 'BUILD_GENERAL1_LARGE',
        },
      });
    });

    test('can be used with ComputeType SMALL', () => {
      const stack = new cdk.Stack();
      new codebuild.PipelineProject(stack, 'Project', {
        environment: {
          computeType: codebuild.ComputeType.SMALL,
          buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_2_0,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
        Environment: {
          Type: 'ARM_CONTAINER',
          ComputeType: 'BUILD_GENERAL1_SMALL',
        },
      });
    });

    test('cannot be used in conjunction with ComputeType MEDIUM', () => {
      const stack = new cdk.Stack();

      expect(() => {
        new codebuild.PipelineProject(stack, 'Project', {
          environment: {
            buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_2_0,
            computeType: codebuild.ComputeType.MEDIUM,
          },
        });
      }).toThrow(/ARM images only support ComputeTypes 'BUILD_GENERAL1_SMALL' and 'BUILD_GENERAL1_LARGE' - 'BUILD_GENERAL1_MEDIUM' was given/);
    });

    test('can be used with ComputeType LARGE', () => {
      const stack = new cdk.Stack();
      new codebuild.PipelineProject(stack, 'Project', {
        environment: {
          computeType: codebuild.ComputeType.LARGE,
          buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_2_0,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
        Environment: {
          Type: 'ARM_CONTAINER',
          ComputeType: 'BUILD_GENERAL1_LARGE',
        },
      });
    });

    test('cannot be used in conjunction with ComputeType X2_LARGE', () => {
      const stack = new cdk.Stack();

      expect(() => {
        new codebuild.PipelineProject(stack, 'Project', {
          environment: {
            buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_2_0,
            computeType: codebuild.ComputeType.X2_LARGE,
          },
        });
      }).toThrow(/ARM images only support ComputeTypes 'BUILD_GENERAL1_SMALL' and 'BUILD_GENERAL1_LARGE' - 'BUILD_GENERAL1_2XLARGE' was given/);
    });
  });

  describe('ECR Repository', () => {
    test('allows creating a build image from a new ECR repository', () => {
      const stack = new cdk.Stack();

      const repository = new ecr.Repository(stack, 'my-repo');

      new codebuild.Project(stack, 'Project', {
        buildSpec: codebuild.BuildSpec.fromObject({
          version: '0.2',
          phases: {
            build: { commands: ['ls'] },
          },
        }),
        environment: {
          buildImage: codebuild.LinuxArmBuildImage.fromEcrRepository(repository, 'v1'),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
        Environment: {
          ComputeType: 'BUILD_GENERAL1_LARGE',
          Image: {
            'Fn::Join': ['', [
              {
                'Fn::Select': [4, {
                  'Fn::Split': [':', {
                    'Fn::GetAtt': ['myrepo5DFA62E5', 'Arn'],
                  }],
                }],
              },
              '.dkr.ecr.',
              {
                'Fn::Select': [3, {
                  'Fn::Split': [':', {
                    'Fn::GetAtt': ['myrepo5DFA62E5', 'Arn'],
                  }],
                }],
              },
              '.',
              { Ref: 'AWS::URLSuffix' },
              '/',
              { Ref: 'myrepo5DFA62E5' },
              ':v1',
            ]],
          },
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([Match.objectLike({
            Action: [
              'ecr:BatchCheckLayerAvailability',
              'ecr:GetDownloadUrlForLayer',
              'ecr:BatchGetImage',
            ],
            Resource: {
              'Fn::GetAtt': ['myrepo5DFA62E5', 'Arn'],
            },
          })]),
        },
      });
    });

    test('allows creating a build image from an existing ECR repository', () => {
      const stack = new cdk.Stack();

      const repository = ecr.Repository.fromRepositoryName(stack, 'my-imported-repo', 'test-repo');

      new codebuild.Project(stack, 'Project', {
        buildSpec: codebuild.BuildSpec.fromObject({
          version: '0.2',
          phases: {
            build: { commands: ['ls'] },
          },
        }),
        environment: {
          buildImage: codebuild.LinuxArmBuildImage.fromEcrRepository(repository),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
        Environment: {
          ComputeType: 'BUILD_GENERAL1_LARGE',
          Image: {
            'Fn::Join': ['', [
              { Ref: 'AWS::AccountId' },
              '.dkr.ecr.',
              { Ref: 'AWS::Region' },
              '.',
              { Ref: 'AWS::URLSuffix' },
              '/test-repo:latest',
            ]],
          },
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([Match.objectLike({
            Action: [
              'ecr:BatchCheckLayerAvailability',
              'ecr:GetDownloadUrlForLayer',
              'ecr:BatchGetImage',
            ],
            Resource: {
              'Fn::Join': ['', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':ecr:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':repository/test-repo',
              ]],
            },
          })]),
        },
      });
    });

    test('allows creating a build image from an existing cross-account ECR repository', () => {
      const stack = new cdk.Stack();

      const repository = ecr.Repository.fromRepositoryArn(stack, 'my-cross-acount-repo', 'arn:aws:ecr:us-east-1:585695036304:repository/foo/bar/foo/fooo');

      new codebuild.Project(stack, 'Project', {
        buildSpec: codebuild.BuildSpec.fromObject({
          version: '0.2',
          phases: {
            build: { commands: ['ls'] },
          },
        }),
        environment: {
          buildImage: codebuild.LinuxArmBuildImage.fromEcrRepository(repository),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
        Environment: {
          ComputeType: 'BUILD_GENERAL1_LARGE',
          Image: {
            'Fn::Join': ['', [
              '585695036304.dkr.ecr.us-east-1.',
              { Ref: 'AWS::URLSuffix' },
              '/foo/bar/foo/fooo:latest',
            ]],
          },
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([Match.objectLike({
            Action: [
              'ecr:BatchCheckLayerAvailability',
              'ecr:GetDownloadUrlForLayer',
              'ecr:BatchGetImage',
            ],
            Resource: 'arn:aws:ecr:us-east-1:585695036304:repository/foo/bar/foo/fooo',
          })]),
        },
      });
    });
  });
});
