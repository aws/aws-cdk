import { Match, Template } from '@aws-cdk/assertions';
import * as ecr from '@aws-cdk/aws-ecr';
import * as cdk from '@aws-cdk/core';
import * as codebuild from '../lib';

describe('Linux GPU build image', () => {
  describe('AWS Deep Learning Container images', () => {
    test('allows passing the account that the repository of the image is hosted in', () => {
      const stack = new cdk.Stack();

      new codebuild.Project(stack, 'Project', {
        buildSpec: codebuild.BuildSpec.fromObject({
          version: '0.2',
          phases: {
            build: { commands: ['ls'] },
          },
        }),
        environment: {
          buildImage: codebuild.LinuxGpuBuildImage.awsDeepLearningContainersImage(
            'my-repo', 'my-tag', '123456789012'),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
        Environment: {
          ComputeType: 'BUILD_GENERAL1_LARGE',
          Image: {
            'Fn::Join': ['', [
              '123456789012.dkr.ecr.',
              { Ref: 'AWS::Region' },
              '.',
              { Ref: 'AWS::URLSuffix' },
              '/my-repo:my-tag',
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
                ':123456789012:repository/my-repo',
              ]],
            },
          })]),
        },
      });
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
          buildImage: codebuild.LinuxGpuBuildImage.fromEcrRepository(repository, 'v1'),
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
              'Fn::Join': ['', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':ecr:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':repository/',
                { Ref: 'myrepo5DFA62E5' },
              ]],
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
          buildImage: codebuild.LinuxGpuBuildImage.fromEcrRepository(repository),
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
          buildImage: codebuild.LinuxGpuBuildImage.fromEcrRepository(repository),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
        Environment: {
          ComputeType: 'BUILD_GENERAL1_LARGE',
          Image: {
            'Fn::Join': ['', [
              '585695036304.dkr.ecr.',
              { Ref: 'AWS::Region' },
              '.',
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
            Resource: {
              'Fn::Join': ['', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':ecr:',
                { Ref: 'AWS::Region' },
                ':585695036304:repository/foo/bar/foo/fooo',
              ]],
            },
          })]),
        },
      });
    });
  });
});
