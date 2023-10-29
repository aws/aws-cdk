import * as scheduler from '@aws-cdk/aws-scheduler-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
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

});
