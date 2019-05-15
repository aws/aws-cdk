import { expect, haveResource, SynthUtils } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import s3 = require('@aws-cdk/aws-s3');
import { App, CfnOutput, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import sqs = require('../lib');
import { Queue } from '../lib';

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
    queue.addToResourcePolicy(new iam.PolicyStatement().addAllResources().addActions('sqs:*').addPrincipal(new iam.ArnPrincipal('arn')));
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
    // GIVEN
    const stack = new Stack();
    const queue = new sqs.Queue(stack, 'Queue');

    // WHEN
    const ref = queue.export();
    const imports = sqs.Queue.fromQueueAttributes(stack, 'Imported', ref);

    // THEN

    // "import" returns an IQueue bound to `Fn::ImportValue`s.
    test.deepEqual(stack.node.resolve(imports.queueArn), { 'Fn::ImportValue': 'Stack:QueueQueueArn8CF496D5' });
    test.deepEqual(stack.node.resolve(imports.queueUrl), { 'Fn::ImportValue': 'Stack:QueueQueueUrlC30FF916' });

    // the exporting stack has Outputs for QueueARN and QueueURL
    const outputs = SynthUtils.toCloudFormation(stack).Outputs;
    // tslint:disable-next-line:max-line-length
    test.deepEqual(outputs.QueueQueueArn8CF496D5, { Value: { 'Fn::GetAtt': [ 'Queue4A7E3555', 'Arn' ] }, Export: { Name: 'Stack:QueueQueueArn8CF496D5' } });
    test.deepEqual(outputs.QueueQueueUrlC30FF916, { Value: { Ref: 'Queue4A7E3555' }, Export: { Name: 'Stack:QueueQueueUrlC30FF916' } });

    test.done();
  },

  'grants': {
    'grantConsumeMessages'(test: Test) {
      testGrant((q, p) => q.grantConsumeMessages(p),
        'sqs:ReceiveMessage',
        'sqs:ChangeMessageVisibility',
        'sqs:ChangeMessageVisibilityBatch',
        'sqs:GetQueueUrl',
        'sqs:DeleteMessage',
        'sqs:DeleteMessageBatch',
        'sqs:GetQueueAttributes',
      );
      test.done();
    },

    'grantSendMessages'(test: Test) {
      testGrant((q, p) => q.grantSendMessages(p),
        'sqs:SendMessage',
        'sqs:SendMessageBatch',
        'sqs:GetQueueAttributes',
        'sqs:GetQueueUrl',
      );
      test.done();
    },

    'grantPurge'(test: Test) {
      testGrant((q, p) => q.grantPurge(p),
        'sqs:PurgeQueue',
        'sqs:GetQueueAttributes',
        'sqs:GetQueueUrl',
      );
      test.done();
    },

    'grant() is general purpose'(test: Test) {
      testGrant((q, p) => q.grant(p, 'hello', 'world'),
        'hello',
        'world'
      );
      test.done();
    },

    'grants also work on imported queues'(test: Test) {
      const stack = new Stack();
      const queue = Queue.fromQueueAttributes(stack, 'Import', {
        queueArn: 'arn:aws:sqs:us-east-1:123456789012:queue1',
        queueUrl: 'https://queue-url'
      });

      const user = new iam.User(stack, 'User');

      queue.grantPurge(user);

      expect(stack).to(haveResource('AWS::IAM::Policy', {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": [
                "sqs:PurgeQueue",
                "sqs:GetQueueAttributes",
                "sqs:GetQueueUrl"
              ],
              "Effect": "Allow",
              "Resource": "arn:aws:sqs:us-east-1:123456789012:queue1"
            }
          ],
          "Version": "2012-10-17"
        }
      }));

      test.done();
    }
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

        test.deepEqual(stack.node.resolve(exportCustom), {
          queueArn: { 'Fn::ImportValue': 'Stack:QueueWithCustomKeyQueueArnD326BB9B' },
          queueUrl: { 'Fn::ImportValue': 'Stack:QueueWithCustomKeyQueueUrlF07DDC70' },
          keyArn: { 'Fn::ImportValue': 'Stack:QueueWithCustomKeyKeyArn537F6E42' }
        });

        test.deepEqual(SynthUtils.toCloudFormation(stack).Outputs, {
          "QueueWithCustomKeyQueueArnD326BB9B": {
          "Value": {
            "Fn::GetAtt": [
            "QueueWithCustomKeyB3E22087",
            "Arn"
            ]
          },
          "Export": {
            "Name": "Stack:QueueWithCustomKeyQueueArnD326BB9B"
          }
          },
          "QueueWithCustomKeyQueueUrlF07DDC70": {
          "Value": {
            "Ref": "QueueWithCustomKeyB3E22087"
          },
          "Export": {
            "Name": "Stack:QueueWithCustomKeyQueueUrlF07DDC70"
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
            "Name": "Stack:QueueWithCustomKeyKeyArn537F6E42"
          }
          }
        });
        test.done();
      },

      'with managed key'(test: Test) {
        const stack = new Stack();

        const managedKey = new sqs.Queue(stack, 'QueueWithManagedKey', { encryption: sqs.QueueEncryption.KmsManaged });

        const exportManaged = managedKey.export();

        test.deepEqual(stack.node.resolve(exportManaged), {
          queueArn: { 'Fn::ImportValue': 'Stack:QueueWithManagedKeyQueueArn8798A14E' },
          queueUrl: { 'Fn::ImportValue': 'Stack:QueueWithManagedKeyQueueUrlD735C981' },
          keyArn: { 'Fn::ImportValue': 'Stack:QueueWithManagedKeyKeyArn9C42A85D' }
        });

        test.deepEqual(SynthUtils.toCloudFormation(stack).Outputs, {
          "QueueWithManagedKeyQueueArn8798A14E": {
          "Value": {
            "Fn::GetAtt": [
            "QueueWithManagedKeyE1B747A1",
            "Arn"
            ]
          },
          "Export": {
            "Name": "Stack:QueueWithManagedKeyQueueArn8798A14E"
          }
          },
          "QueueWithManagedKeyQueueUrlD735C981": {
          "Value": {
            "Ref": "QueueWithManagedKeyE1B747A1"
          },
          "Export": {
            "Name": "Stack:QueueWithManagedKeyQueueUrlD735C981"
          }
          },
          "QueueWithManagedKeyKeyArn9C42A85D": {
          "Value": "alias/aws/sqs",
          "Export": {
            "Name": "Stack:QueueWithManagedKeyKeyArn9C42A85D"
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
            "Service": {
              "Fn::Join": ["", ["s3.", { Ref: "AWS::URLSuffix" }]]
            }
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
      test.deepEqual(SynthUtils.toCloudFormation(stack).Resources.BucketNotifications8F2E257D.DependsOn, [ 'QueuePolicy25439813' ]);

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
            "Service": {
              "Fn::Join": ["", ["s3.", { Ref: "AWS::URLSuffix" }]]
            }
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

  },

  'test metrics'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const topic = new Queue(stack, 'Queue');

    // THEN
    test.deepEqual(stack.node.resolve(topic.metricNumberOfMessagesSent()), {
      dimensions: {QueueName: { 'Fn::GetAtt': [ 'Queue4A7E3555', 'QueueName' ] }},
      namespace: 'AWS/SQS',
      metricName: 'NumberOfMessagesSent',
      periodSec: 300,
      statistic: 'Sum'
    });

    test.deepEqual(stack.node.resolve(topic.metricSentMessageSize()), {
      dimensions: {QueueName: { 'Fn::GetAtt': [ 'Queue4A7E3555', 'QueueName' ] }},
      namespace: 'AWS/SQS',
      metricName: 'SentMessageSize',
      periodSec: 300,
      statistic: 'Average'
    });

    test.done();
  },

  'reference stack from other stack'(test: Test) {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1');
    const queue = new sqs.Queue(stack1, 'Queue');

    const stack2 = new Stack(app, 'Stack2');

    // WHEN
    new CfnOutput(stack2, 'Output', { value: queue.queueArn });

    // THEN
    expect(stack2).toMatch({
      Outputs: {
        Hello: 'bye'
      }
    });

    test.done();
  },
};

function testGrant(action: (q: Queue, principal: iam.IPrincipal) => void, ...expectedActions: string[]) {
  const stack = new Stack();
  const queue = new Queue(stack, 'MyQueue');
  const principal = new iam.User(stack, 'User');

  action(queue, principal);

  expect(stack).to(haveResource('AWS::IAM::Policy', {
    "PolicyDocument": {
      "Statement": [
        {
          "Action": expectedActions,
          "Effect": "Allow",
          "Resource": {
            "Fn::GetAtt": [
              "MyQueueE6CA6235",
              "Arn"
            ]
          }
        }
      ],
      "Version": "2012-10-17"
    }
  }));
}
