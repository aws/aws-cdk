import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import s3 = require('../lib');
import { Topic } from './notification-dests';

// tslint:disable:object-literal-key-quotes
// tslint:disable:max-line-length

export = {
    'bucket without notifications'(test: Test) {
        const stack = new cdk.Stack();

        new s3.Bucket(stack, 'MyBucket');

        expect(stack).toMatch({
          "Resources": {
            "MyBucketF68F3FF0": {
              "Type": "AWS::S3::Bucket"
            }
          }
        });

        test.done();
    },

    'when notification are added, a custom resource is provisioned + a lambda handler for it'(test: Test) {
        const stack = new cdk.Stack();

        const bucket = new s3.Bucket(stack, 'MyBucket');

        const topic = new Topic(stack, 'MyTopic');

        bucket.onEvent(s3.EventType.ObjectCreated, topic);

        expect(stack).to(haveResource('AWS::S3::Bucket'));
        expect(stack).to(haveResource('AWS::Lambda::Function', { Description: 'AWS CloudFormation handler for "Custom::S3BucketNotifications" resources (@aws-cdk/aws-s3)' }));
        expect(stack).to(haveResource('Custom::S3BucketNotifications'));

        test.done();
    },

    'bucketNotificationTarget is not called during synthesis'(test: Test) {
        const stack = new cdk.Stack();

        // notice the order here - topic is defined before bucket
        // but this shouldn't impact the fact that the topic policy includes
        // the bucket information
        const topic = new Topic(stack, 'Topic');
        const bucket = new s3.Bucket(stack, 'MyBucket');

        bucket.onObjectCreated(topic);

        expect(stack).to(haveResource('AWS::SNS::TopicPolicy', {
          "Topics": [
            {
              "Ref": "TopicBFC7AF6E"
            }
          ],
          "PolicyDocument": {
            "Statement": [
              {
                "Action": "sns:Publish",
                "Condition": {
                  "ArnLike": {
                    "aws:SourceArn": {
                      "Fn::GetAtt": [
                        "MyBucketF68F3FF0",
                        "Arn"
                      ]
                    }
                  }
                },
                "Effect": "Allow",
                "Principal": {
                  "Service": "s3.amazonaws.com"
                },
                "Resource": {
                  "Ref": "TopicBFC7AF6E"
                },
                "Sid": "sid0"
              }
            ],
            "Version": "2012-10-17"
          }
        }));

        test.done();
    },

    'subscription types'(test: Test) {
        const stack = new cdk.Stack();

        const bucket = new s3.Bucket(stack, 'TestBucket');

        const queueTarget: s3.IBucketNotificationDestination = {
            asBucketNotificationDestination: _ => ({
                type: s3.BucketNotificationDestinationType.Queue,
                arn: new cdk.Arn('arn:aws:sqs:...')
            })
        };

        const lambdaTarget: s3.IBucketNotificationDestination = {
            asBucketNotificationDestination: _ => ({
                type: s3.BucketNotificationDestinationType.Lambda,
                arn: new cdk.Arn('arn:aws:lambda:...')
            })
        };

        const topicTarget: s3.IBucketNotificationDestination = {
            asBucketNotificationDestination: _ => ({
                type: s3.BucketNotificationDestinationType.Topic,
                arn: new cdk.Arn('arn:aws:sns:...')
            })
        };

        bucket.onEvent(s3.EventType.ObjectCreated, queueTarget);
        bucket.onEvent(s3.EventType.ObjectCreated, lambdaTarget);
        bucket.onObjectRemoved(topicTarget, 'prefix*');

        expect(stack).to(haveResource('Custom::S3BucketNotifications', {
          "ServiceToken": {
            "Fn::GetAtt": [
              "BucketNotificationsHandler050a0587b7544547bf325f094a3db8347ECC3691",
              "Arn"
            ]
          },
          "BucketName": {
            "Ref": "TestBucket560B80BC"
          },
          "NotificationConfiguration": {
            "LambdaFunctionConfigurations": [
              {
                "Events": [
                  "s3:ObjectCreated:*"
                ],
                "LambdaFunctionArn": "arn:aws:lambda:..."
              }
            ],
            "QueueConfigurations": [
              {
                "Events": [
                  "s3:ObjectCreated:*"
                ],
                "QueueArn": "arn:aws:sqs:..."
              }
            ],
            "TopicConfigurations": [
              {
                "Events": [
                  "s3:ObjectRemoved:*"
                ],
                "TopicArn": "arn:aws:sns:...",
                "Filter": {
                  "Key": {
                    "FilterRules": [
                      {
                        "Name": "prefix",
                        "Value": "prefix"
                      }
                    ]
                  }
                }
              }
            ]
          }
        }));

        test.done();
    },

    'multiple subscriptions of the same type'(test: Test) {
        const stack = new cdk.Stack();

        const bucket = new s3.Bucket(stack, 'TestBucket');

        bucket.onEvent(s3.EventType.ObjectRemovedDelete, {
            asBucketNotificationDestination: _ => ({
                type: s3.BucketNotificationDestinationType.Queue,
                arn: new cdk.Arn('arn:aws:sqs:...:queue1')
            })
        });

        bucket.onEvent(s3.EventType.ObjectRemovedDelete, {
            asBucketNotificationDestination: _ => ({
                type: s3.BucketNotificationDestinationType.Queue,
                arn: new cdk.Arn('arn:aws:sqs:...:queue2')
            })
        });

        expect(stack).to(haveResource('Custom::S3BucketNotifications', {
          "ServiceToken": {
            "Fn::GetAtt": [
              "BucketNotificationsHandler050a0587b7544547bf325f094a3db8347ECC3691",
              "Arn"
            ]
          },
          "BucketName": {
            "Ref": "TestBucket560B80BC"
          },
          "NotificationConfiguration": {
            "QueueConfigurations": [
              {
                "Events": [
                  "s3:ObjectRemoved:Delete"
                ],
                "QueueArn": "arn:aws:sqs:...:queue1"
              },
              {
                "Events": [
                  "s3:ObjectRemoved:Delete"
                ],
                "QueueArn": "arn:aws:sqs:...:queue2"
              }
            ]
          }
        }));

        test.done();
    },

    'prefix/suffix filters'(test: Test) {
        const stack = new cdk.Stack();

        const bucket = new s3.Bucket(stack, 'TestBucket');

        const bucketNotificationTarget = {
            type: s3.BucketNotificationDestinationType.Queue,
            arn: new cdk.Arn('arn:aws:sqs:...')
        };

        bucket.onEvent(s3.EventType.ObjectRemovedDelete, { asBucketNotificationDestination: _ => bucketNotificationTarget }, 'images/*', '*.jpg');

        expect(stack).to(haveResource('Custom::S3BucketNotifications', {
          "ServiceToken": {
            "Fn::GetAtt": [
              "BucketNotificationsHandler050a0587b7544547bf325f094a3db8347ECC3691",
              "Arn"
            ]
          },
          "BucketName": {
            "Ref": "TestBucket560B80BC"
          },
          "NotificationConfiguration": {
            "QueueConfigurations": [
              {
                "Events": [
                  "s3:ObjectRemoved:Delete"
                ],
                "Filter": {
                  "Key": {
                    "FilterRules": [
                      {
                        "Name": "prefix",
                        "Value": "images/"
                      },
                      {
                        "Name": "suffix",
                        "Value": ".jpg"
                      }
                    ]
                  }
                },
                "QueueArn": "arn:aws:sqs:..."
              }
            ]
          }
        }));

        test.done();
    }
};
