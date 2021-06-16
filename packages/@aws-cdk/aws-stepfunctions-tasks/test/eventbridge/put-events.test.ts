import '@aws-cdk/assert-internal/jest';
import * as events from '@aws-cdk/aws-events';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { EventBridgePutEvents } from '../../lib/eventbridge/put-events';

describe('Put Events', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    // GIVEN
    stack = new cdk.Stack();
  });

  test('provided all parameters', () => {
    // WHEN
    const task = new EventBridgePutEvents(stack, 'PutEvents', {
      entries: [{
        detail: sfn.TaskInput.fromText('MyDetail'),
        detailType: 'MyDetailType',
        resources: ['MyResourceA', 'MyResourceB'],
        source: 'my.source',
        timestamp: 1619711704,
      }],
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
        Entries: [{
          Detail: 'MyDetail',
          DetailType: 'MyDetailType',
          Resources: ['MyResourceA', 'MyResourceB'],
          Source: 'my.source',
          Time: 1619711704,
        }],
      },
    });
  });

  test('provided detail as object', () => {
    // WHEN
    const task = new EventBridgePutEvents(stack, 'PutEvents', {
      entries: [{
        detail: sfn.TaskInput.fromObject({
          Message: 'MyDetailMessage',
        }),
      }],
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
        Entries: [{
          Detail: {
            Message: 'MyDetailMessage',
          },
        }],
      },
    });
  });

  test('wait for task token', () => {
    // WHEN
    const task = new EventBridgePutEvents(stack, 'PutEvents', {
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      entries: [{
        detail: sfn.TaskInput.fromObject({
          Message: 'MyDetailMessage',
          Token: sfn.JsonPath.taskToken,
        }),
      }],
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
            ':states:::events:putEvents.waitForTaskToken',
          ],
        ],
      },
      End: true,
      Parameters: {
        Entries: [{
          Detail: {
            'Message': 'MyDetailMessage',
            'Token.$': '$$.Task.Token',
          },
        }],
      },
    });
  });

  test('fails when WAIT_FOR_TASK_TOKEN integration pattern is used without supplying a task token in entries', () => {
    expect(() => {
      // WHEN
      new EventBridgePutEvents(stack, 'PutEvents', {
        integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
        entries: [{
          detail: sfn.TaskInput.fromText('MyDetail'),
        }],
      });
    // THEN
    }).toThrowError('Task Token is required in `entries`. Use JsonPath.taskToken to set the token.');
  });

  test('fails when RUN_JOB integration pattern is used', () => {
    expect(() => {
      // WHEN
      new EventBridgePutEvents(stack, 'PutEvents', {
        integrationPattern: sfn.IntegrationPattern.RUN_JOB,
        entries: [{}],
      });
    // THEN
    }).toThrowError('Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE,WAIT_FOR_TASK_TOKEN. Received: RUN_JOB');
  });

  test('provided EventBus', () => {
    // GIVEN
    const eventBus = new events.EventBus(stack, 'EventBus');

    // WHEN
    const task = new EventBridgePutEvents(stack, 'PutEvents', {
      entries: [{
        eventBus,
      }],
    });

    expect(task.eventBusArns).toEqual([
      eventBus.eventBusArn,
    ]);

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
        Entries: [{
          EventBusName: {
            'Fn::GetAtt': [
              'EventBus7B8748AA',
              'Arn',
            ],
          },
        }],
      },
    });
  });

  test('provided no EventBus', () => {
    // WHEN
    const task = new EventBridgePutEvents(stack, 'PutEvents', {
      entries: [{}],
    });

    expect(task.eventBusArns.length).toEqual(1);
    const eventBusArnParts: string[] = task.eventBusArns[0].split(':');
    expect(eventBusArnParts.length).toBe(6);
    expect(eventBusArnParts[0]).toEqual('arn');
    expect(eventBusArnParts[2]).toEqual('events');
    expect(eventBusArnParts[5]).toEqual('event-bus/default');

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
        Entries: [{}],
      },
    });
  });

  test('fails when provided an empty array for entries', () => {
    expect(() => {
      // WHEN
      new EventBridgePutEvents(stack, 'PutEvents', {
        entries: [],
      });
    })
      // THEN
      .toThrowError('Value for property `entries` must be a non-empty array.');
  });
});