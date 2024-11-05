import { Group, Schedule, ScheduleExpression } from '@aws-cdk/aws-scheduler-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { Annotations, Template } from 'aws-cdk-lib/assertions';
import { BuildSpec, Project } from 'aws-cdk-lib/aws-codebuild';
import { AccountRootPrincipal, Role } from 'aws-cdk-lib/aws-iam';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { CodeBuildStartBuild } from '../lib';

describe('codebuild start build', () => {
  let app: App;
  let stack: Stack;
  let codebuildProject: Project;

  const codebuildArnRef = { 'Fn::GetAtt': ['ProjectC78D97AD', 'Arn'] };
  const codebuildAction = 'codebuild:StartBuild';
  const expr = ScheduleExpression.at(new Date(Date.UTC(1991, 2, 24, 0, 0, 0)));
  const roleId = 'SchedulerRoleForTarget27bd47517CF0F8';

  beforeEach(() => {
    app = new App({ context: { '@aws-cdk/aws-iam:minimizePolicies': true } });
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
    codebuildProject = new Project(stack, 'Project', {
      buildSpec: BuildSpec.fromObject({}),
    });
  });

  test('creates IAM role and IAM policy for codebuild target in the same account', () => {
    const codeBuildTarget = new CodeBuildStartBuild(codebuildProject, {});

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: codeBuildTarget,
    });

    const template = Template.fromStack(stack);
    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: codebuildArnRef,
          RoleArn: { 'Fn::GetAtt': [roleId, 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: codebuildAction,
            Effect: 'Allow',
            Resource: codebuildArnRef,
          },
        ],
      },
      Roles: [{ Ref: roleId }],
    });

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Condition: {
              StringEquals: {
                'aws:SourceAccount': '123456789012',
                'aws:SourceArn': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':scheduler:us-east-1:123456789012:schedule-group/default',
                    ],
                  ],
                },
              },
            },
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

    const codeBuildTarget = new CodeBuildStartBuild(codebuildProject, {
      role: targetExecutionRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: codeBuildTarget,
    });
    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['ProjectC78D97AD', 'Arn'],
          },
          RoleArn: { 'Fn::GetAtt': ['ProvidedTargetRole8CFDD54A', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: codebuildAction,
            Effect: 'Allow',
            Resource: codebuildArnRef,
          },
        ],
      },
      Roles: [{ Ref: 'ProvidedTargetRole8CFDD54A' }],
    });
  });

  test('reuses IAM role and IAM policy for two schedules with the same target from the same account', () => {
    const codeBuildTarget = new CodeBuildStartBuild(codebuildProject, {});

    new Schedule(stack, 'MyScheduleDummy1', {
      schedule: expr,
      target: codeBuildTarget,
    });

    new Schedule(stack, 'MyScheduleDummy2', {
      schedule: expr,
      target: codeBuildTarget,
    });

    const template = Template.fromStack(stack);

    template.resourcePropertiesCountIs('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Condition: {
              StringEquals: {
                'aws:SourceAccount': '123456789012',
                'aws:SourceArn': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':scheduler:us-east-1:123456789012:schedule-group/default',
                    ],
                  ],
                },
              },
            },
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
            Action: codebuildAction,
            Effect: 'Allow',
            Resource: codebuildArnRef,
          },
        ],
      },
      Roles: [{ Ref: roleId }],
    }, 1);
  });

  test('creates IAM role and IAM policy for two schedules with the same target but different groups', () => {
    const codeBuildTarget = new CodeBuildStartBuild(codebuildProject, {});
    const group = new Group(stack, 'Group', {
      groupName: 'mygroup',
    });

    new Schedule(stack, 'MyScheduleDummy1', {
      schedule: expr,
      target: codeBuildTarget,
    });

    new Schedule(stack, 'MyScheduleDummy2', {
      schedule: expr,
      target: codeBuildTarget,
      group,
    });

    const template = Template.fromStack(stack);

    template.resourcePropertiesCountIs('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Condition: {
              StringEquals: {
                'aws:SourceAccount': '123456789012',
                'aws:SourceArn': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':scheduler:us-east-1:123456789012:schedule-group/default',
                    ],
                  ],
                },
              },
            },
            Principal: {
              Service: 'scheduler.amazonaws.com',
            },
            Action: 'sts:AssumeRole',
          },
          {
            Effect: 'Allow',
            Condition: {
              StringEquals: {
                'aws:SourceAccount': '123456789012',
                'aws:SourceArn': {
                  'Fn::GetAtt': [
                    'GroupC77FDACD',
                    'Arn',
                  ],
                },
              },
            },
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
            Action: codebuildAction,
            Effect: 'Allow',
            Resource: codebuildArnRef,
          },
        ],
      },
      Roles: [{ Ref: roleId }],
    }, 1);
  });

  test('creates IAM policy for imported codebuild project in the same account', () => {
    const importedCodeBuildArn = 'arn:aws:codebuild:us-east-1:123456789012:project/myproject';
    const importedCodeBuild = Project.fromProjectArn(stack, 'ImportedProject', importedCodeBuildArn);

    const codeBuildTarget = new CodeBuildStartBuild(importedCodeBuild, {});

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: codeBuildTarget,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: importedCodeBuildArn,
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTargete199e0B863F6C1', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: codebuildAction,
            Effect: 'Allow',
            Resource: importedCodeBuildArn,
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTargete199e0B863F6C1' }],
    });
  });

  test('creates IAM policy for imported role for code build in the same account', () => {
    const importedRoleArn = 'arn:aws:iam::123456789012:role/someRole';
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', importedRoleArn);

    const codeBuildTarget = new CodeBuildStartBuild(codebuildProject, {
      role: importedRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: codeBuildTarget,
    });

    const template = Template.fromStack(stack);
    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: codebuildArnRef,
          RoleArn: importedRoleArn,
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: codebuildAction,
            Effect: 'Allow',
            Resource: codebuildArnRef,
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test('creates IAM policy for imported code build project with imported IAM role in the same account', () => {
    const importedCodeBuildArn = 'arn:aws:codebuild:us-east-1:123456789012:project/myproject';
    const importedCodeBuild = Project.fromProjectArn(stack, 'ImportedProject', importedCodeBuildArn);
    const importedRoleArn = 'arn:aws:iam::123456789012:role/someRole';
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', importedRoleArn);

    const codeBuildTarget = new CodeBuildStartBuild(importedCodeBuild, {
      role: importedRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: codeBuildTarget,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: importedCodeBuildArn,
          RoleArn: importedRoleArn,
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: codebuildAction,
            Effect: 'Allow',
            Resource: importedCodeBuildArn,
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test.each([
    ['account', 'arn:aws:codebuild:us-east-1:999999999999:project/myproject', /Both the schedule and the project must be in the same account./],
    ['region', 'arn:aws:codebuild:eu-central-1:123456789012:project/myproject', /Both the schedule and the project must be in the same region./],
  ])('throws when codebuild project is imported from different %s', (_, arn: string, expectedError: RegExp) => {
    const importedProject = Project.fromProjectArn(stack, 'ImportedProject', arn);
    const codeBuildTarget = new CodeBuildStartBuild(importedProject, {});

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: codeBuildTarget,
      })).toThrow(expectedError);
  });

  test('throws when IAM role is imported from different account', () => {
    const anotherAccountId = '123456789015';
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', `arn:aws:iam::${anotherAccountId}:role/someRole`);

    const codebuildProjectTarget = new CodeBuildStartBuild(codebuildProject, {
      role: importedRole,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: codebuildProjectTarget,
      })).toThrow(/Both the target and the execution role must be in the same account/);
  });

  test('adds permissions to execution role for sending messages to DLQ', () => {
    const dlq = new Queue(stack, 'DummyDeadLetterQueue');

    const codebuildProjectTarget = new CodeBuildStartBuild(codebuildProject, {
      deadLetterQueue: dlq,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: codebuildProjectTarget,
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: codebuildAction,
            Effect: 'Allow',
            Resource: codebuildArnRef,
          },
          {
            Action: 'sqs:SendMessage',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['DummyDeadLetterQueueCEBF3463', 'Arn'],
            },
          },
        ],
      },
      Roles: [{ Ref: roleId }],
    });
  });

  test('adds permission to execution role when imported DLQ is in same account', () => {
    const importedQueue = Queue.fromQueueArn(stack, 'ImportedQueue', 'arn:aws:sqs:us-east-1:123456789012:queue1');

    const codebuildProjectTarget = new CodeBuildStartBuild(codebuildProject, {
      deadLetterQueue: importedQueue,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: codebuildProjectTarget,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: codebuildAction,
            Effect: 'Allow',
            Resource: codebuildArnRef,
          },
          {
            Action: 'sqs:SendMessage',
            Effect: 'Allow',
            Resource: importedQueue.queueArn,
          },
        ],
      },
      Roles: [{ Ref: roleId }],
    });
  });

  test('does not add IAM policy when DLQ is created in a different account', () => {
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        region: 'us-east-1',
        account: '234567890123',
      },
    });

    const queue = new Queue(stack2, 'DummyDeadLetterQueue', {
      queueName: 'DummyDeadLetterQueue',
    });

    const codebuildProjectTarget = new CodeBuildStartBuild(codebuildProject, {
      deadLetterQueue: queue,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: codebuildProjectTarget,
    });

    Annotations.fromStack(stack).hasWarning('/Stack/MyScheduleDummy', 'Cannot add a resource policy to your dead letter queue associated with schedule undefined because the queue is in a different account. You must add the resource policy manually to the dead letter queue in account 234567890123.');
  });

  test('renders expected retry policy', () => {
    const codebuildProjectTarget = new CodeBuildStartBuild(codebuildProject, {
      retryAttempts: 5,
      maxEventAge: Duration.hours(3),
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: codebuildProjectTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: codebuildArnRef,
          RoleArn: { 'Fn::GetAtt': [roleId, 'Arn'] },
          RetryPolicy: {
            MaximumEventAgeInSeconds: 10800,
            MaximumRetryAttempts: 5,
          },
        },
      },
    });
  });

  test('throws when retry policy max age is more than 1 day', () => {
    const codebuildProjectTarget = new CodeBuildStartBuild(codebuildProject, {
      maxEventAge: Duration.days(3),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: codebuildProjectTarget,
      })).toThrow(/Maximum event age is 1 day/);
  });

  test('throws when retry policy max age is less than 15 minutes', () => {
    const codebuildProjectTarget = new CodeBuildStartBuild(codebuildProject, {
      maxEventAge: Duration.minutes(5),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: codebuildProjectTarget,
      })).toThrow(/Minimum event age is 15 minutes/);
  });

  test('throws when retry policy max retry attempts is out of the allowed limits', () => {
    const codebuildProjectTarget = new CodeBuildStartBuild(codebuildProject, {
      retryAttempts: 200,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: codebuildProjectTarget,
      })).toThrow(/Number of retry attempts should be less or equal than 185/);
  });
});
