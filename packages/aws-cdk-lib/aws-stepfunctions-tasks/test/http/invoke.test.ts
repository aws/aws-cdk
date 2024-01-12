import * as events from '../../../aws-events';
import { SecretValue, Stack } from '../../../core';
import * as lib from '../../lib';

let stack: Stack;
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
    stack = new Stack();
    connection = new events.Connection(stack, 'Connection', {
      authorization: events.Authorization.basic('username', SecretValue.unsafePlainText('password')),
      connectionName: 'testConnection',
    });
  });

  test('invoke with default props', () => {
    const task = new lib.HttpInvoke(stack, 'Task', {
      apiEndpoint: 'https://api.example.com',
      connection,
      method: 'POST',
    });

    expectTaskWithParameters(task, {
      ApiEndpoint: 'https://api.example.com',
      Authentication: {
        connection,
      },
      Method: 'POST',
    });
  });

  test('invoke with request body', () => {
    const task = new lib.HttpInvoke(stack, 'Task', {
      apiEndpoint: 'https://api.example.com',
      body: JSON.stringify({ foo: 'bar' }),
      connection,
      method: 'POST',
    });

    expectTaskWithParameters(task, {
      ApiEndpoint: 'https://api.example.com',
      Authentication: {
        connection,
      },
      Method: 'POST',
      RequestBody: JSON.stringify({ foo: 'bar' }),
    });
  });

  test('invoke with headers', () => {
    const task = new lib.HttpInvoke(stack, 'Task', {
      apiEndpoint: 'https://api.example.com',
      connection,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    expectTaskWithParameters(task, {
      ApiEndpoint: 'https://api.example.com',
      Authentication: {
        connection,
      },
      Method: 'POST',
      Headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  test('invoke with query string parameters', () => {
    const task = new lib.HttpInvoke(stack, 'Task', {
      apiEndpoint: 'https://api.example.com',
      connection,
      method: 'POST',
      queryStringParameters: {
        foo: 'bar',
      },
    });

    expectTaskWithParameters(task, {
      ApiEndpoint: 'https://api.example.com',
      Authentication: {
        connection,
      },
      Method: 'POST',
      QueryParameters: {
        foo: 'bar',
      },
    });
  });

  test('invoke with request body encoding and default arrayEncodingFormat', () => {
    const task = new lib.HttpInvoke(stack, 'Task', {
      apiEndpoint: 'https://api.example.com',
      method: 'POST',
      connection,
      urlEncodeBody: true,
    });

    expectTaskWithParameters(task, {
      ApiEndpoint: 'https://api.example.com',
      Authentication: {
        connection,
      },
      Method: 'POST',
      Transform: {
        RequestBodyEncoding: 'URL_ENCODED',
        RequestEncodingOptions: {
          ArrayFormat: lib.URLEncodingArrayFormat.INDICES,
        },
      },
    });
  });

  test('invoke with request body encoding and arrayEncodingFormat', () => {
    const task = new lib.HttpInvoke(stack, 'Task', {
      apiEndpoint: 'https://api.example.com',
      arrayEncodingFormat: lib.URLEncodingArrayFormat.BRACKETS,
      connection,
      method: 'POST',
      urlEncodeBody: true,
    });

    expectTaskWithParameters(task, {
      ApiEndpoint: 'https://api.example.com',
      Authentication: {
        connection,
      },
      Method: 'POST',
      Transform: {
        RequestBodyEncoding: 'URL_ENCODED',
        RequestEncodingOptions: {
          ArrayFormat: lib.URLEncodingArrayFormat.BRACKETS,
        },
      },
    });
  });
});
