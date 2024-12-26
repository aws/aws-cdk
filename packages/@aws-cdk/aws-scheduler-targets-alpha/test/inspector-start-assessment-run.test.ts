import { ScheduleExpression, Schedule, Group } from '@aws-cdk/aws-scheduler-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AccountRootPrincipal, Role } from 'aws-cdk-lib/aws-iam';
import { CfnAssessmentTarget, CfnAssessmentTemplate } from 'aws-cdk-lib/aws-inspector';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { InspectorStartAssessmentRun } from '../lib';

describe('schedule target', () => {
  let app: App;
  let stack: Stack;
  let template: CfnAssessmentTemplate;
  const expr = ScheduleExpression.at(new Date(Date.UTC(1969, 10, 20, 0, 0, 0)));
  const roleId = 'SchedulerRoleForTarget78b2d848BF7444';

  beforeEach(() => {
    app = new App({ context: { '@aws-cdk/aws-iam:minimizePolicies': true } });
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
    const assessmentTarget = new CfnAssessmentTarget(stack, 'MyAssessmentTarget');
    template = new CfnAssessmentTemplate(stack, 'MyTemplate', {
      assessmentTargetArn: assessmentTarget.attrArn,
      durationInSeconds: 3600,
      rulesPackageArns: ['arn:aws:inspector:us-east-1:316112463485:rulespackage/0-gEjTy7T7'],
    });
  });

  test('creates IAM role and IAM policy for inspector assessment template in the same account', () => {
    const inspectorTarget = new InspectorStartAssessmentRun(template);

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: inspectorTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['MyTemplate', 'Arn'],
          },
          RoleArn: { 'Fn::GetAtt': [roleId, 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'inspector:StartAssessmentRun',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
      Roles: [{ Ref: roleId }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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

    const inspectorTarget = new InspectorStartAssessmentRun(template, {
      role: targetExecutionRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: inspectorTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['MyTemplate', 'Arn'],
          },
          RoleArn: { 'Fn::GetAtt': ['ProvidedTargetRole8CFDD54A', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'inspector:StartAssessmentRun',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
      Roles: [{ Ref: 'ProvidedTargetRole8CFDD54A' }],
    });
  });

  test('reuses IAM role and IAM policy for two schedules with the same target from the same account', () => {
    const inspectorTarget = new InspectorStartAssessmentRun(template);

    new Schedule(stack, 'MyScheduleDummy1', {
      schedule: expr,
      target: inspectorTarget,
    });

    new Schedule(stack, 'MyScheduleDummy2', {
      schedule: expr,
      target: inspectorTarget,
    });

    Template.fromStack(stack).resourcePropertiesCountIs('AWS::IAM::Role', {
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

    Template.fromStack(stack).resourcePropertiesCountIs('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'inspector:StartAssessmentRun',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
      Roles: [{ Ref: roleId }],
    }, 1);
  });

  test('creates IAM role and IAM policy for two schedules with the same target but different groups', () => {
    const inspectorTarget = new InspectorStartAssessmentRun(template);
    const group = new Group(stack, 'Group', {
      groupName: 'mygroup',
    });

    new Schedule(stack, 'MyScheduleDummy1', {
      schedule: expr,
      target: inspectorTarget,
    });

    new Schedule(stack, 'MyScheduleDummy2', {
      schedule: expr,
      target: inspectorTarget,
      group,
    });

    Template.fromStack(stack).resourcePropertiesCountIs('AWS::IAM::Role', {
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

    Template.fromStack(stack).resourcePropertiesCountIs('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'inspector:StartAssessmentRun',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
      Roles: [{ Ref: roleId }],
    }, 1);
  });

  test('creates IAM policy for inspector assessment template in the another stack with the same account', () => {
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        region: 'us-east-1',
        account: '123456789012',
      },
    });
    const assessmentTarget = new CfnAssessmentTarget(stack2, 'AnotherTarget');
    const anotherTemplate = new CfnAssessmentTemplate(stack2, 'AnotherTemplate', {
      assessmentTargetArn: assessmentTarget.attrArn,
      durationInSeconds: 3600,
      rulesPackageArns: ['arn:aws:inspector:us-east-1:316112463485:rulespackage/0-gEjTy7T7'],
    });

    const inspectorTarget = new InspectorStartAssessmentRun(anotherTemplate);

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: inspectorTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::ImportValue': 'Stack2:ExportsOutputFnGetAttAnotherTemplateArn9F673A62',
          },
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTargetea46910831E154', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'inspector:StartAssessmentRun',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTargetea46910831E154' }],
    });
  });

  test('creates IAM policy for imported role for inspector in the same account', () => {
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/someRole');

    const inspectorTarget = new InspectorStartAssessmentRun(template, {
      role: importedRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: inspectorTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['MyTemplate', 'Arn'],
          },
          RoleArn: 'arn:aws:iam::123456789012:role/someRole',
          RetryPolicy: {},
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'inspector:StartAssessmentRun',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test('creates IAM policy for inspector assessment template in the another stack with imported IAM role in the same account', () => {
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        region: 'us-east-1',
        account: '123456789012',
      },
    });
    const assessmentTarget = new CfnAssessmentTarget(stack2, 'AnotherTarget');
    const anotherTemplate = new CfnAssessmentTemplate(stack2, 'AnotherTemplate', {
      assessmentTargetArn: assessmentTarget.attrArn,
      durationInSeconds: 3600,
      rulesPackageArns: ['arn:aws:inspector:us-east-1:316112463485:rulespackage/0-gEjTy7T7'],
    });
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/someRole');

    const inspectorTarget = new InspectorStartAssessmentRun(anotherTemplate, {
      role: importedRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: inspectorTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::ImportValue': 'Stack2:ExportsOutputFnGetAttAnotherTemplateArn9F673A62',
          },
          RoleArn: 'arn:aws:iam::123456789012:role/someRole',
          RetryPolicy: {},
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'inspector:StartAssessmentRun',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test('adds permissions to execution role for sending messages to DLQ', () => {
    const dlq = new sqs.Queue(stack, 'DummyDeadLetterQueue');

    const inspectorTarget = new InspectorStartAssessmentRun(template, {
      deadLetterQueue: dlq,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: inspectorTarget,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'inspector:StartAssessmentRun',
            Effect: 'Allow',
            Resource: '*',
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
    const importedQueue = sqs.Queue.fromQueueArn(stack, 'ImportedQueue', 'arn:aws:sqs:us-east-1:123456789012:queue1');

    const inspectorTarget = new InspectorStartAssessmentRun(template, {
      deadLetterQueue: importedQueue,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: inspectorTarget,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'inspector:StartAssessmentRun',
            Effect: 'Allow',
            Resource: '*',
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

  test('renders expected retry policy', () => {
    const inspectorTarget = new InspectorStartAssessmentRun(template, {
      retryAttempts: 5,
      maxEventAge: Duration.hours(3),
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: inspectorTarget,
    });

    Template.fromStack(stack).hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['MyTemplate', 'Arn'],
          },
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
    const inspectorTarget = new InspectorStartAssessmentRun(template, {
      maxEventAge: Duration.days(3),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: inspectorTarget,
      })).toThrow(/Maximum event age is 1 day/);
  });

  test('throws when retry policy max age is less than 1 minute', () => {
    const inspectorTarget = new InspectorStartAssessmentRun(template, {
      maxEventAge: Duration.seconds(59),
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: inspectorTarget,
      })).toThrow(/Minimum event age is 1 minute/);
  });

  test('throws when retry policy max retry attempts is out of the allowed limits', () => {
    const inspectorTarget = new InspectorStartAssessmentRun(template, {
      retryAttempts: 200,
    });

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: inspectorTarget,
      })).toThrow(/Number of retry attempts should be less or equal than 185/);
  });
});
