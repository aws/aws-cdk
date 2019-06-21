import sns = require('@aws-cdk/aws-sns');
import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/cdk');
import tasks = require('../lib');

test('Publish literal message to SNS topic', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topic = new sns.Topic(stack, 'Topic');

  // WHEN
  const pub = new sfn.Task(stack, 'Publish', { task: new tasks.PublishToTopic(topic, {
    message: sfn.TaskInput.fromText('Publish this message')
  }) });

  // THEN
  expect(stack.resolve(pub.toStateJson())).toEqual({
    Type: 'Task',
    Resource: 'arn:aws:states:::sns:publish',
    End: true,
    Parameters: {
      TopicArn: { Ref: 'TopicBFC7AF6E' },
      Message: 'Publish this message'
    },
  });
});

test('Publish JSON to SNS topic with task token', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topic = new sns.Topic(stack, 'Topic');

  // WHEN
  const pub = new sfn.Task(stack, 'Publish', { task: new tasks.PublishToTopic(topic, {
    waitForTaskToken: true,
    message: sfn.TaskInput.fromObject({
      Input: 'Publish this message',
      Token: sfn.Context.taskToken
    })
  }) });

  // THEN
  expect(stack.resolve(pub.toStateJson())).toEqual({
    Type: 'Task',
    Resource: 'arn:aws:states:::sns:publish.waitForTaskToken',
    End: true,
    Parameters: {
      TopicArn: { Ref: 'TopicBFC7AF6E' },
      Message: {
        'Input': 'Publish this message',
        'Token.$': '$$.Task.Token'
      }
    },
  });
});

test('Task throws if waitForTaskToken is supplied but task token is not included in message', () => {
  expect(() => {
    // GIVEN
    const stack = new cdk.Stack();
    const topic = new sns.Topic(stack, 'Topic');
    // WHEN
    new sfn.Task(stack, 'Publish', { task: new tasks.PublishToTopic(topic, {
      waitForTaskToken: true,
      message: sfn.TaskInput.fromText('Publish this message')
    }) });
    // THEN
  }).toThrow(/Task Token is missing in message/i);
});

test('Publish to topic with ARN from payload', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topic = sns.Topic.fromTopicArn(stack, 'Topic', sfn.Data.stringAt('$.topicArn'));

  // WHEN
  const pub = new sfn.Task(stack, 'Publish', { task: new tasks.PublishToTopic(topic, {
    message: sfn.TaskInput.fromText('Publish this message')
  }) });

  // THEN
  expect(stack.resolve(pub.toStateJson())).toEqual({
    Type: 'Task',
    Resource: 'arn:aws:states:::sns:publish',
    End: true,
    Parameters: {
      'TopicArn.$': '$.topicArn',
      'Message': 'Publish this message'
    },
  });
});
