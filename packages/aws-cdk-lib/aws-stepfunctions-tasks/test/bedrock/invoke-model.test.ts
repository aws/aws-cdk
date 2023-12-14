import { Template, Match } from '../../../assertions';
import * as bedrock from '../../../aws-bedrock';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
import { BedrockInvokeModel } from '../../lib/bedrock/invoke-model';

describe('Invoke Model', () => {

  test('default settings', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'Stack1', { env: { account: '12345678', region: 'us-turbo-1' } });

    // WHEN
    const task = new BedrockInvokeModel(stack, 'Invoke', {
      model: bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_INSTANT_V1),
      body: sfn.TaskInput.fromObject(
        {
          prompt: 'Hello world',
        },
      ),
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
            ':states:::bedrock:invokeModel',
          ],
        ],
      },
      End: true,
      Parameters: {
        ModelId: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':bedrock:us-turbo-1::foundation-model/anthropic.claude-instant-v1',
            ],
          ],
        },
        Body: {
          prompt: 'Hello world',
        },
      },
    });
  });

  test('InvokeModel permissions are created in generated policy', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'Stack1', { env: { account: '12345678', region: 'us-turbo-1' } });

    // WHEN
    const task = new BedrockInvokeModel(stack, 'Invoke', {
      model: bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_INSTANT_V1),
      body: sfn.TaskInput.fromObject(
        {
          prompt: 'Hello world',
        },
      ),
    });

    new sfn.StateMachine(stack, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(task),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          {
            Action: 'bedrock:InvokeModel',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':bedrock:us-turbo-1::foundation-model/anthropic.claude-instant-v1',
                ],
              ],
            },
          },
        ]),
      }),
    });
  });

  test('MIME type configurations', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'Stack1', { env: { account: '12345678', region: 'us-turbo-1' } });

    // WHEN
    const task = new BedrockInvokeModel(stack, 'Invoke', {
      model: bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_INSTANT_V1),
      body: sfn.TaskInput.fromObject(
        {
          prompt: 'Hello world',
        },
      ),
      accept: 'image/png',
      contentType: 'text/plain',
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
            ':states:::bedrock:invokeModel',
          ],
        ],
      },
      End: true,
      Parameters: {
        ModelId: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':bedrock:us-turbo-1::foundation-model/anthropic.claude-instant-v1',
            ],
          ],
        },
        Body: {
          prompt: 'Hello world',
        },
        Accept: 'image/png',
        ContentType: 'text/plain',
      },
    });
  });

  test('input and output configurations', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'Stack1', { env: { account: '12345678', region: 'us-turbo-1' } });
    const model = bedrock.ProvisionedModel.fromProvisionedModelArn(stack, 'Imported', 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123');

    // WHEN
    const task = new BedrockInvokeModel(stack, 'Invoke', {
      model,
      input: {
        s3Location: {
          bucketName: 'input-bucket',
          objectKey: 'input-key',
        },
      },
      output: {
        s3Location: {
          bucketName: 'output-bucket',
          objectKey: 'output-key',
        },
      },
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
            ':states:::bedrock:invokeModel',
          ],
        ],
      },
      End: true,
      Parameters: {
        ModelId: 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123',
        Input: {
          S3Uri: 's3://input-bucket/input-key',
        },
        Output: {
          S3Uri: 's3://output-bucket/output-key',
        },
      },
    });
  });

  test('S3 permissions are created in generated policy when input and output locations are specified', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = bedrock.ProvisionedModel.fromProvisionedModelArn(stack, 'Imported', 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123');

    // WHEN
    const task = new BedrockInvokeModel(stack, 'Invoke', {
      model,
      input: {
        s3Location: {
          bucketName: 'input-bucket',
          objectKey: 'input-key',
        },
      },
      output: {
        s3Location: {
          bucketName: 'output-bucket',
          objectKey: 'output-key',
        },
      },
    });

    new sfn.StateMachine(stack, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(task),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          {
            Action: 'bedrock:InvokeModel',
            Effect: 'Allow',
            Resource: 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123',
          },
          {
            Action: 's3:GetObject',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':s3:::input-bucket/input-key',
                ],
              ],
            },
          },
          {
            Action: 's3:PutObject',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':s3:::output-bucket/output-key',
                ],
              ],
            },
          },
        ]),
      }),
    });
  });

  test('fails on neither input nor body set', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = bedrock.ProvisionedModel.fromProvisionedModelArn(stack, 'Imported', 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123');

    expect(() => {
      // WHEN
      new BedrockInvokeModel(stack, 'Invoke', {
        model,
      });
      // THEN
    }).toThrow(/Either `body` or `input` must be specified./);
  });

  test('fails on both input and body set', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = bedrock.ProvisionedModel.fromProvisionedModelArn(stack, 'Imported', 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123');

    expect(() => {
      // WHEN
      new BedrockInvokeModel(stack, 'Invoke', {
        model,
        body: sfn.TaskInput.fromObject(
          {
            prompt: 'Hello world',
          },
        ),
        input: {
          s3Location: {
            bucketName: 'hello',
            objectKey: 'world',
          },
        },
      });
      // THEN
    }).toThrow(/Either `body` or `input` must be specified, but not both./);
  });

  test('fails on S3 object version in input', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = bedrock.ProvisionedModel.fromProvisionedModelArn(stack, 'Imported', 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123');

    expect(() => {
      // WHEN
      new BedrockInvokeModel(stack, 'Invoke', {
        model,
        input: {
          s3Location: {
            bucketName: 'hello',
            objectKey: 'world',
            objectVersion: '123',
          },
        },
      });
      // THEN
    }).toThrow(/Input S3 object version is not supported./);
  });

  test('fails on S3 object version in output', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = bedrock.ProvisionedModel.fromProvisionedModelArn(stack, 'Imported', 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123');

    expect(() => {
      // WHEN
      new BedrockInvokeModel(stack, 'Invoke', {
        model,
        body: sfn.TaskInput.fromObject(
          {
            prompt: 'Hello world',
          },
        ),
        output: {
          s3Location: {
            bucketName: 'hello',
            objectKey: 'world',
            objectVersion: '123',
          },
        },
      });
      // THEN
    }).toThrow(/Output S3 object version is not supported./);
  });
});
