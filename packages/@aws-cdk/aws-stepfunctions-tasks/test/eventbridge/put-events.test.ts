import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

test('Publish literal event on EventBridge', () => {
  // Given
  const stack = new cdk.Stack();

  // When
  const task = new tasks.EventBridgePutEvent(stack, 'PutEvent', {
    entries: [
      sfn.TaskInput.fromObject({
        Detail: { Message: 'Hello from Step Functions' },
        DetailType: 'MyDetailType',
        EventBusName: 'MyEventBusName',
        Source: 'MySource',
      }),
      sfn.TaskInput.fromObject({
        Detail: { Message: sfn.TaskInput.fromDataAt('$.input.message') },
        DetailType: 'MyDetailType',
        EventBusName: 'MyEventBusName',
        Source: 'MySource',
      }),
    ],
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::events:putEvents',
        ],
      ],
    },
    End: true,
    Parameters: {
      Entries: [
        {
          Detail: { Message: 'Hello from Step Functions' },
          DetailType: 'MyDetailType',
          EventBusName: 'MyEventBusName',
          Source: 'MySource',
        },
        {
          Detail: { 'Message.$': '$.input.message' },
          DetailType: 'MyDetailType',
          EventBusName: 'MyEventBusName',
          Source: 'MySource',
        },
      ],
    },
  });
});

test('put event and wait for task token', () => {
  // GIVEN
  const stack = new cdk.Stack();

  const task = new tasks.EventBridgePutEvent(stack, 'Publish', {
    integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    entries: [
      sfn.TaskInput.fromObject({
        Detail: { Message: sfn.JsonPath.taskToken },
        DetailType: 'MyDetailType',
        EventBusName: 'MyEventBusName',
        Source: 'MySource',
      }),
    ],
  });
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::events:putEvents.waitForTaskToken',
        ],
      ],
    },
    End: true,
    Parameters: {
      Entries: [
        {
          Detail: { 'Message.$': '$$.Task.Token' },
          DetailType: 'MyDetailType',
          EventBusName: 'MyEventBusName',
          Source: 'MySource',
        },
      ],
    },
  });
});
test('fails when WAIT_FOR_TASK_TOKEN integration pattern is used without supplying a task token in message', () => {
  // GIVEN
  const stack = new cdk.Stack();

  expect(() => {
    // WHEN
    new tasks.EventBridgePutEvent(stack, 'Publish', {
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      entries: [
        sfn.TaskInput.fromObject({
          Detail: { Message: sfn.JsonPath.entirePayload },
          DetailType: 'MyDetailType',
          EventBusName: 'MyEventBusName',
          Source: 'MySource',
        }),
      ],
    });
    // THEN
  }).toThrow(/Task Token is required in `message` Use JsonPath.taskToken to set the token./);
});
