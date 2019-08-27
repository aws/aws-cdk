import { expect, haveResource } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import { Duration, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import sqs = require('../lib');
import { Queue } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
  'default properties'(test: Test) {
    const stack = new Stack();
    const q = new sqs.Queue(stack, 'Queue');

    test.deepEqual(q.fifo, false);

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
    queue.addToResourcePolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['sqs:*'],
      principals: [new iam.ArnPrincipal('arn')]
    }));

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

    // WHEN
    const imports = sqs.Queue.fromQueueArn(stack, 'Imported', 'arn:aws:sqs:us-east-1:123456789012:queue1');

    // THEN

    // "import" returns an IQueue bound to `Fn::ImportValue`s.
    test.deepEqual(stack.resolve(imports.queueArn), 'arn:aws:sqs:us-east-1:123456789012:queue1');
    test.deepEqual(stack.resolve(imports.queueUrl), { 'Fn::Join':
      [ '', [ 'https://sqs.', { Ref: 'AWS::Region' }, '.', { Ref: 'AWS::URLSuffix' }, '/', { Ref: 'AWS::AccountId' }, '/queue1' ] ] });
    test.deepEqual(stack.resolve(imports.queueName), 'queue1');
    test.done();
  },

  'grants': {
    'grantConsumeMessages'(test: Test) {
      testGrant((q, p) => q.grantConsumeMessages(p),
        'sqs:ReceiveMessage',
        'sqs:ChangeMessageVisibility',
        'sqs:GetQueueUrl',
        'sqs:DeleteMessage',
        'sqs:GetQueueAttributes',
      );
      test.done();
    },

    'grantSendMessages'(test: Test) {
      testGrant((q, p) => q.grantSendMessages(p),
        'sqs:SendMessage',
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

      const key = new kms.Key(stack, 'CustomKey');
      const queue = new sqs.Queue(stack, 'Queue', { encryptionMasterKey: key });

      test.same(queue.encryptionMasterKey, key);
      expect(stack).to(haveResource('AWS::SQS::Queue', {
        "KmsMasterKeyId": { "Fn::GetAtt": [ "CustomKey1E6D0D07", "Arn" ] }
      }));

      test.done();
    },

    'a kms key will be allocated if encryption = kms but a master key is not specified'(test: Test) {
      const stack = new Stack();

      new sqs.Queue(stack, 'Queue', { encryption: sqs.QueueEncryption.KMS });

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

      new sqs.Queue(stack, 'Queue', { encryption: sqs.QueueEncryption.KMS_MANAGED });
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

    'grant also affects key on encrypted queue'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const queue = new sqs.Queue(stack, 'Queue', {
        encryption: sqs.QueueEncryption.KMS
      });
      const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('someone')
      });

      // WHEN
      queue.grantSendMessages(role);

      // THEN
      expect(stack).to(haveResource('AWS::IAM::Policy', {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": [
                "sqs:SendMessage",
                "sqs:GetQueueAttributes",
                "sqs:GetQueueUrl"
              ],
              "Effect": "Allow",
              "Resource": { "Fn::GetAtt": [ "Queue4A7E3555", "Arn" ] }
            },
            {
              "Action": [
                "kms:Encrypt",
                "kms:ReEncrypt*",
                "kms:GenerateDataKey*"
              ],
              "Effect": "Allow",
              "Resource": { "Fn::GetAtt": [ "QueueKey39FCBAE6", "Arn" ] }
            }
          ],
          "Version": "2012-10-17"
        },
      }));

      test.done();
    },
  },

  'test ".fifo" suffixed queues register as fifo'(test: Test) {
    const stack = new Stack();
    const queue = new Queue(stack, 'Queue', {
      queueName: 'MyQueue.fifo'
    });

    test.deepEqual(queue.fifo, true);

    expect(stack).toMatch({
      "Resources": {
        "Queue4A7E3555": {
          "Type": "AWS::SQS::Queue",
          "Properties": {
            "QueueName": "MyQueue.fifo",
            "FifoQueue": true
          }
        }
      }
    });

    test.done();
  },

  'test metrics'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const queue = new Queue(stack, 'Queue');

    // THEN
    test.deepEqual(stack.resolve(queue.metricNumberOfMessagesSent()), {
      dimensions: {QueueName: { 'Fn::GetAtt': [ 'Queue4A7E3555', 'QueueName' ] }},
      namespace: 'AWS/SQS',
      metricName: 'NumberOfMessagesSent',
      period: Duration.minutes(5),
      statistic: 'Sum'
    });

    test.deepEqual(stack.resolve(queue.metricSentMessageSize()), {
      dimensions: {QueueName: { 'Fn::GetAtt': [ 'Queue4A7E3555', 'QueueName' ] }},
      namespace: 'AWS/SQS',
      metricName: 'SentMessageSize',
      period: Duration.minutes(5),
      statistic: 'Average'
    });

    test.done();
  }
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
