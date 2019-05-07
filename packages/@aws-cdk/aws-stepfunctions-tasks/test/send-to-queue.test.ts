import sqs = require('@aws-cdk/aws-sqs');
import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/cdk');
import tasks = require('../lib');

test('publish to queue', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const queue = new sqs.Queue(stack, 'Queue');

  // WHEN
  const pub = new sfn.Task(stack, 'Send', { task: new tasks.SendToQueue(queue, {
    messageBody: 'Send this message',
    messageDeduplicationIdPath: '$.deduping',
  }) });

  // THEN
  expect(stack.node.resolve(pub.toStateJson())).toEqual({
    Type: 'Task',
    Resource: 'arn:aws:states:::sqs:sendMessage',
    End: true,
    Parameters: {
      'QueueUrl': { Ref: 'Queue4A7E3555' },
      'MessageBody': 'Send this message',
      'MessageDeduplicationId.$': '$.deduping'
    },
  });
});