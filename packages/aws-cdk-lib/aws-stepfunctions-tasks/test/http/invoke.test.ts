import * as events from '../../../aws-events';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
import * as lib from '../../lib';

let stack: cdk.Stack;
let connection: events.IConnection;

const expectTaskWithParameters = (task: lib.HttpInvoke, parameters: any) => {
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
          ':states:::http:invoke',
        ],
      ],
    },
    End: true,
    Parameters: parameters,
  });
};

describe('AWS::StepFunctions::Tasks::HttpInvoke', () => {
  beforeEach(() => {
    stack = new cdk.Stack();
    connection = new events.Connection(stack, 'Connection', {
      authorization: events.Authorization.basic('username', cdk.SecretValue.unsafePlainText('password')),
      connectionName: 'testConnection',
    });
  });

  test('invoke with default props', () => {
    const task = new lib.HttpInvoke(stack, 'Task', {
      apiRoot: 'https://api.example.com',
      apiEndpoint: sfn.TaskInput.fromText('path/to/resource'),
      connection,
      method: sfn.TaskInput.fromText('POST'),
    });

    expectTaskWithParameters(task, {
      ApiEndpoint: 'https://api.example.com/path/to/resource',
      Authentication: {
        ConnectionArn: stack.resolve(connection.connectionArn),
      },
      Method: 'POST',
    });
  });

  test('invoke with all props', () => {
    const task = new lib.HttpInvoke(stack, 'Task', {
      apiRoot: 'https://api.example.com',
      apiEndpoint: sfn.TaskInput.fromText('path/to/resource'),
      connection,
      headers: sfn.TaskInput.fromObject({
        'custom-header': 'custom-value',
      }),
      method: sfn.TaskInput.fromText('POST'),
      arrayEncodingFormat: lib.ArrayEncodingFormat.BRACKETS,
      urlEncodeBody: true,
      queryStringParameters: sfn.TaskInput.fromObject({
        foo: 'bar',
      }),
    });

    expectTaskWithParameters(task, {
      ApiEndpoint: 'https://api.example.com/path/to/resource',
      Authentication: {
        ConnectionArn: stack.resolve(connection.connectionArn),
      },
      Method: 'POST',
      Headers: {
        'custom-header': 'custom-value',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      Transform: {
        RequestBodyEncoding: 'URL_ENCODED',
        RequestEncodingOptions: {
          ArrayFormat: lib.ArrayEncodingFormat.BRACKETS,
        },
      },
      QueryParameters: {
        foo: 'bar',
      },
    });
  });

  test('invoke with request body encoding and default arrayEncodingFormat', () => {
    const task = new lib.HttpInvoke(stack, 'Task', {
      apiRoot: 'https://api.example.com',
      apiEndpoint: sfn.TaskInput.fromText('path/to/resource'),
      method: sfn.TaskInput.fromText('POST'),
      connection,
      urlEncodeBody: true,
    });

    expectTaskWithParameters(task, {
      ApiEndpoint: 'https://api.example.com/path/to/resource',
      Authentication: {
        ConnectionArn: stack.resolve(connection.connectionArn),
      },
      Method: 'POST',
      Headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      Transform: {
        RequestBodyEncoding: 'URL_ENCODED',
      },
    });
  });
});
