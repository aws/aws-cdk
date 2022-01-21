import { Template, Match } from '@aws-cdk/assertions';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { describeDeprecated } from '@aws-cdk/cdk-build-tools';
import { Stack } from '@aws-cdk/core';
import * as cpactions from '../../lib';

/* eslint-disable quote-props */

describeDeprecated('BitBucket source Action', () => {
  describe('BitBucket source Action', () => {
    test('produces the correct configuration when added to a pipeline', () => {
      const stack = new Stack();

      createBitBucketAndCodeBuildPipeline(stack, {
        codeBuildCloneOutput: false,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        'Stages': [
          {
            'Name': 'Source',
            'Actions': [
              {
                'Name': 'BitBucket',
                'ActionTypeId': {
                  'Owner': 'AWS',
                  'Provider': 'CodeStarSourceConnection',
                },
                'Configuration': {
                  'ConnectionArn': 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
                  'FullRepositoryId': 'aws/aws-cdk',
                  'BranchName': 'master',
                },
              },
            ],
          },
          {
            'Name': 'Build',
            'Actions': [
              {
                'Name': 'CodeBuild',
              },
            ],
          },
        ],
      });


    });
  });

  test('setting codeBuildCloneOutput=true adds permission to use the connection to the following CodeBuild Project', () => {
    const stack = new Stack();

    createBitBucketAndCodeBuildPipeline(stack, {
      codeBuildCloneOutput: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      'PolicyDocument': {
        'Statement': [
          {
            'Action': [
              'logs:CreateLogGroup',
              'logs:CreateLogStream',
              'logs:PutLogEvents',
            ],
          },
          {},
          {},
          {},
          {},
          {
            'Action': 'codestar-connections:UseConnection',
            'Effect': 'Allow',
            'Resource': 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
          },
        ],
      },
    });


  });
  test('grant s3 putObjectACL to the following CodeBuild Project', () => {
    const stack = new Stack();
    createBitBucketAndCodeBuildPipeline(stack, {
      codeBuildCloneOutput: true,
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      'PolicyDocument': {
        'Statement': Match.arrayWith([
          Match.objectLike({
            'Action': [
              's3:PutObjectAcl',
              's3:PutObjectVersionAcl',
            ],
            'Effect': 'Allow',
            'Resource': {
              'Fn::Join': [
                '',
                [
                  {
                    'Fn::GetAtt': [
                      'PipelineArtifactsBucket22248F97',
                      'Arn',
                    ],
                  },
                  '/*',
                ],
              ],
            },
          }),
        ]),
      },
    });

  });
  test('setting triggerOnPush=false reflects in the configuration', () => {
    const stack = new Stack();

    createBitBucketAndCodeBuildPipeline(stack, {
      triggerOnPush: false,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': [
        {
          'Name': 'Source',
          'Actions': [
            {
              'Name': 'BitBucket',
              'ActionTypeId': {
                'Owner': 'AWS',
                'Provider': 'CodeStarSourceConnection',
              },
              'Configuration': {
                'ConnectionArn': 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
                'FullRepositoryId': 'aws/aws-cdk',
                'BranchName': 'master',
                'DetectChanges': false,
              },
            },
          ],
        },
        {
          'Name': 'Build',
          'Actions': [
            {
              'Name': 'CodeBuild',
            },
          ],
        },
      ],
    });


  });
});

function createBitBucketAndCodeBuildPipeline(stack: Stack, props: Partial<cpactions.BitBucketSourceActionProps>): void {
  const sourceOutput = new codepipeline.Artifact();
  new codepipeline.Pipeline(stack, 'Pipeline', {
    stages: [
      {
        stageName: 'Source',
        actions: [
          new cpactions.BitBucketSourceAction({
            actionName: 'BitBucket',
            owner: 'aws',
            repo: 'aws-cdk',
            output: sourceOutput,
            connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
            ...props,
          }),
        ],
      },
      {
        stageName: 'Build',
        actions: [
          new cpactions.CodeBuildAction({
            actionName: 'CodeBuild',
            project: new codebuild.PipelineProject(stack, 'MyProject'),
            input: sourceOutput,
            outputs: [new codepipeline.Artifact()],
          }),
        ],
      },
    ],
  });
}
