import { ScheduleExpression, Schedule } from '@aws-cdk/aws-scheduler-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AccountRootPrincipal, ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnPipeline } from 'aws-cdk-lib/aws-sagemaker';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { SageMakerPipelineParameter, SageMakerStartPipelineExecution } from '../lib';

describe('schedule target', () => {
  let app: App;
  let stack: Stack;
  let pipeline: CfnPipeline;
  const expr = ScheduleExpression.at(new Date(Date.UTC(1969, 10, 20, 0, 0, 0)));
  const pipelineParameterList: SageMakerPipelineParameter[] = [{
    name: 'MyParameterName',
    value: 'MyParameterValue',
  }];
  const pipelineDefinition = {
    PipelineDefinitionBody: JSON.stringify({
      Version: '2020-12-01',
      Metadata: {},
      PipelineName: 'my-sagemaker-pipeline',
      Stages: [
        {
          Name: 'MyTrainingStage',
          Steps: [
            {
              Name: 'MyTrainingJob',
              Type: 'Training',
              Arguments: {
                AlgorithmSpecification: {
                  TrainingImage: '123456789012.dkr.ecr.us-west-2.amazonaws.com/my-training-image:latest',
                  TrainingInputMode: 'File',
                },
                OutputDataConfig: {
                  S3OutputPath: 's3://my-bucket/my-training-output',
                },
                ResourceConfig: {
                  InstanceCount: 1,
                  InstanceType: 'ml.m5.large',
                  VolumeSizeInGB: 10,
                },
                StoppingCondition: {
                  MaxRuntimeInSeconds: 3600,
                },
              },
            },
          ],
        },
      ],
    }),
  };

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
    const pipelineRole = new Role(stack, 'SageMakerPipelineRole', {
      assumedBy: new ServicePrincipal('sagemaker.amazonaws.com'),
    });
    pipelineRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess'));
    pipeline = new CfnPipeline(stack, 'MyPipeline', {
      pipelineName: 'my-sagemaker-pipeline',
      pipelineDefinition: pipelineDefinition,
      roleArn: pipelineRole.roleArn,
    });
  });

  test('creates IAM role and IAM policy for pipeline in the same account', () => {
    const pipelineTarget = new SageMakerStartPipelineExecution(pipeline, {
      pipelineParameterList,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: pipelineTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':sagemaker:us-east-1:123456789012:pipeline/my-sagemaker-pipeline',
              ],
            ],
          },
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget1441a743A31888', 'Arn'] },
          RetryPolicy: {},
          SageMakerPipelineParameters: {
            PipelineParameterList: [{
              Name: 'MyParameterName',
              Value: 'MyParameterValue',
            }],
          },
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sagemaker:StartPipelineExecution',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':sagemaker:us-east-1:123456789012:pipeline/my-sagemaker-pipeline',
                ],
              ],
            },
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget1441a743A31888' }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Condition: { StringEquals: { 'aws:SourceAccount': '123456789012' } },
            Principal: {
              Service: 'scheduler.amazonaws.com',
            },
            Action: 'sts:AssumeRole',
          },
        ],
      },
    });
  });

  test('creates IAM policy for provided IAM role', () => {
    const targetExecutionRole = new Role(stack, 'ProvidedTargetRole', {
      assumedBy: new AccountRootPrincipal(),
    });

    const pipelineTarget = new SageMakerStartPipelineExecution(pipeline, {
      role: targetExecutionRole,
      pipelineParameterList,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: pipelineTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':sagemaker:us-east-1:123456789012:pipeline/my-sagemaker-pipeline',
              ],
            ],
          },
          RoleArn: { 'Fn::GetAtt': ['ProvidedTargetRole8CFDD54A', 'Arn'] },
          RetryPolicy: {},
          SageMakerPipelineParameters: {
            PipelineParameterList: [{
              Name: 'MyParameterName',
              Value: 'MyParameterValue',
            }],
          },
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sagemaker:StartPipelineExecution',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':sagemaker:us-east-1:123456789012:pipeline/my-sagemaker-pipeline',
                ],
              ],
            },
          },
        ],
      },
      Roles: [{ Ref: 'ProvidedTargetRole8CFDD54A' }],
    });
  });

  test('reuses IAM role and IAM policy for two schedules from the same account', () => {
    const pipelineTarget = new SageMakerStartPipelineExecution(pipeline, {
      pipelineParameterList,
    });

    new Schedule(stack, 'MyScheduleDummy1', {
      schedule: expr,
      target: pipelineTarget,
    });

    new Schedule(stack, 'MyScheduleDummy2', {
      schedule: expr,
      target: pipelineTarget,
    });

    Template.fromStack(stack).resourcePropertiesCountIs('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Condition: { StringEquals: { 'aws:SourceAccount': '123456789012' } },
            Principal: {
              Service: 'scheduler.amazonaws.com',
            },
            Action: 'sts:AssumeRole',
          },
        ],
      },
    }, 1);

    Template.fromStack(stack).resourcePropertiesCountIs('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sagemaker:StartPipelineExecution',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':sagemaker:us-east-1:123456789012:pipeline/my-sagemaker-pipeline',
                ],
              ],
            },
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget1441a743A31888' }],
    }, 1);
  });

  test('creates IAM policy for pipeline in the another stack with the same account', () => {
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        region: 'us-east-1',
        account: '123456789012',
      },
    });
    const pipelineRole = new Role(stack2, 'SageMakerPipelineRole2', {
      assumedBy: new ServicePrincipal('sagemaker.amazonaws.com'),
    });
    pipelineRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess'));
    const anotherTemplate = new CfnPipeline(stack2, 'AnotherTemplate', {
      pipelineName: 'my-sagemaker-pipeline2',
      pipelineDefinition: pipelineDefinition,
      roleArn: pipelineRole.roleArn,
    });

    const pipelineTarget = new SageMakerStartPipelineExecution(anotherTemplate, {
      pipelineParameterList,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: pipelineTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::Join': [
              '',
              [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':sagemaker:us-east-1:123456789012:pipeline/my-sagemaker-pipeline2',
              ],
            ],
          },
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget1441a743A31888', 'Arn'] },
          RetryPolicy: {},
          SageMakerPipelineParameters: {
            PipelineParameterList: [{
              Name: 'MyParameterName',
              Value: 'MyParameterValue',
            }],
          },
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sagemaker:StartPipelineExecution',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':sagemaker:us-east-1:123456789012:pipeline/my-sagemaker-pipeline2',
                ],
              ],
            },
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget1441a743A31888' }],
    });
  });

  test('creates IAM policy for imported role for sagemaker in the same account', () => {
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/someRole');

    const pipelineTarget = new SageMakerStartPipelineExecution(pipeline, {
      role: importedRole,
      pipelineParameterList,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: pipelineTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':sagemaker:us-east-1:123456789012:pipeline/my-sagemaker-pipeline',
              ],
            ],
          },
          RoleArn: 'arn:aws:iam::123456789012:role/someRole',
          RetryPolicy: {},
          SageMakerPipelineParameters: {
            PipelineParameterList: [{
              Name: 'MyParameterName',
              Value: 'MyParameterValue',
            }],
          },
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sagemaker:StartPipelineExecution',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':sagemaker:us-east-1:123456789012:pipeline/my-sagemaker-pipeline',
                ],
              ],
            },
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test('creates IAM policy for pipeline in the another stack with imported IAM role in the same account', () => {
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        region: 'us-east-1',
        account: '123456789012',
      },
    });
    const pipelineRole = new Role(stack2, 'SageMakerPipelineRole2', {
      assumedBy: new ServicePrincipal('sagemaker.amazonaws.com'),
    });
    pipelineRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess'));
    const anotherTemplate = new CfnPipeline(stack2, 'AnotherTemplate', {
      pipelineName: 'my-sagemaker-pipeline2',
      pipelineDefinition: pipelineDefinition,
      roleArn: pipelineRole.roleArn,
    });
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/someRole');

    const pipelineTarget = new SageMakerStartPipelineExecution(anotherTemplate, {
      role: importedRole,
      pipelineParameterList,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: pipelineTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':sagemaker:us-east-1:123456789012:pipeline/my-sagemaker-pipeline2',
              ],
            ],
          },
          RoleArn: 'arn:aws:iam::123456789012:role/someRole',
          RetryPolicy: {},
          SageMakerPipelineParameters: {
            PipelineParameterList: [{
              Name: 'MyParameterName',
              Value: 'MyParameterValue',
            }],
          },
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sagemaker:StartPipelineExecution',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':sagemaker:us-east-1:123456789012:pipeline/my-sagemaker-pipeline2',
                ],
              ],
            },
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test('throws when pipeline is in the another stack with different account', () => {
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        region: 'us-east-1',
        account: '234567890123',
      },
    });
    const pipelineRole = new Role(stack2, 'SageMakerPipelineRole2', {
      assumedBy: new ServicePrincipal('sagemaker.amazonaws.com'),
    });
    pipelineRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess'));
    const anotherTemplate = new CfnPipeline(stack2, 'AnotherTemplate', {
      pipelineName: 'my-sagemaker-pipeline2',
      pipelineDefinition: pipelineDefinition,
      roleArn: pipelineRole.roleArn,
    });

    const pipelineTarget = new SageMakerStartPipelineExecution(anotherTemplate, {
      pipelineParameterList,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: pipelineTarget,
      })).toThrow(/Both the schedule and the pipeline must be in the same account/);
  });

  test('throws when pipeline is in the another stack with different region', () => {
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        region: 'us-west-2',
        account: '123456789012',
      },
    });
    const pipelineRole = new Role(stack2, 'SageMakerPipelineRole2', {
      assumedBy: new ServicePrincipal('sagemaker.amazonaws.com'),
    });
    pipelineRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess'));
    const anotherTemplate = new CfnPipeline(stack2, 'AnotherTemplate', {
      pipelineName: 'my-sagemaker-pipeline2',
      pipelineDefinition: pipelineDefinition,
      roleArn: pipelineRole.roleArn,
    });

    const pipelineTarget = new SageMakerStartPipelineExecution(anotherTemplate, {
      pipelineParameterList,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: pipelineTarget,
      })).toThrow(/Both the schedule and the pipeline must be in the same region/);
  });

  test('throws when IAM role is imported from different account', () => {
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::234567890123:role/someRole');

    const pipelineTarget = new SageMakerStartPipelineExecution(pipeline, {
      role: importedRole,
      pipelineParameterList,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: pipelineTarget,
      })).toThrow(/Both the target and the execution role must be in the same account/);
  });

  test('adds permissions to DLQ', () => {
    const dlq = new sqs.Queue(stack, 'DummyDeadLetterQueue');

    const pipelineTarget = new SageMakerStartPipelineExecution(pipeline, {
      deadLetterQueue: dlq,
      pipelineParameterList,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: pipelineTarget,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SQS::QueuePolicy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sqs:SendMessage',
            Principal: {
              Service: 'scheduler.amazonaws.com',
            },
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['DummyDeadLetterQueueCEBF3463', 'Arn'],
            },
          },
        ],
      },
      Queues: [
        {
          Ref: 'DummyDeadLetterQueueCEBF3463',
        },
      ],
    });
  });

  test('throws when adding permissions to DLQ from a different region', () => {
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        region: 'eu-west-2',
      },
    });
    const queue = new sqs.Queue(stack2, 'DummyDeadLetterQueue');

    const pipelineTarget = new SageMakerStartPipelineExecution(pipeline, {
      deadLetterQueue: queue,
      pipelineParameterList,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: pipelineTarget,
      })).toThrow(/Both the queue and the schedule must be in the same region./);
  });

  test('does not create a queue policy when DLQ is imported', () => {
    const importedQueue = sqs.Queue.fromQueueArn(stack, 'ImportedQueue', 'arn:aws:sqs:us-east-1:123456789012:queue1');

    const pipelineTarget = new SageMakerStartPipelineExecution(pipeline, {
      deadLetterQueue: importedQueue,
      pipelineParameterList,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: pipelineTarget,
    });

    Template.fromStack(stack).resourceCountIs('AWS::SQS::QueuePolicy', 0);
  });

  test('does not create a queue policy when DLQ is created in a different account', () => {
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        region: 'us-east-1',
        account: '234567890123',
      },
    });

    const queue = new sqs.Queue(stack2, 'DummyDeadLetterQueue', {
      queueName: 'DummyDeadLetterQueue',
    });

    const pipelineTarget = new SageMakerStartPipelineExecution(pipeline, {
      deadLetterQueue: queue,
      pipelineParameterList,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: pipelineTarget,
    });

    Template.fromStack(stack).resourceCountIs('AWS::SQS::QueuePolicy', 0);
  });

  test('renders expected retry policy', () => {
    const pipelineTarget = new SageMakerStartPipelineExecution(pipeline, {
      retryAttempts: 5,
      maxEventAge: Duration.hours(3),
      pipelineParameterList,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: pipelineTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':sagemaker:us-east-1:123456789012:pipeline/my-sagemaker-pipeline',
              ],
            ],
          },
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget1441a743A31888', 'Arn'] },
          RetryPolicy: {
            MaximumEventAgeInSeconds: 10800,
            MaximumRetryAttempts: 5,
          },
          SageMakerPipelineParameters: {
            PipelineParameterList: [{
              Name: 'MyParameterName',
              Value: 'MyParameterValue',
            }],
          },
        },
      },
    });
  });

  test('throws when retry policy max age is more than 1 day', () => {
    const pipelineTarget = new SageMakerStartPipelineExecution(pipeline, {
      maxEventAge: Duration.days(3),
      pipelineParameterList,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: pipelineTarget,
      })).toThrow(/Maximum event age is 1 day/);
  });

  test('throws when retry policy max age is less than 15 minutes', () => {
    const pipelineTarget = new SageMakerStartPipelineExecution(pipeline, {
      maxEventAge: Duration.minutes(5),
      pipelineParameterList,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: pipelineTarget,
      })).toThrow(/Minimum event age is 15 minutes/);
  });

  test('throws when retry policy max retry attempts is out of the allowed limits', () => {
    const pipelineTarget = new SageMakerStartPipelineExecution(pipeline, {
      retryAttempts: 200,
      pipelineParameterList,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: pipelineTarget,
      })).toThrow(/Number of retry attempts should be less or equal than 185/);
  });

  test('throws when pipelineParameterList length is greater than 200', () => {
    const dummyObject = {
      name: 'MyParameterName',
      value: 'MyParameterValue',
    };
    const dummyPipelineParameterList: SageMakerPipelineParameter[] = [];
    for (let i = 0; i < 201; i++) {
      dummyPipelineParameterList.push(dummyObject);
    }

    expect(() =>
      new SageMakerStartPipelineExecution(pipeline, {
        pipelineParameterList: dummyPipelineParameterList,
      })).toThrow(/pipelineParameterList length must be between 0 and 200, got 201/);
  });
});