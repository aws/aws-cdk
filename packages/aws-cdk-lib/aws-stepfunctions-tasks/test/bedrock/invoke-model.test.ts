import { Template, Match } from '../../../assertions';
import * as bedrock from '../../../aws-bedrock';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
import * as cxapi from '../../../cx-api';
import { Guardrail } from '../../lib/bedrock/guardrail';
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

  test('invoke model allows input and output as s3 Uri with feature flag set to true', () => {
    const app = new cdk.App({ context: { [cxapi.USE_NEW_S3URI_PARAMETERS_FOR_BEDROCK_INVOKE_MODEL_TASK]: true } });
    const stack = new cdk.Stack(app);
    const model = bedrock.ProvisionedModel.fromProvisionedModelArn(stack, 'Imported', 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123');

    const task = new BedrockInvokeModel(stack, 'Invoke', {
      model,
      input: { s3InputUri: sfn.JsonPath.stringAt('$.prompt') },
      output: { s3OutputUri: sfn.JsonPath.stringAt('$.prompt') },
    });

    new sfn.StateMachine(stack, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(task),
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
          //Expected key modified from S3Uri to S3Uri.$ as per the State Machine context key field transformation
          //Reference: https://docs.aws.amazon.com/step-functions/latest/dg/input-output-example.html
          'S3Uri.$': '$.prompt',
        },
        Output: {
          'S3Uri.$': '$.prompt',
        },
      },
    });
  });

  test('invoke model renderes input and output path correctly with feature flag set to true', () => {
    const app = new cdk.App({ context: { [cxapi.USE_NEW_S3URI_PARAMETERS_FOR_BEDROCK_INVOKE_MODEL_TASK]: true } });
    const stack = new cdk.Stack(app);
    const model = bedrock.ProvisionedModel.fromProvisionedModelArn(stack, 'Imported', 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123');

    const task = new BedrockInvokeModel(stack, 'Invoke', {
      model,
      input: { s3InputUri: sfn.JsonPath.stringAt('$.prompt') },
      output: { s3OutputUri: sfn.JsonPath.stringAt('$.prompt') },
      inputPath: sfn.JsonPath.stringAt('$.names'),
      outputPath: sfn.JsonPath.stringAt('$.names'),
    });

    new sfn.StateMachine(stack, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(task),
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
      InputPath: '$.names',
      OutputPath: '$.names',
      Parameters: {
        ModelId: 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123',
        Input: {
          //Expected key modified from S3Uri to S3Uri.$ as per the State Machine context key field transformation
          //Reference: https://docs.aws.amazon.com/step-functions/latest/dg/input-output-example.html
          'S3Uri.$': '$.prompt',
        },
        Output: {
          'S3Uri.$': '$.prompt',
        },
      },
    });
  });

  //Should not throw an error for input path and body if feature flag is set to true
  test('validation for input and body correctly with feature flag set to true', () => {
    const app = new cdk.App({ context: { [cxapi.USE_NEW_S3URI_PARAMETERS_FOR_BEDROCK_INVOKE_MODEL_TASK]: true } });
    const stack = new cdk.Stack(app);
    const model = bedrock.ProvisionedModel.fromProvisionedModelArn(stack, 'Imported', 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123');

    const task = new BedrockInvokeModel(stack, 'Invoke', {
      model,
      body: sfn.TaskInput.fromObject(
        {
          prompt: 'Hello world',
        },
      ),
      inputPath: sfn.JsonPath.stringAt('$.names'),
      outputPath: sfn.JsonPath.stringAt('$.names'),
    });

    new sfn.StateMachine(stack, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(task),
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
      InputPath: '$.names',
      OutputPath: '$.names',
      Parameters: {
        ModelId: 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123',
        Body: {
          prompt: 'Hello world',
        },
      },
    });
  });

  test('invoke model renders input and output JSON Path as s3 URI with feature flag set to false', () => {
    const app = new cdk.App({ context: { [cxapi.USE_NEW_S3URI_PARAMETERS_FOR_BEDROCK_INVOKE_MODEL_TASK]: false } });
    const stack = new cdk.Stack(app);
    const model = bedrock.ProvisionedModel.fromProvisionedModelArn(stack, 'Imported', 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123');

    const task = new BedrockInvokeModel(stack, 'Invoke', {
      model,
      inputPath: sfn.JsonPath.stringAt('$.prompt'),
      outputPath: sfn.JsonPath.stringAt('$.prompt'),
    });

    new sfn.StateMachine(stack, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(task),
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
      InputPath: '$.prompt',
      OutputPath: '$.prompt',
      Parameters: {
        ModelId: 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123',
        Input: {
          //Expected key modified from S3Uri to S3Uri.$ as per the State Machine context key field transformation
          //Reference: https://docs.aws.amazon.com/step-functions/latest/dg/input-output-example.html
          'S3Uri.$': '$.prompt',
        },
        Output: {
          'S3Uri.$': '$.prompt',
        },
      },
    });
  });

  test('throws error S3 input Uri is specified as an empty string', () => {
    const app = new cdk.App({ context: { [cxapi.USE_NEW_S3URI_PARAMETERS_FOR_BEDROCK_INVOKE_MODEL_TASK]: true } });
    const stack = new cdk.Stack(app);
    const model = bedrock.ProvisionedModel.fromProvisionedModelArn(stack, 'Imported', 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123');

    expect(() => {
      new BedrockInvokeModel(stack, 'Invoke', {
        model,
        input: {
          s3InputUri: '',
        },
        output: {
          s3OutputUri: '',
        },
      });
    }).toThrow('S3 Uri cannot be an empty string');
  });

  test('cannot specify both s3 uri and s3 bucket', () => {
    const app = new cdk.App({ context: { [cxapi.USE_NEW_S3URI_PARAMETERS_FOR_BEDROCK_INVOKE_MODEL_TASK]: true } });
    const stack = new cdk.Stack(app);
    const model = bedrock.ProvisionedModel.fromProvisionedModelArn(stack, 'Imported', 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123');

    expect(() => {
      new BedrockInvokeModel(stack, 'Invoke', {
        model,
        input: {
          s3Location: {
            bucketName: 'test-bucket',
            objectKey: 'input-key',
          },
          s3InputUri: sfn.JsonPath.stringAt('$.prompt'),
        },
        output: {
          s3Location: {
            bucketName: 'test-bucket',
            objectKey: 'output-key',
          },
          s3OutputUri: sfn.JsonPath.stringAt('$.prompt'),
        },
      });
    }).toThrow('Either specify S3 Uri or S3 location, but not both.');
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

  test('S3 permissions are created in generated policy when input/output s3uri is specified', () => {
    // GIVEN
    const app = new cdk.App({ context: { [cxapi.USE_NEW_S3URI_PARAMETERS_FOR_BEDROCK_INVOKE_MODEL_TASK]: true } });
    const stack = new cdk.Stack(app);
    const model = bedrock.ProvisionedModel.fromProvisionedModelArn(stack, 'Imported', 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123');

    // WHEN
    const task = new BedrockInvokeModel(stack, 'Invoke', {
      model,
      input: { s3InputUri: 's3://input-bucket/input-key' },
      output: { s3OutputUri: 's3://input-bucket/output-key' },
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
                  ':s3:::*',
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
                  ':s3:::*',
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

  test('guardrail when gurdarilIdentifier is set to arn', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = bedrock.ProvisionedModel.fromProvisionedModelArn(stack, 'Imported', 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123');

    // WHEN
    const task = new BedrockInvokeModel(stack, 'Invoke', {
      model,
      body: sfn.TaskInput.fromObject(
        {
          prompt: 'Hello world',
        },
      ),
      guardrail: Guardrail.enableDraft('arn:aws:bedrock:us-turbo-2:123456789012:guardrail/testid'),
    });

    new sfn.StateMachine(stack, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(task),
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
        Body: {
          prompt: 'Hello world',
        },
        GuardrailIdentifier: 'arn:aws:bedrock:us-turbo-2:123456789012:guardrail/testid',
        GuardrailVersion: 'DRAFT',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'bedrock:InvokeModel',
            Effect: 'Allow',
            Resource: 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123',
          },
          {
            Action: 'bedrock:ApplyGuardrail',
            Effect: 'Allow',
            Resource: 'arn:aws:bedrock:us-turbo-2:123456789012:guardrail/testid',
          },
        ],
      },
    });
  });

  test('guardrail when gurdarilIdentifier is set to id', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = bedrock.ProvisionedModel.fromProvisionedModelArn(stack, 'Imported', 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123');

    // WHEN
    const task = new BedrockInvokeModel(stack, 'Invoke', {
      model,
      body: sfn.TaskInput.fromObject(
        {
          prompt: 'Hello world',
        },
      ),
      guardrail: Guardrail.enable('testid', 3),
    });

    new sfn.StateMachine(stack, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(task),
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
        Body: {
          prompt: 'Hello world',
        },
        GuardrailIdentifier: 'testid',
        GuardrailVersion: '3',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'bedrock:InvokeModel',
            Effect: 'Allow',
            Resource: 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123',
          },
          {
            Action: 'bedrock:ApplyGuardrail',
            Effect: 'Allow',
            Resource: {
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
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':guardrail/testid',
                ],
              ],
            },
          },
        ],
      },
    });
  });

  test('guardrail fails when guardrailIdentifier is set to invalid id', () => {
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
        guardrail: Guardrail.enableDraft('invalid-id'),
      });
      // THEN
    }).toThrow('The id of Guardrail must contain only lowercase letters and numbers, got invalid-id');
  });

  test('guardrail fails when guardrailIdentifier is set to invalid ARN', () => {
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
        guardrail: Guardrail.enableDraft('arn:aws:bedrock:us-turbo-2:123456789012:guardrail'),
      });
      // THEN
    }).toThrow('Invalid ARN format. The ARN of Guradrail should have the format: `arn:<partition>:bedrock:<region>:<account-id>:guardrail/<guardrail-name>`, got arn:aws:bedrock:us-turbo-2:123456789012:guardrail.');
  });

  test('guardrail fails when guardrailIdentifier length is invalid', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = bedrock.ProvisionedModel.fromProvisionedModelArn(stack, 'Imported', 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123');
    const guardrailIdentifier = 'a'.repeat(2049);

    expect(() => {
      // WHEN
      new BedrockInvokeModel(stack, 'Invoke', {
        model,
        body: sfn.TaskInput.fromObject(
          {
            prompt: 'Hello world',
          },
        ),
        guardrail: Guardrail.enableDraft(guardrailIdentifier),
      });
      // THEN
    }).toThrow(`\`guardrailIdentifier\` length must be between 0 and 2048, got ${guardrailIdentifier.length}.`);
  });

  test('guardrail fails when invalid guardrailVersion is set', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = bedrock.ProvisionedModel.fromProvisionedModelArn(stack, 'Imported', 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123');

    expect(() => {
      // WHEN
      const task = new BedrockInvokeModel(stack, 'Invoke', {
        model,
        body: sfn.TaskInput.fromObject(
          {
            prompt: 'Hello world',
          },
        ),
        guardrail: Guardrail.enable('abcde', 0),
      });
      // THEN
    }).toThrow('\`version\` must be between 1 and 99999999, got 0.');
  });

  test('trace configuration', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = bedrock.ProvisionedModel.fromProvisionedModelArn(stack, 'Imported', 'arn:aws:bedrock:us-turbo-2:123456789012:provisioned-model/abc-123');

    // WHEN
    const task = new BedrockInvokeModel(stack, 'Invoke', {
      model,
      body: sfn.TaskInput.fromObject(
        {
          prompt: 'Hello world',
        },
      ),
      traceEnabled: true,
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
        Body: {
          prompt: 'Hello world',
        },
        Trace: 'ENABLED',
      },
    });
  });
});
