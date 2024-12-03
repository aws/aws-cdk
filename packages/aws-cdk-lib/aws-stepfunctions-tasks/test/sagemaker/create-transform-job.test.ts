import { Template } from '../../../assertions';
import * as ec2 from '../../../aws-ec2';
import * as iam from '../../../aws-iam';
import * as kms from '../../../aws-kms';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
import * as tasks from '../../lib';
import { SageMakerCreateTransformJob } from '../../lib/sagemaker/create-transform-job';

let stack: cdk.Stack;
let role: iam.Role;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
  role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
    managedPolicies: [
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess'),
    ],
  });
});

test('create basic transform job', () => {
  // WHEN
  const task = new SageMakerCreateTransformJob(stack, 'TransformTask', {
    transformJobName: 'MyTransformJob',
    modelName: 'MyModelName',
    transformInput: {
      transformDataSource: {
        s3DataSource: {
          s3Uri: 's3://inputbucket/prefix',
        },
      },
    },
    transformOutput: {
      s3OutputPath: 's3://outputbucket/prefix',
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
          ':states:::sagemaker:createTransformJob',
        ],
      ],
    },
    End: true,
    Parameters: {
      TransformJobName: 'MyTransformJob',
      ModelName: 'MyModelName',
      TransformInput: {
        DataSource: {
          S3DataSource: {
            S3Uri: 's3://inputbucket/prefix',
            S3DataType: 'S3Prefix',
          },
        },
      },
      TransformOutput: {
        S3OutputPath: 's3://outputbucket/prefix',
      },
      TransformResources: {
        InstanceCount: 1,
        InstanceType: 'ml.m4.xlarge',
      },
    },
  });
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new SageMakerCreateTransformJob(stack, 'TransformTask', {
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      transformJobName: 'MyTransformJob',
      modelName: 'MyModelName',
      transformInput: {
        transformDataSource: {
          s3DataSource: {
            s3Uri: 's3://inputbucket/prefix',
          },
        },
      },
      transformOutput: {
        s3OutputPath: 's3://outputbucket/prefix',
      },
    });
  }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE,RUN_JOB. Received: WAIT_FOR_TASK_TOKEN/);
});

test('create complex transform job', () => {
  // WHEN
  const kmsKey = new kms.Key(stack, 'Key');
  const task = new SageMakerCreateTransformJob(stack, 'TransformTask', {
    transformJobName: 'MyTransformJob',
    modelName: 'MyModelName',
    modelClientOptions: {
      invocationsMaxRetries: 1,
      invocationsTimeout: cdk.Duration.minutes(20),
    },
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    role,
    transformInput: {
      transformDataSource: {
        s3DataSource: {
          s3Uri: 's3://inputbucket/prefix',
          s3DataType: tasks.S3DataType.S3_PREFIX,
        },
      },
    },
    transformOutput: {
      s3OutputPath: 's3://outputbucket/prefix',
      encryptionKey: kmsKey,
    },
    transformResources: {
      instanceCount: 1,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.P3, ec2.InstanceSize.XLARGE2),
      volumeEncryptionKey: kmsKey,
    },
    tags: {
      Project: 'MyProject',
    },
    batchStrategy: tasks.BatchStrategy.MULTI_RECORD,
    environment: {
      SOMEVAR: 'myvalue',
    },
    maxConcurrentTransforms: 3,
    maxPayload: cdk.Size.mebibytes(100),
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
          ':states:::sagemaker:createTransformJob.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      TransformJobName: 'MyTransformJob',
      ModelName: 'MyModelName',
      ModelClientConfig: {
        InvocationsMaxRetries: 1,
        InvocationsTimeoutInSeconds: 1200,
      },
      TransformInput: {
        DataSource: {
          S3DataSource: {
            S3Uri: 's3://inputbucket/prefix',
            S3DataType: 'S3Prefix',
          },
        },
      },
      TransformOutput: {
        S3OutputPath: 's3://outputbucket/prefix',
        KmsKeyId: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
      },
      TransformResources: {
        InstanceCount: 1,
        InstanceType: 'ml.p3.2xlarge',
        VolumeKmsKeyId: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
      },
      Tags: [
        { Key: 'Project', Value: 'MyProject' },
      ],
      MaxConcurrentTransforms: 3,
      MaxPayloadInMB: 100,
      Environment: {
        SOMEVAR: 'myvalue',
      },
      BatchStrategy: 'MultiRecord',
    },
  });
});

test('pass param to transform job', () => {
  // WHEN
  const task = new SageMakerCreateTransformJob(stack, 'TransformTask', {
    transformJobName: sfn.JsonPath.stringAt('$.TransformJobName'),
    modelName: sfn.JsonPath.stringAt('$.ModelName'),
    role,
    transformInput: {
      transformDataSource: {
        s3DataSource: {
          s3Uri: 's3://inputbucket/prefix',
          s3DataType: tasks.S3DataType.S3_PREFIX,
        },
      },
    },
    transformOutput: {
      s3OutputPath: 's3://outputbucket/prefix',
    },
    transformResources: {
      instanceCount: 1,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.P3, ec2.InstanceSize.XLARGE2),
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
          ':states:::sagemaker:createTransformJob',
        ],
      ],
    },
    End: true,
    Parameters: {
      'TransformJobName.$': '$.TransformJobName',
      'ModelName.$': '$.ModelName',
      'TransformInput': {
        DataSource: {
          S3DataSource: {
            S3Uri: 's3://inputbucket/prefix',
            S3DataType: 'S3Prefix',
          },
        },
      },
      'TransformOutput': {
        S3OutputPath: 's3://outputbucket/prefix',
      },
      'TransformResources': {
        InstanceCount: 1,
        InstanceType: 'ml.p3.2xlarge',
      },
    },
  });
});

