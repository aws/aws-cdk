import { SynthUtils } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import s3 = require('@aws-cdk/aws-s3');
import sqs = require('@aws-cdk/aws-sqs');
import { Stack } from '@aws-cdk/core';
import notif = require('../lib');

test('queues can be used as destinations', () => {
  const stack = new Stack();

  const queue = new sqs.Queue(stack, 'Queue');
  const bucket = new s3.Bucket(stack, 'Bucket');

  bucket.addObjectRemovedNotification(new notif.SqsDestination(queue));

  expect(stack).toHaveResource('AWS::SQS::QueuePolicy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            "sqs:SendMessage",
            "sqs:GetQueueAttributes",
            "sqs:GetQueueUrl"
          ],
          Condition: {
            ArnLike: {
              "aws:SourceArn": { "Fn::GetAtt": [ "Bucket83908E77", "Arn" ] }
            }
          },
          Effect: "Allow",
          Principal: {
            Service: "s3.amazonaws.com"
          },
          Resource: { "Fn::GetAtt": [ "Queue4A7E3555", "Arn" ] }

        }
      ],
      Version: "2012-10-17"
    },
    Queues: [
      {
        Ref: "Queue4A7E3555"
      }
    ]
  });

  expect(stack).toHaveResource('Custom::S3BucketNotifications', {
    BucketName: {
      Ref: "Bucket83908E77"
    },
    NotificationConfiguration: {
      QueueConfigurations: [
        {
          Events: [
            "s3:ObjectRemoved:*"
          ],
          QueueArn: {
            "Fn::GetAtt": [
              "Queue4A7E3555",
              "Arn"
            ]
          }
        }
      ]
    }
  });

  // make sure the queue policy is added as a dependency to the bucket
  // notifications resource so it will be created first.
  expect(SynthUtils.synthesize(stack).template.Resources.BucketNotifications8F2E257D.DependsOn).toEqual(['QueuePolicy25439813', 'Queue4A7E3555']);
});

test('if the queue is encrypted with a custom kms key, the key resource policy is updated to allow s3 to read messages', () => {
  const stack = new Stack();
  const bucket = new s3.Bucket(stack, 'Bucket');
  const queue = new sqs.Queue(stack, 'Queue', { encryption: sqs.QueueEncryption.KMS });

  bucket.addObjectCreatedNotification(new notif.SqsDestination(queue));

  expect(stack).toHaveResource('AWS::KMS::Key', {
    KeyPolicy: {
      Statement: [
        {
          Action: [
            "kms:Create*",
            "kms:Describe*",
            "kms:Enable*",
            "kms:List*",
            "kms:Put*",
            "kms:Update*",
            "kms:Revoke*",
            "kms:Disable*",
            "kms:Get*",
            "kms:Delete*",
            "kms:ScheduleKeyDeletion",
            "kms:CancelKeyDeletion",
            "kms:GenerateDataKey"
          ],
          Effect: "Allow",
          Principal: {
            AWS: { "Fn::Join": [ "", [ "arn:", { Ref: "AWS::Partition" }, ":iam::", { Ref: "AWS::AccountId" }, ":root" ] ] }
          },
          Resource: "*"
        },
        {
          Action: [
            "kms:Encrypt",
            "kms:ReEncrypt*",
            "kms:GenerateDataKey*"
          ],
          Condition: {
            ArnLike: {
              "aws:SourceArn": { "Fn::GetAtt": [ "Bucket83908E77", "Arn" ] }
            }
          },
          Effect: "Allow",
          Principal: {
            Service: "s3.amazonaws.com"
          },
          Resource: "*"
        },
        {
          Action: [
            "kms:GenerateDataKey*",
            "kms:Decrypt"
          ],
          Effect: "Allow",
          Principal: {
            Service: "s3.amazonaws.com"
          },
          Resource: "*"
        }
      ],
      Version: "2012-10-17"
    },
    Description: "Created by Queue"
  });
});
