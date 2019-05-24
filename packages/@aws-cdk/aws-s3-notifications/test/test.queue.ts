import { expect, haveResource, SynthUtils } from '@aws-cdk/assert';
import s3 = require('@aws-cdk/aws-s3');
import sqs = require('@aws-cdk/aws-sqs');
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import notif = require('../lib');

export = {
  'queues can be used as destinations'(test: Test) {
    const stack = new Stack();

    const queue = new sqs.Queue(stack, 'Queue');
    const bucket = new s3.Bucket(stack, 'Bucket');

    bucket.addObjectRemovedNotification(new notif.SqsDestination(queue));

    expect(stack).to(haveResource('AWS::SQS::QueuePolicy', {
      PolicyDocument: {
      Statement: [
        {
        Action: "sqs:SendMessage",
        Condition: {
          ArnLike: {
          "aws:SourceArn": {
            "Fn::GetAtt": [
            "Bucket83908E77",
            "Arn"
            ]
          }
          }
        },
        Effect: "Allow",
        Principal: {
          Service: {
            "Fn::Join": ["", ["s3.", { Ref: "AWS::URLSuffix" }]]
          }
        },
        Resource: {
          "Fn::GetAtt": [
          "Queue4A7E3555",
          "Arn"
          ]
        }
        }
      ],
      Version: "2012-10-17"
      },
      Queues: [
      {
        Ref: "Queue4A7E3555"
      }
      ]
    }));

    expect(stack).to(haveResource('Custom::S3BucketNotifications', {
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
    }));

    // make sure the queue policy is added as a dependency to the bucket
    // notifications resource so it will be created first.
    test.deepEqual(SynthUtils.toCloudFormation(stack).Resources.BucketNotifications8F2E257D.DependsOn, [ 'QueuePolicy25439813' ]);

    test.done();
  },

  'if the queue is encrypted with a custom kms key, the key resource policy is updated to allow s3 to read messages'(test: Test) {

    const stack = new Stack();
    const bucket = new s3.Bucket(stack, 'Bucket');
    const queue = new sqs.Queue(stack, 'Queue', { encryption: sqs.QueueEncryption.Kms });

    bucket.addObjectCreatedNotification(new notif.SqsDestination(queue));

    expect(stack).to(haveResource('AWS::KMS::Key', {
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
          "kms:CancelKeyDeletion"
        ],
        Effect: "Allow",
        Principal: {
          AWS: {
          "Fn::Join": [
            "",
            [
            "arn:",
            {
              Ref: "AWS::Partition"
            },
            ":iam::",
            {
              Ref: "AWS::AccountId"
            },
            ":root"
            ]
          ]
          }
        },
        Resource: "*"
        },
        {
        Action: [
          "kms:GenerateDataKey",
          "kms:Decrypt"
        ],
        Effect: "Allow",
        Principal: {
          Service: {
            "Fn::Join": ["", ["s3.", { Ref: "AWS::URLSuffix" }]]
          }
        },
        Resource: "*"
        }
      ],
      Version: "2012-10-17"
      },
      Description: "Created by Queue"
    }));

    test.done();
  },

  'fails if trying to subscribe to a queue with managed kms encryption'(test: Test) {
    const stack = new Stack();
    const queue = new sqs.Queue(stack, 'Queue', { encryption: sqs.QueueEncryption.KmsManaged });
    const bucket = new s3.Bucket(stack, 'Bucket');
    test.throws(() => {
      bucket.addObjectRemovedNotification(new notif.SqsDestination(queue));
    }, 'Unable to add statement to IAM resource policy for KMS key: "alias/aws/sqs"');
    test.done();
  }

};
