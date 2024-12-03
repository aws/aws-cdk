import { describeDeprecated } from '@aws-cdk/cdk-build-tools';
import * as sns from '../../../aws-sns';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
import * as tasks from '../../lib';

describeDeprecated('PublishToTopic', () => {
  test('Publish literal message to SNS topic', () => {
  // GIVEN
    const stack = new cdk.Stack();
    const topic = new sns.Topic(stack, 'Topic');

    // WHEN
    const pub = new sfn.Task(stack, 'Publish', {
      task: new tasks.PublishToTopic(topic, {
        message: sfn.TaskInput.fromText('Publish this message'),
      }),
    });

    // THEN
    expect(stack.resolve(pub.toStateJson())).toEqual({
      Type: 'Task',
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::sns:publish',
          ],
        ],
      },
      End: true,
      Parameters: {
        TopicArn: { Ref: 'TopicBFC7AF6E' },
        Message: 'Publish this message',
      },
    });
  });

  test('Publish JSON to SNS topic with task token', () => {
  // GIVEN
    const stack = new cdk.Stack();
    const topic = new sns.Topic(stack, 'Topic');

    // WHEN
    const pub = new sfn.Task(stack, 'Publish', {
      task: new tasks.PublishToTopic(topic, {
        integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN,
        message: sfn.TaskInput.fromObject({
          Input: 'Publish this message',
          Token: sfn.JsonPath.taskToken,
        }),
      }),
    });

    // THEN
    expect(stack.resolve(pub.toStateJson())).toEqual({
      Type: 'Task',
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::sns:publish.waitForTaskToken',
          ],
        ],
      },
      End: true,
      Parameters: {
        TopicArn: { Ref: 'TopicBFC7AF6E' },
        Message: {
          'Input': 'Publish this message',
          'Token.$': '$$.Task.Token',
        },
      },
    });
  });

  test('Task throws if WAIT_FOR_TASK_TOKEN is supplied but task token is not included in message', () => {
    expect(() => {
    // GIVEN
      const stack = new cdk.Stack();
      const topic = new sns.Topic(stack, 'Topic');
      // WHEN
      new sfn.Task(stack, 'Publish', {
        task: new tasks.PublishToTopic(topic, {
          integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN,
          message: sfn.TaskInput.fromText('Publish this message'),
        }),
      });
    // THEN
    }).toThrow(/Task Token is missing in message/i);
  });

  test('Publish to topic with ARN from payload', () => {
  // GIVEN
    const stack = new cdk.Stack();
    const topic = sns.Topic.fromTopicArn(stack, 'Topic', sfn.JsonPath.stringAt('$.topicArn'));

    // WHEN
    const pub = new sfn.Task(stack, 'Publish', {
      task: new tasks.PublishToTopic(topic, {
        message: sfn.TaskInput.fromText('Publish this message'),
      }),
    });

    // THEN
    expect(stack.resolve(pub.toStateJson())).toEqual({
      Type: 'Task',
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::sns:publish',
          ],
        ],
      },
      End: true,
      Parameters: {
        'TopicArn.$': '$.topicArn',
        'Message': 'Publish this message',
      },
    });
  });

  test('Task throws if SYNC is supplied as service integration pattern', () => {
    expect(() => {
      const stack = new cdk.Stack();
      const topic = new sns.Topic(stack, 'Topic');

      new sfn.Task(stack, 'Publish', {
        task: new tasks.PublishToTopic(topic, {
          integrationPattern: sfn.ServiceIntegrationPattern.SYNC,
          message: sfn.TaskInput.fromText('Publish this message'),
        }),
      });
    }).toThrow(/Invalid Service Integration Pattern: SYNC is not supported to call SNS./i);
  });
});
