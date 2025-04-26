import { Template, Match } from '../../../assertions';
import * as codebuild from '../../../aws-codebuild';
import * as codepipeline from '../../../aws-codepipeline';
import * as s3 from '../../../aws-s3';
import { App, Stack } from '../../../core';
import * as cpactions from '../../lib';

describe('pipeline invoke Action', () => {
  test('properly serializes the object passed in userParameters', () => {
    const stack = stackIncludingPipelineInvokeCodePipeline();

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', Match.objectLike({
      Stages: [{
      },
      {
        Actions: [{
        },
        {
          Configuration: {
            PipelineName: 'InvokePipelineAction',
            SourceRevisions: '[{"actionName":"Source","revisionType":"S3_OBJECT_VERSION_ID","revisionValue":"testRevisionValue"}]',
            Variables: '[{"name":"name1","value":"value1"}]',
          },
        }],
      }],
    }));
  });
});

function stackIncludingPipelineInvokeCodePipeline(app?: App) {
  const stack = new Stack(app);
  const targetPipeline = codepipeline.Pipeline.fromPipelineArn(stack, 'Pipeline',
    'arn:aws:codepipeline:us-east-1:123456789012:InvokePipelineAction');
  const sourceOutput = new codepipeline.Artifact();
  const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline');
  pipeline.addStage({
    stageName: 'Source',
    actions: [
      new cpactions.S3SourceAction({
        actionName: 'Source',
        bucket: new s3.Bucket(stack, 'MyBucket'),
        bucketKey: 'some/path/to',
        output: sourceOutput,
      }),
    ],
  });
  pipeline.addStage({
    stageName: 'Build',
    actions: [
      new cpactions.CodeBuildAction({
        actionName: 'Build',
        project: new codebuild.PipelineProject(stack, 'MyProject'),
        input: sourceOutput,
      }),
      new cpactions.PipelineInvokeAction({
        actionName: 'Invoke',
        targetPipeline,
        variables: [{
          name: 'name1',
          value: 'value1',
        }],
        sourceRevisions: [{
          actionName: 'Source',
          revisionType: cpactions.RevisionType.S3_OBJECT_VERSION_ID,
          revisionValue: 'testRevisionValue',
        }],
      }),
    ],
  });

  return stack;
}
