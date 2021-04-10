import { arrayWith, expect, haveResourceLike, objectLike } from '@aws-cdk/assert-internal';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as codebuild from '../lib';

export = {
  'Linux GPU build image': {
    'AWS Deep Learning Container images': {
      'allows passing the account that the repository of the image is hosted in'(test: Test) {
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

        expect(stack).to(haveResourceLike('AWS::CodeBuild::Project', {
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
        }));

        expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
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
        }));

        test.done();
      },
    },
  },
};
