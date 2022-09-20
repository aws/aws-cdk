import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { Bucket } from '@aws-cdk/aws-s3';
import { App, Stack } from '@aws-cdk/core';
import { ElasticBeanstalkDeployAction, S3SourceAction, S3Trigger } from '../../lib';

describe('elastic beanstalk deploy action tests', () => {
  test('region and account are action region and account when set', () => {
    const stack = buildPipelineStack();
    // eslint-disable-next-line no-console
    console.log(stack);
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