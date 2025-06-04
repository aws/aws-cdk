import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import * as iam from '../../../aws-iam';
import * as lambda from '../../../aws-lambda';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
import { Stack } from '../../../core';
import { LambdaInvocationType, LambdaInvoke } from '../../lib';

/* eslint-disable quote-props */

describe('LambdaInvoke', () => {
  let stack: Stack;
  let lambdaFunction: lambda.Function;

  beforeEach(() => {
    // GIVEN
    stack = new Stack();
    lambdaFunction = new lambda.Function(stack, 'Fn', {
      code: lambda.Code.fromInline('foo'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
    });
  });

  test('default settings', () => {
    // WHEN
    const task = new LambdaInvoke(stack, 'Task', {
      lambdaFunction,
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
      End: true,
      Type: 'Task',
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::lambda:invoke',
          ],
        ],
      },
      Parameters: {
        FunctionName: {
          'Fn::GetAtt': [
            'Fn9270CBC0',
            'Arn',
          ],
        },
        'Payload.$': '$',
      },
      Retry: [
        {
          ErrorEquals: [
            'Lambda.ClientExecutionTimeoutException',
            'Lambda.ServiceException',
            'Lambda.AWSLambdaException',
            'Lambda.SdkClientException',
          ],
          IntervalSeconds: 2,
          MaxAttempts: 6,
          BackoffRate: 2,
        },
      ],
    });
  });

  test('default settings - using JSONata', () => {
  // WHEN
    const task = LambdaInvoke.jsonata(stack, 'Task', {
      lambdaFunction,
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
      End: true,
      Type: 'Task',
      QueryLanguage: 'JSONata',
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::lambda:invoke',
          ],
        ],
      },
      Arguments: {
        FunctionName: {
          'Fn::GetAtt': [
            'Fn9270CBC0',
            'Arn',
          ],
        },
        'Payload': '{% $states.input %}',
      },
      Retry: [
        {
          ErrorEquals: [
            'Lambda.ClientExecutionTimeoutException',
            'Lambda.ServiceException',
            'Lambda.AWSLambdaException',
            'Lambda.SdkClientException',
          ],
          IntervalSeconds: 2,
          MaxAttempts: 6,
          BackoffRate: 2,
        },
      ],
    });
  });

  testDeprecated('optional settings', () => {
    // WHEN
    const task = new LambdaInvoke(stack, 'Task', {
      lambdaFunction,
      payload: sfn.TaskInput.fromObject({
        foo: 'bar',
      }),
      invocationType: LambdaInvocationType.REQUEST_RESPONSE,
      clientContext: 'eyJoZWxsbyI6IndvcmxkIn0=',
      qualifier: '1',
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual(expect.objectContaining({
      Type: 'Task',
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::lambda:invoke',
          ],
        ],
      },
      End: true,
      Parameters: {
        FunctionName: {
          'Fn::GetAtt': [
            'Fn9270CBC0',
            'Arn',
          ],
        },
        Payload: {
          foo: 'bar',
        },
        InvocationType: 'RequestResponse',
        ClientContext: 'eyJoZWxsbyI6IndvcmxkIn0=',
        Qualifier: '1',
      },
    }));
  });

  test('resultSelector', () => {
    // WHEN
    const task = new LambdaInvoke(stack, 'Task', {
      lambdaFunction,
      resultSelector: {
        Result: sfn.JsonPath.stringAt('$.output.Payload'),
      },
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual(expect.objectContaining({
      Type: 'Task',
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::lambda:invoke',
          ],
        ],
      },
      End: true,
      Parameters: {
        FunctionName: {
          'Fn::GetAtt': [
            'Fn9270CBC0',
            'Arn',
          ],
        },
        'Payload.$': '$',
      },
      ResultSelector: {
        'Result.$': '$.output.Payload',
      },
      Retry: [
        {
          ErrorEquals: [
            'Lambda.ClientExecutionTimeoutException',
            'Lambda.ServiceException',
            'Lambda.AWSLambdaException',
            'Lambda.SdkClientException',
          ],
          IntervalSeconds: 2,
          MaxAttempts: 6,
          BackoffRate: 2,
        },
      ],
    }));
  });

  testDeprecated('invoke Lambda function and wait for task token', () => {
    // GIVEN
    const task = new LambdaInvoke(stack, 'Task', {
      lambdaFunction,
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      payload: sfn.TaskInput.fromObject({
        token: sfn.JsonPath.taskToken,
      }),
      qualifier: 'my-alias',
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual(expect.objectContaining({
      Type: 'Task',
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::lambda:invoke.waitForTaskToken',
          ],
        ],
      },
      End: true,
      Parameters: {
        FunctionName: {
          'Fn::GetAtt': [
            'Fn9270CBC0',
            'Arn',
          ],
        },
        Payload: {
          'token.$': '$$.Task.Token',
        },
        Qualifier: 'my-alias',
      },
    }));
  });

  test('pass part of state input as input to Lambda function ', () => {
    // WHEN
    const task = new LambdaInvoke(stack, 'Task', {
      lambdaFunction,
      payload: sfn.TaskInput.fromJsonPathAt('$.foo'),
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual(expect.objectContaining({
      Type: 'Task',
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::lambda:invoke',
          ],
        ],
      },
      End: true,
      Parameters: {
        'FunctionName': {
          'Fn::GetAtt': [
            'Fn9270CBC0',
            'Arn',
          ],
        },
        'Payload.$': '$.foo',
      },
    }));
  });

  test('Invoke lambda with payloadResponseOnly', () => {
    // WHEN
    const task = new LambdaInvoke(stack, 'Task', {
      lambdaFunction,
      payloadResponseOnly: true,
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual(expect.objectContaining({
      End: true,
      Type: 'Task',
      Resource: {
        'Fn::GetAtt': [
          'Fn9270CBC0',
          'Arn',
        ],
      },
    }));
  });

  test('Invoke lambda with payloadResponseOnly with payload', () => {
    // WHEN
    const task = new LambdaInvoke(stack, 'Task', {
      lambdaFunction,
      payloadResponseOnly: true,
      payload: sfn.TaskInput.fromObject({
        foo: 'bar',
      }),
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual(expect.objectContaining({
      End: true,
      Type: 'Task',
      Resource: {
        'Fn::GetAtt': [
          'Fn9270CBC0',
          'Arn',
        ],
      },
      Parameters: {
        foo: 'bar',
      },
    }));
  });

  test('with retryOnServiceExceptions set to false', () => {
    // WHEN
    const task = new LambdaInvoke(stack, 'Task', {
      lambdaFunction,
      retryOnServiceExceptions: false,
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
      End: true,
      Type: 'Task',
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::lambda:invoke',
          ],
        ],
      },
      Parameters: {
        FunctionName: {
          'Fn::GetAtt': [
            'Fn9270CBC0',
            'Arn',
          ],
        },
        'Payload.$': '$',
      },
    });
  });

  test('with feature flag enabled, grants permissions to all versions of the Lambda function', () => {
    const flags = { isEnabled: () => true };
    jest.spyOn(cdk.FeatureFlags, 'of').mockImplementation(() => flags as any);

    const versionedFunction = lambda.Version.fromVersionArn(
      stack,
      'Version',
      `${lambdaFunction.functionArn}:42`,
    );

    const task = new LambdaInvoke(stack, 'VersionedTask', {
      lambdaFunction: versionedFunction,
    });

    const policies = (task as any).taskPolicies as iam.PolicyStatement[];
    const resources = policies[0].resources;

    expect(resources).toContain(`${lambdaFunction.functionArn}:42`);
    expect(resources).toContain(`${lambdaFunction.functionArn}:*`);
  });

  test('with feature flag disabled, grants permissions only to the specific version', () => {
    const flags = { isEnabled: () => false };
    jest.spyOn(cdk.FeatureFlags, 'of').mockImplementation(() => flags as any);

    const versionedFunction = lambda.Version.fromVersionArn(
      stack,
      'Version',
      `${lambdaFunction.functionArn}:42`,
    );

    const task = new LambdaInvoke(stack, 'VersionedTaskNoFlag', {
      lambdaFunction: versionedFunction,
    });

    const policies = (task as any).taskPolicies as iam.PolicyStatement[];
    const resources = policies[0].resources;

    expect(resources).toContain(`${lambdaFunction.functionArn}:42`);
    expect(resources).not.toContain(`${lambdaFunction.functionArn}:*`);
    expect(resources.length).toBe(1);
  });

  test('with feature flag enabled, grants permissions to all versions when using non-versioned Lambda function', () => {
    const flags = { isEnabled: () => true };
    jest.spyOn(cdk.FeatureFlags, 'of').mockImplementation(() => flags as any);

    const task = new LambdaInvoke(stack, 'RegularTask', {
      lambdaFunction: lambdaFunction,
    });

    const policies = (task as any).taskPolicies as iam.PolicyStatement[];
    const resources = policies[0].resources;

    expect(resources).toContain(lambdaFunction.functionArn);
    expect(resources).toContain(`${lambdaFunction.functionArn}:*`);
  });

  test('fails when integrationPattern used with payloadResponseOnly', () => {
    expect(() => {
      new LambdaInvoke(stack, 'Task', {
        lambdaFunction,
        payloadResponseOnly: true,
        integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
        payload: sfn.TaskInput.fromObject({
          token: sfn.JsonPath.taskToken,
        }),
      });
    }).toThrow(/The 'payloadResponseOnly' property cannot be used if 'integrationPattern', 'invocationType', 'clientContext', or 'qualifier' are specified./);
  });

  test('fails when invocationType used with payloadResponseOnly', () => {
    expect(() => {
      new LambdaInvoke(stack, 'Task', {
        lambdaFunction,
        payloadResponseOnly: true,
        payload: sfn.TaskInput.fromObject({
          foo: 'bar',
        }),
        invocationType: LambdaInvocationType.REQUEST_RESPONSE,
      });
    }).toThrow(/The 'payloadResponseOnly' property cannot be used if 'integrationPattern', 'invocationType', 'clientContext', or 'qualifier' are specified./);
  });

  test('fails when clientContext used with payloadResponseOnly', () => {
    expect(() => {
      new LambdaInvoke(stack, 'Task', {
        lambdaFunction,
        payloadResponseOnly: true,
        payload: sfn.TaskInput.fromObject({
          foo: 'bar',
        }),
        clientContext: 'eyJoZWxsbyI6IndvcmxkIn0=',
      });
    }).toThrow(/The 'payloadResponseOnly' property cannot be used if 'integrationPattern', 'invocationType', 'clientContext', or 'qualifier' are specified./);
  });

  testDeprecated('fails when qualifier used with payloadResponseOnly', () => {
    expect(() => {
      new LambdaInvoke(stack, 'Task', {
        lambdaFunction,
        payloadResponseOnly: true,
        payload: sfn.TaskInput.fromObject({
          foo: 'bar',
        }),
        qualifier: '1',
      });
    }).toThrow(/The 'payloadResponseOnly' property cannot be used if 'integrationPattern', 'invocationType', 'clientContext', or 'qualifier' are specified./);
  });

  test('fails when WAIT_FOR_TASK_TOKEN integration pattern is used without supplying a task token in payload', () => {
    expect(() => {
      new LambdaInvoke(stack, 'Task', {
        lambdaFunction,
        integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      });
    }).toThrow(/Task Token is required in `payload` for callback. Use JsonPath.taskToken to set the token./);
  });

  test('fails when RUN_JOB integration pattern is used', () => {
    expect(() => {
      new LambdaInvoke(stack, 'Task', {
        lambdaFunction,
        integrationPattern: sfn.IntegrationPattern.RUN_JOB,
      });
    }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE,WAIT_FOR_TASK_TOKEN. Received: RUN_JOB/);
  });
});
