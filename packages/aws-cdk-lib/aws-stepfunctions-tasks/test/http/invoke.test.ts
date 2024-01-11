import { Stack } from '../../../core';
import * as lib from '../../lib';

let stack: Stack;
const connectionArn =
'arn:aws:events:us-test-1:123456789012:connection/connectionName';

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
  });

  test('invoke with default props', () => {
    const task = new lib.HttpInvoke(stack, 'Task', {
      apiEndpoint: 'https://api.example.com',
      connectionArn,
      method: 'POST',
    });

    expectTaskWithParameters(task, {
      ApiEndpoint: 'https://api.example.com',
      Authentication: {
        ConnectionArn: connectionArn,
      },
      Method: 'POST',
    });
  });

  test('invoke with request body', () => {
    const task = new lib.HttpInvoke(stack, 'Task', {
      apiEndpoint: 'https://api.example.com',
      body: JSON.stringify({ foo: 'bar' }),
      connectionArn,
      method: 'POST',
    });

    expectTaskWithParameters(task, {
      ApiEndpoint: 'https://api.example.com',
      Authentication: {
        ConnectionArn: connectionArn,
      },
      Method: 'POST',
      RequestBody: JSON.stringify({ foo: 'bar' }),
    });
  });

  test('invoke with headers', () => {
    const task = new lib.HttpInvoke(stack, 'Task', {
      apiEndpoint: 'https://api.example.com',
      connectionArn,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    expectTaskWithParameters(task, {
      ApiEndpoint: 'https://api.example.com',
      Authentication: {
        ConnectionArn: connectionArn,
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
      connectionArn,
      method: 'POST',
      queryStringParameters: {
        foo: 'bar',
      },
    });

    expectTaskWithParameters(task, {
      ApiEndpoint: 'https://api.example.com',
      Authentication: {
        ConnectionArn: connectionArn,
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
      connectionArn,
      urlEncodeBody: true,
    });

    expectTaskWithParameters(task, {
      ApiEndpoint: 'https://api.example.com',
      Authentication: {
        ConnectionArn: connectionArn,
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
      connectionArn,
      method: 'POST',
      urlEncodeBody: true,
    });

    expectTaskWithParameters(task, {
      ApiEndpoint: 'https://api.example.com',
      Authentication: {
        ConnectionArn: connectionArn,
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
