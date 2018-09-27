import { expect, haveResource } from '@aws-cdk/assert';
import kms = require('@aws-cdk/aws-kms');
import s3 = require('@aws-cdk/aws-s3');
import { ArnPrincipal, PolicyStatement, resolve, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import sqs = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'default properties'(test: Test) {
    const stack = new Stack();
    new sqs.Queue(stack, 'Queue');

    expect(stack).toMatch({
      "Resources": {
        "Queue4A7E3555": {
        "Type": "AWS::SQS::Queue"
        }
      }
    });

    test.done();
  },
  'with a dead letter queue'(test: Test) {
    const stack = new Stack();
    const dlq = new sqs.Queue(stack, 'DLQ');
    new sqs.Queue(stack, 'Queue', { deadLetterQueue: { queue: dlq, maxReceiveCount: 3 } });

    expect(stack).toMatch({
      "Resources": {
        "DLQ581697C4": {
        "Type": "AWS::SQS::Queue"
        },
        "Queue4A7E3555": {
        "Type": "AWS::SQS::Queue",
        "Properties": {
          "RedrivePolicy": {
          "deadLetterTargetArn": {
            "Fn::GetAtt": [
            "DLQ581697C4",
            "Arn"
            ]
          },
          "maxReceiveCount": 3
          }
        }
        }
      }
    });

    test.done();
  },

  'addToPolicy will automatically create a policy for this queue'(test: Test) {
    const stack = new Stack();
    const queue = new sqs.Queue(stack, 'MyQueue');
    queue.addToResourcePolicy(new PolicyStatement().addAllResources().addActions('sqs:*').addPrincipal(new ArnPrincipal('arn')));
    expect(stack).toMatch({
      "Resources": {
        "MyQueueE6CA6235": {
        "Type": "AWS::SQS::Queue"
        },
        "MyQueuePolicy6BBEDDAC": {
        "Type": "AWS::SQS::QueuePolicy",
        "Properties": {
          "PolicyDocument": {
          "Statement": [
            {
            "Action": "sqs:*",
            "Effect": "Allow",
            "Principal": {
              "AWS": "arn"
            },
            "Resource": "*"
            }
          ],
          "Version": "2012-10-17"
          },
          "Queues": [
          {
            "Ref": "MyQueueE6CA6235"
          }
          ]
        }
        }
      }
    });
    test.done();
  },

  'exporting and importing works'(test: Test) {
    const stack = new Stack();
    const queue = new sqs.Queue(stack, 'Queue');

    const ref = queue.export();

    sqs.QueueRef.import(stack, 'Imported', ref);

    test.done();
  },

  'queue encryption': {
    'encryptionMasterKey can be set to a custom KMS key'(test: Test) {
      const stack = new Stack();

      const key = new kms.EncryptionKey(stack, 'CustomKey');
      const queue = new sqs.Queue(stack, 'Queue', { encryptionMasterKey: key });

      test.same(queue.encryptionMasterKey, key);
      expect(stack).to(haveResource('AWS::SQS::Queue', {
        "KmsMasterKeyId": { "Fn::GetAtt": [ "CustomKey1E6D0D07", "Arn" ] }
      }));

      test.done();
    },

    'a kms key will be allocated if encryption = kms but a master key is not specified'(test: Test) {
      const stack = new Stack();

      new sqs.Queue(stack, 'Queue', { encryption: sqs.QueueEncryption.Kms });

      expect(stack).to(haveResource('AWS::KMS::Key'));
      expect(stack).to(haveResource('AWS::SQS::Queue', {
        "KmsMasterKeyId": {
        "Fn::GetAtt": [
          "QueueKey39FCBAE6",
          "Arn"
        ]
        }
      }));

      test.done();
    },

    'it is possible to use a managed kms key'(test: Test) {
      const stack = new Stack();

      new sqs.Queue(stack, 'Queue', { encryption: sqs.QueueEncryption.KmsManaged });
      expect(stack).toMatch({
        "Resources": {
        "Queue4A7E3555": {
          "Type": "AWS::SQS::Queue",
          "Properties": {
          "KmsMasterKeyId": "alias/aws/sqs"
          }
        }
        }
      });
      test.done();
    },

    'export should produce outputs the key arn and return import-values for these outputs': {

      'with custom key'(test: Test) {
        const stack = new Stack();

        const customKey = new sqs.Queue(stack, 'QueueWithCustomKey', { encryption: sqs.QueueEncryption.Kms });

        const exportCustom = customKey.export();

        test.deepEqual(resolve(exportCustom), {
          queueArn: { 'Fn::ImportValue': 'QueueWithCustomKeyQueueArnD326BB9B' },
          queueUrl: { 'Fn::ImportValue': 'QueueWithCustomKeyQueueUrlF07DDC70' },
          keyArn: { 'Fn::ImportValue': 'QueueWithCustomKeyKeyArn537F6E42' }
        });

        test.deepEqual(stack.toCloudFormation().Outputs, {
          "QueueWithCustomKeyQueueArnD326BB9B": {
          "Value": {
            "Fn::GetAtt": [
            "QueueWithCustomKeyB3E22087",
            "Arn"
            ]
          },
          "Export": {
            "Name": "QueueWithCustomKeyQueueArnD326BB9B"
          }
          },
          "QueueWithCustomKeyQueueUrlF07DDC70": {
          "Value": {
            "Ref": "QueueWithCustomKeyB3E22087"
          },
          "Export": {
            "Name": "QueueWithCustomKeyQueueUrlF07DDC70"
          }
          },
          "QueueWithCustomKeyKeyArn537F6E42": {
          "Value": {
            "Fn::GetAtt": [
            "QueueWithCustomKeyD80425F1",
            "Arn"
            ]
          },
          "Export": {
            "Name": "QueueWithCustomKeyKeyArn537F6E42"
          }
          }
        });
        test.done();
      },

      'with managed key'(test: Test) {
        const stack = new Stack();

        const managedKey = new sqs.Queue(stack, 'QueueWithManagedKey', { encryption: sqs.QueueEncryption.KmsManaged });

        const exportManaged = managedKey.export();

        test.deepEqual(resolve(exportManaged), {
          queueArn: { 'Fn::ImportValue': 'QueueWithManagedKeyQueueArn8798A14E' },
          queueUrl: { 'Fn::ImportValue': 'QueueWithManagedKeyQueueUrlD735C981' },
          keyArn: { 'Fn::ImportValue': 'QueueWithManagedKeyKeyArn9C42A85D' }
        });

        test.deepEqual(stack.toCloudFormation().Outputs, {
          "QueueWithManagedKeyQueueArn8798A14E": {
          "Value": {
            "Fn::GetAtt": [
            "QueueWithManagedKeyE1B747A1",
            "Arn"
            ]
          },
          "Export": {
            "Name": "QueueWithManagedKeyQueueArn8798A14E"
          }
          },
          "QueueWithManagedKeyQueueUrlD735C981": {
          "Value": {
            "Ref": "QueueWithManagedKeyE1B747A1"
          },
          "Export": {
            "Name": "QueueWithManagedKeyQueueUrlD735C981"
          }
          },
          "QueueWithManagedKeyKeyArn9C42A85D": {
          "Value": "alias/aws/sqs",
          "Export": {
            "Name": "QueueWithManagedKeyKeyArn9C42A85D"
          }
          }
        });

        test.done();
      }

    }

  },

  'bucket notifications': {

    'queues can be used as destinations'(test: Test) {
      const stack = new Stack();

      const queue = new sqs.Queue(stack, 'Queue');
      const bucket = new s3.Bucket(stack, 'Bucket');

      bucket.onObjectRemoved(queue);

      expect(stack).to(haveResource('AWS::SQS::QueuePolicy', {
        "PolicyDocument": {
        "Statement": [
          {
          "Action": "sqs:SendMessage",
          "Condition": {
            "ArnLike": {
            "aws:SourceArn": {
              "Fn::GetAtt": [
              "Bucket83908E77",
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
            "Fn::GetAtt": [
            "Queue4A7E3555",
            "Arn"
            ]
          }
          }
        ],
        "Version": "2012-10-17"
        },
        "Queues": [
        {
          "Ref": "Queue4A7E3555"
        }
        ]
      }));

      expect(stack).to(haveResource('Custom::S3BucketNotifications', {
        "BucketName": {
        "Ref": "Bucket83908E77"
        },
        "NotificationConfiguration": {
        "QueueConfigurations": [
          {
          "Events": [
            "s3:ObjectRemoved:*"
          ],
          "QueueArn": {
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
      test.deepEqual(stack.toCloudFormation().Resources.BucketNotifications8F2E257D.DependsOn, [ 'QueuePolicy25439813' ]);

      test.done();
    },

    'if the queue is encrypted with a custom kms key, the key resource policy is updated to allow s3 to read messages'(test: Test) {

      const stack = new Stack();
      const bucket = new s3.Bucket(stack, 'Bucket');
      const queue = new sqs.Queue(stack, 'Queue', { encryption: sqs.QueueEncryption.Kms });

      bucket.onObjectCreated(queue);

      expect(stack).to(haveResource('AWS::KMS::Key', {
        "KeyPolicy": {
        "Statement": [
          {
          "Action": [
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
          "Effect": "Allow",
          "Principal": {
            "AWS": {
            "Fn::Join": [
              "",
              [
              "arn:",
              {
                "Ref": "AWS::Partition"
              },
              ":iam::",
              {
                "Ref": "AWS::AccountId"
              },
              ":root"
              ]
            ]
            }
          },
          "Resource": "*"
          },
          {
          "Action": [
            "kms:GenerateDataKey",
            "kms:Decrypt"
          ],
          "Effect": "Allow",
          "Principal": {
            "Service": "s3.amazonaws.com"
          },
          "Resource": "*"
          }
        ],
        "Version": "2012-10-17"
        },
        "Description": "Created by Queue"
      }));

      test.done();
    },

    'fails if trying to subscribe to a queue with managed kms encryption'(test: Test) {
      const stack = new Stack();
      const queue = new sqs.Queue(stack, 'Queue', { encryption: sqs.QueueEncryption.KmsManaged });
      const bucket = new s3.Bucket(stack, 'Bucket');
      test.throws(() => bucket.onObjectRemoved(queue), 'Unable to add statement to IAM resource policy for KMS key: "alias/aws/sqs"');
      test.done();
    }

  }
};
