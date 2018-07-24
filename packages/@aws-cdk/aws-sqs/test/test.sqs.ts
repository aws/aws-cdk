import { expect } from '@aws-cdk/assert';
import { ArnPrincipal, PolicyStatement, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { Queue, QueueRef } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
    'default properties'(test: Test) {
        const stack = new Stack();
        new Queue(stack, 'Queue');

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
        const dlq = new Queue(stack, 'DLQ');
        new Queue(stack, 'Queue', { deadLetterQueue: { queue: dlq, maxReceiveCount: 3 } });

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
        const queue = new Queue(stack, 'MyQueue');
        queue.addToResourcePolicy(new PolicyStatement().addResource('*').addActions('sqs:*').addPrincipal(new ArnPrincipal('arn')));
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
      const queue = new Queue(stack, 'Queue');

      const ref = queue.export();

      QueueRef.import(stack, 'Imported', ref);

      test.done();
    }
};
