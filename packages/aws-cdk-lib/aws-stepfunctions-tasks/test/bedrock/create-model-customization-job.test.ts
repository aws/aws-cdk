import { Template, Match } from '../../../assertions';
import * as bedrock from '../../../aws-bedrock';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
import { BedrockCreateModelCustomizationJob } from '../../lib/bedrock/create-model-customization-job';

describe('create model customization job', () => {

  test('default settings', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const task = new BedrockCreateModelCustomizationJob(stack, 'Invoke', {
      baseModel: bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_INSTANT_V1),
      customModelName: 'custom-model',
      jobName: 'job-name',
      outputDataS3Uri: 's3://output-data',
      trainingDataS3Uri: 's3://training-data',
      validationDataS3Uri: ['s3://validation-data'],
    });

    new sfn.StateMachine(stack, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(
        sfn.Chain
          .start(new sfn.Pass(stack, 'Start'))
          .next(task)
          .next(new sfn.Pass(stack, 'Done')),
      ),
      timeout: cdk.Duration.seconds(30),
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
      Type: 'Task',
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::bedrock:createModelCustomizationJob',
          ],
        ],
      },
      Next: 'Done',
      Parameters: {
        BaseModelIdentifier: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':bedrock:',
              {
                Ref: 'AWS::Region',
              },
              '::foundation-model/anthropic.claude-instant-v1',
            ],
          ],
        },
        CustomModelName: 'custom-model',
        JobName: 'job-name',
        OutputDataConfig: {
          S3Uri: 's3://output-data',
        },
        RoleArn: {
          'Fn::GetAtt': [
            'InvokeBedrockRole4E197628',
            'Arn',
          ],
        },
        TrainingDataConfig: {
          S3Uri: 's3://training-data',
        },
        ValidationDataConfig: {
          Validators: [{ S3Uri: 's3://validation-data' }],
        },
      },
    });
  });
});
