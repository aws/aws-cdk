import { arrayWith, objectLike } from '@aws-cdk/assert-internal';
import '@aws-cdk/assert-internal/jest';
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

      expect(stack).toHaveResourceLike('AWS::CodeBuild::Project', {
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

      expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: arrayWith(objectLike({
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
          })),
        },
      });
    });
  });
});
