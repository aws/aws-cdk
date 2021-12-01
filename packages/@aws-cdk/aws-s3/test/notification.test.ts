import '@aws-cdk/assert-internal/jest';
import { ResourcePart } from '@aws-cdk/assert-internal';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as s3 from '../lib';

describe('notification', () => {
  test('when notification is added a custom s3 bucket notification resource is provisioned', () => {
    const stack = new cdk.Stack();

    const bucket = new s3.Bucket(stack, 'MyBucket');

    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    });

    expect(stack).toHaveResource('AWS::S3::Bucket');
    expect(stack).toHaveResource('Custom::S3BucketNotifications', {
      NotificationConfiguration: {
        TopicConfigurations: [
          {
            Events: [
              's3:ObjectCreated:*',
            ],
            TopicArn: 'ARN',
          },
        ],
      },
    });


  });

  test('can specify a custom role for the notifications handler', () => {
    const stack = new cdk.Stack();

    const importedRole = iam.Role.fromRoleArn(stack, 'role', 'arn:aws:iam::111111111111:role/DevsNotAllowedToTouch');

    const bucket = new s3.Bucket(stack, 'MyBucket', {
      notificationsHandlerRole: importedRole,
    });

    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    });

    expect(stack).toHaveResource('AWS::S3::Bucket');
    expect(stack).toHaveResource('AWS::Lambda::Function', {
      Description: 'AWS CloudFormation handler for "Custom::S3BucketNotifications" resources (@aws-cdk/aws-s3)',
      Role: 'arn:aws:iam::111111111111:role/DevsNotAllowedToTouch',
    });
  });

  test('can specify prefix and suffix filter rules', () => {
    const stack = new cdk.Stack();

    const bucket = new s3.Bucket(stack, 'MyBucket');

    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    }, { prefix: 'images/', suffix: '.png' });

    expect(stack).toHaveResource('Custom::S3BucketNotifications', {
      NotificationConfiguration: {
        TopicConfigurations: [
          {
            Events: [
              's3:ObjectCreated:*',
            ],
            Filter: {
              Key: {
                FilterRules: [
                  {
                    Name: 'suffix',
                    Value: '.png',
                  },
                  {
                    Name: 'prefix',
                    Value: 'images/',
                  },
                ],
              },
            },
            TopicArn: 'ARN',
          },
        ],
      },
    });


  });

  test('the notification lambda handler must depend on the role to prevent executing too early', () => {
    const stack = new cdk.Stack();

    const bucket = new s3.Bucket(stack, 'MyBucket');

    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    });

    expect(stack).toHaveResourceLike('AWS::Lambda::Function', {
      Type: 'AWS::Lambda::Function',
      Properties: {
        Role: {
          'Fn::GetAtt': [
            'BucketNotificationsHandler050a0587b7544547bf325f094a3db834RoleB6FB88EC',
            'Arn',
          ],
        },
      },
      DependsOn: ['BucketNotificationsHandler050a0587b7544547bf325f094a3db834RoleDefaultPolicy2CF63D36',
        'BucketNotificationsHandler050a0587b7544547bf325f094a3db834RoleB6FB88EC'],
    }, ResourcePart.CompleteDefinition );


  });

  test('throws with multiple prefix rules in a filter', () => {
    const stack = new cdk.Stack();

    const bucket = new s3.Bucket(stack, 'MyBucket');

    expect(() => bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    }, { prefix: 'images/' }, { prefix: 'archive/' })).toThrow(/prefix rule/);


  });

  test('throws with multiple suffix rules in a filter', () => {
    const stack = new cdk.Stack();

    const bucket = new s3.Bucket(stack, 'MyBucket');

    expect(() => bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC,
      }),
    }, { suffix: '.png' }, { suffix: '.zip' })).toThrow(/suffix rule/);


  });
});
