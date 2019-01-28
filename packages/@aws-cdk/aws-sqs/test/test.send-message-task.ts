import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import sqs = require('../lib');

export = {
  'publish to queue'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const queue = new sqs.Queue(stack, 'Queue');

    // WHEN
    const pub = new sqs.SendMessageTask(stack, 'Send', {
      queue,
      messageBody: 'Send this message',
      messageDeduplicationIdPath: '$.deduping',
    });

    // THEN
    test.deepEqual(stack.node.resolve(pub.toStateJson()), {
      Type: 'Task',
      Resource: 'arn:aws:states:::sqs:sendMessage',
      End: true,
      Parameters: {
        'QueueUrl': { Ref: 'Queue4A7E3555' },
        'MessageBody': 'Send this message',
        'MessageDeduplicationId.$': '$.deduping'
      },
    });

    test.done();
  }
};