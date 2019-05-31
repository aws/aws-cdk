import sqs = require('@aws-cdk/aws-sqs');
import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/cdk');
import tasks = require('../lib');

let stack: cdk.Stack;
let queue: sqs.Queue;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
  queue = new sqs.Queue(stack, 'Queue');
});

test('publish to queue', () => {
  // WHEN
  const pub = new sfn.Task(stack, 'Send', { task: new tasks.SendToQueue(queue, {
    message: 'Send this message',
    messageDeduplicationId: sfn.DataField.fromStringAt('$.deduping'),
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

test('message body can come from state', () => {
  // WHEN
  const pub = new sfn.Task(stack, 'Send', {
    task: new tasks.SendToQueue(queue, {
      message: sfn.DataField.fromStringAt('$.theMessage')
    })
  });

  // THEN
  expect(stack.node.resolve(pub.toStateJson())).toEqual({
    Type: 'Task',
    Resource: 'arn:aws:states:::sqs:sendMessage',
    End: true,
    Parameters: {
      'QueueUrl': { Ref: 'Queue4A7E3555' },
      'MessageBody.$': '$.theMessage',
    },
  });
});

test('message body can be an object', () => {
  // WHEN
  const pub = new sfn.Task(stack, 'Send', {
    task: new tasks.SendToQueue(queue, {
      messageObject: {
        literal: 'literal',
        SomeInput: sfn.DataField.fromStringAt('$.theMessage')
      }
    })
  });

  // THEN
  expect(stack.node.resolve(pub.toStateJson())).toEqual({
    Type: 'Task',
    Resource: 'arn:aws:states:::sqs:sendMessage',
    End: true,
    Parameters: {
      QueueUrl: { Ref: 'Queue4A7E3555' },
      MessageBody: {
        'literal': 'literal',
        'SomeInput.$': '$.theMessage',
      }
    },
  });
});

test('message body object can contain references', () => {
  // WHEN
  const pub = new sfn.Task(stack, 'Send', {
    task: new tasks.SendToQueue(queue, {
      messageObject: {
        queueArn: queue.queueArn
      }
    })
  });

  // THEN
  expect(stack.node.resolve(pub.toStateJson())).toEqual({
    Type: 'Task',
    Resource: 'arn:aws:states:::sqs:sendMessage',
    End: true,
    Parameters: {
      QueueUrl: { Ref: 'Queue4A7E3555' },
      MessageBody: {
        queueArn: { 'Fn::GetAtt': ['Queue4A7E3555', 'Arn'] }
      }
    },
  });
});