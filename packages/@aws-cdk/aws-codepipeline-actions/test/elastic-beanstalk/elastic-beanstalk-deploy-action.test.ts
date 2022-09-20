import { Template } from '@aws-cdk/assertions';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { Bucket } from '@aws-cdk/aws-s3';
import { App, Stack } from '@aws-cdk/core';
import { ElasticBeanstalkDeployAction, S3SourceAction, S3Trigger } from '../../lib';

describe('elastic beanstalk deploy action tests', () => {
  test('region and account are action region and account when set', () => {
    const stack = buildPipelineStack();
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: [
        {
          Actions: [
            {
              ActionTypeId: {
                Category: 'Source',
                Owner: 'AWS',
                Provider: 'S3',
                Version: '1',
              },
              Configuration: {
                S3Bucket: {
                  Ref: 'MyBucketF68F3FF0',
                },
                S3ObjectKey: 'some/path/to',
                PollForSourceChanges: true,
              },
              Name: 'Source',
              OutputArtifacts: [
                {
                  Name: 'Artifact_Source_Source',
                },
              ],
              RoleArn: {
                'Fn::GetAtt': [
                  'MyPipelineSourceCodePipelineActionRoleAA05D76F',
                  'Arn',
                ],
              },
              RunOrder: 1,
            },
          ],
          Name: 'Source',
        },
        {
          Actions: [
            {
              ActionTypeId: {
                Category: 'Deploy',
                Owner: 'AWS',
                Provider: 'ElasticBeanstalk',
                Version: '1',
              },
              Configuration: {
                ApplicationName: 'testApplication',
                EnvironmentName: 'env-testApplication',
              },
              InputArtifacts: [
                {
                  Name: 'Artifact_Source_Source',
                },
              ],
              Name: 'Deploy',
              RoleArn: {
                'Fn::GetAtt': [
                  'MyPipelineDeployCodePipelineActionRole742BD48A',
                  'Arn',
                ],
              },
              RunOrder: 1,
            },
          ],
          Name: 'Deploy',
        },
      ],
      ArtifactStore: {
        EncryptionKey: {
          Id: {
            'Fn::GetAtt': [
              'MyPipelineArtifactsBucketEncryptionKey8BF0A7F3',
              'Arn',
            ],
          },
          Type: 'KMS',
        },
        Location: {
          Ref: 'MyPipelineArtifactsBucket727923DD',
        },
        Type: 'S3',
      },
    });
  });
});

function buildPipelineStack(): Stack {
  const app = new App();
  const stack = new Stack(app);
  const sourceOutput = new codepipeline.Artifact();
  const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline');
  pipeline.addStage({
    stageName: 'Source',
    actions: [
      new S3SourceAction({
        actionName: 'Source',
        bucket: new Bucket(stack, 'MyBucket'),
        bucketKey: 'some/path/to',
        output: sourceOutput,
        trigger: S3Trigger.POLL,
      }),
    ],
  });

  pipeline.addStage({
    stageName: 'Deploy',
    actions: [
      new ElasticBeanstalkDeployAction({
        actionName: 'Deploy',
        applicationName: 'testApplication',
        environmentName: 'env-testApplication',
        input: sourceOutput,
      }),
    ],
  });

  return stack;
}