test('create transform job with instance type supplied as JsonPath', () => {
  // WHEN
  const task = new SageMakerCreateTransformJob(stack, 'TransformTask', {
    transformJobName: 'MyTransformJob',
    modelName: 'MyModelName',
    transformInput: {
      transformDataSource: {
        s3DataSource: {
          s3Uri: 's3://inputbucket/prefix',
        },
      },
    },
    transformOutput: {
      s3OutputPath: 's3://outputbucket/prefix',
    },
    transformResources: {
      instanceCount: 1,
      instanceType: new ec2.InstanceType(sfn.JsonPath.stringAt('$.InstanceType')),
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
          ':states:::sagemaker:createTransformJob',
        ],
      ],
    },
    End: true,
    Parameters: {
      TransformJobName: 'MyTransformJob',
      ModelName: 'MyModelName',
      TransformInput: {
        DataSource: {
          S3DataSource: {
            S3Uri: 's3://inputbucket/prefix',
            S3DataType: 'S3Prefix',
          },
        },
      },
      TransformOutput: {
        S3OutputPath: 's3://outputbucket/prefix',
      },
      TransformResources: {
        'InstanceCount': 1,
        'InstanceType.$': '$.InstanceType',
      },
    },
  });
});

test('required permissions are granted to service role if RUN_JOB is supplied as service integration pattern', () => {
  // WHEN
  const task = new SageMakerCreateTransformJob(stack, 'TransformTask', {
    transformJobName: 'MyTransformJob',
    modelName: 'MyModelName',
    transformInput: {
      transformDataSource: {
        s3DataSource: {
          s3Uri: 's3://inputbucket/prefix',
        },
      },
    },
    transformOutput: {
      s3OutputPath: 's3://outputbucket/prefix',
    },
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
  });

  new sfn.StateMachine(stack, 'MyStateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            'sagemaker:CreateTransformJob',
            'sagemaker:DescribeTransformJob',
            'sagemaker:StopTransformJob',
          ],
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':sagemaker:',
                {
                  Ref: 'AWS::Region',
                },
                ':',
                {
                  Ref: 'AWS::AccountId',
                },
                ':transform-job/*',
              ],
            ],
          },
        },
        {
          Action: 'sagemaker:ListTags',
          Effect: 'Allow',
          Resource: '*',
        },
        {
          Action: 'iam:PassRole',
          Condition: {
            StringEquals: {
              'iam:PassedToService': 'sagemaker.amazonaws.com',
            },
          },
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'TransformTaskSagemakerTransformRoleEB12FAC2',
              'Arn',
            ],
          },
        },
        {
          Action: [
            'events:PutTargets',
            'events:PutRule',
            'events:DescribeRule',
          ],
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':events:',
                {
                  Ref: 'AWS::Region',
                },
                ':',
                {
                  Ref: 'AWS::AccountId',
                },
                ':rule/StepFunctionsGetEventsForSageMakerTransformJobsRule',
              ],
            ],
          },
        },
        {
          Action: 'sagemaker:AddTags',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':sagemaker:',
                {
                  Ref: 'AWS::Region',
                },
                ':',
                {
                  Ref: 'AWS::AccountId',
                },
                ':transform-job/*',
              ],
            ],
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('required permissions are granted to service role if REQUEST_RESPONSE is supplied as service integration pattern', () => {
  // WHEN
  const task = new SageMakerCreateTransformJob(stack, 'TransformTask', {
    transformJobName: 'MyTransformJob',
    modelName: 'MyModelName',
    transformInput: {
      transformDataSource: {
        s3DataSource: {
          s3Uri: 's3://inputbucket/prefix',
        },
      },
    },
    transformOutput: {
      s3OutputPath: 's3://outputbucket/prefix',
    },
    integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
  });

  new sfn.StateMachine(stack, 'MyStateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            'sagemaker:CreateTransformJob',
            'sagemaker:DescribeTransformJob',
            'sagemaker:StopTransformJob',
          ],
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':sagemaker:',
                {
                  Ref: 'AWS::Region',
                },
                ':',
                {
                  Ref: 'AWS::AccountId',
                },
                ':transform-job/*',
              ],
            ],
          },
        },
        {
          Action: 'sagemaker:ListTags',
          Effect: 'Allow',
          Resource: '*',
        },
        {
          Action: 'iam:PassRole',
          Condition: {
            StringEquals: {
              'iam:PassedToService': 'sagemaker.amazonaws.com',
            },
          },
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'TransformTaskSagemakerTransformRoleEB12FAC2',
              'Arn',
            ],
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});
