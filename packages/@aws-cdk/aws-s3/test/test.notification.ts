import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import s3 = require('../lib');

export = {
  'when notification are added, a custom resource is provisioned + a lambda handler for it'(test: Test) {
    const stack = new cdk.Stack();

    const bucket = new s3.Bucket(stack, 'MyBucket');

    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC
      })
    });

    expect(stack).to(haveResource('AWS::S3::Bucket'));
    expect(stack).to(haveResource('Custom::S3BucketNotifications'));

    test.done();
  },

  'can specify prefix and suffix filter rules'(test: Test) {
    const stack = new cdk.Stack();

    const bucket = new s3.Bucket(stack, 'MyBucket');

    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC
      }),
    }, { prefix: 'images/', suffix: '.png' });

    expect(stack).to(haveResource('Custom::S3BucketNotifications', {
      NotificationConfiguration: {
        TopicConfigurations: [
          {
            Events: [
              's3:ObjectCreated:*'
            ],
            Filter: {
              Key: {
                FilterRules: [
                  {
                    Name: 'suffix',
                    Value: '.png'
                  },
                  {
                    Name: 'prefix',
                    Value: 'images/'
                  }
                ]
              }
            },
            TopicArn: 'ARN'
          }
        ]
      }
    }));

    test.done();
  },

  'throws with multiple prefix rules in a filter'(test: Test) {
    const stack = new cdk.Stack();

    const bucket = new s3.Bucket(stack, 'MyBucket');

    test.throws(() => bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC
      }),
    }, { prefix: 'images/'}, { prefix: 'archive/' }), /prefix rule/);

    test.done();
  },

  'throws with multiple suffix rules in a filter'(test: Test) {
    const stack = new cdk.Stack();

    const bucket = new s3.Bucket(stack, 'MyBucket');

    test.throws(() => bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
      bind: () => ({
        arn: 'ARN',
        type: s3.BucketNotificationDestinationType.TOPIC
      }),
    }, { suffix: '.png'}, { suffix: '.zip' }), /suffix rule/);

    test.done();
  }
};
