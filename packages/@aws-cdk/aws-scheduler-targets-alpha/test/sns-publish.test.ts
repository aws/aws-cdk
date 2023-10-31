import * as scheduler from '@aws-cdk/aws-scheduler-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sns from 'aws-cdk-lib/aws-sns';
import { SnsPublish } from '../lib/sns-publish';

describe('sns topic schedule target', () => {
  let app: App;
  let stack: Stack;
  let topic: sns.ITopic;
  const scheduleExpression = scheduler.ScheduleExpression.at(new Date(Date.UTC(1969, 10, 20, 0, 0, 0)));

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
    topic = new sns.Topic(stack, 'Topic');
  });

  test('create IAM role and IAM policy for SNS topic in the same account', () => {
    const target = new SnsPublish(topic, {});

    new scheduler.Schedule(stack, 'Schedule', {
      schedule: scheduleExpression,
      target,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            Ref: 'TopicBFC7AF6E',
          },
          RoleArn: {
            'Fn::GetAtt': [
              'SchedulerRoleForTarget1441a743A31888', 'Arn',
            ],
          },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: {
              Ref: 'TopicBFC7AF6E',
            },
          },
        ],
      },
      Roles: [{
        Ref: 'SchedulerRoleForTarget1441a743A31888',
      }],
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

  test('create IAM policy for provided IAM role', () => {
    const targetExecutionRole = new iam.Role(stack, 'ProvidedTargetRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    const target = new SnsPublish(topic, {
      role: targetExecutionRole,
    });

    new scheduler.Schedule(stack, 'Schedule', {
      schedule: scheduleExpression,
      target,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            Ref: 'TopicBFC7AF6E',
          },
          RoleArn: {
            'Fn::GetAtt': [
              'ProvidedTargetRole8CFDD54A',
              'Arn',
            ],
          },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: {
              Ref: 'TopicBFC7AF6E',
            },
          },
        ],
      },
      Roles: [{
        Ref: 'ProvidedTargetRole8CFDD54A',
      }],
    });
  });

  test('reuse IAM role and IAM policy for two schedulers from the same account', () => {
    const target = new SnsPublish(topic, {});

    new scheduler.Schedule(stack, 'Schedule1', {
      schedule: scheduleExpression,
      target,
    });

    new scheduler.Schedule(stack, 'Schedule2', {
      schedule: scheduleExpression,
      target,
    });

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::Scheduler::Schedule', 2);

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Condition: {
              StringEquals: {
                'aws:SourceAccount': '123456789012',
              },
            },
            Principal: {
              Service: 'scheduler.amazonaws.com',
            },
          },
        ],
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: {
              Ref: 'TopicBFC7AF6E',
            },
          },
        ],
      },
      Roles: [{
        Ref: 'SchedulerRoleForTarget1441a743A31888',
      }],
    });
  });

  test('create IAM policy for imported sns topic in the same account', () => {
    const importedTopic = sns.Topic.fromTopicArn(stack, 'ImportedTopic', 'arn:aws:sns:us-east-1:123456789012:my-topic');

    const target = new SnsPublish(importedTopic, {});

    new scheduler.Schedule(stack, 'Schedule', {
      schedule: scheduleExpression,
      target,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: 'arn:aws:sns:us-east-1:123456789012:my-topic',
          RoleArn: {
            'Fn::GetAtt': [
              'SchedulerRoleForTarget54a476A35D62A2', 'Arn',
            ],
          },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: 'arn:aws:sns:us-east-1:123456789012:my-topic',
          },
        ],
      },
      Roles: [{
        Ref: 'SchedulerRoleForTarget54a476A35D62A2',
      }],
    });
  });

  test('create IAM policy for imported role for sns topic in the same account', () => {
    const importedRole = iam.Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/my-role');

    const target = new SnsPublish(topic, {
      role: importedRole,
    });

    new scheduler.Schedule(stack, 'Schedule', {
      schedule: scheduleExpression,
      target,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            Ref: 'TopicBFC7AF6E',
          },
          RoleArn: 'arn:aws:iam::123456789012:role/my-role',
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: {
              Ref: 'TopicBFC7AF6E',
            },
          },
        ],
      },
      Roles: ['my-role'],
    });
  });

  test('create IAM policy for imported sns topic with imported IAM role in the same account', () => {
    const importedTopic = sns.Topic.fromTopicArn(stack, 'ImportedTopic', 'arn:aws:sns:us-east-1:123456789012:my-topic');
    const importedRole = iam.Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/my-role');

    const target = new SnsPublish(importedTopic, {
      role: importedRole,
    });

    new scheduler.Schedule(stack, 'Schedule', {
      schedule: scheduleExpression,
      target,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: 'arn:aws:sns:us-east-1:123456789012:my-topic',
          RoleArn: 'arn:aws:iam::123456789012:role/my-role',
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: 'arn:aws:sns:us-east-1:123456789012:my-topic',
          },
        ],
      },
      Roles: ['my-role'],
    });
  });
});
