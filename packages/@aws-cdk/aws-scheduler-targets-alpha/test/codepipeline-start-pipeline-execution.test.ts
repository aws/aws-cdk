import { Schedule, ScheduleExpression } from '@aws-cdk/aws-scheduler-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { ManualApprovalAction, S3SourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { AccountRootPrincipal, Role } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { CodePipelineStartPipelineExecution } from '../lib/codepipeline-start-pipeline-execution';

describe('codepipeline start execution', () => {
  let app: App;
  let stack: Stack;
  let codepipeline: Pipeline;
  const pipelineArn = {
    'Fn::Join': [
      '',
      [
        'arn:',
        {
          Ref: 'AWS::Partition',
        },
        ':codepipeline:us-east-1:123456789012:',
        {
          Ref: 'PipelineC660917D',
        },
      ],
    ],
  };
  const expr = ScheduleExpression.at(new Date(Date.UTC(1991, 2, 24, 0, 0, 0)));

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
    codepipeline = createMinimalPipeline(stack);
  });

  test('creates IAM role and IAM policy for pipeline target in the same account', () => {
    const codepipelineTarget = new CodePipelineStartPipelineExecution(codepipeline, {});

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: codepipelineTarget,
    });

    const template = Template.fromStack(stack);
    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: pipelineArn,
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget1441a743A31888', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'codepipeline:StartPipelineExecution',
            Effect: 'Allow',
            Resource: pipelineArn,
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget1441a743A31888' }],
    });

    template.hasResourceProperties('AWS::IAM::Role', {
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

    const codepipelineTarget = new CodePipelineStartPipelineExecution(codepipeline, {
      role: targetExecutionRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: codepipelineTarget,
    });
    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: pipelineArn,
          RoleArn: { 'Fn::GetAtt': ['ProvidedTargetRole8CFDD54A', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'codepipeline:StartPipelineExecution',
            Effect: 'Allow',
            Resource: pipelineArn,
          },
        ],
      },
      Roles: [{ Ref: 'ProvidedTargetRole8CFDD54A' }],
    });
  });

  test('reuses IAM role and IAM policy for two schedules from the same account', () => {
    const codepipelineTarget = new CodePipelineStartPipelineExecution(codepipeline, {});

    new Schedule(stack, 'MyScheduleDummy1', {
      schedule: expr,
      target: codepipelineTarget,
    });

    new Schedule(stack, 'MyScheduleDummy2', {
      schedule: expr,
      target: codepipelineTarget,
    });

    const template = Template.fromStack(stack);

    template.resourcePropertiesCountIs('AWS::IAM::Role', {
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

    template.resourcePropertiesCountIs('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'codepipeline:StartPipelineExecution',
            Effect: 'Allow',
            Resource: pipelineArn,
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget1441a743A31888' }],
    }, 1);
  });

  test('creates IAM policy for imported pipeline in the same account', () => {
    const importedPipelineArn = 'arn:aws:codepipeline:us-east-1:123456789012:MyPipeline';
    const importedPipeline = Pipeline.fromPipelineArn(stack, 'ImportedPipeline', importedPipelineArn);

    const codepipelineTarget = new CodePipelineStartPipelineExecution(importedPipeline, {});

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: codepipelineTarget,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: importedPipelineArn,
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget3ed44bFA3D7365', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'codepipeline:StartPipelineExecution',
            Effect: 'Allow',
            Resource: importedPipelineArn,
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget3ed44bFA3D7365' }],
    });
  });

  test('creates IAM policy for imported role for pipeline in the same account', () => {
    const importedRoleArn = 'arn:aws:iam::123456789012:role/someRole';
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', importedRoleArn);

    const codepipelineTarget = new CodePipelineStartPipelineExecution(codepipeline, {
      role: importedRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: codepipelineTarget,
    });

    const template = Template.fromStack(stack);
    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: pipelineArn,
          RoleArn: importedRoleArn,
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'codepipeline:StartPipelineExecution',
            Effect: 'Allow',
            Resource: pipelineArn,
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test('creates IAM policy for imported pipeline with imported IAM role in the same account', () => {
    const importedPipelineArn = 'arn:aws:codepipeline:us-east-1:123456789012:MyPipeline';
    const importedPipeline = Pipeline.fromPipelineArn(stack, 'ImportedPipeline', importedPipelineArn);
    const importedRoleArn = 'arn:aws:iam::123456789012:role/someRole';
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', importedRoleArn);

    const codepipelineTarget = new CodePipelineStartPipelineExecution(importedPipeline, {
      role: importedRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: codepipelineTarget,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: importedPipelineArn,
          RoleArn: importedRoleArn,
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'codepipeline:StartPipelineExecution',
            Effect: 'Allow',
            Resource: importedPipelineArn,
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test('throws when pipeline is imported from different account', () => {
    const anotherAccountId = '123456789015';
    const importedPipeline = Pipeline.fromPipelineArn(stack, 'ImportedPipeline', `arn:aws:states:us-east-1:${anotherAccountId}:Pipeline/MyPipeline`);
    const codepipelineTarget = new CodePipelineStartPipelineExecution(importedPipeline, {});

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: codepipelineTarget,
      })).toThrow(/Both the schedule and the pipeline must be in the same account./);
  });

  test('throws when pipeline is imported from different region', () => {
    const anotherRegion = 'eu-central-1';
    const importedPipeline = Pipeline.fromPipelineArn(stack, 'ImportedPipeline', `arn:aws:states:${anotherRegion}:123456789012:Pipeline/MyPipeline`);
    const codepipelineTarget = new CodePipelineStartPipelineExecution(importedPipeline, {});

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: codepipelineTarget,
      })).toThrow(/Both the schedule and the pipeline must be in the same region/);
  });

  test('throws when IAM role is imported from different account', () => {
    const anotherAccountId = '123456789015';
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', `arn:aws:iam::${anotherAccountId}:role/someRole`);

    const codepipelineTarget = new CodePipelineStartPipelineExecution(codepipeline, {
      role: importedRole,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: codepipelineTarget,
      })).toThrow(/Both the target and the execution role must be in the same account/);
  });

  test('adds permissions to DLQ', () => {
    const dlq = new sqs.Queue(stack, 'DummyDeadLetterQueue');

    const codepipelineTarget = new CodePipelineStartPipelineExecution(codepipeline, {
      deadLetterQueue: dlq,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: codepipelineTarget,
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

    const codepipelineTarget = new CodePipelineStartPipelineExecution(codepipeline, {
      deadLetterQueue: queue,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: codepipelineTarget,
      })).toThrow(/Both the queue and the schedule must be in the same region./);
  });

  test('does not create a queue policy when DLQ is imported', () => {
    const importedQueue = sqs.Queue.fromQueueArn(stack, 'ImportedQueue', 'arn:aws:sqs:us-east-1:123456789012:queue1');

    const codepipelineTarget = new CodePipelineStartPipelineExecution(codepipeline, {
      deadLetterQueue: importedQueue,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: codepipelineTarget,
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

    const codepipelineTarget = new CodePipelineStartPipelineExecution(codepipeline, {
      deadLetterQueue: queue,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: codepipelineTarget,
    });

    Template.fromStack(stack).resourceCountIs('AWS::SQS::QueuePolicy', 0);
  });

  test('renders expected retry policy', () => {
    const codepipelineTarget = new CodePipelineStartPipelineExecution(codepipeline, {
      retryAttempts: 5,
      maxEventAge: Duration.hours(3),
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: codepipelineTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: pipelineArn,
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget1441a743A31888', 'Arn'] },
          RetryPolicy: {
            MaximumEventAgeInSeconds: 10800,
            MaximumRetryAttempts: 5,
          },
        },
      },
    });
  });

  test('throws when retry policy max age is more than 1 day', () => {
    const codepipelineTarget = new CodePipelineStartPipelineExecution(codepipeline, {
      maxEventAge: Duration.days(3),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: codepipelineTarget,
      })).toThrow(/Maximum event age is 1 day/);
  });

  test('throws when retry policy max age is less than 15 minutes', () => {
    const codepipelineTarget = new CodePipelineStartPipelineExecution(codepipeline, {
      maxEventAge: Duration.minutes(5),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: codepipelineTarget,
      })).toThrow(/Minimum event age is 15 minutes/);
  });

  test('throws when retry policy max retry attempts is out of the allowed limits', () => {
    const codepipelineTarget = new CodePipelineStartPipelineExecution(codepipeline, {
      retryAttempts: 200,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: codepipelineTarget,
      })).toThrow(/Number of retry attempts should be less or equal than 185/);
  });
});

function createMinimalPipeline(stack: Stack) {
  return new Pipeline(stack, 'Pipeline', {
    stages: [
      {
        stageName: 'source',
        actions: [
          new S3SourceAction({
            bucket: new Bucket(stack, 'Bucket'),
            output: new Artifact(),
            actionName: 's3',
            bucketKey: 'key',
          }),
        ],
      },
      {
        stageName: 'build',
        actions: [
          new ManualApprovalAction({
            actionName: 'manual-approval',
          }),
        ],
      },
    ],
  });
}
