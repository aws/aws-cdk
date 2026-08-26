import { Template } from '../../../assertions';
import * as bedrock from '../../../aws-bedrock';
import * as ec2 from '../../../aws-ec2';
import * as iam from '../../../aws-iam';
import * as kms from '../../../aws-kms';
import * as s3 from '../../../aws-s3';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
import { BedrockCreateModelCustomizationJob, CustomizationType } from '../../lib/bedrock/create-model-customization-job';

describe('create model customization job', () => {
  test('default settings', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const outputDataBucket = new s3.Bucket(stack, 'OutputBucket');
    const trainingDataBucket = new s3.Bucket(stack, 'TrainingDataBucket');
    const validationDataBucket = new s3.Bucket(stack, 'ValidationDataBucket');

    // WHEN
    const task = new BedrockCreateModelCustomizationJob(stack, 'CreateModelCustomization', {
      baseModel: bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_INSTANT_V1),
      customModelName: 'custom-model',
      jobName: 'job-name',
      outputData: {
        bucket: outputDataBucket,
        path: 'output-data',
      },
      trainingData: {
        bucket: trainingDataBucket,
        path: 'training-data',
      },
      validationData: [
        {
          bucket: validationDataBucket,
          path: 'validation-data1',
        },
        {
          bucket: validationDataBucket,
          path: 'validation-data2',
        },
      ],
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
          S3Uri: {
            'Fn::Join': [
              '',
              [
                's3://',
                {
                  Ref: 'OutputBucket7114EB27',
                },
                '/output-data',
              ],
            ],
          },
        },
        RoleArn: {
          'Fn::GetAtt': [
            'CreateModelCustomizationBedrockRole28756B71',
            'Arn',
          ],
        },
        TrainingDataConfig: {
          S3Uri: {
            'Fn::Join': [
              '',
              [
                's3://',
                {
                  Ref: 'TrainingDataBucketC87619AE',
                },
                '/training-data',
              ],
            ],
          },
        },
        ValidationDataConfig: {
          Validators: [
            {
              S3Uri: {
                'Fn::Join': [
                  '',
                  [
                    's3://',
                    {
                      Ref: 'ValidationDataBucket54C7C688',
                    },
                    '/validation-data1',
                  ],
                ],
              },
            },
            {
              S3Uri: {
                'Fn::Join': [
                  '',
                  [
                    's3://',
                    {
                      Ref: 'ValidationDataBucket54C7C688',
                    },
                    '/validation-data2',
                  ],
                ],
              },
            },
          ],
        },
      },
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'bedrock.amazonaws.com',
            },
            Condition: {
              StringEquals: {
                'aws:SourceAccount': {
                  Ref: 'AWS::AccountId',
                },
              },
              ArnEquals: {
                'aws:SourceArn': {
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
                      ':model-customization-job/*',
                    ],
                  ],
                },
              },
            },
          },
        ],
        Version: '2012-10-17',
      },
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Action: ['s3:GetObject', 's3:ListBucket'],
                Effect: 'Allow',
                Resource: [
                  {
                    'Fn::GetAtt': ['TrainingDataBucketC87619AE', 'Arn'],
                  },
                  {
                    'Fn::Join': [
                      '',
                      [
                        {
                          'Fn::GetAtt': ['TrainingDataBucketC87619AE', 'Arn'],
                        },
                        '/*',
                      ],
                    ],
                  },
                  {
                    'Fn::GetAtt': ['ValidationDataBucket54C7C688', 'Arn'],
                  },
                  {
                    'Fn::Join': [
                      '',
                      [
                        {
                          'Fn::GetAtt': ['ValidationDataBucket54C7C688', 'Arn'],
                        },
                        '/*',
                      ],
                    ],
                  },
                ],
              },
              {
                Action: ['s3:GetObject', 's3:PutObject', 's3:ListBucket'],
                Effect: 'Allow',
                Resource: [
                  {
                    'Fn::GetAtt': ['OutputBucket7114EB27', 'Arn'],
                  },
                  {
                    'Fn::Join': [
                      '',
                      [
                        {
                          'Fn::GetAtt': ['OutputBucket7114EB27', 'Arn'],
                        },
                        '/*',
                      ],
                    ],
                  },
                ],
              },
            ],
            Version: '2012-10-17',
          },
          PolicyName: 'BedrockCreateModelCustomizationJob',
        },
      ],
    });
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'states.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'bedrock:CreateModelCustomizationJob',
              'bedrock:TagResource',
            ],
            Effect: 'Allow',
            Resource: [
              {
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
              {
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
                    ':custom-model/*',
                  ],
                ],
              },
              {
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
                    ':model-customization-job/*',
                  ],
                ],
              },
            ],
          },
          {
            Action: 'iam:PassRole',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'CreateModelCustomizationBedrockRole28756B71',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'StateMachineRoleDefaultPolicyDF1E6607',
      Roles: [
        {
          Ref: 'StateMachineRoleB840431D',
        },
      ],
    });
  });

  test('with full properties', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const kmsKey = new kms.Key(stack, 'KmsKey');
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const outputDataBucket = new s3.Bucket(stack, 'OutputBucket');
    const trainingDataBucket = new s3.Bucket(stack, 'TrainingDataBucket');
    const validationDataBucket = new s3.Bucket(stack, 'ValidationDataBucket');

    // WHEN
    const task = new BedrockCreateModelCustomizationJob(stack, 'CreateModelCustomization', {
      baseModel: bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_INSTANT_V1),
      clientRequestToken: 'token',
      customizationType: CustomizationType.FINE_TUNING,
      customModelKmsKey: kmsKey,
      customModelName: 'custom-model',
      customModelTags: [{ key: 'key1', value: 'value1' }],
      hyperParameters: { key: 'value' },
      jobName: 'job-name',
      jobTags: [{ key: 'key2', value: 'value2' }],
      outputData: {
        bucket: outputDataBucket,
        path: 'output-data',
      },
      trainingData: {
        bucket: trainingDataBucket,
        path: 'training-data',
      },
      validationData: [
        {
          bucket: validationDataBucket,
          path: 'validation-data1',
        },
        {
          bucket: validationDataBucket,
          path: 'validation-data2',
        },
      ],
      role: new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com'),
      }),
      vpcConfig: {
        securityGroups: [
          new ec2.SecurityGroup(stack, 'CreateModelCustomizationSecurityGroup', { vpc }),
        ],
        subnets: vpc.privateSubnets,
      },
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
        ClientRequestToken: 'token',
        CustomizationType: 'FINE_TUNING',
        CustomModelKmsKeyId: {
          'Fn::GetAtt': [
            'KmsKey46693ADD',
            'Arn',
          ],
        },
        CustomModelName: 'custom-model',
        CustomModelTags: [{ Key: 'key1', Value: 'value1' }],
        HyperParameters: { key: 'value' },
        JobName: 'job-name',
        JobTags: [{ Key: 'key2', Value: 'value2' }],
        OutputDataConfig: {
          S3Uri: {
            'Fn::Join': [
              '',
              [
                's3://',
                {
                  Ref: 'OutputBucket7114EB27',
                },
                '/output-data',
              ],
            ],
          },
        },
        RoleArn: {
          'Fn::GetAtt': [
            'Role1ABCC5F0',
            'Arn',
          ],
        },
        TrainingDataConfig: {
          S3Uri: {
            'Fn::Join': [
              '',
              [
                's3://',
                {
                  Ref: 'TrainingDataBucketC87619AE',
                },
                '/training-data',
              ],
            ],
          },
        },
        ValidationDataConfig: {
          Validators: [{
            S3Uri: {
              'Fn::Join': [
                '',
                [
                  's3://',
                  {
                    Ref: 'ValidationDataBucket54C7C688',
                  },
                  '/validation-data1',
                ],
              ],
            },
          }, {
            S3Uri: {
              'Fn::Join': [
                '',
                [
                  's3://',
                  {
                    Ref: 'ValidationDataBucket54C7C688',
                  },
                  '/validation-data2',
                ],
              ],
            },
          }],
        },
        VpcConfig: {
          SecurityGroupIds: [
            {
              'Fn::GetAtt': [
                'CreateModelCustomizationSecurityGroup5C9DFED6',
                'GroupId',
              ],
            },
          ],
          SubnetIds: [
            {
              Ref: 'VpcPrivateSubnet1Subnet536B997A',
            },
            {
              Ref: 'VpcPrivateSubnet2Subnet3788AAA1',
            },
          ],
        },
      },
    });
  });

  test('with Evaluate percentage hyperparameter', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const outputDataBucket = new s3.Bucket(stack, 'OutputBucket');
    const trainingDataBucket = new s3.Bucket(stack, 'TrainingDataBucket');

    // WHEN
    const task = new BedrockCreateModelCustomizationJob(stack, 'CreateModelCustomization', {
      baseModel: bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_INSTANT_V1),
      customizationType: CustomizationType.FINE_TUNING,
      customModelName: 'custom-model',
      hyperParameters: { 'Evaluation percentage': '10' },
      jobName: 'job-name',
      outputData: {
        bucket: outputDataBucket,
        path: 'output-data',
      },
      trainingData: {
        bucket: trainingDataBucket,
        path: 'training-data',
      },
      role: new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com'),
      }),
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
        CustomizationType: 'FINE_TUNING',
        JobName: 'job-name',
        OutputDataConfig: {
          S3Uri: {
            'Fn::Join': [
              '',
              [
                's3://',
                {
                  Ref: 'OutputBucket7114EB27',
                },
                '/output-data',
              ],
            ],
          },
        },
        RoleArn: {
          'Fn::GetAtt': [
            'Role1ABCC5F0',
            'Arn',
          ],
        },
        TrainingDataConfig: {
          S3Uri: {
            'Fn::Join': [
              '',
              [
                's3://',
                {
                  Ref: 'TrainingDataBucketC87619AE',
                },
                '/training-data',
              ],
            ],
          },
        },
        HyperParameters: { 'Evaluation percentage': '10' },
      },
    });
  });

  test('throe eerror for invalid validation data config', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const outputDataBucket = new s3.Bucket(stack, 'OutputBucket');
    const trainingDataBucket = new s3.Bucket(stack, 'TrainingDataBucket');

    // THEN
    expect(() => new BedrockCreateModelCustomizationJob(stack, 'CreateModelCustomization', {
      baseModel: bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_INSTANT_V1),
      customModelName: 'custom-model',
      jobName: 'job-name',
      outputData: {
        bucket: outputDataBucket,
        path: 'output-data',
      },
      trainingData: {
        bucket: trainingDataBucket,
        path: 'training-data',
      },
    })).toThrow('validationData or Evaluation percentage hyperparameter must be provided.');
  });

  test.each([
    0,
    257,
  ])('throw error for invalid client request token length %s', (tokenLength) => {
    // GIVEN
    const stack = new cdk.Stack();
    const outputDataBucket = new s3.Bucket(stack, 'OutputBucket');
    const trainingDataBucket = new s3.Bucket(stack, 'TrainingDataBucket');
    const validationDataBucket = new s3.Bucket(stack, 'ValidationDataBucket');

    // THEN
    expect(() => new BedrockCreateModelCustomizationJob(stack, 'CreateModelCustomization', {
      baseModel: bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_INSTANT_V1),
      clientRequestToken: 'a'.repeat(tokenLength),
      customModelName: 'custom-model',
      jobName: 'job-name',
      outputData: {
        bucket: outputDataBucket,
        path: 'output-data',
      },
      trainingData: {
        bucket: trainingDataBucket,
        path: 'training-data',
      },
      validationData: [
        {
          bucket: validationDataBucket,
          path: 'validation-data1',
        },
        {
          bucket: validationDataBucket,
          path: 'validation-data2',
        },
      ],
    })).toThrow(`clientRequestToken must be between 1 and 256 characters long, got: ${tokenLength}`);
  });

  test.each([
    '-a',
    'a--',
    '_',
  ])('throw error for invalid client request token format %s', (token) => {
    // GIVEN
    const stack = new cdk.Stack();
    const outputDataBucket = new s3.Bucket(stack, 'OutputBucket');
    const trainingDataBucket = new s3.Bucket(stack, 'TrainingDataBucket');
    const validationDataBucket = new s3.Bucket(stack, 'ValidationDataBucket');

    // THEN
    expect(() => new BedrockCreateModelCustomizationJob(stack, 'CreateModelCustomization', {
      baseModel: bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_INSTANT_V1),
      clientRequestToken: token,
      customModelName: 'custom-model',
      jobName: 'job-name',
      outputData: {
        bucket: outputDataBucket,
        path: 'output-data',
      },
      trainingData: {
        bucket: trainingDataBucket,
        path: 'training-data',
      },
      validationData: [
        {
          bucket: validationDataBucket,
          path: 'validation-data1',
        },
        {
          bucket: validationDataBucket,
          path: 'validation-data2',
        },
      ],
    })).toThrow('clientRequestToken must match the pattern /^[a-zA-Z0-9](-*[a-zA-Z0-9])*$/');
  });

  test.each([
    0,
    64,
  ])('throw error for invalid custom model name length %s', (nameLength) => {
    // GIVEN
    const stack = new cdk.Stack();
    const outputDataBucket = new s3.Bucket(stack, 'OutputBucket');
    const trainingDataBucket = new s3.Bucket(stack, 'TrainingDataBucket');
    const validationDataBucket = new s3.Bucket(stack, 'ValidationDataBucket');

    // THEN
    expect(() => new BedrockCreateModelCustomizationJob(stack, 'CreateModelCustomization', {
      baseModel: bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_INSTANT_V1),
      customModelName: 'a'.repeat(nameLength),
      jobName: 'job-name',
      outputData: {
        bucket: outputDataBucket,
        path: 'output-data',
      },
      trainingData: {
        bucket: trainingDataBucket,
        path: 'training-data',
      },
      validationData: [
        {
          bucket: validationDataBucket,
          path: 'validation-data1',
        },
        {
          bucket: validationDataBucket,
          path: 'validation-data2',
        },
      ],
    })).toThrow(`customModelName must be between 1 and 63 characters long, got: ${nameLength}`);
  });

  test.each([
    '-a',
    'a--',
    '_',
  ])('throw error for invalid custom model name format %s', (name) => {
    // GIVEN
    const stack = new cdk.Stack();
    const outputDataBucket = new s3.Bucket(stack, 'OutputBucket');
    const trainingDataBucket = new s3.Bucket(stack, 'TrainingDataBucket');
    const validationDataBucket = new s3.Bucket(stack, 'ValidationDataBucket');

    // THEN
    expect(() => new BedrockCreateModelCustomizationJob(stack, 'CreateModelCustomization', {
      baseModel: bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_INSTANT_V1),
      customModelName: name,
      jobName: 'job-name',
      outputData: {
        bucket: outputDataBucket,
        path: 'output-data',
      },
      trainingData: {
        bucket: trainingDataBucket,
        path: 'training-data',
      },
      validationData: [
        {
          bucket: validationDataBucket,
          path: 'validation-data1',
        },
        {
          bucket: validationDataBucket,
          path: 'validation-data2',
        },
      ],
    })).toThrow('customModelName must match the pattern /^([0-9a-zA-Z][_-]?)+$/');
  });

  test('throw error for invalid custom model tags length', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const outputDataBucket = new s3.Bucket(stack, 'OutputBucket');
    const trainingDataBucket = new s3.Bucket(stack, 'TrainingDataBucket');
    const validationDataBucket = new s3.Bucket(stack, 'ValidationDataBucket');

    // THEN
    expect(() => new BedrockCreateModelCustomizationJob(stack, 'CreateModelCustomization', {
      baseModel: bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_INSTANT_V1),
      customModelName: 'custom-model',
      customModelTags: Array(201).fill({ key: 'key', value: 'value' }),
      jobName: 'job-name',
      outputData: {
        bucket: outputDataBucket,
        path: 'output-data',
      },
      trainingData: {
        bucket: trainingDataBucket,
        path: 'training-data',
      },
      validationData: [
        {
          bucket: validationDataBucket,
          path: 'validation-data1',
        },
        {
          bucket: validationDataBucket,
          path: 'validation-data2',
        },
      ],
    })).toThrow('customModelTags must be between 0 and 200 items long, got: 201');
  });

  test.each([
    0,
    64,
  ])('throw error for invalid job name length %s', (nameLength) => {
    // GIVEN
    const stack = new cdk.Stack();
    const outputDataBucket = new s3.Bucket(stack, 'OutputBucket');
    const trainingDataBucket = new s3.Bucket(stack, 'TrainingDataBucket');
    const validationDataBucket = new s3.Bucket(stack, 'ValidationDataBucket');

    // THEN
    expect(() => new BedrockCreateModelCustomizationJob(stack, 'CreateModelCustomization', {
      baseModel: bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_INSTANT_V1),
      customModelName: 'custom-model',
      jobName: 'a'.repeat(nameLength),
      outputData: {
        bucket: outputDataBucket,
        path: 'output-data',
      },
      trainingData: {
        bucket: trainingDataBucket,
        path: 'training-data',
      },
      validationData: [
        {
          bucket: validationDataBucket,
          path: 'validation-data1',
        },
        {
          bucket: validationDataBucket,
          path: 'validation-data2',
        },
      ],
    })).toThrow(`jobName must be between 1 and 63 characters long, got: ${nameLength}`);
  });

  test.each([
    '-a',
    '_',
  ])('throw error for invalid job name format %s', (name) => {
    // GIVEN
    const stack = new cdk.Stack();
    const outputDataBucket = new s3.Bucket(stack, 'OutputBucket');
    const trainingDataBucket = new s3.Bucket(stack, 'TrainingDataBucket');
    const validationDataBucket = new s3.Bucket(stack, 'ValidationDataBucket');

    // THEN
    expect(() => new BedrockCreateModelCustomizationJob(stack, 'CreateModelCustomization', {
      baseModel: bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_INSTANT_V1),
      customModelName: 'custom-model',
      jobName: name,
      outputData: {
        bucket: outputDataBucket,
        path: 'output-data',
      },
      trainingData: {
        bucket: trainingDataBucket,
        path: 'training-data',
      },
      validationData: [
        {
          bucket: validationDataBucket,
          path: 'validation-data1',
        },
        {
          bucket: validationDataBucket,
          path: 'validation-data2',
        },
      ],
    })).toThrow('jobName must match the pattern /^[a-zA-Z0-9](-*[a-zA-Z0-9\\+\\-\\.])*$/');
  });

  test('throw error for invalid job tags length', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const outputDataBucket = new s3.Bucket(stack, 'OutputBucket');
    const trainingDataBucket = new s3.Bucket(stack, 'TrainingDataBucket');
    const validationDataBucket = new s3.Bucket(stack, 'ValidationDataBucket');

    // THEN
    expect(() => new BedrockCreateModelCustomizationJob(stack, 'CreateModelCustomization', {
      baseModel: bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_INSTANT_V1),
      customModelName: 'custom-model',
      jobName: 'job-name',
      jobTags: Array(201).fill({ key: 'key', value: 'value' }),
      outputData: {
        bucket: outputDataBucket,
        path: 'output-data',
      },
      trainingData: {
        bucket: trainingDataBucket,
        path: 'training-data',
      },
      validationData: [
        {
          bucket: validationDataBucket,
          path: 'validation-data1',
        },
        {
          bucket: validationDataBucket,
          path: 'validation-data2',
        },
      ],
    })).toThrow('jobTags must be between 0 and 200 items long, got: 201');
  });

  test('throw error for invalid validation data length', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const outputDataBucket = new s3.Bucket(stack, 'OutputBucket');
    const trainingDataBucket = new s3.Bucket(stack, 'TrainingDataBucket');
    const validationDataBucket = new s3.Bucket(stack, 'ValidationDataBucket');

    // THEN
    expect(() => new BedrockCreateModelCustomizationJob(stack, 'CreateModelCustomization', {
      baseModel: bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_INSTANT_V1),
      customModelName: 'custom-model',
      jobName: 'job-name',
      outputData: {
        bucket: outputDataBucket,
        path: 'output-data',
      },
      trainingData: {
        bucket: trainingDataBucket,
        path: 'training-data',
      },
      validationData: Array(11).map((_, index) => ({
        bucket: validationDataBucket,
        path: `validation-data${index}`,
      })),
    })).toThrow('validationData must be between 1 and 10 items long, got: 11');
  });

  test('throw error for invalid securityGroups length', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const outputDataBucket = new s3.Bucket(stack, 'OutputBucket');
    const trainingDataBucket = new s3.Bucket(stack, 'TrainingDataBucket');
    const validationDataBucket = new s3.Bucket(stack, 'ValidationDataBucket');

    // THEN
    expect(() => new BedrockCreateModelCustomizationJob(stack, 'Invoke', {
      baseModel: bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_INSTANT_V1),
      customModelName: 'custom-model',
      jobName: 'job-name',
      outputData: {
        bucket: outputDataBucket,
        path: 'output-data',
      },
      trainingData: {
        bucket: trainingDataBucket,
        path: 'training-data',
      },
      validationData: [
        {
          bucket: validationDataBucket,
          path: 'validation-data1',
        },
        {
          bucket: validationDataBucket,
          path: 'validation-data2',
        },
      ],
      vpcConfig: {
        securityGroups: Array(6).fill(new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc })),
        subnets: vpc.privateSubnets,
      },
    })).toThrow('securityGroups must be between 1 and 5 items long, got: 6');
  });

  test('throw error for invalid subnets length', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const outputDataBucket = new s3.Bucket(stack, 'OutputBucket');
    const trainingDataBucket = new s3.Bucket(stack, 'TrainingDataBucket');
    const validationDataBucket = new s3.Bucket(stack, 'ValidationDataBucket');

    // THEN
    expect(() => new BedrockCreateModelCustomizationJob(stack, 'Invoke', {
      baseModel: bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_INSTANT_V1),
      customModelName: 'custom-model',
      jobName: 'job-name',
      outputData: {
        bucket: outputDataBucket,
        path: 'output-data',
      },
      trainingData: {
        bucket: trainingDataBucket,
        path: 'training-data',
      },
      validationData: [
        {
          bucket: validationDataBucket,
          path: 'validation-data1',
        },
        {
          bucket: validationDataBucket,
          path: 'validation-data2',
        },
      ],
      vpcConfig: {
        securityGroups: [new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc })],
        subnets: Array(17).fill(vpc.privateSubnets[0]),
      },
    })).toThrow('subnets must be between 1 and 16 items long, got: 17');
  });

  test('throw error for using imported key as custom model KMS key', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const outputDataBucket = new s3.Bucket(stack, 'OutputBucket');
    const trainingDataBucket = new s3.Bucket(stack, 'TrainingDataBucket');
    const validationDataBucket = new s3.Bucket(stack, 'ValidationDataBucket');

    // THEN
    expect(() => new BedrockCreateModelCustomizationJob(stack, 'Invoke', {
      baseModel: bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_INSTANT_V1),
      customModelKmsKey: kms.Key.fromKeyArn(stack, 'Key', 'arn:aws:kms:us-east-1:123456789012:key/1234abcd-12ab-34cd-56ef-1234567890ab'),
      customModelName: 'custom-model',
      jobName: 'job-name',
      outputData: {
        bucket: outputDataBucket,
        path: 'output-data',
      },
      trainingData: {
        bucket: trainingDataBucket,
        path: 'training-data',
      },
      validationData: [
        {
          bucket: validationDataBucket,
          path: 'validation-data1',
        },
        {
          bucket: validationDataBucket,
          path: 'validation-data2',
        },
      ],
    })).toThrow('Imported KMS key is not used as the `customModelKmsKey`.');
  });
});
