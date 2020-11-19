import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { ApiGatewayInvoke, HttpMethod } from '../../lib/apigateway/invoke';

describe('Invoke API', () => {

  test('default settings', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const task = new ApiGatewayInvoke(stack, 'Invoke', {
      apiEndpoint: 'apiid.execute-api.{region}.amazonaws.com',
      method: HttpMethod.GET,
      stage: 'default',
      path: 'path',
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
            ':states:::apigateway:invoke',
          ],
        ],
      },
      End: true,
      Parameters: {
        ApiEndpoint: 'apiid.execute-api.{region}.amazonaws.com',
        Method: HttpMethod.GET,
        Stage: 'default',
        AuthType: 'NO_AUTH',
        Path: 'path',
      },
    });
  });

  test('Wait for Task Token', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskToken = {
      'TaskToken.$': 'States.Array($$.Task.Token)',
    };

    // WHEN
    const task = new ApiGatewayInvoke(stack, 'Invoke', {
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      apiEndpoint: 'apiid.execute-api.{region}.amazonaws.com',
      method: HttpMethod.GET,
      headers: sfn.TaskInput.fromObject(taskToken),
      stage: 'default',
      path: 'path',
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
            ':states:::apigateway:invoke.waitForTaskToken',
          ],
        ],
      },
      End: true,
      Parameters: {
        ApiEndpoint: 'apiid.execute-api.{region}.amazonaws.com',
        Headers: {
          'TaskToken.$': 'States.Array($$.Task.Token)',
        },
        Method: HttpMethod.GET,
        AuthType: 'NO_AUTH',
        Path: 'path',
        Stage: 'default',
      },
    });
  });

  test('default settings with headers, query parameters and request body', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const requestBody = {
      billId: 'my-new-bill',
    };
    const queryParameters = {
      billId: '123456',
    };
    const header = {
      key: 'value',
    };

    // WHEN
    const task = new ApiGatewayInvoke(stack, 'Invoke', {
      apiEndpoint: 'apiid.execute-api.{region}.amazonaws.com',
      method: HttpMethod.GET,
      stage: 'default',
      path: 'path',
      queryParameters: sfn.TaskInput.fromObject(queryParameters),
      headers: sfn.TaskInput.fromObject(header),
      requestBody: sfn.TaskInput.fromObject(requestBody),
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
            ':states:::apigateway:invoke',
          ],
        ],
      },
      End: true,
      Parameters: {
        ApiEndpoint: 'apiid.execute-api.{region}.amazonaws.com',
        Method: HttpMethod.GET,
        Stage: 'default',
        AuthType: 'NO_AUTH',
        Path: 'path',
        RequestBody: {
          billId: 'my-new-bill',
        },
        QueryParameters: {
          billId: '123456',
        },
        Headers: {
          key: 'value',
        },
      },
    });
  });

  test('default settings with headers and query parameters', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const requestBody = {
      billId: 'my-new-bill',
    };
    const header = {
      key: 'value',
    };

    // WHEN
    const task = new ApiGatewayInvoke(stack, 'Invoke', {
      apiEndpoint: 'apiid.execute-api.{region}.amazonaws.com',
      method: HttpMethod.GET,
      stage: 'default',
      path: 'path',
      headers: sfn.TaskInput.fromObject(header),
      requestBody: sfn.TaskInput.fromObject(requestBody),
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
            ':states:::apigateway:invoke',
          ],
        ],
      },
      End: true,
      Parameters: {
        ApiEndpoint: 'apiid.execute-api.{region}.amazonaws.com',
        Method: HttpMethod.GET,
        Stage: 'default',
        AuthType: 'NO_AUTH',
        Path: 'path',
        RequestBody: {
          billId: 'my-new-bill',
        },
        Headers: {
          key: 'value',
        },
      },
    });
  });

  test('default settings with headers and request body', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const queryParameters = {
      billId: '123456',
    };
    const header = {
      key: 'value',
    };

    // WHEN
    const task = new ApiGatewayInvoke(stack, 'Invoke', {
      apiEndpoint: 'apiid.execute-api.{region}.amazonaws.com',
      method: HttpMethod.GET,
      stage: 'default',
      path: 'path',
      queryParameters: sfn.TaskInput.fromObject(queryParameters),
      headers: sfn.TaskInput.fromObject(header),
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
            ':states:::apigateway:invoke',
          ],
        ],
      },
      End: true,
      Parameters: {
        ApiEndpoint: 'apiid.execute-api.{region}.amazonaws.com',
        Method: HttpMethod.GET,
        Stage: 'default',
        AuthType: 'NO_AUTH',
        Path: 'path',
        QueryParameters: {
          billId: '123456',
        },
        Headers: {
          key: 'value',
        },
      },
    });
  });

  test('default settings with query parameters and request body', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const requestBody = {
      billId: 'my-new-bill',
    };
    const queryParameters = {
      billId: '123456',
    };

    // WHEN
    const task = new ApiGatewayInvoke(stack, 'Invoke', {
      apiEndpoint: 'apiid.execute-api.{region}.amazonaws.com',
      method: HttpMethod.GET,
      stage: 'default',
      path: 'path',
      queryParameters: sfn.TaskInput.fromObject(queryParameters),
      requestBody: sfn.TaskInput.fromObject(requestBody),
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
            ':states:::apigateway:invoke',
          ],
        ],
      },
      End: true,
      Parameters: {
        ApiEndpoint: 'apiid.execute-api.{region}.amazonaws.com',
        Method: HttpMethod.GET,
        Stage: 'default',
        AuthType: 'NO_AUTH',
        Path: 'path',
        RequestBody: {
          billId: 'my-new-bill',
        },
        QueryParameters: {
          billId: '123456',
        },
      },
    });
  });


  test('default settings with request body', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const requestBody = {
      billId: 'my-new-bill',
    };

    // WHEN
    const task = new ApiGatewayInvoke(stack, 'Invoke', {
      apiEndpoint: 'apiid.execute-api.{region}.amazonaws.com',
      method: HttpMethod.GET,
      stage: 'default',
      path: 'path',
      requestBody: sfn.TaskInput.fromObject(requestBody),
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
            ':states:::apigateway:invoke',
          ],
        ],
      },
      End: true,
      Parameters: {
        ApiEndpoint: 'apiid.execute-api.{region}.amazonaws.com',
        Method: HttpMethod.GET,
        Stage: 'default',
        AuthType: 'NO_AUTH',
        Path: 'path',
        RequestBody: {
          billId: 'my-new-bill',
        },
      },
    });
  });

  test('default settings with query parameters', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const queryParameters = {
      billId: '123456',
    };

    // WHEN
    const task = new ApiGatewayInvoke(stack, 'Invoke', {
      apiEndpoint: 'apiid.execute-api.{region}.amazonaws.com',
      method: HttpMethod.GET,
      stage: 'default',
      path: 'path',
      queryParameters: sfn.TaskInput.fromObject(queryParameters),
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
            ':states:::apigateway:invoke',
          ],
        ],
      },
      End: true,
      Parameters: {
        ApiEndpoint: 'apiid.execute-api.{region}.amazonaws.com',
        Method: HttpMethod.GET,
        Stage: 'default',
        AuthType: 'NO_AUTH',
        Path: 'path',
        QueryParameters: {
          billId: '123456',
        },
      },
    });
  });
});