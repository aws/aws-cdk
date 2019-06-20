import sns = require('@aws-cdk/aws-sns');
import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/cdk');
import tasks = require('../lib');

test('publish to SNS', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topic = new sns.Topic(stack, 'Topic');

  // WHEN
  const pub = new sfn.Task(stack, 'Publish', { task: new tasks.PublishToTopic(topic, {
    message: sfn.TaskInput.fromText('Send this message')
  }) });

  // THEN
  expect(stack.resolve(pub.toStateJson())).toEqual({
    Type: 'Task',
    Resource: 'arn:aws:states:::sns:publish',
    End: true,
    Parameters: {
      TopicArn: { Ref: 'TopicBFC7AF6E' },
      Message: 'Send this message'
    },
  });
});

test('publish to topic with ARN from payload', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topic = sns.Topic.fromTopicArn(stack, 'Topic', sfn.Data.stringAt('$.topicArn'));

  // WHEN
  const pub = new sfn.Task(stack, 'Publish', { task: new tasks.PublishToTopic(topic, {
    message: sfn.TaskInput.fromText('Send this message')
  }) });

  // THEN
  expect(stack.resolve(pub.toStateJson())).toEqual({
    Type: 'Task',
    Resource: 'arn:aws:states:::sns:publish',
    End: true,
    Parameters: {
      'TopicArn.$': '$.topicArn',
      'Message': 'Send this message'
    },
  });
});

test('publish JSON to SNS', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topic = new sns.Topic(stack, 'Topic');

  // WHEN
  const pub = new sfn.Task(stack, 'Publish', { task: new tasks.PublishToTopic(topic, {
    message: sfn.TaskInput.fromObject({
      Input: 'Send this message'
    })
  }) });

  // THEN
  expect(stack.resolve(pub.toStateJson())).toEqual({
    Type: 'Task',
    Resource: 'arn:aws:states:::sns:publish',
    End: true,
    Parameters: {
      TopicArn: { Ref: 'TopicBFC7AF6E' },
      Message: {
        Input: 'Send this message'
      }
    },
  });
});
